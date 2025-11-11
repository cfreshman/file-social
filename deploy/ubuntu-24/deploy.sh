#!/bin/bash
# file-social deployment script

set -e

cd "$(dirname "$0")/../.."

# Load config
if [ ! -f "deploy/config.sh" ]; then
  echo "Error: deploy/config.sh not found"
  echo "Copy deploy/config.example.sh to deploy/config.sh and configure it"
  exit 1
fi

source deploy/config.sh

# Check for updates
if [ -f ".file-social-version" ]; then
  CURRENT_VERSION=$(cat .file-social-version)
  LATEST_VERSION=$(curl -s https://api.github.com/repos/cfreshman/file-social/commits/m | grep '"sha"' | head -1 | cut -d'"' -f4)
  
  if [ -n "$LATEST_VERSION" ] && [ "$CURRENT_VERSION" != "$LATEST_VERSION" ]; then
    echo "⚠️  Update available! Run 'npm run update' before deploying."
    echo "   Current: ${CURRENT_VERSION:0:7}"
    echo "   Latest:  ${LATEST_VERSION:0:7}"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      exit 1
    fi
  fi
fi

# Validate config
if [ -z "$DEPLOY_HOST" ] || [ -z "$DEPLOY_USER" ] || [ -z "$DEPLOY_PATH" ]; then
  echo "Error: DEPLOY_HOST, DEPLOY_USER, and DEPLOY_PATH must be set in config.sh"
  exit 1
fi

# Default SSH port to 22 if not set
DEPLOY_PORT=${DEPLOY_PORT:-22}

echo "🚀 Deploying file-social to $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH"

# Sync files (excluding node_modules and git)
echo "📦 Syncing files..."
rsync -avz --delete \
  -e "ssh -p $DEPLOY_PORT" \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.DS_Store' \
  --exclude '*.log' \
  --exclude 'deploy/config.sh' \
  --exclude '_01' \
  ./ "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/"

# Run remote commands
echo "📥 Installing dependencies..."
ssh -p "$DEPLOY_PORT" "$DEPLOY_USER@$DEPLOY_HOST" bash -s "$DEPLOY_PATH" << 'EOF'
  DEPLOY_PATH=$1
  cd $DEPLOY_PATH
  npm install --production
  
  # Install PM2 if not already installed
  if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
  fi
  
  # Restart or start the app
  if pm2 list | grep -q file-social; then
    echo "♻️  Restarting file-social..."
    pm2 restart file-social
  else
    echo "▶️  Starting file-social..."
    pm2 start server/index.js --name file-social
    pm2 save
    pm2 startup systemd -u $USER --hp $HOME
  fi
  
  pm2 list
EOF

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your app is running at:"
if [ -n "$DEPLOY_DOMAIN" ]; then
  echo "  http://$DEPLOY_HOST:7650 (setup nginx for https://$DEPLOY_DOMAIN)"
else
  echo "  http://$DEPLOY_HOST:7650"
fi
echo ""
echo "To set up nginx with your domain, run: npm run deploy:nginx"
