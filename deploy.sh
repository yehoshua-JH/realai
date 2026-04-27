#!/bin/bash
# RealAI 2.0 — One-command update script
# Run this on your server after pulling new code from GitHub:
#   git pull origin main && bash deploy.sh

set -e

echo "🚀 RealAI 2.0 — Deploying..."

# Install/update dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Run any new database migrations
echo "🗄️  Running database migrations..."
pnpm db:push

# Build for production
echo "🔨 Building..."
pnpm build

# Restart the app
echo "♻️  Restarting app..."
pm2 restart realai || pm2 start dist/index.js --name realai --env production

echo "✅ Deployed successfully!"
pm2 status
