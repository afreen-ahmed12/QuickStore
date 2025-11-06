// Authentication functionality using Parse/Back4App

// Check if user is logged in
function checkAuth() {
    const currentUser = Parse.User.current();
    const isDashboard = window.location.pathname.includes('dashboard.html') || window.location.pathname.endsWith('dashboard.html');
    const isIndex = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '/';
    
    if (!currentUser && isDashboard) {
        window.location.href = 'index.html';
    } else if (currentUser && (isIndex || window.location.pathname.includes('index.html'))) {
        window.location.href = 'dashboard.html';
    }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Parse to be available
    if (typeof Parse === 'undefined') {
        showConfigError('Parse SDK not loaded. Please check your internet connection and ensure Parse SDK is included.');
        return;
    }
    
    // Check if Parse is configured by checking config
    try {
        if (typeof PARSE_CONFIG !== 'undefined' && 
            (PARSE_CONFIG.applicationId === 'YOUR_APPLICATION_ID' || 
             PARSE_CONFIG.javascriptKey === 'YOUR_JAVASCRIPT_KEY')) {
            showConfigError('Please configure your Back4App credentials in config.js');
            return;
        }
    } catch (error) {
        // Continue anyway, let Parse handle errors
    }
    
    checkAuth();
    
    // Login/Signup form toggle
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (showSignup) {
        showSignup.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.classList.remove('active');
            signupForm.classList.add('active');
            document.getElementById('authMessage').classList.remove('success', 'error');
        });
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            signupForm.classList.remove('active');
            loginForm.classList.add('active');
            document.getElementById('authMessage').classList.remove('success', 'error');
        });
    }
    
    // Login form submission
    const loginFormElement = document.getElementById('loginFormElement');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', handleLogin);
    }
    
    // Signup form submission
    const signupFormElement = document.getElementById('signupFormElement');
    if (signupFormElement) {
        signupFormElement.addEventListener('submit', handleSignup);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Load user info in dashboard
    if (window.location.pathname.includes('dashboard.html') || window.location.pathname.endsWith('dashboard.html')) {
        loadUserInfo();
    }
});

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageEl = document.getElementById('authMessage');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Disable button during request
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    
    try {
        const user = await Parse.User.logIn(email, password);
        messageEl.textContent = 'Login successful! Redirecting...';
        messageEl.className = 'message success';
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } catch (error) {
        console.error('Login error:', error);
        messageEl.textContent = error.message || 'Invalid email or password';
        messageEl.className = 'message error';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    }
}

// Handle signup
async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const messageEl = document.getElementById('authMessage');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Disable button during request
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';
    
    try {
        const user = new Parse.User();
        user.set('username', email);
        user.set('email', email);
        user.set('password', password);
        user.set('name', name);
        
        await user.signUp();
        
        messageEl.textContent = 'Account created successfully! Redirecting...';
        messageEl.className = 'message success';
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } catch (error) {
        console.error('Signup error:', error);
        messageEl.textContent = error.message || 'Error creating account. Please try again.';
        messageEl.className = 'message error';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign Up';
    }
}

// Handle logout
async function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        try {
            await Parse.User.logOut();
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Logout error:', error);
            alert('Error logging out. Please try again.');
        }
    }
}

// Load user info in dashboard
function loadUserInfo() {
    const currentUser = Parse.User.current();
    
    if (currentUser) {
        const name = currentUser.get('name') || currentUser.get('username') || 'User';
        const email = currentUser.get('email') || currentUser.get('username') || '';
        
        const initial = name.charAt(0).toUpperCase();
        document.getElementById('userInitial').textContent = initial;
        document.getElementById('userName').textContent = name;
        document.getElementById('userEmail').textContent = email;
    }
}

// Get current user
function getCurrentUser() {
    return Parse.User.current();
}

// Show configuration error
function showConfigError(message) {
    const messageEl = document.getElementById('authMessage');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = 'message error';
    } else {
        alert(message);
    }
    
    // Disable forms
    const loginForm = document.getElementById('loginFormElement');
    const signupForm = document.getElementById('signupFormElement');
    if (loginForm) loginForm.querySelector('button').disabled = true;
    if (signupForm) signupForm.querySelector('button').disabled = true;
}
