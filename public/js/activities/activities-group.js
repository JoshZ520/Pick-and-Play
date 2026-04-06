window.PickAndPlayActivities = window.PickAndPlayActivities || {};

window.PickAndPlayActivities.bindGroupActions = (elements, modalApi) => {
    const addActivityBtns = document.querySelectorAll('.add-activity-btn');
    const joinGroupBtns = document.querySelectorAll('.join-group-btn');
    const removeActivityBtns = document.querySelectorAll('.remove-activity-btn');
    const voteActivityBtns = document.querySelectorAll('.vote-activity-btn');
    const finishGroupBtns = document.querySelectorAll('.finish-group-btn');
    const createGroupActivityInputs = document.querySelectorAll('.create-group-activity');

    const getErrorMessage = async (response, fallbackMessage) => {
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            const errorData = await response.json().catch(() => ({}));
            return errorData.error || errorData.message || fallbackMessage;
        }

        const text = await response.text().catch(() => '');
        return text || fallbackMessage;
    };

    const sendJsonRequest = async (url, options, fallbackMessage) => {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(await getErrorMessage(response, fallbackMessage));
        }

        return response;
    };

    elements.createGroupForm?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const groupName = document.getElementById('groupName')?.value.trim() || '';
        if (!groupName) {
            modalApi.showError(elements.formError, 'Group name is required.');
            return;
        }

        const selectedActivities = Array.from(createGroupActivityInputs)
            .filter((input) => input.checked)
            .map((input) => ({ activityType: input.dataset.activityType, activityId: input.value }));

        try {
            await sendJsonRequest('/api/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ groupName, winVote: 0, activities: selectedActivities })
            }, 'Failed to create group');

            modalApi.closeCreateGroupModal();
            window.location.reload();
        } catch (err) {
            modalApi.showError(elements.formError, err.message);
        }
    });

    elements.deleteGroupForm?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const groupId = document.getElementById('groupSelect')?.value || '';
        if (!groupId) {
            modalApi.showError(elements.deleteFormError, 'Please select a group.');
            return;
        }

        try {
            await sendJsonRequest(`/api/groups/${groupId}`, { method: 'DELETE' }, 'Failed to delete group');
            modalApi.closeDeleteGroupModal();
            window.location.reload();
        } catch (err) {
            modalApi.showError(elements.deleteFormError, err.message);
        }
    });

    elements.addActivityForm?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const groupId = elements.activityGroupId?.value || '';
        const selectedType = elements.activityType?.value || 'movie';
        const selectedActivityId = selectedType === 'game'
            ? (elements.gameActivitySelect?.value || '')
            : (elements.movieActivitySelect?.value || '');

        if (!groupId || !selectedActivityId) {
            modalApi.showError(elements.addActivityFormError, 'Please choose an activity to add.');
            return;
        }

        try {
            await sendJsonRequest(`/api/groups/${groupId}/activities`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activityType: selectedType, activityId: selectedActivityId })
            }, 'Failed to add activity');

            modalApi.closeAddActivityModal();
            window.location.reload();
        } catch (err) {
            modalApi.showError(elements.addActivityFormError, err.message);
        }
    });

    addActivityBtns.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            modalApi.openAddActivityModal(button.dataset.groupId, button.dataset.groupName || '');
        });
    });

    joinGroupBtns.forEach((button) => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            const groupId = button.getAttribute('data-id');
            try {
                const response = await fetch(`/api/groups/${groupId}/join`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
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

    removeActivityBtns.forEach((button) => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();

            const { groupId, activityId, activityType } = button.dataset;
            if (!groupId || !activityId || !activityType) {
                return;
            }

            try {
                await sendJsonRequest(`/api/groups/${groupId}/activities/${activityType}/${activityId}`, {
                    method: 'DELETE'
                }, 'Failed to remove activity');

                window.location.reload();
            } catch (err) {
                window.alert(err.message);
            }
        });
    });

    voteActivityBtns.forEach((button) => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();

            const { groupId, activityId, activityType } = button.dataset;
            if (!groupId || !activityId || !activityType) {
                return;
            }

            try {
                await sendJsonRequest(`/api/groups/${groupId}/activities/${activityType}/${activityId}/vote`, {
                    method: 'POST'
                }, 'Failed to vote on activity');

                window.location.reload();
            } catch (err) {
                window.alert(err.message);
            }
        });
    });

    finishGroupBtns.forEach((button) => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();

            const groupId = button.dataset.groupId;
            if (!groupId) {
                return;
            }

            try {
                await sendJsonRequest(`/api/groups/${groupId}/finish`, {
                    method: 'POST'
                }, 'Failed to finish voting');

                window.location.reload();
            } catch (err) {
                window.alert(err.message);
            }
        });
    });
};