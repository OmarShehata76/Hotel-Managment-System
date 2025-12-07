document.addEventListener('DOMContentLoaded', function () {
    const togglePassword = document.getElementById('togglePassword');
    const passwordField = document.getElementById('password');

    // Toggle password visibility
    if (togglePassword && passwordField) {
        togglePassword.addEventListener('click', function () {
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                togglePassword.classList.remove('fa-eye');
                togglePassword.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                togglePassword.classList.remove('fa-eye-slash');
                togglePassword.classList.add('fa-eye');
            }
        });
    }

    // Form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            // Validation
            if (!username || !password) {
                alert('⚠ Please enter both username and password.');
                return;
            }

            // Simple validation example
            if (password.length < 6) {
                alert('⚠ Password must be at least 6 characters long.');
                return;
            }

            // Simulate successful login
            alert(`✅ Login successful!\nWelcome, ${username}!`);
            
            // In real application, you would redirect here:
            // window.location.href = "dashboard.html";
        });
    }

    // Add focus effects to inputs
    const inputs = document.querySelectorAll('.form-group input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.querySelector('i:not(.toggle-password)').style.color = 'var(--secondary)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.querySelector('i:not(.toggle-password)').style.color = 'var(--gray)';
        });
    });
});