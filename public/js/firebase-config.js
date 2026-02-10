// ========================================================
// CONFIGURACIÓN DE FIREBASE
// ========================================================
// 
// INSTRUCCIONES:
// 1. Ve a: https://console.firebase.google.com
// 2. Selecciona tu proyecto
// 3. Click en el icono de engranaje ⚙️ (arriba izquierda)
// 4. Click en "Project settings" (Configuración del proyecto)
// 5. Baja hasta "Your apps" (Tus aplicaciones)
// 6. Si NO tienes una app web, click en </> para crear una
// 7. Si YA tienes una app web, verás el código de configuración
// 8. COPIA todo el objeto firebaseConfig de allí
// 9. PÉGALO abajo reemplazando el ejemplo
//
// IMPORTANTE: 
// - Copia TODO el objeto, incluyendo las llaves { }
// - NO cambies las comillas
// - NO añadas comas extra
// - Asegúrate de que TODOS los campos tienen valor
//
// ========================================================

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5Wz5QCsx6t-PqByy_dY7YVucg3TRqZR4",
  authDomain: "studyflow-a43ba.firebaseapp.com",
  projectId: "studyflow-a43ba",
  storageBucket: "studyflow-a43ba.firebasestorage.app",
  messagingSenderId: "970553284265",
  appId: "1:970553284265:web:f6d7492392fcf111773bb8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ========================================================
// NO TOQUES NADA DE AQUÍ PARA ABAJO
// ========================================================

// Verificar que la configuración fue actualizada
let configOk = true;

if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes("XXXXX") || firebaseConfig.apiKey === "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX") {
    console.error('⚠️ ERROR: apiKey no configurado correctamente');
    console.error('Tu apiKey actual:', firebaseConfig.apiKey);
    configOk = false;
}

if (!firebaseConfig.projectId || firebaseConfig.projectId === "tu-proyecto-id") {
    console.error('⚠️ ERROR: projectId no configurado correctamente');
    console.error('Tu projectId actual:', firebaseConfig.projectId);
    configOk = false;
}

if (!firebaseConfig.authDomain || firebaseConfig.authDomain === "tu-proyecto.firebaseapp.com") {
    console.error('⚠️ ERROR: authDomain no configurado correctamente');
    console.error('Tu authDomain actual:', firebaseConfig.authDomain);
    configOk = false;
}

if (!configOk) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ FIREBASE NO CONFIGURADO CORRECTAMENTE');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('');
    console.error('SOLUCIÓN:');
    console.error('1. Ve a: https://console.firebase.google.com');
    console.error('2. Selecciona tu proyecto');
    console.error('3. Click en ⚙️ > Project settings');
    console.error('4. Baja a "Your apps"');
    console.error('5. COPIA el firebaseConfig completo');
    console.error('6. PÉGALO en firebase-config.js');
    console.error('');
    console.error('Ejemplo de cómo debe verse:');
    console.error('const firebaseConfig = {');
    console.error('  apiKey: "AIzaSyC-abc123...",  // ← Tu key real');
    console.error('  authDomain: "mi-proyecto.firebaseapp.com",');
    console.error('  projectId: "mi-proyecto-12345",');
    console.error('  ...');
    console.error('};');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    alert('⚠️ Firebase NO configurado. Abre la consola (F12) para ver instrucciones.');
}

// Inicializar Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');
    console.log('✅ Project ID:', firebaseConfig.projectId);
    console.log('✅ Auth Domain:', firebaseConfig.authDomain);
} catch (error) {
    console.error('❌ Error initializing Firebase:', error);
    console.error('Configuración actual:', firebaseConfig);
    alert('❌ Error al inicializar Firebase: ' + error.message + '\n\nAbre la consola (F12) para más detalles.');
}

// Referencias globales
const auth = firebase.auth();
const db = firebase.firestore();

console.log('✅ Firebase Auth:', auth ? 'Ready' : 'Not available');
console.log('✅ Firestore:', db ? 'Ready' : 'Not available');

// Helper para obtener el usuario actual
function getCurrentUser() {
    return auth.currentUser;
}

// Helper para obtener ID del usuario
function getUserId() {
    const user = getCurrentUser();
    return user ? user.uid : null;
}

// Mostrar mensajes
function showMessage(message, type = 'success') {
    console.log(`Message (${type}): ${message}`);
    
    const messageEl = document.getElementById('authMessage');
    if (!messageEl) {
        console.log('authMessage element not found, using alert');
        alert(message);
        return;
    }
    
    messageEl.textContent = message;
    messageEl.className = `mt-4 p-3 rounded-lg text-sm text-center`;
    
    if (type === 'success') {
        messageEl.classList.add('bg-green-50', 'text-green-800', 'border', 'border-green-200');
    } else {
        messageEl.classList.add('bg-red-50', 'text-red-800', 'border', 'border-red-200');
    }
    
    messageEl.classList.remove('hidden');
    
    setTimeout(() => {
        messageEl.classList.add('hidden');
    }, 5000);
}

console.log('🔥 Firebase config loaded');
