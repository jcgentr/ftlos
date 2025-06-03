# Deployment Guide

## Frontend Deployment

### Local Machine Steps

1. Set up production environment variables:

```bash
cd /Users/jg/workspace/ftlos/frontend
echo "VITE_API_URL=" > .env.production
```

2. Build the frontend:

```bash
pnpm build
```

3. Copy the built files to the Linode server:

```bash
scp -r dist/* root@74.207.237.116:/var/www/react-frontend/
```

4. Clean up old assets on server (optional):

```bash
ssh -i id_ed25519 root@74.207.237.116 "cd /var/www/react-frontend/assets/ && rm -f *.old.css *.old.js"
```

## Backend Deployment

### Local Machine Steps

1. Copy the backend source code to the server (excluding dist and node_modules):

```bash
cd /Users/jg/workspace/ftlos
rsync -avz --exclude='dist' --exclude='node_modules' --exclude='.env' backend/ root@74.207.237.116:/var/www/backend/
```

### Linode Server Steps

1. SSH into the server:

```bash
ssh -i id_ed25519 root@74.207.237.116
```

2. Navigate to the backend directory:

```bash
cd /var/www/backend
```

3. Install dependencies:

```bash
pnpm install
```

4. Generate Prisma client:

```bash
npx prisma generate
```

5. Build the backend:

```bash
pnpm build
```

6. Apply database migrations:

```bash
npx prisma migrate deploy
```

7. Restart the backend service:

```bash
pm2 restart ftlos-backend || pm2 start dist/app.js --name "ftlos-backend"
pm2 save
```

## NGINX Configuration

Ensure NGINX is configured to serve the frontend and proxy API requests to the backend:

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/react-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to the backend
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
        expires max;
        add_header Cache-Control "public, max-age=31536000";
    }
}
```

To update NGINX configuration:

```bash
sudo nano /etc/nginx/sites-available/default
sudo nginx -t
sudo systemctl reload nginx
```

The only times you need to restart or reload NGINX are:

- When you change the NGINX configuration files

- When you add or modify SSL certificates

- When you update NGINX itself
