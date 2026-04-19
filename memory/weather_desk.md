# Weather Desk — Jade's Morning Intelligence Briefing

**Role:** Daily market intelligence, 5 days a week before NY open  
**Schedule:** 05:00 AM Pacific (Mon–Fri) → #meeting channel  
**Trigger:** Cron job fires at exactly 05:00 AM PT (12:00 UTC)  

---

## Assets We Watch

| # | Asset | Symbol | Why It Matters |
|---|---|---|---|
| 1 | Gold (COMEX spot) | GLD / GC.CMD | Excel's largest gainer. Risk-off barometer. |
| 2 | Hang Seng Index | HSI | China equity trigger: 27,000 = go-time |
| 3 | USD / RMB | CNY | PBOC policy, China export competitiveness |
| 4 | US 10-Year Treasury Yield | 10Y | Drives TIPS (STIP/SCHP) valuation |
| 5 | VIX | VIX | Risk sentiment; calm vs. turbulent |
| 6 | S&P 500 Futures | ES | US pre-market direction |
| 7 | Dow Jones Futures | YM | Pre-opening: overnight sentiment |
| 8 | Nasdaq Futures | NQ | Tech pre-opening: AI/China tech signal |
| 9 | Brent Crude |BZ | China demand, energy sector |
| 10 | Fed Funds Futures | ZQ | Rate path → impacts TIPS, USD |

---

## Alert Levels

**🟢 GREEN — Routine (no alert, just briefing)**
- All assets within normal range
- Nothing requires captain's attention

**🟡 AMBER — Watchful (noted in briefing, no push)**
- Hang Seng within 5% of 27,000
- Gold ±1.5% in one session
- USD/CNY near 7.25 or 7.40
- 10Y yield moves ±10bps
- VIX between 20–25

**🔴 RED — Alert Captain immediately**
- Hang Seng **breaks 27,000** → FHKCX/MCHI threshold reached
- Gold moves **>3%** in either direction
- S&P 500 / Dow drops **>2%** → risk-off
- USD/CNY **breaks 7.40** → RMB depreciation alarm
- Any position moving **>5% against us** (SCHP-like scenario)

---

## Briefing Format

```
🌤️ Jade Weather Desk — [Day, Month Date, Year]

🟡 Hang Seng: 26,840 (-0.8%) — Still below 27,000. Watchful.
🟡 Gold (GLD): $1,840 (+0.3%) — Stable. +103% on file.
🟡 USD/CNY: 7.258 — PBOC fixed. CNY tailwind intact.
🟢 US10Y: 4.32% (-3bps) — Yields easing. STIP benefits.
🟢 VIX: 18.4 — Calm. No risk-off signal.
🟢 S&P 500 Futures (ES): 5,240 (+0.4%) — Risk appetite intact.
🟢 Dow Futures (YM): 39,180 (+0.3%) — Up modestly overnight.
🟢 Nasdaq Futures (NQ): 18,340 (+0.5%) — Tech steady.

🟡 Amber Note: HS within 5% of trigger. FHKCX/MCHI watch active.

Captain, ready for your orders when you arrive.
```

---

## Market Data Sources (in priority order)
1. Yahoo Finance (free, no API key needed)
2. Finnhub / Alpha Vantage (if API key provided)
3. batch_web_search fallback if APIs fail

---

## Threshold Memory (from MEMORY.md + meetings)
- **恒生 27,000** → Ken authorized to add FHKCX/MCHI
- **Gold >3% move** → Alert for potential GLD trim
- **SCHP / STIP** → Monitor daily until SCHP position resolved
- **USD/CNY 7.40** → RMB depreciation alert threshold

---

## Output Rules
- Post to #meeting channel (Discord)
- Keep under 300 words
- Use emoji indicators consistently  
- Always end with: "Captain, ready for your orders when you arrive."
- If RED alert: ping Ken directly, don't wait for briefing
- If all green: brief format only, no fluff
