#!/usr/bin/env python3
"""Generate restaurants.html"""
OUT = open('/workspace/china-trip-2026/restaurants.html', 'w', encoding='utf-8')
W = OUT.write

# ── HEADER ──────────────────────────────────────────────────────
W('''<html>
<head><meta charset="UTF-8"><title>Restaurants — Tam Family China 2026</title><style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--sh:#1a6880;--zj:#5a8a3a;--sz:#c04a0c;--gold:#c9a84c;--w:#fff;--soft:#f5f2ec}
body{font-family:Georgia,Times New Roman,serif;background:var(--soft);color:#1a1a2e;line-height:1.7}
html{scroll-behavior:smooth}
.hero{background:linear-gradient(160deg,#1a0d2e,#2d1b52);color:var(--w);text-align:center;padding:52px 24px 40px}
.badge{display:inline-block;border:1px solid var(--gold);color:var(--gold);font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;padding:3px 14px;border-radius:20px;margin-bottom:14px}
h1{font-size:clamp(1.6rem,5vw,2.6rem);font-weight:normal;letter-spacing:.02em;margin-bottom:6px}
.sub{font-size:.9rem;opacity:.8}
.stats{display:flex;justify-content:center;gap:28px;flex-wrap:wrap;margin-top:16px}
.hs{text-align:center}
.v{font-size:1.4rem;font-weight:bold;color:var(--gold);display:block;font-family:sans-serif}
.l{font-size:.65rem;opacity:.65;text-transform:upperScript uppercase;letter-spacing:.1em;font-family:sans-serif;display:block}
.nav{position:sticky;top:0;z-index:100;background:#1a0d2e;display:flex;justify-content:center;overflow-x:auto;scrollbar-width:none}
.nav a{color:rgba(255,255,255,.72);text-decoration:none;font-family:sans-serif;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;padding:11px 14px;white-space:nowrap;border-bottom:2px solid transparent;transition:color .2s}
.nav a:hover{color:var(--gold)}
.nav .active{color:var(--gold);border-bottom-color:var(--gold)}
.ctabs{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin:24px auto;max-width:900px;padding:0 24px}
.ct{font-family:sans-serif;font-size:.85rem;font-weight:bold;color:#fff;text-decoration:none;padding:10px 24px;border-radius:40px;display:inline-flex;align-items:center;gap:8px;transition:all .25s}
.ct:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.2)}
.ct.sh{background:var(--sh)}
.ct.zj{background:var(--zj)}
.ct.sz{background:var(--sz)}
.sb{max-width:900px;margin:0 auto;padding:0 24px 48px}
.sb h2{font-size:1.6rem;font-family:sans-serif;font-weight:normal;margin-bottom:8px}
.sd{font-size:.88rem;opacity:.6;margin-bottom:28px;font-family:sans-serif}
.c{background:var(--w);border-radius:14px;box-shadow:0 4px 24px rgba(0,0,0,.13);margin-bottom:16px;overflow:hidden;display:grid;grid-template-columns:68px 1fr;transition:transform .2s}
.c:hover{transform:translateY(-2px)}
.cn{color:var(--w);font-family:sans-serif;text-align:center;padding:16px 8px;min-height:100px;display:flex;flex-direction:column;align-items:center;justify-content:center}
.ce{font-size:1.5rem;display:block;color:inherit}
.cl{font-size:.55rem;opacity:.7;text-transform:uppercase;letter-spacing:.05em;margin-top:4px}
.cb{padding:16px 18px 14px}
.cb h3{font-size:1.05rem;font-weight:normal;margin-bottom:4px;font-family:sans-serif}
.chi{font-size:.75rem;font-family:sans-serif;margin-bottom:8px}
.cinf{font-size:.72rem;color:#555;margin-bottom:8px;line-height:1.6;font-family:sans-serif}
.clbl{font-family:sans-serif;font-size:.7rem;font-weight:bold;margin-bottom:5px}
.cfam{font-size:.82rem;opacity:.7;margin-bottom:8px}
.chl{font-size:.7rem;font-weight:bold;margin-bottom:8px}
.ctags{display:flex;flex-wrap:wrap;gap:5px}
.t{display:inline-block;font-size:.6rem;padding:2px 8px;border-radius:20px;font-family:sans-serif;background:var(--soft)}
.t.hl{background:var(--gold)}
footer{text-align:center;padding:28px 24px;font-family:sans-serif;font-size:.72rem;opacity:.4;border-top:1px solid rgba(0,0,0,.08);margin-top:16px}
</style></head>
<body>
<div class="hero">
  <div class="badge">Tam Family China 2026</div>
  <h1>Restaurants</h1>
  <p class="sub">Top 10 must-eat restaurants across 3 cities · Nov 23 – Dec 1, 2026</p>
  <div class="stats">
    <div class="hs"><span class="v">30</span><span class="l">Restaurants</span></div>
    <div class="hs"><span class="v">3</span><span class="l">Cities</span></div>
    <div class="hs"><span class="v">Nov 23–Dec 1</span><span class="l">Dates</span></div>
  </div>
</div>
<nav class="nav">
  <a href="index.html">Home</a>
  <a href="attractions.html">Attractions</a>
  <a href="#shanghai" class="active">Shanghai</a>
  <a href="#zhujiajiao">Zhujiajiao</a>
  <a href="#shenzhen">Shenzhen</a>
  <a href="hotels.html">Hotels</a>
</nav>
<div class="ctabs">
  <a class="ct sh" href="#shanghai">Shanghai</a>
  <a class="ct zj" href="#zhujiajiao">Zhujiajiao</a>
  <a class="ct sz" href="#shenzhen">Shenzhen</a>
</div>
<div class="sb" id="shanghai">
  <h2>Shanghai Top 10</h2>
  <p class="sd">外灘 · 豫園 · 法租界 · 南京路 · 新天地</p>
''')

def card(n, emoji, name, zhname, info, famous, highlight, tags, color):
    tags_html = ''.join('<span class="t hl>' + t.strip() + '</span>' for t in tags)
    return (
        '<div class="c">'
        '<div class="cn" style="background:' + color + '">'
        '<span class="ce">' + emoji + '</span>'
        '<span class="cl>' + n + '</span>'
        '</div>'
        '<div class="cb">'
        '<h3>' + name + '</h3>'
        '<div class="chi">' + zhname + '</div>'
        '<div class="cinf">' + info + '</div>'
        '<div class="clbl>What Its Famous For:</div>'
        '<p class="cfam>' + famous + '</p>'
        '<div class="chl>Must-Order: ' + highlight + '</div>'
        '<div class="ctags>' + tags_html + '</div>'
        '</div></div>'
    )

# All cards: (num, emoji, EN name, CN name, address/phone/hours/price, famous, highlight, [tag1, tag2, tag3], CSS color
CARDS_SH = [
    ("1","🥟","萊萊小籠·喬艾 Lailai Xiaolongbao","萊萊小籠·喬艾（黃浦店） Michelin Bib · 滬上蟹膏小籠首選",
     "萊萊小籠·喬艾 · 021-63276878 · 7:30–20:00 · ¥70/人 · Dianping 4.7 2025必吃榜",
     "招牌純蟹膏小籠包含滿滿蟹膏，搭配店家特調薑絲醋，濃郁鮮香。蟹粉餛飩、蟹粉薺菜羹亦為人氣之選。",
     "Pure Crab Roe Xiaolongbao · Crab Roe Wonton","Michelin Bib · Crab Roe Special","#c9a84c"),
    ("2","🥟","南翔饅頭店 Nanxiang Steamed Bun Shop","南翔饅頭店（豫園店） Est. 1900 · 中國傳奇小籠包",
     "南翔饅頭店 · 豫園路87號 · 021-63554206 · 7:30–20:00 · ¥91/人 · Dianping 4.6 2025必吃榜",
     "上海最傳奇小籠包——薄皮、湯多、鮮美。鮮肉小籠、蟹黃小籠、蟹黃灌湯包必點","Fresh Pork Xiaolongbao · Crab Roe Xiaolongbao","125年傳奇 · 小籠包必吃","#c9a84c"),
    ("3","🥢","綠波廊 Green Wave Corridor","綠波廊（豫園路店） Est. 1979 · Michelin Guide",
     "綠波廊 · 豫園路115號 九曲橋畔城隍廟對面 · 021-63280602 · 午市11-14 晚市17-20:30 · ¥165/人 Michelin Guide Dianping 4.5",
     "1559年古蹟內用餐 · 傳奇本幫菜。必點：蘿蔔絲酥餅、桂花拉糕、眉毛酥蝦仁春卷、蟹粉小籠包八寶鴨、松鼠桂魚","Radish Shred Pastry · Osmanthus Cake · Eight-Treasure Duck","Michelin推介 · 明朝古蹟","#c9a84c"),
    ("4","🍜","佳家湯包 Jia Jia Tang Bao","佳家湯包（黃河路店） Dianping 4.7",
     "佳家湯包 · 黃河路127號 南京西路步行街 · 021-63276878 · 7:30–20:00 · ¥70/人 Dianping 4.7 2025必吃榜",
     "純蟹粉湯包（¥108）為鎮店之寶，湯水豐富，蟹味濃郁。鮮肉湯包同樣出色魚丸湯必配","Pure Crab Roe Soup Dumpling · Fresh Pork Soup Dumpling","Dianping 4.7 · Pure Crab Roe Special","#c9a84c"),
    ("5","🥟","小楊生煎 Xiao Yang Sheng Jian","小楊生煎（黃河路店） Est. 1992",
     "小楊生煎 · 黃河路97號 近南京西路步行街 · 021-53751793 · 6:30–22:00 · ¥30-50/人 Dianping 4.5 上海名點",
     "薄皮香脆湯多——上海街頭生煎包代表。鮮肉生煎、蝦仁生煎、牛肉粉絲湯","Pan-Fried Pork Bun + Beef Soup","超抵食 · 上海名點","#c9a84c"),
    ("6","🥘","三瑪璐酒樓 San Ma Lu","三瑪璐酒樓（漢口路店） Est. 1996 · Dianping 2025必吃榜",
     "三瑪璐酒樓 · 漢口路413號 南京東路商圈 · 021-63517909 · 9:00–21:30 · ¥90-100/人 Dianping 2025必吃榜",
     "街坊食堂地道本幫。芥末蝦仁、醬爆豬肝、干鍋牛蛙、上海小排","Wasabi Shrimp · Braised Pork Liver · Dry Pot Bullfrog","28年街坊食堂 · 2025必吃","#c9a84c"),
    ("7","🍖","老吉堂上海本幫菜 Old Ji Tang Benbang","老吉堂上海本幫菜（外灘店） Dianping 4.6",
     "老吉堂 北京東路118號 近外灘 · 021-6323 1818 · 午市11-14 晚市17-21:30 · ¥218/人 Dianping 4.6",
     "紅燒肉、醉雞、龍井蝦仁、蟹粉豆腐","Red-Cooked Pork · Drunken Chicken","近外灘 · 紅燒肉名店","#c9a84c"),
    ("8","🦐","粵·向群飯店 Yue Xiang Qun","粵·向群飯店（浦東店） Est. 1970s Dianping 4.7 2025必吃榜",
     "粵·向群飯店 浦東南路1285號 近世紀大道 · 021-5833 8888 · 午市11-14:30 晚市17-21:30 · ¥150/人",
     "鹽焗雞、清蒸石斑、脆皮燒肉、皮蛋瘦肉粥","Salted Chicken · Steamed Fish · Crispy Pork Belly","地道粵菜 · 50年傳統","#c9a84c"),
    ("9","🥧","光明邨 Guangming Village","光明邨大酒家（南京西路店） Est. 1949 76年歷史",
     "光明邨 南京西路1172號 近黃河路 · 021-6322 3998 · 8:00-20:00 · ¥40-60/人 Dianping 4.4 76年歷史",
     "鮮肉月餅（周末排長龍）、核桃豆腐、各款本幫糕點","Pork Mooncake · Walnut Tofu · Assorted Pastries","76年老店 · 上海糕點傳奇","#c9a84c"),
    ("10","🍰","蔡嘉甜品 Mr. Choi Patisserie","蔡嘉甜品（豫園店） Dianping 4.8",
     "蔡嘉甜品 豫園商圈 天裕樓對面 · （見大眾點評）· 10:00-22:00 · ¥50/人 Dianping 4.8+",
     "招牌拿破侖千層酥層層酥脆奶油輕盈不膩。季限定水果撻、忌廉泡芙、朱古力Fondant","Napoleon · Seasonal Fruit Tart","上海第一甜品 · Dianping 4.8","#c9a84c"),
]

for c in CARDS_SH:
    W(card(*c))
    W('\n')

W('</div>')

W('<div class="sb" id="zhujiajiao"><h2>Zhujiajiao Top 10</h2><p class="sd">水上古鎮美食 · 朱家角古鎮 · Nov 26</p>')

ZJ_CARDS = [
    ("1","🐟","古橋人家水上餐廳 Ancient Bridge Family","古橋人家水上餐廳 Dianping 4.5 河畔平台",
     "古橋人家  古鎮景區內 放生橋附近 · （見大眾點評）· 10:30-21:00 · ¥77/人 Dianping 4.5",
     "水上平台用餐燈籠倒影在河面。招牌河鰻銀魚炒蛋、鹽水河蝦、本地雞","Steamed River Eel + Salted Shrimp","水上平台 · 朱家角人氣","#5a8a3a"),
    ("2","🦐","放生橋菜館 Fangsheng Bridge Restaurant","放生橋菜館 Est. 1990s Dianping 4.6 Trip.com #1",
     "放生橋菜館 北大街172號 放生橋旁 · 021-59246658 · 11:00-20:00 · ¥100/人 Dianping 4.6",
     "扎肉（朱家角名菜）鹽水河蝦清蒸白水魚、響油鱔絲","Braised Zha Meat + River Shrimp","放生橋旁 · Trip.com #1","#5a8a3a"),
    ("3","🏮","狀元樓 Zhuangyuan Lou","狀元樓 1800s 朱家角最古老餐廳 Dianping 4.4 200年歷史",
     "狀元樓 北大街（明清老街核心）· （見大眾點評）· 10:00-21:00 · ¥60-80/人 Dianping 4.4 200年历史",
     "明清古樓用餐學者之堂。手作粽子、紅燒肉、河魚湯、本地土雞","Hand-Made Zongzi +