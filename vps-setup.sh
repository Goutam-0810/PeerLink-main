#!/bin/bash

set -e

echo "-----Running PeerLink VPS Setup Script-----"

# Update System
sudo apt update
sudo apt upgrade -y

# Install Java ✅ fixed package name
echo "Installing Java JDK-17..."
sudo apt install -y openjdk-17-jdk

# Install Node.js
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
echo "Installing Nginx..."
sudo apt install -y nginx

# Install PM2
echo "Installing PM2..."
sudo npm install -g pm2

# Install Maven
echo "Installing Maven..."
sudo apt install -y maven

# Clone repository
echo "Cloning repository..."
git clone https://github.com/Goutam-0810/peerlink.git
cd peerlink

# Build backend
echo "Building Java backend..."
mvn clean package

# Build frontend
echo "Building frontend..."
cd ui
npm install
npm run build
cd ..

# Open firewall ports ✅ added
echo "Opening firewall ports..."
sudo ufw allow 80/tcp
sudo ufw allow 8080/tcp
sudo ufw allow 49152:65535/tcp
sudo ufw allow 49152:65535/udp

# Set up Nginx
echo "Setting up Nginx..."
if [ -e /etc/nginx/sites-enabled/default ]; then
    sudo rm /etc/nginx/sites-enabled/default
fi

cat <<EOF | sudo tee /etc/nginx/sites-available/peerlink
server {
    listen 80;
    server_name _;

    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";
}
EOF

sudo ln -sf /etc/nginx/sites-available/peerlink /etc/nginx/sites-enabled/peerlink

sudo nginx -t
if [ $? -eq 0 ]; then
    sudo systemctl restart nginx
    echo "Nginx configured successfully ✅"
else
    echo "Nginx configuration failed ❌"
    exit 1
fi

# Start backend ✅ fixed JAR name and command
echo "Starting backend with PM2..."
pm2 start --name peerlink-backend java -- -jar target/peerlink-1.0-SNAPSHOT.jar

# Start frontend
echo "Starting frontend with PM2..."
cd ui
pm2 start npm --name peerlink-frontend -- start
cd ..

# Save PM2
pm2 save
pm2 startup
pm2 status

echo "=== Setup Complete ==="
echo "PeerLink is running on your VPS! 🎉"