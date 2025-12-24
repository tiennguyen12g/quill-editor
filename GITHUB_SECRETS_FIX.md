# Fix GitHub Push Protection - Secrets in Git History

GitHub detected Google OAuth Client IDs in your git history and is blocking the push.

## Problem

GitHub found secrets in these files (in git history):
- `src/Pages/Profile/Profile.tsx:17`
- `src/Utilitys/GoogleDrive/UploadToDrive.tsx:15`
- `src/Utilitys/Profile/Profile.tsx:17`

## Solutions

### Option 1: Remove Secrets from Git History (Recommended)

**⚠️ WARNING**: This rewrites git history. Only do this if:
- You haven't shared this repo with others yet
- Or you coordinate with your team

#### Step 1: Remove Files from Git (Keep Locally)

```bash
# Remove from git but keep locally (if files exist)
git rm --cached src/Pages/Profile/Profile.tsx
git rm --cached src/Utilitys/GoogleDrive/UploadToDrive.tsx
git rm --cached src/Utilitys/Profile/Profile.tsx
```

#### Step 2: Add to .gitignore

Add to `.gitignore`:
```
# Secrets and sensitive files
src/Pages/Profile/
src/Utilitys/GoogleDrive/
src/Utilitys/Profile/
*.env
*.env.local
.env*
```

#### Step 3: Remove from Git History

**Option A: Using git filter-branch (for specific files)**

```bash
# Remove secrets from all commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch src/Pages/Profile/Profile.tsx src/Utilitys/GoogleDrive/UploadToDrive.tsx src/Utilitys/Profile/Profile.tsx" \
  --prune-empty --tag-name-filter cat -- --all
```

**Option B: Using BFG Repo-Cleaner (Easier)**

1. Download BFG: https://rtyley.github.io/bfg-repo-cleaner/
2. Create a file `secrets.txt` with the client IDs:
   ```
   YOUR_CLIENT_ID_HERE
   ```
3. Run:
   ```bash
   java -jar bfg.jar --replace-text secrets.txt
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```

**Option C: Use git-filter-repo (Modern tool)**

```bash
# Install: pip install git-filter-repo
git filter-repo --path src/Pages/Profile/Profile.tsx --invert-paths
git filter-repo --path src/Utilitys/GoogleDrive/UploadToDrive.tsx --invert-paths
git filter-repo --path src/Utilitys/Profile/Profile.tsx --invert-paths
```

#### Step 4: Force Push (⚠️ Careful!)

```bash
# Force push to overwrite remote history
git push origin --force --all
git push origin --force --tags
```

### Option 2: Allow the Secret (Not Recommended)

If the secret is already public or you need to keep it:

1. Visit the URL GitHub provided:
   ```
   https://github.com/tiennguyen12g/quill-editor/security/secret-scanning/unblock-secret/37H5vbrRSCi7wajIcA9nohdEabO
   ```

2. Click "Allow secret" (not recommended for production)

### Option 3: Rotate the Secret (Best Practice)

If the secret was exposed:

1. **Revoke the old OAuth Client ID** in Google Cloud Console
2. **Create a new OAuth Client ID**
3. **Remove old secret from git history** (Option 1)
4. **Add new secret to environment variables** (not in code)

## Recommended Approach

Since these files don't exist in your current codebase (they're only in git history), the best approach is:

1. **Remove from git history** using one of the methods above
2. **Add to .gitignore** to prevent future commits
3. **Use environment variables** for secrets going forward

## Prevent Future Issues

### Use Environment Variables

Instead of hardcoding secrets:

```typescript
// ❌ BAD
const CLIENT_ID = "123456789-abc.apps.googleusercontent.com";

// ✅ GOOD
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
```

### Add to .gitignore

```
# Environment variables
.env
.env.local
.env.production
*.env

# Secret files
**/secrets.ts
**/config/secrets.ts
```

### Use .env.example

Create `.env.example` (committed) with placeholder values:
```
VITE_GOOGLE_CLIENT_ID=your-client-id-here
```

## Quick Fix (If Files Don't Exist Anymore)

If these files are already deleted from your working directory but exist in git history:

```bash
# 1. Remove from git tracking
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch src/Pages/Profile/Profile.tsx src/Utilitys/GoogleDrive/UploadToDrive.tsx src/Utilitys/Profile/Profile.tsx" \
  --prune-empty --tag-name-filter cat -- --all

# 2. Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 3. Force push
git push origin --force --all
```

## After Fixing

1. Verify no secrets in history:
   ```bash
   git log --all --full-history --source -- src/Pages/Profile/Profile.tsx
   ```

2. Test push:
   ```bash
   git push origin main
   ```

3. Update secrets in Google Cloud Console if needed

