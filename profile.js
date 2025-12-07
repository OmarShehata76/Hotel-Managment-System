document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const editProfileBtn = document.getElementById('editProfileBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const editProfileForm = document.getElementById('editProfileForm');
    const bookingsTableBody = document.getElementById('bookingsTableBody');
    const upcomingStays = document.getElementById('upcomingStays');
    
    // User Data (In a real app, this would come from an API)
    let userData = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@email.com",
        phone: "+971 50 123 4567",
        address: "123 Golden Street, Dubai, UAE",
        dob: "1985-06-15",
        country: "AE",
        totalBookings: 5,
        totalSpent: 1250,
        activeBookings: 1,
        upcomingBookings: 2,
        nightsBooked: 12,
        membershipLevel: "Gold",
        points: 2450
    };

    // Bookings Data
    let bookings = [
        {
            id: "GH-2023-0012",
            roomType: "Deluxe Suite",
            checkIn: "2024-01-15",
            checkOut: "2024-01-20",
            nights: 5,
            status: "confirmed",
            amount: 750,
            guests: 2,
            roomNumber: "305"
        },
        {
            id: "GH-2023-0011",
            roomType: "Executive Room",
            checkIn: "2023-12-10",
            checkOut: "2023-12-12",
            nights: 2,
            status: "completed",
            amount: 300,
            guests: 1,
            roomNumber: "212"
        },
        {
            id: "GH-2023-0010",
            roomType: "Presidential Suite",
            checkIn: "2024-02-05",
            checkOut: "2024-02-10",
            nights: 5,
            status: "pending",
            amount: 1200,
            guests: 4,
            roomNumber: "501"
        },
        {
            id: "GH-2023-0009",
            roomType: "Standard Room",
            checkIn: "2023-11-20",
            checkOut: "2023-11-22",
            nights: 2,
            status: "cancelled",
            amount: 200,
            guests: 2,
            roomNumber: "108"
        }
    ];

    // Initialize the page
    function initPage() {
        loadUserData();
        loadBookingsTable();
        loadUpcomingStays();
        updateStats();
        setupEventListeners();
    }

    // Load user data into the UI
    function loadUserData() {
        document.getElementById('userName').textContent = `${userData.firstName} ${userData.lastName}`;
        document.getElementById('displayName').textContent = `${userData.firstName} ${userData.lastName}`;
        document.getElementById('userEmail').textContent = userData.email;
        document.getElementById('userPhone').textContent = userData.phone;
        document.getElementById('totalBookings').textContent = userData.totalBookings;
        document.getElementById('totalSpent').textContent = `$${userData.totalSpent}`;
        document.getElementById('activeBookings').textContent = userData.activeBookings;
        document.getElementById('upcomingBookings').textContent = userData.upcomingBookings;
        document.getElementById('nightsBooked').textContent = userData.nightsBooked;
        
        // Set form values
        document.getElementById('editFirstName').value = userData.firstName;
        document.getElementById('editLastName').value = userData.lastName;
        document.getElementById('editEmail').value = userData.email;
        document.getElementById('editPhone').value = userData.phone;
        document.getElementById('editAddress').value = userData.address;
        document.getElementById('editDob').value = userData.dob;
        document.getElementById('editCountry').value = userData.country;
    }

    // Load bookings into the table
    function loadBookingsTable() {
        bookingsTableBody.innerHTML = '';
        
        bookings.forEach(booking => {
            const row = document.createElement('tr');
            
            // Format dates
            const checkInDate = new Date(booking.checkIn);
            const checkOutDate = new Date(booking.checkOut);
            const dateFormat = { month: 'short', day: 'numeric', year: 'numeric' };
            const dates = `${checkInDate.toLocaleDateString('en-US', dateFormat)} - ${checkOutDate.toLocaleDateString('en-US', dateFormat)}`;
            
            // Status badge
            let statusClass = '';
            let statusText = '';
            switch(booking.status) {
                case 'confirmed':
                    statusClass = 'status-confirmed';
                    statusText = 'Confirmed';
                    break;
                case 'pending':
                    statusClass = 'status-pending';
                    statusText = 'Pending';
                    break;
                case 'cancelled':
                    statusClass = 'status-cancelled';
                    statusText = 'Cancelled';
                    break;
                default:
                    statusClass = 'status-completed';
                    statusText = 'Completed';
            }
            
            row.innerHTML = `
                <td>${booking.id}</td>
                <td>${booking.roomType}</td>
                <td>${dates}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td><strong>$${booking.amount}</strong></td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn action-view" data-id="${booking.id}">
                            <i class="fas fa-eye"></i> View
                        </button>
                        ${booking.status !== 'cancelled' && booking.status !== 'completed' ? 
                            `<button class="action-btn action-modify" data-id="${booking.id}">
                                <i class="fas fa-edit"></i> Modify
                            </button>
                            <button class="action-btn action-cancel" data-id="${booking.id}">
                                <i class="fas fa-times"></i> Cancel
                            </button>` : ''
                        }
                    </div>
                </td>
            `;
            
            bookingsTableBody.appendChild(row);
        });
    }

    // Load upcoming stays
    function loadUpcomingStays() {
        upcomingStays.innerHTML = '';
        
        const upcoming = bookings.filter(b => 
            b.status === 'confirmed' || b.status === 'pending'
        );
        
        if (upcoming.length === 0) {
            upcomingStays.innerHTML = `
                <div class="no-upcoming">
                    <i class="fas fa-calendar-times fa-3x" style="color: #ccc; margin-bottom: 15px;"></i>
                    <p>No upcoming stays. <a href="Booking.html">Book a room now!</a></p>
                </div>
            `;
            return;
        }
        
        upcoming.forEach(stay => {
            const checkInDate = new Date(stay.checkIn);
            const checkOutDate = new Date(stay.checkOut);
            const dateFormat = { month: 'short', day: 'numeric' };
            const dates = `${checkInDate.toLocaleDateString('en-US', dateFormat)} - ${checkOutDate.toLocaleDateString('en-US', dateFormat)}`;
            
            const card = document.createElement('div');
            card.className = 'stay-card';
            card.innerHTML = `
                <div class="stay-header">
                    <h3>${stay.roomType}</h3>
                    <span class="stay-dates">${dates}</span>
                </div>
                <div class="stay-details">
                    <p><i class="fas fa-bed"></i> Room: ${stay.roomNumber}</p>
                    <p><i class="fas fa-user-friends"></i> Guests: ${stay.guests}</p>
                    <p><i class="fas fa-moon"></i> ${stay.nights} nights</p>
                    <p><i class="fas fa-dollar-sign"></i> Total: $${stay.amount}</p>
                </div>
                <div class="stay-actions" style="margin-top: 15px;">
                    <button class="action-btn action-view" style="padding: 8px 15px;">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                </div>
            `;
            
            upcomingStays.appendChild(card);
        });
    }

    // Update stats based on bookings
    function updateStats() {
        const active = bookings.filter(b => b.status === 'confirmed').length;
        const upcoming = bookings.filter(b => b.status === 'pending').length;
        const totalNights = bookings.reduce((sum, b) => sum + b.nights, 0);
        
        document.getElementById('activeBookings').textContent = active;
        document.getElementById('upcomingBookings').textContent = upcoming;
        document.getElementById('nightsBooked').textContent = totalNights;
        
        userData.activeBookings = active;
        userData.upcomingBookings = upcoming;
        userData.nightsBooked = totalNights;
    }

    // Setup event listeners
    function setupEventListeners() {
        // Edit Profile Button
        editProfileBtn.addEventListener('click', () => {
            editProfileModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });

        // Close Modal Buttons
        closeModalBtn.addEventListener('click', closeModal);
        cancelEditBtn.addEventListener('click', closeModal);
        
        // Close modal when clicking outside
        editProfileModal.addEventListener('click', (e) => {
            if (e.target === editProfileModal) {
                closeModal();
            }
        });

        // Logout Button
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                // In a real app, you would clear session/token and redirect
                alert('Logged out successfully!');
                window.location.href = 'login.html';
            }
        });

        // Edit Profile Form Submission
        editProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Update user data
            userData.firstName = document.getElementById('editFirstName').value;
            userData.lastName = document.getElementById('editLastName').value;
            userData.email = document.getElementById('editEmail').value;
            userData.phone = document.getElementById('editPhone').value;
            userData.address = document.getElementById('editAddress').value;
            userData.dob = document.getElementById('editDob').value;
            userData.country = document.getElementById('editCountry').value;
            
            // Update UI
            loadUserData();
            
            // Show success message
            showNotification('Profile updated successfully!', 'success');
            
            // Close modal
            closeModal();
            
            // In a real app, you would send the data to the server
            console.log('Updated user data:', userData);
        });

        // Booking actions delegation
        bookingsTableBody.addEventListener('click', (e) => {
            const target = e.target.closest('.action-btn');
            if (!target) return;
            
            const bookingId = target.getAttribute('data-id');
            const action = target.classList.contains('action-view') ? 'view' :
                          target.classList.contains('action-modify') ? 'modify' : 'cancel';
            
            handleBookingAction(action, bookingId);
        });
        
        // Redeem Points Button
        const redeemBtn = document.querySelector('.btn-redeem');
        if (redeemBtn) {
            redeemBtn.addEventListener('click', () => {
                showNotification('Reward points redemption coming soon!', 'info');
            });
        }
    }

    // Handle booking actions
    function handleBookingAction(action, bookingId) {
        const booking = bookings.find(b => b.id === bookingId);
        if (!booking) return;
        
        switch(action) {
            case 'view':
                alert(`Booking Details:\n
ID: ${booking.id}\n
Room: ${booking.roomType}\n
Dates: ${booking.checkIn} to ${booking.checkOut}\n
Guests: ${booking.guests}\n
Status: ${booking.status}\n
Amount: $${booking.amount}`);
                break;
                
            case 'modify':
                if (confirm('Modify this booking?')) {
                    // In a real app, redirect to booking modification page
                    showNotification('Modification feature coming soon!', 'info');
                }
                break;
                
            case 'cancel':
                if (confirm('Are you sure you want to cancel this booking?')) {
                    booking.status = 'cancelled';
                    loadBookingsTable();
                    loadUpcomingStays();
                    updateStats();
                    showNotification('Booking cancelled successfully!', 'warning');
                    
                    // Update stats in sidebar
                    userData.totalBookings = bookings.length;
                    document.getElementById('totalBookings').textContent = userData.totalBookings;
                }
                break;
        }
    }

    // Close modal function
    function closeModal() {
        editProfileModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Show notification
    function showNotification(message, type) {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : '#2196F3'};
            color: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        
        // Add close button event
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        
        document.body.appendChild(notification);
        
        // Add CSS animations
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    margin-left: 10px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape key closes modal
        if (e.key === 'Escape' && editProfileModal.style.display === 'flex') {
            closeModal();
        }
        
        // Ctrl+E opens edit profile
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            editProfileModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    });

    // Initialize the page
    initPage();
    
    // Add some extra CSS for better UI
    const extraStyles = document.createElement('style');
    extraStyles.textContent = `
        .no-upcoming {
            text-align: center;
            padding: 40px 20px;
            color: #777;
            grid-column: 1 / -1;
        }
        .no-upcoming a {
            color: #d4a017;
            text-decoration: none;
            font-weight: 600;
        }
        .no-upcoming a:hover {
            text-decoration: underline;
        }
        .table-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        .action-btn {
            padding: 6px 12px;
            border: none;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 5px;
            white-space: nowrap;
        }
        .action-view {
            background: #3498db;
            color: white;
        }
        .action-modify {
            background: #f39c12;
            color: white;
        }
        .action-cancel {
            background: #e74c3c;
            color: white;
        }
        .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }
        .stay-actions .action-btn {
            width: 100%;
            justify-content: center;
        }
    `;
    document.head.appendChild(extraStyles);
});