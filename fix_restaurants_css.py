#!/usr/bin/env python3
"""Build restaurants-final.html from attractions structure"""
with open('/workspace/china-trip-2026/restaurants-final.html') as f:
    c = f.read()

# Add the missing CSS classes from attractions' style
# Inject into <style> block
extra_css = """
  .attraction-card { background:var(--white); border-radius:var(--radius); box-shadow:var(--shadow); margin-bottom:16px; overflow:hidden; display:grid; grid-template-columns:68px 1fr; transition:transform .2s; }
  .attraction-card:hover { transform:translateY(-2px); }
  .attraction-num { display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff; font-family:sans-serif; padding:16px 8px; text-align:center; min-height:100px; }
  .attraction-emoji { font-size:1.5rem; display:block; }
  .attraction-num-label { font-size:.55rem; opacity:.7; text-transform:uppercase; letter-spacing:.05em; margin-top:4px; }
  .attraction-body { padding:16px 18px 14px 14px; }
  .attraction-body h3 { font-size:1.05rem; font-weight:normal; margin-bottom:4px; color:var(--ink); }
  .attraction-chinese { font-size:.75rem; font-family:sans-serif; margin-bottom:8px; }
  .attraction-desc { font-size:.78rem; font-family:sans-serif; color:var(--ink); opacity:.75; margin-bottom:8px; }
  .attraction-info { font-size:.72rem; color:#555; margin-bottom:8px; line-height:1.6; font-family:sans-serif; }
  .attraction-fam-label { font-family:sans-serif; font-size:.7rem; font-weight:bold; margin-bottom:5px; }
  .attraction-famous { font-size:.82rem; opacity:.7; margin-bottom:8px; }
  .attraction-highlight-label { font-size:.7rem; color:var(--ink); font-weight:bold; margin-bottom:8px; }
  .attraction-tags { display:flex; flex-wrap:wrap; gap:5px; }
  .attraction-tag { display:inline-block; font-size:.6rem; padding:2px 8px; border-radius:20px; font-family:sans-serif; background:var(--soft); }
  .attraction-tag.highlight { background:var(--gold); }
"""

style_end = c.find('</style>')
c_css = c[:style_end] + extra_css + c[style_end:]

with open('/workspace/china-trip-2026/restaurants-final.html', 'w') as f:
    f.write(c_css)

print("SUCCESS:", len(c_css), "bytes")
print("attraction-card count:", c_css.count('attraction-card'))
print("CSS added:", '.attraction-card' in c_css)
