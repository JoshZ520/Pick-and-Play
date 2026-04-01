// Dashboard page JavaScript

// Handle logout button click
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    const createGroupForm = document.getElementById('create-group-form');
    const createGroupFeedback = document.getElementById('create-group-feedback');
    const joinGroupBtns = document.querySelectorAll('.join-group-btn');
    
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

    if (createGroupForm) {
        createGroupForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(createGroupForm);
            const groupName = formData.get('groupName');
            const winVote = formData.get('winVote');

            try {
                const response = await fetch('/groups', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        groupName,
                        winVote: winVote || 'None yet'
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || errorData.message || 'Failed to create group');
                }

                if (createGroupFeedback) {
                    createGroupFeedback.textContent = 'Group created successfully.';
                }

                createGroupForm.reset();
                window.location.reload();
            } catch (err) {
                if (createGroupFeedback) {
                    createGroupFeedback.textContent = err.message;
                }
            }
        });
    }

    // Handle join group button clicks
    joinGroupBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const groupId = e.target.getAttribute('data-id');

            try {
                const response = await fetch(`/groups/${groupId}/join`, {
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
