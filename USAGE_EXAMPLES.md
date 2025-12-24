# Usage Examples for Quill Editor TNBT v2

## Installation (Future)

```bash
npm install quill-editor-tnbt-v2
# or
yarn add quill-editor-tnbt-v2
```

## Example 1: Simple Create Article

```typescript
import React, { useState, useRef } from 'react';
import { QuillEditorTNBT, QuillEditorRef } from 'quill-editor-tnbt-v2';

function CreateArticle() {
  const [content, setContent] = useState('');
  const editorRef = useRef<QuillEditorRef>(null);

  const handleCreate = async (data) => {
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
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    const { url } = await response.json();
    return url;
  };

  return (
    <div>
      <h1>Create Article</h1>
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
        onSuccess={(msg) => alert(msg)}
      />
      <button onClick={() => editorRef.current?.create()}>
        Save Article
      </button>
    </div>
  );
}
```

## Example 2: Edit Existing Article

```typescript
import React, { useState, useEffect, useRef } from 'react';
import { QuillEditorTNBT, QuillEditorRef } from 'quill-editor-tnbt-v2';

function EditArticle({ articleId }: { articleId: string }) {
  const [article, setArticle] = useState(null);
  const editorRef = useRef<QuillEditorRef>(null);

  useEffect(() => {
    fetch(`/api/articles/${articleId}`)
      .then(res => res.json())
      .then(data => setArticle(data));
  }, [articleId]);

  const handleUpdate = async (data, id) => {
    const response = await fetch(`/api/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: data.content }),
    });
    
    return {
      success: response.ok,
      message: 'Updated successfully',
    };
  };

  if (!article) return <div>Loading...</div>;

  return (
    <QuillEditorTNBT
      ref={editorRef}
      mode="edit"
      value={article.content}
      onUpdate={handleUpdate}
      onImageUpload={async (file) => {
        // Your image upload logic
        return 'https://example.com/image.jpg';
      }}
    />
  );
}
```

## Example 3: With Auto-Save

```typescript
function AutoSaveEditor() {
  const handleAutoSave = async (data) => {
    // Save draft to server
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
        // Also update local state
        console.log('Content changed:', content);
      }}
    />
  );
}
```

## Example 4: Firebase Integration

```typescript
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

function FirebaseEditor() {
  const handleCreate = async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'articles'), {
        content: data.content,
        title: data.metadata?.title,
        createdAt: new Date(),
      });
      
      return {
        success: true,
        articleId: docRef.id,
        message: 'Saved to Firebase!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  };

  const handleImageUpload = async (file: File) => {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  return (
    <QuillEditorTNBT
      onCreate={handleCreate}
      onImageUpload={handleImageUpload}
    />
  );
}
```

## Example 5: GraphQL Integration

```typescript
import { useMutation } from '@apollo/client';
import { CREATE_ARTICLE, UPLOAD_IMAGE } from './mutations';

function GraphQLEditor() {
  const [createArticle] = useMutation(CREATE_ARTICLE);
  const [uploadImage] = useMutation(UPLOAD_IMAGE);

  const handleCreate = async (data) => {
    try {
      const { data: result } = await createArticle({
        variables: {
          content: data.content,
          title: data.metadata?.title,
        },
      });
      
      return {
        success: true,
        articleId: result.createArticle.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  };

  const handleImageUpload = async (file: File) => {
    const { data } = await uploadImage({
      variables: { file },
    });
    return data.uploadImage.url;
  };

  return (
    <QuillEditorTNBT
      onCreate={handleCreate}
      onImageUpload={handleImageUpload}
    />
  );
}
```

## Example 6: Custom Validation

```typescript
function ValidatedEditor() {
  const editorRef = useRef<QuillEditorRef>(null);

  const handleSave = async (data) => {
    // Validate before saving
    const validation = editorRef.current?.validate();
    
    if (!validation?.valid) {
      alert('Errors: ' + validation.errors.join(', '));
      return {
        success: false,
        error: 'Validation failed',
      };
    }

    // Proceed with save
    // ...
  };

  return (
    <QuillEditorTNBT
      ref={editorRef}
      onSave={handleSave}
    />
  );
}
```

## Example 7: Read-Only Mode

```typescript
function ReadOnlyView({ articleContent }: { articleContent: string }) {
  return (
    <QuillEditorTNBT
      mode="readonly"
      value={articleContent}
    />
  );
}
```

## Example 8: Custom Toolbar

```typescript
function CustomToolbarEditor() {
  return (
    <QuillEditorTNBT
      toolbarConfig={{
        showFont: true,
        showSize: true,
        showBold: true,
        showItalic: true,
        showImage: true,
        showVideo: false,
        showCompareImage: false,
      }}
    />
  );
}
```

