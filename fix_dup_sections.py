#!/usr/bin/env python3
"""Fix restaurants.html - remove duplicate section-blocks"""
with open('/workspace/china-trip-2026/restaurants.html') as f:
    c = f.read()

import re

# Find all section-block openings
all_section_starts = [m.start() for m in re.finditer(r'<div class="section-block" id="([^"]+)">', c)]

def find_section_end(html, start):
    search = html[start+100:]
    depth = 1
    pos = 0
    while pos < len(search):
        if search[pos:pos+5] == '<div ':
            depth += 1
        elif search[pos:pos+6] == '</div>':
            depth -= 1
            if depth == 0:
                return start + 100 + pos + 6
        pos += 1
    return -1

# For each unique section id, keep only the FIRST occurrence
# Collect: for each id, the byte range to KEEP
keepers = {}  # id -> (start, end)
for sid in all_section_starts:
    marker = c[sid:sid+70]
    id_match = re.search(r'id="([^"]+)"', marker)
    if not id_match: continue
    id_name = id_match.group(1)
    end = find_section_end(c, sid)
    if id_name not in keepers:
        keepers[id_name] = (sid, end)
        print(f"KEEP: {id_name} at {sid}–{end}")

# Find duplicates - same id appears again
dups = []
for sid in all_section_starts:
    marker = c[sid:sid+70]
    id_match = re.search(r'id="([^"]+)"', marker)
    if not id_match: continue
    id_name = id_match.group(1)
    if id_name in keepers and keepers[id_name][0] != sid:
        dup_end = find_section_end(c, sid)
        dups.append((sid, dup_end, id_name))
        print(f"DROP duplicate: {id_name} at {sid}–{dup_end}")

# Remove duplicates from c
# Work backwards so indices stay valid
dups.sort(key=lambda x: -x[0])  # reverse order so we remove from end first
for dup_start, dup_end, dup_name in dups:
    c = c[:dup_start] + c[dup_end:]

print(f"\nFixed length: {len(c)}")

# Verify
final_section_starts = [m.start() for m in re.finditer(r'<div class="section-block" id="([^"]+)">', c)]
print("Final sections:")
for sid in final_section_starts:
    marker = c[sid:sid+70]
    id_match = re.search(r'id="([^"]+)"', marker)
    id_name = id_match.group(1) if id_match else "?"
    print(f"  {id_name}")

with open('/workspace/china-trip-2026/restaurants.html', 'w') as f:
    f.write(c)
print("Written!")
