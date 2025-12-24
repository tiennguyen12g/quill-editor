/**
 * Type definitions for Quill Editor TNBT v2 Package
 */

export interface EditorData {
  content: string;                   // HTML content
  plainText: string;                 // Plain text version
  images: ImageData[];               // Extracted images info
  wordCount: number;
  characterCount: number;
  metadata?: ArticleMetadata;
}

export interface ImageData {
  src: string;                       // Image URL or data URL
  alt?: string;
  width?: number;
  height?: number;
  file?: File;                       // Original file if available
}

export interface ArticleMetadata {
  title?: string;
  tags?: string[];
  coverImage?: File | string;
  category?: string;
  [key: string]: any;                 // Allow custom fields
}

export interface SaveResult {
  success: boolean;
  articleId?: string;
  message?: string;
  error?: string;
}

export interface CreateResult extends SaveResult {}
export interface UpdateResult extends SaveResult {}

export interface EditorError {
  type: 'upload' | 'save' | 'validation' | 'network';
  message: string;
  details?: any;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ToolbarConfig {
  showFont?: boolean;
  showSize?: boolean;
  showHeader?: boolean;
  showBold?: boolean;
  showItalic?: boolean;
  showUnderline?: boolean;
  showStrike?: boolean;
  showList?: boolean;
  showLink?: boolean;
  showImage?: boolean;
  showVideo?: boolean;
  showCodeBlock?: boolean;
  showFormula?: boolean;
  showCompareImage?: boolean;
  showCustomButtons?: boolean;
  // Add more as needed
}

export interface QuillEditorTNBTProps {
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
  articleMetadata?: ArticleMetadata;
  
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

export interface QuillEditorRef {
  // Content Methods
  getContent: () => string;
  getPlainText: () => string;
  setContent: (html: string) => void;
  clear: () => void;
  
  // Editor Methods
  focus: () => void;
  blur: () => void;
  getSelection: () => any;           // Quill Range type
  
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

