// Authentication System

console.log('🔐 Auth.js loading...');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM ready, setting up auth...');
    
    // Tab switching
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginTab) {
        loginTab.addEventListener('click', () => {
            console.log('Switching to login tab');
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
            loginTab.classList.add('tab-active');
            registerTab.classList.remove('tab-active');
        });
    }
    
    if (registerTab) {
        registerTab.addEventListener('click', () => {
            console.log('Switching to register tab');
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
            loginTab.classList.remove('tab-active');
            registerTab.classList.add('tab-active');
        });
    }
    
    // Login Form
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Login form submitted');
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            console.log('Attempting login for:', email);
            
            try {
                const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
                console.log('✅ Login successful!', userCredential.user);
                showMessage('Login successful! Redirecting...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'app.html';
                }, 500);
            } catch (error) {
                console.error('❌ Login error:', error);
                showMessage(getErrorMessage(error.code), 'error');
            }
        });
    }
    
    // Register Form
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Register form submitted');
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const language = document.getElementById('registerLanguage').value;
            
            console.log('Attempting registration for:', email);
            
            // Validation
            if (password.length < 6) {
                showMessage('Password must be at least 6 characters', 'error');
                return;
            }
            
            try {
                // Create user
                const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                console.log('✅ User created:', user.uid);
                
                // Update profile
                await user.updateProfile({
                    displayName: name
                });
                console.log('✅ Profile updated');
                
                // Create user document in Firestore
                await firebase.firestore().collection('users').doc(user.uid).set({
                    name: name,
                    email: email,
                    language: language,
                    gradingScale: 10,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log('✅ User document created in Firestore');
                
                showMessage('Account created successfully! Redirecting...', 'success');
                
                // Redirect after 1 second
                setTimeout(() => {
                    window.location.href = 'app.html';
                }, 1000);
                
            } catch (error) {
                console.error('❌ Register error:', error);
                showMessage(getErrorMessage(error.code), 'error');
            }
        });
    }
});

// Helper function to get user-friendly error messages
function getErrorMessage(errorCode) {
    const messages = {
        'auth/email-already-in-use': 'This email is already registered',
        'auth/invalid-email': 'Invalid email address',
        'auth/weak-password': 'Password is too weak (min 6 characters)',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/too-many-requests': 'Too many attempts. Try again later',
        'auth/network-request-failed': 'Network error. Check your connection'
    };
    return messages[errorCode] || 'An error occurred. Please try again.';
}

// Show message function
function showMessage(message, type = 'success') {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
    
    const messageEl = document.getElementById('authMessage');
    if (!messageEl) {
        alert(message);
        return;
    }
    
    messageEl.textContent = message;
    messageEl.className = `mt-4 p-3 rounded-lg text-sm text-center alert-${type}`;
    messageEl.classList.remove('hidden');
    
    setTimeout(() => {
        messageEl.classList.add('hidden');
    }, 5000);
}

// Check if user is already logged in
firebase.auth().onAuthStateChanged((user) => {
    console.log('Auth state changed:', user ? user.email : 'No user');
    
    const currentPage = window.location.pathname;
    
    if (user && (currentPage.includes('index.html') || currentPage === '/')) {
        console.log('User logged in, redirecting to app...');
        window.location.href = 'app.html';
    }
});

console.log('✅ Auth.js loaded successfully');
