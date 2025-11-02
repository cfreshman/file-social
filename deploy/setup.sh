#!/bin/bash
# Initial server setup script for file-social
# Run this FROM your local machine to set up a fresh server

set -e

cd "$(dirname "$0")/.."

# Load config
if [ ! -f "deploy/config.sh" ]; then
  echo "Error: deploy/config.sh not found"
  echo "Copy deploy/config.example.sh to deploy/config.sh and configure it"
  exit 1
fi

source deploy/config.sh

# Validate config
if [ -z "$DEPLOY_HOST" ] || [ -z "$DEPLOY_USER" ]; then
  echo "Error: DEPLOY_HOST and DEPLOY_USER must be set in deploy/config.sh"
  exit 1
fi

echo "🔧 Setting up server at $DEPLOY_USER@$DEPLOY_HOST..."

# Run setup commands on remote server
ssh "$DEPLOY_USER@$DEPLOY_HOST" << 'EOF'
  set -e
  export DEBIAN_FRONTEND=noninteractive
  
  echo "📦 Updating system packages..."
  apt-get update
  apt-get upgrade -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold"
  
  echo "📦 Installing Node.js..."
  if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" nodejs
  fi
  
  node -v
  npm -v
  
  echo "📦 Installing PM2..."
  npm install -g pm2
  
  echo "📦 Installing nginx..."
  apt-get install -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" nginx
  
  echo "🔒 Configuring firewall..."
  ufw allow 22/tcp
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw allow 7650/tcp
  ufw --force enable
  
  echo "📁 Creating app directory..."
  mkdir -p /var/www/file-social
  
  echo ""
  echo "✅ Server setup complete!"
EOF

echo ""
echo "Next steps:"
echo "1. Run: npm run deploy"
echo "2. Point your domain DNS to $DEPLOY_HOST"
echo "3. Run: npm run deploy:nginx"

