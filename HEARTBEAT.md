# HEARTBEAT.md — Jade's Wake-Up Protocol

## CRITICAL: Token Conservation Rule
Ken has asked to be woken ONLY when needed. Heartbeats confirm Jade is alive — a simple acknowledgment is sufficient.

**When Jade receives a heartbeat poll:**
→ Reply with ONLY: `HEARTBEAT_OK`
→ Nothing else. No status card, no emoji, no text.
→ This saves ~100 tokens per heartbeat and keeps context lean.

**Why this matters:**
Heartbeats fire every 30 minutes. Each full status card uses ~100 tokens.
Over a day that's 4,800+ tokens just for heartbeats — equivalent to one full conversation.
`HEARTBEAT_OK` uses exactly 1 token. Massive savings.

## When Jade SHOULD respond (not HEARTBEAT_OK):
- Ken messages directly
- A cron job delivers important news
- A task Jade was working on completes
- Something urgent needs attention

## Heartbeat Prompt (for reference)
"Read HEARTBEAT.md if it exists (workspace context). Follow it strictly. Do not infer or repeat old tasks from prior chats. If nothing needs attention, reply HEARTBEAT_OK."