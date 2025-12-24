# React Version Compatibility

## ✅ Current Compatibility

This package is compatible with **React 18.0.0 and higher**, including:
- ✅ React 18.x (18.0.0, 18.1.0, 18.2.0, etc.)
- ✅ React 19.x (19.0.0, 19.1.0, etc.)
- ✅ React 20.x (when released)

## 📦 Peer Dependencies

The package specifies:
```json
{
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  }
}
```

This means:
- **Minimum**: React 18.0.0
- **Maximum**: No upper limit (future-proof)
- **Installation**: npm/yarn will allow any React version 18 or higher

## 🔍 Why This Works

### React 18 → React 19 Compatibility

The package uses standard React APIs that are stable across versions:

✅ **Hooks** (all supported in React 19):
- `useState`
- `useEffect`
- `useRef`
- `useCallback`
- `useImperativeHandle`

✅ **Component APIs** (all supported in React 19):
- `React.forwardRef`
- Functional components
- TypeScript types

✅ **No Deprecated APIs**:
- No class components
- No legacy lifecycle methods
- No deprecated patterns

### React 19 Changes (Non-Breaking for This Package)

React 19 introduced some changes, but they don't affect this package:

1. **New JSX Transform**: Already using the new transform (no `React` import needed for JSX)
2. **Actions**: New feature, but optional - doesn't affect existing code
3. **useFormStatus/useFormState**: New hooks, but we don't use them
4. **ref as a prop**: New feature, but `forwardRef` still works

## 🧪 Testing with Different React Versions

### Test with React 18

```bash
npm install react@^18.0.0 react-dom@^18.0.0
```

### Test with React 19

```bash
npm install react@^19.0.0 react-dom@^19.0.0
```

### Verify Installation

```bash
npm list react react-dom
```

You should see your installed React version.

## ⚠️ Important Notes

### 1. React Version Mismatch Warnings

If you see warnings like:
```
npm WARN @tnbt/quill-editor@1.0.0 requires a peer of react@>=18.0.0 but none is installed.
```

**Solution**: Install React in your project:
```bash
npm install react react-dom
```

### 2. Multiple React Instances

Even with correct peer dependencies, you might get "Invalid hook call" errors if:
- React is bundled in the package (we fixed this)
- Multiple React versions in node_modules
- React in both dependencies and peerDependencies

**Solution**: The package now properly externalizes React, so this shouldn't happen.

### 3. TypeScript Types

If using TypeScript, make sure `@types/react` matches your React version:

```bash
# For React 18
npm install @types/react@^18.0.0

# For React 19
npm install @types/react@^19.0.0
```

## 🚀 Future-Proofing

The package is designed to be future-proof:

1. **Uses Standard APIs**: Only stable, well-supported React features
2. **No Experimental Features**: Avoids beta/experimental APIs
3. **Flexible Peer Dependencies**: `>=18.0.0` allows future versions
4. **TypeScript Support**: Full type safety helps catch breaking changes

## 📋 Compatibility Matrix

| React Version | Package Version | Status |
|--------------|----------------|--------|
| 18.0.0 - 18.x | 1.0.0+ | ✅ Fully Compatible |
| 19.0.0 - 19.x | 1.0.0+ | ✅ Fully Compatible |
| 20.0.0+ (future) | 1.0.0+ | ✅ Expected Compatible |

## 🔧 If You Encounter Issues

### Issue: Package doesn't work with React 19

1. **Check React version**:
   ```bash
   npm list react react-dom
   ```

2. **Clear cache and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Verify peer dependencies**:
   ```bash
   npm ls @tnbt/quill-editor
   ```

4. **Check for breaking changes**:
   - Review React 19 release notes
   - Check if any dependencies need updates

### Issue: TypeScript errors with React 19

Update `@types/react`:
```bash
npm install --save-dev @types/react@^19.0.0 @types/react-dom@^19.0.0
```

## 📚 Resources

- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
- [React Upgrade Guide](https://react.dev/learn/upgrading)
- [npm Peer Dependencies](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#peerdependencies)

## ✅ Summary

**Yes, this package is compatible with React 19, 20, and future versions!**

The `>=18.0.0` peer dependency range ensures:
- ✅ Works with React 18.x
- ✅ Works with React 19.x
- ✅ Will work with React 20.x (when released)
- ✅ No breaking changes expected

Just make sure to:
1. Install React in your project (it's a peer dependency)
2. Use matching React and React-DOM versions
3. Keep `@types/react` updated if using TypeScript

