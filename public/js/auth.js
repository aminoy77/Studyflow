// Sistema de Autenticación - Email + Contraseña
console.log('🔐 Auth system loading...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM ready');
    setupTabs();
    setupForms();
    checkSession();
});

// Verificar si ya hay sesión
async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        console.log('✅ User already logged in');
        window.location.href = 'app.html';
    }
}

// Configurar tabs
function setupTabs() {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    loginTab.addEventListener('click', () => {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loginTab.classList.add('tab-active');
        registerTab.classList.remove('tab-active');
    });
    
    registerTab.addEventListener('click', () => {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        loginTab.classList.remove('tab-active');
        registerTab.classList.add('tab-active');
    });
}

// Configurar formularios
function setupForms() {
    // Login
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Register
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

// Manejar login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showMessage('Por favor completa todos los campos', 'error');
        return;
    }
    
    console.log('🔓 Attempting login...');
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        console.log('✅ Login successful');
        showMessage('¡Bienvenido!', 'success');
        
        setTimeout(() => {
            window.location.href = 'app.html';
        }, 500);
        
    } catch (error) {
        console.error('❌ Login error:', error);
        
        let errorMsg = 'Error al iniciar sesión';
        if (error.message.includes('Invalid login credentials')) {
            errorMsg = 'Email o contraseña incorrectos';
        } else if (error.message.includes('Email not confirmed')) {
            errorMsg = 'Por favor confirma tu email';
        }
        
        showMessage(errorMsg, 'error');
    }
}

// Manejar registro
async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    
    if (!name || !email || !password) {
        showMessage('Por favor completa todos los campos', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    console.log('📝 Creating account...');
    
    try {
        // Crear usuario
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name
                }
            }
        });
        
        if (authError) throw authError;
        
        console.log('✅ Account created:', authData.user.id);
        
        // Crear perfil de usuario
        const { error: profileError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                email: email,
                name: name,
                created_at: new Date().toISOString()
            });
        
        if (profileError) {
            console.warn('⚠️ Profile creation warning:', profileError);
            // No lanzamos error, solo advertencia
        }
        
        showMessage('¡Cuenta creada! Redirigiendo...', 'success');
        
        setTimeout(() => {
            window.location.href = 'app.html';
        }, 1000);
        
    } catch (error) {
        console.error('❌ Register error:', error);
        
        let errorMsg = 'Error al crear cuenta';
        if (error.message.includes('already registered')) {
            errorMsg = 'Este email ya está registrado';
        } else if (error.message.includes('invalid email')) {
            errorMsg = 'Email inválido';
        } else if (error.message.includes('weak password')) {
            errorMsg = 'Contraseña muy débil';
        }
        
        showMessage(errorMsg, 'error');
    }
}

console.log('✅ Auth system loaded');
