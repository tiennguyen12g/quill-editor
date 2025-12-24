# MongoDB Setup Guide

## Quick Start

### 1. Install MongoDB (Local)

**Windows:**
1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer
3. MongoDB will start as a Windows service automatically

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 2. Configure Environment

Create a `.env` file in the `test-server` directory:

```bash
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/quill-editor-test
PORT=3001
```

### 3. Install Dependencies & Start

```bash
cd test-server
npm install
npm start
```

You should see:
```
✅ Connected to MongoDB
🚀 Test server running on http://localhost:3001
📦 Database: MongoDB ✅
```

## MongoDB Atlas (Cloud) Setup

### 1. Create Free Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (free tier available)

### 2. Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password

### 3. Configure Environment

Update `.env`:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quill-editor-test
PORT=3001
```

### 4. Network Access
1. In Atlas dashboard, go to "Network Access"
2. Add your IP address or `0.0.0.0/0` for testing (not recommended for production)

## Testing

### Test Create Article
```bash
curl -X POST http://localhost:3001/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "content": "<p>Test article</p>",
    "title": "My First Article",
    "tags": ["test", "example"]
  }'
```

### Test Get All Articles
```bash
curl http://localhost:3001/api/articles
```

### Test Update Article
```bash
curl -X PUT http://localhost:3001/api/articles/ARTICLE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "content": "<p>Updated content</p>",
    "title": "Updated Title"
  }'
```

## Verify MongoDB Connection

### Using MongoDB Shell
```bash
# Connect to database
mongosh mongodb://localhost:27017/quill-editor-test

# List collections
show collections

# Find articles
db.articles.find().pretty()

# Count articles
db.articles.countDocuments()
```

### Using MongoDB Compass (GUI)
1. Download: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. Navigate to `quill-editor-test` database
4. View `articles` collection

## Troubleshooting

### "MongoDB connection error"
- Check if MongoDB is running: `mongosh --eval "db.version()"`
- Verify connection string in `.env`
- Check firewall settings

### "Invalid article ID"
- MongoDB uses ObjectId format (24 hex characters)
- Make sure you're using the `articleId` returned from create endpoint

### "Article not found"
- Check if the article ID exists in database
- Verify MongoDB connection is active

## Fallback Mode

If MongoDB is not available, the server will:
- Use in-memory storage
- Show warning: `⚠️ Server will continue without database`
- Data will be lost on server restart

This allows testing without MongoDB setup.

