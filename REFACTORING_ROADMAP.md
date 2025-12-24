# Refactoring Roadmap: Package Conversion

## Summary

This document outlines the plan to convert `quill-editor-tnbt-v2` from an application-specific component into a reusable npm package.

## Current State

**Problems:**
- ❌ Hardcoded save methods (Firestore, MongoDB)
- ❌ Tightly coupled to specific use cases
- ❌ Uses `useImperativeHandle` with complex ref API
- ❌ SessionStorage dependencies
- ❌ Not easily reusable

## Target State

**Goals:**
- ✅ Callback-based API (flexible backend integration)
- ✅ Props-driven configuration
- ✅ TypeScript-first with full type safety
- ✅ Support for create, edit, and readonly modes
- ✅ Easy integration with any backend
- ✅ Published as npm package

## Proposed API Design

### Core Concept: Callback-Based Architecture

Instead of the editor handling save operations internally, it exposes callbacks that the parent component implements:

```typescript
// ❌ OLD: Editor handles saving internally
await editorRef.current.handleStore_In_Mongodb(title, tags, image);

// ✅ NEW: Parent handles saving via callback
<QuillEditorTNBT
  onCreate={async (data) => {
    // Your custom save logic
    return { success: true, articleId: '123' };
  }}
/>
```

### Key Props

1. **Content Management**
   - `value` / `defaultValue` - Controlled/uncontrolled content
   - `onChange` - Content change callback

2. **Save Operations**
   - `onCreate` - Create new article
   - `onUpdate` - Update existing article
   - `onSave` - Generic save operation

3. **Image Handling**
   - `onImageUpload` - Upload image, return URL
   - `defaultImageWidth` - Default image size

4. **Metadata**
   - `articleMetadata` - Title, tags, etc.

5. **Callbacks**
   - `onSuccess` - Success notifications
   - `onError` - Error handling
   - `onModeChange` - Mode switching

## Implementation Steps

### Phase 1: Type Definitions ✅
- [x] Create `src/types/index.ts` with all interfaces
- [x] Define `QuillEditorTNBTProps`
- [x] Define `QuillEditorRef`
- [x] Define `EditorData`, `ImageData`, etc.

### Phase 2: Wrapper Component
- [ ] Create `QuillEditorTNBT.tsx` wrapper
- [ ] Implement callback handling
- [ ] Add mode switching logic
- [ ] Integrate with MainEditorForCreate

### Phase 3: Refactor MainEditorForCreate
- [ ] Remove hardcoded save methods
- [ ] Add `onImageUpload` prop support
- [ ] Update `handleCustomImageDefault` to use callback
- [ ] Make toolbar configurable
- [ ] Remove sessionStorage dependencies (make optional)

### Phase 4: Package Configuration
- [ ] Update `package.json`:
  - Change name to `quill-editor-tnbt-v2`
  - Add proper exports
  - Move React to peerDependencies
- [ ] Create `src/index.ts` for exports
- [ ] Update `vite.config.ts` for library build
- [ ] Add build scripts

### Phase 5: Documentation
- [ ] Write README.md
- [ ] Add JSDoc comments
- [ ] Create migration guide
- [ ] Add examples

### Phase 6: Testing
- [ ] Test with different backends (REST, GraphQL, Firebase)
- [ ] Test create/edit modes
- [ ] Test image uploads
- [ ] Test validation

### Phase 7: Publishing
- [ ] Build package
- [ ] Test locally with `npm link`
- [ ] Publish to npm
- [ ] Create GitHub releases

## Migration Strategy

### For Existing Users

**Before:**
```typescript
<MainEditorForCreate
  ref={editorRef}
  documentValue={content}
  setDocumentValue={setContent}
/>

// Save
await editorRef.current.handleStore_In_Mongodb(title, tags, image);
```

**After:**
```typescript
<QuillEditorTNBT
  ref={editorRef}
  value={content}
  onChange={setContent}
  onCreate={async (data) => {
    // Your save logic
    return { success: true };
  }}
/>

// Or save via ref
await editorRef.current.create();
```

## Benefits

1. **Flexibility**: Works with any backend
2. **Testability**: Easy to mock callbacks
3. **Type Safety**: Full TypeScript support
4. **Reusability**: One package, many use cases
5. **Maintainability**: Clear separation of concerns

## Files Created

1. ✅ `PACKAGE_API_DESIGN.md` - Complete API specification
2. ✅ `IMPLEMENTATION_GUIDE.md` - Step-by-step implementation
3. ✅ `USAGE_EXAMPLES.md` - Real-world examples
4. ✅ `src/types/index.ts` - TypeScript definitions
5. ✅ `REFACTORING_ROADMAP.md` - This file

## Next Actions

1. Review the API design with team
2. Start Phase 2: Create wrapper component
3. Test with existing codebase
4. Iterate based on feedback

## Questions to Consider

1. Should we maintain backward compatibility?
2. Do we need a migration script?
3. What's the minimum React version?
4. Should we support SSR?
5. Do we need a CSS-in-JS solution?

## Timeline Estimate

- Phase 1: ✅ Complete
- Phase 2-3: 2-3 days
- Phase 4: 1 day
- Phase 5: 1-2 days
- Phase 6: 2-3 days
- Phase 7: 1 day

**Total: ~1-2 weeks**

