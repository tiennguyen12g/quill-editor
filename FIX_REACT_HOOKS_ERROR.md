# Fix: Invalid Hook Call Error

## Problem

When using the package in another project, you get:
```
Warning: Invalid hook call. Hooks can only be called inside of the body of a function component.
```

This happens because **React was bundled into the package** instead of being treated as a peer dependency, causing multiple React instances.

## Root Cause

React and React-DOM were in `dependencies` instead of only in `peerDependencies`. This caused them to be bundled with the package.

## Solution Applied

1. **Moved React/React-DOM to devDependencies**: They're only needed for development/testing
2. **Kept React/React-DOM in peerDependencies**: Consumers must provide their own React
3. **Removed react-router-dom from dependencies**: It's only used in examples, not in the package
4. **Enhanced Vite external config**: Added regex patterns to catch all React imports

## After Fixing

1. **Rebuild the package**:
   ```bash
   npm run build:lib
   ```

2. **Reinstall in your project**:
   ```bash
   # In your project
   npm uninstall @tnbt/quill-editor
   npm install /path/to/quill-editor-tnbt-v2
   # OR if published:
   npm install @tnbt/quill-editor@latest
   ```

3. **Verify React versions match**:
   ```bash
   # In your project
   npm list react react-dom
   ```
   
   Both your project and the package should use the same React version (^18.0.0).

## Verification

After rebuilding and reinstalling, the error should be gone. The package will now use your project's React instance instead of bundling its own.

## If Error Persists

1. **Clear node_modules and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check for duplicate React**:
   ```bash
   npm ls react
   ```
   
   You should only see ONE React instance.

3. **Check package.json in your project**:
   Make sure you have React and React-DOM installed:
   ```json
   {
     "dependencies": {
       "react": "^18.0.0",
       "react-dom": "^18.0.0"
     }
   }
   ```

