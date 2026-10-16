#!/usr/bin/env bash
set -e

APP_DIR="/var/www/dangtri.com/app"
DB_NAME="ebook_store"
DB_USER="dangtri_app"

echo "==> Update apt packages"
apt update

echo "==> Install Node.js, Nginx, PostgreSQL and useful tools"
apt install -y curl git nginx postgresql postgresql-contrib

if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt install -y nodejs
fi

echo "==> Install PM2"
npm install -g pm2

echo "==> Create app directory"
mkdir -p "$APP_DIR"

echo "==> PostgreSQL setup"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || sudo -u postgres createdb "$DB_NAME"
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname = '$DB_USER'" | grep -q 1 || sudo -u postgres createuser "$DB_USER"

cat <<EOF

Bootstrap xong.

Viec can lam tiep theo:
1. Sao chep source code vao: $APP_DIR
2. Tao file .env production trong thu muc app
3. Chay schema PostgreSQL:
   sudo -u postgres psql -d $DB_NAME -f $APP_DIR/database/postgres/01_schema.sql
4. Cap quyen mat khau cho DB user:
   sudo -u postgres psql -c "ALTER USER $DB_USER WITH PASSWORD 'YOUR_STRONG_PASSWORD';"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
5. Cai dependencies va build:
   cd $APP_DIR && npm install && npm run build
6. Chay PM2:
   pm2 start ecosystem.config.cjs
   pm2 save
7. Cai Nginx config:
   cp $APP_DIR/deploy/nginx/dangtri.com.conf /etc/nginx/sites-available/dangtri.com
   ln -sf /etc/nginx/sites-available/dangtri.com /etc/nginx/sites-enabled/dangtri.com
   nginx -t && systemctl reload nginx
8. Cai SSL:
   apt install -y certbot python3-certbot-nginx
   certbot --nginx -d dangtri.com -d www.dangtri.com

EOF
