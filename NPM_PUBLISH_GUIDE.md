# NPM Publish Guide for Quill Editor TNBT v2

Complete guide to publish `quill-editor-tnbt-v2` to npm.

## Prerequisites

1. **NPM Account**: Create one at https://www.npmjs.com/signup
2. **Node.js & NPM**: Ensure you have Node.js installed (v16+ recommended)
3. **Git Repository**: Your code should be in a git repository (optional but recommended)

## Step 1: Prepare Package Configuration

### 1.1 Update package.json

Make sure your `package.json` has:

```json
{
  "name": "quill-editor-tnbt-v2",
  "version": "1.0.0",
  "description": "A rich text editor component built on Quill that can be integrated into any React application",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "keywords": ["quill", "editor", "rich-text", "react", "wysiwyg"],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/quill-editor-tnbt-v2.git"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

### 1.2 Create .npmignore (Optional)

Create `.npmignore` to exclude files from the package:

```
# Development files
src/
test-server/
node_modules/
*.md
!README.md
.git/
.gitignore
.env
.env.example

# Build files (keep dist/)
*.log
.DS_Store
coverage/
.idea/
.vscode/

# Config files
vite.config.ts
tsconfig.json
tsconfig.node.json
eslint.config.js
```

### 1.3 Create README.md

Create a comprehensive README.md for npm:

```markdown
# Quill Editor TNBT v2

A rich text editor component built on Quill that can be integrated into any React application.

## Installation

\`\`\`bash
npm install quill-editor-tnbt-v2
# or
yarn add quill-editor-tnbt-v2
\`\`\`

## Quick Start

\`\`\`tsx
import { QuillEditorTNBT } from 'quill-editor-tnbt-v2';
import 'quill-editor-tnbt-v2/dist/style.css';

function MyEditor() {
  const handleCreate = async (data) => {
    // Your save logic
    return { success: true, articleId: '123' };
  };

  return (
    <QuillEditorTNBT
      onCreate={handleCreate}
      onImageUpload={async (file) => {
        // Your image upload logic
        return 'https://example.com/image.jpg';
      }}
    />
  );
}
\`\`\`

## Documentation

See [full documentation](./docs/README.md)

## License

MIT
```

## Step 2: Build the Package

### 2.1 Install Dependencies

```bash
npm install
```

### 2.2 Build the Library

```bash
npm run build:lib
```

This will create:
- `dist/index.js` - ES module
- `dist/index.cjs` - CommonJS
- `dist/index.d.ts` - TypeScript definitions
- `dist/style.css` - Styles (if any)

### 2.3 Verify Build

Check that `dist/` folder contains all necessary files:

```bash
ls -la dist/
```

## Step 3: Test Locally (Optional but Recommended)

### 3.1 Create Test Project

```bash
# In a different directory
mkdir test-quill-editor
cd test-quill-editor
npm init -y
npm install react react-dom
```

### 3.2 Link Your Package

```bash
# In your package directory
npm link

# In test project directory
npm link quill-editor-tnbt-v2
```

### 3.3 Test Import

```tsx
// test-quill-editor/src/App.tsx
import { QuillEditorTNBT } from 'quill-editor-tnbt-v2';

function App() {
  return <QuillEditorTNBT onCreate={async () => ({ success: true })} />;
}
```

## Step 4: Login to NPM

### 4.1 Check Current User

```bash
npm whoami
```

If not logged in, you'll see an error.

### 4.2 Login

```bash
npm login
```

Enter your:
- Username
- Password
- Email
- OTP (if 2FA is enabled)

### 4.3 Verify Login

```bash
npm whoami
# Should show your username
```

## Step 5: Check Package Name Availability

### 5.1 Check if Name is Taken

```bash
npm view quill-editor-tnbt-v2
```

If package doesn't exist, you'll see:
```
npm ERR! code E404
```

If it exists, you'll see package info. In that case, choose a different name.

### 5.2 Update package.json if Needed

If the name is taken, update `package.json`:

```json
{
  "name": "@your-username/quill-editor-tnbt-v2"
}
```

Or choose a different name like `quill-editor-tnbt-v2-editor`.

## Step 6: Version Management

### 6.1 Current Version

Check your current version in `package.json`:

```json
{
  "version": "1.0.0"
}
```

### 6.2 Semantic Versioning

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backward compatible
- **PATCH** (0.0.1): Bug fixes, backward compatible

### 6.3 Update Version

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

This automatically updates `package.json` and creates a git tag.

## Step 7: Publish to NPM

### 7.1 Dry Run (Test Without Publishing)

```bash
npm publish --dry-run
```

This shows what would be published without actually publishing.

### 7.2 Publish Public Package

```bash
npm publish
```

### 7.3 Publish Scoped Package (if using @username/package-name)

```bash
npm publish --access public
```

### 7.4 Verify Publication

```bash
npm view quill-editor-tnbt-v2
```

You should see your package information.

## Step 8: Install and Test

### 8.1 Install from NPM

In a test project:

```bash
npm install quill-editor-tnbt-v2
```

### 8.2 Test Import

```tsx
import { QuillEditorTNBT } from 'quill-editor-tnbt-v2';
```

## Step 9: Update Package (Future Versions)

### 9.1 Make Changes

Make your code changes.

### 9.2 Update Version

```bash
npm version patch  # or minor, or major
```

### 9.3 Rebuild

```bash
npm run build:lib
```

### 9.4 Publish

```bash
npm publish
```

## Troubleshooting

### Error: "You must verify your email"

1. Check your email for verification link
2. Click the link
3. Try publishing again

### Error: "Package name already exists"

- Choose a different name
- Or use scoped package: `@your-username/package-name`

### Error: "403 Forbidden"

- Check if you're logged in: `npm whoami`
- Verify package name ownership
- Check if 2FA is required

### Error: "Invalid package.json"

- Verify all required fields are present
- Check JSON syntax
- Ensure `files` array includes `dist/`

### Build Errors

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build:lib
```

## Best Practices

### 1. Version Management

- Use semantic versioning
- Update version before each publish
- Tag releases in git

### 2. Documentation

- Write clear README.md
- Include examples
- Document all props and methods
- Add TypeScript types

### 3. Testing

- Test locally before publishing
- Test installation in a fresh project
- Test with different React versions

### 4. Security

- Enable 2FA on npm account
- Don't commit `.npmrc` with tokens
- Review dependencies regularly

### 5. Maintenance

- Keep dependencies updated
- Fix bugs promptly
- Respond to issues
- Document breaking changes

## Package.json Checklist

Before publishing, ensure:

- [ ] `name` is unique and available
- [ ] `version` follows semantic versioning
- [ ] `description` is clear and concise
- [ ] `main`, `module`, `types` point to correct files
- [ ] `files` array includes only necessary files
- [ ] `keywords` are relevant for discovery
- [ ] `author` and `license` are set
- [ ] `repository` URL is correct (if applicable)
- [ ] `peerDependencies` are correct
- [ ] `dependencies` vs `peerDependencies` are properly separated

## Post-Publish Checklist

- [ ] Package appears on npmjs.com
- [ ] Can install with `npm install`
- [ ] TypeScript types work
- [ ] Documentation is accessible
- [ ] Examples work
- [ ] No console errors

## Common Commands Reference

```bash
# Check npm user
npm whoami

# Login to npm
npm login

# Check package availability
npm view package-name

# Build package
npm run build:lib

# Dry run publish
npm publish --dry-run

# Publish
npm publish

# Update version
npm version patch|minor|major

# View published package
npm view package-name

# Unpublish (within 72 hours)
npm unpublish package-name@version
```

## Next Steps After Publishing

1. **Create GitHub Release**: Tag the version in git
2. **Update Documentation**: Keep docs in sync
3. **Monitor Usage**: Check npm download stats
4. **Handle Issues**: Respond to bug reports
5. **Plan Updates**: Roadmap for future versions

## Support

If you encounter issues:
- Check npm status: https://status.npmjs.org/
- Review npm docs: https://docs.npmjs.com/
- Check package.json syntax
- Verify build output

---

**Good luck with your publication! 🚀**

