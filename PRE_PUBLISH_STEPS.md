# Pre-Publish Steps

## 1. Update package.json

Before publishing, update these fields in `package.json`:

```json
{
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/quill-editor-tnbt-v2.git"
  }
}
```

## 2. Clean Dependencies

Your current `package.json` has many dependencies that might not be needed by consumers. Consider:

### Move to peerDependencies (if optional):
- `react-icons` (if used in exported components)
- `classnames` (if used in exported components)

### Remove (if not used in exported code):
- `@chakra-ui/react`
- `@emotion/*`
- `@react-oauth/google`
- `@tippyjs/react`
- `@tiptap/*`
- `bootstrap`
- `draft-*`
- `firebase`
- `framer-motion`
- `googleapis`
- `jwt-decode`
- `react-bootstrap`
- `react-draft-wysiwyg`
- `react-router-dom`
- `react-tooltip`
- `slate*`

### Keep (required for package):
- `react-quill`
- `quill-image-drop-module`
- `quill-image-resize-module-react`
- `quill-delta`
- `classnames` (if used)
- `react-icons` (if used in exported components)

## 3. Recommended package.json Structure

```json
{
  "name": "quill-editor-tnbt-v2",
  "version": "1.0.0",
  "description": "A rich text editor component built on Quill",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist", "README.md"],
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "dependencies": {
    "react-quill": "^2.0.0",
    "quill-image-drop-module": "^1.0.3",
    "quill-image-resize-module-react": "^3.0.0",
    "quill-delta": "^5.1.0",
    "classnames": "^2.3.2",
    "react-icons": "^4.12.0"
  }
}
```

## 4. Build and Test

```bash
# Build
npm run build:lib

# Test locally
npm link
# In another project: npm link quill-editor-tnbt-v2
```

## 5. Final Check

- [ ] All unnecessary dependencies removed
- [ ] Only essential dependencies remain
- [ ] Build succeeds
- [ ] Test import works
- [ ] README is complete
- [ ] Author and repository filled

Then proceed with publish!

