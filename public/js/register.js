document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const reqLength = document.getElementById('req-length');
    const reqNumber = document.getElementById('req-number');
    const reqSpecial = document.getElementById('req-special');

    if (!registerForm || !usernameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
        return;
    }

    const updatePasswordRequirements = (value) => {
        if (reqLength) {
            reqLength.className = value.length >= 12 ? 'valid' : 'invalid';
        }
        if (reqNumber) {
            reqNumber.className = /\d/.test(value) ? 'valid' : 'invalid';
        }
        if (reqSpecial) {
            reqSpecial.className = /[!@#$%^&*(),.?"{}|<>]/.test(value) ? 'valid' : 'invalid';
        }
    };

    passwordInput.addEventListener('input', (event) => {
        updatePasswordRequirements(event.target.value);
    });

    registerForm.addEventListener('submit', (event) => {
        const usernameValue = usernameInput.value.trim();
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value;
        const confirmPasswordValue = confirmPasswordInput.value;

        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
        const lengthValid = passwordValue.length >= 12;
        const numberValid = /\d/.test(passwordValue);
        const specialValid = /[!@#$%^&*(),.?"{}|<>]/.test(passwordValue);
        const passwordsMatch = passwordValue === confirmPasswordValue;

        const messages = [];

        if (!usernameValue) messages.push('Username is required.');
        if (!emailValid) messages.push('Please enter a valid email address.');
        if (!lengthValid) messages.push('Password must be at least 12 characters.');
        if (!numberValid) messages.push('Password must contain at least one number.');
        if (!specialValid) messages.push('Password must contain at least one special character.');
        if (!passwordsMatch) messages.push('Passwords do not match.');

        if (messages.length) {
            event.preventDefault();
            let flash = document.querySelector('.flash-error');
            if (!flash) {
                flash = document.createElement('div');
                flash.className = 'flash-error';
                registerForm.parentNode.insertBefore(flash, registerForm);
            }
            flash.innerHTML = `<p class="error">${messages.join(' ')}</p>`;
        }
    });
});
