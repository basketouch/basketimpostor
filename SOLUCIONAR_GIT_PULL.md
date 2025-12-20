# 🔧 Solucionar Error de Git Pull

El error es porque `publi.jpg` existe en el VPS pero Git quiere sobrescribirlo.

## Solución Rápida

Ejecuta estos comandos en el VPS:

```bash
cd /var/www/basketimpostor

# Opción 1: Hacer backup y luego pull
mv public/images/publi.jpg public/images/publi.jpg.backup
git pull origin main
mv public/images/publi.jpg.backup public/images/publi.jpg

# O Opción 2: Forzar el pull (más simple)
git fetch origin
git reset --hard origin/main
```

## Después del pull

```bash
# Verificar que admin.html existe
ls -la public/admin.html

# Reiniciar la aplicación
pm2 restart basketimpostor

# Ver logs
pm2 logs basketimpostor --lines 20
```

## Verificar que funciona

Abre en el navegador:
- `https://www.basketimpostor.com/admin`
- `https://www.basketimpostor.com/api/stats`

