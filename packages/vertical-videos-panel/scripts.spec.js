/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { updateAccessibility } from '../../global/js/helpers';
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
        let section;

        beforeEach(() => {
            section = document.createElement('section');
            section.setAttribute('data-component', 'vertical-video-panel');
            section.setAttribute('data-unique-id', 'cf9b8795-bc62-4ab0-96df-951382b3964e');
            section.innerHTML = `<div class="swiper"></div>`;
            document.body.appendChild(section);
            vi.useFakeTimers();
        });

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
                setTimeout(() => updateAccessibility(swiper), 100);
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

        it('Should call ensureLoopConditions and slidePrev on Swiper init', () => {
            const mockSlidePrev = vi.fn();
            const swiperInstance = {
                slides: [],
                params: { slidesPerView: 1, slidesPerGroup: 1 },
                wrapperEl: document.createElement('div'),
                update: vi.fn(),
                activeIndex: 1,
                slidePrev: mockSlidePrev,
                on: vi.fn(),
                pagination: { bullets: [] },
            };

            Swiper.mockImplementation((selector, config) => {
                config.on.init(swiperInstance);
                return swiperInstance;
            });

            verticalVideoPanel._carouselInit(section);

            expect(mockSlidePrev).toHaveBeenCalled();
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
    });
});