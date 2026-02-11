// ========================================================
// CONFIGURACIÓN DE SUPABASE
// ========================================================
//
// INSTRUCCIONES PARA OBTENER TU CONFIGURACIÓN:
//
// 1. Ve a: https://supabase.com
// 2. Crea cuenta (gratis)
// 3. Click en "New Project"
// 4. Nombre: "StudyFlow"
// 5. Database Password: (elige una segura)
// 6. Region: Elige la más cercana
// 7. Click "Create new project"
// 8. Espera 2 minutos mientras se crea
//
// 9. Una vez creado, ve a Settings (⚙️) > API
// 10. Encontrarás:
//     - Project URL
//     - anon public key
//
// 11. COPIA esos valores y pégalos abajo
//
// ========================================================

// 👇 REEMPLAZA con tus valores de Supabase
const SUPABASE_URL = https://xdcfamfzuukdygbibcqm.supabase.co
const SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkY2ZhbWZ6dXVrZHlnYmliY3FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NTM1MDQsImV4cCI6MjA4NjMyOTUwNH0.OTwe3WEgqhwisSO7W5gojKGy60TCZK6KTQruSAo6Byw

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
    console.error('2. Crea un proyecto');
    console.error('3. Settings > API');
    console.error('4. Copia Project URL y anon public key');
    console.error('5. Pégalos en supabase-config.js');
    console.error('');
    console.error('Lee SUPABASE-SETUP.txt para guía completa');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    alert('⚠️ Supabase NO configurado.\nLee SUPABASE-SETUP.txt para instrucciones.');
}

// Inicializar Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ Supabase initialized');
console.log('📍 URL:', SUPABASE_URL);

// Helper functions
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

function showLoading(show = true, text = 'Cargando...') {
    const loadingState = document.getElementById('loadingState');
    const loadingText = document.getElementById('loadingText');
    
    if (loadingText) loadingText.textContent = text;
    
    if (show) {
        loadingState.classList.remove('hidden');
        document.querySelectorAll('.space-y-4:not(#loadingState)').forEach(el => el.classList.add('hidden'));
    } else {
        loadingState.classList.add('hidden');
    }
}

function hideAllSteps() {
    document.getElementById('emailStep').classList.add('hidden');
    document.getElementById('codeStep').classList.add('hidden');
    document.getElementById('passwordStep').classList.add('hidden');
    document.getElementById('loginStep').classList.add('hidden');
    document.getElementById('loadingState').classList.add('hidden');
}

console.log('🔥 Supabase config loaded');
