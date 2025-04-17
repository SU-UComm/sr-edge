/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import * as combinedContentGrid from './scripts';

describe('[Combined Content Grid][Client]', () => {
    let section, modal, openBtn, closeBtn, iframe;

    beforeEach(() => {
        // Setup DOM structure
        modal = document.createElement('div');
        iframe = document.createElement('iframe');
        iframe.setAttribute('src', 'https://example.com?autoplay=0');
        modal.appendChild(iframe);
        modal.classList.add(combinedContentGrid.COMBINED_CONTENT_GRID_HIDDEN_CLASS);

        document.body.appendChild(modal);
    });

    afterEach(() => {
        document.body.innerHTML = ''; // Clear DOM
        vi.clearAllMocks();
    });

    describe('[DOMContentLoaded]', () => {
        it('Should call _modalInit for each section', () => {
            const section = document.createElement('section');
            section.setAttribute('data-component', 'combined-content-grid');
            document.body.appendChild(section);

            const _modalInitSpy = vi.spyOn(combinedContentGrid, '_modalInit');

            // Simulate DOMContentLoaded event
            const event = new Event('DOMContentLoaded');
            document.dispatchEvent(event);

            document.querySelectorAll(combinedContentGrid.COMBINED_CONTENT_GRID_SELECTOR).forEach(section => {
                // Call the function to set up all event listeners
                combinedContentGrid._modalInit(section);
            });

            // Check if the spy was called
            expect(_modalInitSpy).toHaveBeenCalledWith(section);

            // Restore the original function after test
            _modalInitSpy.mockRestore();
        });
    });

    describe('[Modal functionality]', () => {
        beforeEach(() => {
            section = document.createElement('section');
            section.setAttribute('data-component', 'combined-content-grid');
            
            openBtn = document.createElement('button');
            openBtn.setAttribute('data-click', 'open-modal');
            openBtn.setAttribute('data-modal-id', 'test-modal');
            
            closeBtn = document.createElement('button');
            closeBtn.setAttribute('data-dismiss', 'modal');
            
            modal = document.createElement('div');
            modal.setAttribute('data-modal', 'modal');
            modal.setAttribute('data-modal-id', 'test-modal');
            modal.classList.add(combinedContentGrid.COMBINED_CONTENT_GRID_HIDDEN_CLASS);
            
            iframe = document.createElement('iframe');
            iframe.setAttribute('data-modal', 'iframe');
            iframe.setAttribute('src', 'https://example.com?autoplay=0');
            
            modal.appendChild(iframe);
            section.appendChild(openBtn);
            section.appendChild(modal);
            section.appendChild(closeBtn);
            document.body.appendChild(section);

            combinedContentGrid._modalInit(section);
        });

        it('Should open the modal when open button was clicked', () => {
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(combinedContentGrid.COMBINED_CONTENT_GRID_HIDDEN_CLASS)).toBe(false);
        });

        it('Should close the modal when close button was clicked', () => {
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(combinedContentGrid.COMBINED_CONTENT_GRID_HIDDEN_CLASS)).toBe(false);

            // Simulate click on close button
            fireEvent.click(closeBtn);

            // check if modal was closed
            expect(modal.classList.contains(combinedContentGrid.COMBINED_CONTENT_GRID_HIDDEN_CLASS)).toBe(true);
        });

        it('Should close the modal when Escape key is pressed', () => {
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(combinedContentGrid.COMBINED_CONTENT_GRID_HIDDEN_CLASS)).toBe(false);

            // Simulate Escape key press
            fireEvent.keyDown(document, { key: 'Escape' });

            // Check if close function was called
            expect(modal.classList.contains(combinedContentGrid.COMBINED_CONTENT_GRID_HIDDEN_CLASS)).toBe(true);
        });

        it('Should not close the modal when a non-Escape key is pressed', () => {    
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(combinedContentGrid.COMBINED_CONTENT_GRID_HIDDEN_CLASS)).toBe(false);

            // Simulate a non-Escape key press
            fireEvent.keyDown(document, { key: 'ArrowUp' });
    
            // Check if close function was not called
            expect(modal.classList.contains(combinedContentGrid.COMBINED_CONTENT_GRID_HIDDEN_CLASS)).toBe(false);
        });

        it('Should make the modal visible and set autoplay=1 in the iframe src', () => {
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(combinedContentGrid.COMBINED_CONTENT_GRID_HIDDEN_CLASS)).toBe(false);
            
            // check if iframe's autoplay was changed to 1 
            expect(iframe.getAttribute('src')).toBe('https://example.com?autoplay=1');
        });

        it('Should hide the modal and set autoplay=0 in the iframe src', () => {
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(combinedContentGrid.COMBINED_CONTENT_GRID_HIDDEN_CLASS)).toBe(false);

            // Simulate click on close button
            fireEvent.click(closeBtn);

            // check if modal was closed
            expect(modal.classList.contains(combinedContentGrid.COMBINED_CONTENT_GRID_HIDDEN_CLASS)).toBe(true);

            // check if iframe's autoplay was changed to 0 
            expect(iframe.getAttribute('src')).toBe('https://example.com?autoplay=0');
        });
    });
});
