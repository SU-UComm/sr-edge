/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';
import * as imageGallery from './scripts';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

jest.mock('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs', () => jest.fn().mockImplementation(() => ({
    init: jest.fn(),
    destroy: jest.fn(),
})));

const mockedError = jest.fn();
console.error = mockedError;

describe('[Image Gallery Modal][Client]', () => {
    describe('[Image Modal toggling functionality]', () => {
        let section, toggleBtn, closeBtn, modal;
    
        const setupGalleryDOM = () => {
            document.body.innerHTML = `>                
                <header class="report-header--story report-header su-pb-[11rem] md:su-pb-[17.7rem] lg:su-pb-[19.3rem] su-bg-black">
                    <div class="su-bg-digital-red su-fixed su-z-10" style="height: 100px; width: 100%">
                        <button id="toggle" class="su-p-7 su-border-2 su-text-white su-border-white dark:su-border-black-true dark:su-text-black-true">
                            Dark/Light Mode Toggle
                        </button>
                    </div>
                </header>
                <section class="" data-component="image-gallery-modal">
                    <div class="su-mx-auto su-component-container su-container-wide su-container-px    ">
                        <div class="su-w-[100%] md:su-max-w-[60.7rem] lg:su-max-w-[63.6rem] su-mx-auto">
                            <div class="su-text-center [&amp;>*]:su-justify-center [&amp;>*]:su-rs-mb-0 su-flex su-flex-col su-gap-[2.1rem] md:su-gap-[2.5rem]">
                                <h2 class="su-component-sidebar-heading su-w-full su-flex su-flex-wrap su-gap-6 su-my-0 su-font-sans su-text-black-90 dark:su-text-black-20 su-font-semibold su-text-18 su-items-center">
                                    <span data-test="icon" class="dark:su-hidden">
                                        <svg data-testid="svg-mediagallery-light" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="28" height="23" viewBox="0 0 28 23" fill="none">
                                            <path d="M11.25 0.5H25C26.5168 0.5 27.75 1.7332 27.75 3.25V12.875C27.75 14.3918 26.5168 15.625 25 15.625H11.25C9.7332 15.625 8.5 14.3918 8.5 12.875V3.25C8.5 1.7332 9.7332 0.5 11.25 0.5ZM20.7031 5.08477C20.5098 4.79688 20.1875 4.625 19.8438 4.625C19.5 4.625 19.1777 4.79688 18.9844 5.08477L16.5781 8.69414L15.8348 7.76172C15.6371 7.5168 15.3406 7.375 15.0312 7.375C14.7219 7.375 14.4211 7.5168 14.2277 7.76172L11.4777 11.1992C11.2285 11.5086 11.1812 11.934 11.3531 12.2906C11.525 12.6473 11.8859 12.875 12.2812 12.875H15.7188H17.7812H23.9688C24.3512 12.875 24.6992 12.6645 24.8797 12.3293C25.0602 11.9941 25.0387 11.5859 24.8281 11.2723L20.7031 5.08477ZM14.6875 4.625C14.6875 4.26033 14.5426 3.91059 14.2848 3.65273C14.0269 3.39487 13.6772 3.25 13.3125 3.25C12.9478 3.25 12.5981 3.39487 12.3402 3.65273C12.0824 3.91059 11.9375 4.26033 11.9375 4.625C11.9375 4.98967 12.0824 5.33941 12.3402 5.59727C12.5981 5.85513 12.9478 6 13.3125 6C13.6772 6 14.0269 5.85513 14.2848 5.59727C14.5426 5.33941 14.6875 4.98967 14.6875 4.625ZM3 6H7.125V17V18.375C7.125 19.1355 7.73945 19.75 8.5 19.75H14C14.7605 19.75 15.375 19.1355 15.375 18.375V17H22.25V19.75C22.25 21.2668 21.0168 22.5 19.5 22.5H3C1.4832 22.5 0.25 21.2668 0.25 19.75V8.75C0.25 7.2332 1.4832 6 3 6ZM3.34375 8.75C2.96563 8.75 2.65625 9.05937 2.65625 9.4375V10.125C2.65625 10.5031 2.96563 10.8125 3.34375 10.8125H4.03125C4.40938 10.8125 4.71875 10.5031 4.71875 10.125V9.4375C4.71875 9.05937 4.40938 8.75 4.03125 8.75H3.34375ZM3.34375 13.2188C2.96563 13.2188 2.65625 13.5281 2.65625 13.9062V14.5938C2.65625 14.9719 2.96563 15.2812 3.34375 15.2812H4.03125C4.40938 15.2812 4.71875 14.9719 4.71875 14.5938V13.9062C4.71875 13.5281 4.40938 13.2188 4.03125 13.2188H3.34375ZM3.34375 17.6875C2.96563 17.6875 2.65625 17.9969 2.65625 18.375V19.0625C2.65625 19.4406 2.96563 19.75 3.34375 19.75H4.03125C4.40938 19.75 4.71875 19.4406 4.71875 19.0625V18.375C4.71875 17.9969 4.40938 17.6875 4.03125 17.6875H3.34375ZM17.7812 18.375V19.0625C17.7812 19.4406 18.0906 19.75 18.4688 19.75H19.1562C19.5344 19.75 19.8438 19.4406 19.8438 19.0625V18.375C19.8438 17.9969 19.5344 17.6875 19.1562 17.6875H18.4688C18.0906 17.6875 17.7812 17.9969 17.7812 18.375Z" fill="url(#mediagallery_light_gradient)"></path>
                                            <defs>
                                                <linearGradient id="mediagallery_light_gradient" x1="27.75" y1="0.5" x2="13.5669" y2="11.0113" gradientUnits="userSpaceOnUse">
                                                    <stop stop-color="#E50808"></stop>
                                                    <stop offset="1" stop-color="#820000"></stop>
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span data-test="icon" class="su-hidden dark:su-block">
                                        <svg data-testid="svg-mediagallery-dark" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="28" height="23" viewBox="0 0 28 23" fill="none">
                                            <path d="M11.25 0.5H25C26.5168 0.5 27.75 1.7332 27.75 3.25V12.875C27.75 14.3918 26.5168 15.625 25 15.625H11.25C9.7332 15.625 8.5 14.3918 8.5 12.875V3.25C8.5 1.7332 9.7332 0.5 11.25 0.5ZM20.7031 5.08477C20.5098 4.79688 20.1875 4.625 19.8438 4.625C19.5 4.625 19.1777 4.79688 18.9844 5.08477L16.5781 8.69414L15.8348 7.76172C15.6371 7.5168 15.3406 7.375 15.0312 7.375C14.7219 7.375 14.4211 7.5168 14.2277 7.76172L11.4777 11.1992C11.2285 11.5086 11.1812 11.934 11.3531 12.2906C11.525 12.6473 11.8859 12.875 12.2812 12.875H15.7188H17.7812H23.9688C24.3512 12.875 24.6992 12.6645 24.8797 12.3293C25.0602 11.9941 25.0387 11.5859 24.8281 11.2723L20.7031 5.08477ZM14.6875 4.625C14.6875 4.26033 14.5426 3.91059 14.2848 3.65273C14.0269 3.39487 13.6772 3.25 13.3125 3.25C12.9478 3.25 12.5981 3.39487 12.3402 3.65273C12.0824 3.91059 11.9375 4.26033 11.9375 4.625C11.9375 4.98967 12.0824 5.33941 12.3402 5.59727C12.5981 5.85513 12.9478 6 13.3125 6C13.6772 6 14.0269 5.85513 14.2848 5.59727C14.5426 5.33941 14.6875 4.98967 14.6875 4.625ZM3 6H7.125V17V18.375C7.125 19.1355 7.73945 19.75 8.5 19.75H14C14.7605 19.75 15.375 19.1355 15.375 18.375V17H22.25V19.75C22.25 21.2668 21.0168 22.5 19.5 22.5H3C1.4832 22.5 0.25 21.2668 0.25 19.75V8.75C0.25 7.2332 1.4832 6 3 6ZM3.34375 8.75C2.96563 8.75 2.65625 9.05937 2.65625 9.4375V10.125C2.65625 10.5031 2.96563 10.8125 3.34375 10.8125H4.03125C4.40938 10.8125 4.71875 10.5031 4.71875 10.125V9.4375C4.71875 9.05937 4.40938 8.75 4.03125 8.75H3.34375ZM3.34375 13.2188C2.96563 13.2188 2.65625 13.5281 2.65625 13.9062V14.5938C2.65625 14.9719 2.96563 15.2812 3.34375 15.2812H4.03125C4.40938 15.2812 4.71875 14.9719 4.71875 14.5938V13.9062C4.71875 13.5281 4.40938 13.2188 4.03125 13.2188H3.34375ZM3.34375 17.6875C2.96563 17.6875 2.65625 17.9969 2.65625 18.375V19.0625C2.65625 19.4406 2.96563 19.75 3.34375 19.75H4.03125C4.40938 19.75 4.71875 19.4406 4.71875 19.0625V18.375C4.71875 17.9969 4.40938 17.6875 4.03125 17.6875H3.34375ZM17.7812 18.375V19.0625C17.7812 19.4406 18.0906 19.75 18.4688 19.75H19.1562C19.5344 19.75 19.8438 19.4406 19.8438 19.0625V18.375C19.8438 17.9969 19.5344 17.6875 19.1562 17.6875H18.4688C18.0906 17.6875 17.7812 17.9969 17.7812 18.375Z" fill="url(#mediagallery_dark_gradient)"></path>
                                            <defs>
                                                <linearGradient id="mediagallery_dark_gradient" x1="27.75" y1="0.5" x2="13.5669" y2="11.0113" gradientUnits="userSpaceOnUse">
                                                    <stop stop-color="#8F993E"></stop>
                                                    <stop offset="1" stop-color="#279989"></stop>
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span>Media gallery</span>
                                </h2>
                                <h2 class="su-text-[3.5rem] su-leading-[4.179rem] su-font-bold md:su-text-[4.0rem] md:su-leading-[4.776rem] lg:su-text-[4.9rem] lg:su-leading-[6.37rem]">
                                    Custom content
                                </h2>
                            </div>
                            <div class="su-wysiwyg-content su-rs-mt-0 su-text-[1.8rem] su-leading-[2.25rem] su-mt-[1.5rem] md:su-text-[1.9rem] md:su-leading-[2.375rem] md:su-mt-[1.9rem] lg:su-text-[2.1rem] lg:su-leading-[2.625rem]">
                                <p>Custom summary</p>
                            </div>
                        </div>
                        <button data-click="open-gallery-modal" title="Open image gallery" aria-label="Open image gallery" class="su-grid su-grid-cols-2 su-mx-auto su-grid-rows-2 su-max-w-[1312px] su-gap-x-[0.691rem] su-gap-y-[0.572rem] su-mt-[3.2rem] su-pb-[1rem] md:su-mt-[4.8rem] md:su-gap-x-[1.448rem] md:su-gap-y-[1.199rem] lg:su-gap-x-[2.589rem] lg:su-gap-y-[2.143rem]">
                            <article class="su-horizontal-image-first  su-relative">
                                <img src="https://example.com/image.jpg" alt="" class="su-w-full su-h-full su-object-cover">
                            </article>
                            <article class="su-horizontal-image-second  su-relative">
                                <img src="https://example.com/image.jpg" alt="Code on computer screen." class="su-w-full su-h-full su-object-cover">    
                            </article>
                            <article class="su-horizontal-image-third  su-relative">
                                <img src="https://example.com/image.jpg" alt="" class="su-w-full su-h-full su-object-cover">
                            </article>
                        </button>
                        <div class="su-text-[1.5rem] su-w-full su-text-center dark:su-text-white md:su-max-w-[482px] lg:su-max-w-[633px] su-mx-auto">
                            <p class="su-m-0 su-text-left">Custom caption</p>
                        </div>            
                    </div>
                    <div data-overlay-container="true" class="su-modal su-hidden" data-modal="modal">
                        <span data-focus-scope-start="true" hidden=""></span>
                        <div aria-describedby="image-gallery-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true">
                            <div class="su-modal-content">
                                <div class="component-slider su-slider-dark">
                                    <div class="swiper swiper-pointer-events component-slider-imagegallery">
                                        <div class="swiper-wrapper" id="swiper-wrapper-c7b10711696a310bae" aria-live="polite">
                                            <div class="swiper-slide" lazy="true" role="group" aria-label="1 / 20">
                                                <article class="c-carousel-image-slide has-caption">
                                                    <div class="c-carousel-image">
                                                        <img src="https://example.com/image.jpg" alt="" loading="lazy">
                                                    </div>
                                                    <div class="c-carousel-caption">
                                                        <p>Graduating seniors participate in the Wacky Walk, an annual Stanford Commencement tradition. | Andrew Brodhead</p>
                                                    </div>
                                                </article>
                                            </div>
                                            <div class="swiper-slide" lazy="true" role="group" aria-label="2 / 20">
                                                <article class="c-carousel-image-slide has-caption">
                                                    <div class="c-carousel-image">
                                                        <img src="https://example.com/image.jpg" alt="Code on computer screen." loading="lazy">
                                                    </div>
                                                    <div class="c-carousel-caption">
                                                        <p>Graduating seniors participate in the Wacky Walk, an annual Stanford Commencement tradition. | Andrew Brodhead</p>
                                                    </div>
                                                </article>
                                            </div>
                                            <div class="swiper-slide" lazy="true" role="group" aria-label="3 / 20">
                                                <article class="c-carousel-image-slide has-caption">
                                                    <div class="c-carousel-image">
                                                        <img src="https://example.com/image.jpg" alt="" loading="lazy">
                                                    </div>
                                                    <div class="c-carousel-caption">
                                                        <p>Graduating seniors participate in the Wacky Walk, an annual Stanford Commencement tradition. | Andrew Brodhead</p>
                                                    </div>
                                                </article>
                                            </div>
                                        </div>
                                    </div>
                                <div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center">
                                    <div aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination- su-mr-full">
                                        <button class="swiper-pagination-bullet" tabindex="0"><span class="sr-only">Slide 1</span></button>
                                        <button class="swiper-pagination-bullet" tabindex="0"><span class="sr-only">Slide 2</span></button>
                                        <button class="swiper-pagination-bullet" tabindex="0"><span class="sr-only">Slide 3</span></button>
                                    </div>
                                        <button class="component-slider-btn component-slider-prev" type="button" tabindex="0" aria-label="Previous slide" aria-controls="swiper-wrapper-c7b10711696a310bae">
                                            <span class="sr-only">Previous</span>
                                            <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                                                <svg class="su-fill-transparent su-stroke-current" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="">
                                                    <path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                                </svg>
                                            </span>
                                        </button>
                                        <button class="component-slider-btn component-slider-next" type="button" tabindex="0" aria-label="Next slide" aria-controls="swiper-wrapper-c7b10711696a310bae">
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
                        </div>
                        <button type="button" class="su-component-close su-text-center" data-dismiss="modal">
                            <svg class="su-fill-currentcolor" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z"></path>
                            </svg>
                            <span>Close</span>
                        </button>
                        <span data-focus-scope-end="true" hidden=""></span>
                    </div>
                </section>
            `;
        };
    
        beforeEach(() => {
            jest.clearAllMocks();
            document.body.innerHTML = '';
            setupGalleryDOM();

            section = document.querySelector(imageGallery.IMAGE_GALLERY_SELECTOR);
            toggleBtn = section.querySelector(imageGallery.IMAGE_GALLERY_BTN);
            closeBtn = section.querySelector(imageGallery.IMAGE_GALLERY_CLOSE_BTN);
            modal = section.querySelector(imageGallery.IMAGE_GALLERY_MODAL);

            // Call the function to set up all event listeners
            imageGallery._modalInit(section);

            // Simulate clicking the toggle button
            fireEvent.click(toggleBtn);
        });

        it('Should initialize', () => {
            // Spy on the updateButtonLabel function
            const _initSpy = jest.spyOn(imageGallery, '_modalInit');

            // Simulate DOMContentLoaded event
            const event = new Event('DOMContentLoaded');
            document.dispatchEvent(event);

            document.querySelectorAll(imageGallery.IMAGE_GALLERY_SELECTOR).forEach(section => {
                // Call the function to set up all event listeners
                imageGallery._modalInit(section);
            });

            // Check if the spy was called
            expect(_initSpy).toHaveBeenCalled();

            // Restore the original function after test
            _initSpy.mockRestore(); 
        });

        it('Should close the modal when clicking close button', () => {
            // Simulate clicking the close button
            fireEvent.click(closeBtn);

            // Check if modal is closed
            expect(modal.classList.contains(imageGallery.IMAGE_GALLERY_HIDDEN_CLASS)).toBe(true);
        });

        it('Should close the modal when Escape key is pressed', () => {
            // Simulate Escape key press
            fireEvent.keyDown(document, { key: 'Escape' });

            // Check if close function was called
            expect(modal.classList.contains(imageGallery.IMAGE_GALLERY_HIDDEN_CLASS)).toBe(true);
        });

        it('Should not close the modal when a non-Escape key is pressed', () => {    
            // Simulate a non-Escape key press
            fireEvent.keyDown(document, { key: 'ArrowUp' });
    
            // Check if close function was not called
            expect(modal.classList.contains(imageGallery.IMAGE_GALLERY_HIDDEN_CLASS)).toBe(false);
        });

        it('Should initialize Swiper with the correct configuration', () => {
            imageGallery._modalInit(section);
    
            // Ensure Swiper was called
            expect(Swiper).toHaveBeenCalledWith('section[data-component="image-gallery-modal"] .swiper', expect.objectContaining({
                a11y: {
                    nextSlideMessage: "Next slide",
                    prevSlideMessage: "Previous slide"
                },
                breakpoints: {
                    0: expect.any(Object),
                    768: expect.any(Object),
                    992: expect.any(Object),
                },
                keyboard : {
                    enabled : true,
                    onlyInViewport : true
                },
                loop : true,
                navigation : {
                    nextEl : ".component-slider-next",
                    prevEl : ".component-slider-prev"
                },
                pagination: expect.objectContaining({
                    el: `.component-slider-pagination-`,
                    clickable: true,
                    bulletElement: "button",
                    renderBullet: expect.any(Function),
                }),
                slidesPerView : 1,
                variantClassName : "component-slider-imagegallery",
                watchSlidesProgress : true
            }));
        });

        it('Should render bullets correctly using renderBullet function', () => {
            imageGallery._modalInit(section);
    
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
});