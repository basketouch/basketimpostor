# 🚀 Guía de Despliegue - basketimpostor.com

## Preparación para Producción

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (o configúralas en tu plataforma de hosting):

```env
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://www.basketimpostor.com,https://basketimpostor.com
```

### 2. Verificar Archivos

Asegúrate de que todos los archivos estén presentes:
- ✅ `server.js`
- ✅ `package.json`
- ✅ `locations.js`
- ✅ Carpeta `public/` con todos los archivos
- ✅ `public/images/fondo_horizontal.png` y `fondo_vertical.png`

## Opciones de Despliegue

### Opción 1: Render.com (Recomendado - Gratis con limitaciones)

1. **Crear cuenta en Render.com**
   - Ve a https://render.com
   - Regístrate con GitHub

2. **Crear nuevo Web Service**
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub
   - O sube el código manualmente

3. **Configuración del servicio:**
   ```
   Name: basketimpostor
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Variables de Entorno:**
   - `NODE_ENV` = `production`
   - `PORT` = (Render lo asigna automáticamente)
   - `ALLOWED_ORIGINS` = `https://www.basketimpostor.com,https://basketimpostor.com`

5. **Configurar dominio personalizado:**
   - En el dashboard, ve a "Settings" → "Custom Domains"
   - Añade `www.basketimpostor.com`
   - Render te dará instrucciones para configurar DNS

6. **DNS Configuration:**
   - Añade un registro CNAME en tu proveedor DNS:
     ```
     www.basketimpostor.com → [tu-servicio].onrender.com
     ```

### Opción 2: Railway.app

1. **Crear cuenta en Railway**
   - Ve a https://railway.app
   - Conecta con GitHub

2. **Nuevo Proyecto**
   - "New Project" → "Deploy from GitHub repo"
   - Selecciona tu repositorio

3. **Configuración automática:**
   - Railway detecta Node.js automáticamente
   - Añade variables de entorno en "Variables"

4. **Dominio personalizado:**
   - Settings → "Generate Domain" o añade tu dominio
   - Configura DNS según las instrucciones

### Opción 3: Fly.io

1. **Instalar Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login:**
   ```bash
   fly auth login
   ```

3. **Crear app:**
   ```bash
   fly launch
   ```

4. **Configurar dominio:**
   ```bash
   fly domains add www.basketimpostor.com
   ```

### Opción 4: VPS (DigitalOcean, Linode, etc.)

Si tienes un VPS, puedes usar PM2 para gestionar el proceso:

1. **Instalar Node.js y PM2:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

2. **Clonar y configurar:**
   ```bash
   git clone [tu-repo] /var/www/basketimpostor
   cd /var/www/basketimpostor
   npm install --production
   ```

3. **Crear archivo .env:**
   ```bash
   nano .env
   # Añade las variables de entorno
   ```

4. **Iniciar con PM2:**
   ```bash
   pm2 start server.js --name basketimpostor
   pm2 save
   pm2 startup
   ```

5. **Configurar Nginx como reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name www.basketimpostor.com basketimpostor.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **SSL con Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d www.basketimpostor.com -d basketimpostor.com
   ```

## Configuración DNS

Para cualquier opción, necesitarás configurar DNS:

### Si usas Render/Railway/Fly:
- **CNAME**: `www` → `[tu-servicio].onrender.com` (o dominio de la plataforma)

### Si usas VPS:
- **A Record**: `www` → IP de tu servidor
- **A Record**: `@` → IP de tu servidor (para dominio sin www)

## Verificación Post-Despliegue

1. ✅ Verifica que la app carga en https://www.basketimpostor.com
2. ✅ Prueba crear una partida
3. ✅ Prueba unirse desde otro dispositivo
4. ✅ Verifica que WebSockets funcionan (las actualizaciones en tiempo real)
5. ✅ Verifica SSL/HTTPS (importante para AdSense)

## Troubleshooting

### WebSockets no funcionan
- Verifica que tu plataforma soporte WebSockets
- En Render, asegúrate de usar el plan que soporta WebSockets
- Verifica CORS en `server.js`

### Error de conexión
- Verifica que el puerto esté correcto
- Revisa los logs del servidor
- Verifica variables de entorno

### Dominio no carga
- Espera 24-48 horas para propagación DNS
- Verifica configuración DNS con `dig www.basketimpostor.com`
- Verifica que el certificado SSL esté activo

## Monitoreo

Considera añadir:
- **Uptime monitoring**: UptimeRobot (gratis)
- **Error tracking**: Sentry (tiene plan gratuito)
- **Analytics**: Google Analytics

## Mantenimiento

- Las partidas se pierden si el servidor se reinicia (por diseño)
- El garbage collection limpia salas inactivas cada hora
- Monitorea el uso de memoria si tienes muchas partidas simultáneas

