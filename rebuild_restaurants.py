#!/usr/bin/env python3
"""Rebuild restaurants.html from scratch — Attractions layout, 30 restaurants, 3 city tabs"""
print("Starting rebuild...")

# ── Restaurant data ──────────────────────────────────────────────────────────
SHANGHAI = [
    ("🥟","1","萊萊小籠·喬艾","萊萊小籠·喬艾（黃浦店）· Mich Bib · 滬上蟹膏小籠首選","📍 黃浦區黃河路127號 | 🚇 地鐵1/2/8 南京西路站<br>📞 021-63276878 | 🕐 7:30–20:00<br>💰 ¥70/人 | ⭐ Dianping 4.7 · 2025必吃榜","招牌純蟹膏小籠包含滿滿蟹膏，搭配店家特調薑絲醋，濃郁鮮香。蟹粉餛飩、蟹粉薺菜羹亦為人氣之選。","Must-Order: Pure Crab Roe Xiaolongbao · Crab Roe Wonton","⭐ Michelin Bib · 🦀 Crab Roe Special"),
    ("🥟","2","南翔饅頭店","南翔饅頭店（豫園店）· Est. 1900 · 中國傳奇小籠包","📍 黃浦區豫園路87號（豫園商城九曲橋旁）| 🚇 地鐵10/14 豫園站<br>📞 021-63554206 | 🕐 7:30–20:00<br>💰 ¥91/人 | ⭐ Dianping 4.6 · 2025必吃榜","上海最傳奇小籠包——薄皮、湯多、鮮美。鮮肉小籠、蟹黃小籠、蟹黃灌湯包必點。","Must-Order: Fresh Pork Xiaolongbao · Crab Roe Xiaolongbao","🏆 125年傳奇 · 🥟 必吃小籠"),
    ("🥢","3","綠波廊","綠波廊（豫園路店）· Est. 1979 · Michelin Guide","📍 黃浦區豫園路115號（九曲橋畔，城隍廟對面）| 🚇 地鐵10/14 豫園站<br>📞 021-63280602 | 🕐 午市 11:00–14:00 · 晚市 17:00–20:30<br>💰 ¥165/人 | ⭐ Michelin Guide · Dianping 4.5","1559年古蹟內用餐，傳奇本幫菜。必點：蘿蔔絲酥餅、桂花拉糕、眉毛酥蝦仁春卷、蟹粉小籠包、八寶鴨、松鼠桂魚。","Must-Order: Radish Shred Pastry · Osmanthus Cake · Eight-Treasure Duck","⭐ 米芝蓮推介 · 🏛️ 明朝古蹟"),
    ("🍜","4","佳家湯包","佳家湯包（黃河路店）· Dianping 4.7","📍 黃浦區黃河路127號（南京西路步行街近）| 🚇 地鐵1/2/8 南京西路站<br>📞 021-63276878 | 🕐 7:30–20:00<br>💰 ¥70/人 | ⭐ Dianping 4.7 · 2025必吃榜","純蟹粉湯包（¥108）為鎮店之寶，湯水豐富，蟹味濃郁。鮮肉湯包同樣出色，魚丸湯必配。","Must-Order: Pure Crab Roe Soup Dumpling · Fresh Pork Soup Dumpling","⭐ Dianping 4.7 · 🦀 Pure Crab Roe"),
    ("🥟","5","小楊生煎","小楊生煎（黃河路店）· Est. 1992","📍 黃浦區黃河路97號（近南京西路步行街）| 🚇 地鐵1/2 南京西路站<br>📞 021-53751793 | 🕐 6:30–22:00<br>💰 ¥30–50/人 | ⭐ Dianping 4.5 · 上海名點","薄皮、香脆、湯多——上海街頭生煎包代表。鮮肉生煎、蝦仁生煎、牛肉粉絲湯。","Must-Order: Pan-Fried Pork Bun + Beef Soup","💰 超抵食 · 🍳 上海名點"),
    ("🥘","6","三瑪璐酒樓","三瑪璐酒樓（漢口路店）· Est. 1996","📍 黃浦區漢口路413號（南京東路商圈）| 🚇 地鐵2/10 南京東路站<br>📞 021-63517909 | 🕐 9:00–21:30<br>💰 ¥90–100/人 | ⭐ Dianping 2025必吃榜","街坊食堂，地道本幫。芥末蝦仁、醬爆豬肝、干鍋牛蛙、上海小排。","Must-Order: Wasabi Shrimp · Braised Pork Liver · Dry Pot Bullfrog","🏠 28年街坊食堂 · ⭐ 2025必吃"),
    ("🍖","7","老吉堂上海本幫菜","老吉堂上海本幫菜（外灘店）","📍 黃浦區北京東路118號（近外灘）| 🚇 地鐵2/10 南京東路站<br>📞 021-6323 1818 | 🕐 11:00–14:00 · 17:00–21:30<br>💰 ¥218/人 | ⭐ Dianping 4.6","紅燒肉、醉雞、龍井蝦仁、蟹粉豆腐。","Must-Order: Red-Cooked Pork · Drunken Chicken","🌃 近外灘 · ⭐ 紅燒肉名店"),
    ("🦐","8","粵·向群飯店","粵·向群飯店（浦東店）· Est. 1970s","📍 浦東新區浦東南路1285號（近世紀大道）| 🚇 地鐵2 上海科技館站<br>📞 021-5833 8888 | 🕐 11:00–14:30 · 17:00–21:30<br>💰 ¥150/人 | ⭐ Dianping 4.7 · 2025必吃榜","鹽焗雞、清蒸石斑、脆皮燒肉、皮蛋瘦肉粥。","Must-Order: Salted Chicken · Steamed Fish · Crispy Pork Belly","🥘 地道粵菜 · ⭐ 50年傳統"),
    ("🥧","9","光明邨","光明邨大酒家（南京西路店）· Est. 1949","📍 黃浦區南京西路1172號（近黃河路）| 🚇 地鐵1/2/8 南京西路站<br>📞 021-6322 3998 | 🕐 8:00–20:00<br>💰 ¥40–60/人 | ⭐ Dianping 4.4 · 76年歷史","鮮肉月餅（每逢周末排長龍）、核桃豆腐、各款本幫糕點。","Must-Order: Pork Mooncake · Walnut Tofu · Assorted Pastries","🏠 76年老店 · 🥧 上海糕點傳奇"),
    ("🍰","10","蔡嘉甜品","蔡嘉甜品（豫園店）· Dianping 4.8","📍 黃浦區豫園百貨天裕樓對面（豫園商圈）| 🚇 地鐵10/14 豫園站<br>📞 （見大眾點評）| 🕐 10:00–22:00<br>💰 ¥50/人 | ⭐ Dianping 4.8+","招牌拿破侖千層酥被譽為上海最出色，層層酥脆奶油，輕盈不膩。季限定水果撻、忌廉泡芙、朱古力Fondant。","Must-Order: Napoleon · Seasonal Fruit Tart","🍰 上海第一甜品 · ⭐ Dianping 4.8"),
]

ZHUJIAJIAO = [
    ("🐟","1","古橋人家水上餐廳","古橋人家•水上餐廳 · Dianping 4.5 · 河畔平台","📍 朱家角古鎮景區內（放生橋附近）| 🚇 地鐵17號線朱家角站<br>📞 （見大眾點評）| 🕐 10:30–21:00<br>💰 ¥77/人 | ⭐ Dianping 4.5","水上平台用餐，燈籠倒影在河面。招牌河鰻、銀魚炒蛋、鹽水河蝦、本地雞。","Must-Order: Steamed River Eel + Salted Shrimp","🌊 水上平台 · 🏆 朱家角人氣"),
    ("🦐","2","放生橋菜館","放生橋菜館 · Est. 1990s · Dianping 4.6","📍 朱家角鎮北大街172號（放生橋旁）| 🚇 地鐵17號線朱家角站<br>📞 021-59246658 | 🕐 11:00–20:00<br>💰 ¥100/人 | ⭐ Dianping 4.6 · Trip.com #1","扎肉（朱家角名菜）、鹽水河蝦、清蒸白水魚、響油鱔絲。","Must-Order: Braised Zha Meat + River Shrimp","🌉 放生橋旁 · ⭐ #1 Trip.com"),
    ("🏮","3","狀元樓","狀元樓 · 1800s · 朱家角最古老餐廳","📍 朱家角古鎮北大街（明清老街核心）| 🚇 地鐵17號線朱家角站<br>📞 （見大眾點評）| 🕐 10:00–21:00<br>💰 ¥60–80/人 | ⭐ Dianping 4.4 · 200年历史","明清古樓用餐，學者之堂。手作粽子、紅燒肉、河魚湯、本地土雞。","Must-Order: Hand-Made Zongzi + Red-Cooked Pork","🏛️ 200年古蹟 · 📸 打卡勝地"),
    ("🏛️","4","清代舒宅角里大院","清代舒宅角里大院 · Dianping 4.6","📍 朱家角古鎮內（北大街南端）| 🚇 地鐵17號線朱家角站<br>📞 （見大眾點評）| 🕐 11:00–20:30<br>💰 ¥90–120/人 | ⭐ Dianping 4.6","清代古院內用餐，雕花樑柱、灯笼光。手作套飯：清蒸河鮮、扎肉糯米飯、野萃水餃。","Must-Order: Set Menu (Heritage Experience)","🏛️ 清代古宅 · 📸 打卡勝地"),
    ("🔥","5","酒罈老灶柴火飯","酒罈老灶柴火飯 · Dianping 4.5","📍 朱家角古鎮（近放生橋）| 🚇 地鐵17號線朱家角站<br>📞 （見大眾點評）| 🕐 10:30–20:30<br>💰 ¥65–85/人 | ⭐ Dianping 4.5","柴火灶燒烤，焦香十足。柴火紅燒肉、柴火土雞湯、燻魚、農家青菜。","Must-Order: Charcoal Pork + Firewood Chicken Soup","🔥 柴火灶 · 🍚 地道風味"),
    ("🍶","6","漕溪人家酒樓","漕溪人家酒樓 · Dianping 4.4","📍 朱家角鎮漕河街（古鎮北段）| 🚇 地鐵17號線朱家角站<br>📞 （見大眾點評）| 🕐 10:30–20:00<br>💰 ¥55–75/人 | ⭐ Dianping 4.4","地道水鄉家常小炒，經濟實惠。芋頭紅燒肉、韭菜河蝦、鍋巴。","Must-Order: Braised Pork + River Shrimp","💰 超值之選 · 🏠 街坊最愛"),
    ("🥢","7","弘德樓","弘德樓 · Dianping 4.3","📍 朱家角古鎮景區內（課植園附近）| 🚇 地鐵17號線朱家角站<br>📞 （見大眾點評）| 🕐 10:00–20:30<br>💰 ¥65–85/人 | ⭐ Dianping 4.3","傳統庭院餐館，實惠分量。扎肉、清蒸河魚、鮮肉餛飩。","Must-Order: Zha Meat + Steamed River Fish","🥢 傳統風味 · 🏠 份量實惠"),
    ("🌿","8","森林人家","森林人家 · Dianping 4.4 · 田園餐廳","📍 朱家角古鎮景區內（近課植園）| 🚇 地鐵17號線朱家角站<br>📞 （見大眾點評）| 🕐 10:00–21:00<br>💰 ¥70–90/人 | ⭐ Dianping 4.4","竹林古樹下的清幽餐廳，食材來自自家農場。竹筍河蝦、清蒸土雞、野菜蛋。","Must-Order: Seasonal Set Menu","🌳 田園風光 · 🥗 有機食材"),
    ("☕","9","阿婆茶樓","阿婆茶樓 · Est. 1990s · Dianping 4.3","📍 朱家角鎮北大街125號（二樓，近放生橋）| 🚇 地鐵17號線朱家角站<br>📞 （見大眾點評）| 🕐 9:00–21:00<br>💰 ¥30–50/人 | ⭐ Dianping 4.3 · 2025必吃榜","二樓茶館俯瞰河畔，樓梯、木桌、老茶杯。阿婆茶、桂花糕、米酒、水煮花生。","Must-Order: Grandma Tea + Osmanthus Cake","☕ 百年茶樓 · 📸 必打卡"),
    ("🏨","10","朱家角安麓酒店·全日餐廳","朱家角安麓酒店·全日餐廳 · Dianping 4.8","📍 青浦區朱家角鎮課植園路177號（安麓酒店內）| 🚇 地鐵17號線朱家角站<br>📞 021-3923 7777 | 🕐 6:30–22:00<br>💰 ¥320/人 | ⭐ Dianping 4.8 · Luxury Resort","奢華中式莊園，蓮花池、學者花園。六福鑒賞套餐、慢燉羊肉、糯米藕。","Must-Order: Tasting Menu (reserve ahead)","🏨 豪華莊園 · ⭐ 最高評分"),
]

SHENZHEN = [
    ("🥩","1","西塔老太太泥爐烤肉","西塔老太太泥爐烤肉（南山旗艦店）· Est. 1997","📍 南山區粵海街道文心六路4號保利文化廣場B區1層35-36號<br>📞 （見大眾點評）| 🕐 11:00–23:00<br>💰 ¥120–150/人 | ⭐ Dianping 4.8 · #1 BBQ in Nanshan","1997年瀋陽傳統泥爐炭火烤肉，28種醃製肉類。優質牛肉拼盤、醃製五花肉、老太太特選牛肉。","Must-Order: Premium Beef Set + Marinated Pork Neck","🔥 泥爐炭火 · ⭐ #1 BBQ"),
    ("🥟","2","點都德","點都德（南山華僑城店）· Est. 1933","📍 南山區深南大道9018號華僑城大廈B/C座3樓（地鐵1號線華僑城站B口）<br>📞 0755-83325966 | 🕐 8:00–21:00<br>💰 ¥70–85/人 | ⭐ Dianping 4.4 · 90年歷史","手工即點即制，蝦餃皇、招牌油條、咖喱魚蛋、椰汁流沙包。","Must-Order: Prawn Dumpling + Crispy Oil Stick","☕ 早餐首選 · ⭐ 90年老字號"),
    ("🍲","3","巡味順德菜","巡味順德菜（歡樂海岸店）· Dianping 4.6","📍 南山區歡樂海岸購物中心3樓（白石路）| 🚇 地鐵9號線深圳灣公園站<br>📞 （見大眾點評）| 🕐 11:00–14:00 · 17:00–21:30<br>💰 ¥126/人 | ⭐ Dianping 4.6 · 2025必吃榜","順德發源地風味，無味精、無添加。清蒸魚頭、順德魚茸羹、脆皮燒肉、老火例湯。","Must-Order: Steamed Fish + Shunde Fish Balls","🌅 灣區夜景 · 週六8:30pm煙花 · ⭐ 必吃榜"),
    ("🦢","4","陶陶居","陶陶居（深圳灣萬象城店）· Est. 1880","📍 南山區深圳灣萬象城L3層（後海站E口直達）| 🚇 地鐵2/11 後海站<br>📞 0755-8652 1880 | 🕐 10:00–21:30<br>💰 ¥126/人 | ⭐ Dianping 4.7 · 145年歷史","1880年廣州老字號，燒鵝傳奇——皮脆肉嫩。粉絲蒸扇貝、鮑魚扒鴨掌、蛋撻。","Must-Order: Roast Goose + Steamed Scallop","🦞 145年傳奇 · ⭐ 米芝蓮水準"),
    ("🐄","5","潮香四海·家傳潮汕菜","潮香四海·家傳潮汕菜（南山店）","📍 南山區南油（近南海大道）| 🚇 地鐵9號線南油站<br>📞 （見大眾點評）| 🕐 11:00–14:00 · 17:00–22:00<br>💰 ¥99/人 | ⭐ Dianping 4.8 · 2025必吃榜","南山第一潮汕菜——農場直供。牛肉火鍋、現切牛肉、魚腐燴豆腐、潮汕凍蟹。","Must-Order: Beef Hot Pot + Hand-Shaved Beef","🥘 地道潮汕 · ⭐ #1 南山"),
    ("🦐","6","炳勝品味","炳勝品味（深圳灣萬象城店）· Est. 1996","📍 南山區深圳灣萬象城L3層（後海站E口）| 🚇 地鐵2/11 後海站<br>📞 0755-8651 9999 | 🕐 10:30–21:30<br>💰 ¥180/人 | ⭐ Dianping 4.6 · 29年歷史","海鮮火鍋聞名，避風塘蟹、鹽焗大明蝦、白切雞。","Must-Order: Giant Crab + Salted Prawns","🦞 海鮮火鍋 · ⭐ 29年老字號"),
    ("🥥","7","潤頤四季椰子雞","潤頤四季椰子雞（海岸城店）","📍 南山區海岸城購物中心3樓（後海站D口直達）| 🚇 地鐵2/11 後海站<br>📞 （見大眾點評）| 🕐 11:00–21:30<br>💰 ¥90–110/人 | ⭐ Dianping 4.5 · #1椰子雞","深圳最出名椰子雞——椰子水為湯底，無味精。椰子凍為鎮店甜品。","Must-Order: Coconut Chicken + Coconut Jelly","🥥 椰子水湯底 · ⭐ 深圳網紅"),
    ("🍲","8","南門涮肉","南門涮肉 · Dianping 4.7","📍 南山區歡樂海岸購物中心1樓| 🚇 地鐵9號線深圳灣公園站<br>📞 （見大眾點評）| 🕐 11:00–22:00<br>💰 ¥100–120/人 | ⭐ Dianping 4.7 · 2025必吃榜","北方羊肉火鍋——手切羊肉、芝麻醬、手搟面。清澈湯底，無人工調味。","Must-Order: Lamb Hot Pot + Handmade Noodles","🍜 北方火鍋 · ⭐ 2025必吃"),
    ("🦐","9","海大大蒸汽海鮮","海大大蒸汽海鮮餐廳（歡樂頌店）","📍 南山區歡樂頌購物中心2樓| 🚇 地鐵1/11 僑城東站<br>📞 （見大眾點評）| 🕐 10:30–21:30<br>💰 ¥120–150/人 | ⭐ Dianping 4.5 · 活海鮮","50+海鮮品種，蒸汽烹飪保持鮮甜。清蒸蟹、蒸魚頭、貝類拼盤、蒜蓉蝦。","Must-Order: Steamed Live Crab + Fish Head","🦞 活海鮮水箱 · ⭐ 蒸汽烹飪"),
    ("🍜","10","深圳科學生活館","深圳科學生活館 · 深圳灣文化廣場內","📍 南山區深圳灣文化廣場內（科苑南路2516號）| 🚇 地鐵13號線深圳灣體育中心站<br>📞 （見大眾點評）| 🕐 10:00–21:00<br>💰 ¥80–120/人 | ⭐ Dianping 4.4","灣區文化廣場內8個美食區：手製麵食、特色咖啡、生蠔吧。MAD建築師作品大樓。","Must-Order: Artisan Noodles + Craft Coffee","🏛️ MAD建築師作品 · ⭐ 新派餐飲"),
]

def card(emoji, num, name_en, name_cn, info, famous, highlight, tags, color):
    return f'''
    <div class="attraction-card">
      <div class="attraction-num" style="background:{color};">
        <span class="attraction-emoji">{emoji}</span>
        <span class="attraction-num-label">#{num}</span>
      </div>
      <div class="attraction-body">
        <h3>{name_en}</h3>
        <div class="attraction-chinese">{name_cn}</div>
        <div class="attraction-info">{info}</div>
        <div class="attraction-fam-label">🏆 What It's Famous For:</div>
        <p class="attraction-famous">{famous}</p>
        <div class="attraction-highlight-label">⭐ {highlight}</div>
        <div class="attraction-tags">{tags}</div>
      </div>
    </div>'''

def section_block(city_id, h2_emoji, title, subtitle, cards_html, color):
    return f'''
<div class="section-block" id="{city_id}">
  <h2>{h2_emoji} {title}</h2>
  <p class="section-desc">{subtitle}</p>
{cards_html}
</div>'''

def make_cards(data, color):
    return '\n'.join(card(*r, color) for r in data)

CSS = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Restaurants — Tam Family China 2026</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#1a1a2e;--soft:#f5f2ec;--white:#ffffff;
  --gold:#c9a84c;--gold-lt:#f0d98a;
  --sh-dark:#0d3d4f;--sh-mid:#1a6880;--sh-lt:#e8f4f8;
  --zj-dark:#2d4a1e;--zj-mid:#5a8a3a;--zj-lt:#e8f0e0;
  --sz-dark:#7b2d00;--sz-mid:#c04a0c;--sz-lt:#fdf0e8;
  --radius:14px;--shadow:0 4px 24px rgba(0,0,0,.13);
}
html{scroll-behavior:smooth}
body{font-family:Georgia,'Times New Roman',serif;background:var(--soft);color:var(--ink);line-height:1.7}
.hero{background:linear-gradient(160deg,#1a0d2e 0%,#2d1b52 50%,#3b1f5e 100%);color:#fff;text-align:center;padding:52px 24px 40px}
.hero-badge{display:inline-block;border:1px solid var(--gold);color:var(--gold-lt);font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;padding:3px 14px;border-radius:20px;margin-bottom:14px}
.hero h1{font-size:clamp(1.6rem,5vw,2.6rem);font-weight:normal;letter-spacing:.02em;margin-bottom:6px}
.hero-sub{font-size:.9rem;opacity:.8}
.hero-stats{display:flex;justify-content:center;gap:28px;flex-wrap:wrap;margin-top:16px}
.hero-stat{text-align:center}
.hero-stat .val{font-size:1.4rem;font-weight:bold;color:var(--gold-lt);display:block;font-family:sans-serif}
.hero-stat .lab{font-size:.65rem;opacity:.65;text-transform:uppercase;letter-spacing:.1em;font-family:sans-serif}
.sticky-nav{position:sticky;top:0;z-index:100;background:#1a0d2e;display:flex;justify-content:center;overflow-x:auto;scrollbar-width:none}
.sticky-nav::-webkit-scrollbar{display:none}
.sticky-nav a{color:rgba(255,255,255,.72);text-decoration:none;font-family:sans-serif;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;padding:11px 14px;white-space:nowrap;border-bottom:2px solid transparent;transition:all .2s}
.sticky-nav a:hover{color:var(--gold-lt)}
.sticky-nav a.active{color:var(--gold-lt);border-bottom-color:var(--gold-lt)}
.city-tabs{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin:24px auto;max-width:900px;padding:0 24px}
.city-tab{display:inline-flex;align-items:center;gap:8px;padding:10px 24px;border-radius:40px;font-family:sans-serif;font-size:.85rem;text-decoration:none;transition:all .25s;font-weight:bold;color:#fff}
.city-tab:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.2)}
.city-tab.sh{background:var(--sh-mid)}
.city-tab.zj{background:var(--zj-mid)}
.city-tab.sz{background:var(--sz-mid)}
.section-block{max-width:900px;margin:0 auto;padding:0 24px 48px}
.section-block h2{font-size:1.6rem;font-weight:normal;margin-bottom:8px;color:var(--ink)}
.section-block .section-desc{font-size:.88rem;opacity:.6;margin-bottom:28px;font-family:sans-serif}
.attraction-card{background:var(--white);border-radius:var(--radius);box-shadow:var(--shadow);margin-bottom:16px;overflow:hidden;display:grid;grid-template-columns:68px 1fr;transition:transform .2s}
.attraction-card:hover{transform:translateY(-2px)}
.attraction-num{display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:sans-serif;padding:16px 8px;text-align:center;min-height:100px}
.attraction-emoji{font-size:1.5rem;display:block}
.attraction-num-label{font-size:.55rem;opacity:.7;text-transform:uppercase;letter-spacing:.05em;margin-top:4px}
.attraction-body{padding:16px 18px 14px 14px}
.attraction-body h3{font-size:1.05rem;font-weight:normal;margin-bottom:4px;color:var(--ink)}
.attraction-chinese{font-size:.75rem;font-family:sans-serif;margin-bottom:8px}
.attraction-info{font-size:.72rem;color:#555;margin-bottom:8px;line-height:1.6;font-family:sans-serif}
.attraction-fam-label{font-family:sans-serif;font-size:.7rem;font-weight:bold;margin-bottom:5px}
.attraction-famous{font-size:.82rem;opacity:.7;margin-bottom:8px}
.attraction-highlight-label{font-size:.7rem;color:var(--ink);font-weight:bold;margin-bottom:8px}
.attraction-tags{display:flex;flex-wrap:wrap;gap:5px}
.attraction-tag{display:inline-block;font-size:.6rem;padding:2px 8px;border-radius:20px;font-family:sans-serif;background:var(--soft)}
.attraction-tag.highlight{background:var(--gold)}
footer{text-align:center;padding:28px 24px;font-family:sans-serif;font-size:.72rem;opacity:.4;color:var(--ink);border-top:1px solid rgba(0,0,0,.08);margin-top:16px}
</style>
</head>
<body>
<div class="hero">
  <div class="hero-badge">Tam Family China 2026</div>
  <h1>🍽️ Restaurants</h1>
  <p class="hero-sub">Top 10 must-eat restaurants across Shanghai · Zhujiajiao · Shenzhen</p>
  <div class="hero-stats">
    <div class="hero-stat"><span class="val">30</span><span class="lab">Restaurants</span></div>
    <div class="hero-stat"><span class="val">3</span><span class="lab">Cities</span></div>
    <div class="hero-stat"><span class="val">Nov 23 – Dec 1</span><span class="lab">Dates</span></div>
  </div>
</div>
<nav class="sticky-nav">
  <a href="index.html">Home</a>
  <a href="attractions.html">🏛️ Attractions</a>
  <a href="#shanghai" class="active">🌆 Shanghai</a>
  <a href="#zhujiajiao">🌸 Zhujiajiao</a>
  <a href="#shenzhen">🏙️ Shenzhen</a>
  <a href="hotels.html">🏨 Hotels</a>
</nav>
<div class="city-tabs">
  <a href="#shanghai" class="city-tab sh">🌆 Shanghai</a>
  <a href="#zhujiajiao" class="city-tab zj">🌸 Zhujiajiao</a>
  <a href="#shenzhen" class="city-tab sz">🏙️ Shenzhen</a>
</div>
"""

FOOTER = """
<footer>
  Tam Family China Adventure 2026 · Restaurants · Prepared by Jade 💚
</footer>
<script>
const sections=document.querySelectorAll('.section-block[id]');
const navLinks=document.querySelectorAll('.sticky-nav a[href^="#"]');
window.addEventListener('scroll',()=>{
  let current='';
  sections.forEach(s=>{if(s.getBoundingClientRect().top<=100)current=s.getAttribute('id');});
  navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+current));
});
</script>
</body>
</html>"""

sh_html = section_block("shanghai","🌆 Shanghai · Top 10","The Bund · Yuyuan · French Concession · Nanjing Road · Xintiandi",make_cards(SHANGHAI,"var(--sh-mid)"))
zj_html = section_block("zhujiajiao","🌸 Zhujiajiao · Top 10","Riverside farmhouse flavours · 400-year water town culinary traditions · Nov 26",make_cards(ZHUJIAJIAO,"var(--zj-mid)"))
sz_html = section_block("shenzhen","🏙️ Shenzhen · Top 10","OCT Harbour · Shunde · Cantonese · Korean BBQ · Bay views · Nov 28 – Dec 1",make_cards(SHENZHEN,"var(--sz-mid)"))

html = CSS + sh_html + '\n' + zj_html + '\n' + sz_html + FOOTER

with open('/workspace/china-trip-2026/restaurants.html','w',encoding='utf-8') as f:
    f.write(html)

print(f"DONE! {len(html)} bytes, {html.count('attraction-card')} cards")
print("萊萊:", '萊萊' in html)
print("西塔:", '西塔老太太' in html)
print("Footer:", '</body>' in html)
