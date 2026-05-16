#!/usr/bin/env python3
# Add stop 13: Shenzhen Science & Technology Museum

new_stop = """  <!-- 13 -->
  <div class="stop-card">
    <div class="stop-num"><span class="n">13</span><span class="label">⭐ TOP</span></div>
    <div class="stop-body">
      <div class="stop-note" style="background:#fff3e0; color:#a05000; border:1px solid #f5c070; display:inline-block; font-size:.62rem; font-family:sans-serif; border-radius:4px; padding:2px 8px; margin-bottom:8px;">⭐ Ken's Top Pick</div>
      <h3>Shenzhen Science &amp; Technology Museum</h3>
      <div class="chinese">深圳科學技術館 · 光明區光輝大道8號</div>
      <p>Shenzhen's flagship science museum — one of the largest in southern China with 35,000 sqm of exhibition space. Eight themed zones covering robotics, space exploration, biotechnology, virtual reality, and hands-on experiments. Perfect for curious minds of all ages. Connected to Guangming Metro Station (Line 6) via sky bridge.</p>
      <div class="stop-tags">
        <span class="stop-tag highlight">⭐ Ken's Top Pick</span>
        <span class="stop-tag">🔬 Science</span>
        <span class="stop-tag">👨‍👩‍👧‍👦 Family</span>
        <span class="stop-tag">🤖 Robotics / VR</span>
      </div>
      <div class="stop-actions">
        <a class="stop-map-link" href="https://www.amap.com/search?query=深圳科学技术馆&city=440300" target="_blank" rel="noopener">🗺️ Amap →</a>
        <span class="stop-coords">📍 22.7807°N · 113.9267°E (approx., Guangming District)</span>
      </div>
    </div>
  </div>

"""

with open('/workspace/china-trip-2026/shenzhen-attractions.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Insert before the map section div (id="map")
map_marker = '<div class="section" id="map">'
idx = content.find(map_marker)
if idx == -1:
    print("Map marker not found")
    exit(1)

content = content[:idx] + new_stop + content[idx:]

with open('/workspace/china-trip-2026/shenzhen-attractions.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS - inserted at position", idx)
