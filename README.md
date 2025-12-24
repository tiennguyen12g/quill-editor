# Quill Editor TNBT v2

A powerful, feature-rich rich text editor component built on Quill that can be integrated into any React application. This package provides a flexible, callback-based API that works with any backend (REST, GraphQL, Firebase, MongoDB, etc.).

## ✨ Features

- 🎨 **Rich Text Editing**: Full-featured WYSIWYG editor based on Quill
- 🖼️ **Image Support**: Upload, resize, and manage images with custom callbacks
- 📝 **Multiple Modes**: Create, edit, and readonly modes
- 🔄 **Auto-save**: Built-in auto-save functionality
- 🎯 **TypeScript**: Full TypeScript support with exported types
- 🔌 **Flexible Backend**: Works with any backend via callback-based architecture
- 🎨 **Customizable**: Extensive customization options
- 📱 **Responsive**: Works on desktop and mobile devices

## 📦 Installation

```bash
npm install quill-editor-tnbt-v2
# or
yarn add quill-editor-tnbt-v2
# or
pnpm add quill-editor-tnbt-v2
```

## 🚀 Quick Start

```tsx
import React from 'react';
import { QuillEditorTNBT } from 'quill-editor-tnbt-v2';
import 'quill-editor-tnbt-v2/dist/style.css';

function MyEditor() {
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
    <QuillEditorTNBT
      onCreate={handleCreate}
      onImageUpload={handleImageUpload}
      articleMetadata={{
        title: 'My Article',
        tags: ['tech', 'tutorial'],
      }}
    />
  );
}
```

## 📚 Basic Usage

### Create Article

```tsx
import { QuillEditorTNBT } from 'quill-editor-tnbt-v2';

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
    <QuillEditorTNBT
      onCreate={handleCreate}
      onImageUpload={async (file) => {
        // Upload image and return URL
        return 'https://example.com/image.jpg';
      }}
    />
  );
}
```

### Edit Article

```tsx
function EditArticle({ articleId, initialContent }) {
  const handleUpdate = async (data, id) => {
    const response = await fetch(`/api/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content: data.content }),
    });
    
    return { success: true };
  };

  return (
    <QuillEditorTNBT
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

### Read-Only Mode

```tsx
function ViewArticle({ content }) {
  return (
    <QuillEditorTNBT
      mode="readonly"
      value={content}
    />
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
| `mode` | `'create' \| 'edit' \| 'readonly'` | `'create'` | Editor mode |
| `onCreate` | `(data: EditorData) => Promise<CreateResult>` | - | Create article callback |
| `onUpdate` | `(data: EditorData, id: string) => Promise<UpdateResult>` | - | Update article callback |
| `onImageUpload` | `(file: File) => Promise<string>` | - | Image upload callback |
| `defaultImageWidth` | `number` | `500` | Default width for inserted images |
| `articleMetadata` | `ArticleMetadata` | - | Article metadata (title, tags, etc.) |
| `autoSave` | `boolean` | `false` | Enable auto-save |
| `autoSaveInterval` | `number` | `30000` | Auto-save interval (ms) |
| `onAutoSave` | `(data: EditorData) => Promise<void>` | - | Auto-save callback |
| `placeholder` | `string` | `"Write something awesome..."` | Editor placeholder |
| `onSuccess` | `(message: string) => void` | - | Success callback |
| `onError` | `(error: EditorError) => void` | - | Error callback |

### Ref Methods

```tsx
const editorRef = useRef<QuillEditorRef>(null);

// Get content
const content = editorRef.current?.getContent();

// Save/Create/Update
await editorRef.current?.create();
await editorRef.current?.update(articleId);
await editorRef.current?.save();

// Utility methods
const wordCount = editorRef.current?.getWordCount();
const validation = editorRef.current?.validate();
```

## 🎨 Styling

Import the default styles:

```tsx
import 'quill-editor-tnbt-v2/dist/style.css';
```

Or customize with your own CSS by overriding the classes.

## 📖 Examples

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

## 🔗 TypeScript

Full TypeScript support with exported types:

```tsx
import { 
  QuillEditorTNBT, 
  QuillEditorRef,
  EditorData,
  ImageData,
  ArticleMetadata 
} from 'quill-editor-tnbt-v2';
```

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ using Quill and React
