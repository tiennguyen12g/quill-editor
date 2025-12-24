# Quick Publish Guide

## 🚀 Fast Track to NPM

### Step 1: Prepare Package

```bash
# 1. Update package.json (add author, repository if needed)
# Edit package.json and add:
#   "author": "Your Name <your.email@example.com>",
#   "repository": { "type": "git", "url": "https://github.com/yourusername/quill-editor-tnbt-v2.git" }

# 2. Check if package name is available
npm view quill-editor-tnbt-v2

# If it exists, choose a different name or use scoped: @your-username/quill-editor-tnbt-v2
```

### Step 2: Build

```bash
# Install dependencies
npm install

# Build the library
npm run build:lib

# Verify dist/ folder exists with files
ls dist/
```

### Step 3: Login to NPM

```bash
# Login (create account at npmjs.com if needed)
npm login

# Verify
npm whoami
```

### Step 4: Publish

```bash
# Test what will be published (dry run)
npm publish --dry-run

# If everything looks good, publish
npm publish

# For scoped packages (@username/package-name)
npm publish --access public
```

### Step 5: Verify

```bash
# Check your package on npm
npm view quill-editor-tnbt-v2

# Or visit: https://www.npmjs.com/package/quill-editor-tnbt-v2
```

## 📝 Before Publishing Checklist

- [ ] Package name is available
- [ ] Version is set (start with 1.0.0)
- [ ] Author field is filled
- [ ] Build succeeds: `npm run build:lib`
- [ ] `dist/` folder has all files
- [ ] README.md is complete
- [ ] Tested locally with `npm link`

## 🔄 Update Version

```bash
# Patch (1.0.0 -> 1.0.1)
npm version patch

# Minor (1.0.0 -> 1.1.0)
npm version minor

# Major (1.0.0 -> 2.0.0)
npm version major

# Then rebuild and publish
npm run build:lib
npm publish
```

## ⚠️ Common Issues

**"Package name already exists"**
- Use scoped package: `@your-username/quill-editor-tnbt-v2`
- Or choose different name

**"403 Forbidden"**
- Check if logged in: `npm whoami`
- Verify email is confirmed
- Check 2FA settings

**"Invalid package.json"**
- Check JSON syntax
- Verify required fields

## 📦 What Gets Published

Only files in `dist/` and `README.md` (as specified in `files` array in package.json).

## 🎯 After Publishing

1. Test installation:
   ```bash
   npm install quill-editor-tnbt-v2
   ```

2. Create git tag:
   ```bash
   git tag v1.0.0
   git push --tags
   ```

3. Share your package! 🎉

