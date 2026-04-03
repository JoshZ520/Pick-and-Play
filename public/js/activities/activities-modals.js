window.PickAndPlayActivities = window.PickAndPlayActivities || {};

window.PickAndPlayActivities.createModalApi = (elements) => {
    const toggleModal = (modal, shouldShow) => {
        if (!modal) {
            return;
        }

        modal.classList.toggle('is-hidden', !shouldShow);
        modal.style.display = shouldShow ? 'flex' : 'none';
    };

    const resetFormState = (form, errorElement) => {
        if (form) {
            form.reset();
        }
        if (errorElement) {
            errorElement.classList.add('is-hidden');
            errorElement.textContent = '';
        }
    };

    const showError = (errorElement, message) => {
        if (!errorElement) {
            return;
        }

        errorElement.textContent = message;
        errorElement.classList.remove('is-hidden');
    };

    const updateActivitySelectVisibility = () => {
        if (!elements.activityType || !elements.movieSelectWrapper || !elements.gameSelectWrapper) {
            return;
        }

        const showMovies = elements.activityType.value !== 'game';
        elements.movieSelectWrapper.classList.toggle('is-hidden', !showMovies);
        elements.gameSelectWrapper.classList.toggle('is-hidden', showMovies);
    };

    const closeCreateGroupModal = () => {
        toggleModal(elements.createGroupModal, false);
        resetFormState(elements.createGroupForm, elements.formError);
    };

    const closeDeleteGroupModal = () => {
        toggleModal(elements.deleteGroupModal, false);
        resetFormState(elements.deleteGroupForm, elements.deleteFormError);
    };

    const closeAddActivityModal = () => {
        toggleModal(elements.addActivityModal, false);
        resetFormState(elements.addActivityForm, elements.addActivityFormError);
        updateActivitySelectVisibility();
    };

    const openAddActivityModal = (groupId, groupName) => {
        if (elements.activityGroupId) {
            elements.activityGroupId.value = groupId;
        }
        if (elements.activityGroupName) {
            elements.activityGroupName.value = groupName;
        }

        updateActivitySelectVisibility();
        toggleModal(elements.addActivityModal, true);
    };

    const bindModalControls = () => {
        elements.createGroupBtn?.addEventListener('click', (event) => {
            event.preventDefault();
            toggleModal(elements.createGroupModal, true);
        });

        if (elements.deleteGroupBtn && !elements.deleteGroupBtn.disabled) {
            elements.deleteGroupBtn.addEventListener('click', (event) => {
                event.preventDefault();
                toggleModal(elements.deleteGroupModal, true);
            });
        }

        elements.closeCreateGroupModalBtn?.addEventListener('click', closeCreateGroupModal);
        elements.closeDeleteGroupModalBtn?.addEventListener('click', closeDeleteGroupModal);
        elements.closeAddActivityModalBtn?.addEventListener('click', closeAddActivityModal);
        elements.activityType?.addEventListener('change', updateActivitySelectVisibility);
        updateActivitySelectVisibility();

        window.addEventListener('click', (event) => {
            if (event.target === elements.createGroupModal) {
                closeCreateGroupModal();
            }
            if (event.target === elements.deleteGroupModal) {
                closeDeleteGroupModal();
            }
            if (event.target === elements.addActivityModal) {
                closeAddActivityModal();
            }
        });
    };

    return {
        bindModalControls,
        closeCreateGroupModal,
        closeDeleteGroupModal,
        closeAddActivityModal,
        openAddActivityModal,
        showError
    };
};