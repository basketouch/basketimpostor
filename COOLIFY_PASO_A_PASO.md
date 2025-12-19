# 🚀 Coolify - Guía Paso a Paso (Desde Cero)

## Paso 1: Crear Nueva Aplicación en Coolify

1. En Coolify, click en **"New Resource"** o **"+"**
2. Selecciona **"Application"** o **"Web Application"**

## Paso 2: Configurar Repositorio (IMPORTANTE: Usar HTTPS)

En el formulario de creación:

1. **Repository URL**: 
   ```
   https://github.com/basketouch/basketimpostor.git
   ```
   ⚠️ **MUY IMPORTANTE**: Debe ser `https://` NO `git@github.com`

2. **Branch**: 
   ```
   main
   ```

3. **Build Pack**: 
   - Selecciona **"Nixpacks"** (detecta Node.js automáticamente)

4. **Base Directory**: 
   - Déjalo **vacío**

5. **Port**: 
   ```
   3000
   ```

6. **Is it a static site?**: 
   - **NO marcar** (no es un sitio estático)

7. Click en **"Continue"**

## Paso 3: Configurar Variables de Entorno

En la siguiente pantalla, busca la sección **"Environment Variables"** o **"Env"**:

Añade estas variables (una por línea):

```
NODE_ENV=production
ALLOWED_ORIGINS=https://www.basketimpostor.com,https://basketimpostor.com
PORT=3000
```

## Paso 4: Configurar Dominio

1. Busca la sección **"Domains"** o **"Custom Domain"**
2. Añade: `www.basketimpostor.com`
3. Coolify configurará automáticamente:
   - SSL/HTTPS (Let's Encrypt)
   - Proxy reverso
   - Certificado SSL

## Paso 5: Desplegar

1. Click en **"Deploy"** o **"Save & Deploy"**
2. Ve a la pestaña **"Logs"** para ver el progreso
3. Espera 2-5 minutos para el primer despliegue

## Paso 6: Configurar DNS en Hostinger

Una vez que Coolify termine el despliegue:

1. Ve al panel de Hostinger → **DNS Zone Editor**
2. Coolify te mostrará una IP o dominio
3. Añade registro:

**Si Coolify te da una IP:**
- Tipo: **A**
- Nombre: `www`
- Valor: `[IP_QUE_TE_DA_COOLIFY]`
- TTL: `3600`

**Si Coolify te da un dominio:**
- Tipo: **CNAME**
- Nombre: `www`
- Valor: `[dominio-de-coolify]`
- TTL: `3600`

## Verificar que Funciona

1. Espera 5-30 minutos para propagación DNS
2. Visita: `https://www.basketimpostor.com`
3. Debe cargar tu aplicación
4. Prueba crear una partida

## Si Sigue Fallando

### Error: "Repository not found"

**Solución**: Asegúrate de que la URL sea:
- ✅ `https://github.com/basketouch/basketimpostor.git`
- ❌ NO `git@github.com:basketouch/basketimpostor.git`

### Error: "Could not read from remote repository"

**Solución**: 
1. Verifica que el repositorio sea **público** en GitHub
2. O configura autenticación en Coolify (GitHub App)

### Verificar que el repositorio existe

Ve a: https://github.com/basketouch/basketimpostor

Debe mostrar tu código. Si no existe, créalo primero.

---

## Checklist Final

Antes de desplegar, verifica:

- [ ] URL del repositorio usa `https://` (no `git@`)
- [ ] Branch es `main`
- [ ] Build Pack es `Nixpacks`
- [ ] Port es `3000`
- [ ] Variables de entorno están configuradas
- [ ] Dominio está configurado
- [ ] Repositorio es público o tiene autenticación configurada

---

**¡Sigue estos pasos exactamente y debería funcionar!** 🚀




