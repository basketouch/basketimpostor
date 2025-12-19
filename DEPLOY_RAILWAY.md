# 🚂 Despliegue en Railway - La Opción Más Simple

Railway es perfecto para aplicaciones Node.js con WebSockets. Es más fácil que Render y funciona muy bien.

## Pasos para Desplegar (5 minutos)

### 1. Crear cuenta en Railway

1. Ve a https://railway.app
2. Click en "Start a New Project"
3. Inicia sesión con GitHub

### 2. Conectar Repositorio

1. Selecciona "Deploy from GitHub repo"
2. Busca y selecciona: `basketouch/basketimpostor`
3. Railway detectará automáticamente que es Node.js

### 3. Configurar Variables de Entorno

1. En el dashboard de Railway, click en tu proyecto
2. Ve a la pestaña "Variables"
3. Añade estas variables:

```
NODE_ENV = production
ALLOWED_ORIGINS = https://www.basketimpostor.com,https://basketimpostor.com
```

### 4. Configurar Dominio Personalizado

1. En Railway, ve a "Settings" → "Networking"
2. Click en "Custom Domain"
3. Añade: `www.basketimpostor.com`
4. Railway te dará instrucciones de DNS

### 5. Configurar DNS en Hostinger

1. Ve al panel de Hostinger → DNS Zone Editor
2. Añade registro **CNAME**:
   - Nombre: `www`
   - Valor: `[tu-app].railway.app` (Railway te lo dirá)
   - TTL: `3600`

### 6. ¡Listo!

Railway automáticamente:
- ✅ Detecta Node.js
- ✅ Instala dependencias (`npm install`)
- ✅ Inicia el servidor (`npm start`)
- ✅ Proporciona HTTPS/SSL gratis
- ✅ Soporta WebSockets nativamente

## Plan Gratuito de Railway

- **$5 de crédito gratis** cada mes
- Suficiente para una app pequeña/mediana
- Si necesitas más, el plan Pro es $5/mes

## Actualizar Código

Cada vez que hagas `git push` a tu repositorio, Railway automáticamente:
1. Detecta los cambios
2. Reconstruye la aplicación
3. La despliega automáticamente

## Verificación

1. Espera 2-5 minutos para el primer despliegue
2. Visita: https://www.basketimpostor.com
3. Prueba crear una partida
4. Verifica WebSockets (deben funcionar perfectamente)

## Ventajas de Railway

- ✅ Más simple que Render
- ✅ Soporta WebSockets nativamente
- ✅ Despliegue automático desde GitHub
- ✅ SSL/HTTPS incluido
- ✅ Dominio personalizado gratis
- ✅ Logs en tiempo real
- ✅ $5 gratis cada mes

## Troubleshooting

### La app no carga
- Verifica que el DNS esté propagado (puede tardar hasta 24h)
- Revisa los logs en Railway: Click en "Deployments" → "View Logs"

### WebSockets no funcionan
- Railway soporta WebSockets por defecto, no necesitas configuración extra
- Verifica que `ALLOWED_ORIGINS` incluya tu dominio

### Error en el despliegue
- Revisa los logs en Railway
- Verifica que `package.json` tenga el script `start`
- Asegúrate de que todas las dependencias estén en `dependencies` (no `devDependencies`)

---

**Railway es la opción más simple y rápida para tu caso.** 🚀

