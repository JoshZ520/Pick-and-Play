window.PickAndPlayActivities = window.PickAndPlayActivities || {};

const initializeActivitiesPage = () => {
    const elements = {
        votesDisplay: document.getElementById('votes-display'),
        addBtn: document.getElementById('add-btn'),
        createGroupBtn: document.getElementById('createGroupBtn'),
        deleteGroupBtn: document.getElementById('deleteGroupBtn'),
        createGroupModal: document.getElementById('createGroupModal'),
        deleteGroupModal: document.getElementById('deleteGroupModal'),
        addActivityModal: document.getElementById('addActivityModal'),
        closeCreateGroupModalBtn: document.getElementById('closeCreateGroupModal'),
        closeDeleteGroupModalBtn: document.getElementById('closeDeleteGroupModal'),
        closeAddActivityModalBtn: document.getElementById('closeAddActivityModal'),
        createGroupForm: document.getElementById('createGroupForm'),
        deleteGroupForm: document.getElementById('deleteGroupForm'),
        addActivityForm: document.getElementById('addActivityForm'),
        formError: document.getElementById('formError'),
        deleteFormError: document.getElementById('deleteFormError'),
        addActivityFormError: document.getElementById('addActivityFormError'),
        activityGroupId: document.getElementById('activityGroupId'),
        activityGroupName: document.getElementById('activityGroupName'),
        activityType: document.getElementById('activityType'),
        movieSelectWrapper: document.getElementById('movieSelectWrapper'),
        gameSelectWrapper: document.getElementById('gameSelectWrapper'),
        movieActivitySelect: document.getElementById('movieActivitySelect'),
        gameActivitySelect: document.getElementById('gameActivitySelect')
    };

    let votes = 0;

    if (elements.addBtn && elements.votesDisplay) {
        elements.addBtn.addEventListener('click', () => {
            votes += 1;
            elements.votesDisplay.textContent = `Votes: ${votes} / 7`;
        });
    }

    const modalApi = window.PickAndPlayActivities.createModalApi(elements);
    modalApi.bindModalControls();
    window.PickAndPlayActivities.bindGroupActions(elements, modalApi);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeActivitiesPage, { once: true });
} else {
    initializeActivitiesPage();
}