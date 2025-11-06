#!/bin/bash
# Initial server setup script for file-social (Raspberry Pi Trixie)
# Run this FROM your local machine to set up a fresh Raspberry Pi

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
if [ -z "$DEPLOY_HOST" ] || [ -z "$DEPLOY_USER" ]; then
  echo "Error: DEPLOY_HOST and DEPLOY_USER must be set in config.sh"
  exit 1
fi

# Default server port if not set
SERVER_PORT=${SERVER_PORT:-7650}

echo "🔧 Setting up Raspberry Pi at $DEPLOY_USER@$DEPLOY_HOST..."

# Run setup commands on remote server
ssh "$DEPLOY_USER@$DEPLOY_HOST" bash -s "$SERVER_PORT" << 'EOF'
  SERVER_PORT=$1
  set -e
  export DEBIAN_FRONTEND=noninteractive
  
  echo "📦 Updating system packages..."
  sudo apt-get update
  sudo apt-get upgrade -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold"
  
  echo "📦 Installing Node.js..."
  if ! command -v node &> /dev/null; then
    # Install Node.js from official Raspberry Pi repos (includes npm)
    sudo apt-get install -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" nodejs npm
  fi
  
  node -v
  npm -v
  
  echo "📦 Installing PM2..."
  sudo npm install -g pm2
  
  echo "🔒 Configuring firewall..."
  if ! command -v ufw &> /dev/null; then
    echo "Installing ufw..."
    sudo apt-get install -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" ufw
  fi
  sudo ufw allow 22/tcp
  sudo ufw allow $SERVER_PORT/tcp
  sudo ufw --force enable
  
  echo "📁 Creating app directory..."
  sudo mkdir -p /var/www/file-social
  sudo chown $USER:$USER /var/www/file-social
  
  echo ""
  echo "✅ Server setup complete!"
EOF

echo ""
echo "Next steps:"
echo "1. Run: npm run pi:deploy"
echo ""
echo "Your app will be running at: http://$DEPLOY_HOST:$SERVER_PORT"
echo "Configure your external reverse proxy to forward to this address."

