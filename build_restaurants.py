#!/usr/bin/env python3
# Extract sections from attractions.html
with open('/workspace/china-trip-2026/attractions.html', 'r') as f:
    a = f.read()

# Extract CSS
css_start = a.find('<style>')
css_end = a.find('</style>') + len('</style>')
css = a[css_start:css_end]

# Extract hero
hero_start = a.find('<div class="hero-badge">')
hero_end = a.find('<nav class="sticky-nav">')
hero = a[hero_start:hero_end]

# Extract nav
nav_start = a.find('<nav class="sticky-nav">')
nav_end = a.find('</nav>', nav_start) + len('</nav>')
nav = a[nav_start:nav_end]

body_start = nav_end

# City tabs
tabs_idx = a.find('class="city-tabs"', body_start)
first_section_idx = a.find('id="shanghai"', body_start)
city_tabs = a[tabs_idx:first_section_idx]

# City sections
sh_start = a.find('<div class="section-block" id="shanghai">')
zj_start = a.find('<div class="section-block" id="zhujiajiao">')
sz_start = a.find('<div class="section-block" id="shenzhen">')
footer_idx = a.find('<footer>')

shanghai = a[sh_start:zj_start]
zhujiajiao = a[zj_start:sz_start]
shenzhen = a[sz_start:footer_idx]

# Now build the new restaurants HTML
# Replace the hero badge text
hero_rest = hero.replace('🏛️ Attractions', '🍽️ Restaurants')
hero_rest = hero_rest.replace('Curated highlights across Shanghai · Zhujiajiao · Shenzhen', 'Top 10 must-eat restaurants across Shanghai · Zhujiajiao · Shenzhen')
hero_rest = hero_rest.replace('Three destinations. Three unique experiences.', 'Three cities. 30 handpicked restaurants. Every taste covered.')

# Update nav links
nav_rest = nav.replace('href="hotels.html">🏨 Hotels', 'href="hotels.html">🏨 Hotels')
nav_rest = nav_rest.replace('href="attractions.html">🏛️ Attractions', 'href="attractions.html" class="active">🏛️ Attractions')
# Make restaurants nav active and add link
nav_rest = nav_rest.replace('>🏛️ Attractions<', ' class="active">🏛️ Attractions<')
# Remove active from attractions
nav_rest = nav_rest.replace('href="hotels.html" class="active">🏨 Hotels', 'href="hotels.html">🏨 Hotels')

# Actually let's rebuild the nav cleanly
nav_rest = '''<nav class="sticky-nav">
  <a href="index.html">Home</a>
  <a href="attractions.html">🏛️ Attractions</a>
  <a href="#shanghai" class="active">🌆 Shanghai</a>
  <a href="#zhujiajiao">🌸 Zhujiajiao</a>
  <a href="#shenzhen">🏙️ Shenzhen</a>
  <a href="hotels.html">🏨 Hotels</a>
</nav>'''

# City tabs (same style as attractions)
city_tabs_rest = '''<!-- CITY TABS -->
<div class="city-tabs">
  <a href="#shanghai" class="city-tab sh">🌆 Shanghai</a>
  <a href="#zhujiajiao" class="city-tab zj">🌸 Zhujiajiao</a>
  <a href="#shenzhen" class="city-tab sz">🏙️ Shenzhen</a>
</div>'''

# Update section headers in restaurants
# Shanghai: keep the section structure from attractions but use restaurant cards
# This is the key: we use the ATTRACTIONS section structure (same card format) but with restaurant content

footer = a[footer_idx:footer_idx + len('<footer>')]
# Just get the footer tag and closing
footer_html = a[footer_idx:]

# Build new HTML
new_html = a[:css_start] + css + '\n' + hero_rest + '\n' + nav_rest + '\n' + city_tabs_rest + '\n\n' + shanghai + '\n' + zhujiajiao + '\n' + shenzhen + '\n' + footer_html

# The section blocks need their headers changed
# Shanghai section header
new_html = new_html.replace(
    '<h2>🌆 Shanghai</h2>\n    <p class="section-desc">Global metropolis meets old-world glamour — the Bund, Gardens, and skyward ambition.</p>',
    '<h2>🌆 Shanghai · Top 10</h2>\n    <p class="section-desc">The Bund · Yuyuan · French Concession · Nanjing Road · Xintiandi · Nov 23–27</p>'
)
new_html = new_html.replace(
    '<h2>🌸 Zhujiajiao Ancient Town</h2>\n    <p class="section-desc">One of Shanghai\'s best-preserved water towns. 1.6 km walking route · 12 unmissable stops.</p>',
    '<h2>🌸 Zhujiajiao · Top 10</h2>\n    <p class="section-desc">Riverside farmhouse flavours · 400-year water town culinary traditions · Nov 26</p>'
)
new_html = new_html.replace(
    '<h2>🏙️ Shenzhen</h2>\n    <p class="section-desc">China\'s innovation capital — theme parks, bay views, and Hakka heritage.</p>',
    '<h2>🏙️ Shenzhen · Top 10</h2>\n    <p class="section-desc">OCT Harbour · Shunde · Cantonese · Korean BBQ · Bay views · Nov 28 – Dec 1</p>'
)

# Now the key fix: replace each attraction card in these sections with a restaurant card
# The Shanghai section has 10 attraction cards - we need to replace them with 10 restaurant cards
# Each "section-block" contains "coming-soon" or "attraction" cards
# We need to replace the inner content of each section-block

# Actually let's just extract the sections as they are and replace their inner cards
# The easiest approach: just swap the card content

# For now save what we have and do the card replacement via sed
with open('/workspace/china-trip-2026/restaurants-new-base.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print(f"Base HTML written. Length: {len(new_html)}")

# Count rest-cards vs section-blocks
shanghai_section_start = new_html.find('<div class="section-block" id="shanghai">')
zj_section_start = new_html.find('<div class="section-block" id="zhujiajiao">')
sz_section_start = new_html.find('<div class="section-block" id="shenzhen">')

shanghai_section = new_html[shanghai_section_start:zj_section_start]
zj_section = new_html[zj_section_start:sz_section_start]
sz_section = new_html[sz_section_start:]

print(f"Shanghai cards: {shanghai_section.count('coming-soon') + shanghai_section.count('attraction-card')}")
print(f"ZJJ cards: {zj_section.count('coming-soon') + zj_section.count('attraction-card')}")
print(f"SZ cards: {sz_section.count('coming-soon') + sz_section.count('attraction-card')}")
