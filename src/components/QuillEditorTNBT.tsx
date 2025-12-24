import React, { useState, useRef, useImperativeHandle, useCallback, useEffect } from "react";
import MainEditorForCreate from "./MainEditorForCreate";
import Preview2 from "./Preview2";
import { QuillEditorTNBTProps, QuillEditorRef, EditorData, ImageData } from "../types";

const QuillEditorTNBT = React.forwardRef<QuillEditorRef, QuillEditorTNBTProps>((props, ref) => {
  const {
    value,
    defaultValue,
    onChange,
    onContentChange,
    mode = "create",
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
  const [content, setContent] = useState(value || defaultValue || "");
  const [currentMode, setCurrentMode] = useState<"write" | "preview">("write");
  const [switchCount, setSwitchCount] = useState(0);
  const editorRef = useRef<any>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const contentChangeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with controlled value prop
  useEffect(() => {
    if (value !== undefined) {
      setContent(value);
    }
  }, [value]);

  // Handle content changes - matches Dispatch<SetStateAction<string | null>>
  const handleContentChange = useCallback<React.Dispatch<React.SetStateAction<string | null>>>(
    (newContent) => {
      const contentValue = typeof newContent === "function" ? newContent(content) : newContent || "";
      if (contentValue !== null) {
        setContent(contentValue);
        onChange?.(contentValue);

        // Debounced onContentChange
        if (onContentChange) {
          clearTimeout(contentChangeTimerRef.current as NodeJS.Timeout);
          contentChangeTimerRef.current = setTimeout(() => {
            onContentChange(contentValue);
          }, 500);
        }
      }
    },
    [onChange, onContentChange, content]
  );

  // Utility: Extract plain text from HTML
  const extractPlainText = useCallback((html: string): string => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }, []);

  // Utility: Extract images from HTML
  const extractImages = useCallback((html: string): ImageData[] => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const imgElements = div.querySelectorAll("img");
    const images: ImageData[] = [];

    imgElements.forEach((img) => {
      images.push({
        src: img.getAttribute("src") || "",
        alt: img.getAttribute("alt") || "",
        width: img.width || undefined,
        height: img.height || undefined,
      });
    });

    return images;
  }, []);

  // Utility: Get word count
  const getWordCount = useCallback((text: string): number => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }, []);

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
  }, [content, articleMetadata, extractPlainText, extractImages, getWordCount]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && onAutoSave && content) {
      const timer = setInterval(async () => {
        try {
          await onAutoSave(getEditorData());
        } catch (error: any) {
          onError?.({
            type: "save",
            message: "Auto-save failed",
            details: error,
          });
        }
      }, autoSaveInterval);

      return () => clearInterval(timer);
    }
  }, [autoSave, onAutoSave, content, autoSaveInterval, getEditorData, onError]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      if (contentChangeTimerRef.current) {
        clearTimeout(contentChangeTimerRef.current);
      }
    };
  }, []);

  // Expose methods via ref
  useImperativeHandle(
    ref,
    () => ({
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
        setContent("");
        if (editorRef.current && typeof editorRef.current.getEditor === "function") {
          const quill = editorRef.current.getEditor();
          if (quill) {
            quill.setText("");
          }
        }
      },
      focus: () => {
        if (editorRef.current && typeof editorRef.current.getEditor === "function") {
          const quill = editorRef.current.getEditor();
          if (quill) {
            quill.focus();
          }
        }
      },
      blur: () => {
        if (editorRef.current && typeof editorRef.current.getEditor === "function") {
          const quill = editorRef.current.getEditor();
          if (quill) {
            quill.blur();
          }
        }
      },
      getSelection: () => {
        if (editorRef.current && typeof editorRef.current.getEditor === "function") {
          const quill = editorRef.current.getEditor();
          if (quill) {
            return quill.getSelection();
          }
        }
        return null;
      },
      save: async () => {
        if (!onSave) {
          throw new Error("onSave callback not provided");
        }
        try {
          const result = await onSave(getEditorData());
          if (result.success) {
            onSuccess?.(result.message || "Saved successfully");
          } else {
            onError?.({
              type: "save",
              message: result.error || "Save failed",
            });
          }
          return result;
        } catch (error: any) {
          onError?.({
            type: "save",
            message: error.message || "Save failed",
            details: error,
          });
          throw error;
        }
      },
      create: async () => {
        if (!onCreate) {
          throw new Error("onCreate callback not provided");
        }
        try {
          // Get the latest content directly from the editor to ensure we have the most recent changes
          let latestContent = content;
          
          // Try to get content directly from editor if available
          if (editorRef.current && typeof editorRef.current.getEditor === "function") {
            try {
              const quill = editorRef.current.getEditor();
              if (quill && quill.root) {
                const editorContent = quill.root.innerHTML;
                if (editorContent && editorContent.trim().length > 0) {
                  latestContent = editorContent;
                  console.log("📝 Create: Got content from editor, length:", latestContent.length);
                }
              }
            } catch (e) {
              console.warn("Could not get content from editor, using state:", e);
            }
          }

          console.log("📝 Creating article:");
          console.log("  Content length:", latestContent.length);
          console.log("  Content preview:", latestContent.substring(0, 100));

          // Create editor data with latest content
          const plainText = extractPlainText(latestContent);
          const images = extractImages(latestContent);
          const editorData: EditorData = {
            content: latestContent,
            plainText,
            images,
            wordCount: getWordCount(plainText),
            characterCount: latestContent.length,
            metadata: articleMetadata,
          };

          console.log("  Word count:", editorData.wordCount);

          const result = await onCreate(editorData);
          if (result.success) {
            onSuccess?.(result.message || "Article created successfully");
          } else {
            onError?.({
              type: "save",
              message: result.error || "Create failed",
            });
          }
          return result;
        } catch (error: any) {
          onError?.({
            type: "save",
            message: error.message || "Create failed",
            details: error,
          });
          throw error;
        }
      },
      update: async (articleId: string) => {
        if (!onUpdate) {
          throw new Error("onUpdate callback not provided");
        }
        try {
          // Get the latest content directly from the editor to ensure we have the most recent changes
          let latestContent = content;
          
          // Try to get content directly from editor if available
          if (editorRef.current && typeof editorRef.current.getEditor === "function") {
            try {
              const quill = editorRef.current.getEditor();
              if (quill && quill.root) {
                const editorContent = quill.root.innerHTML;
                if (editorContent && editorContent.trim().length > 0) {
                  latestContent = editorContent;
                  console.log("📝 Update: Got content from editor, length:", latestContent.length);
                }
              }
            } catch (e) {
              console.warn("Could not get content from editor, using state:", e);
            }
          }

          console.log("📝 Updating article:", articleId);
          console.log("  Content length:", latestContent.length);
          console.log("  Content preview:", latestContent.substring(0, 100));

          // Create editor data with latest content
          const plainText = extractPlainText(latestContent);
          const images = extractImages(latestContent);
          const editorData: EditorData = {
            content: latestContent,
            plainText,
            images,
            wordCount: getWordCount(plainText),
            characterCount: latestContent.length,
            metadata: articleMetadata,
          };

          const result = await onUpdate(editorData, articleId);
          if (result.success) {
            onSuccess?.(result.message || "Article updated successfully");
          } else {
            onError?.({
              type: "save",
              message: result.error || "Update failed",
            });
          }
          return result;
        } catch (error: any) {
          onError?.({
            type: "save",
            message: error.message || "Update failed",
            details: error,
          });
          throw error;
        }
      },
      switchToPreview: () => {
        setCurrentMode("preview");
        if (editorRef.current) {
          editorRef.current.moveDocumentToPreview();
        }
        onModeChange?.("preview");
      },
      switchToWrite: () => {
        setCurrentMode("write");
        onModeChange?.("write");
      },
      insertImage: (url: string, width?: number) => {
        if (editorRef.current) {
          const quill = editorRef.current.getEditor();
          const selection = quill.getSelection();
          const position = selection ? selection.index : quill.getLength();
          quill.insertEmbed(position, "image", url);

          // Set width after insertion
          setTimeout(() => {
            const qlEditor = document.querySelector(".ql-editor");
            if (qlEditor) {
              const imgElements = qlEditor.querySelectorAll("img");
              const lastImg = imgElements[imgElements.length - 1] as HTMLImageElement;
              if (lastImg) {
                lastImg.style.width = `${width || defaultImageWidth}px`;
                lastImg.style.height = "auto";
                lastImg.style.maxWidth = "100%";
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
          errors.push("Content cannot be empty");
        }

        if (content.length < 50) {
          warnings.push("Content is very short");
        }

        return {
          valid: errors.length === 0,
          errors,
          warnings,
        };
      },
    }),
    [
      content,
      getEditorData,
      onSave,
      onCreate,
      onUpdate,
      onError,
      onSuccess,
      onModeChange,
      defaultImageWidth,
      editorRef,
      extractPlainText,
      extractImages,
      getWordCount,
    ]
  );

  // Handle mode switching
  const handleWrite = () => {
    setCurrentMode("write");
    onModeChange?.("write");
  };

  const handlePreview = () => {
    setCurrentMode("preview");
    if (editorRef.current) {
      editorRef.current.moveDocumentToPreview();
    }
    onModeChange?.("preview");
  };

  // Render readonly mode
  if (mode === "readonly") {
    return (
      <div className={className}>
        <Preview2 documentValue={content} setDocumentValue={() => {}} />
      </div>
    );
  }

  return (
    <div className={className}>
      {showPreview && (
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <button
            onClick={handleWrite}
            style={{
              padding: "5px 10px",
              backgroundColor: currentMode === "write" ? "#1b75aa" : "transparent",
              color: currentMode === "write" ? "white" : "black",
              border: "1px solid #ccc",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Write
          </button>
          <button
            onClick={handlePreview}
            style={{
              padding: "5px 10px",
              backgroundColor: currentMode === "preview" ? "#1b75aa" : "transparent",
              color: currentMode === "preview" ? "white" : "black",
              border: "1px solid #ccc",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Preview
          </button>
        </div>
      )}

      {currentMode === "write" ? (
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
});

QuillEditorTNBT.displayName = "QuillEditorTNBT";

export default QuillEditorTNBT;
