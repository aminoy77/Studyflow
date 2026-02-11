// ========================================================
// CONFIGURACIÓN DE SUPABASE
// ========================================================
//
// INSTRUCCIONES:
// 1. Ve a: https://supabase.com
// 2. Crea una cuenta (gratis)
// 3. New Project → Name: "StudyFlow"
// 4. Espera 2 minutos mientras se crea
// 5. Settings ⚙️ → API
// 6. Copia "Project URL" y "anon public key"
// 7. Pégalos abajo
//
// ========================================================

// 👇 REEMPLAZA con tus valores de Supabase
const SUPABASE_URL = 'https://tuproyecto.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

// ========================================================
// NO TOQUES NADA DE AQUÍ PARA ABAJO
// ========================================================

// Verificar configuración
if (SUPABASE_URL === 'https://tuproyecto.supabase.co' || 
    SUPABASE_ANON_KEY.includes('...')) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ SUPABASE NO CONFIGURADO');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('');
    console.error('SOLUCIÓN:');
    console.error('1. Ve a https://supabase.com');
    console.error('2. Crea un proyecto "StudyFlow"');
    console.error('3. Settings > API');
    console.error('4. Copia Project URL y anon public key');
    console.error('5. Pégalos arriba en este archivo');
    console.error('');
    console.error('Lee GUIA-CONFIGURACION.txt para más ayuda');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    alert('⚠️ Supabase NO configurado.\n\nAbre supabase-config.js y sigue las instrucciones.');
}

// Inicializar Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ Supabase initialized');
console.log('📍 URL:', SUPABASE_URL);

// Helper para mostrar mensajes
function showMessage(message, type = 'success') {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
    
    const messageEl = document.getElementById('message');
    if (!messageEl) {
        alert(message);
        return;
    }
    
    messageEl.textContent = message;
    messageEl.className = 'mt-4 p-3 rounded-lg text-sm text-center';
    
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

console.log('🔥 Supabase config loaded');
