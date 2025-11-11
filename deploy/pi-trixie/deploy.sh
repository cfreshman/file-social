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

# Validate config
if [ -z "$DEPLOY_HOST" ] || [ -z "$DEPLOY_USER" ] || [ -z "$DEPLOY_PATH" ]; then
  echo "Error: DEPLOY_HOST, DEPLOY_USER, and DEPLOY_PATH must be set in config.sh"
  exit 1
fi

# Default to port 7650 if not set
SERVER_PORT=${SERVER_PORT:-7650}
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
ssh -p "$DEPLOY_PORT" "$DEPLOY_USER@$DEPLOY_HOST" bash -s "$DEPLOY_PATH" "$SERVER_PORT" << 'EOF'
  DEPLOY_PATH=$1
  SERVER_PORT=$2
  cd $DEPLOY_PATH
  npm install --production
  
  # Install PM2 if not already installed
  if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
  fi
  
  # Restart or start the app
  if pm2 list | grep -q file-social; then
    echo "♻️  Restarting file-social..."
    PORT=$SERVER_PORT pm2 restart file-social --update-env
  else
    echo "▶️  Starting file-social on port $SERVER_PORT..."
    PORT=$SERVER_PORT pm2 start server/index.js --name file-social
    pm2 save
    pm2 startup systemd -u $USER --hp $HOME
  fi
  
  pm2 list
EOF

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your app is running at: http://$DEPLOY_HOST:$SERVER_PORT"
echo ""
echo "Configure your external reverse proxy to forward to this address."
