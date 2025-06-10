/* eslint-disable no-undef */
/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import * as metadataFields from './scripts';

describe('[Metadata Fields][Client]', () => {
    let section;
    let button;
    let copyTextElement;

    beforeEach(() => {
        section = document.createElement('section');
        section.setAttribute('data-component', 'metadata-fields');
        section.innerHTML = `<section class="su-flex su-flex-col su-items-center"><div class="su-flex su-w-full su-flex-col su-justify-center su-items-center md:su-flex-row md:su-gap-20 lg:su-gap-40"><div aria-hidden="true" class="su-border-none su-grow su-w-70 su-h-2 su-bg-gradient-to-r su-from-digital-red-light su-to-digital-red-dark dark:su-from-palo-verde dark:su-to-olive md:su-w-auto md:su-h-3 su-mb-38 md:su-mb-0"></div><div class="su-flex su-flex-col md:su-flex-row su-gap-32 su-pt-0 md:su-gap-x-20 md:su-gap-y-70 lg:su-gap-x-40 lg:su-gap-y-[6.1rem]"><div class="su-w-full md:su-w-auto md:su-min-w-[17rem]"><div class="su-text-center"><h3 class="su-metadata-fields-title su-text-15 su-leading-display su-font-bold su-font-sans !su-m-0 su-pb-8 md:su-pb-9 md:su-text-19"> Videographer </h3><div><p class="!su-m-0 su-text-16 su-leading-snug su-font-normal md:su-text-21" key="131259"> Harry Gregory </p></div></div></div></div><div aria-hidden="true" class="su-border-none su-grow su-w-70 su-h-2 su-bg-gradient-to-r su-from-digital-red-dark su-to-digital-red-light dark:su-from-palo-verde dark:su-to-olive md:su-w-auto md:su-h-3 su-mt-38 md:su-mt-0"></div></div><div class="su-text-center su-rs-mt-4 su-flex su-flex-col su-gap-20 md:su-gap-26"><h3 class="su-text-18 su-font-bold su-leading-snug su-font-sans !su-m-0">Related topics</h3><div class="su-flex su-gap-20 su-max-w-[71.9rem] su-flex-col md:su-gap-x-27 md:su-gap-y-12 md:su-flex-row md:su-flex-wrap md:su-justify-center"><div key="28411"><a href="https://news.stanford.edu/on-campus/topic/community-and-culture" class="su-no-underline su-leading-snug hover:su-underline su-text-digital-red dark:su-text-dark-mode-red dark:hover:su-text-white hover:su-text-black su-text-19 su-font-semibold"> Community &amp; Culture </a></div><div key="28409"><a href="https://news.stanford.edu/on-campus/topic/arts" class="su-no-underline su-leading-snug hover:su-underline su-text-digital-red dark:su-text-dark-mode-red dark:hover:su-text-white hover:su-text-black su-text-19 su-font-semibold"> Arts </a></div><div key="28466"><a href="https://news.stanford.edu/on-campus/topic/community-and-culture/undergraduate-students" class="su-no-underline su-leading-snug hover:su-underline su-text-digital-red dark:su-text-dark-mode-red dark:hover:su-text-white hover:su-text-black su-text-19 su-font-semibold"> Undergraduate Students </a></div><div key="28446"><a href="https://news.stanford.edu/on-campus/topic/arts/festival" class="su-no-underline su-leading-snug hover:su-underline su-text-digital-red dark:su-text-dark-mode-red dark:hover:su-text-white hover:su-text-black su-text-19 su-font-semibold"> Festival </a></div><div key="28469"><a href="https://news.stanford.edu/on-campus/topic/community-and-culture/collaboration" class="su-no-underline su-leading-snug hover:su-underline su-text-digital-red dark:su-text-dark-mode-red dark:hover:su-text-white hover:su-text-black su-text-19 su-font-semibold"> Collaboration </a></div></div></div><div class="su-text-center su-rs-mt-4 su-flex su-flex-col su-gap-20 md:su-gap-26"><h3 class="su-text-18 su-font-bold su-leading-snug !su-m-0 su-font-sans">Share this story</h3><button type="button" data-role="copy-link" class="su-text-digital-blue dark:su-text-digital-blue-vivid su-text-21 su-font-semibold su-mx-auto hocus:su-underline"><span data-copy-text="">Copy link</span><span class="*:su-inline-block *:su-ml-8"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 6C14.6569 6 16 4.65685 16 3C16 1.34315 14.6569 0 13 0C11.3431 0 10 1.34315 10 3C10 3.12548 10.0077 3.24917 10.0227 3.37061L5.08259 5.84064C4.54303 5.32015 3.8089 5 3 5C1.34315 5 0 6.34315 0 8C0 9.65685 1.34315 11 3 11C3.80892 11 4.54306 10.6798 5.08263 10.1593L10.0227 12.6293C10.0077 12.7508 10 12.8745 10 13C10 14.6569 11.3431 16 13 16C14.6569 16 16 14.6569 16 13C16 11.3431 14.6569 10 13 10C12.1911 10 11.457 10.3201 10.9174 10.8406L5.97733 8.37061C5.9923 8.24917 6 8.12548 6 8C6 7.8745 5.99229 7.7508 5.97733 7.62934L10.9174 5.15932C11.4569 5.67984 12.1911 6 13 6Z" fill="#006CB8"></path></svg></span></button></div></section>`;
        copyTextElement = document.createElement('span');
        document.body.appendChild(section);

        copyTextElement = section.querySelector('[data-copy-text]');
        button = section.querySelector(metadataFields.METADATA_COPY_SELECTOR);

        // Mock the clipboard API
        global.navigator.clipboard = {
            writeText: vi.fn().mockResolvedValue(),
        };

        vi.useFakeTimers();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    describe('[DOMContentLoaded]', () => {
        it('Should call _copyInit for each button', () => {
            const _copyInitSpy = vi.spyOn(metadataFields, '_copyInit');

            // Simulate DOMContentLoaded event
            const event = new Event('DOMContentLoaded');
            document.dispatchEvent(event);

            // Call the function to set up all event listeners
            document.querySelectorAll(metadataFields.METADATA_COPY_SELECTOR).forEach(btn => {
                metadataFields._copyInit(btn);
            });

            // Check if the spy was called
            expect(_copyInitSpy).toHaveBeenCalledWith(button);
            // Restore the orginal function after test
            _copyInitSpy.mockRestore();
        });
    });

    describe('[_copyInit]', () => {
        beforeEach(() => {


        });

        it('Should copy URL to clipboard and update copy text correctly', async () => {
            // Initialize event listener
            metadataFields._copyInit(button);

            // Simulate a real user click
            fireEvent.click(button);
        
            // Check if clipboard.writeText was called with the current URL
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(window.location.href);
        
            // Wait for any pending promises
            await Promise.resolve();
        
            // After clicking, text should become 'Copied'
            expect(copyTextElement.textContent).toBe('Copied');
        
            // Fast-forward 3 seconds
            vi.advanceTimersByTime(3000);
        
            // Text should revert back to 'Copy link'
            expect(copyTextElement.textContent).toBe('Copy link');
          });
    });
});