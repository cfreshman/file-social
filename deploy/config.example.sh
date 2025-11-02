#!/bin/bash
# file-social deployment configuration
# Copy this file to config.sh and configure your server details

# SSH connection details
DEPLOY_USER="root"                    # SSH user (use root for VPS)
DEPLOY_HOST="1.2.3.4"                # Server IP address
DEPLOY_PATH="/var/www/file-social"   # Path on server

# Optional: Your domain name (for nginx setup)
DEPLOY_DOMAIN=""                     # e.g., "files.yourdomain.com"

# Note: Make sure you can SSH to your server without password (use SSH keys)
# Run: ssh-copy-id root@your-server-ip
