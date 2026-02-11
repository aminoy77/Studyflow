// Authentication System - Código + Contraseña
console.log('🔐 Auth system loading...');

let currentEmail = '';
let isNewUser = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM ready');
    setupFormHandlers();
    checkSession();
});

// Check if user already logged in
async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        console.log('✅ User already logged in');
        window.location.href = 'app.html';
    }
}

// Setup form handlers
function setupFormHandlers() {
    // Email form
    document.getElementById('emailForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleEmailSubmit();
    });
    
    // Code form
    document.getElementById('codeForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleCodeSubmit();
    });
    
    // Password form (new users)
    document.getElementById('passwordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handlePasswordCreate();
    });
    
    // Login form (existing users)
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleLogin();
    });
}

// Step 1: Handle email submit
async function handleEmailSubmit() {
    const email = document.getElementById('emailInput').value.trim();
    
    if (!email) {
        showMessage('Ingresa un email válido', 'error');
        return;
    }
    
    currentEmail = email;
    console.log('📧 Email entered:', email);
    
    showLoading(true, 'Enviando código...');
    
    try {
        // Send OTP code to email
        const { data, error } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
                shouldCreateUser: true
            }
        });
        
        if (error) throw error;
        
        console.log('✅ OTP sent successfully');
        
        // Show code step
        hideAllSteps();
        document.getElementById('codeStep').classList.remove('hidden');
        document.getElementById('emailDisplay').textContent = email;
        showMessage('¡Código enviado! Revisa tu email (puede estar en spam)', 'success');
        
    } catch (error) {
        console.error('❌ Error sending OTP:', error);
        hideAllSteps();
        document.getElementById('emailStep').classList.remove('hidden');
        showMessage('Error al enviar código: ' + error.message, 'error');
    }
}

// Step 2: Handle code verification
async function handleCodeSubmit() {
    const code = document.getElementById('codeInput').value.trim();
    
    if (!code || code.length !== 6) {
        showMessage('Ingresa el código de 6 dígitos', 'error');
        return;
    }
    
    console.log('🔑 Verifying code...');
    showLoading(true, 'Verificando código...');
    
    try {
        // Verify OTP
        const { data, error } = await supabase.auth.verifyOtp({
            email: currentEmail,
            token: code,
            type: 'email'
        });
        
        if (error) throw error;
        
        console.log('✅ Code verified successfully');
        
        // Check if user exists (has password)
        const { data: profile } = await supabase
            .from('users')
            .select('id, has_password')
            .eq('id', data.user.id)
            .single();
        
        if (!profile || !profile.has_password) {
            // New user - needs to create password
            console.log('👤 New user - show password creation');
            isNewUser = true;
            hideAllSteps();
            document.getElementById('passwordStep').classList.remove('hidden');
        } else {
            // Existing user - redirect to app
            console.log('✅ Existing user - redirecting');
            showMessage('¡Bienvenido de nuevo!', 'success');
            setTimeout(() => {
                window.location.href = 'app.html';
            }, 1000);
        }
        
    } catch (error) {
        console.error('❌ Error verifying code:', error);
        hideAllSteps();
        document.getElementById('codeStep').classList.remove('hidden');
        showMessage('Código incorrecto o expirado', 'error');
    }
}

// Step 3: Handle password creation (new users)
async function handlePasswordCreate() {
    const name = document.getElementById('nameInput').value.trim();
    const password = document.getElementById('newPasswordInput').value;
    
    if (!name) {
        showMessage('Ingresa tu nombre', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    console.log('🔒 Creating password...');
    showLoading(true, 'Creando cuenta...');
    
    try {
        // Update user with password
        const { data: { user }, error: updateError } = await supabase.auth.updateUser({
            password: password
        });
        
        if (updateError) throw updateError;
        
        // Create user profile
        const { error: profileError } = await supabase
            .from('users')
            .insert({
                id: user.id,
                email: currentEmail,
                name: name,
                has_password: true,
                created_at: new Date().toISOString()
            });
        
        if (profileError) throw profileError;
        
        console.log('✅ Account created successfully');
        showMessage('¡Cuenta creada! Redirigiendo...', 'success');
        
        setTimeout(() => {
            window.location.href = 'app.html';
        }, 1500);
        
    } catch (error) {
        console.error('❌ Error creating account:', error);
        hideAllSteps();
        document.getElementById('passwordStep').classList.remove('hidden');
        showMessage('Error al crear cuenta: ' + error.message, 'error');
    }
}

// Step 4: Handle login (returning users)
async function handleLogin() {
    const password = document.getElementById('passwordInput').value;
    
    if (!password) {
        showMessage('Ingresa tu contraseña', 'error');
        return;
    }
    
    console.log('🔓 Logging in...');
    showLoading(true, 'Iniciando sesión...');
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: currentEmail,
            password: password
        });
        
        if (error) throw error;
        
        console.log('✅ Login successful');
        showMessage('¡Bienvenido!', 'success');
        
        setTimeout(() => {
            window.location.href = 'app.html';
        }, 1000);
        
    } catch (error) {
        console.error('❌ Login error:', error);
        hideAllSteps();
        document.getElementById('loginStep').classList.remove('hidden');
        showMessage('Contraseña incorrecta', 'error');
    }
}

// Back to email step
function backToEmail() {
    currentEmail = '';
    hideAllSteps();
    document.getElementById('emailStep').classList.remove('hidden');
    document.getElementById('emailInput').value = '';
    document.getElementById('codeInput').value = '';
    document.getElementById('passwordInput').value = '';
}

console.log('✅ Auth system loaded');
