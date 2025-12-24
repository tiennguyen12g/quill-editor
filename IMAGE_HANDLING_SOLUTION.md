# Image Handling Solution

## Problem
When images are inserted into the Quill editor, they're stored as base64 data URLs in the HTML content. When saving articles, the entire HTML with embedded base64 images is sent to the server, which can exceed Express's default body size limit (100kb), causing a `413 Payload Too Large` error.

## Solution

We've implemented a **two-part solution**:

### 1. Quick Fix: Increased Body Size Limit
The Express server now accepts larger payloads (50MB) to handle base64 images temporarily.

**File:** `test-server/server.js`
```javascript
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
```

### 2. Better Solution: Image Processing Before Save
Before saving articles, we extract base64 images, upload them to the server, and replace the base64 data URLs with server URLs.

**File:** `src/utils/imageProcessor.ts`
- `processImagesInContent()` - Extracts and uploads base64 images
- `extractImageUrls()` - Gets all image URLs from content
- `hasBase64Images()` - Checks if content has base64 images

**File:** `src/examples/TestEditor.tsx`
- Updated `handleCreate()` and `handleUpdate()` to process images before saving

## How It Works

1. **User inserts image** → Image is stored as base64 data URL in HTML
2. **User clicks "Create Article"** → `handleCreate()` is called
3. **Image processing** → `processImagesInContent()`:
   - Finds all base64 images in HTML
   - Converts each base64 to a File object
   - Uploads each image via `handleImageUpload()`
   - Replaces base64 URLs with server URLs
4. **Save article** → Article is saved with server URLs instead of base64

## Benefits

✅ **Smaller payloads** - Server URLs are much smaller than base64 data
✅ **Better performance** - Faster uploads and saves
✅ **Scalable** - Works with any number of images
✅ **Fallback** - If upload fails, keeps base64 image

## Usage

The solution is already integrated into `TestEditor.tsx`. For your own implementation:

```typescript
import { processImagesInContent } from './utils/imageProcessor';

const handleCreate = async (data: any) => {
  // Process images before saving
  const processedContent = await processImagesInContent(
    data.content,
    handleImageUpload  // Your upload function
  );
  
  // Now save with processed content (server URLs instead of base64)
  const response = await fetch('/api/articles', {
    method: 'POST',
    body: JSON.stringify({ content: processedContent }),
  });
  
  return { success: true };
};
```

## Alternative: Process Images on Server

If you prefer to process images on the server side:

1. Keep the increased body size limit
2. Create a server endpoint that processes images:
```javascript
app.post('/api/articles/process-images', async (req, res) => {
  const { content } = req.body;
  // Extract base64 images, upload them, replace URLs
  const processedContent = await processImages(content);
  res.json({ processedContent });
});
```

## Notes

- Auto-save still uses base64 (for speed). Images are processed on final save.
- If image upload fails, the base64 image is kept in the content.
- The utility functions are reusable across your application.

