#!/bin/bash
# file-social deployment configuration
# Copy this file to config.sh and configure your server details

# SSH connection details
DEPLOY_USER="root"                    # SSH user (use root for VPS)
DEPLOY_HOST="1.2.3.4"                # Server IP address
DEPLOY_PATH="/var/www/file-social"   # Path on server

# Optional: Your domain name (Ubuntu only - for nginx/SSL setup)
DEPLOY_DOMAIN=""                     # e.g., "files.yourdomain.com"

# Optional: Server port (Pi only - default: 7650)
# For Pi setups - set this to match your external reverse proxy's target port
# For Ubuntu setups - always 7650 (nginx forwards from 80/443)
SERVER_PORT="7650"                   # Port for Node.js app

# Note: Make sure you can SSH to your server without password (use SSH keys)
# Run: ssh-copy-id root@your-server-ip
# Note: Certbot requires port 80 for validation. For custom ports, use DNS validation.
