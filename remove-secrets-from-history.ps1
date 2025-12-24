# PowerShell script to remove secrets from git history
# Run this script from the quill-editor-tnbt-v2 directory

Write-Host "🔍 Checking git history for secret files..." -ForegroundColor Yellow

# Check if files exist in history
$filesInHistory = @(
    "src/Pages/Profile/Profile.tsx",
    "src/Utilitys/GoogleDrive/UploadToDrive.tsx",
    "src/Utilitys/Profile/Profile.tsx"
)

Write-Host "`n📋 Files to remove from git history:" -ForegroundColor Cyan
foreach ($file in $filesInHistory) {
    $exists = git log --all --full-history --oneline -- "$file" 2>$null
    if ($exists) {
        Write-Host "  ✓ Found: $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Not found: $file" -ForegroundColor Gray
    }
}

Write-Host "`n⚠️  WARNING: This will rewrite git history!" -ForegroundColor Red
Write-Host "Only proceed if:" -ForegroundColor Yellow
Write-Host "  1. You haven't shared this repo with others, OR" -ForegroundColor Yellow
Write-Host "  2. You've coordinated with your team" -ForegroundColor Yellow
Write-Host "`nPress Ctrl+C to cancel, or Enter to continue..." -ForegroundColor Yellow
Read-Host

Write-Host "`n🗑️  Removing files from git history..." -ForegroundColor Cyan

# Remove files from all commits using git filter-branch
$filesToRemove = $filesInHistory -join " "
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch $filesToRemove" --prune-empty --tag-name-filter cat -- --all

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Files removed from git history!" -ForegroundColor Green
    
    Write-Host "`n🧹 Cleaning up git references..." -ForegroundColor Cyan
    git reflog expire --expire=now --all
    git gc --prune=now --aggressive
    
    Write-Host "`n✅ Cleanup complete!" -ForegroundColor Green
    Write-Host "`n📤 Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Verify: git log --all --full-history --source -- src/Pages/Profile/Profile.tsx" -ForegroundColor White
    Write-Host "  2. Force push: git push origin --force --all" -ForegroundColor White
    Write-Host "  3. Force push tags: git push origin --force --tags" -ForegroundColor White
} else {
    Write-Host "`n❌ Error removing files from history" -ForegroundColor Red
    Write-Host "You may need to use git-filter-repo or BFG Repo-Cleaner instead" -ForegroundColor Yellow
}

