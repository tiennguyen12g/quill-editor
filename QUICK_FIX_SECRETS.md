# Quick Fix: Remove Secrets from Git History

## Problem
GitHub is blocking your push because Google OAuth Client IDs were found in git history.

## Quick Solution (If repo is not shared)

### Option 1: Use the PowerShell Script (Easiest)

```powershell
# Run from quill-editor-tnbt-v2 directory
.\remove-secrets-from-history.ps1
```

Then force push:
```bash
git push origin --force --all
git push origin --force --tags
```

### Option 2: Manual Commands

```bash
# 1. Remove files from all commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch src/Pages/Profile/Profile.tsx src/Utilitys/GoogleDrive/UploadToDrive.tsx src/Utilitys/Profile/Profile.tsx" \
  --prune-empty --tag-name-filter cat -- --all

# 2. Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 3. Force push
git push origin --force --all
git push origin --force --tags
```

### Option 3: Use git-filter-repo (Recommended for shared repos)

```bash
# Install: pip install git-filter-repo

# Remove files
git filter-repo --path src/Pages/Profile/Profile.tsx --invert-paths
git filter-repo --path src/Utilitys/GoogleDrive/UploadToDrive.tsx --invert-paths
git filter-repo --path src/Utilitys/Profile/Profile.tsx --invert-paths

# Force push
git push origin --force --all
```

## After Fixing

1. **Rotate the OAuth Client ID** in Google Cloud Console (if it was exposed)
2. **Verify no secrets remain**:
   ```bash
   git log --all --full-history --source -- src/Pages/Profile/Profile.tsx
   ```
3. **Test push**:
   ```bash
   git push origin main
   ```

## Prevention

✅ Already done:
- Added paths to `.gitignore`
- Added paths to `tsconfig.json` exclude
- Created `.env.example` pattern

Future: Use environment variables instead of hardcoding secrets!

