# @tnbt/quill-editor

A powerful, feature-rich rich text editor component built on Quill that can be integrated into any React application. This package provides a flexible, callback-based API that works with any backend (REST, GraphQL, Firebase, MongoDB, etc.).

[![npm version](https://img.shields.io/npm/v/@tnbt/quill-editor.svg)](https://www.npmjs.com/package/@tnbt/quill-editor)
[![GitHub](https://img.shields.io/github/license/tiennguyen12g/quill-editor)](https://github.com/tiennguyen12g/quill-editor)

## ✨ Features

- 🎨 **Rich Text Editing**: Full-featured WYSIWYG editor based on Quill
- 🖼️ **Image Support**: Upload, resize, align (left, right, center), and manage images with custom callbacks
- 📝 **Multiple Modes**: Create, edit, and readonly modes with preview toggle
- 🔄 **Auto-save**: Built-in auto-save functionality with configurable intervals
- 🎯 **TypeScript**: Full TypeScript support with exported types
- 🔌 **Flexible Backend**: Works with any backend via callback-based architecture
- 🎨 **Customizable**: Extensive customization options and styling
- 📱 **Responsive**: Works on desktop and mobile devices
- 😊 **Emoji Picker**: Built-in emoji picker with categorized emojis
- 💬 **Blockquote**: Custom blockquote feature with styled rendering
- 🎨 **Image Layouts**: Support for image-left-content, image-right-content, and centered image layouts
- 📋 **Code Blocks**: Syntax highlighting and copy functionality for code blocks
- ✨ **Highlight Content**: Custom highlight content feature
- 🔄 **Undo/Redo**: Custom undo/redo functionality

## Image
https://github.com/tiennguyen12g/my-media-storage/blob/main/quill-tool-tnbt.png

## 📦 Installation

```bash
npm install @tnbt/quill-editor
# or
yarn add @tnbt/quill-editor
# or
pnpm add @tnbt/quill-editor
```

### Requirements

- **React**: >=18.0.0 (compatible with React 18, 19, and future versions)
- **React DOM**: >=18.0.0

The package uses React as a peer dependency, so make sure you have React installed in your project:

```bash
npm install react react-dom
```

### ⚠️ React 19 Compatibility Note

If you're using **React 19**, you need to add a polyfill for `findDOMNode` (which was removed in React 19). Add this to your app's entry point **before** other imports:

```tsx
// main.tsx or App.tsx
import ReactDOM from 'react-dom';

// Polyfill for React 19
if (!ReactDOM.findDOMNode) {
  (ReactDOM as any).findDOMNode = function(componentOrElement: any) {
    if (!componentOrElement) return null;
    if (componentOrElement.nodeType === 1 || componentOrElement.nodeType === 3) {
      return componentOrElement;
    }
    if (componentOrElement.current) return componentOrElement.current;
    if (componentOrElement.stateNode) return componentOrElement.stateNode;
    return null;
  };
}

// Now import your app
import App from './App';
```

## 🚀 Quick Start

### Basic Usage

```tsx
import React, { useState } from 'react';
import { QuillEditorTNBT_DefaultCss } from '@tnbt/quill-editor';
import '@tnbt/quill-editor/styles'; // Import styles

function MyEditor() {
  const [content, setContent] = useState('');

  const handleCreate = async (data) => {
    // Your save logic - works with ANY backend!
    const response = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: data.content,
        title: data.metadata?.title,
      }),
    });
    
    const result = await response.json();
    return {
      success: true,
      articleId: result.id,
      message: 'Article created!',
    };
  };

  const handleImageUpload = async (file: File) => {
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
    <QuillEditorTNBT_DefaultCss
      value={content}
      onChange={setContent}
      onCreate={handleCreate}
      onImageUpload={handleImageUpload}
      articleMetadata={{
        title: 'My Article',
        tags: ['tech', 'tutorial'],
      }}
      defaultImageWidth={600}
    />
  );
}
```

## 📚 Components

### QuillEditorTNBT_DefaultCss

The main editor component with default styling. This is the recommended component to use.

```tsx
import { QuillEditorTNBT_DefaultCss } from '@tnbt/quill-editor';
import '@tnbt/quill-editor/styles';
```

### QuillEditorTNBT

The base editor component without default CSS. Use this if you want to provide your own styling.

```tsx
import { QuillEditorTNBT } from '@tnbt/quill-editor';
```

### ConvertDocProperly

Utility component for converting editor content with custom syntax (blockquotes, image layouts, etc.) into proper HTML.

```tsx
import { ConvertDocProperly } from '@tnbt/quill-editor';

function Preview({ content }) {
  return (
    <div dangerouslySetInnerHTML={{ 
      __html: ConvertDocProperly({ documentValue: content }) 
    }} />
  );
}
```

## 📖 Usage Examples

### Create Article

```tsx
import { QuillEditorTNBT_DefaultCss } from '@tnbt/quill-editor';
import '@tnbt/quill-editor/styles';

function CreateArticle() {
  const handleCreate = async (data) => {
    // data.content - HTML content
    // data.plainText - Plain text version
    // data.images - Array of image data
    // data.wordCount - Word count
    // data.metadata - Article metadata
    
    const response = await fetch('/api/articles', {
      method: 'POST',
      body: JSON.stringify({ content: data.content }),
    });
    
    return { success: true, articleId: '123' };
  };

  return (
    <QuillEditorTNBT_DefaultCss
      onCreate={handleCreate}
      onImageUpload={async (file) => {
        // Upload image and return URL
        return 'https://example.com/image.jpg';
      }}
      defaultImageWidth={600}
    />
  );
}
```

### Edit Article

```tsx
import { QuillEditorTNBT_DefaultCss } from '@tnbt/quill-editor';
import '@tnbt/quill-editor/styles';

function EditArticle({ articleId, initialContent }) {
  const handleUpdate = async (data, id) => {
    const response = await fetch(`/api/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content: data.content }),
    });
    
    return { success: true };
  };

  return (
    <QuillEditorTNBT_DefaultCss
      mode="edit"
      value={initialContent}
      onUpdate={handleUpdate}
      onImageUpload={async (file) => {
        return 'https://example.com/image.jpg';
      }}
    />
  );
}
```

### Read-Only Mode with Preview

```tsx
import { QuillEditorTNBT_DefaultCss, ConvertDocProperly } from '@tnbt/quill-editor';
import '@tnbt/quill-editor/styles';

function ViewArticle({ content }) {
  return (
    <QuillEditorTNBT_DefaultCss
      mode="readonly"
      value={content}
      showPreview={true}
    />
  );
}

// Or render converted content directly
function ArticlePreview({ content }) {
  const convertedContent = ConvertDocProperly({ documentValue: content });
  return <div dangerouslySetInnerHTML={{ __html: convertedContent }} />;
}
```

### Using Ref Methods

```tsx
import { useRef } from 'react';
import { QuillEditorTNBT_DefaultCss, type QuillEditorRef } from '@tnbt/quill-editor';

function EditorWithRef() {
  const editorRef = useRef<QuillEditorRef>(null);

  const handleSave = async () => {
    // Get content
    const content = editorRef.current?.getContent();
    const wordCount = editorRef.current?.getWordCount();
    
    // Save/Create/Update
    await editorRef.current?.create();
    // or
    await editorRef.current?.update('article-id');
    // or
    await editorRef.current?.save();
    
    // Utility methods
    const validation = editorRef.current?.validate();
    editorRef.current?.focus();
    editorRef.current?.clear();
  };

  return (
    <>
      <button onClick={handleSave}>Save</button>
      <QuillEditorTNBT_DefaultCss ref={editorRef} />
    </>
  );
}
```

## 🔧 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled content value |
| `defaultValue` | `string` | - | Uncontrolled default content |
| `onChange` | `(html: string) => void` | - | Called on every content change |
| `onContentChange` | `(html: string) => void` | - | Debounced version of onChange (optional) |
| `mode` | `'create' \| 'edit' \| 'readonly'` | `'create'` | Editor mode |
| `showPreview` | `boolean` | `true` | Show preview mode toggle |
| `showToolbar` | `boolean` | `true` | Show/hide toolbar |
| `onCreate` | `(data: EditorData) => Promise<CreateResult>` | - | Create article callback |
| `onUpdate` | `(data: EditorData, id: string) => Promise<UpdateResult>` | - | Update article callback |
| `onSave` | `(data: EditorData) => Promise<SaveResult>` | - | Generic save callback |
| `onImageUpload` | `(file: File) => Promise<string>` | - | Image upload callback (must return URL) |
| `defaultImageWidth` | `number` | `500` | Default width for inserted images |
| `articleMetadata` | `ArticleMetadata` | - | Article metadata (title, tags, etc.) |
| `autoSave` | `boolean` | `false` | Enable auto-save |
| `autoSaveInterval` | `number` | `30000` | Auto-save interval (ms) |
| `onAutoSave` | `(data: EditorData) => Promise<void>` | - | Auto-save callback |
| `placeholder` | `string` | `"Write something awesome..."` | Editor placeholder |
| `onSuccess` | `(message: string) => void` | - | Success callback |
| `onError` | `(error: EditorError) => void` | - | Error callback |
| `onModeChange` | `(mode: 'write' \| 'preview') => void` | - | Mode change callback |
| `className` | `string` | - | Custom CSS class |

### Ref Methods (QuillEditorRef)

```tsx
interface QuillEditorRef {
  // Content Methods
  getContent: () => string;
  getPlainText: () => string;
  setContent: (html: string) => void;
  clear: () => void;
  
  // Editor Methods
  focus: () => void;
  blur: () => void;
  getSelection: () => any;
  getEditor: () => any; // Get Quill instance
  
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
```

### Types

```tsx
import type {
  QuillEditorTNBTProps,
  QuillEditorRef,
  EditorData,
  ImageData,
  ArticleMetadata,
  SaveResult,
  CreateResult,
  UpdateResult,
  EditorError,
  ValidationResult,
  ToolbarConfig,
} from '@tnbt/quill-editor';

interface EditorData {
  content: string;           // HTML content
  plainText: string;          // Plain text version
  images: ImageData[];        // Extracted images info
  wordCount: number;
  characterCount: number;
  metadata?: ArticleMetadata;
}

interface ImageData {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  file?: File;
}

interface ArticleMetadata {
  title?: string;
  tags?: string[];
  coverImage?: File | string;
  category?: string;
  [key: string]: any;
}
```

### Utility Functions

```tsx
import {
  processImagesInContent,
  extractImageUrls,
  hasBase64Images,
} from '@tnbt/quill-editor';

// Process images in HTML content (extract base64, upload, replace)
const processedContent = await processImagesInContent(
  htmlContent,
  uploadCallback
);

// Extract image URLs from HTML
const imageUrls = extractImageUrls(htmlContent);

// Check if content has base64 images
const hasBase64 = hasBase64Images(htmlContent);
```

## 🎨 Styling

### Import Default Styles

```tsx
import '@tnbt/quill-editor/styles';
```

### Custom CSS (Optional)

If you need additional styling, you can add custom CSS:

```css
/* Custom styles for the editor */
.ql-editor {
  min-height: 400px;
}

/* Custom blockquote styles */
.custom-blockquote {
  border-left: 4px solid #808080;
  background-color: #f9f9f9;
  padding: 10px 15px;
  margin: 10px 0;
}

/* Custom image layout styles */
.image-center-horizontal {
  text-align: center;
}

.image-left-content {
  display: flex;
  gap: 20px;
}
```

## 📖 Backend Integration Examples

### With Express.js / MongoDB

```tsx
const handleCreate = async (data) => {
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
  return { success: true, articleId: result.id };
};

const handleImageUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch('/api/upload-image', {
    method: 'POST',
    body: formData,
  });
  const { url } = await response.json();
  return url;
};
```

### With Firebase

```tsx
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const handleCreate = async (data) => {
  const docRef = await addDoc(collection(db, 'articles'), {
    content: data.content,
    createdAt: new Date(),
  });
  return { success: true, articleId: docRef.id };
};

const handleImageUpload = async (file: File) => {
  const storageRef = ref(storage, `images/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};
```

### With GraphQL

```tsx
import { useMutation } from '@apollo/client';

const [createArticle] = useMutation(CREATE_ARTICLE);

const handleCreate = async (data) => {
  const { data: result } = await createArticle({
    variables: { content: data.content },
  });
  return { success: true, articleId: result.createArticle.id };
};
```

## 🎯 Features in Detail

### Image Alignment

The editor supports three image alignment options:
- **Left**: Image on the left, content on the right
- **Right**: Image on the right, content on the left  
- **Center**: Image centered horizontally

These are available via toolbar buttons and render properly in preview mode.

### Emoji Picker

Access a categorized emoji picker from the toolbar. Click the emoji button to open a dropdown with emojis organized by category.

### Blockquote

Insert styled blockquotes using the blockquote button. Blockquotes render with a gray vertical line, background color, and proper spacing.

### Code Blocks

Code blocks support syntax highlighting and include a copy button for easy code sharing.

### Highlight Content

Use the highlight feature to emphasize important content with custom styling.

## 🔗 TypeScript Support

Full TypeScript support with exported types:

```tsx
import { 
  QuillEditorTNBT_DefaultCss,
  QuillEditorTNBT,
  ConvertDocProperly,
  QuillEditorRef,
  EditorData,
  ImageData,
  ArticleMetadata,
  processImagesInContent,
  extractImageUrls,
  hasBase64Images,
} from '@tnbt/quill-editor';
```

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on [GitHub](https://github.com/tiennguyen12g/quill-editor).

## 🔗 Links

- [GitHub Repository](https://github.com/tiennguyen12g/quill-editor)
- [npm Package](https://www.npmjs.com/package/@tnbt/quill-editor)

---

Made with ❤️ using Quill and React
