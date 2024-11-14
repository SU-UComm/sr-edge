/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';
import * as storiesCarousel from './scripts';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

jest.mock('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs', () => jest.fn().mockImplementation(() => ({
    init: jest.fn(),
    destroy: jest.fn(),
})));

describe('[Stories Carousel][Client]', () => {
    let section, modal, openBtn, closeBtn, iframe;

    beforeEach(() => {
        // Setup DOM structure
        modal = document.createElement('div');
        iframe = document.createElement('iframe');
        iframe.setAttribute('src', 'https://example.com?autoplay=0');
        modal.appendChild(iframe);
        modal.classList.add(storiesCarousel.STORIES_CAROUSEL_HIDDEN_CLASS);

        document.body.appendChild(modal);
    });

    afterEach(() => {
        document.body.innerHTML = ''; // Clear DOM
        jest.clearAllMocks();
    });

    describe('[DOMContentLoaded]', () => {
        it('Should call _carouselInit and _modalInit for each carousel section', () => {
            const section = document.createElement('section');
            section.setAttribute('data-component', 'stories-carousel');
            document.body.appendChild(section);

            const _carouselInitSpy = jest.spyOn(storiesCarousel, '_carouselInit');
            const _modalInitSpy = jest.spyOn(storiesCarousel, '_modalInit');

             // Simulate DOMContentLoaded event
             const event = new Event('DOMContentLoaded');
             document.dispatchEvent(event);


             document.querySelectorAll(storiesCarousel.STORIES_CAROUSEL_SELECTOR).forEach(section => {
                // Call the function to set up all event listeners
                storiesCarousel._carouselInit(section);
                storiesCarousel._modalInit(section);
            });

            // Check if the spy was called
            expect(_carouselInitSpy).toHaveBeenCalledWith(section);
            expect(_modalInitSpy).toHaveBeenCalledWith(section);

            // Restore the original function after test
            _carouselInitSpy.mockRestore(); 
            _modalInitSpy.mockRestore(); 
        });
    });

    describe('[Carousel functionality]', () => {
        let section;

        beforeEach(() => {
            section = document.createElement('section');
            section.setAttribute('data-unique-id', 'testId');
            document.body.appendChild(section);
        });

        it('Should initialize Swiper with the correct configuration', () => {
            storiesCarousel._carouselInit(section);

            expect(Swiper).toHaveBeenCalledWith('section[data-component="stories-carousel"] .swiper', expect.objectContaining({
                breakpoints: {
                    0: expect.any(Object),
                    768: expect.any(Object),
                    992: expect.any(Object),
                },
                pagination: expect.objectContaining({
                    el: `.component-slider-pagination-testId`,
                    clickable: true,
                    bulletElement: "button",
                    renderBullet: expect.any(Function),
                }),
            }));
        });

        it('Should initialize Swiper with the correct configuration', () => {
            storiesCarousel._carouselInit(section);
    
            // Ensure Swiper was called
            expect(Swiper).toHaveBeenCalledWith('section[data-component="stories-carousel"] .swiper', expect.objectContaining({
                breakpoints: {
                    0: expect.any(Object),
                    768: expect.any(Object),
                    992: expect.any(Object),
                },
                pagination: expect.objectContaining({
                    el: `.component-slider-pagination-testId`,
                    clickable: true,
                    bulletElement: "button",
                    renderBullet: expect.any(Function),
                }),
            }));
        });
    
        it('Should render bullets correctly using renderBullet function', () => {
            storiesCarousel._carouselInit(section);
    
            // Retrieve the configuration object that Swiper was called with
            const swiperConfig = Swiper.mock.calls[0][1];
            const renderBullet = swiperConfig.pagination.renderBullet;
    
            // Test renderBullet with different indices
            const bulletFirst = renderBullet(0, 'swiper-pagination-bullet');
            const bulletSecond = renderBullet(1, 'swiper-pagination-bullet');
    
            expect(bulletFirst).toBe('<button aria-current="true" class="swiper-pagination-bullet"><span class="sr-only">Slide 1</span></button>');
            expect(bulletSecond).toBe('<button  class="swiper-pagination-bullet"><span class="sr-only">Slide 2</span></button>');
        });
    });

    describe('[Modal functionality]', () => {
        const setupDom = () => {
            document.body.innerHTML = `
            <section data-component="stories-carousel" data-unique-id="7f6b9262253c138ddbb3dff687a3ca13">
                <div class="su-mx-auto su-component-container su-container-large su-container-px">
                    <div class="su-component-line-heading su-flex su-flex-wrap su-items-baseline su-gap-5 su-gap-x-13 md:su-gap-13">
                        <h2 class="su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white su-text-black">
                            Read next
                        </h2>
                        <hr aria-hidden="true" class="md:su-mb-11 lg:su-mb-15 su-grow su-border-none su-bg-gradient-light-red-h su-h-4" />
                        <a
                            data-test="cta"
                            href="https://example.com"
                            class="su-group su-flex su-no-underline hocus:su-underline su-transition su-items-center md:su-items-end md:su-mb-8 lg:su-mb-12 su-flex-nowrap su-align-baseline su-gap-20 md:su-gap-13 su-text-19 su-decoration-2 dark:su-text-white su-text-black hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red"
                        >
                            <span class="su-flex su-gap-2 su-items-baseline">
                                <span> View all <span class="sr-only">Read next</span> </span>
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
                    <div class="component-slider">
                        <div class="swiper component-slider-cards component-slider-peek swiper-initialized swiper-horizontal swiper-backface-hidden">
                            <div class="swiper-wrapper" id="swiper-wrapper-e5252b105f485bb8b" aria-live="polite" style="transition-duration: 0ms; transform: translate3d(-1188px, 0px, 0px); transition-delay: 0ms;">
                                <div class="swiper-slide swiper-slide-next" style="width: 294px; margin-right: 102px;" role="group" aria-label="5 / 6" data-swiper-slide-index="4">
                                    <article aria-label="Immersive technology calms kids’ fears at local vaccine clinic" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                                        <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                                            <button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="571724c242adef5b63603accf16fb211">
                                                <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                                                    <img
                                                        class="su-absolute su-object-cover su-object-center su-size-full"
                                                        src="https://example.com/image.jpg"
                                                        alt="Open video Image of a young child distracting himself with a VR experience while getting a vaccine. in a modal"
                                                    />
                                                    <span class="*:su-w-[40px] su-absolute su-leading-none su-left-13 su-bottom-13 [&amp;>svg]:su-text-[4rem]">
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
                                        <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                                            <h2 class="su-w-full su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-font-serif su-my-0 su-order-2">
                                                <a
                                                    href="https://example.com"
                                                    class="su-stretched-link focus:su-outline-0 focus:before:su-ring hocus:su-underline hover:su-text-digital-red su-transition su-text-black dark:su-text-white dark:hover:su-text-dark-mode-red before:su-absolute before:su-w-full before:su-h-full before:su-block before:su-top-0 before:su-left-0"
                                                >
                                                    Immersive technology calms kids’ fears at local vaccine clinic
                                                    <svg
                                                        aria-hidden="true"
                                                        focusable="false"
                                                        data-prefix="fas"
                                                        data-icon="arrow-up-right-from-square"
                                                        class="svg-inline--fa fa-arrow-up-right-from-square su-inline-block su-h-auto su-align-middle su-ml-5 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform"
                                                        role="img"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 512 512"
                                                    >
                                                        <path
                                                            fill="currentColor"
                                                            d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"
                                                        ></path>
                                                    </svg>
                                                </a>
                                            </h2>
                                            <span data-testid="vertical-card-taxonomy" class="su-relative su-inline-block su-z-10 su-mb-13 su-font-semibold su-text-18 su-leading-[23.4px] su-order-1">
                                                <a href="https://example.com" class="su-text-digital-red dark:su-text-dark-mode-red su-no-underline hocus:su-underline hocus:su-text-black hocus:dark:su-text-white focus:su-outline-0 focus:su-ring">
                                                    Community &amp; Culture
                                                </a>
                                            </span>
                                            <p data-testid="vertical-card-type" class="su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-text-16 su-leading-[20.8px] su-order-3">
                                                <svg aria-hidden="true" data-testid="svg-video" xmlns="http://www.w3.org/2000/svg" width="18" height="13" viewBox="0 0 18 13" fill="none">
                                                    <path
                                                        d="M0 2.5C0 1.39688 0.896875 0.5 2 0.5H10C11.1031 0.5 12 1.39688 12 2.5V10.5C12 11.6031 11.1031 12.5 10 12.5H2C0.896875 12.5 0 11.6031 0 10.5V2.5ZM17.4719 1.61875C17.7969 1.79375 18 2.13125 18 2.5V10.5C18 10.8687 17.7969 11.2063 17.4719 11.3813C17.1469 11.5563 16.7531 11.5375 16.4438 11.3313L13.4438 9.33125L13 9.03438V8.5V4.5V3.96562L13.4438 3.66875L16.4438 1.66875C16.75 1.46563 17.1437 1.44375 17.4719 1.61875Z"
                                                    ></path>
                                                </svg>
                                                <span>Video</span>
                                            </p>
                                        </div>
                                    </article>
                                </div>
                            </div>
                            <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
                        </div>
                        <div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center">
                            <div
                                aria-label="Slide Navigation"
                                class="component-slider-pagination component-slider-pagination-7f6b9262253c138ddbb3dff687a3ca13 su-mr-full swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal"
                            >
                                <button class="swiper-pagination-bullet swiper-pagination-bullet-active" tabindex="0" aria-current="true"><span class="sr-only">Slide 1</span></button>
                                <button class="swiper-pagination-bullet" tabindex="0"><span class="sr-only">Slide 2</span></button>
                            </div>
                            <button class="component-slider-btn component-slider-prev" type="button" tabindex="0" aria-label="Previous slide" aria-controls="swiper-wrapper-e5252b105f485bb8b">
                                <span class="sr-only">Previous</span>
                                <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                                    <svg class="su-fill-transparent su-stroke-current" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="">
                                        <path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </span>
                            </button>
                            <button class="component-slider-btn component-slider-next" type="button" tabindex="0" aria-label="Next slide" aria-controls="swiper-wrapper-e5252b105f485bb8b">
                                <span class="sr-only">Next</span>
                                <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                                    <svg class="su-fill-transparent su-stroke-current" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="">
                                        <path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                <div data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="571724c242adef5b63603accf16fb211">
                    <span data-focus-scope-start="true" hidden=""></span>
                    <div aria-describedby="card-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true">
                        <div class="su-modal-content">
                            <iframe
                                width="560"
                                height="315"
                                class=""
                                src="https://example.com?autoplay=0&controls=1&rel=0"
                                title="Watch Immersive technology calms kids’ fears at local vaccine clinic"
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

            section = document.querySelector(storiesCarousel.STORIES_CAROUSEL_SELECTOR);
            modal = section.querySelector(storiesCarousel.STORIES_CAROUSEL_MODAL_SELECTOR);
            openBtn = section.querySelector(storiesCarousel.STORIES_CAROUSEL_OPEN_MODAL_BTN);
            closeBtn = section.querySelector(storiesCarousel.STORIES_CAROUSEL_CLOSE_MODAL_BTN);
            iframe = section.querySelector(storiesCarousel.STORIES_CAROUSEL_MODAL_IFRAME);

            storiesCarousel._modalInit(section);
        });

        it('Should open the modal when open button was clicked', () => {
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(storiesCarousel.STORIES_CAROUSEL_HIDDEN_CLASS)).toBe(false);
        });

        it('Should close the modal when close button was clicked', () => {
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(storiesCarousel.STORIES_CAROUSEL_HIDDEN_CLASS)).toBe(false);

            // Simulate click on close button
            fireEvent.click(closeBtn);

            // check if modal was closed
            expect(modal.classList.contains(storiesCarousel.STORIES_CAROUSEL_HIDDEN_CLASS)).toBe(true);
        });
       
        it('Should close the modal when Escape key is pressed', () => {
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(storiesCarousel.STORIES_CAROUSEL_HIDDEN_CLASS)).toBe(false);

            // Simulate Escape key press
            fireEvent.keyDown(document, { key: 'Escape' });

            // Check if close function was called
            expect(modal.classList.contains(storiesCarousel.STORIES_CAROUSEL_HIDDEN_CLASS)).toBe(true);
        });

        it('Should not close the modal when a non-Escape key is pressed', () => {    
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(storiesCarousel.STORIES_CAROUSEL_HIDDEN_CLASS)).toBe(false);

            // Simulate a non-Escape key press
            fireEvent.keyDown(document, { key: 'ArrowUp' });
    
            // Check if close function was not called
            expect(modal.classList.contains(storiesCarousel.STORIES_CAROUSEL_HIDDEN_CLASS)).toBe(false);
        });

        it('Should make the modal visible and set autoplay=1 in the iframe src', () => {
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(storiesCarousel.STORIES_CAROUSEL_HIDDEN_CLASS)).toBe(false);
            
            // check if iframe's autoplay was changed to 1 
            expect(iframe.getAttribute('src')).toBe('https://example.com?autoplay=1&controls=1&rel=0');
        });

        it('Should hide the modal and set autoplay=0 in the iframe src', () => {
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(storiesCarousel.STORIES_CAROUSEL_HIDDEN_CLASS)).toBe(false);

            // Simulate click on close button
            fireEvent.click(closeBtn);

            // check if modal was closed
            expect(modal.classList.contains(storiesCarousel.STORIES_CAROUSEL_HIDDEN_CLASS)).toBe(true);

            // check if iframe's autoplay was changed to 0 
            expect(iframe.getAttribute('src')).toBe('https://example.com?autoplay=0&controls=1&rel=0');
        });
    });
});
