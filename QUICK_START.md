# Quick Start Guide

## ✅ Steps 1-3 Completed!

I've successfully implemented:
1. ✅ Type definitions
2. ✅ Wrapper component (`QuillEditorTNBT`)
3. ✅ Refactored `MainEditorForCreate` to accept new props
4. ✅ Package configuration
5. ✅ Express test backend

## 🚀 How to Test

### Option 1: Test with Express Backend

1. **Start the test server:**
```bash
cd test-server
npm install
npm start
```
Server will run on `http://localhost:3001`

2. **Use the test component:**
```typescript
import TestEditor from './src/examples/TestEditor';

// In your App.tsx or wherever
<TestEditor />
```

### Option 2: Use in Your Own Component

```typescript
import { QuillEditorTNBT, QuillEditorRef } from './src/index';
import { useRef } from 'react';

function MyEditor() {
  const editorRef = useRef<QuillEditorRef>(null);
  const [content, setContent] = useState('');

  const handleCreate = async (data) => {
    const response = await fetch('http://localhost:3001/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: data.content,
        title: data.metadata?.title,
      }),
    });
    
    const result = await response.json();
    return {
      success: result.success,
      articleId: result.articleId,
      message: 'Article created!',
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

  return (
    <QuillEditorTNBT
      ref={editorRef}
      value={content}
      onChange={setContent}
      onCreate={handleCreate}
      onImageUpload={handleImageUpload}
      articleMetadata={{
        title: 'My Article',
        tags: ['tech'],
      }}
    />
  );
}
```

## 📦 Build the Package

To build the library for distribution:

```bash
# Install dependencies (including vite-plugin-dts)
npm install

# Build the library
npm run build:lib
```

The built files will be in `dist/`:
- `dist/index.js` - ES module
- `dist/index.cjs` - CommonJS
- `dist/index.d.ts` - TypeScript definitions

## 🔧 Express Backend API

The test server provides these endpoints:

- `POST /api/articles` - Create article
- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get article by ID
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article
- `POST /api/upload-image` - Upload image
- `POST /api/articles/draft` - Auto-save draft

See `test-server/README.md` for details.

## 📝 Key Changes

### Before (Old API):
```typescript
<MainEditorForCreate
  ref={editorRef}
  documentValue={content}
  setDocumentValue={setContent}
/>

// Save via ref
await editorRef.current.handleStore_In_Mongodb(title, tags, image);
```

### After (New API):
```typescript
<QuillEditorTNBT
  ref={editorRef}
  value={content}
  onChange={setContent}
  onCreate={async (data) => {
    // Your custom save logic - works with ANY backend!
    return { success: true, articleId: '123' };
  }}
  onImageUpload={async (file) => {
    // Your image upload logic
    return 'https://example.com/image.jpg';
  }}
/>
```

## 🎯 What's Next?

1. **Test the implementation** with the Express backend
2. **Customize** the callbacks for your backend
3. **Build the package** when ready
4. **Publish to npm** (when ready)

## 📚 Documentation

- `PACKAGE_API_DESIGN.md` - Complete API specification
- `IMPLEMENTATION_GUIDE.md` - Implementation details
- `USAGE_EXAMPLES.md` - More usage examples
- `test-server/README.md` - Backend API docs

## ⚠️ Important Notes

1. The Express backend is **for testing only**. Replace with your actual backend in production.

2. React is now a **peer dependency**. Make sure your project has React installed.

3. The package uses **callback-based architecture** - you provide the save/upload logic, the editor handles the UI.

4. All TypeScript types are exported from the package for full type safety.

