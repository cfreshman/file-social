#!/bin/bash
# Setup nginx reverse proxy for file-social

set -e

cd "$(dirname "$0")/../.."

# Load config
if [ ! -f "deploy/config.sh" ]; then
  echo "Error: deploy/config.sh not found"
  exit 1
fi

source deploy/config.sh

if [ -z "$DEPLOY_DOMAIN" ]; then
  echo "Error: DEPLOY_DOMAIN must be set in config.sh"
  exit 1
fi

echo "🌐 Setting up nginx for $DEPLOY_DOMAIN"

# Deploy nginx config
ssh "$DEPLOY_USER@$DEPLOY_HOST" bash -s "$DEPLOY_DOMAIN" << 'ENDSSH'
  DOMAIN=$1
  
  # Write nginx config
  cat > /etc/nginx/sites-available/file-social << ENDNGINX
server {
  listen 80;
  server_name $DOMAIN;
  
  location / {
    proxy_pass http://localhost:7650;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_cache_bypass \$http_upgrade;
  }
}
ENDNGINX
  
  # Enable site
  ln -sf /etc/nginx/sites-available/file-social /etc/nginx/sites-enabled/file-social
  
  # Remove default if exists
  rm -f /etc/nginx/sites-enabled/default
  
  # Test and reload nginx
  nginx -t
  systemctl reload nginx
  
  # Install certbot if not present
  if ! command -v certbot &> /dev/null; then
    apt-get install -y certbot python3-certbot-nginx
  fi
  
  # Get SSL certificate
  certbot --nginx -d $DOMAIN --non-interactive --agree-tos --register-unsafely-without-email
ENDSSH

echo ""
echo "✅ Nginx setup complete!"
echo "Your site is now available at: https://$DEPLOY_DOMAIN"

