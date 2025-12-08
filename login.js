document.addEventListener('DOMContentLoaded', function () {
    const togglePassword = document.querySelector('#togglePassword');
    const passwordInput = document.getElementById('password');
    const loginForm = document.getElementById('loginForm');

    // Toggle password visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // تغيير الأيقونة
            if (type === 'text') {
                togglePassword.classList.remove('fa-eye');
                togglePassword.classList.add('fa-eye-slash');
            } else {
                togglePassword.classList.remove('fa-eye-slash');
                togglePassword.classList.add('fa-eye');
            }
        });
    }

    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.querySelector('input[type="checkbox"]').checked;

            // التحقق من الحقول الفارغة
            if (!username || !password) {
                showAlert('Please enter both username and password', 'error');
                return;
            }

            // جلب المستخدمين من localStorage
            const users = JSON.parse(localStorage.getItem('hotelUsers')) || [];
            
            // البحث عن المستخدم
            const user = users.find(u => 
                (u.username === username || u.email === username) && 
                u.password === password
            );

            if (user) {
                // تسجيل الدخول الناجح
                
                // حفظ المستخدم الحالي
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // حفظ remember me إذا كان مفعل
                if (rememberMe) {
                    localStorage.setItem('rememberedUser', username);
                } else {
                    localStorage.removeItem('rememberedUser');
                }
                
                // عرض رسالة نجاح
                showAlert('Login successful! Redirecting to home page...', 'success');
                
                // الانتقال إلى home بعد 1.5 ثانية
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                
            } else {
                // فشل تسجيل الدخول
                showAlert('Invalid username or password', 'error');
            }
        });
    }

    // تذكر المستخدم إذا كان محفوظ
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser && document.getElementById('username')) {
        document.getElementById('username').value = rememberedUser;
        document.querySelector('input[type="checkbox"]').checked = true;
    }

    // دالة لعرض التنبيهات
    function showAlert(message, type) {
        // إزالة أي تنبيهات سابقة
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertDiv = document.createElement('div');
        alertDiv.className = `custom-alert alert-${type}`;
        alertDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        `;

        // إضافة الأنماط
        alertDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 600;
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 400px;
        `;

        document.body.appendChild(alertDiv);

        // إزالة التنبيه بعد 3 ثواني
        setTimeout(() => {
            alertDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => alertDiv.remove(), 300);
        }, 3000);
    }

    // إضافة أنيميشن للتنبيهات
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
    `;
    document.head.appendChild(style);
});