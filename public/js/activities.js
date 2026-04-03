document.addEventListener('DOMContentLoaded', () => {
    const votesDisplay = document.getElementById('votes-display');
    const addBtn = document.getElementById('add-btn');
    const createGroupBtn = document.getElementById('createGroupBtn');
    const deleteGroupBtn = document.getElementById('deleteGroupBtn');
    const createGroupModal = document.getElementById('createGroupModal');
    const deleteGroupModal = document.getElementById('deleteGroupModal');
    const closeCreateGroupModalBtn = document.getElementById('closeCreateGroupModal');
    const closeDeleteGroupModalBtn = document.getElementById('closeDeleteGroupModal');
    const createGroupForm = document.getElementById('createGroupForm');
    const deleteGroupForm = document.getElementById('deleteGroupForm');
    const formError = document.getElementById('formError');
    const deleteFormError = document.getElementById('deleteFormError');

    let votes = 0;

    const openCreateGroupModal = () => {
        if (createGroupModal) {
            createGroupModal.classList.remove('is-hidden');
        }
    };

    const closeCreateGroupModal = () => {
        if (createGroupModal) {
            createGroupModal.classList.add('is-hidden');
        }
        if (createGroupForm) {
            createGroupForm.reset();
        }
        if (formError) {
            formError.classList.add('is-hidden');
        }
    };

    const openDeleteGroupModal = () => {
        if (deleteGroupModal) {
            deleteGroupModal.classList.remove('is-hidden');
        }
    };

    const closeDeleteGroupModal = () => {
        if (deleteGroupModal) {
            deleteGroupModal.classList.add('is-hidden');
        }
        if (deleteGroupForm) {
            deleteGroupForm.reset();
        }
        if (deleteFormError) {
            deleteFormError.classList.add('is-hidden');
        }
    };

    if (addBtn && votesDisplay) {
        addBtn.addEventListener('click', () => {
            votes += 1;
            votesDisplay.textContent = `Votes: ${votes} / 7`;
        });
    }

    if (createGroupBtn) {
        createGroupBtn.addEventListener('click', openCreateGroupModal);
    }

    if (deleteGroupBtn) {
        deleteGroupBtn.addEventListener('click', openDeleteGroupModal);
    }

    if (closeCreateGroupModalBtn) {
        closeCreateGroupModalBtn.addEventListener('click', closeCreateGroupModal);
    }

    if (closeDeleteGroupModalBtn) {
        closeDeleteGroupModalBtn.addEventListener('click', closeDeleteGroupModal);
    }

    window.addEventListener('click', (event) => {
        if (event.target === createGroupModal) {
            closeCreateGroupModal();
        }
        if (event.target === deleteGroupModal) {
            closeDeleteGroupModal();
        }
    });

    if (createGroupForm) {
        createGroupForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const groupNameEl = document.getElementById('groupName');
            const groupName = groupNameEl ? groupNameEl.value.trim() : '';

            if (!groupName) {
                if (formError) {
                    formError.textContent = 'Group name is required.';
                    formError.classList.remove('is-hidden');
                }
                return;
            }

            try {
                const response = await fetch('/groups', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        groupName,
                        winVote: 0,
                        activities: []
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to create group');
                }

                closeCreateGroupModal();
                window.location.reload();
            } catch (err) {
                if (formError) {
                    formError.textContent = err.message;
                    formError.classList.remove('is-hidden');
                }
            }
        });
    }

    if (deleteGroupForm) {
        deleteGroupForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const groupSelectEl = document.getElementById('groupSelect');
            const groupId = groupSelectEl ? groupSelectEl.value : '';

            if (!groupId) {
                if (deleteFormError) {
                    deleteFormError.textContent = 'Please select a group.';
                    deleteFormError.classList.remove('is-hidden');
                }
                return;
            }

            try {
                const response = await fetch(`/groups/${groupId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to delete group');
                }

                closeDeleteGroupModal();
                window.location.reload();
            } catch (err) {
                if (deleteFormError) {
                    deleteFormError.textContent = err.message;
                    deleteFormError.classList.remove('is-hidden');
                }
            }
        });
    }
});
