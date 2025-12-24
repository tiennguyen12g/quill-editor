# Fix: TypeScript Error for Styles Import

## Problem

When importing styles, TypeScript throws an error:
```
Error: Cannot find module or type declarations for side-effect import of '@tnbt/quill-editor/styles'.
```

## ✅ Solution Applied

1. **Created type declaration**: `src/styles.d.ts` and `dist/styles.d.ts`
2. **Updated package.json exports**: Added `types` field for styles export
3. **Rebuilt package**: Type declarations are now included

## Usage

The styles can now be imported without TypeScript errors:

```tsx
import "@tnbt/quill-editor/styles";
```

## Package.json Exports

The package now exports styles with proper TypeScript support:

```json
{
  "exports": {
    "./styles": {
      "default": "./dist/style.css",
      "types": "./dist/styles.d.ts"
    }
  }
}
```

## Verification

After rebuilding the package, TypeScript should recognize the import without errors.

If you still see errors:
1. Clear node_modules and reinstall
2. Restart TypeScript server in your IDE
3. Verify `dist/styles.d.ts` exists in the package

