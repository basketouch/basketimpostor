# 🚀 Despliegue en Coolify - La Opción Más Fácil

Coolify es perfecto porque ya tienes todo configurado. Es como tener tu propio Heroku en tu VPS.

## Pasos para Desplegar (10 minutos)

### 1. Acceder a Coolify

1. Ve a tu panel de Coolify (normalmente `http://tu-ip:8000` o tu dominio)
2. Inicia sesión

### 2. Crear Nuevo Proyecto

1. Click en **"New Resource"** o **"Create"**
2. Selecciona **"Application"** o **"Web Application"**
3. Elige **"From Public Git Repository"** o **"From GitHub"**

### 3. Configurar Repositorio

1. **Repository URL**: `https://github.com/basketouch/basketimpostor`
2. **Branch**: `main` (o `master` si es tu rama principal)
3. **Build Pack**: Selecciona **"Node.js"** o **"Nixpacks"** (Coolify lo detectará automáticamente)

### 4. Configurar Variables de Entorno

En la sección **"Environment Variables"** o **"Env"**, añade:

```
NODE_ENV=production
ALLOWED_ORIGINS=https://www.basketimpostor.com,https://basketimpostor.com
PORT=3000
```

**Nota**: Coolify puede asignar el puerto automáticamente, pero es bueno especificarlo.

### 5. Configurar Dominio

1. En la sección **"Domains"** o **"Custom Domain"**
2. Añade: `www.basketimpostor.com`
3. Coolify configurará automáticamente:
   - ✅ SSL/HTTPS (con Let's Encrypt)
   - ✅ Proxy reverso
   - ✅ Certificado SSL automático

### 6. Configurar Puerto (si es necesario)

Si Coolify pregunta por el puerto:
- **Port**: `3000`
- O deja que Coolify lo detecte automáticamente

### 7. Desplegar

1. Click en **"Deploy"** o **"Save & Deploy"**
2. Coolify automáticamente:
   - Clona el repositorio
   - Ejecuta `npm install`
   - Inicia `npm start`
   - Configura el dominio
   - Obtiene certificado SSL

### 8. Configurar DNS en Hostinger

1. Ve al panel de Hostinger → **DNS Zone Editor**
2. Coolify te dará una IP o dominio
3. Añade registro:

**Si Coolify te da una IP:**
- Tipo: **A**
- Nombre: `www`
- Valor: `[IP_QUE_TE_DA_COOLIFY]`
- TTL: `3600`

**Si Coolify te da un dominio (ej: `app.coolify.io`):**
- Tipo: **CNAME**
- Nombre: `www`
- Valor: `[dominio-de-coolify]`
- TTL: `3600`

### 9. Verificar Despliegue

1. Espera 2-5 minutos para el primer despliegue
2. Ve a la pestaña **"Logs"** en Coolify para ver el progreso
3. Cuando termine, visita: `https://www.basketimpostor.com`
4. Debe cargar tu aplicación

## Configuración Adicional en Coolify

### WebSockets

Coolify soporta WebSockets por defecto, pero verifica:

1. En la configuración de la aplicación
2. Busca **"WebSocket Support"** o **"Upgrade Headers"**
3. Asegúrate de que esté habilitado

### Health Check (Opcional)

Puedes configurar un health check:
- **Path**: `/` (o deja vacío)
- **Port**: `3000`

### Auto Deploy

Coolify puede desplegar automáticamente cuando haces `git push`:

1. En la configuración del proyecto
2. Habilita **"Auto Deploy"** o **"Git Webhook"**
3. Cada vez que hagas push a GitHub, Coolify desplegará automáticamente

## Actualizar la Aplicación

### Opción 1: Auto Deploy (Recomendado)
- Simplemente haz `git push` a tu repositorio
- Coolify detectará los cambios y desplegará automáticamente

### Opción 2: Manual
1. En Coolify, ve a tu aplicación
2. Click en **"Redeploy"** o **"Deploy"**
3. Coolify reconstruirá y desplegará

## Ver Logs

1. En Coolify, selecciona tu aplicación
2. Ve a la pestaña **"Logs"**
3. Verás los logs en tiempo real

## Troubleshooting

### La aplicación no inicia

1. **Revisa los logs en Coolify**
   - Ve a "Logs" en tu aplicación
   - Busca errores en rojo

2. **Verifica variables de entorno**
   - Asegúrate de que `NODE_ENV=production` esté configurado
   - Verifica que `PORT` esté correcto

3. **Verifica el build**
   - Los logs mostrarán si `npm install` falló
   - Verifica que todas las dependencias estén en `package.json`

### WebSockets no funcionan

1. **Verifica configuración de proxy**
   - Coolify debería manejar esto automáticamente
   - Si no funciona, verifica que el dominio esté correctamente configurado

2. **Verifica CORS**
   - Asegúrate de que `ALLOWED_ORIGINS` incluya tu dominio

### Dominio no carga

1. **Verifica DNS**
   - Usa `dig www.basketimpostor.com` para verificar
   - Puede tardar hasta 24 horas en propagarse

2. **Verifica SSL en Coolify**
   - Ve a la sección de dominios
   - Verifica que el certificado SSL esté activo

3. **Verifica logs de Coolify**
   - Puede haber errores en la obtención del certificado SSL

### Error de puerto

Si ves errores de puerto:

1. En Coolify, ve a la configuración de la aplicación
2. Verifica que el puerto interno sea `3000`
3. O deja que Coolify lo asigne automáticamente (puede usar `PORT` de las variables de entorno)

## Ventajas de Coolify

- ✅ Interfaz gráfica simple
- ✅ SSL automático (Let's Encrypt)
- ✅ Despliegue automático desde GitHub
- ✅ Logs en tiempo real
- ✅ Reinicio automático si se cae
- ✅ Soporte para WebSockets
- ✅ Sin coste adicional (usa tu VPS)

## Estructura de Archivos que Coolify Necesita

Tu proyecto ya tiene todo lo necesario:
- ✅ `package.json` con script `start`
- ✅ `server.js` como punto de entrada
- ✅ Dependencias en `package.json`

Coolify detectará automáticamente que es Node.js y usará:
- **Build Command**: `npm install` (automático)
- **Start Command**: `npm start` (automático)

## Comandos Útiles en Coolify

### Ver estado de la aplicación
- Dashboard principal muestra el estado

### Reiniciar aplicación
- Click en **"Restart"** en el dashboard

### Ver métricas
- Coolify muestra uso de CPU, memoria, etc.

### Configurar recursos
- Puedes limitar CPU/memoria si es necesario

---

**¡Con Coolify es súper fácil! Solo conecta GitHub y despliega.** 🚀

Si tienes algún problema, los logs en Coolify te dirán exactamente qué está pasando.




