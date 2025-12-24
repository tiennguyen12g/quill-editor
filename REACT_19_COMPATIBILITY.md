# React 19 Compatibility Fix

## ⚠️ Issue

When using this package with **React 19**, you may encounter this error:

```
Uncaught TypeError: ku.default.findDOMNode is not a function
```

This happens because `react-quill` (a dependency) uses `ReactDOM.findDOMNode`, which was **removed in React 19**.

## ✅ Solutions

### Solution 1: Add findDOMNode Polyfill (Recommended)

Add this polyfill to your app's entry point (e.g., `main.tsx` or `App.tsx`) **BEFORE** importing the editor:

```tsx
// main.tsx or App.tsx
import React from 'react';
import ReactDOM from 'react-dom';

// Polyfill for React 19 compatibility
if (!ReactDOM.findDOMNode) {
  ReactDOM.findDOMNode = function(componentOrElement: any): Element | Text | null {
    if (!componentOrElement) return null;
    
    // If it's a DOM element, return it
    if (componentOrElement.nodeType === 1 || componentOrElement.nodeType === 3) {
      return componentOrElement;
    }
    
    // Try to get from ref
    if (componentOrElement.current) {
      return componentOrElement.current;
    }
    
    // Try to get from stateNode (React internal)
    if (componentOrElement.stateNode) {
      return componentOrElement.stateNode;
    }
    
    return null;
  };
}

// Now import your app
import App from './App';
```

### Solution 2: Use react-quill-new (Alternative)

Replace `react-quill` with a React 19-compatible fork:

**Note**: This requires modifying the package source code. If you're using the published package, use Solution 1 instead.

### Solution 3: Downgrade to React 18 (Not Recommended)

If you can't use the polyfill, downgrade to React 18:

```bash
npm install react@^18.2.0 react-dom@^18.2.0
```

However, this is **not recommended** if you need React 19 features.

## 🔧 Quick Fix for Your Project

Create a file `src/utils/react19-polyfill.ts`:

```typescript
// react19-polyfill.ts
import ReactDOM from 'react-dom';

if (!ReactDOM.findDOMNode) {
  (ReactDOM as any).findDOMNode = function(componentOrElement: any): Element | Text | null {
    if (!componentOrElement) return null;
    
    if (componentOrElement.nodeType === 1 || componentOrElement.nodeType === 3) {
      return componentOrElement;
    }
    
    if (componentOrElement.current) {
      return componentOrElement.current;
    }
    
    if (componentOrElement.stateNode) {
      return componentOrElement.stateNode;
    }
    
    return null;
  };
}
```

Then import it in your `main.tsx` **before** any other imports:

```tsx
// main.tsx
import './utils/react19-polyfill'; // ← Import FIRST
import React from 'react';
import ReactDOM from 'react-dom/client';
// ... rest of your imports
```

## 📋 Complete Example

```tsx
// main.tsx
import './utils/react19-polyfill'; // Polyfill for React 19

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@tnbt/quill-editor/styles'; // Don't forget CSS!

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## 🧪 Testing

After adding the polyfill:

1. **Clear cache and restart dev server**:
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

2. **Verify it works**: The editor should load without errors.

3. **Check console**: No more `findDOMNode is not a function` errors.

## 🔍 Why This Works

- React 19 removed `findDOMNode` because it's deprecated
- `react-quill` still uses it internally
- The polyfill provides a compatibility layer
- It uses refs and stateNode to find DOM elements (React 19 compatible approach)

## ⚠️ Important Notes

1. **Import Order Matters**: The polyfill must be imported **before** any `react-quill` imports
2. **TypeScript**: You may need to cast `ReactDOM` to `any` for the polyfill
3. **Future**: When `react-quill` is updated to support React 19, this polyfill can be removed

## 📚 Related Issues

- [react-quill #1037](https://github.com/zenoamaro/react-quill/issues/1037) - React 19 compatibility
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19) - Breaking changes

## ✅ Verification Checklist

- [ ] Polyfill imported before other React imports
- [ ] No `findDOMNode is not a function` errors
- [ ] Editor renders correctly
- [ ] All editor features work (typing, images, etc.)
- [ ] No console warnings

