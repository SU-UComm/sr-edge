import { describe, it, beforeEach, vi, expect } from 'vitest';
import { _subscribeInit, initSubscribeScripts, CONTENT_SELECTOR } from './scripts';

describe('[Subscribe Form Script]', () => {
    let section, form, emailInput, errorContainer;

    // Set up a mock DOM structure beforeEach
    beforeEach(() => {
        document.body.innerHTML = `
        <section data-component="subscribe-to-stanford-report">
            <form>
            <input type="email" />
            <div id="error-container"></div>
            <button type="submit">Submit</button>
            </form>
        </section>
        `;

        section = document.querySelector('section[data-component]');
        form = section.querySelector('form');
        emailInput = form.querySelector('input[type="email"]');
        errorContainer = form.querySelector('#error-container');

        _subscribeInit(section);
    });

    it('Should show error on empty email submit', () => {
        // Simulate empty email input and form submission
        emailInput.value = '';
        const event = new Event('submit');
        form.dispatchEvent(event);

        expect(errorContainer.innerHTML).toContain(
            'Please enter a valid email address',
        );
        expect(emailInput.getAttribute('aria-describedby')).toBe(
            'subscription-error',
        );
    });

    it('Should show error on invalid email', () => {
        emailInput.value = 'invalidEmail123';
        const event = new Event('submit');
        form.dispatchEvent(event);

        expect(errorContainer.innerHTML).toContain(
            'Please enter a valid email address',
        );
    });

    it('Should clear error and submit form on valid email', () => {
        // Simulate valid email input
        emailInput.value = 'test@test.com';

        // Spy on form.submit 
        const submitSpy = vi.fn();
        form.submit = submitSpy;

        const event = new Event('submit');
        form.dispatchEvent(event);

        expect(errorContainer.innerHTML).toBe('');
        expect(emailInput.getAttribute('aria-describedby')).toBe(null);
        expect(submitSpy).toHaveBeenCalled();
    });

    it('Should remove error while typing valid email after error', () => {
        // Simulate previous error state
        emailInput.value = 'invalid';
        const submitEvent = new Event('submit');
        form.dispatchEvent(submitEvent);

        expect(errorContainer.innerHTML).toContain(
            'Please enter a valid email address',
        );

        emailInput.value = 'test@test.com';
        const keyupEvent = new KeyboardEvent('keyup');
        emailInput.dispatchEvent(keyupEvent);

        expect(errorContainer.innerHTML).toBe('');
        expect(emailInput.getAttribute('aria-describedby')).toBe(null);
    });
});

describe('[Subscribe Init Script]', () => {
    beforeEach(() => {
        document.body.innerHTML = `
        <section data-component="subscribe-to-stanford-report">
          <form>
            <input type="email" />
            <div id="error-container"></div>
            <button type="submit">Submit</button>
          </form>
        </section>
      `;
    });

    it('Should initialize _subscribeInit for all matching components', () => {
        const spy = vi.spyOn(document, 'querySelectorAll');

        initSubscribeScripts();

        expect(spy).toHaveBeenCalledWith(CONTENT_SELECTOR);
        spy.mockRestore();
    });
});
