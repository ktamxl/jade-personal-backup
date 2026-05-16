#!/usr/bin/env python3
with open('/workspace/china-trip-2026/restaurants.html') as f:
    c = f.read()

import re

def find_deep_section_end(html, start):
    depth = 0
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

keepers = {}
dups = []
for sid, sname in all_sections:
    end = find_deep_section_end(c, sid)
    if sname not in keepers:
        keepers[sname] = (sid, end)
    else:
        dups.append((sid, end))

print("Sections:", {sname: f"{s}-{e}" for s, e in keepers.values()})
print("Dups:", dups)

for dstart, dend in sorted(dups, key=lambda x: -x[0]):
    c = c[:dstart] + c[dend:]

with open('/workspace/china-trip-2026/restaurants.html', 'w') as f:
    f.write(c)

final = [(m.start(), re.search(r'id="([^"]+)"', m.group()).group(1))
         for m in re.finditer(r'<div class="section-block" id="([^"]+)">', c)]
print("Final:", final, "Length:", len(c))
print("萊萊 found:", '萊萊' in c)
