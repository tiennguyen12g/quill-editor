# Examples

This folder contains example components demonstrating how to use Quill Editor TNBT v2.

## Available Examples

### 1. TestEditor.tsx
**Route:** `/article/test`

Basic example for creating articles:
- Create new articles
- Upload images
- Auto-save functionality
- Validation and stats

### 2. EditArticleExample.tsx
**Route:** `/article/edit`

Complete example for editing articles:
- Load all articles from server
- Display article list
- Edit articles with "Edit" button
- Update articles
- Delete articles
- Image processing

### 3. CreateArticle.tsx
**Route:** `/article/quill`

Original create article component (legacy).

## Usage

1. Start the test server:
```bash
cd test-server
npm install
npm start
```

2. Start the dev server:
```bash
npm run dev
```

3. Navigate to:
   - `http://localhost:5125/article/test` - Create articles
   - `http://localhost:5125/article/edit` - Edit articles

## Testing Edit Feature

1. First, create some articles using `/article/test`
2. Then navigate to `/article/edit`
3. Click "Edit" on any article
4. Make changes and click "Save Changes"
5. Article will be updated in the database

## Features Demonstrated

- ✅ Create articles
- ✅ Edit articles
- ✅ Delete articles
- ✅ Image upload and processing
- ✅ Auto-save drafts
- ✅ Validation
- ✅ Error handling
- ✅ Success notifications

