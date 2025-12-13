// Key to store users in localStorage
const STORAGE_KEY = "gaming_buddies_users";

// Helpers to get / save users
function getUsers() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}
//Test
// Tab + form switching
const loginTab = document.getElementById("login-tab");
const signupTab = document.getElementById("signup-tab");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const goToSignup = document.getElementById("go-to-signup");
const goToLogin = document.getElementById("go-to-login");

const loginMessage = document.getElementById("login-message");
const signupMessage = document.getElementById("signup-message");

function showLogin() {
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
    loginMessage.textContent = "";
    signupMessage.textContent = "";
    signupMessage.className = "message";
    loginMessage.className = "message";
}

function showSignup() {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
    loginMessage.textContent = "";
    signupMessage.textContent = "";
    signupMessage.className = "message";
    loginMessage.className = "message";
}

loginTab.addEventListener("click", showLogin);
signupTab.addEventListener("click", showSignup);
goToSignup.addEventListener("click", showSignup);
goToLogin.addEventListener("click", showLogin);

// Handle Sign Up
signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim().toLowerCase();
    const password = document.getElementById("signup-password").value;
    const confirm = document.getElementById("signup-confirm").value;

    signupMessage.className = "message";

    if (!username || !email || !password || !confirm) {
        signupMessage.textContent = "Please fill in all fields.";
        signupMessage.classList.add("error");
        return;
    }

    if (password.length < 6) {
        signupMessage.textContent = "Password should be at least 6 characters.";
        signupMessage.classList.add("error");
        return;
    }

    if (password !== confirm) {
        signupMessage.textContent = "Passwords do not match.";
        signupMessage.classList.add("error");
        return;
    }

    const users = getUsers();
    const existing = users.find((u) => u.email === email);

    if (existing) {
        signupMessage.textContent = "An account with this email already exists. Try logging in.";
        signupMessage.classList.add("error");
        return;
    }

    // For a real app you would hash the password.
    users.push({
        username,
        email,
        password,
    });

    saveUsers(users);

    signupMessage.textContent = "Account created! You can log in now.";
    signupMessage.classList.add("success");

    // Clear fields
    signupForm.reset();

    // Optionally auto-switch to login after a short delay
    setTimeout(() => {
        showLogin();
    }, 800);
});

// Handle Log In
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;

    loginMessage.className = "message";

    const users = getUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
        loginMessage.textContent = "Invalid email or password.";
        loginMessage.classList.add("error");
        return;
    }

    loginMessage.textContent = `Welcome back, ${user.username}!`;
    loginMessage.classList.add("success");

    // Here you could set a "logged in" flag and redirect
    // Example: redirect to main map/dashboard page
    // window.location.href = "dashboard.html";
});
