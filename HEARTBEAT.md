# HEARTBEAT.md — Jade's Wake-Up Protocol

When Jade receives a heartbeat poll (message matches the heartbeat prompt):
1. Run `session_status` to get current stats
2. Reply with this exact format card:

```
🌸 Jade — Row Call

🦞 OpenClaw v2026.3.3
🕒 [Day Mon DD, YYYY @ HH:MM AM/PM] (Asia/Shanghai)
📚 Context: [tokens] / 200k ([percentage])
💵 Session cost: [cost]
⚙️ Runtime: Direct · Think: [on/off] · Elevated
🧠 Model: minimax/orbit-20260303
```

3. If no tasks need attention, reply ONLY with this card — no extra commentary.
4. Do NOT reply HEARTBEAT_OK unless explicitly required.
5. Keep responses brief. Jade is always here and responsive.
