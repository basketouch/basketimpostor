# 🚀 Desplegar Panel Admin en VPS

## Pasos para desplegar

### 1. Conectarse al VPS

```bash
ssh root@147.93.90.134
```

### 2. Ir al directorio de la aplicación

```bash
cd /var/www/basketimpostor
```

### 3. Hacer pull del repositorio

```bash
git pull origin main
```

### 4. Verificar que el archivo existe

```bash
ls -la public/admin.html
```

Deberías ver el archivo. Si no existe, verifica la ruta del proyecto.

### 5. Verificar que server.js tiene la ruta /admin

```bash
grep -n "app.get('/admin'" server.js
```

Debería mostrar la línea con la ruta.

### 6. Reiniciar la aplicación

```bash
pm2 restart basketimpostor
```

O si no está en PM2:

```bash
pm2 start server.js --name basketimpostor
```

### 7. Verificar logs

```bash
pm2 logs basketimpostor --lines 20
```

### 8. Probar el panel

Abre en el navegador:
- `https://www.basketimpostor.com/admin`

## Si sigue sin funcionar

### Verificar estructura de carpetas

```bash
cd /var/www/basketimpostor
ls -la public/
```

Deberías ver:
- admin.html
- index.html
- app.js
- styles.css
- images/

### Verificar permisos

```bash
chmod 644 public/admin.html
chown -R $USER:$USER /var/www/basketimpostor/public/
```

### Verificar que Express sirve archivos estáticos

```bash
grep -n "express.static" server.js
```

Debería mostrar:
```javascript
app.use(express.static(path.join(__dirname, 'public')));
```

### Verificar que la ruta /admin está antes de express.static

La ruta `/admin` debe estar definida ANTES de `express.static` o usar una ruta específica.

## Debug

Si sigue sin funcionar, verifica:

1. **Ruta del proyecto**: ¿Está en `/var/www/basketimpostor`?
2. **Puerto**: ¿El servidor está corriendo en el puerto correcto?
3. **Nginx**: Si usas Nginx, verifica la configuración del proxy

