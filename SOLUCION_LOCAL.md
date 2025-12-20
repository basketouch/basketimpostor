# 🔧 Solución para Problemas Locales

## Si funciona en GitHub y servidor pero NO en local:

### 1. Limpiar caché del navegador
- **Chrome/Edge**: Ctrl+Shift+Delete (Windows) o Cmd+Shift+Delete (Mac)
- Selecciona "Caché" y "Archivos en caché"
- O mejor: **Modo Incógnito** para probar

### 2. Verificar que el servidor local esté corriendo
```bash
# Ver procesos
ps aux | grep "node.*server.js"

# Matar todos los procesos
pkill -9 -f "node.*server.js"
pkill -9 -f nodemon

# Reiniciar limpio
cd /Users/jorgelorenzo/Desktop/BasketImpostor
npm run dev
```

### 3. Verificar que estés en el puerto correcto
- El servidor debería estar en: `http://localhost:3000`
- Verifica en la terminal que diga: "Servidor corriendo en puerto 3000"

### 4. Verificar que el código esté actualizado
```bash
git pull origin main
```

### 5. Si sigue sin funcionar
- Abre la consola del navegador (F12)
- Verifica que no haya errores de conexión
- Verifica que el socket se conecte correctamente
- Revisa los logs del servidor en la terminal

### 6. Probar en modo incógnito
Esto elimina cualquier problema de caché del navegador.

