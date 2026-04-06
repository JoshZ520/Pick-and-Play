// Dashboard page JavaScript

// Handle logout button click
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    const manageRolesBtn = document.getElementById('manageRolesBtn');
    const manageRolesModal = document.getElementById('manageRolesModal');
    const closeManageRolesModalBtn = document.getElementById('closeManageRolesModal');
    const manageRolesForm = document.getElementById('manageRolesForm');
    const manageRolesFormError = document.getElementById('manageRolesFormError');
    const roleUserSelect = document.getElementById('roleUserSelect');
    const roleValueSelect = document.getElementById('roleValueSelect');

    const toggleModal = (modal, shouldShow) => {
        if (!modal) {
            return;
        }

        modal.classList.toggle('is-hidden', !shouldShow);
        modal.style.display = shouldShow ? 'flex' : 'none';
    };

    const showRoleError = (message) => {
        if (!manageRolesFormError) {
            return;
        }

        manageRolesFormError.textContent = message;
        manageRolesFormError.classList.remove('is-hidden');
    };

    const closeManageRolesModal = () => {
        toggleModal(manageRolesModal, false);
        manageRolesForm?.reset();
        if (manageRolesFormError) {
            manageRolesFormError.textContent = '';
            manageRolesFormError.classList.add('is-hidden');
        }
    };
    
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

    manageRolesBtn?.addEventListener('click', (event) => {
        event.preventDefault();
        toggleModal(manageRolesModal, true);
    });

    closeManageRolesModalBtn?.addEventListener('click', closeManageRolesModal);

    window.addEventListener('click', (event) => {
        if (event.target === manageRolesModal) {
            closeManageRolesModal();
        }
    });

    manageRolesForm?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const userId = roleUserSelect?.value || '';
        const roleID = Number(roleValueSelect?.value || 0);

        if (!userId || ![1, 2].includes(roleID)) {
            showRoleError('Please select a valid user and role.');
            return;
        }

        try {
            const response = await fetch(`/auth/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ roleID })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.message || 'Failed to update user role');
            }

            closeManageRolesModal();
            window.location.reload();
        } catch (err) {
            showRoleError(err.message);
        }
    });
});
