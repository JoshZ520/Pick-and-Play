window.PickAndPlayActivities = window.PickAndPlayActivities || {};

const initializeActivitiesPage = () => {
    const elements = {
        createGroupBtn: document.getElementById('createGroupBtn'),
        deleteGroupBtn: document.getElementById('deleteGroupBtn'),
        manageRolesBtn: document.getElementById('manageRolesBtn'),
        createGroupModal: document.getElementById('createGroupModal'),
        deleteGroupModal: document.getElementById('deleteGroupModal'),
        addActivityModal: document.getElementById('addActivityModal'),
        manageRolesModal: document.getElementById('manageRolesModal'),
        closeCreateGroupModalBtn: document.getElementById('closeCreateGroupModal'),
        closeDeleteGroupModalBtn: document.getElementById('closeDeleteGroupModal'),
        closeAddActivityModalBtn: document.getElementById('closeAddActivityModal'),
        closeManageRolesModalBtn: document.getElementById('closeManageRolesModal'),
        createGroupForm: document.getElementById('createGroupForm'),
        deleteGroupForm: document.getElementById('deleteGroupForm'),
        addActivityForm: document.getElementById('addActivityForm'),
        manageRolesForm: document.getElementById('manageRolesForm'),
        formError: document.getElementById('formError'),
        deleteFormError: document.getElementById('deleteFormError'),
        addActivityFormError: document.getElementById('addActivityFormError'),
        manageRolesFormError: document.getElementById('manageRolesFormError'),
        activityGroupId: document.getElementById('activityGroupId'),
        activityGroupName: document.getElementById('activityGroupName'),
        activityType: document.getElementById('activityType'),
        movieSelectWrapper: document.getElementById('movieSelectWrapper'),
        gameSelectWrapper: document.getElementById('gameSelectWrapper'),
        movieActivitySelect: document.getElementById('movieActivitySelect'),
        gameActivitySelect: document.getElementById('gameActivitySelect'),
        roleUserSelect: document.getElementById('roleUserSelect'),
        roleValueSelect: document.getElementById('roleValueSelect')
    };

    const modalApi = window.PickAndPlayActivities.createModalApi(elements);
    modalApi.bindModalControls();
    window.PickAndPlayActivities.bindGroupActions(elements, modalApi);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeActivitiesPage, { once: true });
} else {
    initializeActivitiesPage();
}