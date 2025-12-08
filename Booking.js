document.addEventListener('DOMContentLoaded', function() {
    // Room database
    const roomsDB = {
        "standard": { 
            title: "Standard Room", 
            priceVal: 80, 
            price: "$80", 
            image: "imgs/premium_photo-1661962493427-910e3333cf5a.avif",
            capacity: "1 Guest",
            bed: "Single Bed",
            badge: "Economy"
        },
        "double": { 
            title: "Double Room", 
            priceVal: 120, 
            price: "$120", 
            image: "imgs/Deluxe Room.jpeg",
            capacity: "2 Guests",
            bed: "Double Bed",
            badge: "Popular"
        },
        "suite": { 
            title: "Luxury Suite", 
            priceVal: 180, 
            price: "$180", 
            image: "imgs/Suite Room.jpg",
            capacity: "4 Guests",
            bed: "King Bed + Sofa",
            badge: "Premium"
        }
    };

    let currentRoom = null;
    let currentRoomPrice = 120; // Default to double room price

    // Initialize page
    function initPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const roomType = urlParams.get('room') || 'double';
        currentRoom = roomsDB[roomType];

        if (currentRoom) {
            // Update room summary
            document.getElementById('summary-title').innerText = currentRoom.title;
            document.getElementById('summary-price').innerText = currentRoom.price + " / Night";
            document.getElementById('summary-img').src = currentRoom.image;
            document.getElementById('room-badge').innerText = currentRoom.badge;
            document.getElementById('room-capacity').innerText = currentRoom.capacity;
            document.getElementById('room-bed').innerText = currentRoom.bed;
            
            currentRoomPrice = currentRoom.priceVal;
        } else {
            // Default to double room
            document.getElementById('summary-title').innerText = "Double Room";
            document.getElementById('summary-price').innerText = "$120 / Night";
            document.getElementById('summary-img').src = "imgs/Deluxe Room.jpeg";
            document.getElementById('room-badge').innerText = "Popular";
            document.getElementById('room-capacity').innerText = "2 Guests";
            document.getElementById('room-bed').innerText = "Double Bed";
        }
        
        // Set min dates for checkin/checkout
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const todayStr = today.toISOString().split('T')[0];
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        
        document.getElementById('checkin').min = todayStr;
        document.getElementById('checkin').value = todayStr;
        document.getElementById('checkout').min = tomorrowStr;
        document.getElementById('checkout').value = tomorrowStr;
        
        // Initialize payment method
        togglePaymentDetails();
        updateSummary();
    }

    // Toggle payment details based on selected method
    function togglePaymentDetails() {
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        const cardSection = document.getElementById('credit-card-section');
        const paypalSection = document.getElementById('paypal-section');
        const cashSection = document.getElementById('cash-section');
        
        // Hide all sections first
        cardSection.style.display = 'none';
        paypalSection.style.display = 'none';
        cashSection.style.display = 'none';
        
        // Show relevant section
        switch(paymentMethod) {
            case 'credit':
                cardSection.style.display = 'block';
                break;
            case 'paypal':
                paypalSection.style.display = 'block';
                break;
            case 'cash':
                cashSection.style.display = 'block';
                break;
        }
    }

    // Format card number with spaces
    function formatCardNumber(input) {
        let value = input.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})/g, '$1 ').trim();
        value = value.substring(0, 19); // Max 16 digits + 3 spaces
        input.value = value;
    }

    // Format expiry date
    function formatExpiryDate(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        input.value = value.substring(0, 5);
    }

    // Update booking summary
    function updateSummary() {
        const checkin = document.getElementById('checkin').value;
        const checkout = document.getElementById('checkout').value;
        const adults = parseInt(document.getElementById('adults').value);
        const children = parseInt(document.getElementById('children').value);
        
        let guestsText = `${adults} Adult${adults > 1 ? 's' : ''}`;
        if (children > 0) {
            guestsText += `, ${children} Child${children > 1 ? 'ren' : ''}`;
        }

        // Update display values
        document.getElementById('disp-checkin').innerText = checkin || "-";
        document.getElementById('disp-checkout').innerText = checkout || "-";
        document.getElementById('disp-guests').innerText = guestsText;

        if (checkin && checkout) {
            const d1 = new Date(checkin);
            const d2 = new Date(checkout);
            const diffTime = d2 - d1;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays > 0) {
                document.getElementById('disp-nights').innerText = diffDays;
                
                const roomTotal = diffDays * currentRoomPrice;
                const tax = roomTotal * 0.10; // 10% tax
                const total = roomTotal + tax;
                
                // Update prices
                document.getElementById('room-total').innerText = "$" + roomTotal;
                document.getElementById('tax-amount').innerText = "$" + tax.toFixed(0);
                document.getElementById('total-price').innerText = "$" + total.toFixed(0);
                document.getElementById('btn-total-price').innerText = "$" + total.toFixed(0);
            } else {
                resetSummary();
            }
        } else {
            resetSummary();
        }
    }

    // Reset summary to default
    function resetSummary() {
        document.getElementById('disp-nights').innerText = "0";
        document.getElementById('room-total').innerText = "$0";
        document.getElementById('tax-amount').innerText = "$0";
        document.getElementById('total-price').innerText = "$0";
        document.getElementById('btn-total-price').innerText = "$0";
    }

    // Validate form
    function validateForm() {
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const country = document.getElementById('country').value;
        const checkin = document.getElementById('checkin').value;
        const checkout = document.getElementById('checkout').value;
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        const termsAccepted = document.getElementById('terms').checked;
        
        if (!fullName || !email || !phone || !country) {
            showAlert('⚠ Please fill in all guest details.', 'error');
            return false;
        }
        
        if (!termsAccepted) {
            showAlert('⚠ You must accept the Terms & Conditions.', 'error');
            return false;
        }
        
        if (!checkin || !checkout) {
            showAlert('⚠ Please select check-in and check-out dates.', 'error');
            return false;
        }
        
        const d1 = new Date(checkin);
        const d2 = new Date(checkout);
        if (d2 <= d1) {
            showAlert('⚠ Check-out date must be after check-in date.', 'error');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('⚠ Please enter a valid email address.', 'error');
            return false;
        }
        
        // Phone validation
        const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            showAlert('⚠ Please enter a valid phone number (at least 10 digits).', 'error');
            return false;
        }
        
        return true;
    }

    // Process booking
    function processBooking() {
        if (!validateForm()) {
            return;
        }
        
        // Get form data
        const bookingData = {
            id: "BK-" + Date.now().toString().slice(-6),
            roomType: document.getElementById('summary-title').innerText,
            roomImage: document.getElementById('summary-img').src,
            checkIn: document.getElementById('checkin').value,
            checkOut: document.getElementById('checkout').value,
            nights: document.getElementById('disp-nights').innerText,
            guests: document.getElementById('disp-guests').innerText,
            total: document.getElementById('total-price').innerText,
            guestName: document.getElementById('fullName').value,
            guestEmail: document.getElementById('email').value,
            guestPhone: document.getElementById('phone').value,
            guestCountry: document.getElementById('country').options[document.getElementById('country').selectedIndex].text,
            paymentMethod: document.querySelector('input[name="payment"]:checked').value,
            status: document.querySelector('input[name="payment"]:checked').value === 'cash' ? 'Pending' : 'Confirmed',
            bookingDate: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            bookingTime: new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            specialRequests: document.querySelector('textarea').value
        };
        
        // Save to localStorage
        let bookings = JSON.parse(localStorage.getItem('hotelBookings')) || [];
        bookings.push(bookingData);
        localStorage.setItem('hotelBookings', JSON.stringify(bookings));
        
        // Save to user's profile if logged in
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            let userBookings = currentUser.bookings || [];
            userBookings.push(bookingData);
            currentUser.bookings = userBookings;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update all users in localStorage
            let allUsers = JSON.parse(localStorage.getItem('hotelUsers')) || [];
            const userIndex = allUsers.findIndex(user => user.email === currentUser.email);
            if (userIndex !== -1) {
                allUsers[userIndex] = currentUser;
                localStorage.setItem('hotelUsers', JSON.stringify(allUsers));
            }
        }
        
        // Show confirmation
        showConfirmation(bookingData);
    }

    // Show booking confirmation
    function showConfirmation(bookingData) {
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
            ">
                <div style="font-size: 4rem; color: #4CAF50; margin-bottom: 20px;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2 style="color: #2c3e50; margin-bottom: 15px;">Booking Confirmed!</h2>
                <p style="color: #555; margin-bottom: 25px; line-height: 1.6;">
                    Thank you for your booking! Your reservation has been successfully confirmed.
                </p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 25px; text-align: left;">
                    <p><strong>Booking ID:</strong> ${bookingData.id}</p>
                    <p><strong>Room:</strong> ${bookingData.roomType}</p>
                    <p><strong>Check-in:</strong> ${bookingData.checkIn}</p>
                    <p><strong>Check-out:</strong> ${bookingData.checkOut}</p>
                    <p><strong>Nights:</strong> ${bookingData.nights}</p>
                    <p><strong>Total:</strong> ${bookingData.total}</p>
                    <p><strong>Status:</strong> <span style="color: ${bookingData.status === 'Confirmed' ? '#4CAF50' : '#FF9800'}">${bookingData.status}</span></p>
                </div>
                
                <p style="color: #7f8c8d; font-size: 0.9rem; margin-bottom: 25px;">
                    A confirmation email has been sent to ${bookingData.guestEmail}
                </p>
                
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="window.location.href='profile.html';" 
                            style="padding: 12px 25px; background: #d4a017; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.3s;">
                        <i class="fas fa-user-circle"></i> View Profile
                    </button>
                    <button onclick="window.location.href='home.html';" 
                            style="padding: 12px 25px; background: #2c3e50; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.3s;">
                        <i class="fas fa-home"></i> Back to Home
                    </button>
                    <button onclick="document.querySelector('div[style*=\\'position: fixed\\']').remove();" 
                            style="padding: 12px 25px; background: #f1f1f1; color: #333; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.3s;">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Play confirmation sound
        try {
            const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3');
            audio.volume = 0.3;
            audio.play();
        } catch (e) {
            console.log('Audio not available');
        }
    }

    // Helper function to show alerts
    function showAlert(message, type = 'info') {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert-message');
        existingAlerts.forEach(alert => alert.remove());
        
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert-message';
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
            max-width: 400px;
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
        }, 5000);
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
    `;
    document.head.appendChild(style);

    // Initialize the page
    initPage();
    
    // Add event listeners
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', togglePaymentDetails);
    });
    
    // Make functions available globally
    window.formatCardNumber = formatCardNumber;
    window.formatExpiryDate = formatExpiryDate;
    window.updateSummary = updateSummary;
    window.togglePaymentDetails = togglePaymentDetails;
    window.processBooking = processBooking;
});