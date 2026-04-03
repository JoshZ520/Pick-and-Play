document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (!loginForm || !emailInput || !passwordInput) {
        return;
    }

    loginForm.addEventListener('submit', (event) => {
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value;
        const messages = [];

        if (!emailValue) {
            messages.push('Email is required.');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
            messages.push('Please enter a valid email address.');
        }

        if (!passwordValue) {
            messages.push('Password is required.');
        }

        if (messages.length) {
            event.preventDefault();
            let flash = document.querySelector('.flash-error');
            if (!flash) {
                flash = document.createElement('div');
                flash.className = 'flash-error';
                loginForm.parentNode.insertBefore(flash, loginForm);
            }
            flash.innerHTML = `<p class="error">${messages.join(' ')}</p>`;
        }
    });
});
