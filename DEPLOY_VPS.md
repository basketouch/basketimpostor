# 🖥️ Despliegue en VPS - Guía Completa

## Requisitos Previos

- VPS con acceso SSH
- Ubuntu/Debian (o similar)
- Acceso root o usuario con sudo

## Paso 1: Conectarse al VPS

```bash
ssh root@tu-ip-vps
# o
ssh usuario@tu-ip-vps
```

## Paso 2: Actualizar el Sistema

```bash
sudo apt update && sudo apt upgrade -y
```

## Paso 3: Instalar Node.js

```bash
# Instalar Node.js 18.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version
npm --version
```

Deberías ver algo como: `v18.x.x` y `9.x.x`

## Paso 4: Instalar PM2 (Gestor de Procesos)

PM2 mantiene tu aplicación corriendo 24/7 y la reinicia automáticamente si se cae.

```bash
sudo npm install -g pm2
```

## Paso 5: Instalar Git (si no está instalado)

```bash
sudo apt install git -y
```

## Paso 6: Clonar el Repositorio

```bash
# Crear directorio para la aplicación
sudo mkdir -p /var/www
cd /var/www

# Clonar tu repositorio
sudo git clone https://github.com/basketouch/basketimpostor.git
cd basketimpostor

# Dar permisos al usuario actual
sudo chown -R $USER:$USER /var/www/basketimpostor
```

## Paso 7: Instalar Dependencias

```bash
cd /var/www/basketimpostor
npm install --production
```

## Paso 8: Crear Archivo .env

```bash
nano .env
```

Añade este contenido:

```env
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://www.basketimpostor.com,https://basketimpostor.com
```

Guarda con `Ctrl+O`, luego `Enter`, y sal con `Ctrl+X`.

## Paso 9: Iniciar la Aplicación con PM2

```bash
cd /var/www/basketimpostor
pm2 start server.js --name basketimpostor
pm2 save
pm2 startup
```

El último comando te dará un comando para ejecutar. Cópialo y ejecútalo (será algo como `sudo env PATH=...`).

## Paso 10: Verificar que Funciona

```bash
# Ver estado
pm2 status

# Ver logs
pm2 logs basketimpostor

# Probar que responde
curl http://localhost:3000
```

Deberías ver el HTML de tu aplicación.

## Paso 11: Instalar y Configurar Nginx

Nginx actuará como proxy reverso y manejará el SSL.

```bash
# Instalar Nginx
sudo apt install nginx -y

# Crear configuración
sudo nano /etc/nginx/sites-available/basketimpostor
```

Pega esta configuración:

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
        
        # Timeout para WebSockets
        proxy_read_timeout 86400;
    }
}
```

Guarda y sal.

## Paso 12: Activar el Sitio en Nginx

```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/basketimpostor /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Si todo está bien, reiniciar Nginx
sudo systemctl restart nginx
```

## Paso 13: Configurar Firewall

```bash
# Instalar UFW si no está instalado
sudo apt install ufw -y

# Permitir SSH (¡IMPORTANTE! Hazlo primero)
sudo ufw allow 22/tcp

# Permitir HTTP y HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Activar firewall
sudo ufw enable

# Ver estado
sudo ufw status
```

## Paso 14: Instalar SSL con Let's Encrypt (HTTPS Gratis)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL
sudo certbot --nginx -d www.basketimpostor.com -d basketimpostor.com
```

Certbot te hará algunas preguntas:
- Email: Tu email (para notificaciones de renovación)
- Términos: Acepta (A)
- Compartir email: Opcional (N)
- Redirigir HTTP a HTTPS: Sí (2)

## Paso 15: Configurar DNS en Hostinger

1. Ve al panel de Hostinger
2. DNS Zone Editor o Gestión DNS
3. Añade estos registros:

**Registro A para www:**
- Tipo: `A`
- Nombre: `www`
- Valor: `[IP_DE_TU_VPS]`
- TTL: `3600`

**Registro A para dominio raíz:**
- Tipo: `A`
- Nombre: `@` (o deja vacío)
- Valor: `[IP_DE_TU_VPS]`
- TTL: `3600`

## Paso 16: Verificar que Todo Funciona

1. Espera 5-30 minutos para propagación DNS
2. Visita: https://www.basketimpostor.com
3. Debe cargar tu aplicación
4. Prueba crear una partida
5. Verifica WebSockets (actualizaciones en tiempo real)

## Comandos Útiles

### Ver logs de la aplicación
```bash
pm2 logs basketimpostor
```

### Reiniciar aplicación
```bash
pm2 restart basketimpostor
```

### Ver estado
```bash
pm2 status
```

### Detener aplicación
```bash
pm2 stop basketimpostor
```

### Actualizar código
```bash
cd /var/www/basketimpostor
git pull
npm install --production
pm2 restart basketimpostor
```

### Ver logs de Nginx
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## Renovación Automática de SSL

Let's Encrypt renueva automáticamente, pero puedes verificar:

```bash
# Probar renovación
sudo certbot renew --dry-run

# Ver certificados
sudo certbot certificates
```

## Troubleshooting

### La aplicación no inicia
```bash
# Ver logs detallados
pm2 logs basketimpostor --lines 50

# Verificar que el puerto 3000 esté libre
sudo netstat -tulpn | grep 3000
```

### Nginx no carga
```bash
# Verificar configuración
sudo nginx -t

# Ver logs de error
sudo tail -f /var/log/nginx/error.log
```

### WebSockets no funcionan
- Verifica que Nginx tenga las líneas `Upgrade` y `Connection`
- Verifica que el firewall permita el puerto 80 y 443
- Revisa los logs: `pm2 logs basketimpostor`

### Dominio no carga
- Verifica DNS: `dig www.basketimpostor.com`
- Verifica que Nginx esté corriendo: `sudo systemctl status nginx`
- Verifica que la app esté corriendo: `pm2 status`

### Error de permisos
```bash
# Dar permisos al directorio
sudo chown -R $USER:$USER /var/www/basketimpostor
```

## Seguridad Adicional (Opcional)

### Cambiar puerto SSH (recomendado)
```bash
sudo nano /etc/ssh/sshd_config
# Cambia Port 22 a otro puerto (ej: 2222)
sudo systemctl restart sshd
```

### Instalar fail2ban (protección contra ataques)
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Coste Total

- **VPS**: Lo que ya pagas
- **Dominio**: Lo que ya pagas en Hostinger
- **SSL**: Gratis (Let's Encrypt)
- **Total adicional**: $0 🎉

## Ventajas de VPS

- ✅ Control total
- ✅ Sin límites de uso
- ✅ Puedes instalar lo que quieras
- ✅ Más económico a largo plazo
- ✅ Mejor rendimiento

---

**¡Tu aplicación estará en producción en menos de 30 minutos!** 🚀




