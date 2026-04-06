// Dashboard page JavaScript

// Handle logout button click
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Redirect to login page after successful logout
                    window.location.href = '/login';
                } else {
                    alert('Error logging out. Please try again.');
                }
            } catch (err) {
                console.error('Logout error:', err);
                alert('Error logging out. Please try again.');
            }
        });
    }
});
