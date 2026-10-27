export function validateName(label) {
  return function (value) {
    if (value.trim() === '') return `${label} is required`;
    return true;
  };
}

export function validateEmail(value) {
  const trimmed = value.trim();
  if (trimmed === '') return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(trimmed))
    return 'Email must be in correct format - eg example@gmail.com';
  return true;
}

export function validateQuery(input) {
  if (!input) return 'Query type must be selected';
  return true;
}

export function validateMessage(minLength) {
  return function (value) {
    const trimmed = value.trim();
    if (trimmed === '') return 'Message is required';
    if (trimmed.length < minLength)
      return 'Message must be a minimum of 10 characters';
    return true;
  };
}

export function validateConsent(isChecked) {
  if (!isChecked) return 'You must consent to being contacted by the team';
  return true;
}

const messageInput = document.getElementById('message');

export const fields = [
  {
    input: document.getElementById('first-name'),
    error: document.getElementById('first-name-error'),
    validate: validateName('First name'),
  },
  {
    input: document.getElementById('last-name'),
    error: document.getElementById('last-name-error'),
    validate: validateName('Last name'),
  },
  {
    input: document.getElementById('email'),
    error: document.getElementById('email-error'),
    validate: validateEmail,
  },
  {
    input: document.querySelector('.radio-section'),
    error: document.getElementById('radio-error'),
    validate: validateQuery,
    getValue: (input) =>
      input.querySelector(`input[name="query"]:checked`)?.value ?? '',
  },
  {
    input: messageInput,
    error: document.getElementById('message-error'),
    validate: validateMessage(messageInput.minLength),
  },
  {
    input: document.getElementById('consent'),
    error: document.getElementById('consent-error'),
    validate: validateConsent,
    getValue: (input) => input.checked,
  },
];

export function validateField(field) {
  const value = field.getValue
    ? field.getValue(field.input)
    : field.input.value;
  const result = field.validate(value);
  const isValid = result === true;
  field.input.setAttribute('aria-invalid', String(!isValid));
  field.error.textContent = isValid ? '' : result;
  return isValid;
}

export function resetFieldErrors() {
  fields.forEach((field) => {
    field.input.removeAttribute('aria-invalid');
    field.error.textContent = '';
  });
}
