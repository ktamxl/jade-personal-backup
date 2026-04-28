# 📌 Pin — restaurants.html Rebuild (stuck session, reset requested)

## Topic
Rebuild `restaurants.html` for ktamxl/china-trip-2026 with 30 restaurant cards

## Status
**IN PROGRESS** — Session reset in progress. File is 0 bytes on server.

## What Happened
- Ken was working on a `restaurants.html` rebuild (30 cards: 10 Shanghai, 10 Zhujiajiao, 10 Shenzhen)
- Multiple Python script attempts failed (syntax errors, loop detector triggering)
- File got wiped to 0 bytes
- Git stash/checkout/restore attempts all failed
- Loop detector kept firing on exec calls
- Ken reset the session to break the deadlock

## Key Decisions
- Will restore from GitHub once session is fresh
- Will write file in ONE focused write call (not multiple script calls)
- Will NOT use exec/Python scripts — write directly via `write` tool
- Template: same card/hero CSS as `shanghai-attractions.html` (known good)

## Restaurant Data (confirmed ready — Shanghai 10)
1. 萊萊小籠·喬艾 (Lailai Xiaolongbao) 🥟
2. 南翔饅頭店 (Nanxiang Steamed Bun Shop) 🥟
3. 綠波廊 (Green Wave Corridor) 🥢
4. 佳家湯包 (Jia Jia Tang Bao) 🍜
5. 小楊生煎 (Xiao Yang Sheng Jian) 🥟
6. 三瑪璐酒樓 (San Ma Lu) 🥘
7. 老吉堂上海本幫菜 (Old Ji Tang Benbang) 🍖
8. 粵·向群飯店 (Yue Xiang Qun) 🦐
9. 光明邨 (Guangming Village) 🥧
10. 蔡嘉甜品 (Mr. Choi Patisserie) 🍰

## Restaurant Data (Zhujiajiao 10)
1. 古橋人家水上餐廳 🐟
2. 放生橋菜館 🦐
3. 狀元樓 🏮
4. 清代舒宅角里大院 🏛️
5. 酒罈老灶柴火飯 🔥
6. 漕溪人家酒樓 🍶
7. 弘德樓 🥢
8. 森林人家 🌿
9. 阿婆茶樓 ☕
10. 朱家角安麓酒店 🏨

## Restaurant Data (Shenzhen 10)
1. 西塔老太太泥爐烤肉 🥩
2. 點都德 🥟
3. 巡味順德菜 🍲
4. 陶陶居 🦢
5. 潮香四海·家傳潮汕菜 🐄
6. 炳勝品味 🦐
7. 潤頤四季椰子雞 🥥
8. 南門涮肉 🍲
9. 海大大蒸汽海鮮 🦐
10. 深圳科學生活館 🍜

## Files
- `/workspace/china-trip-2026/restaurants.html` — NEEDS REBUILD (0 bytes)
- `/workspace/china-trip-2026/shanghai-attractions.html` — good template reference
- `/workspace/gen_restaurants.py` — DO NOT RUN, has syntax errors

## Next Steps (post-reset)
1. Write `restaurants.html` fresh in ONE `write` call
2. Copy CSS from `shanghai-attractions.html` for cards + hero
3. Inject all 30 cards inline
4. `git add + commit + push`

## Restore Prompt
" Remember we were rebuilding the restaurants page — the file is 0 bytes and needs to be restored."
