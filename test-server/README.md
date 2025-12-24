# Test Server for Quill Editor TNBT v2

Simple Express backend for testing the Quill Editor package with MongoDB support.

## Setup

### 1. Install Dependencies
```bash
cd test-server
npm install
```

### 2. MongoDB Setup

**Option A: Local MongoDB**
1. Install MongoDB locally: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Create `.env` file (copy from `.env.example`):
```bash
MONGODB_URI=mongodb://localhost:27017/quill-editor-test
PORT=3001
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get connection string
3. Create `.env` file:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quill-editor-test
PORT=3001
```

**Option C: No MongoDB (In-Memory)**
- Server will work without MongoDB using in-memory storage
- Data will be lost on server restart

### 3. Start the Server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will run on `http://localhost:3001`

**Note:** If MongoDB is connected, you'll see `✅ Connected to MongoDB`. Otherwise, it will use in-memory storage.

## API Endpoints

### Health Check
- `GET /api/health` - Check if server is running

### Articles
- `POST /api/articles` - Create a new article
  ```json
  {
    "content": "<p>Article content</p>",
    "title": "Article Title",
    "tags": ["tag1", "tag2"]
  }
  ```

- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get article by ID
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article

### Image Upload
- `POST /api/upload-image` - Upload an image
  - Form data with field name: `image`
  - Returns: `{ success: true, url: "http://localhost:3001/uploads/filename.jpg" }`

### Draft
- `POST /api/articles/draft` - Auto-save draft
  ```json
  {
    "content": "<p>Draft content</p>"
  }
  ```

## Usage Example

```typescript
// In your React component
const handleCreate = async (data) => {
  const response = await fetch('http://localhost:3001/api/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: data.content,
      title: data.metadata?.title,
      tags: data.metadata?.tags,
    }),
  });
  
  const result = await response.json();
  return {
    success: result.success,
    articleId: result.articleId,
    message: result.message,
  };
};

const handleImageUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch('http://localhost:3001/api/upload-image', {
    method: 'POST',
    body: formData,
  });
  
  const { url } = await response.json();
  return url;
};
```

## MongoDB Schema

The Article model has the following structure:
```javascript
{
  content: String (required),
  title: String (default: 'Untitled'),
  tags: [String] (default: []),
  metadata: Object (default: {}),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Notes

- **With MongoDB**: Articles are persisted in the database
- **Without MongoDB**: Articles are stored in memory (lost on restart)
- Images are saved to `test-server/uploads/` directory
- The server automatically falls back to in-memory storage if MongoDB is not available

