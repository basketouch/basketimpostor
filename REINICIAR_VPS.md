# 🔄 Reiniciar Aplicación en VPS

## Reiniciar con PM2

Conéctate al VPS y ejecuta:

```bash
ssh root@147.93.90.134

# Reiniciar la aplicación
pm2 restart basketimpostor

# Ver logs para verificar que todo está bien
pm2 logs basketimpostor --lines 20
```

## Verificar que la imagen está accesible

Después de reiniciar, prueba:

1. **Directamente la imagen**: `https://www.basketimpostor.com/images/publi.jpg`
   - Debe cargar la imagen

2. **En la aplicación**: Finaliza una ronda y verifica que se vea la imagen intersticial

## Si sigue sin funcionar

Verifica permisos:

```bash
# En el VPS
chmod 644 /var/www/basketimpostor/public/images/publi.jpg
chown -R $USER:$USER /var/www/basketimpostor/public/images/
```

Verifica que el servidor esté sirviendo archivos estáticos:

```bash
# Verificar configuración
cat /var/www/basketimpostor/server.js | grep "express.static"
```

Debería mostrar:
```javascript
app.use(express.static(path.join(__dirname, 'public')));
```

