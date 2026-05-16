#!/usr/bin/env python3
with open('/workspace/china-trip-2026/restaurants.html') as f:
    c = f.read()
import re

def find_section_end(html, start):
    """Find the </div> that closes the section-block div at start.
    We look for the </div> that brings depth back to 0 (starting at depth 1 to skip the opening tag)."""
    depth = 1
    pos = start
    while pos < len(html):
        if html[pos:pos+5] == '<div ':
            depth += 1
            pos += 1
        elif html[pos:pos+6] == '</div>':
            depth -= 1
            if depth == 0:
                return pos + 6
            pos += 6
        else:
            pos += 1
    return -1

all_sections = [(m.start(), re.search(r'id="([^"]+)"', m.group()).group(1))
                for m in re.finditer(r'<div class="section-block" id="([^"]+)">', c)]
print("All sections:")
for sid, sname in all_sections:
    end = find_section_end(c, sid)
    print(f"  {sname}: {sid}-{end} len={end-sid if end>0 else '?'}")

keepers = {}
dups = []
for sid, sname in all_sections:
    end = find_section_end(c, sid)
    if sname not in keepers:
        keepers[sname] = (sid, end)
    else:
        dups.append((sid, end))

print("Dups:", dups)
for ds, de in sorted(dups, key=lambda x: -x[0]):
    c = c[:ds] + c[de:]
    print(f"  Removed {ds}-{de}")

with open('/workspace/china-trip-2026/restaurants.html', 'w') as f:
    f.write(c)

final = [(m.start(), re.search(r'id="([^"]+)"', m.group()).group(1))
         for m in re.finditer(r'<div class="section-block" id="([^"]+)">', c)]
print("Final sections:", final)
print("Length:", len(c), "萊萊:", '萊萊' in c)
