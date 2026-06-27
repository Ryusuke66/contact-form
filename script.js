const form = document.querySelector('form');
const messageSent = document.getElementById('message-sent');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    let isFormValid = true;

    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(function(field) {
        let errorMsg = null;
        const groupContainer = field.closest('.checkbox-group-container') || field.closest('.consent-box');
        if (groupContainer) {
            const next = groupContainer.nextElementSibling;
            if (next && next.classList.contains('error-msg')) errorMsg = next;
        }
        if (!errorMsg) {
            const next = field.nextElementSibling;
            if (next && next.classList.contains('error-msg')) errorMsg = next;
        }
        if (!errorMsg) {
            const ancestor = field.closest('form') || field.parentElement;
            const found = ancestor && ancestor.querySelector('.error-msg');
            if (found) errorMsg = found;
        }

        let invalid = false;
        const tag = field.tagName.toLowerCase();
        if (field.type === 'checkbox') {
            if (!field.checked) invalid = true;
        } else if (tag === 'textarea' || field.type === 'text' || field.type === 'email') {
            if (!field.value.trim()) invalid = true;
            if (!invalid && field.type === 'email') {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(field.value.trim())) invalid = true;
            }
        } else {
            if (!field.value.trim()) invalid = true;
        }

        if (invalid) {
            isFormValid = false;
            field.classList.add('invalid');
            if (errorMsg) errorMsg.style.display = 'block';
        } else {
            field.classList.remove('invalid');
            if (errorMsg) errorMsg.style.display = 'none';
        }
    });

    const checkboxGroup = form.querySelector('.checkbox-group-container');
    if (checkboxGroup) {
        const checkboxes = checkboxGroup.querySelectorAll('input[type="checkbox"]');
        const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
        const checkboxError = checkboxGroup.nextElementSibling;
        if (!anyChecked) {
            isFormValid = false;
            checkboxGroup.classList.add('invalid');
            if (checkboxError && checkboxError.classList.contains('error-msg')) checkboxError.style.display = 'block';
        } else {
            checkboxGroup.classList.remove('invalid');
            if (checkboxError && checkboxError.classList.contains('error-msg')) checkboxError.style.display = 'none';
        }
    }

    if (isFormValid) {
        messageSent.classList.add('show');
        form.querySelectorAll('.error-msg').forEach((msg) => msg.style.display = 'none');
        form.reset();
        setTimeout(function() {
            messageSent.classList.remove('show');
        }, 5000);
    }
});