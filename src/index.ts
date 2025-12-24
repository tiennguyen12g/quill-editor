/**
 * Quill Editor TNBT v2 - Main Export File
 * 
 * This package provides a rich text editor component built on Quill
 * that can be integrated into any React application.
 */

export { default as QuillEditorTNBT } from './components/QuillEditorTNBT';
import QuillEditorTNBT_DefaultCss from './components/QuillEditorTNBT_DefaultCss';
export { QuillEditorTNBT_DefaultCss };
// Export types
export type {
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
} from './types';

// Re-export for convenience
export * from './types';

// Export utility functions
export {
  processImagesInContent,
  extractImageUrls,
  hasBase64Images,
} from './utils/imageProcessor';

