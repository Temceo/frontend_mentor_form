// script.test.mjs
import { describe, it, expect, beforeAll } from '@jest/globals';
let fields, validateField;

beforeAll(async () => {
  document.body.innerHTML = `
    <form novalidate>
      <input id="first-name" />
      <span id="first-name-error"></span>

      <input id="last-name" />
      <span id="last-name-error"></span>

      <input id="email" />
      <span id="email-error"></span>

      <fieldset class="radio-section">
        <input type="radio" name="query" id="general" value="General Enquiry" />
        <input type="radio" name="query" id="support" value="Support Request" />
      </fieldset>
      <span id="radio-error"></span>

      <textarea id="message" minlength="10"></textarea>
      <span id="message-error"></span>

      <input type="checkbox" id="consent" />
      <span id="consent-error"></span>
    </form>
    <div id="toast"></div>`;

  ({ fields, validateField } = await import('./validation.mjs'));
});

beforeEach(() => {
  document.querySelector('form').reset();

  document.querySelectorAll('[id$="-error"]').forEach((el) => {
    el.textContent = '';
  });
  document.querySelectorAll('[aria-invalid]').forEach((el) => {
    el.removeAttribute('aria-invalid');
  });
});

describe('validateField', () => {
  it('shows an error and sets aria-invalid for an empty first name', () => {
    const field = fields[0];
    expect(validateField(field)).toBe(false);
    expect(field.error.textContent).toBe('First name is required');
    expect(field.input.getAttribute('aria-invalid')).toBe('true');
  });

  it('clears the error once the value is valid', () => {
    const field = fields[0];
    validateField(field);
    field.input.value = 'Sam';
    expect(validateField(field)).toBe(true);
    expect(field.error.textContent).toBe('');
    expect(field.input.getAttribute('aria-invalid')).toBe('false');
  });

  it('fails the radio group when nothing is selected', () => {
    const radio = fields[3];
    expect(validateField(radio)).toBe(false);
    expect(radio.error.textContent).toBe('Query type must be selected');
  });

  it('passes the radio group once an option is checked', () => {
    const support = document.getElementById('support');
    support.checked = true;

    const radio = fields.find((f) => f.getValue);
    expect(validateField(radio)).toBe(true);
  });

  it('fails when no email input is entered', () => {
    const field = fields[2];
    field.input.value = '';
    expect(validateField(field)).toBe(false);
    expect(field.error.textContent).toBe('Email is required');
    expect(field.input.getAttribute('aria-invalid')).toBe('true');
  });

  it('fails when email format is incorrect', () => {
    const field = fields[2];
    field.input.value = 'mmm';
    expect(validateField(field)).toBe(false);
    expect(field.error.textContent).toBe(
      'Email must be in correct format - eg example@gmail.com',
    );
    expect(field.input.getAttribute('aria-invalid')).toBe('true');
  });

  it('passes when email format is correct', () => {
    const field = fields[2];
    field.input.value = 'example@gmail.com';
    expect(validateField(field)).toBe(true);
    expect(field.error.textContent).toBe('');
    expect(field.input.getAttribute('aria-invalid')).toBe('false');
  });
});
