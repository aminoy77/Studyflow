# 🎓 StudyFlow - Smart Student Calendar

Una aplicación web moderna para estudiantes que automatiza la planificación de estudio, gestiona tareas y te ayuda a mantener el enfoque.

![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ Características

### 🗓️ **Calendario Inteligente**
- Vista semanal, mensual y diaria
- Auto-programación de sesiones de estudio
- Distribución exponencial: más sesiones cerca del examen
- Integración con FullCalendar.js

### 📚 **Gestión de Exámenes**
- Añade exámenes con fecha y materia
- Indica horas de estudio necesarias
- StudyFlow genera automáticamente sesiones optimizadas
- Notificaciones de próximos exámenes

### ✅ **Gestión de Tareas**
- Homework, tareas del hogar, recados
- Prioridades (alta, media, baja)
- Marca como completado
- Organización por categorías

### 📊 **Seguimiento de Notas**
- Añade materias
- Registra calificaciones de exámenes y tareas
- Calcula promedios automáticamente
- Establece metas por materia

### 👥 **Grupos de Estudio**
- Crea grupos por materia
- Comparte recursos
- Chat grupal
- Gestión de miembros

### ⏱️ **Modo Focus (Pomodoro)**
- Timer de 25 minutos de trabajo
- Descansos de 5 minutos
- Descanso largo cada 4 sesiones
- Tips de productividad durante breaks
- Seguimiento de sesiones completadas

### 🌍 **Multi-idioma**
- Español
- Català
- English
- Deutsch
- Français
- Italiano

---

## 🚀 Deploy Rápido

```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Configurar (primera vez)
firebase init

# 4. Deploy
firebase deploy
```

**Tu app estará en:** `https://tu-proyecto.web.app`

📖 **Guía completa**: Ver `docs/DEPLOYMENT-GUIDE.md`

---

## 💻 Tecnologías

### Frontend
- **HTML5** - Estructura
- **Tailwind CSS** - Estilos modernos
- **JavaScript Vanilla** - Lógica de aplicación
- **FullCalendar.js** - Calendario interactivo

### Backend
- **Firebase Authentication** - Login seguro
- **Cloud Firestore** - Base de datos NoSQL
- **Firebase Hosting** - Hosting estático ultrarrápido

### Características Técnicas
- **SPA** (Single Page Application)
- **Real-time updates** con Firestore
- **Responsive design** (móvil y desktop)
- **PWA-ready** (Progressive Web App)
- **HTTPS** automático

---

## 📁 Estructura del Proyecto

```
studyflow-firebase/
├── public/
│   ├── index.html           # Login/Registro
│   ├── app.html             # Aplicación principal
│   ├── css/
│   │   └── styles.css       # Estilos
│   └── js/
│       ├── firebase-config.js   # Configuración Firebase
│       ├── auth.js              # Autenticación
│       ├── app.js               # Lógica principal
│       ├── calendar.js          # Calendario
│       └── pomodoro.js          # Timer
├── docs/
│   └── DEPLOYMENT-GUIDE.md  # Guía de deployment
├── firebase.json            # Config Firebase
├── firestore.rules          # Reglas de seguridad
├── firestore.indexes.json   # Índices Firestore
└── README.md               # Este archivo
```

---

## 🎯 Algoritmo de Distribución de Estudio

StudyFlow usa un algoritmo inteligente para programar sesiones:

```javascript
// Peso exponencial: más cerca del examen = más tiempo
weight = 2^(1 - daysBeforeExam/totalDays)

// Restricciones:
- Máximo 3 horas por día
- Mínimo 30 minutos por sesión
- Evita conflictos con otras actividades
```

**Ejemplo**: Para un examen en 10 días con 20 horas de estudio:
- Días 1-3: ~1-1.5h/día
- Días 4-6: ~1.5-2h/día
- Días 7-10: ~2-3h/día

---

## 🔐 Seguridad

### Reglas de Firestore
Cada usuario solo puede:
- ✅ Leer sus propios datos
- ✅ Crear sus propios documentos
- ✅ Actualizar sus propios datos
- ✅ Eliminar sus propios datos

Grupos de estudio:
- ✅ Solo miembros pueden ver contenido
- ✅ Solo admin puede eliminar grupo

---

## 💾 Base de Datos

### Colecciones Firestore

```
users/
  └─ {userId}
      ├─ name
      ├─ email
      ├─ language
      └─ gradingScale

exams/
  └─ {examId}
      ├─ userId
      ├─ subject
      ├─ examDate
      ├─ examTime
      └─ totalStudyHours

studySessions/
  └─ {sessionId}
      ├─ userId
      ├─ examId
      ├─ sessionDate
      ├─ startTime
      ├─ durationHours
      └─ completed

tasks/
  └─ {taskId}
      ├─ userId
      ├─ title
      ├─ category
      ├─ dueDate
      ├─ priority
      └─ completed

subjects/
  └─ {subjectId}
      ├─ userId
      ├─ name
      └─ targetGrade

studyGroups/
  └─ {groupId}
      ├─ name
      ├─ subject
      ├─ description
      ├─ adminId
      └─ members[]

pomodoroSessions/
  └─ {sessionId}
      ├─ userId
      ├─ duration
      ├─ completed
      └─ createdAt
```

---

## 📱 Uso

### 1. Registro
- Crea una cuenta con email y contraseña
- Elige tu idioma preferido

### 2. Añadir Examen
- Click en "Add Exam"
- Materia, fecha, horas de estudio
- ¡StudyFlow crea sesiones automáticamente!

### 3. Gestionar Tareas
- Click en "Add Task"
- Define categoría y prioridad
- Marca como completado cuando termines

### 4. Ver Calendario
- Vista semanal/mensual/diaria
- Eventos con código de colores
- Click para marcar como completado

### 5. Modo Focus
- Página "Focus"
- Start timer (25 min)
- Toma descansos cuando suene

---

## 🆓 Plan Gratuito de Firebase

Límites del plan Spark (gratis):

| Recurso | Límite Gratuito | Suficiente para |
|---------|----------------|-----------------|
| Firestore lecturas | 50,000/día | ~500 usuarios activos |
| Firestore escrituras | 20,000/día | Uso normal |
| Hosting | 10 GB/mes | Miles de visitas |
| Authentication | Ilimitado | ∞ usuarios |

**Perfecto para uso personal y pequeños grupos** ✅

---

## 🔧 Configuración Inicial

1. **Crea proyecto en Firebase**: https://console.firebase.google.com

2. **Activa servicios**:
   - Authentication (Email/Password)
   - Firestore Database

3. **Copia tu configuración** a `public/js/firebase-config.js`

4. **Deploy**: `firebase deploy`

5. **¡Listo!** Tu app está online

---

## 🚀 Roadmap / Futuras Características

- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Exportar a Google Calendar
- [ ] Estadísticas de estudio
- [ ] Temas (claro/oscuro)
- [ ] App móvil (React Native)
- [ ] Integración con Canvas/Moodle
- [ ] Recordatorios por email
- [ ] Compartir horarios

---

## 🐛 Troubleshooting

**App no carga:**
- Verifica que Firebase está correctamente configurado
- Revisa la consola del navegador (F12)

**No puedo registrarme:**
- Asegúrate que Authentication está activado en Firebase
- Verifica que Email/Password está habilitado

**Datos no se guardan:**
- Revisa las reglas de Firestore
- Verifica que estás autenticado
- Checa logs en consola

**Error al deployar:**
```bash
firebase logout
firebase login
firebase deploy
```

---

## 📄 Licencia

MIT License - Libre para usar y modificar

---

## 🤝 Contribuir

Este es un proyecto educativo. Siéntete libre de:
- Hacer fork
- Enviar pull requests
- Reportar bugs
- Sugerir features

---

## 📞 Soporte

- 📖 **Documentación completa**: `docs/DEPLOYMENT-GUIDE.md`
- 🔥 **Firebase Docs**: https://firebase.google.com/docs
- 💬 **Issues**: Abre un issue en este repositorio

---

## 🎓 Creado Para Estudiantes

StudyFlow está diseñado por y para estudiantes. Sin publicidad, sin pagos, sin complicaciones.

**Solo enfócate en estudiar. Nosotros manejamos el resto.** 📚

---

## ⭐ Si te gusta este proyecto, dale una estrella!

Ayuda a otros estudiantes a encontrarlo.

---

**¡Buena suerte con tus estudios! 🚀**
