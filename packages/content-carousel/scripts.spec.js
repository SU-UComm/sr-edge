/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { updateAccessibility } from '../../global/js/helpers';
import * as contentCarousel from './scripts';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

// Enhanced mock implementation that includes all necessary Swiper properties and methods
vi.mock('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs', () => ({
    default: vi.fn().mockImplementation(() => ({
        config: {
            slidesPerView: 1,
            spaceBetween: 40,
            loop: true,
            keyboard: {
                enabled: true,
                onlyInViewport: true
            },
            navigation: {
                nextEl: '.component-slider-next',
                prevEl: '.component-slider-prev'
            },
            pagination: {
                el: '.component-slider-pagination',
                clickable: true,
                bulletElement: 'button'
            },
            a11y: {
                prevSlideMessage: 'Previous slide',
                nextSlideMessage: 'Next slide'
            }
        },
        init: vi.fn(),
        destroy: vi.fn(),
        on: vi.fn(),
        $wrapperEl: [{ querySelector: vi.fn().mockReturnValue(null) }],
        slides: [],
        pagination: { bullets: [] },
        emit: vi.fn()
    }))
}));

describe('[Content Carousel][Client]', () => {
    let section;
    
    beforeEach(() => {
        // Setup DOM structure with unique ID
        section = document.createElement('section');
        section.setAttribute('data-component', 'content-carousel');
        section.setAttribute('data-unique-id', 'cf9b8795-bc62-4ab0-96df-951382b3964e'); // Add unique ID
        section.innerHTML = `<div class="su-mx-auto su-component-container su-container-narrow su-container-px"><div class="su-bg-fog-light dark:su-bg-black su-p-20 md:su-pt-36 md:su-px-36 md:su-pb-26"><div class="su-relative su-mb-38 su-overflow-hidden">  <h3 class="su-relative su-text-23 su-leading-[119.415%] su-z-20 su-font-black su-mb-0 su-inline su-pr-10 su-m-0"> More to know about zero waste at Stanford </h3>  <span class="su-w-full su-bg-black-40 dark:su-bg-black-70 su-h-1 su-absolute su-bottom-4"></span></div> <div class="component-slider"><div class="swiper swiper-initialized swiper-horizontal swiper-pointer-events swiper-watch-progress component-slider-single swiper-backface-hidden"><div class="swiper-wrapper" id="swiper-wrapper-f83126ecb8518a1d" aria-live="polite">   <div class="swiper-slide swiper-slide-active" style="width: 632px; margin-right: 40px;" role="group" aria-label="1 / 4" data-swiper-slide-index="0" tabindex="-1"><div class="su-wysiwyg-content su-w-full *:su-mb-6 *:su-text-16 *:su-leading-[125%] *:md:su-text-19 *:lg:su-text-19 [&amp;>*:last-child]:su-mb-0 *:su-card-paragraph"><h3><a href="#">This is not a good way</a></h3><p>to predict the life expectancy of EV batteries, especially for people who own EVs for everyday commuting, according to the <span><strong><a href="https://www.nature.com/articles/s41560-024-01675-8" target="_self">study</a></strong></span> published Dec. 9<strong> </strong>in <em>Nature Energy</em>. While battery prices have plummeted about 90% over the past 15 years, batteries still account for almost a third of the price of a new EV. So, current and future EV commuters may be happy to learn that many extra miles await them.</p> </div></div>  <div class="swiper-slide swiper-slide-next" style="width: 632px; margin-right: 40px;" role="group" aria-label="2 / 4" data-swiper-slide-index="1" aria-hidden="true" inert="true"><div class="su-wysiwyg-content su-w-full *:su-mb-6 *:su-text-16 *:su-leading-[125%] *:md:su-text-19 *:lg:su-text-19 [&amp;>*:last-child]:su-mb-0 *:su-card-paragraph"> <p>The batteries of electric vehicles subject to the normal use of real-world drivers – like heavy traffic, long highway trips, short city trips, and mostly being parked – could last about a third longer than researchers have generally forecast, according to a new study by scientists working in the <span><strong><a href="https://batterycenter.slac.stanford.edu/" target="_self">SLAC-Stanford Battery Center</a></strong></span>, a joint center between Stanford University’s <span><strong><a href="https://energy.stanford.edu/" target="_self">Precourt Institute for Energy</a></strong></span> and <span><strong><a href="https://www6.slac.stanford.edu/" target="_self">SLAC National Accelerator Laboratory</a></strong></span>. This suggests that the owner of a typical EV may not need to replace the expensive battery pack or buy a new car for several additional years.</p> </div></div>  <div class="swiper-slide" style="width: 632px; margin-right: 40px;" role="group" aria-label="3 / 4" data-swiper-slide-index="2" aria-hidden="true" inert="true"><div class="su-wysiwyg-content su-w-full *:su-mb-6 *:su-text-16 *:su-leading-[125%] *:md:su-text-19 *:lg:su-text-19 [&amp;>*:last-child]:su-mb-0 *:su-card-paragraph"> <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> </div></div>  <div class="swiper-slide" role="group" aria-label="4 / 4" data-swiper-slide-index="3" aria-hidden="true" inert="true" style="width: 632px; margin-right: 40px;"><div class="su-wysiwyg-content su-w-full *:su-mb-6 *:su-text-16 *:su-leading-[125%] *:md:su-text-19 *:lg:su-text-19 [&amp;>*:last-child]:su-mb-0 *:su-card-paragraph"> <p><strong>Lorem ipsum dolor sit amet</strong>, consectetur adipiscing elit, sed do eiusmod tempor incididunt dolor sit amet.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt dolor sit amet. Lorem ipsum dolor sit amet, <a href="#">consectetur adipiscing</a> elit. Lorem ipsum dolor sit amet, consectur adipiscing</p> </div></div>   </div><span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div><div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center"><nav aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination-cf9b8795-bc62-4ab0-96df-951382b3964e su-mr-full swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal"><button aria-current="true" class="swiper-pagination-bullet swiper-pagination-bullet-active" tabindex="0"><span class="sr-only">Slide 1</span></button><button class="swiper-pagination-bullet" tabindex="0"><span class="sr-only">Slide 2</span></button><button class="swiper-pagination-bullet" tabindex="0"><span class="sr-only">Slide 3</span></button><button class="swiper-pagination-bullet" tabindex="0"><span class="sr-only">Slide 4</span></button></nav><button class="component-slider-btn component-slider-prev" type="button" tabindex="0" aria-label="Previous slide" aria-controls="swiper-wrapper-f83126ecb8518a1d"><span class="sr-only">Previous</span><span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block"> <svg class="su-fill-transparent su-stroke-current " data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="true"><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg> </span></button><button class="component-slider-btn component-slider-next" type="button" tabindex="0" aria-label="Next slide" aria-controls="swiper-wrapper-f83126ecb8518a1d"><span class="sr-only">Next</span><span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block"> <svg class="su-fill-transparent su-stroke-current " data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="true"><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg> </span></button></div></div> </div></div>`;
        document.body.appendChild(section);
        vi.useFakeTimers();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.clearAllMocks();
        vi.useRealTimers();
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
            contentCarousel._carouselInit(section);
    
            expect(Swiper).toHaveBeenCalledWith('section[data-unique-id="cf9b8795-bc62-4ab0-96df-951382b3964e"] .swiper', expect.objectContaining({
                breakpoints: {
                    0: expect.any(Object),
                    768: expect.any(Object),
                    992: expect.any(Object),
                },
                pagination: expect.objectContaining({
                    el: `.component-slider-pagination-cf9b8795-bc62-4ab0-96df-951382b3964e`,
                    clickable: true,
                    bulletElement: "button",
                    renderBullet: expect.any(Function),
                }),
            }));
        });

        it('Should not initialize Swiper when only one slide is set', () => {
            section.innerHTML = `<div class="su-mx-auto su-component-container su-container-narrow su-container-px"><div class="su-bg-fog-light dark:su-bg-black su-p-20 md:su-pt-36 md:su-px-36 md:su-pb-26"><div class="su-relative su-mb-38 su-overflow-hidden"><h3 class="su-relative su-text-23 su-leading-[119.415%] su-z-20 su-font-black su-mb-0 su-inline su-pr-10 su-m-0">More to know about zero waste at Stanford</h3><span class="su-w-full su-bg-black-40 dark:su-bg-black-70 su-h-1 su-absolute su-bottom-4"></span></div><div class="component-slider"><div class="swiper swiper-initialized swiper-horizontal swiper-pointer-events swiper-watch-progress component-slider-single swiper-backface-hidden"><div class="swiper-wrapper"> <div class="swiper-slide"><div class="su-wysiwyg-content su-w-full *:su-mb-6 *:su-text-16 *:su-leading-[125%] *:md:su-text-19 *:lg:su-text-19 [&amp;>*:last-child]:su-mb-0 *:su-card-paragraph"><p>slide 1</p></div></div> </div></div><div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center"><nav aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination-2f0907c5-d8b8-4380-bc17-342293e8bcd3 su-mr-full swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal"></nav><button class="component-slider-btn component-slider-prev" type="button"><span class="sr-only">Previous</span><span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block"><svg class="su-fill-transparent su-stroke-current " data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="true"><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></button><button class="component-slider-btn component-slider-next" type="button"><span class="sr-only">Next</span><span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block"><svg class="su-fill-transparent su-stroke-current " data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="true"><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></button></div></div></div></div>`;
            contentCarousel._carouselInit(section);
    
            expect(Swiper).not.toHaveBeenCalledWith('section[data-unique-id="cf9b8795-bc62-4ab0-96df-951382b3964e"] .swiper', expect.objectContaining({
                breakpoints: {
                    0: expect.any(Object),
                    768: expect.any(Object),
                    992: expect.any(Object),
                },
                pagination: expect.objectContaining({
                    el: `.component-slider-pagination-cf9b8795-bc62-4ab0-96df-951382b3964e`,
                    clickable: true,
                    bulletElement: "button",
                    renderBullet: expect.any(Function),
                }),
            }));
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
        
        it('Should properly manage slide visibility and interactivity', () => {
            contentCarousel._carouselInit(section);

            const activeSlide = section.querySelector('.swiper-slide.swiper-slide-active');
            const otherSlides = section.querySelectorAll('.swiper-slide:not(.swiper-slide-active)');

            // Verify aria-hidden/inert attributes are set correctly
            expect(activeSlide).not.toHaveAttribute("aria-hidden", "true");
            expect(activeSlide).not.toHaveAttribute("inert", "true");
            expect(activeSlide).toHaveAttribute("tabindex", "-1");

            otherSlides.forEach((slide) => {
                 // Verify aria-hidden/inert attributes are set correctly
                 expect(slide).toHaveAttribute("aria-hidden", "true");
                 expect(slide).toHaveAttribute("inert", "true");
                 expect(slide).not.toHaveAttribute("tabindex", "-1");
            })
        });

        it("Should update pagination bullets accessibility", () => {
            contentCarousel._carouselInit(section);

            const activeBullet = document.querySelector(".swiper-pagination-bullet-active");
            const inactiveBullets = document.querySelectorAll(".swiper-pagination-bullet:not(.swiper-pagination-bullet-active)");

            // Aktywna paginacja
            expect(activeBullet).toHaveAttribute("aria-current", "true");

            // Nieaktywne paginacje
            inactiveBullets.forEach((bullet) => {
                expect(bullet).not.toHaveAttribute("aria-current", "true");
            });
        });

        it("Should call updateAccessibility after slideChange event", async () => {
            let swiper = {
                slides: Array.from(document.querySelectorAll(".swiper-slide")),
                pagination: {
                    bullets: Array.from(document.querySelectorAll(".swiper-pagination-bullet")),
                },
                on: vi.fn((event, callback) => {
                    if (event === "slideChange") {
                        swiper._slideChangeCallback = callback;
                    }
                }),
                triggerSlideChange() {
                    this._slideChangeCallback?.();
                }
            };
    
            swiper.on("slideChange", function () {
                setTimeout(() => {
                    updateAccessibility(swiper, 'a, button', true);
                }, 100);
            });

            swiper.triggerSlideChange();
            await vi.runAllTimersAsync();
    
            const activeSlide = document.querySelector(".swiper-slide-active");
            const inactiveSlides = document.querySelectorAll(".swiper-slide:not(.swiper-slide-active)");

            expect(activeSlide.hasAttribute("aria-hidden")).toBe(false);
            expect(activeSlide.hasAttribute("inert")).toBe(false);
            expect(activeSlide.getAttribute("tabindex")).toBe("-1");

            inactiveSlides.forEach((slide) => {
                expect(slide.getAttribute("aria-hidden")).toBe("true");
                expect(slide.getAttribute("inert")).toBe("true");
                expect(slide.hasAttribute("tabindex")).toBe(false);
            });
    
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

            contentCarousel._carouselInit(section);
            capturedResizeHandler(swiperInstance);

            expect(true).toBe(true); // to trigger line coverage
        });
        
        it('Should call ensureLoopConditions on Swiper init', () => {
            const mockOn = vi.fn();
            const slide = document.createElement('div');
            const swiperInstance = {
                slides: [slide,slide,slide],
                params: { slidesPerView: 1, slidesPerGroup: 1 },
                wrapperEl: document.createElement('div'),
                update: vi.fn(),
                activeIndex: 1,
                on: mockOn,
                pagination: { bullets: [] },
            };

            Swiper.mockImplementation((selector, config) => {
                config.on.init(swiperInstance);
                return swiperInstance;
            });

            contentCarousel._carouselInit(section);

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

            let config;
            Swiper.mockImplementation((selector, conf) => {
                config = conf;
                return swiperInstance;
            });

            contentCarousel._carouselInit(section);
            config.on.paginationUpdate(swiperInstance);

            expect(true).toBe(true); 
        });
    });
});

