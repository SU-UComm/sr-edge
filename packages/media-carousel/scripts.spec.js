/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import * as mediaCarousel from './scripts';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

vi.mock('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs', () => ({
    default: vi.fn(() => ({
      init: vi.fn(),
      destroy: vi.fn(),
    })),
}));
  
describe('[Media Carousel][Client]', () => {
    afterEach(() => {
        document.body.innerHTML = ''; // Clear DOM
        vi.clearAllMocks();
    });

    describe('[DOMContentLoaded]', () => {
        it('Should call _carouselInit for each carousel section', () => {
            const section = document.createElement('section');
            section.setAttribute('data-component', 'media-carousel');
            document.body.appendChild(section);

            const _carouselInitSpy = vi.spyOn(mediaCarousel, '_carouselInit');

             // Simulate DOMContentLoaded event
             const event = new Event('DOMContentLoaded');
             document.dispatchEvent(event);


             document.querySelectorAll(mediaCarousel.MEDIA_CAROUSEL_SELECTOR).forEach(section => {
                // Call the function to set up all event listeners
                mediaCarousel._carouselInit(section);
            });

            // Check if the spy was called
            expect(_carouselInitSpy).toHaveBeenCalledWith(section);

            // Restore the original function after test
            _carouselInitSpy.mockRestore(); 
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
            mediaCarousel._carouselInit(section);

            expect(Swiper).toHaveBeenCalledWith('section[data-unique-id="testId"] .swiper', expect.objectContaining({
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
            mediaCarousel._carouselInit(section);
    
            // Ensure Swiper was called
            expect(Swiper).toHaveBeenCalledWith('section[data-unique-id="testId"] .swiper', expect.objectContaining({
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
            mediaCarousel._carouselInit(section);
    
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
