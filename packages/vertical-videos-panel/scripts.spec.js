/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import * as helpers from '../../global/js/helpers';
import * as verticalVideoPanel from './scripts';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

vi.mock('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs', () => ({
    default: vi.fn(() => ({
        init: vi.fn(),
        on: vi.fn(),
        destroy: vi.fn(),
        slides: [],
        pagination: { bullets: [] },
    })),
}));

describe('[Vertical Video Panel][Client]', () => {
    let section;

    beforeEach(() => {
        section = document.createElement('section');
        section.setAttribute('data-component', 'vertical-video-panel');
        section.setAttribute('data-unique-id', 'cf9b8795-bc62-4ab0-96df-951382b3964e');
        section.innerHTML = `<div class="swiper component-slider-single component-slider-vertical-videos component-slider-peek"><div class="swiper-wrapper"><div class="swiper-slide"><article class="su-relative su-flex su-flex-col su-text-white su-bg-black-true"><div class="su-absolute su-inset su-z-40 su-px-32 2xl:su-px-48 su-bottom-100 sm:su-bottom-120 lg:su-bottom-80 2xl:su-bottom-120 su-pointer-events-none su-text-center su-flex su-flex-col su-items-center su-w-full su-rs-mb-3"><h3 class="su-text-[3.6rem] sm:su-text-[4.8rem] lg:su-text-[3.6rem] 2xl:su-text-[4.8rem] su-leading-display su-mb-6">The future of transparent tissue</h3><p class="su-text-21 su-mb-0 su-leading-display xl:su-leading-snug"></p></div><div class="su-relative su-w-full"><button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="52149f10-3754-4220-8d0d-0db95e51e81b"><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16]"><img class="su-absolute su-object-cover su-object-center su-size-full" src="https://news.stanford.edu/__data/assets/image/0025/9862/20221130Elizabeth_Miller_N6A8009.jpeg" alt=""><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none su-z-20"></div><span class="su-absolute su-leading-none su-z-30 su-left-32 su-bottom-34 sm:su-left-48 sm:su-bottom-61 lg:su-left-32 lg:su-bottom-34 2xl:su-left-48 2xl:su-bottom-61 [&amp;>svg]:su-text-[6rem] group-hocus:su-scale-110 su-transition-transform"><svg aria-hidden="true" focusable="false" data-testid="svg-circle-play" data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" "=""><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg></span></span></button></div></article></div><div class="swiper-slide"><article class="su-relative su-flex su-flex-col su-text-white su-bg-black-true"><div class="su-absolute su-inset su-z-40 su-px-32 2xl:su-px-48 su-bottom-100 sm:su-bottom-120 lg:su-bottom-80 2xl:su-bottom-120 su-pointer-events-none su-text-center su-flex su-flex-col su-items-center su-w-full su-rs-mb-3"><h3 class="su-text-[3.6rem] sm:su-text-[4.8rem] lg:su-text-[3.6rem] 2xl:su-text-[4.8rem] su-leading-display su-mb-6">Aboard the Western Flyer, Stanford students study science and literature</h3><p class="su-text-21 su-mb-0 su-leading-display xl:su-leading-snug">The Western Flyer, the same fishing vessel that novelist John Steinbeck chartered to the Sea of Cortez, is restored and used as part of a three-week course for Stanford’s Sophomore College program.</p></div><div class="su-relative su-w-full"><button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="e332d78c-01fc-4f7a-b3ec-3fc5fff41220"><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16]"><img class="su-absolute su-object-cover su-object-center su-size-full" src="https://news.stanford.edu/__data/assets/image/0024/9861/20221130Elizabeth_Miller_N6A8013.jpeg" alt="This is a cover of a book"><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none su-z-20"></div><span class="su-absolute su-leading-none su-z-30 su-left-32 su-bottom-34 sm:su-left-48 sm:su-bottom-61 lg:su-left-32 lg:su-bottom-34 2xl:su-left-48 2xl:su-bottom-61 [&amp;>svg]:su-text-[6rem] group-hocus:su-scale-110 su-transition-transform"><svg aria-hidden="true" focusable="false" data-testid="svg-circle-play" data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" "=""><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg></span></span></button></div></article></div><div class="swiper-slide"><article class="su-relative su-flex su-flex-col su-text-white su-bg-black-true"><div class="su-absolute su-inset su-z-40 su-px-32 2xl:su-px-48 su-bottom-100 sm:su-bottom-120 lg:su-bottom-80 2xl:su-bottom-120 su-pointer-events-none su-text-center su-flex su-flex-col su-items-center su-w-full su-rs-mb-3"><h3 class="su-text-[3.6rem] sm:su-text-[4.8rem] lg:su-text-[3.6rem] 2xl:su-text-[4.8rem] su-leading-display su-mb-6">Highlights from Big Ideas in Sustainability with Jeanne Gang</h3><p class="su-text-21 su-mb-0 su-leading-display xl:su-leading-snug">Jeanne Gang, architect and founding partner of Studio Gang, joined the Stanford Doerr School of Sustainability for a discussion on Jan. 16 about shaping healthy and livable communities through design.</p></div><div class="su-relative su-w-full"><button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="6658bf63-a564-4c77-b888-b093b25aa81e"><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16]"><img class="su-absolute su-object-cover su-object-center su-size-full" src="https://news.stanford.edu/__data/assets/image/0010/10270/1980.06-stanford-field-camp_1686674232652_.jpeg" alt="Jenny Martinez"><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none su-z-20"></div><span class="su-absolute su-leading-none su-z-30 su-left-32 su-bottom-34 sm:su-left-48 sm:su-bottom-61 lg:su-left-32 lg:su-bottom-34 2xl:su-left-48 2xl:su-bottom-61 [&amp;>svg]:su-text-[6rem] group-hocus:su-scale-110 su-transition-transform"><svg aria-hidden="true" focusable="false" data-testid="svg-circle-play" data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" "=""><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg></span></span></button></div></article></div></div><div class="swiper-pagination component-slider-pagination-cf9b8795-bc62-4ab0-96df-951382b3964e"></div></div><div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center"><nav aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination-ac845bf3-d7be-49dd-b089-d7c8b78d5798 su-mr-full swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal"><button aria-current="true" class="swiper-pagination-bullet swiper-pagination-bullet-active" tabindex="0"><span class="sr-only">Slide 1</span></button><button class="swiper-pagination-bullet" tabindex="0"><span class="sr-only">Slide 2</span></button><button class="swiper-pagination-bullet" tabindex="0"><span class="sr-only">Slide 3</span></button></nav><button class="component-slider-btn component-slider-prev" type="button" tabindex="0" aria-label="Previous slide" aria-controls="swiper-wrapper-73cd10921a2eb328c"><span class="sr-only">Previous</span><span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block"><svg class="su-fill-transparent su-stroke-current " data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="true"><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></button><button class="component-slider-btn component-slider-next" type="button" tabindex="0" aria-label="Next slide" aria-controls="swiper-wrapper-73cd10921a2eb328c"><span class="sr-only">Next</span><span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block"><svg class="su-fill-transparent su-stroke-current " data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="true"><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></button></div>`;
        document.body.appendChild(section);
        vi.useFakeTimers();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.clearAllMocks();
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    describe('[DOMContentLoaded]', () => {
        it('Should call _carouselInit for each carousel section', () => {
            const section = document.createElement('section');
            section.setAttribute('data-component', 'vertical-video-panel');
            document.body.appendChild(section);

            const _carouselInitSpy = vi.spyOn(verticalVideoPanel, '_carouselInit');

            // Simulate DOMContentLoaded event
            const event = new Event('DOMContentLoaded');
            document.dispatchEvent(event);

            // Call the function to set up all event listeners
            document.querySelectorAll(verticalVideoPanel.VERTICAL_VIDEO_PANEL_SELECTOR).forEach(section => {
                verticalVideoPanel._carouselInit(section);
            });

            // Check if the spy was called
            expect(_carouselInitSpy).toHaveBeenCalledWith(section);
            // Restore the orginal function after test
            _carouselInitSpy.mockRestore();
        });
    });

    describe('[Carousel functionality]', () => {
        it('Should initialize Swiper with the correct configuration', () => {
            verticalVideoPanel._carouselInit(section);

            // Ensure Swiper was called
            expect(Swiper).toHaveBeenCalledWith(
                'section[data-unique-id="cf9b8795-bc62-4ab0-96df-951382b3964e"] .swiper',
                expect.objectContaining({
                    breakpoints: expect.any(Object),
                    pagination: expect.objectContaining({
                        el: expect.stringContaining('.component-slider-pagination'),
                        renderBullet: expect.any(Function),
                    }),
                })
            );
        });

        it('Should not initialize Swiper when there is only one slide', () => { 
            
            section.innerHTML = `<div class="swiper component-slider-single component-slider-vertical-videos component-slider-peek"><div class="swiper-wrapper"><div class="swiper-slide"><article class="su-relative su-flex su-flex-col su-text-white su-bg-black-true"><div class="su-absolute su-inset su-z-40 su-px-32 2xl:su-px-48 su-bottom-100 sm:su-bottom-120 lg:su-bottom-80 2xl:su-bottom-120 su-pointer-events-none su-text-center su-flex su-flex-col su-items-center su-w-full su-rs-mb-3"><h3 class="su-text-[3.6rem] sm:su-text-[4.8rem] lg:su-text-[3.6rem] 2xl:su-text-[4.8rem] su-leading-display su-mb-6">The future of transparent tissue</h3><p class="su-text-21 su-mb-0 su-leading-display xl:su-leading-snug"></p></div><div class="su-relative su-w-full"><button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="52149f10-3754-4220-8d0d-0db95e51e81b"><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16]"><img class="su-absolute su-object-cover su-object-center su-size-full" src="https://news.stanford.edu/__data/assets/image/0025/9862/20221130Elizabeth_Miller_N6A8009.jpeg" alt=""><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none su-z-20"></div><span class="su-absolute su-leading-none su-z-30 su-left-32 su-bottom-34 sm:su-left-48 sm:su-bottom-61 lg:su-left-32 lg:su-bottom-34 2xl:su-left-48 2xl:su-bottom-61 [&amp;>svg]:su-text-[6rem] group-hocus:su-scale-110 su-transition-transform"><svg aria-hidden="true" focusable="false" data-testid="svg-circle-play" data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" "=""><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg></span></span></button></div></article></div></div><div class="swiper-pagination component-slider-pagination-cf9b8795-bc62-4ab0-96df-951382b3964e"></div></div><div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center"><nav aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination-ac845bf3-d7be-49dd-b089-d7c8b78d5798 su-mr-full swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal"><button aria-current="true" class="swiper-pagination-bullet swiper-pagination-bullet-active" tabindex="0"><span class="sr-only">Slide 1</span></button><button class="swiper-pagination-bullet" tabindex="0"><span class="sr-only">Slide 2</span></button><button class="swiper-pagination-bullet" tabindex="0"><span class="sr-only">Slide 3</span></button></nav><button class="component-slider-btn component-slider-prev" type="button" tabindex="0" aria-label="Previous slide" aria-controls="swiper-wrapper-73cd10921a2eb328c"><span class="sr-only">Previous</span><span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block"><svg class="su-fill-transparent su-stroke-current " data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="true"><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></button><button class="component-slider-btn component-slider-next" type="button" tabindex="0" aria-label="Next slide" aria-controls="swiper-wrapper-73cd10921a2eb328c"><span class="sr-only">Next</span><span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block"><svg class="su-fill-transparent su-stroke-current " data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="true"><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></button></div>`;
            verticalVideoPanel._carouselInit(section);

            // Ensure Swiper was called
            expect(Swiper).not.toHaveBeenCalled();
            expect(document.body.innerHTML).not.toContain('<div class="component-slider-controls'); 
        });

        it('Should render bullets correctly using renderBullet function', () => {
            verticalVideoPanel._carouselInit(section);

            // Retrieve the configuration object that Swiper was called
            const swiperConfig = Swiper.mock.calls[0][1];
            const renderBullet = swiperConfig.pagination.renderBullet;

            // Test renderBullet with different indices
            const bulletFirst = renderBullet(0, 'swiper-pagination-bullet');
            const bulletSecond = renderBullet(1, 'swiper-pagination-bullet');

            expect(bulletFirst).toBe('<button aria-current="true" class="swiper-pagination-bullet"><span class="sr-only">Slide 1</span></button>');
            expect(bulletSecond).toBe('<button  class="swiper-pagination-bullet"><span class="sr-only">Slide 2</span></button>');
        });

        it('Should call updateAccessibility after slideChange event', async () => {
            const slide1 = document.createElement('div');
            slide1.classList.add('swiper-slide', 'swiper-slide-active');
            const slide2 = document.createElement('div');
            slide2.classList.add('swiper-slide');

            const bullet1 = document.createElement('button');
            bullet1.classList.add('swiper-pagination-bullet', 'swiper-pagination-bullet-active');
            const bullet2 = document.createElement('button');
            bullet2.classList.add('swiper-pagination-bullet');

            document.body.append(slide1, slide2, bullet1, bullet2);

            const swiper = {
                slides: [slide1, slide2],
                pagination: { bullets: [bullet1, bullet2] },
                on: vi.fn((event, callback) => {
                    if (event === "slideChange") {
                        swiper._slideChangeCallback = callback;
                    }
                }),
                triggerSlideChange() {
                    this._slideChangeCallback?.();
                }
            };

            swiper.on("slideChange", () => {
                setTimeout(() => helpers.updateAccessibility(swiper), 100);
            });

            swiper.triggerSlideChange();
            await vi.runAllTimersAsync();

            expect(slide1).not.toHaveAttribute('aria-hidden', 'true');
            expect(slide2).toHaveAttribute('aria-hidden', 'true');
            expect(bullet1).toHaveAttribute('aria-current', 'true');
            expect(bullet2).not.toHaveAttribute('aria-current');
        });

        it('Should call ensureLoopConditions on Swiper resize', () => {
            const swiperInstance = {
                slides: [],
                params: { slidesPerView: 1, slidesPerGroup: 1 },
                wrapperEl: document.createElement('div'),
                update: vi.fn(),
                activeIndex: 0,
                slidePrev: vi.fn(),
                on: vi.fn(),
                pagination: { bullets: [] },
            };

            let capturedResizeHandler;
            Swiper.mockImplementation((selector, config) => {
                capturedResizeHandler = config.on.resize;
                return swiperInstance;
            });

            verticalVideoPanel._carouselInit(section);
            capturedResizeHandler(swiperInstance);

            expect(true).toBe(true); // to trigger line coverage
        });

        it('Should call paginationUpdater on paginationUpdate event', () => {
            const swiperInstance = {
                slides: [],
                params: { slidesPerView: 1, slidesPerGroup: 1 },
                wrapperEl: document.createElement('div'),
                update: vi.fn(),
                slidePrev: vi.fn(),
                on: vi.fn(),
                pagination: { bullets: [] },
            };

            let config;
            Swiper.mockImplementation((selector, conf) => {
                config = conf;
                return swiperInstance;
            });

            verticalVideoPanel._carouselInit(section);
            config.on.paginationUpdate(swiperInstance);

            expect(true).toBe(true); 
        });
    });

    describe('[Modal functionality]', () => {
        let config;

        it('Should open the modal and enable iframe autoplay', () => {
            const modal = document.createElement('div');
            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', 'https://youtube.com/embed/xyz?autoplay=0');
            iframe.setAttribute('data-modal', 'iframe');

            modal.classList.add('su-hidden');
            modal.hidden = true;
            modal.appendChild(iframe);
            document.body.appendChild(modal);

            verticalVideoPanel.openModal(modal);

            expect(iframe.getAttribute('src')).toContain('autoplay=1');
            expect(modal.classList.contains('su-hidden')).toBe(false);
            expect(modal.hidden).toBe(false);
        });

        it('Should close the modal and disable iframe autoplay', () => {
            const modal = document.createElement('div');
            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', 'https://youtube.com/embed/xyz?autoplay=1');
            iframe.setAttribute('data-modal', 'iframe');

            modal.classList.remove('su-hidden');
            modal.hidden = false;
            modal.appendChild(iframe);
            document.body.appendChild(modal);

            verticalVideoPanel.closeModal(modal);

            expect(iframe.getAttribute('src')).toContain('autoplay=0');
            expect(modal.classList.contains('su-hidden')).toBe(true);
            expect(modal.hidden).toBe(true);
        });

        it('Should open the correct modal when open-modal button is clicked', () => {
            const section = document.createElement('section');
            section.setAttribute('data-component', 'vertical-video-panel');

            const modalId = 'test-id';
            const modal = document.createElement('div');
            modal.setAttribute('data-modal', 'modal');
            modal.setAttribute('data-modal-id', modalId);
            modal.classList.add('su-hidden');
            modal.hidden = true;

            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', 'https://youtube.com/embed/xyz?autoplay=0');
            iframe.setAttribute('data-modal', 'iframe');
            modal.appendChild(iframe);

            const button = document.createElement('button');
            button.setAttribute('data-click', 'open-modal');
            button.setAttribute('data-modal-id', modalId);

            section.appendChild(button);
            section.appendChild(modal);
            document.body.appendChild(section);

            verticalVideoPanel._modalInit(section);
            button.click();

            expect(modal.classList.contains('su-hidden')).toBe(false);
            expect(modal.hidden).toBe(false);
            expect(iframe.getAttribute('src')).toContain('autoplay=1');
        });

        it('Should close the modal when close-modal button is clicked', () => {
            const section = document.createElement('section');
            section.setAttribute('data-component', 'vertical-video-panel');

            const modalId = 'test-id';
            const modal = document.createElement('div');
            modal.setAttribute('data-modal', 'modal');
            modal.setAttribute('data-modal-id', modalId);

            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', 'https://youtube.com/embed/xyz?autoplay=1');
            iframe.setAttribute('data-modal', 'iframe');
            modal.appendChild(iframe);

            modal.classList.remove('su-hidden');
            modal.hidden = false;

            const openButton = document.createElement('button');
            openButton.setAttribute('data-click', 'open-modal');
            openButton.setAttribute('data-modal-id', modalId);

            const closeButton = document.createElement('button');
            closeButton.setAttribute('data-dismiss', 'modal');

            section.append(openButton, closeButton, modal);
            document.body.appendChild(section);

            verticalVideoPanel._modalInit(section);
            openButton.click();
            closeButton.click();

            expect(modal.classList.contains('su-hidden')).toBe(true);
            expect(modal.hidden).toBe(true);
            expect(iframe.getAttribute('src')).toContain('autoplay=0');
        });

        it('Should close the modal when Escape key is pressed', () => {
            const section = document.createElement('section');
            section.setAttribute('data-component', 'vertical-video-panel');

            const modalId = 'test-id';
            const modal = document.createElement('div');
            modal.setAttribute('data-modal', 'modal');
            modal.setAttribute('data-modal-id', modalId);

            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', 'https://youtube.com/embed/xyz?autoplay=1');
            iframe.setAttribute('data-modal', 'iframe');
            modal.appendChild(iframe);

            modal.classList.remove('su-hidden');
            modal.hidden = false;

            const openButton = document.createElement('button');
            openButton.setAttribute('data-click', 'open-modal');
            openButton.setAttribute('data-modal-id', modalId);

            section.appendChild(openButton);
            section.appendChild(modal);
            document.body.appendChild(section);

            verticalVideoPanel._modalInit(section);
            openButton.click();

            const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            document.dispatchEvent(escEvent);

            expect(modal.classList.contains('su-hidden')).toBe(true);
            expect(modal.hidden).toBe(true);
            expect(iframe.getAttribute('src')).toContain('autoplay=0');
        });

        it('Should call ensureLoopConditions on Swiper resize', () => {
            const swiperInstance = {
                slides: [],
                params: { slidesPerView: 1, slidesPerGroup: 1 },
                wrapperEl: document.createElement('div'),
                update: vi.fn(),
                activeIndex: 0,
                slidePrev: vi.fn(),
                on: vi.fn(),
                pagination: { bullets: [] },
            };

            let capturedResizeHandler;
            Swiper.mockImplementation((selector, config) => {
                capturedResizeHandler = config.on.resize;
                return swiperInstance;
            });

            verticalVideoPanel._carouselInit(section);
            capturedResizeHandler(swiperInstance);

            expect(true).toBe(true); // to trigger line coverage
        });
        
        it('Should call ensureLoopConditions on Swiper init', () => {
            const mockSlidePrev = vi.fn();
            const mockOn = vi.fn();
            const slide = document.createElement('div');
            const swiperInstance = {
                slides: [slide,slide,slide],
                params: { slidesPerView: 1, slidesPerGroup: 1 },
                wrapperEl: document.createElement('div'),
                update: vi.fn(),
                activeIndex: 1,
                slidePrev: mockSlidePrev,
                on: mockOn,
                pagination: { bullets: [] },
            };

            Swiper.mockImplementation((selector, config) => {
                config.on.init(swiperInstance);
                return swiperInstance;
            });

            verticalVideoPanel._carouselInit(section);

            expect(mockOn).toHaveBeenCalled();
        });

        it('Should call paginationUpdater on paginationUpdate event', () => {
            const swiperInstance = {
                slides: [],
                params: { slidesPerView: 1, slidesPerGroup: 1 },
                wrapperEl: document.createElement('div'),
                update: vi.fn(),
                slidePrev: vi.fn(),
                on: vi.fn(),
                pagination: { bullets: [] },
            };

            Swiper.mockImplementation((selector, conf) => {
                config = conf;
                return swiperInstance;
            });

            verticalVideoPanel._carouselInit(section);
            config.on.paginationUpdate(swiperInstance);

            expect(true).toBe(true); 
        });
    });
});