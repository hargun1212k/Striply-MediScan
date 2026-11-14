# Striply — Rollback & Recovery Guide (ROLLBACK.md)

> **Safety Net:** Operational instructions to restore the codebase to a verified baseline if any change introduces regressions.

---

## 1. Baseline Git Commit Reference

- **Initial Repository Sync Commit:** `HEAD` (or commit hash after initial commit to `striply-mediscan`).
- **Remote Repository:** `https://github.com/hargun1212k/striply-mediscan.git`
- **Main Branch:** `main`

---

## 2. Emergency Rollback Procedures

### Scenario A: Rollback Frontend UI Changes Only
If a UI update breaks Next.js compilation or hydration:
```powershell
# Restore web directory to previous working commit
git checkout HEAD~1 -- web/
# Verify build passes
npm --prefix web run build
```

### Scenario B: Full Git Tree Reversion
To undo the most recent commit cleanly:
```powershell
git revert HEAD --no-edit
git push origin main
```

### Scenario C: Clean Dependency & Cache Reset
If Node modules or Next.js cache causes build corruption:
```powershell
# Remove Next.js compilation cache
Remove-Item -Recurse -Force web/.next
# Re-run build
npm --prefix web run build
```

