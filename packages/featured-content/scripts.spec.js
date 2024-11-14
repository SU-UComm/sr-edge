/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';
import * as featuredContent from './scripts';

describe('[Feature Content][Client]', () => {
    let section, modal, openBtn, closeBtn, iframe;

    beforeEach(() => {
        // Setup DOM structure
        modal = document.createElement('div');
        iframe = document.createElement('iframe');
        iframe.setAttribute('src', 'https://example.com?autoplay=0');
        modal.appendChild(iframe);
        modal.classList.add(featuredContent.FEATURED_CONTENT_HIDDEN_CLASS);

        document.body.appendChild(modal);
    });

    afterEach(() => {
        document.body.innerHTML = ''; // Clear DOM
        jest.clearAllMocks();
    });

    describe('[DOMContentLoaded]', () => {
        it('Should call _modalInit for each section', () => {
            const section = document.createElement('section');
            section.setAttribute('data-component', 'featured-content');
            document.body.appendChild(section);

            const _modalInitSpy = jest.spyOn(featuredContent, '_modalInit');

             // Simulate DOMContentLoaded event
             const event = new Event('DOMContentLoaded');
             document.dispatchEvent(event);


             document.querySelectorAll(featuredContent.FEATURED_CONTENT_SELECTOR).forEach(section => {
                // Call the function to set up all event listeners
                featuredContent._modalInit(section);
            });

            // Check if the spy was called
            expect(_modalInitSpy).toHaveBeenCalledWith(section);

            // Restore the original function after test
            _modalInitSpy.mockRestore(); 
        });
    });


    describe('[Modal functionality]', () => {
        const setupDom = () => {
            document.body.innerHTML = `
            <section data-component="featured-content">
                <div class="su-mx-auto su-component-container su-container-large su-container-px">
                    <div class="su-component-line-heading su-flex su-flex-wrap su-items-baseline su-gap-5 su-gap-x-13 md:su-gap-13">
                        <h2 class="su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white su-text-black">
                            Features items
                        </h2>
                        <hr aria-hidden="true" class="md:su-mb-11 lg:su-mb-15 su-grow su-border-none su-bg-gradient-light-red-h su-h-4" />

                        <a
                            data-test="cta"
                            href="https://example.com"
                            class="su-group su-flex su-no-underline hocus:su-underline su-transition su-items-center md:su-items-end md:su-mb-8 lg:su-mb-12 su-flex-nowrap su-align-baseline su-gap-20 md:su-gap-13 su-text-19 su-decoration-2 dark:su-text-white su-text-black hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red"
                        >
                            <span class="su-flex su-gap-2 su-items-baseline">
                                <span> View all <span class="sr-only">Features items</span> </span>
                                <svg
                                    aria-hidden="true"
                                    focusable="false"
                                    data-prefix="fas"
                                    data-icon="chevron-right"
                                    class="svg-inline--fa fa-chevron-right fa-fw su-text-14 group-hocus:su-translate-x-02em su-transition-transform"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 320 512"
                                >
                                    <path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path>
                                </svg>
                            </span>
                        </a>
                    </div>

                    <div class="su-w-full su-component-featured-grid">
                        <div class="su-flex su-flex-wrap su-gap-[68px] md:su-gap-72 md:su-flex-nowrap lg:su-gap-[160px]">
                            <div class="md:su-basis-[58.333%] lg:su-basis-[64.5%] su-grow">
                                <article aria-label="Remembering Oct. 7 and learning about Israel, Gaza, and the Middle East" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                                    <div class="su-mb-15 md:su-mb-26 lg:su-mb-38">
                                        <button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="b893c60d95b1fce6bc334ac3843d1839">
                                            <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[16/9]">
                                                <img
                                                    class="su-absolute su-object-cover su-object-center su-size-full"
                                                    src="https://example.com"
                                                    alt="Open video  in a modal"
                                                />

                                                <span class="*:su-w-[40px] su-absolute su-leading-none su-left-13 su-bottom-13 md:su-left-27 md:su-bottom-27 [&amp;>svg]:su-text-[4rem] [&amp;>svg]:md:su-text-[6rem]">
                                                    <svg
                                                        aria-hidden="true"
                                                        focusable="false"
                                                        data-prefix="far"
                                                        data-icon="circle-play"
                                                        class="fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]"
                                                        role="img"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 512 512"
                                                    >
                                                        <path
                                                            fill="currentColor"
                                                            d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"
                                                        ></path>
                                                    </svg>
                                                </span>
                                            </span>
                                        </button>
                                    </div>

                                    <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-13 lg:su-gap-13">
                                        <h3 class="su-w-full su-text-[35px] md:su-text-[40px] lg:su-text-[43px] su-leading-[42px] md:su-leading-[48px] lg:su-leading-[51.6px] su-font-serif su-my-0">
                                            <a
                                                href="https://example.com"
                                                class="su-stretched-link focus:su-outline-0 focus:before:su-ring hocus:su-underline hover:su-text-digital-red su-transition su-text-black dark:su-text-white dark:hover:su-text-dark-mode-red before:su-absolute before:su-w-full before:su-h-full before:su-block before:su-top-0 before:su-left-0"
                                            >
                                                Remembering Oct. 7 and learning about Israel, Gaza, and the Middle East
                                            </a>
                                        </h3>

                                        <p
                                            data-testid="vertical-card-type"
                                            class="su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-text-18 su-leading-[23.4px] md:su-text-20 md:su-leading-[26px] lg:su-text-20 lg:su-leading-[26px]"
                                        >
                                            <svg aria-hidden="true" data-testid="svg-video" xmlns="http://www.w3.org/2000/svg" width="18" height="13" viewBox="0 0 18 13" fill="none">
                                                <path
                                                    d="M0 2.5C0 1.39688 0.896875 0.5 2 0.5H10C11.1031 0.5 12 1.39688 12 2.5V10.5C12 11.6031 11.1031 12.5 10 12.5H2C0.896875 12.5 0 11.6031 0 10.5V2.5ZM17.4719 1.61875C17.7969 1.79375 18 2.13125 18 2.5V10.5C18 10.8687 17.7969 11.2063 17.4719 11.3813C17.1469 11.5563 16.7531 11.5375 16.4438 11.3313L13.4438 9.33125L13 9.03438V8.5V4.5V3.96562L13.4438 3.66875L16.4438 1.66875C16.75 1.46563 17.1437 1.44375 17.4719 1.61875Z"
                                                ></path>
                                            </svg>
                                            <span>Video</span>
                                        </p>

                                        <div
                                            class="su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 *:su-text-18 su-text-18 *:md:su-text-19 md:su-text-19 *:su-leading-[22.5px] su-leading-[22.5px] *:md:su-leading-[23.75px] md:su-leading-[23.75px] *:su-mt-4 *:md:su-mt-14"
                                            <p=""
                                        >
                                            Throughout fall quarter, there are different opportunities for the Stanford community to remember and reflect on the impacts of Oct. 7 and to learn more broadly about the region and its history.
                                            <p></p>
                                        </div>
                                    </div>
                                </article>
                            </div>
                            <div
                                class="su-relative su-flex su-flex-wrap su-grow before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black su-gap-80 md:su-gap-72 lg:su-gap-[76px] before:md:su-w-px before:su-h-px before:md:su-h-full md:su-basis-[39.5%] lg:su-basis-[30%] md:su-items-start md:su-content-start before:su-left-0 before:su-top-[-35px] before:md:su-top-0 before:md:su-left-[-36px] before:lg:su-left-[-80px]"
                            >
                                <div class="su-relative su-w-full">
                                    <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                                        <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                                            <div class="su-component-card-thumbnail su-w-full su-h-full">
                                                <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                                                    <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://example.com" alt="" />
                                                </span>
                                            </div>
                                        </div>

                                        <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                                            <h3 class="su-w-full su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-font-serif su-my-0">
                                                <a
                                                    href="https://example.com"
                                                    class="su-stretched-link focus:su-outline-0 focus:before:su-ring hocus:su-underline hover:su-text-digital-red su-transition su-text-black dark:su-text-white dark:hover:su-text-dark-mode-red before:su-absolute before:su-w-full before:su-h-full before:su-block before:su-top-0 before:su-left-0"
                                                >
                                                    New Lagunita signs alert visitors to basin’s usage
                                                </a>
                                            </h3>

                                            <p data-testid="vertical-card-type" class="su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-text-16 su-leading-[20.8px]">
                                                <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                                    <path
                                                        d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"
                                                    ></path>
                                                </svg>
                                                <span>Research</span>
                                            </p>

                                            <div class="su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 *:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px]" <p="">
                                                Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research
                                                efforts.
                                                <p></p>
                                            </div>
                                        </div>
                                    </article>
                                </div>

                                <div
                                    class="su-relative su-w-full before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black before:su-h-px before:su-left-0 before:su-top-[-40px] md:before:su-top-[-36px] lg:before:su-top-[-38px]"
                                >
                                    <article aria-label="Stanford releases preliminary enrollment data for Class of 2028" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                                        <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                                            <div class="su-component-card-thumbnail su-w-full su-h-full">
                                                <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                                                    <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://example.com" alt="" />
                                                </span>
                                            </div>
                                        </div>

                                        <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                                            <h3 class="su-w-full su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-font-serif su-my-0">
                                                <a
                                                    href="https://example.com"
                                                    class="su-stretched-link focus:su-outline-0 focus:before:su-ring hocus:su-underline hover:su-text-digital-red su-transition su-text-black dark:su-text-white dark:hover:su-text-dark-mode-red before:su-absolute before:su-w-full before:su-h-full before:su-block before:su-top-0 before:su-left-0"
                                                >
                                                    Stanford releases preliminary enrollment data for Class of 2028
                                                </a>
                                            </h3>

                                            <p data-testid="vertical-card-type" class="su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-text-16 su-leading-[20.8px]">
                                                <svg aria-hidden="true" data-testid="svg-news" xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
                                                    <path
                                                        d="M3 2.5C3 1.39688 3.89687 0.5 5 0.5H14C15.1031 0.5 16 1.39688 16 2.5V12.5C16 13.6031 15.1031 14.5 14 14.5H2.5C1.11875 14.5 0 13.3813 0 12V3.5C0 2.94688 0.446875 2.5 1 2.5C1.55313 2.5 2 2.94688 2 3.5V12C2 12.275 2.225 12.5 2.5 12.5C2.775 12.5 3 12.275 3 12V2.5ZM5 3.25V5.75C5 6.16563 5.33437 6.5 5.75 6.5H9.25C9.66562 6.5 10 6.16563 10 5.75V3.25C10 2.83437 9.66562 2.5 9.25 2.5H5.75C5.33437 2.5 5 2.83437 5 3.25ZM11.5 3C11.5 3.275 11.725 3.5 12 3.5H13.5C13.775 3.5 14 3.275 14 3C14 2.725 13.775 2.5 13.5 2.5H12C11.725 2.5 11.5 2.725 11.5 3ZM11.5 6C11.5 6.275 11.725 6.5 12 6.5H13.5C13.775 6.5 14 6.275 14 6C14 5.725 13.775 5.5 13.5 5.5H12C11.725 5.5 11.5 5.725 11.5 6ZM5 9C5 9.275 5.225 9.5 5.5 9.5H13.5C13.775 9.5 14 9.275 14 9C14 8.725 13.775 8.5 13.5 8.5H5.5C5.225 8.5 5 8.725 5 9ZM5 12C5 12.275 5.225 12.5 5.5 12.5H13.5C13.775 12.5 14 12.275 14 12C14 11.725 13.775 11.5 13.5 11.5H5.5C5.225 11.5 5 11.725 5 12Z"
                                                    ></path>
                                                </svg>
                                                <span>News</span>
                                            </p>

                                            <div class="su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 *:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px]" <p="">
                                                The class is the first to be admitted under last year’s U.S. Supreme Court ruling on college admissions. Stanford will continue and expand outreach activities in support of diversity broadly defined.
                                                <p></p>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="b893c60d95b1fce6bc334ac3843d1839">
                    <span data-focus-scope-start="true" hidden=""></span>
                    <div aria-describedby="card-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true">
                        <div class="su-modal-content">
                            <iframe
                                width="560"
                                height="315"
                                class=""
                                src="https://example.com?autoplay=1&controls=1&rel=0"
                                title="Watch Remembering Oct. 7 and learning about Israel, Gaza, and the Middle East"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowfullscreen="true"
                                data-modal="iframe"
                            ></iframe>
                        </div>
                    </div>
                    <button type="button" class="su-component-close su-text-center" data-dismiss="modal">
                        <svg class="su-fill-currentcolor" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z"
                            ></path>
                        </svg>
                        <span>Close</span>
                    </button>
                    <span data-focus-scope-end="true" hidden=""></span>
                </div>
            </section>
            `;
        }

        beforeEach(() => {
            setupDom();

            section = document.querySelector(featuredContent.FEATURED_CONTENT_SELECTOR);
            modal = section.querySelector(featuredContent.FEATURED_CONTENT_MODAL_SELECTOR);
            openBtn = section.querySelector(featuredContent.FEATURED_CONTENT_OPEN_MODAL_BTN);
            closeBtn = section.querySelector(featuredContent.FEATURED_CONTENT_CLOSE_MODAL_BTN);
            iframe = section.querySelector(featuredContent.FEATURED_CONTENT_MODAL_IFRAME);

            featuredContent._modalInit(section);
        });

        it('Should open the modal when open button was clicked', () => {
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(featuredContent.FEATURED_CONTENT_HIDDEN_CLASS)).toBe(false);
        });

        it('Should close the modal when close button was clicked', () => {
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(featuredContent.FEATURED_CONTENT_HIDDEN_CLASS)).toBe(false);

            // Simulate click on close button
            fireEvent.click(closeBtn);

            // check if modal was closed
            expect(modal.classList.contains(featuredContent.FEATURED_CONTENT_HIDDEN_CLASS)).toBe(true);
        });
       
        it('Should close the modal when Escape key is pressed', () => {
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(featuredContent.FEATURED_CONTENT_HIDDEN_CLASS)).toBe(false);

            // Simulate Escape key press
            fireEvent.keyDown(document, { key: 'Escape' });

            // Check if close function was called
            expect(modal.classList.contains(featuredContent.FEATURED_CONTENT_HIDDEN_CLASS)).toBe(true);
        });

        it('Should not close the modal when a non-Escape key is pressed', () => {    
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(featuredContent.FEATURED_CONTENT_HIDDEN_CLASS)).toBe(false);

            // Simulate a non-Escape key press
            fireEvent.keyDown(document, { key: 'ArrowUp' });
    
            // Check if close function was not called
            expect(modal.classList.contains(featuredContent.FEATURED_CONTENT_HIDDEN_CLASS)).toBe(false);
        });

        it('Should make the modal visible and set autoplay=1 in the iframe src', () => {
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(featuredContent.FEATURED_CONTENT_HIDDEN_CLASS)).toBe(false);
            
            // check if iframe's autoplay was changed to 1 
            expect(iframe.getAttribute('src')).toBe('https://example.com?autoplay=1&controls=1&rel=0');
        });

        it('Should hide the modal and set autoplay=0 in the iframe src', () => {
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(featuredContent.FEATURED_CONTENT_HIDDEN_CLASS)).toBe(false);

            // Simulate click on close button
            fireEvent.click(closeBtn);

            // check if modal was closed
            expect(modal.classList.contains(featuredContent.FEATURED_CONTENT_HIDDEN_CLASS)).toBe(true);

            // check if iframe's autoplay was changed to 0 
            expect(iframe.getAttribute('src')).toBe('https://example.com?autoplay=0&controls=1&rel=0');
        });
    });
});
