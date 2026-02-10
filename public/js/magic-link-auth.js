// Magic Link Authentication System
console.log('🔐 Magic Link Auth loading...');

let userEmail = '';

// Check if user is completing login from email link
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM ready');
    
    // Check if this is a sign-in callback
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
        handleEmailLinkSignIn();
    }
    
    setupFormHandlers();
});

// Setup form handlers
function setupFormHandlers() {
    const emailForm = document.getElementById('emailForm');
    
    if (emailForm) {
        emailForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await sendSignInLink();
        });
    }
}

// Send sign-in link to email
async function sendSignInLink() {
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();
    
    if (!email) {
        showMessage('Por favor ingresa un email', 'error');
        return;
    }
    
    console.log('📧 Sending sign-in link to:', email);
    
    // Show loading
    document.getElementById('emailStep').classList.add('hidden');
    document.getElementById('loadingState').classList.remove('hidden');
    
    const actionCodeSettings = {
        // URL you want to redirect back to after email link is clicked
        url: window.location.href,
        handleCodeInApp: true,
    };
    
    try {
        await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
        
        console.log('✅ Sign-in link sent successfully');
        
        // Save email for later use
        window.localStorage.setItem('emailForSignIn', email);
        userEmail = email;
        
        // Hide loading, show success
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('linkSentStep').classList.remove('hidden');
        document.getElementById('sentEmail').textContent = email;
        
    } catch (error) {
        console.error('❌ Error sending sign-in link:', error);
        
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('emailStep').classList.remove('hidden');
        
        let errorMsg = 'Error al enviar el link';
        
        if (error.code === 'auth/invalid-email') {
            errorMsg = 'Email inválido';
        } else if (error.code === 'auth/operation-not-allowed') {
            errorMsg = 'Email/Link authentication no está activado en Firebase Console';
        }
        
        showMessage(errorMsg + ': ' + error.message, 'error');
    }
}

// Handle email link sign-in callback
async function handleEmailLinkSignIn() {
    console.log('🔗 Handling email link sign-in...');
    
    // Show loading
    document.getElementById('emailStep').classList.add('hidden');
    document.getElementById('loadingState').classList.remove('hidden');
    
    let email = window.localStorage.getItem('emailForSignIn');
    
    if (!email) {
        // User opened link on different device or cleared localStorage
        email = window.prompt('Por favor confirma tu email para continuar:');
    }
    
    if (!email) {
        showMessage('Se requiere email para completar el login', 'error');
        resetToEmailStep();
        return;
    }
    
    try {
        const result = await firebase.auth().signInWithEmailLink(email, window.location.href);
        
        console.log('✅ User signed in successfully:', result.user.email);
        
        // Clear email from storage
        window.localStorage.removeItem('emailForSignIn');
        
        // Check if this is a new user
        const isNewUser = result.additionalUserInfo.isNewUser;
        
        if (isNewUser) {
            console.log('👤 New user - creating profile...');
            
            // Create user document in Firestore
            await firebase.firestore().collection('users').doc(result.user.uid).set({
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                language: 'es',
                gradingScale: 10
            });
            
            console.log('✅ User profile created');
        }
        
        showMessage('¡Bienvenido! Redirigiendo...', 'success');
        
        // Redirect to app
        setTimeout(() => {
            window.location.href = 'app.html';
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error completing sign-in:', error);
        
        let errorMsg = 'Error al completar el login';
        
        if (error.code === 'auth/invalid-action-code') {
            errorMsg = 'El link ha expirado o ya fue usado';
        } else if (error.code === 'auth/invalid-email') {
            errorMsg = 'Email inválido';
        }
        
        showMessage(errorMsg + ': ' + error.message, 'error');
        resetToEmailStep();
    }
}

// Reset form
function resetForm() {
    document.getElementById('linkSentStep').classList.add('hidden');
    document.getElementById('emailStep').classList.remove('hidden');
    document.getElementById('emailInput').value = '';
}

// Reset to email step (on error)
function resetToEmailStep() {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('linkSentStep').classList.add('hidden');
    document.getElementById('emailStep').classList.remove('hidden');
}

// Show message function
function showMessage(message, type = 'success') {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
    
    const messageEl = document.getElementById('message');
    if (!messageEl) {
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

// Check if user is already logged in
firebase.auth().onAuthStateChanged((user) => {
    console.log('Auth state changed:', user ? user.email : 'No user');
    
    // Only redirect if not handling a sign-in link
    if (user && !firebase.auth().isSignInWithEmailLink(window.location.href)) {
        console.log('User already logged in, redirecting to app...');
        window.location.href = 'app.html';
    }
});

console.log('✅ Magic Link Auth loaded');
