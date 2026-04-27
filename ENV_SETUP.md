# RealAI 2.0 — Environment Variables for Self-Hosting

When deploying to your own server, create a `.env` file in the project root with the following variables:

```bash
# ── Database ──────────────────────────────────────────────────────────────────
DATABASE_URL=mysql://realai:YOUR_DB_PASSWORD@localhost:3306/realai

# ── Authentication ────────────────────────────────────────────────────────────
# Generate with: openssl rand -hex 32
JWT_SECRET=CHANGE_ME_USE_OPENSSL_RAND_HEX_32

# ── AI (WhatsApp Bot) ─────────────────────────────────────────────────────────
# Your Anthropic API key from https://console.anthropic.com
BUILT_IN_FORGE_API_KEY=sk-ant-YOUR_KEY_HERE
BUILT_IN_FORGE_API_URL=https://api.anthropic.com

# ── App Config ────────────────────────────────────────────────────────────────
NODE_ENV=production
PORT=3000
VITE_APP_TITLE=RealAI 2.0
```

> **Note:** The `BUILT_IN_FORGE_API_KEY` and `BUILT_IN_FORGE_API_URL` variables power the WhatsApp AI bot.
> On Manus hosting these are injected automatically. On your own server, set them to your Anthropic key.
