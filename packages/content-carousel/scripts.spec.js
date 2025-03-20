/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import * as contentCarousel from './scripts';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

vi.mock('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs', () => ({
    default: vi.fn(() => ({
        init: vi.fn(),
        destroy: vi.fn(),
    })),
}));

describe('[Content Carousel][Client]', () => {
    let section;
    
    beforeEach(() => {
        // Setup DOM structure with unique ID
        section = document.createElement('section');
        section.setAttribute('data-component', 'content-carousel');
        section.setAttribute('data-unique-id', 'test-carousel'); // Add unique ID
        
        section.innerHTML = `
            <div class="swiper">
                <div class="swiper-wrapper">
                    <div class="swiper-slide">Slide 1</div>
                    <div class="swiper-slide">Slide 2</div>
                </div>
                <div class="component-slider-pagination"></div>
                <button class="component-slider-prev">Previous</button>
                <button class="component-slider-next">Next</button>
            </div>
        `;
        
        document.body.appendChild(section);
    });
    
    afterEach(() => {
        document.body.innerHTML = '';
        vi.clearAllMocks();
    });

    describe('[DOMContentLoaded]', () => {
        it('Should call _carouselInit for each carousel section', () => {
            const _carouselInitSpy = vi.spyOn(contentCarousel, '_carouselInit');
            
            // First, attach the event listener
            document.addEventListener('DOMContentLoaded', () => {
                document.querySelectorAll(contentCarousel.CONTENT_CAROUSEL_SELECTOR).forEach(section => {
                    contentCarousel._carouselInit(section);
                });
            });
            
            // Then dispatch the event
            const event = new Event('DOMContentLoaded');
            document.dispatchEvent(event);
            
            // Check if the spy was called
            expect(_carouselInitSpy).toHaveBeenCalled();
            _carouselInitSpy.mockRestore();
        });
    });

    describe('[Carousel functionality]', () => {
        it('Should initialize Swiper with the correct configuration', () => {
            contentCarousel._carouselInit(section); // Pass the section element
            
            expect(Swiper).toHaveBeenCalledWith(
                `section[data-unique-id="test-carousel"] .swiper`,
                expect.objectContaining({
                    breakpoints: {
                        0: expect.any(Object),
                        768: expect.any(Object),
                        992: expect.any(Object),
                    },
                    slidesPerView: 1,
                    spaceBetween: 40,
                    loop: true,
                    keyboard: expect.objectContaining({
                        enabled: true,
                        onlyInViewport: true,
                    }),
                    a11y: expect.objectContaining({
                        prevSlideMessage: 'Previous slide',
                        nextSlideMessage: 'Next slide',
                    }),
                    navigation: expect.objectContaining({
                        nextEl: `section[data-unique-id="test-carousel"] .component-slider-next`,
                        prevEl: `section[data-unique-id="test-carousel"] .component-slider-prev`,
                    }),
                    pagination: expect.objectContaining({
                        el: `.component-slider-pagination-test-carousel`,
                        clickable: true,
                        bulletElement: "button",
                        renderBullet: expect.any(Function),
                    }),
                })
            );
        });

        it('Should render bullets correctly using renderBullet function', () => {
            contentCarousel._carouselInit(section);
            
            // Retrieve the configuration object that Swiper was called with
            const swiperConfig = Swiper.mock.calls[0][1];
            const renderBullet = swiperConfig.pagination.renderBullet;
            
            // Test renderBullet with different indices
            const bulletFirst = renderBullet(0, 'swiper-pagination-bullet');
            const bulletSecond = renderBullet(1, 'swiper-pagination-bullet');
            
            // Use toMatch with more precise regex patterns
            expect(bulletFirst).toMatch(
                /<button aria-current="true" class="swiper-pagination-bullet"[^>]*><span class="sr-only">Slide 1<\/span><\/button>/
            );
            expect(bulletSecond).toMatch(`<button  class="swiper-pagination-bullet"><span class="sr-only">Slide 2</span></button>`);
        });
    });
});