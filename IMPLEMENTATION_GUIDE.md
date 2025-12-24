# Implementation Guide: Converting to Reusable Package

## Overview
This guide shows step-by-step how to refactor the current implementation to support the new API design.

## Step 1: Create the Main Wrapper Component

Create `src/components/QuillEditorTNBT.tsx`:

```typescript
import React, { useState, useRef, useImperativeHandle, useCallback, useEffect } from 'react';
import MainEditorForCreate from './MainEditorForCreate';
import Preview2 from './Preview2';
import { QuillEditorTNBTProps, QuillEditorRef, EditorData, ImageData } from '../types';

const QuillEditorTNBT = React.forwardRef<QuillEditorRef, QuillEditorTNBTProps>(
  (props, ref) => {
    const {
      value,
      defaultValue,
      onChange,
      onContentChange,
      mode = 'create',
      showPreview = true,
      showToolbar = true,
      onSave,
      onCreate,
      onUpdate,
      onImageUpload,
      defaultImageWidth = 500,
      articleMetadata,
      placeholder = "Write something awesome...",
      onError,
      onSuccess,
      onModeChange,
      autoSave = false,
      autoSaveInterval = 30000,
      onAutoSave,
      className,
    } = props;

    // Internal state
    const [content, setContent] = useState(value || defaultValue || '');
    const [currentMode, setCurrentMode] = useState<'write' | 'preview'>('write');
    const [switchCount, setSwitchCount] = useState(0);
    const editorRef = useRef<any>(null);
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Sync with controlled value prop
    useEffect(() => {
      if (value !== undefined) {
        setContent(value);
      }
    }, [value]);

    // Handle content changes
    const handleContentChange = useCallback((newContent: string) => {
      setContent(newContent);
      onChange?.(newContent);
      
      // Debounced onContentChange
      if (onContentChange) {
        clearTimeout(autoSaveTimerRef.current as NodeJS.Timeout);
        autoSaveTimerRef.current = setTimeout(() => {
          onContentChange(newContent);
        }, 500);
      }
    }, [onChange, onContentChange]);

    // Extract editor data
    const getEditorData = useCallback((): EditorData => {
      const plainText = extractPlainText(content);
      const images = extractImages(content);
      
      return {
        content,
        plainText,
        images,
        wordCount: getWordCount(plainText),
        characterCount: content.length,
        metadata: articleMetadata,
      };
    }, [content, articleMetadata]);

    // Auto-save functionality
    useEffect(() => {
      if (autoSave && onAutoSave && content) {
        const timer = setInterval(async () => {
          try {
            await onAutoSave(getEditorData());
          } catch (error) {
            onError?.({
              type: 'save',
              message: 'Auto-save failed',
              details: error,
            });
          }
        }, autoSaveInterval);

        return () => clearInterval(timer);
      }
    }, [autoSave, onAutoSave, content, autoSaveInterval, getEditorData, onError]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      getContent: () => content,
      getPlainText: () => extractPlainText(content),
      setContent: (html: string) => {
        setContent(html);
        if (editorRef.current) {
          // Set content in editor
          const quill = editorRef.current.getEditor();
          quill.clipboard.dangerouslyPasteHTML(html);
        }
      },
      clear: () => {
        setContent('');
        if (editorRef.current) {
          const quill = editorRef.current.getEditor();
          quill.setText('');
        }
      },
      focus: () => {
        if (editorRef.current) {
          const quill = editorRef.current.getEditor();
          quill.focus();
        }
      },
      blur: () => {
        if (editorRef.current) {
          const quill = editorRef.current.getEditor();
          quill.blur();
        }
      },
      getSelection: () => {
        if (editorRef.current) {
          const quill = editorRef.current.getEditor();
          return quill.getSelection();
        }
        return null;
      },
      save: async () => {
        if (!onSave) {
          throw new Error('onSave callback not provided');
        }
        try {
          return await onSave(getEditorData());
        } catch (error: any) {
          onError?.({
            type: 'save',
            message: error.message || 'Save failed',
            details: error,
          });
          throw error;
        }
      },
      create: async () => {
        if (!onCreate) {
          throw new Error('onCreate callback not provided');
        }
        try {
          const result = await onCreate(getEditorData());
          if (result.success) {
            onSuccess?.(result.message || 'Article created successfully');
          }
          return result;
        } catch (error: any) {
          onError?.({
            type: 'save',
            message: error.message || 'Create failed',
            details: error,
          });
          throw error;
        }
      },
      update: async (articleId: string) => {
        if (!onUpdate) {
          throw new Error('onUpdate callback not provided');
        }
        try {
          const result = await onUpdate(getEditorData(), articleId);
          if (result.success) {
            onSuccess?.(result.message || 'Article updated successfully');
          }
          return result;
        } catch (error: any) {
          onError?.({
            type: 'save',
            message: error.message || 'Update failed',
            details: error,
          });
          throw error;
        }
      },
      switchToPreview: () => {
        setCurrentMode('preview');
        editorRef.current?.moveDocumentToPreview();
        onModeChange?.('preview');
      },
      switchToWrite: () => {
        setCurrentMode('write');
        onModeChange?.('write');
      },
      insertImage: (url: string, width?: number) => {
        if (editorRef.current) {
          const quill = editorRef.current.getEditor();
          const selection = quill.getSelection();
          const position = selection ? selection.index : quill.getLength();
          quill.insertEmbed(position, 'image', url);
          
          // Set width after insertion
          setTimeout(() => {
            const qlEditor = document.querySelector('.ql-editor');
            if (qlEditor) {
              const imgElements = qlEditor.querySelectorAll('img');
              const lastImg = imgElements[imgElements.length - 1] as HTMLImageElement;
              if (lastImg) {
                lastImg.style.width = `${width || defaultImageWidth}px`;
                lastImg.style.height = 'auto';
                lastImg.style.maxWidth = '100%';
              }
            }
          }, 100);
        }
      },
      extractImages: () => extractImages(content),
      getWordCount: () => getWordCount(extractPlainText(content)),
      getCharacterCount: () => content.length,
      validate: () => {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        if (!content || content.trim().length === 0) {
          errors.push('Content cannot be empty');
        }
        
        if (content.length < 50) {
          warnings.push('Content is very short');
        }
        
        return {
          valid: errors.length === 0,
          errors,
          warnings,
        };
      },
    }), [content, getEditorData, onSave, onCreate, onUpdate, onError, onSuccess, onModeChange, defaultImageWidth, editorRef]);

    // Handle mode switching
    const handleWrite = () => {
      setCurrentMode('write');
      onModeChange?.('write');
    };

    const handlePreview = () => {
      setCurrentMode('preview');
      if (editorRef.current) {
        editorRef.current.moveDocumentToPreview();
      }
      onModeChange?.('preview');
    };

    // Render
    if (mode === 'readonly') {
      return (
        <div className={className}>
          <Preview2 documentValue={content} setDocumentValue={() => {}} />
        </div>
      );
    }

    return (
      <div className={className}>
        {showPreview && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <button
              onClick={handleWrite}
              style={{
                padding: '5px 10px',
                backgroundColor: currentMode === 'write' ? '#1b75aa' : 'transparent',
                color: currentMode === 'write' ? 'white' : 'black',
                border: '1px solid #ccc',
                cursor: 'pointer',
              }}
            >
              Write
            </button>
            <button
              onClick={handlePreview}
              style={{
                padding: '5px 10px',
                backgroundColor: currentMode === 'preview' ? '#1b75aa' : 'transparent',
                color: currentMode === 'preview' ? 'white' : 'black',
                border: '1px solid #ccc',
                cursor: 'pointer',
              }}
            >
              Preview
            </button>
          </div>
        )}

        {currentMode === 'write' ? (
          <MainEditorForCreate
            ref={editorRef}
            documentValue={content}
            setDocumentValue={handleContentChange}
            switchCount={switchCount}
            setSwitchCount={setSwitchCount}
            onImageUpload={onImageUpload}
            defaultImageWidth={defaultImageWidth}
            placeholder={placeholder}
            showToolbar={showToolbar}
          />
        ) : (
          <Preview2 documentValue={content} setDocumentValue={handleContentChange} />
        )}
      </div>
    );
  }
);

// Utility functions
function extractPlainText(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

function extractImages(html: string): ImageData[] {
  const div = document.createElement('div');
  div.innerHTML = html;
  const imgElements = div.querySelectorAll('img');
  const images: ImageData[] = [];
  
  imgElements.forEach((img) => {
    images.push({
      src: img.src,
      alt: img.alt || '',
      width: img.width,
      height: img.height,
    });
  });
  
  return images;
}

function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

QuillEditorTNBT.displayName = 'QuillEditorTNBT';

export default QuillEditorTNBT;
```

## Step 2: Update MainEditorForCreate to Accept New Props

Modify `MainEditorForCreate.tsx` to accept:
- `onImageUpload?: (file: File) => Promise<string>`
- `defaultImageWidth?: number`
- `placeholder?: string`
- `showToolbar?: boolean`

Update `handleCustomImageDefault` to use `onImageUpload` if provided.

## Step 3: Create Index File for Package Exports

Create `src/index.ts`:

```typescript
export { default as QuillEditorTNBT } from './components/QuillEditorTNBT';
export * from './types';
export type { QuillEditorTNBTProps, QuillEditorRef, EditorData } from './types';
```

## Step 4: Update Package Configuration

Update `package.json`:
- Change name to `quill-editor-tnbt-v2`
- Add proper exports
- Move React to peerDependencies
- Add build scripts

## Step 5: Create Build Configuration

Update `vite.config.ts` for library mode.

## Next Steps

1. Implement the wrapper component
2. Refactor MainEditorForCreate
3. Test with examples
4. Write documentation
5. Publish to npm

