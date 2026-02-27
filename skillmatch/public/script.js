const API_BASE = "/api/auth";

// Display error message
function showError(message) {
  const errorEl = document.getElementById("error-message");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = "block";
  }
}

// Display success message
function showSuccess(message) {
  const successEl = document.getElementById("success-message");
  if (successEl) {
    successEl.textContent = message;
    successEl.style.display = "block";
  }
  const errorEl = document.getElementById("error-message");
  if (errorEl) {
    errorEl.style.display = "none";
  }
}

// Clear messages
function clearMessages() {
  const errorEl = document.getElementById("error-message");
  const successEl = document.getElementById("success-message");
  if (errorEl) errorEl.style.display = "none";
  if (successEl) successEl.style.display = "none";
}

// Sign up function
async function signup(event) {
  event.preventDefault();
  clearMessages();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    showError("All fields are required");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      showSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      showError(data.message || "Signup failed");
    }
  } catch (err) {
    showError("Network error. Please try again.");
  }
}

// Login function
async function login(event) {
  event.preventDefault();
  clearMessages();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showError("All fields are required");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store token and user info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);

      // Redirect based on role
      if (data.role === "admin") {
        window.location.href = "admin.html";
      } else if (data.role === "student") {
        window.location.href = "student.html";
      }
    } else {
      showError(data.message || "Login failed");
    }
  } catch (err) {
    showError("Network error. Please try again.");
  }
}

// Logout function
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
  window.location.href = "login.html";
}

// Check authentication and role
async function checkAuth(requiredRole) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  // Redirect to login if no token
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Check role matches
  if (requiredRole && role !== requiredRole) {
    window.location.href = "login.html";
    return;
  }

  // Display user name
  const nameEl = document.getElementById("user-name");
  if (nameEl && name) {
    nameEl.textContent = name;
  }

  // Verify token with server
  try {
    const response = await fetch(`${API_BASE}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Token invalid or expired
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      window.location.href = "login.html";
      return;
    }

    const user = await response.json();

    // Update name from server response
    if (nameEl && user.name) {
      nameEl.textContent = user.name;
    }

    // Verify role from server
    if (requiredRole && user.role !== requiredRole) {
      window.location.href = "login.html";
    }
  } catch (err) {
    console.error("Auth check failed:", err);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    window.location.href = "login.html";
  }
}
