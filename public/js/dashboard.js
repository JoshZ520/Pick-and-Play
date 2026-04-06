// Dashboard page JavaScript

// Handle logout button click
document.addEventListener('DOMContentLoaded', () => {
    const votesDisplay = document.getElementById('votes-display');
    const addBtn = document.getElementById('add-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const joinGroupBtns = document.querySelectorAll('.join-group-btn');
    let votes = 0;

    if (addBtn && votesDisplay) {
        addBtn.addEventListener('click', () => {
            votes += 1;
            votesDisplay.textContent = `Votes: ${votes} / 7`;
        });
    }
    
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

    // Handle join group button clicks
    joinGroupBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const groupId = e.target.getAttribute('data-id');

            try {
                const response = await fetch(`/api/groups/${groupId}/join`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || errorData.message || 'Failed to join group');
                }

                alert('Successfully joined group!');
                window.location.reload();
            } catch (err) {
                alert(`Error joining group: ${err.message}`);
            }
        });
    });

});
