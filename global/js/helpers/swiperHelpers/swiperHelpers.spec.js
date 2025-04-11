/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ensureLoopConditions, duplicateSlides, paginationUpdater } from './swiperHelpers';

describe('[Vertical Video Panel][Loop helpers]', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        vi.clearAllMocks();
    });

    describe('[Loop logic]', () => {
        it('Should remove slider controls if only one slide', () => {
            const controls = document.createElement('div');
            controls.className = 'component-slider-controls';
            document.body.appendChild(controls);

            const slide = document.createElement('div');

            const swiper = {
                params: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                },
                slides: [slide],
                wrapperEl: document.createElement('div'),
                update: vi.fn(),
                navigation: {
                    nextEl: {remove: vi.fn()},
                    prevEl: {remove: vi.fn()},
                },
                pagination: {
                    bullets: vi.fn()
                }
            };

            ensureLoopConditions(swiper);
            expect(swiper.navigation.nextEl.remove).toHaveBeenCalled();
            expect(swiper.navigation.prevEl.remove).toHaveBeenCalled();
        });

        it('Should add extra slides if totalSlides is not divisible by slidesPerGroup', () => {
            const slide1 = document.createElement('div');
            slide1.classList.add('swiper-slide');
            const slide2 = document.createElement('div');
            slide2.classList.add('swiper-slide');

            const swiper = {
                slides: [slide1, slide2],
                wrapperEl: document.createElement('div'),
                update: vi.fn(),
                pagination: {
                    bullets: vi.fn()
                }
            };

            const callback = vi.fn();

            duplicateSlides(swiper, 5, 3, callback);

            const duplicates = swiper.wrapperEl.querySelectorAll('.swiper-slide-duplicate');
            expect(duplicates.length).toBeGreaterThan(0);
            expect(swiper.update).toHaveBeenCalled();
            expect(callback).toHaveBeenCalled();
        });

        it('Should trigger duplicateSlides when totalSlides - 1 < minSlides', () => {
            const wrapper = document.createElement('div');

            const slides = [1, 2, 3].map(() => {
                const el = document.createElement('div');
                el.classList.add('swiper-slide');
                return el;
            });

            const swiper = {
                slides,
                params: { slidesPerView: 3, slidesPerGroup: 3 },
                wrapperEl: wrapper,
                update: vi.fn(),
                pagination: {
                    bullets: vi.fn()
                }
            };

            ensureLoopConditions(swiper);
            const duplicates = wrapper.querySelectorAll('.swiper-slide-duplicate');
            expect(duplicates.length).toBeGreaterThan(0);
        });

        it('Should trigger duplicateSlides when totalSlides % slidesPerGroup !== 0', () => {
            const wrapper = document.createElement('div');

            const slides = [1, 2, 3].map(() => {
                const el = document.createElement('div');
                el.classList.add('swiper-slide');
                return el;
            });

            const swiper = {
                slides,
                params: { slidesPerView: 1, slidesPerGroup: 2 },
                wrapperEl: wrapper,
                update: vi.fn(),
                pagination: {
                    bullets: vi.fn()
                }
            };

            ensureLoopConditions(swiper);
            const duplicates = wrapper.querySelectorAll('.swiper-slide-duplicate');
            expect(duplicates.length).toBeGreaterThan(0);
        });

        it('Should NOT trigger duplicateSlides if both conditions are false', () => {
            const wrapper = document.createElement('div');

            const slides = Array.from({ length: 6 }, () => {
                const el = document.createElement('div');
                el.classList.add('swiper-slide');
                return el;
            });

            const swiper = {
                slides,
                params: { slidesPerView: 2, slidesPerGroup: 2 },
                wrapperEl: wrapper,
                update: vi.fn(),
                pagination: {
                    bullets: vi.fn()
                }
            };

            ensureLoopConditions(swiper);
            const duplicates = wrapper.querySelectorAll('.swiper-slide-duplicate');
            expect(duplicates.length).toBe(0);
        });
    });

    describe('[Pagination updater]', () => {
        it('Should remove excess bullets when duplicate slides exist', () => {
            const slide1 = document.createElement('div');
            const slide2 = document.createElement('div');
            const duplicateSlide = document.createElement('div');
            duplicateSlide.classList.add('swiper-slide-duplicate');

            const swiper = {
                slides: [slide1, slide2, duplicateSlide],
                pagination: {
                    bullets: [
                        createBulletMock(),
                        createBulletMock(),
                        createBulletMock(),
                        createBulletMock()
                    ]
                }
            };

            paginationUpdater(swiper);

            const remainingBullets = swiper.pagination.bullets;
            expect(remainingBullets.length).toBeLessThan(4);
            expect(remainingBullets.every(b => !b.isRemoved)).toBe(true);
        });

        it('Should not throw when called with no duplicate slides', () => {
            const swiper = {
                slides: [document.createElement('div'), document.createElement('div')],
                pagination: {
                    bullets: [createBulletMock(), createBulletMock()]
                }
            };

            expect(() => paginationUpdater(swiper)).not.toThrow();
        });
    });

    function createBulletMock() {
        const bullet = document.createElement('button');
        bullet.remove = vi.fn(() => { bullet.isRemoved = true; });
        return bullet;
    }
});
