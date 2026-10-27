'use strict';

import { fields, validateField, resetFieldErrors } from './validation.mjs';

const form = document.querySelector('form');

function handleSubmit(e) {
  e.preventDefault();

  const allFieldsValid = fields.map(validateField).every(Boolean);
  if (!allFieldsValid) {
    fields
      .find((field) => field.input.getAttribute('aria-invalid') === 'true')
      .input.focus();
    return;
  }

  form.reset();
  showToast();
  resetFieldErrors();
}

fields.forEach((field) => {
  field.input.addEventListener('blur', () => validateField(field));

  field.input.addEventListener('input', () => {
    if (field.input.getAttribute('aria-invalid') === 'true')
      validateField(field);
  });
});

function showToast() {
  let toastTimeout;
  clearTimeout(toastTimeout);
  const toast = document.getElementById('toast');
  toast.classList.remove('hidden');
  toast.classList.add('toast');
  toast.textContent = 'You have successfully submitted the form';

  toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

form.addEventListener('submit', handleSubmit);
