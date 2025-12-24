# Quill Editor TNBT v2 - Package API Design

## Overview
This document outlines the proposed API design for making `quill-editor-tnbt-v2` a reusable npm package that can be integrated into any website.

## Core Design Principles

1. **Separation of Concerns**: The editor handles UI/UX, the parent handles data persistence
2. **Flexibility**: Support multiple use cases (create, edit, preview)
3. **Type Safety**: Full TypeScript support
4. **Controlled/Uncontrolled**: Support both patterns
5. **Callback-Based**: Use callbacks for all external operations

---

## Proposed Component API

### Main Component: `QuillEditorTNBT`

```typescript
interface QuillEditorTNBTProps {
  // Content Management
  value?: string;                    // Initial HTML content (for editing)
  defaultValue?: string;             // Default content (uncontrolled)
  onChange?: (html: string) => void; // Called on every content change
  onContentChange?: (html: string) => void; // Debounced version (optional)
  
  // Mode Configuration
  mode?: 'create' | 'edit' | 'readonly';
  showPreview?: boolean;             // Show preview mode toggle
  showToolbar?: boolean;             // Show/hide toolbar
  
  // Save/Create/Update Operations
  onSave?: (data: EditorData) => Promise<SaveResult>;
  onCreate?: (data: EditorData) => Promise<CreateResult>;
  onUpdate?: (data: EditorData, articleId: string) => Promise<UpdateResult>;
  
  // Image Handling
  onImageUpload?: (file: File) => Promise<string>; // Upload image, return URL
  imageUploadEndpoint?: string;      // Auto-upload endpoint (optional)
  defaultImageWidth?: number;        // Default width for inserted images
  
  // Article Metadata (for save operations)
  articleMetadata?: {
    title?: string;
    tags?: string[];
    coverImage?: File | string;
    category?: string;
    [key: string]: any;              // Allow custom fields
  };
  
  // Customization
  placeholder?: string;
  height?: string | number;
  maxHeight?: string | number;
  className?: string;
  toolbarConfig?: ToolbarConfig;     // Customize toolbar buttons
  
  // Callbacks
  onError?: (error: EditorError) => void;
  onSuccess?: (message: string) => void;
  onModeChange?: (mode: 'write' | 'preview') => void;
  
  // Advanced
  ref?: React.Ref<QuillEditorRef>;   // Access editor methods
  autoSave?: boolean;                // Auto-save on change
  autoSaveInterval?: number;         // Auto-save interval (ms)
  onAutoSave?: (data: EditorData) => Promise<void>;
}

interface EditorData {
  content: string;                   // HTML content
  plainText: string;                 // Plain text version
  images: ImageData[];               // Extracted images info
  wordCount: number;
  characterCount: number;
  metadata?: ArticleMetadata;
}

interface ImageData {
  src: string;                       // Image URL or data URL
  alt?: string;
  width?: number;
  height?: number;
  file?: File;                       // Original file if available
}

interface SaveResult {
  success: boolean;
  articleId?: string;
  message?: string;
  error?: string;
}

interface CreateResult extends SaveResult {}
interface UpdateResult extends SaveResult {}

interface EditorError {
  type: 'upload' | 'save' | 'validation' | 'network';
  message: string;
  details?: any;
}

interface QuillEditorRef {
  // Content Methods
  getContent: () => string;
  getPlainText: () => string;
  setContent: (html: string) => void;
  clear: () => void;
  
  // Editor Methods
  focus: () => void;
  blur: () => void;
  getSelection: () => Range | null;
  
  // Save Methods
  save: () => Promise<SaveResult>;
  create: () => Promise<CreateResult>;
  update: (articleId: string) => Promise<UpdateResult>;
  
  // Preview Methods
  switchToPreview: () => void;
  switchToWrite: () => void;
  
  // Image Methods
  insertImage: (url: string, width?: number) => void;
  extractImages: () => ImageData[];
  
  // Utility Methods
  getWordCount: () => number;
  getCharacterCount: () => number;
  validate: () => ValidationResult;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
```

---

## Usage Examples

### Example 1: Basic Create Article

```typescript
import { QuillEditorTNBT } from 'quill-editor-tnbt-v2';

function CreateArticlePage() {
  const [content, setContent] = useState('');
  const editorRef = useRef<QuillEditorRef>(null);
  
  const handleCreate = async (data: EditorData) => {
    try {
      const response = await fetch('/api/articles', {
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
        success: true,
        articleId: result.id,
        message: 'Article created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  };
  
  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('/api/upload-image', {
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
        tags: ['tech', 'tutorial'],
      }}
      placeholder="Start writing your article..."
      onSuccess={(msg) => alert(msg)}
      onError={(err) => console.error(err)}
    />
  );
}
```

### Example 2: Edit Existing Article

```typescript
function EditArticlePage({ articleId }: { articleId: string }) {
  const [article, setArticle] = useState(null);
  const editorRef = useRef<QuillEditorRef>(null);
  
  useEffect(() => {
    // Load article
    fetch(`/api/articles/${articleId}`)
      .then(res => res.json())
      .then(data => setArticle(data));
  }, [articleId]);
  
  const handleUpdate = async (data: EditorData) => {
    const response = await fetch(`/api/articles/${articleId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: data.content,
        updatedAt: new Date().toISOString(),
      }),
    });
    
    return {
      success: response.ok,
      message: 'Article updated successfully',
    };
  };
  
  if (!article) return <div>Loading...</div>;
  
  return (
    <QuillEditorTNBT
      ref={editorRef}
      mode="edit"
      value={article.content}
      onUpdate={handleUpdate}
      articleMetadata={{
        title: article.title,
        tags: article.tags,
      }}
    />
  );
}
```

### Example 3: With Auto-Save

```typescript
function AutoSaveEditor() {
  const handleAutoSave = async (data: EditorData) => {
    // Save to localStorage or send to server
    await fetch('/api/articles/draft', {
      method: 'POST',
      body: JSON.stringify({ content: data.content }),
    });
  };
  
  return (
    <QuillEditorTNBT
      autoSave={true}
      autoSaveInterval={30000} // 30 seconds
      onAutoSave={handleAutoSave}
      onChange={(content) => {
        // Update local state
        localStorage.setItem('draft', content);
      }}
    />
  );
}
```

### Example 4: Custom Image Upload with Progress

```typescript
function EditorWithImageProgress() {
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleImageUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = (e.loaded / e.total) * 100;
          setUploadProgress(percent);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const { url } = JSON.parse(xhr.responseText);
          resolve(url);
        } else {
          reject(new Error('Upload failed'));
        }
      });
      
      xhr.addEventListener('error', () => reject(new Error('Upload failed')));
      
      const formData = new FormData();
      formData.append('image', file);
      
      xhr.open('POST', '/api/upload-image');
      xhr.send(formData);
    });
  };
  
  return (
    <div>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div>Uploading: {uploadProgress}%</div>
      )}
      <QuillEditorTNBT
        onImageUpload={handleImageUpload}
        onError={(err) => {
          if (err.type === 'upload') {
            alert(`Image upload failed: ${err.message}`);
          }
        }}
      />
    </div>
  );
}
```

---

## Implementation Strategy

### Step 1: Refactor MainEditorForCreate

1. **Remove hardcoded save methods** (Firestore, MongoDB)
2. **Replace with callback props** (`onSave`, `onCreate`, `onUpdate`)
3. **Extract image upload logic** to use `onImageUpload` callback
4. **Make content controlled/uncontrolled** via `value` and `defaultValue`

### Step 2: Create Wrapper Component

Create `QuillEditorTNBT.tsx` that:
- Wraps `MainEditorForCreate` and `Preview2`
- Handles mode switching
- Manages state and callbacks
- Exposes ref methods

### Step 3: Extract Image Handling

- Move image upload logic to be callback-based
- Support both data URLs and server URLs
- Handle image extraction and processing

### Step 4: Add Type Definitions

- Create `types/index.ts` with all interfaces
- Export types for consumers
- Add JSDoc comments

### Step 5: Package Configuration

Update `package.json`:
```json
{
  "name": "quill-editor-tnbt-v2",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist"],
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

---

## Migration Guide

### From Current Implementation

**Before:**
```typescript
<MainEditorForCreate
  ref={maineditorRef}
  documentValue={documentValue}
  setDocumentValue={setDocumentValue}
  switchCount={switchCount}
  setSwitchCount={setSwithCount}
/>

// Save via ref
await maineditorRef.current.handleStore_In_Mongodb(title, tags, image);
```

**After:**
```typescript
<QuillEditorTNBT
  ref={editorRef}
  value={content}
  onChange={setContent}
  onCreate={handleCreate}
  onImageUpload={handleImageUpload}
/>

// Or save via ref
await editorRef.current.create();
```

---

## Benefits of This Design

1. ✅ **Flexible**: Works with any backend (REST, GraphQL, Firebase, etc.)
2. ✅ **Type-Safe**: Full TypeScript support
3. ✅ **Testable**: Easy to mock callbacks
4. ✅ **Reusable**: No hardcoded dependencies
5. ✅ **Developer-Friendly**: Clear API, good DX
6. ✅ **Extensible**: Easy to add new features

---

## Next Steps

1. Review and approve this API design
2. Create implementation plan
3. Refactor existing code
4. Write tests
5. Create documentation
6. Publish to npm

