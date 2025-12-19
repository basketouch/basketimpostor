# 🚀 Despliegue en Hostinger - basketimpostor.com

## Opciones de Despliegue con Hostinger

Hostinger ofrece diferentes tipos de hosting. Para una aplicación Node.js con WebSockets, tienes dos opciones:

### Opción 1: VPS de Hostinger (Recomendado)

Si tienes un VPS de Hostinger, puedes desplegar directamente allí.

#### Paso 1: Conectarse al VPS

```bash
ssh root@tu-ip-vps
# o
ssh usuario@tu-ip-vps
```

#### Paso 2: Instalar Node.js

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version
npm --version
```

#### Paso 3: Instalar PM2 (Gestor de procesos)

```bash
sudo npm install -g pm2
```

#### Paso 4: Clonar el repositorio

```bash
cd /var/www
git clone https://github.com/basketouch/basketimpostor.git
cd basketimpostor
npm install --production
```

#### Paso 5: Crear archivo .env

```bash
nano .env
```

Añade:
```env
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://www.basketimpostor.com,https://basketimpostor.com
```

#### Paso 6: Iniciar con PM2

```bash
pm2 start server.js --name basketimpostor
pm2 save
pm2 startup
```

#### Paso 7: Configurar Nginx como Reverse Proxy

```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/basketimpostor
```

Añade esta configuración:

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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activar el sitio:

```bash
sudo ln -s /etc/nginx/sites-available/basketimpostor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Paso 8: Configurar SSL con Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d www.basketimpostor.com -d basketimpostor.com
```

El certificado se renovará automáticamente.

#### Paso 9: Configurar DNS en Hostinger

En el panel de Hostinger:
1. Ve a "DNS Zone Editor" o "Gestión DNS"
2. Añade:
   - **Tipo A**: `www` → IP de tu VPS
   - **Tipo A**: `@` → IP de tu VPS (para dominio sin www)

---

### Opción 2: Hosting Compartido + Servicio Externo (Más Fácil)

Si solo tienes hosting compartido (no VPS), Hostinger no soporta Node.js directamente. Usa esta solución:

#### Usar Render.com o Railway (Gratis) + Dominio de Hostinger

1. **Desplegar en Render.com:**
   - Ve a https://render.com
   - Conecta tu repositorio: https://github.com/basketouch/basketimpostor
   - Crea un "Web Service"
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Variables de entorno:
     - `NODE_ENV` = `production`
     - `ALLOWED_ORIGINS` = `https://www.basketimpostor.com,https://basketimpostor.com`

2. **Obtener URL de Render:**
   - Render te dará una URL como: `basketimpostor.onrender.com`

3. **Configurar DNS en Hostinger:**
   - Ve al panel de Hostinger → DNS Zone Editor
   - Añade registro **CNAME**:
     - Nombre: `www`
     - Valor: `[tu-app].onrender.com` (la URL que te dio Render)
   - Añade registro **CNAME**:
     - Nombre: `@` (o deja vacío para dominio raíz)
     - Valor: `[tu-app].onrender.com`

4. **Configurar dominio en Render:**
   - En Render, ve a Settings → Custom Domains
   - Añade: `www.basketimpostor.com`
   - Render verificará el DNS automáticamente

---

## Verificación Post-Despliegue

1. ✅ Verifica que carga: https://www.basketimpostor.com
2. ✅ Verifica SSL: Debe mostrar el candado verde
3. ✅ Prueba crear una partida
4. ✅ Prueba unirse desde otro dispositivo
5. ✅ Verifica WebSockets (actualizaciones en tiempo real)

## Comandos Útiles (VPS)

```bash
# Ver logs de la aplicación
pm2 logs basketimpostor

# Reiniciar aplicación
pm2 restart basketimpostor

# Ver estado
pm2 status

# Actualizar código
cd /var/www/basketimpostor
git pull
npm install --production
pm2 restart basketimpostor
```

## Troubleshooting

### Error: "Cannot find module"
```bash
cd /var/www/basketimpostor
npm install --production
```

### WebSockets no funcionan
- Verifica que Nginx tenga la configuración de `Upgrade` y `Connection`
- Verifica que el puerto 3000 esté abierto: `sudo ufw allow 3000`

### Dominio no carga
- Verifica DNS: `dig www.basketimpostor.com`
- Verifica que Nginx esté corriendo: `sudo systemctl status nginx`
- Verifica logs de Nginx: `sudo tail -f /var/log/nginx/error.log`

### SSL no funciona
- Verifica certificado: `sudo certbot certificates`
- Renovar manualmente: `sudo certbot renew`

## Actualizaciones Futuras

Para actualizar la aplicación después de cambios en GitHub:

```bash
cd /var/www/basketimpostor
git pull origin main
npm install --production
pm2 restart basketimpostor
```

---

## ¿Qué tipo de hosting tienes en Hostinger?

- **VPS**: Sigue la Opción 1
- **Hosting Compartido**: Sigue la Opción 2 (Render + DNS)

Si no estás seguro, revisa tu panel de Hostinger o contacta con su soporte.

