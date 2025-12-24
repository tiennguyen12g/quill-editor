/**
 * Example component showing how to use QuillEditorTNBT with Express backend
 * 
 * To use this:
 * 1. Start the test server: cd test-server && npm install && npm start
 * 2. Import and use this component in your app
 */

import React, { useState, useRef } from 'react';
import { QuillEditorTNBT, QuillEditorRef, QuillEditorTNBT_DefaultCss } from '../index';
import { processImagesInContent } from '../utils/imageProcessor';

const API_BASE_URL = 'http://localhost:3001';

export default function TestEditor() {
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const editorRef = useRef<QuillEditorRef>(null);

  // Handle creating a new article
  const handleCreate = async (data: any) => {
    try {
      // Process images before saving (extract base64, upload, replace with URLs)
      const processedContent = await processImagesInContent(
        data.content,
        handleImageUpload
      );
      
      const response = await fetch(`${API_BASE_URL}/api/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: processedContent,
          title: data.metadata?.title || 'Untitled',
          tags: data.metadata?.tags || [],
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage(`✅ Article created! ID: ${result.articleId}`);
        return {
          success: true,
          articleId: result.articleId,
          message: 'Article created successfully',
        };
      } else {
        setMessage(`❌ Error: ${result.error}`);
        return {
          success: false,
          error: result.error,
        };
      }
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  };

  // Handle updating an existing article
  const handleUpdate = async (data: any, articleId: string) => {
    try {
      // Process images before saving (extract base64, upload, replace with URLs)
      const processedContent = await processImagesInContent(
        data.content,
        handleImageUpload
      );
      
      const response = await fetch(`${API_BASE_URL}/api/articles/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: processedContent,
          title: data.metadata?.title,
          tags: data.metadata?.tags,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage(`✅ Article updated!`);
        return {
          success: true,
          message: 'Article updated successfully',
        };
      } else {
        setMessage(`❌ Error: ${result.error}`);
        return {
          success: false,
          error: result.error,
        };
      }
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  };

  // Handle image upload
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/api/upload-image`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        return result.url;
      } else {
        throw new Error(result.error || 'Image upload failed');
      }
    } catch (error: any) {
      console.error('Image upload error:', error);
      // Fallback to data URL if upload fails
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle auto-save
  const handleAutoSave = async (data: any) => {
    try {
      // For auto-save, we can skip image processing to save time
      // Or process images in background (optional)
      // For now, just save as-is (server can handle it with increased limit)
      await fetch(`${API_BASE_URL}/api/articles/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: data.content }),
      });
      console.log('Draft auto-saved');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  // Handle errors
  const handleError = (error: any) => {
    console.error('Editor error:', error);
    setMessage(`⚠️ ${error.type}: ${error.message}`);
  };

  // Handle success
  const handleSuccess = (msg: string) => {
    setMessage(`✅ ${msg}`);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Quill Editor TNBT v2 - Test Example</h1>
      
      {message && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
        }}>
          {message}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => editorRef.current?.create()}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Create Article
        </button>
        
        <button
          onClick={() => {
            const validation = editorRef.current?.validate();
            if (validation) {
              alert(`Valid: ${validation.valid}\nErrors: ${validation.errors.join(', ')}\nWarnings: ${validation.warnings.join(', ')}`);
            }
          }}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Validate
        </button>

        <button
          onClick={() => {
            const wordCount = editorRef.current?.getWordCount();
            const charCount = editorRef.current?.getCharacterCount();
            alert(`Words: ${wordCount}\nCharacters: ${charCount}`);
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Get Stats
        </button>
      </div>

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
          title: 'Test Article',
          tags: ['test', 'example'],
        }}
        onSuccess={handleSuccess}
        onError={handleError}
        placeholder="Start writing your article here..."
        defaultImageWidth={600}
      />

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h3>Content Preview (Raw HTML):</h3>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {content || '(empty)'}
        </pre>
      </div>
    </div>
  );
}

