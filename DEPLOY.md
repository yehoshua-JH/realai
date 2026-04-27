# RealAI 2.0 — VPS Deployment Guide
**Server:** Ubuntu 24.04 LTS · `72.61.113.148` · Domain: `realai.jivepilot.com`

---

## Step 1 — First-Time Server Setup

SSH into your server as root, then run this once:

```bash
ssh root@72.61.113.148
```

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 22 (LTS)
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# Install pnpm
npm install -g pnpm pm2

# Install MySQL 8
apt install -y mysql-server
mysql_secure_installation

# Install Nginx + Certbot (for SSL)
apt install -y nginx certbot python3-certbot-nginx

# Create a non-root user for the app (optional but recommended)
useradd -m -s /bin/bash realai
```

---

## Step 2 — Create the Database

```bash
mysql -u root -p
```

Inside MySQL:

```sql
CREATE DATABASE realai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'realai'@'localhost' IDENTIFIED BY 'CHOOSE_A_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON realai.* TO 'realai'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## Step 3 — Clone and Configure the App

```bash
cd /var/www
git clone https://github.com/yehoshua-JH/realai.git
cd realai
```

Create the `.env` file:

```bash
cat > .env << 'EOF'
# Database
DATABASE_URL=mysql://realai:CHOOSE_A_STRONG_PASSWORD@localhost:3306/realai

# Auth (generate with: openssl rand -hex 32)
JWT_SECRET=PASTE_YOUR_GENERATED_SECRET_HERE

# AI Chat (your Anthropic key from https://console.anthropic.com)
BUILT_IN_FORGE_API_KEY=sk-ant-YOUR_ANTHROPIC_KEY_HERE
BUILT_IN_FORGE_API_URL=https://api.anthropic.com

# App
NODE_ENV=production
VITE_APP_TITLE=RealAI 2.0

# Leave these blank when self-hosting (Manus OAuth not needed)
VITE_APP_ID=
OAUTH_SERVER_URL=
VITE_OAUTH_PORTAL_URL=
OWNER_OPEN_ID=
OWNER_NAME=
EOF
```

> **Important:** Replace `CHOOSE_A_STRONG_PASSWORD`, `PASTE_YOUR_GENERATED_SECRET_HERE`, and `sk-ant-YOUR_ANTHROPIC_KEY_HERE` with real values.
> Generate JWT_SECRET with: `openssl rand -hex 32`

---

## Step 4 — Install Dependencies and Run Migrations

```bash
cd /var/www/realai

# Install dependencies
pnpm install

# Run database migrations (creates all tables)
pnpm db:push

# Build the app for production
pnpm build
```

---

## Step 5 — Start with PM2 (Process Manager)

```bash
# Start the app
pm2 start dist/index.js --name realai --env production

# Save PM2 config so it restarts on server reboot
pm2 save
pm2 startup
# Run the command it outputs (e.g., systemctl enable pm2-root)
```

Check it's running:
```bash
pm2 status
pm2 logs realai --lines 20
```

The app now runs on port **3000** internally.

---

## Step 6 — Configure Nginx as Reverse Proxy

```bash
cat > /etc/nginx/sites-available/realai << 'EOF'
server {
    listen 80;
    server_name realai.jivepilot.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
    }
}
EOF

# Enable the site
ln -s /etc/nginx/sites-available/realai /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

---

## Step 7 — Enable HTTPS with Let's Encrypt (Free SSL)

First, point your domain to the server:
- In your DNS provider, add an **A record**: `realai.jivepilot.com` → `72.61.113.148`
- Wait 5–15 minutes for DNS to propagate

Then run:
```bash
certbot --nginx -d realai.jivepilot.com
# Follow the prompts — choose to redirect HTTP to HTTPS
```

Your app is now live at **https://realai.jivepilot.com** 🎉

---

## Updating the App (After Making Changes in Manus)

```bash
cd /var/www/realai
git pull origin main
pnpm install
pnpm db:push   # only if schema changed
pnpm build
pm2 restart realai
```

---

## Firewall Rules (Optional but Recommended)

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

## Troubleshooting

| Problem | Command |
| :--- | :--- |
| Check app logs | `pm2 logs realai` |
| Check Nginx logs | `tail -f /var/log/nginx/error.log` |
| Restart app | `pm2 restart realai` |
| Restart Nginx | `systemctl restart nginx` |
| Check DB connection | `mysql -u realai -p realai -e "SHOW TABLES;"` |
| Check port 3000 | `ss -tlnp \| grep 3000` |

---

## Environment Variable Reference

| Variable | Required | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | ✅ | MySQL connection string |
| `JWT_SECRET` | ✅ | 32-byte hex secret for session cookies |
| `BUILT_IN_FORGE_API_KEY` | ✅ | Anthropic API key for AI chat |
| `BUILT_IN_FORGE_API_URL` | ✅ | `https://api.anthropic.com` |
| `NODE_ENV` | ✅ | Set to `production` |
| `VITE_APP_TITLE` | Optional | App title shown in browser tab |
| `VITE_APP_ID` | ❌ | Leave blank (Manus OAuth only) |
| `OAUTH_SERVER_URL` | ❌ | Leave blank (Manus OAuth only) |
