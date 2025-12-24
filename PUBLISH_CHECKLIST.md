# Pre-Publish Checklist

Use this checklist before publishing to npm.

## ✅ Package Configuration

- [ ] Update `package.json`:
  - [ ] Set unique package name (check availability: `npm view package-name`)
  - [ ] Set version (start with `1.0.0` for first release)
  - [ ] Add author name and email
  - [ ] Add repository URL (if using GitHub/GitLab)
  - [ ] Verify `files` array includes only `dist` and `README.md`
  - [ ] Verify `main`, `module`, `types` point to correct files
  - [ ] Verify `peerDependencies` are correct (React, React-DOM)
  - [ ] Move unnecessary dependencies to `devDependencies` or remove

## ✅ Build

- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Run `npm run build:lib` to build the package
- [ ] Verify `dist/` folder contains:
  - [ ] `index.js` (ES module)
  - [ ] `index.cjs` (CommonJS)
  - [ ] `index.d.ts` (TypeScript definitions)
  - [ ] `style.css` (if styles are included)

## ✅ Testing

- [ ] Test locally using `npm link`:
  ```bash
  # In package directory
  npm link
  
  # In test project
  npm link quill-editor-tnbt-v2
  ```
- [ ] Verify import works: `import { QuillEditorTNBT } from 'quill-editor-tnbt-v2'`
- [ ] Test create functionality
- [ ] Test edit functionality
- [ ] Test image upload
- [ ] Verify TypeScript types work

## ✅ Documentation

- [ ] README.md is complete and accurate
- [ ] Examples in README work
- [ ] API documentation is clear
- [ ] Installation instructions are correct

## ✅ Code Quality

- [ ] No console.log statements (or remove before publish)
- [ ] No debug code
- [ ] No test files in dist/
- [ ] No sensitive information in code

## ✅ NPM Account

- [ ] Create npm account at https://www.npmjs.com/signup
- [ ] Verify email address
- [ ] Enable 2FA (recommended)
- [ ] Login: `npm login`
- [ ] Verify: `npm whoami`

## ✅ Final Steps

- [ ] Check package name availability: `npm view quill-editor-tnbt-v2`
- [ ] Update version if needed: `npm version patch|minor|major`
- [ ] Dry run: `npm publish --dry-run`
- [ ] Review what will be published
- [ ] Publish: `npm publish`
- [ ] Verify on npmjs.com: https://www.npmjs.com/package/quill-editor-tnbt-v2

## 🚨 Important Notes

1. **Package Name**: Make sure `quill-editor-tnbt-v2` is available. If not, choose another name.

2. **Dependencies**: Many dependencies in your `package.json` might not be needed by consumers. Consider:
   - Moving to `peerDependencies` if optional
   - Moving to `devDependencies` if only used in development
   - Removing if not used

3. **First Publish**: 
   - Start with version `1.0.0`
   - Test thoroughly before publishing
   - Consider publishing as `@your-username/quill-editor-tnbt-v2` first (scoped package)

4. **After Publish**:
   - Create a git tag: `git tag v1.0.0 && git push --tags`
   - Create GitHub release (if using GitHub)
   - Share on social media/communities

## 📋 Quick Publish Commands

```bash
# 1. Build
npm run build:lib

# 2. Check what will be published
npm publish --dry-run

# 3. Login (if not already)
npm login

# 4. Publish
npm publish

# 5. Verify
npm view quill-editor-tnbt-v2
```

## 🔄 Update Package (Future)

```bash
# 1. Make changes
# 2. Update version
npm version patch  # or minor, or major

# 3. Rebuild
npm run build:lib

# 4. Publish
npm publish
```

