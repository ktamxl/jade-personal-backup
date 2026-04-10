#!/usr/bin/env python3
"""Setup git and push workspace to jade-personal-backup"""
import subprocess
import os

workspace = "/workspace"

# Write .gitignore
gitignore = """
__pycache__/
*.pyc
node_modules/
pdfvenv/
pip_local/
pip_pkgs/
imgvenv/
rclone
*.mp4
*.gif
chan-kenya-2026/
family-legacy/
kenya-safari-2026/
luxury-timepiece-rental/
recipe-site/
tam-cruise-2027/
kens-kitchen/kens-kitchen/
kens-kitchen/recipe-site/
recipes/recipe-site/
qb_*.json
qb_credentials.txt
qb_oauth_app/
qb_tokens*.txt
qb_legal/
sisi_qb_site/
excel_team_intro.md
rclone
"""

with open(f"{workspace}/.gitignore", "w") as f:
    f.write(gitignore.strip() + "\n")

# Init git if not already
if not os.path.exists(f"{workspace}/.git"):
    subprocess.run(["git", "init"], cwd=workspace, check=True)
    subprocess.run(["git", "config", "user.email", "jade@ken.email"], cwd=workspace, check=True)
    subprocess.run(["git", "config", "user.name", "Jade"], cwd=workspace, check=True)
    subprocess.run(["git", "branch", "-M", "main"], cwd=workspace, check=True)
    print("Git init done")
else:
    print("Git already initialized")

# Set remote
remote_url = "https://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@github.com/ktamxl/jade-personal-backup.git"
subprocess.run(["git", "remote", "set-url", "origin", remote_url], cwd=workspace, check=True)
result = subprocess.run(["git", "remote", "get-url", "origin"], cwd=workspace, capture_output=True, text=True)
print(f"Remote: {result.stdout.strip()}")

# Add all files (gitignore now excludes the big/excluded dirs)
result = subprocess.run(["git", "add", "-A"], cwd=workspace, capture_output=True, text=True)
print(f"Add output: {result.stdout[:200]}")

# Count staged files
result = subprocess.run(["git", "status", "--short"], cwd=workspace, capture_output=True, text=True)
staged = [l for l in result.stdout.splitlines() if not l.startswith("?? ")]
untracked = [l for l in result.stdout.splitlines() if l.startswith("?? ")]
print(f"Staged: {len(staged)}, Untracked: {len(untracked)}")
if staged:
    print("Sample staged:", staged[:3])
if untracked:
    print("Sample untracked:", untracked[:5])

# Commit
msg = "Jade Personal Backup - Initial commit\n\nIncludes: memory, kens-kitchen, recipes, HK portfolio, bazi, fengshui reports, family docs"
result = subprocess.run(["git", "commit", "-m", msg], cwd=workspace, capture_output=True, text=True)
if result.returncode == 0:
    print("Committed!")
else:
    err = result.stderr.lower()
    if "nothing to commit" in err:
        print("Nothing to commit - working tree clean")
    else:
        print(f"Commit error: {result.stderr[:300]}")

# Push
result = subprocess.run(
    ["git", "push", "-u", "origin", "main", "--force"],
    cwd=workspace,
    capture_output=True,
    text=True,
    timeout=120
)
print(f"Push exit: {result.returncode}")
if result.returncode == 0:
    print("✅ PUSHED SUCCESSFULLY!")
    print(result.stdout[-500:])
else:
    print(f"Push error: {result.stderr[:500]}")
