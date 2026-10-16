#!/usr/bin/env bash
# =============================================================================
# Deploy dangtri.com len VPS Linux (Ubuntu/Debian)
# Cach dung tren VPS (dang nhap bang root):
#     ssh root@14.225.220.49 -p 22
#     bash /duong-dan-toi-repo/deploy/vps/bootstrap.sh
#
# Script nay se: cai Node + Nginx + PostgreSQL + PM2, tao database, nap schema,
# build frontend, chay app bang PM2, cau hinh Nginx va xin SSL cho dangtri.com.
# =============================================================================
set -euo pipefail

# ---------------------------------------------------------------------------
# CAU HINH (chinh tai day neu can)
# ---------------------------------------------------------------------------
DOMAIN="dangtri.com"
REPO_URL="https://github.com/thanhnam-cmd/ebook.git"
APP_DIR="/var/www/dangtri.com/app"
DB_NAME="ebook_store"
DB_USER="dangtri_app"
APP_PORT=3000
NODE_MAJOR=22

echo "==========================================="
echo " Deploy $DOMAIN"
echo " Thu muc app: $APP_DIR"
echo "==========================================="

if [ "$(id -u)" -ne 0 ]; then
  echo "LOI: Hay chay script bang quyen root (sudo bash ... hoac dang nhap root)."
  exit 1
fi

# ---------------------------------------------------------------------------
# Buoc 1: Thu thap thong tin can thiet
# ---------------------------------------------------------------------------
read -rp "Mat khau moi cho PostgreSQL user '$DB_USER': " DB_PASS
read -rp "SMTP_USER (Gmail gui mail): " SMTP_USER_IN
read -rsp "SMTP_PASS (App Password Gmail): " SMTP_PASS_IN; echo
read -rp "SMTP_FROM (vi du: DANG TRI <books.dangtri@gmail.com>): " SMTP_FROM_IN
read -rp "Email nhan thong bao SSL (Let's Encrypt): " SSL_EMAIL

BASE_URL="https://$DOMAIN"

# ---------------------------------------------------------------------------
# Buoc 2: Cai dat goi he thong
# ---------------------------------------------------------------------------
echo "==> Cai dat goi he thong..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl git nginx postgresql postgresql-contrib ca-certificates

if ! command -v node >/dev/null 2>&1; then
  echo "==> Cai Node.js $NODE_MAJOR..."
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "==> Cai PM2..."
  npm install -g pm2
fi

# ---------------------------------------------------------------------------
# Buoc 3: Tao database PostgreSQL
# ---------------------------------------------------------------------------
echo "==> Cau hinh PostgreSQL..."
systemctl enable --now postgresql

sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 \
  || sudo -u postgres createdb "$DB_NAME"

sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 \
  || sudo -u postgres createuser "$DB_USER"

sudo -u postgres psql -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASS';"
sudo -u postgres psql -d "$DB_NAME" -c "ALTER SCHEMA public OWNER TO $DB_USER;"
sudo -u postgres psql -d "$DB_NAME" -c "GRANT ALL ON SCHEMA public TO $DB_USER;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# ---------------------------------------------------------------------------
# Buoc 4: Lay source code
# ---------------------------------------------------------------------------
echo "==> Lay source code..."
mkdir -p "$(dirname "$APP_DIR")"

if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" fetch --all
  git -C "$APP_DIR" reset --hard origin/main
else
  rm -rf "$APP_DIR"
  git clone "$REPO_URL" "$APP_DIR" || {
    echo "LOI: Khong clone duoc repo. Neu repo la private, hay dung token:"
    echo "  git clone https://<TOKEN>@github.com/thanhnam-cmd/ebook.git $APP_DIR"
    exit 1
  }
fi

cd "$APP_DIR"

# ---------------------------------------------------------------------------
# Buoc 5: Tao file .env
# ---------------------------------------------------------------------------
echo "==> Tao file .env..."
cat > "$APP_DIR/.env" <<EOF
NODE_ENV=production
PORT=$APP_PORT
BASE_URL=$BASE_URL

# Nha cung cap du lieu: postgres
DB_PROVIDER=postgres

# Ket noi PostgreSQL (chay cung may VPS)
DATABASE_URL=postgresql://$DB_USER:$DB_PASS@127.0.0.1:5432/$DB_NAME
PGSSL=false

# SMTP gui email ebook tu dong
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=$SMTP_USER_IN
SMTP_PASS=$SMTP_PASS_IN
SMTP_FROM=$SMTP_FROM_IN
EOF

chmod 600 "$APP_DIR/.env"

# ---------------------------------------------------------------------------
# Buoc 6: Nap schema + build
# ---------------------------------------------------------------------------
echo "==> Nap schema PostgreSQL..."
PGPASSWORD="$DB_PASS" psql -h 127.0.0.1 -U "$DB_USER" -d "$DB_NAME" \
  -f "$APP_DIR/database/postgres/01_schema.sql"

echo "==> Cai dependencies va build frontend..."
npm ci --no-audit --no-fund || npm install --no-audit --no-fund
npm run build

# ---------------------------------------------------------------------------
# Buoc 7: Chay app bang PM2
# ---------------------------------------------------------------------------
echo "==> Khoi dong app bang PM2..."
pm2 delete "$(node -e "console.log(require('./ecosystem.config.cjs').apps[0].name)")" 2>/dev/null || true
pm2 start "$APP_DIR/ecosystem.config.cjs"
pm2 save
pm2 startup systemd -u root --hp /root | tail -n 1 | bash || true

# ---------------------------------------------------------------------------
# Buoc 8: Cau hinh Nginx
# ---------------------------------------------------------------------------
echo "==> Cau hinh Nginx..."
cp "$APP_DIR/deploy/nginx/$DOMAIN.conf" "/etc/nginx/sites-available/$DOMAIN"
ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# ---------------------------------------------------------------------------
# Buoc 9: SSL
# ---------------------------------------------------------------------------
echo "==> Xin SSL cho $DOMAIN..."
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" \
  --non-interactive --agree-tos -m "$SSL_EMAIL" --redirect || {
    echo "CANH BAO: certbot that bai. Kiem tra DNS $DOMAIN da tro ve IP VPS chua."
  }

echo ""
echo "==========================================="
echo " HOAN TAT DEPLOY"
echo " Website:      $BASE_URL"
echo " Webhook SePay: $BASE_URL/api/sepay/webhook"
echo " Quan ly app:  pm2 status | pm2 logs dangtri-ebook-store"
echo "==========================================="
