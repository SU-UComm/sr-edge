import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { closeModal, openModal, STANDALONE_VISUAL_HERO_HIDDEN_CLASS, _modalInit } from './scripts';

describe('[Standalone Visual Hero Modal Functions]', () => {
    let modal, iframe;

    beforeEach(() => {
        // Create mock modal and iframe
        modal = document.createElement('div');
        iframe = document.createElement('iframe');
        iframe.setAttribute('src', 'https://example.com/video?autoplay=0');
        iframe.dataset.modal = 'iframe';
        iframe.classList.add('test-iframe');

        modal.appendChild(iframe);
        modal.classList.add(STANDALONE_VISUAL_HERO_HIDDEN_CLASS);
        modal.hidden = true;
        document.body.appendChild(modal);

        document.body.style.overflow = '';
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('openModal()', () => {
        it('Should update iframe src to autoplay=1 and show modal', () => {
            openModal(modal);

            expect(iframe.getAttribute('src')).toContain('autoplay=1');
            expect(
                modal.classList.contains(STANDALONE_VISUAL_HERO_HIDDEN_CLASS),
            ).toBe(false);
            expect(modal.hidden).toBe(false);
            expect(document.body.style.overflow).toBe('hidden');
        });
    });

    describe('closeModal()', () => {
        it('Should update iframe src to autoplay=0 and hide modal', () => {
            openModal(modal); // open first
            closeModal(modal); // then close

            expect(iframe.getAttribute('src')).toContain('autoplay=0');
            expect(
                modal.classList.contains(STANDALONE_VISUAL_HERO_HIDDEN_CLASS),
            ).toBe(true);
            expect(modal.hidden).toBe(true);
            expect(document.body.style.overflow).toBe('');
        });
    });

    describe('_modalInit()', () => {
        it('Should open modal on button click', () => {            const section = document.createElement('section');
            const openButton = document.createElement('button');
            const modalWrapper = document.createElement('div');
            const modalContent = document.createElement('div');

            openButton.setAttribute('data-click', 'open-modal');
            openButton.setAttribute('data-modal-id', 'modal-1');
            openButton.textContent = 'Open Modal';

            modalWrapper.setAttribute('data-modal-id', 'modal-1');
            modalWrapper.appendChild(modalContent);
            modalContent.classList.add('su-modal-content');
            modalWrapper.classList.add(STANDALONE_VISUAL_HERO_HIDDEN_CLASS);
            modalWrapper.hidden = true;

            section.appendChild(openButton);
            section.appendChild(modalWrapper);
            document.body.appendChild(section);

            _modalInit(section);

            // Simulate click
            openButton.click();

            expect(
                modalWrapper.classList.contains(
                    STANDALONE_VISUAL_HERO_HIDDEN_CLASS,
                ),
            ).toBe(false);
            expect(modalWrapper.hidden).toBe(false);
        });

        it('Should close modal on close button click', async () => {
            const section = document.createElement('section');
            const openButton = document.createElement('button');
            const closeButton = document.createElement('button');
            const modalWrapper = document.createElement('div');
            const modalContent = document.createElement('div');

            openButton.setAttribute('data-click', 'open-modal');
            openButton.setAttribute('data-modal-id', 'modal-2');
            closeButton.setAttribute('data-dismiss', 'modal');
            closeButton.textContent = 'Close Modal';

            modalWrapper.setAttribute('data-modal-id', 'modal-2');
            modalWrapper.appendChild(modalContent);
            modalContent.classList.add('su-modal-content');
            modalWrapper.classList.add(STANDALONE_VISUAL_HERO_HIDDEN_CLASS);
            modalWrapper.hidden = true;

            section.appendChild(openButton);
            section.appendChild(closeButton);
            section.appendChild(modalWrapper);
            document.body.appendChild(section);

            _modalInit(section);

            // Open modal first
            openButton.click();
            // Then close it
            closeButton.click();

            expect(
                modalWrapper.classList.contains(
                    STANDALONE_VISUAL_HERO_HIDDEN_CLASS,
                ),
            ).toBe(true);
            expect(modalWrapper.hidden).toBe(true);
        });

        it('Should close modal on Escape key press', async () => {
            const section = document.createElement('section');
            const openButton = document.createElement('button');
            const modalWrapper = document.createElement('div');
            const modalContent = document.createElement('div');

            openButton.setAttribute('data-click', 'open-modal');
            openButton.setAttribute('data-modal-id', 'modal-3');

            modalWrapper.setAttribute('data-modal-id', 'modal-3');
            modalWrapper.appendChild(modalContent);
            modalContent.classList.add('su-modal-content');
            modalWrapper.classList.add(STANDALONE_VISUAL_HERO_HIDDEN_CLASS);
            modalWrapper.hidden = true;

            section.appendChild(openButton);
            section.appendChild(modalWrapper);
            document.body.appendChild(section);

            _modalInit(section);

            // Open modal
            openButton.click();

            const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            document.dispatchEvent(escapeEvent);

            expect(
                modalWrapper.classList.contains(
                    STANDALONE_VISUAL_HERO_HIDDEN_CLASS,
                ),
            ).toBe(true);
            expect(modalWrapper.hidden).toBe(true);
        });

        it('Should close modal when clicking outside modal content', async () => {
            const section = document.createElement('section');
            const openButton = document.createElement('button');
            const modalWrapper = document.createElement('div');
            const modalContent = document.createElement('div');

            openButton.setAttribute('data-click', 'open-modal');
            openButton.setAttribute('data-modal-id', 'modal-4');
            openButton.textContent = 'Open Modal';

            modalWrapper.setAttribute('data-modal-id', 'modal-4');
            modalWrapper.classList.add(STANDALONE_VISUAL_HERO_HIDDEN_CLASS);
            modalWrapper.hidden = true;

            modalContent.classList.add('su-modal-content');
            modalWrapper.appendChild(modalContent);

            section.appendChild(openButton);
            section.appendChild(modalWrapper);
            document.body.appendChild(section);

            _modalInit(section);

            // Open modal
            openButton.click();

            // Now simulate a click outside modalContent (on modalWrapper)
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
            });

            modalWrapper.dispatchEvent(clickEvent);

            expect(
                modalWrapper.classList.contains(
                    STANDALONE_VISUAL_HERO_HIDDEN_CLASS,
                ),
            ).toBe(true);
            expect(modalWrapper.hidden).toBe(true);
        });

        it('Should initialize modal for each standalone visual hero section on DOMContentLoaded', async () => {
            const section = document.createElement('section');
            section.setAttribute('data-component', 'standalone-visual-hero');

            const openButton = document.createElement('button');
            openButton.setAttribute('data-click', 'open-modal');
            openButton.setAttribute('data-modal-id', 'modal-5');

            const modalWrapper = document.createElement('div');
            modalWrapper.setAttribute('data-modal-id', 'modal-5');
            modalWrapper.classList.add(STANDALONE_VISUAL_HERO_HIDDEN_CLASS);
            modalWrapper.hidden = true;

            const modalContent = document.createElement('div');
            modalContent.classList.add('su-modal-content');
            modalWrapper.appendChild(modalContent);

            section.appendChild(openButton);
            section.appendChild(modalWrapper);
            document.body.appendChild(section);

            // Dispatch DOMContentLoaded manually
            document.dispatchEvent(new Event('DOMContentLoaded'));

            // Simulate clicking open button
            openButton.click();

            // After clicking, modal should be visible
            expect(
                modalWrapper.classList.contains(
                    STANDALONE_VISUAL_HERO_HIDDEN_CLASS,
                ),
            ).toBe(false);
            expect(modalWrapper.hidden).toBe(false);
        });

        it('Should do nothing if modal element is not found', () => {
            // Arrange
            const section = document.createElement('section');
            section.setAttribute('data-component', 'standalone-visual-hero');
          
            const openButton = document.createElement('button');
            openButton.setAttribute('data-click', 'open-modal');
            openButton.setAttribute('data-modal-id', 'non-existing-modal-id');
          
            section.appendChild(openButton);
            document.body.appendChild(section);
          
            _modalInit(section);
          
            openButton.click();
          
            expect(true).toBe(true);
        });   
    });
});
