document.addEventListener('DOMContentLoaded', function () {
    // Password toggle functionality
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');

    // Toggle password visibility for password field
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

    // Toggle password visibility for confirm password field
    if (toggleConfirmPassword && confirmPasswordField) {
        toggleConfirmPassword.addEventListener('click', function () {
            if (confirmPasswordField.type === 'password') {
                confirmPasswordField.type = 'text';
                toggleConfirmPassword.classList.remove('fa-eye');
                toggleConfirmPassword.classList.add('fa-eye-slash');
            } else {
                confirmPasswordField.type = 'password';
                toggleConfirmPassword.classList.remove('fa-eye-slash');
                toggleConfirmPassword.classList.add('fa-eye');
            }
        });
    }

    // Form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            // Get form values
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const dob = document.getElementById('dob').value;
            const termsAccepted = document.querySelector('.terms-checkbox input').checked;

            // Validation
            if (!firstName || !lastName || !email || !phone || !username || !password || !confirmPassword || !dob) {
                showAlert('⚠ Please fill in all required fields.', 'error');
                return;
            }

            if (!termsAccepted) {
                showAlert('⚠ You must accept the Terms & Conditions.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert('⚠ Please enter a valid email address.', 'error');
                return;
            }

            // Password validation
            if (password.length < 6) {
                showAlert('⚠ Password must be at least 6 characters long.', 'error');
                return;
            }

            if (password !== confirmPassword) {
                showAlert('⚠ Passwords do not match.', 'error');
                return;
            }

            // Phone validation
            const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
            if (!phoneRegex.test(phone)) {
                showAlert('⚠ Please enter a valid phone number.', 'error');
                return;
            }

            // Age validation (must be at least 18 years old)
            const today = new Date();
            const birthDate = new Date(dob);
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (age < 18) {
                showAlert('⚠ You must be at least 18 years old to register.', 'error');
                return;
            }

            // Check if username already exists
            const users = JSON.parse(localStorage.getItem('hotelUsers')) || [];
            const userExists = users.find(user => user.username === username || user.email === email);
            
            if (userExists) {
                showAlert('⚠ Username or email already exists. Please choose different credentials.', 'error');
                return;
            }

            // Create user object
            const newUser = {
                id: Date.now(),
                firstName: firstName,
                lastName: lastName,
                fullName: `${firstName} ${lastName}`,
                email: email,
                phone: phone,
                username: username,
                password: password, // In real app, this should be hashed
                dob: dob,
                createdAt: new Date().toISOString(),
                bookings: [],
                isSubscribed: document.querySelector('.newsletter-checkbox input').checked,
                role: 'user'
            };

            // Save user to localStorage
            users.push(newUser);
            localStorage.setItem('hotelUsers', JSON.stringify(users));
            
            // Set as current user
            localStorage.setItem('currentUser', JSON.stringify(newUser));

            // Show success message
            showSuccessModal(newUser);
        });
    }

    // Add focus effects to inputs
    const inputs = document.querySelectorAll('.form-group input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            const icon = this.parentElement.querySelector('i:not(.toggle-password)');
            if (icon) {
                icon.style.color = '#d4a017';
            }
            this.style.borderColor = '#d4a017';
        });
        
        input.addEventListener('blur', function() {
            const icon = this.parentElement.querySelector('i:not(.toggle-password)');
            if (icon) {
                icon.style.color = '#7f8c8d';
            }
            this.style.borderColor = '#e1e5e9';
        });
    });

    // Set min date for date of birth (18 years ago)
    const dobInput = document.getElementById('dob');
    if (dobInput) {
        const today = new Date();
        const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
        const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        
        dobInput.min = minDate.toISOString().split('T')[0];
        dobInput.max = maxDate.toISOString().split('T')[0];
    }

    // Helper function to show alerts
    function showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'error' ? '#f44336' : '#4CAF50'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            font-weight: 600;
            animation: slideIn 0.3s ease;
        `;
        
        alertDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'check-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => alertDiv.remove(), 300);
        }, 4000);
    }

    // Show success modal
    function showSuccessModal(user) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 40px;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                animation: popIn 0.3s ease;
            ">
                <div style="font-size: 4rem; color: #4CAF50; margin-bottom: 20px;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2 style="color: #2c3e50; margin-bottom: 15px;">Registration Successful!</h2>
                <p style="color: #555; margin-bottom: 25px; line-height: 1.6;">
                    Welcome to Golden Hotel, <strong>${user.firstName}</strong>!<br>
                    Your account has been created successfully.
                </p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 25px; text-align: left;">
                    <p><strong>Username:</strong> ${user.username}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Account Created:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                
                <p style="color: #7f8c8d; font-size: 0.9rem; margin-bottom: 25px;">
                    You can now book rooms and enjoy exclusive member benefits!
                </p>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button onclick="window.location.href='profile.html';" 
                            style="padding: 12px 30px; background: #d4a017; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.3s;">
                        <i class="fas fa-user-circle"></i> Go to Profile
                    </button>
                    <button onclick="window.location.href='home.html';" 
                            style="padding: 12px 30px; background: #2c3e50; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.3s;">
                        <i class="fas fa-home"></i> Go to Home
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Play success sound
        try {
            const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3');
            audio.volume = 0.3;
            audio.play();
        } catch (e) {
            console.log('Audio not available');
        }
    }

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes popIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});