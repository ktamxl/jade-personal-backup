#!/bin/bash
cd /workspace

# Add safe directory
git config --global --add safe.directory /workspace

# Remove embedded repos from git tracking
git rm --cached bazi-2026 ken-2026-bazi 2>/dev/null || true

# Stage key files only
git add MEMORY.md SOUL.md USER.md IDENTITY.md AGENTS.md TOOLS.md HEARTBEAT.md README.md memory/

# Commit only if there are changes
if ! git diff --cached --quiet; then
    git commit -m '🌸 Auto-backup 2026-05-13 HK'
    git push origin master
    echo "DONE"
else
    echo "NO_CHANGES"
fi