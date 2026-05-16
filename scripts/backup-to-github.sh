#!/bin/bash
# Sisi Memory + China Trip Auto-Backup to GitHub
# Backs up: workspace files + china-trip-2026 website + all photos

cd /workspace

# Stage workspace files
git add MEMORY.md SOUL.md USER.md IDENTITY.md AGENTS.md TOOLS.md HEARTBEAT.md README.md memory/ imgs/ china-trip-2026/ 2>/dev/null

# Only commit if there are changes
if ! git diff --cached --quiet; then
  git commit -m "🌸 Auto-backup $(date '+%Y-%m-%d %H:%M') HK"
  git push origin master 2>&1
  echo "✅ Backup complete: $(date)"
else
  echo "⏭ No changes to backup: $(date)"
fi
