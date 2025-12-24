import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Article from './models/Article.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quill-editor-test';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    console.log('⚠️  Server will continue without database (using in-memory storage)');
  });

// Middleware
app.use(cors());
// Increase body size limit to handle base64 images (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory if it doesn't exist
const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded images
app.use('/uploads', express.static(uploadsDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// In-memory storage fallback (if MongoDB is not available)
const articles = new Map();
const useMongoDB = mongoose.connection.readyState === 1;

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Upload image
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: imageUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Create article
app.post('/api/articles', async (req, res) => {
  try {
    const { content, title, tags, metadata } = req.body;

    console.log('📝 Create article request:');
    console.log('  Content type:', typeof content);
    console.log('  Content length:', content?.length || 0);
    console.log('  Content preview:', content?.substring(0, 200) || 'empty');
    console.log('  Title:', title);
    console.log('  Tags:', tags);

    // Check if content exists and is not just whitespace
    if (!content || (typeof content === 'string' && content.trim().length === 0)) {
      console.error('❌ Content is empty or missing');
      return res.status(400).json({ 
        error: 'Content is required', 
        received: { 
          contentType: typeof content,
          contentLength: content?.length || 0,
          contentPreview: content?.substring(0, 50) || 'empty' 
        } 
      });
    }

    // Use MongoDB if connected, otherwise use in-memory storage
    if (mongoose.connection.readyState === 1) {
      const article = new Article({
        content,
        title: title || 'Untitled',
        tags: tags || [],
        metadata: metadata || {},
      });

      const savedArticle = await article.save();

      res.status(201).json({
        success: true,
        articleId: savedArticle._id.toString(),
        message: 'Article created successfully',
        article: {
          id: savedArticle._id.toString(),
          content: savedArticle.content,
          title: savedArticle.title,
          tags: savedArticle.tags,
          metadata: savedArticle.metadata,
          createdAt: savedArticle.createdAt,
          updatedAt: savedArticle.updatedAt,
        },
      });
    } else {
      // Fallback to in-memory storage
      const articleId = uuidv4();
      const article = {
        id: articleId,
        content,
        title: title || 'Untitled',
        tags: tags || [],
        metadata: metadata || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      articles.set(articleId, article);

      res.status(201).json({
        success: true,
        articleId: articleId,
        message: 'Article created successfully (in-memory)',
        article,
      });
    }
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ error: 'Failed to create article', details: error.message });
  }
});

// Get all articles
app.get('/api/articles', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const articlesList = await Article.find().sort({ createdAt: -1 });
      const formattedArticles = articlesList.map(article => ({
        id: article._id.toString(),
        content: article.content,
        title: article.title,
        tags: article.tags,
        metadata: article.metadata,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      }));

      res.json({
        success: true,
        articles: formattedArticles,
        count: formattedArticles.length,
      });
    } else {
      // Fallback to in-memory storage
      const articlesArray = Array.from(articles.values());
      res.json({
        success: true,
        articles: articlesArray,
        count: articlesArray.length,
      });
    }
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ error: 'Failed to get articles', details: error.message });
  }
});

// Get article by ID
app.get('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      // Check if id is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid article ID' });
      }

      const article = await Article.findById(id);

      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }

      res.json({
        success: true,
        article: {
          id: article._id.toString(),
          content: article.content,
          title: article.title,
          tags: article.tags,
          metadata: article.metadata,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
        },
      });
    } else {
      // Fallback to in-memory storage
      const article = articles.get(id);

      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }

      res.json({
        success: true,
        article,
      });
    }
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ error: 'Failed to get article', details: error.message });
  }
});

// Update article
app.put('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, title, tags, metadata } = req.body;

    console.log('📝 Update request received:');
    console.log('  Article ID:', id);
    console.log('  Content length:', content?.length || 0);
    console.log('  Content preview:', content?.substring(0, 100) || 'empty');
    console.log('  Title:', title);
    console.log('  Tags:', tags);

    if (mongoose.connection.readyState === 1) {
      // Check if id is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error('❌ Invalid article ID:', id);
        return res.status(400).json({ error: 'Invalid article ID' });
      }

      // Ensure content is provided
      if (content === undefined || content === null) {
        console.error('❌ Content is required for update');
        return res.status(400).json({ error: 'Content is required for update' });
      }

      console.log('  ✅ Content will be updated, length:', content.length);

      // Build update object
      const updateFields = {
        content: content,
        updatedAt: new Date()
      };
      
      if (title !== undefined) updateFields.title = title;
      if (tags !== undefined) updateFields.tags = tags;
      if (metadata !== undefined) updateFields.metadata = metadata;

      console.log('  Update fields:', Object.keys(updateFields));

      const article = await Article.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true, runValidators: true }
      );

      if (!article) {
        console.error('❌ Article not found:', id);
        return res.status(404).json({ error: 'Article not found' });
      }

      // Verify the update actually persisted
      const verifyArticle = await Article.findById(id);
      if (!verifyArticle) {
        console.error('❌ Failed to verify update - article not found after update');
        return res.status(500).json({ error: 'Update verification failed' });
      }

      console.log('✅ Article updated successfully');
      console.log('  Updated content length:', article.content?.length || 0);
      console.log('  Updated content preview:', article.content?.substring(0, 100));
      console.log('  Verified content length:', verifyArticle.content?.length || 0);
      console.log('  Content matches:', article.content === verifyArticle.content);

      res.json({
        success: true,
        message: 'Article updated successfully',
        article: {
          id: article._id.toString(),
          content: article.content,
          title: article.title,
          tags: article.tags,
          metadata: article.metadata,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
        },
      });
    } else {
      // Fallback to in-memory storage
      const article = articles.get(id);

      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }

      // Update article
      article.content = content !== undefined ? content : article.content;
      article.title = title !== undefined ? title : article.title;
      article.tags = tags !== undefined ? tags : article.tags;
      article.metadata = metadata !== undefined ? metadata : article.metadata;
      article.updatedAt = new Date().toISOString();

      articles.set(id, article);

      res.json({
        success: true,
        message: 'Article updated successfully (in-memory)',
        article,
      });
    }
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ error: 'Failed to update article', details: error.message });
  }
});

// Delete article
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      // Check if id is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid article ID' });
      }

      const article = await Article.findByIdAndDelete(id);

      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }

      res.json({
        success: true,
        message: 'Article deleted successfully',
      });
    } else {
      // Fallback to in-memory storage
      if (!articles.has(id)) {
        return res.status(404).json({ error: 'Article not found' });
      }

      articles.delete(id);

      res.json({
        success: true,
        message: 'Article deleted successfully (in-memory)',
      });
    }
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ error: 'Failed to delete article', details: error.message });
  }
});

// Auto-save draft
app.post('/api/articles/draft', (req, res) => {
  try {
    const { content } = req.body;

    // In a real app, you'd save this to a database with user ID
    // For now, we'll just acknowledge it
    res.json({
      success: true,
      message: 'Draft saved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Save draft error:', error);
    res.status(500).json({ error: 'Failed to save draft' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  console.log(`📦 Database: ${mongoose.connection.readyState === 1 ? 'MongoDB ✅' : 'In-Memory (MongoDB not connected)'}`);
  console.log(`📝 API endpoints:`);
  console.log(`   POST   /api/articles - Create article`);
  console.log(`   GET    /api/articles - Get all articles`);
  console.log(`   GET    /api/articles/:id - Get article by ID`);
  console.log(`   PUT    /api/articles/:id - Update article`);
  console.log(`   DELETE /api/articles/:id - Delete article`);
  console.log(`   POST   /api/upload-image - Upload image`);
  console.log(`   POST   /api/articles/draft - Auto-save draft`);
});

