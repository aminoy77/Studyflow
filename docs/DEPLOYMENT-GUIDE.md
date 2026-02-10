# 🚀 StudyFlow Firebase - Guía Completa de Deployment

Esta guía te llevará paso a paso para publicar StudyFlow en internet **GRATIS y SIEMPRE ACTIVO**.

---

## 📋 ¿Qué vas a tener?

✅ **Web online 24/7** en: `https://tu-proyecto.web.app`
✅ **Base de datos en la nube** (Firestore)
✅ **Autenticación de usuarios** (Firebase Auth)
✅ **GRATIS para siempre** (plan Spark de Firebase)
✅ **Súper rápido** (CDN global de Google)
✅ **Seguro** (HTTPS automático)

---

## 🎯 PASO 1: Instalar Firebase CLI

### En Windows:
```bash
npm install -g firebase-tools
```

### En Mac/Linux:
```bash
npm install -g firebase-tools
```

**Si no tienes npm instalado:**
- Descarga Node.js: https://nodejs.org
- Instala con opciones por defecto
- Reinicia terminal/CMD
- Ejecuta el comando de arriba

---

## 🔥 PASO 2: Crear Proyecto en Firebase

1. **Ve a Firebase Console**: https://console.firebase.google.com

2. **Click en "Add project" (Agregar proyecto)**

3. **Nombre del proyecto**: `studyflow-tuusuario` (el que quieras)

4. **Google Analytics**: Puedes desactivarlo por ahora (no es necesario)

5. **Click "Create project"** - espera 30 segundos

6. **¡Proyecto creado!** ✅

---

## 🔐 PASO 3: Activar Authentication

1. En tu proyecto Firebase, click en **"Authentication"** (menú izquierdo)

2. Click en **"Get started"**

3. En la pestaña **"Sign-in method"**:
   - Click en **"Email/Password"**
   - **Activa** el primer toggle (Email/Password)
   - Click **"Save"**

4. ✅ Autenticación lista!

---

## 💾 PASO 4: Activar Firestore Database

1. Click en **"Firestore Database"** (menú izquierdo)

2. Click en **"Create database"**

3. **Modo de seguridad**: Selecciona "Start in **production mode**"

4. **Ubicación**: Elige la más cercana a ti:
   - Europa: `europe-west1` (Bélgica)
   - USA: `us-central` 
   - Etc.

5. Click **"Enable"**

6. ✅ Base de datos lista!

---

## ⚙️ PASO 5: Obtener tu Configuración de Firebase

1. En Firebase Console, click en el **ícono de engranaje ⚙️** → **Project settings**

2. Baja hasta **"Your apps"**

3. Click en **</> (Web)**

4. **Nombre de la app**: "StudyFlow Web"

5. **NO** marques "Also set up Firebase Hosting"

6. Click **"Register app"**

7. **COPIA** el código de configuración que aparece. Se ve así:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

8. **¡IMPORTANTE!** Guarda esto, lo necesitarás en el siguiente paso.

---

## 📝 PASO 6: Configurar tu Código

1. **Abre** el archivo `public/js/firebase-config.js`

2. **Reemplaza** todo el contenido dentro de `firebaseConfig` con TUS valores del paso anterior:

```javascript
const firebaseConfig = {
    apiKey: "TU-API-KEY-AQUI",           // ← Pega tu apiKey
    authDomain: "tu-proyecto.firebaseapp.com",  // ← Pega tu authDomain
    projectId: "tu-proyecto-id",          // ← Pega tu projectId
    storageBucket: "tu-proyecto.appspot.com",  // ← Pega tu storageBucket
    messagingSenderId: "123456789",       // ← Pega tu messagingSenderId
    appId: "1:123456789:web:abcdef123456"  // ← Pega tu appId
};
```

3. **Guarda** el archivo

---

## 🚀 PASO 7: Deploy a Firebase

1. **Abre terminal/CMD** en la carpeta `studyflow-firebase`

2. **Login en Firebase**:
```bash
firebase login
```
   - Se abrirá tu navegador
   - Inicia sesión con tu cuenta de Google
   - Acepta los permisos

3. **Inicializa Firebase** (solo primera vez):
```bash
firebase init
```

   Responde:
   - **Qué features quieres?** Selecciona:
     - [x] Firestore
     - [x] Hosting
     (Usa espacio para marcar, Enter para continuar)
   
   - **Usar proyecto existente?** → **Sí**
   - **Selecciona** tu proyecto de la lista
   
   - **Firestore rules file?** → Presiona Enter (usa firestore.rules)
   - **Firestore indexes file?** → Presiona Enter (usa firestore.indexes.json)
   
   - **Public directory?** → Escribe `public` y Enter
   - **Configure as single-page app?** → **No**
   - **Overwrite index.html?** → **No** (¡importante!)

4. **Deployar la app**:
```bash
firebase deploy
```

5. **Espera 20-30 segundos** mientras sube tu app ⏳

6. **¡LISTO!** Firebase te dará una URL como:
   ```
   ✔  Deploy complete!

   Hosting URL: https://tu-proyecto.web.app
   ```

---

## 🎉 PASO 8: ¡Prueba tu App!

1. **Abre** la URL que Firebase te dio

2. **Regístrate** con un email y contraseña

3. **Añade un examen** y verifica que funcione

4. **¡Tu app está ONLINE 24/7!** 🚀

---

## 🔄 Actualizar después de hacer cambios

Cuando edites algo en tu código:

```bash
# En la carpeta studyflow-firebase
firebase deploy
```

En **20 segundos** tus cambios estarán online.

---

## 🛠️ Comandos Útiles

```bash
# Ver tus proyectos
firebase projects:list

# Cambiar de proyecto
firebase use <project-id>

# Deploy solo Hosting
firebase deploy --only hosting

# Deploy solo Firestore rules
firebase deploy --only firestore:rules

# Ver logs
firebase functions:log
```

---

## 🔒 Seguridad

### Reglas de Firestore
Las reglas ya están configuradas en `firestore.rules`. Aseguran que:
- Solo usuarios autenticados pueden acceder
- Cada usuario solo ve sus propios datos
- Los grupos son visibles solo para miembros

### Actualizar reglas:
```bash
firebase deploy --only firestore:rules
```

---

## 💰 Límites del Plan Gratuito

El plan **Spark (gratis)** de Firebase incluye:

✅ **Firestore**:
   - 50,000 lecturas/día
   - 20,000 escrituras/día
   - 20,000 borrados/día
   - 1 GB de almacenamiento

✅ **Authentication**:
   - Usuarios ilimitados

✅ **Hosting**:
   - 10 GB de transferencia/mes
   - Almacenamiento ilimitado

**Para un estudiante: MÁS QUE SUFICIENTE** 👍

---

## 🐛 Solución de Problemas

### Error: "firebase: command not found"
```bash
npm install -g firebase-tools
# Reinicia tu terminal
```

### Error al hacer login
```bash
firebase logout
firebase login --reauth
```

### La app no se conecta a Firebase
- Verifica que copiaste TODA la configuración en `firebase-config.js`
- Asegúrate que activaste Authentication y Firestore
- Revisa la consola del navegador (F12) para errores

### Los datos no se guardan
- Verifica las reglas de Firestore
- Asegúrate que el usuario está autenticado
- Revisa la consola para errores

### Error de CORS
- Firebase maneja esto automáticamente
- Si persiste, verifica que tu proyecto esté bien configurado

---

## 📱 Dominio Personalizado (Opcional)

Para usar tu propio dominio (ej: `studyflow.com`):

1. En Firebase Console → Hosting → Add custom domain
2. Sigue las instrucciones
3. Añade los registros DNS que Firebase te dé
4. Espera 24h para propagación
5. ✅ Tu app en tu dominio!

---

## 🎓 Próximos Pasos

Una vez tu app esté online:

✅ Comparte con amigos
✅ Úsala diariamente
✅ Haz mejoras
✅ Añade features nuevas
✅ Ponlo en tu CV/portafolio

---

## 📚 Recursos Útiles

- **Firebase Docs**: https://firebase.google.com/docs
- **Firestore Docs**: https://firebase.google.com/docs/firestore
- **Auth Docs**: https://firebase.google.com/docs/auth

---

## ✅ Checklist de Deployment

- [ ] Node.js instalado
- [ ] Firebase CLI instalado (`firebase --version`)
- [ ] Proyecto creado en Firebase Console
- [ ] Authentication activado
- [ ] Firestore activado
- [ ] Configuración copiada a `firebase-config.js`
- [ ] `firebase login` completado
- [ ] `firebase init` ejecutado
- [ ] `firebase deploy` exitoso
- [ ] App probada en la URL de Hosting
- [ ] Usuario creado y examen añadido

---

**¡Felicidades! Tu app está ONLINE y funcionando 🎉**

Ahora tienes una aplicación web profesional, gratis, y siempre activa.

¿Preguntas? Revisa la sección de solución de problemas o busca en Google el error específico.
