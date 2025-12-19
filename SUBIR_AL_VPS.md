# 📤 Subir Archivos al VPS

## Verificar que la imagen esté en el VPS

Conéctate por SSH a tu VPS y verifica:

```bash
ssh root@tu-ip-vps
# o
ssh usuario@tu-ip-vps

# Verificar que la imagen existe
ls -la /var/www/basketimpostor/public/images/publi.jpg

# Si no existe, necesitas subirla
```

## Opción 1: Subir con SCP (desde tu Mac)

```bash
scp /Users/jorgelorenzo/Desktop/BasketImpostor/public/images/publi.jpg root@tu-ip-vps:/var/www/basketimpostor/public/images/
```

## Opción 2: Subir con Git (si tienes el repo en el VPS)

```bash
# En el VPS
cd /var/www/basketimpostor
git pull origin main
```

## Opción 3: Verificar estructura de carpetas

```bash
# En el VPS
cd /var/www/basketimpostor
ls -la public/images/

# Deberías ver:
# - publi.jpg
# - fondo_horizontal.png
# - fondo_vertical 2.jpg
# - fondo_vertical.png
```

## Verificar que el servidor sirve archivos estáticos

```bash
# En el VPS, verifica que Express está configurado correctamente
cat /var/www/basketimpostor/server.js | grep "express.static"
```

Debería mostrar:
```javascript
app.use(express.static(path.join(__dirname, 'public')));
```

## Reiniciar la aplicación

Después de subir la imagen:

```bash
# En el VPS
cd /var/www/basketimpostor
pm2 restart basketimpostor

# Ver logs para verificar
pm2 logs basketimpostor
```

## Verificar que funciona

1. Prueba directamente: `https://www.basketimpostor.com/images/publi.jpg`
2. Debe cargar la imagen
3. Si no carga, verifica permisos:

```bash
# En el VPS
chmod 644 /var/www/basketimpostor/public/images/publi.jpg
chown -R $USER:$USER /var/www/basketimpostor/public/images/
```

## Troubleshooting

### Error 404
- Verifica que la imagen esté en `/var/www/basketimpostor/public/images/publi.jpg`
- Verifica permisos de lectura

### Error 403 (Forbidden)
- Verifica permisos: `chmod 644 public/images/publi.jpg`

### La imagen no se actualiza
- Limpia cache del navegador: Ctrl+Shift+R
- Reinicia PM2: `pm2 restart basketimpostor`

