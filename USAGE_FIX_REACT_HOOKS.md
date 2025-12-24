# Fix: React Hooks Error When Using Package

## ✅ Fix Applied

The package has been fixed to properly externalize React. The changes:

1. **Moved React/React-DOM to devDependencies** (only needed for development)
2. **Kept React/React-DOM in peerDependencies** (consumers must provide)
3. **Removed react-router-dom from dependencies** (only used in examples)
4. **Enhanced Vite externalization** to catch all React imports

## 🔧 Steps to Fix in Your Project

### Step 1: Rebuild the Package (Already Done)

The package has been rebuilt with the fix. If you're using a local version:

```bash
cd quill-editor-tnbt-v2
npm run build:lib
```

### Step 2: Reinstall in Your Project

```bash
# In your project directory
npm uninstall @tnbt/quill-editor

# If using local package:
npm install /path/to/quill-editor-tnbt-v2

# OR if published to npm:
npm install @tnbt/quill-editor@latest
```

### Step 3: Verify React Versions

Make sure your project has React installed:

```bash
npm list react react-dom
```

You should see React ^18.0.0 installed in your project.

### Step 4: Import CSS (Important!)

The package requires CSS to be imported. Add this to your main file (e.g., `main.tsx` or `App.tsx`):

```tsx
import '@tnbt/quill-editor/styles';
// OR if the export path is different:
import '@tnbt/quill-editor/dist/style.css';
```

### Step 5: Clear Cache and Reinstall

If the error persists:

```bash
# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Restart dev server
npm run dev
```

## 📝 Correct Usage Example

```tsx
import React, { useState, useRef } from "react";
import { 
  QuillEditorTNBT_DefaultCss, 
  type QuillEditorRef,
  processImagesInContent 
} from "@tnbt/quill-editor";
import "@tnbt/quill-editor/styles"; // ← IMPORTANT: Import CSS!

const API_BASE_URL = "http://localhost:3001";

export default function QuillEditorUsage() {
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const editorRef = useRef<QuillEditorRef>(null);

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data = await response.json();
    return data.url;
  };

  const handleCreate = async (data: any) => {
    try {
      // Process images before sending
      const processedContent = await processImagesInContent(
        data.content,
        handleImageUpload
      );

      const response = await fetch(`${API_BASE_URL}/api/articles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: processedContent,
          title: data.metadata?.title || "Untitled",
          tags: data.metadata?.tags || [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create article");
      }

      const result = await response.json();
      return {
        success: true,
        articleId: result.id || result._id,
        message: "Article created successfully!",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Create failed",
      };
    }
  };

  const handleUpdate = async (data: any, articleId: string) => {
    try {
      // Process images before sending
      const processedContent = await processImagesInContent(
        data.content,
        handleImageUpload
      );

      const response = await fetch(`${API_BASE_URL}/api/articles/${articleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: processedContent,
          title: data.metadata?.title,
          tags: data.metadata?.tags,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update article");
      }

      return {
        success: true,
        message: "Article updated successfully!",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Update failed",
      };
    }
  };

  const handleAutoSave = async (data: any) => {
    // Auto-save implementation
    console.log("Auto-saving...", data);
  };

  const handleSuccess = (message: string) => {
    setMessage(`✅ ${message}`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleError = (error: any) => {
    setMessage(`❌ Error: ${error.message}`);
    console.error("Editor error:", error);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Quill Editor TNBT v2 - Test Example</h1>

      {message && (
        <div
          style={{
            padding: "10px",
            marginBottom: "20px",
            backgroundColor: message.includes("✅") ? "#d4edda" : "#f8d7da",
            border: `1px solid ${message.includes("✅") ? "#c3e6cb" : "#f5c6cb"}`,
            borderRadius: "4px",
          }}
        >
          {message}
        </div>
      )}

      <QuillEditorTNBT_DefaultCss
        ref={editorRef}
        value={content}
        onChange={setContent}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onImageUpload={handleImageUpload}
        onAutoSave={handleAutoSave}
        autoSave={true}
        autoSaveInterval={30000}
        articleMetadata={{
          title: "Test Article",
          tags: ["test", "example"],
        }}
        onSuccess={handleSuccess}
        onError={handleError}
        placeholder="Start writing your article here..."
        defaultImageWidth={600}
      />
    </div>
  );
}
```

## 🔍 Troubleshooting

### Error: "Invalid hook call"

**Cause**: Multiple React instances or React not properly externalized.

**Solution**:
1. Verify React is in your project's `package.json`:
   ```json
   {
     "dependencies": {
       "react": "^18.0.0",
       "react-dom": "^18.0.0"
     }
   }
   ```

2. Check for duplicate React:
   ```bash
   npm ls react
   ```
   Should show only ONE React instance.

3. Clear and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Error: "Cannot read properties of null (reading 'useState')"

**Cause**: React is null/undefined, usually due to bundling issues.

**Solution**: Same as above - ensure React is properly installed and not bundled.

### Component Not Rendering / Styles Missing

**Solution**: Make sure you import the CSS:
```tsx
import "@tnbt/quill-editor/styles";
```

## ✅ Verification

After applying the fix, you should:
- ✅ No "Invalid hook call" errors
- ✅ Component renders correctly
- ✅ Styles are applied
- ✅ All hooks work (useState, useEffect, etc.)

If issues persist, check:
1. React version compatibility (should be ^18.0.0)
2. No duplicate React in node_modules
3. CSS is imported
4. Package is rebuilt with latest changes

