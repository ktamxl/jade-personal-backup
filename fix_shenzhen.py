#!/usr/bin/env python3
with open('/workspace/china-trip-2026/attractions.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the Shenzhen block using its distinctive markers
start_marker = '<!-- ── SHENZHEN ── -->\n<div class="section-block" id="shenzhen">'
end_marker = '</div>\n\n<footer>'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print(f"NOT FOUND: start={start_idx}, end={end_idx}")
    exit(1)

old_block = content[start_idx:end_idx + len(end_marker)]
print(f"Found block of {len(old_block)} chars")
print("Start:", repr(old_block[:80]))
print("End:", repr(old_block[-80:]))

new_block = '''<!-- ── SHENZHEN ── -->
<div class="section-block" id="shenzhen">
  <h2>🏙️ Shenzhen</h2>
  <p class="section-desc">China's innovation capital — theme parks, bay views, and Hakka heritage.</p>

  <a href="shenzhen-attractions.html" style="text-decoration:none;">
    <div style="background:#fff; border-radius:14px; box-shadow:0 4px 24px rgba(0,0,0,.14); overflow:hidden; display:grid; grid-template-columns:1fr 1fr; cursor:pointer; transition:transform .2s;" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
      <div style="background:linear-gradient(135deg,#7b2d00,#c04a0c); padding:36px 28px; color:#fff; display:flex; flex-direction:column; justify-content:center;">
        <div style="font-size:.7rem; letter-spacing:.15em; text-transform:uppercase; opacity:.7; margin-bottom:10px; font-family:sans-serif;">City 02 · Nov 28 – Dec 1</div>
        <h3 style="font-size:1.4rem; font-weight:normal; margin-bottom:12px; line-height:1.3;">12 Shenzhen<br>Attractions</h3>
        <p style="font-size:.82rem; opacity:.8; margin-bottom:20px; line-height:1.6;">Talent Park · Safari Park · Sea World · Gankeng Hakka Town · Happy Valley · OCT Harbour · Bay Cultural Plaza · MixC · Library</p>
        <div style="display:inline-flex; align-items:center; gap:6px; background:var(--gold); color:var(--ink); border-radius:30px; padding:8px 18px; font-size:.78rem; font-family:sans-serif; font-weight:bold; width:fit-content;">
          🏙️ View All 12 Stops →
        </div>
      </div>
      <div style="background:linear-gradient(160deg,#fde8d8,#f5c0a0); display:flex; align-items:center; justify-content:center; padding:24px;">
        <div style="text-align:center;">
          <div style="font-size:4.5rem; margin-bottom:8px;">🏙️</div>
          <div style="font-family:sans-serif; font-size:.78rem; color:#7b2d00; opacity:.7;">12 Curated Stops</div>
          <div style="font-family:sans-serif; font-size:2rem; font-weight:bold; color:#7b2d00; margin-top:4px;">Shenzhen</div>
          <div style="font-family:sans-serif; font-size:.75rem; color:#c04a0c; margin-top:2px;">4 days · Nov 28 – Dec 1</div>
        </div>
      </div>
    </div>
  </a>
</div>

<footer>'''

new_content = content[:start_idx] + new_block + content[end_idx + len(end_marker):]
with open('/workspace/china-trip-2026/attractions.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("SUCCESS")
