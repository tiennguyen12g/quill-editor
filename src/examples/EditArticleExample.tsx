/**
 * Example component for testing edit feature
 * 
 * This component:
 * 1. Loads articles from the server
 * 2. Displays a list of articles
 * 3. Allows editing articles by clicking "Edit" button
 * 4. Tests the update functionality
 */

import React, { useState, useEffect, useRef } from 'react';
import { QuillEditorTNBT, QuillEditorRef } from '../index';
import { processImagesInContent } from '../utils/imageProcessor';
import ConvertDocProperly from '../components/ConvertDocProperly';
import '../components/Preview2.css';

const API_BASE_URL = 'http://localhost:3001';

interface Article {
  id: string;
  content: string;
  title: string;
  tags: string[];
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export default function EditArticleExample() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [message, setMessage] = useState('');
  const [content, setContent] = useState('');
  const editorRef = useRef<QuillEditorRef>(null);

  // Load all articles
  const loadArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/articles`);
      const result = await response.json();
      
      if (result.success) {
        setArticles(result.articles || []);
      } else {
        setMessage(`❌ Error loading articles: ${result.error}`);
      }
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load articles on mount
  useEffect(() => {
    loadArticles();
  }, []);

  // Handle starting edit mode
  const handleStartEdit = (article: Article) => {
    // Reset state first to ensure clean edit
    setMessage('');
    
    // Set new article data first
    setEditingArticleId(article.id);
    setEditingArticle(article);
    
    // Set content immediately - the key prop will force editor to reset
    setContent(article.content);
    
    // Focus editor after a short delay to ensure editor is ready
    setTimeout(() => {
      editorRef.current?.focus();
    }, 200);
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingArticleId(null);
    setEditingArticle(null);
    setContent('');
    setMessage('');
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

  // Handle updating article
  const handleUpdate = async (data: any, articleId: string) => {
    try {
      // Use the articleId parameter (current article being edited)
      const currentArticleId = articleId || editingArticleId;
      
      if (!currentArticleId) {
        setMessage(`❌ Error: No article ID provided`);
        return {
          success: false,
          error: 'No article ID provided',
        };
      }

      console.log('Updating article:', currentArticleId);
      console.log('Content length:', data.content?.length);
      console.log('Content preview:', data.content?.substring(0, 100));

      // Get current article data
      const currentArticle = editingArticle || articles.find(a => a.id === currentArticleId);
      
      // Process images before saving
      const processedContent = await processImagesInContent(
        data.content,
        handleImageUpload
      );

      console.log('Processed content length:', processedContent?.length);

      const response = await fetch(`${API_BASE_URL}/api/articles/${currentArticleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: processedContent,
          title: data.metadata?.title || currentArticle?.title,
          tags: data.metadata?.tags || currentArticle?.tags,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update failed:', response.status, errorText);
        setMessage(`❌ Error: ${response.status} - ${errorText}`);
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText}`,
        };
      }

      const result = await response.json();
      console.log('Update result:', result);
      
      if (result.success) {
        setMessage(`✅ Article updated successfully!`);
        
        // Reload articles to show updated content
        await loadArticles();
        
        // Exit edit mode after a short delay
        setTimeout(() => {
          handleCancelEdit();
        }, 1500);
        
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
      console.error('Update error:', error);
      setMessage(`❌ Error: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  };

  // Handle deleting article
  const handleDelete = async (articleId: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/articles/${articleId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage(`✅ Article deleted successfully!`);
        await loadArticles();
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // If editing, show editor
  if (editingArticleId && editingArticle) {
    return (
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Edit Article</h1>
        
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

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button
            onClick={handleCancelEdit}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            ← Back to List
          </button>
          
          <button
            onClick={async () => {
              if (editingArticleId) {
                await editorRef.current?.update(editingArticleId);
              }
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            💾 Save Changes
          </button>
        </div>

        <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <strong>Title:</strong> {editingArticle.title}
          <br />
          <strong>Tags:</strong> {editingArticle.tags.join(', ') || 'None'}
          <br />
          <strong>Created:</strong> {formatDate(editingArticle.createdAt)}
          <br />
          <strong>Last Updated:</strong> {formatDate(editingArticle.updatedAt)}
        </div>

        <QuillEditorTNBT
          key={editingArticleId} // Force re-render when article changes
          ref={editorRef}
          mode="edit"
          value={content}
          onChange={setContent}
          onUpdate={handleUpdate}
          onImageUpload={handleImageUpload}
          articleMetadata={{
            title: editingArticle.title,
            tags: editingArticle.tags,
          }}
          onSuccess={handleSuccess}
          onError={handleError}
          placeholder="Edit your article..."
          defaultImageWidth={600}
        />
      </div>
    );
  }

  // Show article list
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Articles List</h1>
        <button
          onClick={loadArticles}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          🔄 Refresh
        </button>
      </div>

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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading articles...</p>
        </div>
      ) : articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <p>No articles found. Create some articles first!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {articles.map((article) => (
            <div
              key={article.id}
              style={{
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>{article.title}</h2>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                    <span style={{ marginRight: '15px' }}>
                      📅 Created: {formatDate(article.createdAt)}
                    </span>
                    <span>
                      ✏️ Updated: {formatDate(article.updatedAt)}
                    </span>
                  </div>
                  {article.tags.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                      {article.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          style={{
                            display: 'inline-block',
                            padding: '4px 8px',
                            marginRight: '5px',
                            backgroundColor: '#e9ecef',
                            borderRadius: '4px',
                            fontSize: '12px',
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleStartEdit(article)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
              
              <div
                style={{
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  border: '1px solid #e9ecef',
                  maxHeight: '200px',
                  overflow: 'auto',
                }}
                dangerouslySetInnerHTML={{ 
                  __html: ConvertDocProperly({ documentValue: article.content }) || article.content 
                }}
                className="text-area"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

