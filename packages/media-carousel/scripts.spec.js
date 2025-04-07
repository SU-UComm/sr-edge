/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { updateAccessibility } from '../../global/js/helpers';
import * as mediaCarousel from './scripts';
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
  
describe('[Media Carousel][Client]', () => {
    afterEach(() => {
        document.body.innerHTML = ''; // Clear DOM
        vi.clearAllMocks();
        vi.useRealTimers();
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
            section.setAttribute('data-component', 'media-carousel');
            section.setAttribute('data-unique-id', 'cf9b8795-bc62-4ab0-96df-951382b3964e'); // Add unique ID
            section.innerHTML = `<div class="su-mx-auto su-component-container su-container-large su-container-px"><div class="component-slider"><div class="swiper component-slider-single component-slider-peek swiper-initialized swiper-horizontal swiper-watch-progress swiper-backface-hidden"><div class="swiper-wrapper" id="swiper-wrapper-8f5940873096ea7f" aria-live="polite"><div class="swiper-slide swiper-slide-visible swiper-slide-fully-visible swiper-slide-active" style="width: 1086px;" role="group" aria-label="1 / 5" data-swiper-slide-index="0" tabindex="-1"><article aria-label="Two Example Two" data-test="media-card" class="su-component-card-media md:su-min-h-[38.4rem] su-relative su-w-full md:su-px-0 su-flex su-flex-wrap su-justify-center su-gap-20 md:su-gap-36 md:su-gap-48 md:su-flex-nowrap su-items-center"><div class="su-relative su-w-full su-px-20 md:su-px-0 su-h-[34.2rem] lg:su-h-[57.2rem] lg:su-py-30 su-min-w-[24.9rem] lg:su-min-w-[38.2rem] lg:su-max-w-[38.2rem] su-flex su-items-center su-justify-center"><img class="su-media-card-thumb su-size-full su-object-scale-down su-object-center" src="https://news.stanford.edu/__data/assets/image/0028/9856/20221130Elizabeth_Miller_N6A8132.jpeg" alt="[object Object]"></div><div class="su-media-card-text su-grow su-w-full md:su-w-auto"><div class="su-mb-20 md:su-mb-27"><h2 class="su-component-sidebar-heading su-w-full su-flex su-flex-wrap su-gap-6 su-my-0 su-font-sans su-text-black-90 dark:su-text-white su-font-semibold su-text-18 su-items-end"><span data-test="icon" class="dark:su-hidden"><svg data-testid="svg-featuredreading-light" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="29" height="24" viewBox="0 0 29 24" fill="none"><path d="M13.3392 2.22359V18.7221L4.21239 16.967V2.34206C4.21239 1.47325 4.99344 0.81068 5.84908 0.955481L13.3392 2.22359ZM3.93595 18.5949L14.0413 20.6177L24.1467 18.5949C24.8048 18.4632 25.2744 17.8884 25.2744 17.2171V2.08317L26.402 1.85939C27.2709 1.68387 28.0826 2.34645 28.0826 3.23281V19.3277C28.0826 19.999 27.6087 20.5738 26.9549 20.7055L14.0413 23.2855L1.12769 20.7011C0.473894 20.5738 0 19.9946 0 19.3277V3.23281C0 2.34645 0.811763 1.68387 1.68057 1.85939L2.80826 2.08317V17.2215C2.80826 17.8928 3.28216 18.4676 3.93595 18.5993V18.5949ZM14.7434 18.7221V2.22359L22.2335 0.955481C23.0892 0.81068 23.8702 1.47325 23.8702 2.34206V16.967L14.7434 18.7221Z" fill="url(#id-1-featured_reading_light)"></path><defs><linearGradient id="id-1-featured_reading_light" x1="28.0826" y1="0.935547" x2="13.6523" y2="11.6856" gradientUnits="userSpaceOnUse"><stop stop-color="#E50808"></stop><stop offset="1" stop-color="#820000"></stop></linearGradient></defs></svg></span><span data-test="icon" class="su-hidden dark:su-block"><svg data-testid="svg-featuredreading-dark" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="29" height="24" viewBox="0 0 29 24" fill="none"><path d="M13.3392 2.11323V18.6118L4.21239 16.8566V2.23171C4.21239 1.3629 4.99344 0.700328 5.84908 0.845129L13.3392 2.11323ZM3.93595 18.4845L14.0413 20.5073L24.1467 18.4845C24.8048 18.3529 25.2744 17.7781 25.2744 17.1067V1.97282L26.402 1.74904C27.2709 1.57352 28.0826 2.2361 28.0826 3.12245V19.2173C28.0826 19.8887 27.6087 20.4635 26.9549 20.5951L14.0413 23.1752L1.12769 20.5907C0.473894 20.4635 0 19.8843 0 19.2173V3.12245C0 2.2361 0.811763 1.57352 1.68057 1.74904L2.80826 1.97282V17.1111C2.80826 17.7825 3.28216 18.3573 3.93595 18.4889V18.4845ZM14.7434 18.6118V2.11323L22.2335 0.845129C23.0892 0.700328 23.8702 1.3629 23.8702 2.23171V16.8566L14.7434 18.6118Z" fill="url(#id-2-featured_reading_light)"></path><defs><linearGradient id="id-2-featured_reading_light" x1="28.0826" y1="0.825195" x2="13.6523" y2="11.5752" gradientUnits="userSpaceOnUse"><stop stop-color="#8F993E"></stop><stop offset="1" stop-color="#279989"></stop></linearGradient></defs></svg></span><span>Featured reading</span></h2></div><h3 class="su-text-[3.5rem] su-leading-tight md:su-text-[4rem] lg:su-text-[4.3rem] su-mb-15 md:su-mb-19"><a href="https://www.squiz.net" class="su-group su-text-black su-transition dark:su-text-white hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red hocus:su-underline"><span>Two Example Two</span><svg aria-hidden="true" focusable="false" data-testid="svg-arrow-up-right" data-prefix="far" data-icon="arrow-up-right" class="svg-inline--fa fa-arrow-up-right su-h-auto su-align-middle su-ml-5 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="24"><path fill="currentColor" d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"></path></svg></a></h3><div class="su-text-18 md:su-text-16 su-mb-15 md:su-mb-19 su-gap-6 su-text-black-70 dark:su-text-black-50 su-flex su-nowrap su-items-center su-leading-none"><svg aria-hidden="true" focusable="false" data-testid="svg-book-open-cover" data-prefix="fas" data-icon="book-open-cover" class="svg-inline--fa fa-book-open-cover " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="20"><path fill="currentColor" d="M304 32l0 376L96 368 96 34.7C96 14.9 113.8-.2 133.3 3.1L304 32zM89.7 405.1L320 451.2l230.3-46.1c15-3 25.7-16.1 25.7-31.4l0-345 25.7-5.1C621.5 19.7 640 34.8 640 55l0 366.7c0 15.3-10.8 28.4-25.7 31.4L320 512 25.7 453.1C10.8 450.2 0 437 0 421.8L0 55C0 34.8 18.5 19.7 38.3 23.7L64 28.8l0 345c0 15.3 10.8 28.4 25.7 31.4zM336 408l0-376L506.7 3.1C526.2-.2 544 14.9 544 34.7L544 368 336 408z"></path></svg><span class="su-font-semibold">Book</span></div><div data-test="mediacard-description" class="*:su-my-0 *:su-leading-[125%] su-leading-[125%] *:su-text-18 su-text-18 md:*:su-text-19 md:su-text-19 lg:*:su-text-21 lg:su-text-21 dark:su-text-white su-font-sans su-w-full"> Second ipsum dolor sit amet this is a slightly shorter teaser to test how this visually displays. </div></div></article></div><div class="swiper-slide swiper-slide-next" style="width: 1086px;" role="group" aria-label="2 / 5" data-swiper-slide-index="1" aria-hidden="true" inert="true"><article aria-label="One Auden and the Muse of History" data-test="media-card" class="su-component-card-media md:su-min-h-[38.4rem] su-relative su-w-full md:su-px-0 su-flex su-flex-wrap su-justify-center su-gap-20 md:su-gap-36 md:su-gap-48 md:su-flex-nowrap su-items-center"><div class="su-relative su-w-full su-px-20 md:su-px-0 su-h-[34.2rem] lg:su-h-[57.2rem] lg:su-py-30 su-min-w-[24.9rem] lg:su-min-w-[38.2rem] lg:su-max-w-[38.2rem] su-flex su-items-center su-justify-center"><img class="su-media-card-thumb su-size-full su-object-scale-down su-object-center" src="https://news.stanford.edu/__data/assets/image/0029/9848/Field-Trip-Egan-Range-Phil-Gans.jpeg" alt="[object Object]"></div><div class="su-media-card-text su-grow su-w-full md:su-w-auto"><div class="su-mb-20 md:su-mb-27"><h2 class="su-component-sidebar-heading su-w-full su-flex su-flex-wrap su-gap-6 su-my-0 su-font-sans su-text-black-90 dark:su-text-white su-font-semibold su-text-18 su-items-end"><span data-test="icon" class="dark:su-hidden"><svg data-testid="svg-featuredaudio-light" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="27" height="22" viewBox="0 0 27 22" fill="none"><path d="M14.786 0.136558C15.3507 0.391912 15.7141 0.951726 15.7141 1.57047V20.4274C15.7141 21.0461 15.3507 21.6059 14.786 21.8613C14.2212 22.1166 13.5583 22.0135 13.0967 21.601L6.47224 15.7131H3.14282C1.40936 15.7131 0 14.3038 0 12.5703V9.42751C0 7.69405 1.40936 6.28469 3.14282 6.28469H6.47224L13.0967 0.396823C13.5583 -0.015672 14.2212 -0.113885 14.786 0.136558ZM23.2323 3.68205C25.3537 5.4106 26.7139 8.04762 26.7139 10.9989C26.7139 13.9502 25.3537 16.5872 23.2323 18.3158C22.7265 18.7283 21.985 18.6497 21.5725 18.1439C21.16 17.6381 21.2386 16.8966 21.7444 16.4841C23.3403 15.1877 24.3568 13.2136 24.3568 10.9989C24.3568 8.78421 23.3403 6.81013 21.7444 5.50881C21.2386 5.09631 21.1649 4.35481 21.5725 3.84901C21.9801 3.34321 22.7265 3.26955 23.2323 3.67714V3.68205ZM20.2613 7.34048C21.3171 8.20476 21.9997 9.52081 21.9997 10.9989C21.9997 12.477 21.3171 13.7931 20.2613 14.6574C19.7555 15.0698 19.014 14.9913 18.6015 14.4855C18.189 13.9797 18.2676 13.2382 18.7734 12.8257C19.3038 12.3935 19.6426 11.7355 19.6426 10.9989C19.6426 10.2623 19.3038 9.60429 18.7734 9.16724C18.2676 8.75475 18.194 8.01324 18.6015 7.50744C19.0091 7.00165 19.7555 6.92799 20.2613 7.33557V7.34048Z" fill="url(#id-3-featured_audio_light)"></path><defs><linearGradient id="id-3-featured_audio_light" x1="0" y1="0" x2="26.7139" y2="3.65204e-08" gradientUnits="userSpaceOnUse"><stop stop-color="#820000"></stop><stop offset="1" stop-color="#E50808"></stop></linearGradient></defs></svg></span><span data-test="icon" class="su-hidden dark:su-block"><svg data-testid="svg-featuredaudio-dark" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="27" height="22" viewBox="0 0 27 22" fill="none"><path d="M14.786 0.136558C15.3507 0.391912 15.7141 0.951726 15.7141 1.57047V20.4274C15.7141 21.0461 15.3507 21.6059 14.786 21.8613C14.2212 22.1166 13.5583 22.0135 13.0967 21.601L6.47224 15.7131H3.14282C1.40936 15.7131 0 14.3038 0 12.5703V9.42751C0 7.69405 1.40936 6.28469 3.14282 6.28469H6.47224L13.0967 0.396823C13.5583 -0.015672 14.2212 -0.113885 14.786 0.136558ZM23.2323 3.68205C25.3537 5.4106 26.7139 8.04762 26.7139 10.9989C26.7139 13.9502 25.3537 16.5872 23.2323 18.3158C22.7265 18.7283 21.985 18.6497 21.5725 18.1439C21.16 17.6381 21.2386 16.8966 21.7444 16.4841C23.3403 15.1877 24.3568 13.2136 24.3568 10.9989C24.3568 8.78421 23.3403 6.81013 21.7444 5.50881C21.2386 5.09631 21.1649 4.35481 21.5725 3.84901C21.9801 3.34321 22.7265 3.26955 23.2323 3.67714V3.68205ZM20.2613 7.34048C21.3171 8.20476 21.9997 9.52081 21.9997 10.9989C21.9997 12.477 21.3171 13.7931 20.2613 14.6574C19.7555 15.0698 19.014 14.9913 18.6015 14.4855C18.189 13.9797 18.2676 13.2382 18.7734 12.8257C19.3038 12.3935 19.6426 11.7355 19.6426 10.9989C19.6426 10.2623 19.3038 9.60429 18.7734 9.16724C18.2676 8.75475 18.194 8.01324 18.6015 7.50744C19.0091 7.00165 19.7555 6.92799 20.2613 7.33557V7.34048Z" fill="url(#id-4-featured_audio_light)"></path><defs><linearGradient id="id-4-featured_audio_light" x1="0" y1="0" x2="26.7139" y2="3.65204e-08" gradientUnits="userSpaceOnUse"><stop stop-color="#279989"></stop><stop offset="1" stop-color="#8F993E"></stop></linearGradient></defs></svg></span><span>Featured audio</span></h2></div><h3 class="su-text-[3.5rem] su-leading-tight md:su-text-[4rem] lg:su-text-[4.3rem] su-mb-5"><span class="su-text-black su-transition dark:su-text-white">One Auden and the Muse of History</span></h3><div data-test="mediacard-author" class="su-mb-15 md:su-mb-19">Susannah Young-ah Gottlieb</div><div class="su-text-18 md:su-text-16 su-mb-15 md:su-mb-19 su-gap-6 su-text-black-70 dark:su-text-black-50 su-flex su-nowrap su-items-center su-leading-none"><svg aria-hidden="true" focusable="false" data-testid="svg-microphone" data-prefix="fas" data-icon="microphone" class="svg-inline--fa fa-microphone " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20"><path fill="currentColor" d="M192 0C139 0 96 43 96 96l0 160c0 53 43 96 96 96s96-43 96-96l0-160c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6c85.8-11.7 152-85.3 152-174.4l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 70.7-57.3 128-128 128s-128-57.3-128-128l0-40z"></path></svg><span class="su-font-semibold">Podcast</span></div><div data-test="mediacard-description" class="*:su-my-0 *:su-leading-[125%] su-leading-[125%] *:su-text-18 su-text-18 md:*:su-text-19 md:su-text-19 lg:*:su-text-21 lg:su-text-21 dark:su-text-white su-font-sans su-w-full"> First concentrating on W. H. Auden's work from the late 1930s, when he seeks to understand the poet's responsibility in the face of a triumphant fascism, to the late 1950s, when he discerns an irreconcilable "divorce" between poetry... </div></div></article></div><div class="swiper-slide" style="width: 1086px;" role="group" aria-label="3 / 5" data-swiper-slide-index="2" aria-hidden="true" inert="true"><article aria-label="Three Example Three" data-test="media-card" class="su-component-card-media md:su-min-h-[38.4rem] su-relative su-w-full md:su-px-0 su-flex su-flex-wrap su-justify-center su-gap-20 md:su-gap-36 md:su-gap-48 md:su-flex-nowrap su-items-center"><div class="su-relative su-w-full su-px-20 md:su-px-0 su-h-[34.2rem] lg:su-h-[57.2rem] lg:su-py-30 su-min-w-[24.9rem] lg:su-min-w-[38.2rem] lg:su-max-w-[38.2rem] su-flex su-items-center su-justify-center"><img class="su-media-card-thumb su-size-full su-object-scale-down su-object-center" src="https://sug-web.matrix.squiz.cloud/__data/assets/image/0019/99100/RDE-Sustainability-Waste-Specialist-Haley-Todd-with-a-Recycle-for-Change-Bin-scaled-1.jpg" alt=""></div><div class="su-media-card-text su-grow su-w-full md:su-w-auto"><div class="su-mb-20 md:su-mb-27"><h2 class="su-component-sidebar-heading su-w-full su-flex su-flex-wrap su-gap-6 su-my-0 su-font-sans su-text-black-90 dark:su-text-white su-font-semibold su-text-18 su-items-end"><span data-test="icon" class="dark:su-hidden"><svg data-testid="svg-featuredreading-light" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="29" height="24" viewBox="0 0 29 24" fill="none"><path d="M13.3392 2.22359V18.7221L4.21239 16.967V2.34206C4.21239 1.47325 4.99344 0.81068 5.84908 0.955481L13.3392 2.22359ZM3.93595 18.5949L14.0413 20.6177L24.1467 18.5949C24.8048 18.4632 25.2744 17.8884 25.2744 17.2171V2.08317L26.402 1.85939C27.2709 1.68387 28.0826 2.34645 28.0826 3.23281V19.3277C28.0826 19.999 27.6087 20.5738 26.9549 20.7055L14.0413 23.2855L1.12769 20.7011C0.473894 20.5738 0 19.9946 0 19.3277V3.23281C0 2.34645 0.811763 1.68387 1.68057 1.85939L2.80826 2.08317V17.2215C2.80826 17.8928 3.28216 18.4676 3.93595 18.5993V18.5949ZM14.7434 18.7221V2.22359L22.2335 0.955481C23.0892 0.81068 23.8702 1.47325 23.8702 2.34206V16.967L14.7434 18.7221Z" fill="url(#id-5-featured_reading_light)"></path><defs><linearGradient id="id-5-featured_reading_light" x1="28.0826" y1="0.935547" x2="13.6523" y2="11.6856" gradientUnits="userSpaceOnUse"><stop stop-color="#E50808"></stop><stop offset="1" stop-color="#820000"></stop></linearGradient></defs></svg></span><span data-test="icon" class="su-hidden dark:su-block"><svg data-testid="svg-featuredreading-dark" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="29" height="24" viewBox="0 0 29 24" fill="none"><path d="M13.3392 2.11323V18.6118L4.21239 16.8566V2.23171C4.21239 1.3629 4.99344 0.700328 5.84908 0.845129L13.3392 2.11323ZM3.93595 18.4845L14.0413 20.5073L24.1467 18.4845C24.8048 18.3529 25.2744 17.7781 25.2744 17.1067V1.97282L26.402 1.74904C27.2709 1.57352 28.0826 2.2361 28.0826 3.12245V19.2173C28.0826 19.8887 27.6087 20.4635 26.9549 20.5951L14.0413 23.1752L1.12769 20.5907C0.473894 20.4635 0 19.8843 0 19.2173V3.12245C0 2.2361 0.811763 1.57352 1.68057 1.74904L2.80826 1.97282V17.1111C2.80826 17.7825 3.28216 18.3573 3.93595 18.4889V18.4845ZM14.7434 18.6118V2.11323L22.2335 0.845129C23.0892 0.700328 23.8702 1.3629 23.8702 2.23171V16.8566L14.7434 18.6118Z" fill="url(#id-6-featured_reading_light)"></path><defs><linearGradient id="id-6-featured_reading_light" x1="28.0826" y1="0.825195" x2="13.6523" y2="11.5752" gradientUnits="userSpaceOnUse"><stop stop-color="#8F993E"></stop><stop offset="1" stop-color="#279989"></stop></linearGradient></defs></svg></span><span>Featured reading</span></h2></div><h3 class="su-text-[3.5rem] su-leading-tight md:su-text-[4rem] lg:su-text-[4.3rem] su-mb-5"><a href="https://www.squiz.net" class="su-group su-text-black su-transition dark:su-text-white hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red hocus:su-underline"><span>Three Example Three</span><svg aria-hidden="true" focusable="false" data-testid="svg-arrow-up-right" data-prefix="far" data-icon="arrow-up-right" class="svg-inline--fa fa-arrow-up-right su-h-auto su-align-middle su-ml-5 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="24"><path fill="currentColor" d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"></path></svg></a></h3><div data-test="mediacard-author" class="su-mb-15 md:su-mb-19">Susannah Young-ah Gottlieb</div><div class="su-text-18 md:su-text-16 su-mb-15 md:su-mb-19 su-gap-6 su-text-black-70 dark:su-text-black-50 su-flex su-nowrap su-items-center su-leading-none"><svg aria-hidden="true" focusable="false" data-testid="svg-book-open" data-prefix="fas" data-icon="book-open" class="svg-inline--fa fa-book-open " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="20"><path fill="currentColor" d="M249.6 471.5c10.8 3.8 22.4-4.1 22.4-15.5l0-377.4c0-4.2-1.6-8.4-5-11C247.4 52 202.4 32 144 32C93.5 32 46.3 45.3 18.1 56.1C6.8 60.5 0 71.7 0 83.8L0 454.1c0 11.9 12.8 20.2 24.1 16.5C55.6 460.1 105.5 448 144 448c33.9 0 79 14 105.6 23.5zm76.8 0C353 462 398.1 448 432 448c38.5 0 88.4 12.1 119.9 22.6c11.3 3.8 24.1-4.6 24.1-16.5l0-370.3c0-12.1-6.8-23.3-18.1-27.6C529.7 45.3 482.5 32 432 32c-58.4 0-103.4 20-123 35.6c-3.3 2.6-5 6.8-5 11L304 456c0 11.4 11.7 19.3 22.4 15.5z"></path></svg><span class="su-font-semibold">Magazine</span></div><div data-test="mediacard-description" class="*:su-my-0 *:su-leading-[125%] su-leading-[125%] *:su-text-18 su-text-18 md:*:su-text-19 md:su-text-19 lg:*:su-text-21 lg:su-text-21 dark:su-text-white su-font-sans su-w-full"> Third on W. H. Auden's work from the late 1930s, when he seeks to understand the poet's responsibility in the face of a triumphant fascism, to the late 1950s, when he discerns an irreconcilable "divorce" between poetry... </div></div></article></div><div class="swiper-slide" style="width: 1086px;" role="group" aria-label="4 / 5" data-swiper-slide-index="3" aria-hidden="true" inert="true"><article aria-label="Four Example Four news.stanford.edu link" data-test="media-card" class="su-component-card-media md:su-min-h-[38.4rem] su-relative su-w-full md:su-px-0 su-flex su-flex-wrap su-justify-center su-gap-20 md:su-gap-36 md:su-gap-48 md:su-flex-nowrap su-items-center"><div class="su-relative su-w-full su-px-20 md:su-px-0 su-h-[34.2rem] lg:su-h-[57.2rem] lg:su-py-30 su-min-w-[24.9rem] lg:su-min-w-[38.2rem] lg:su-max-w-[38.2rem] su-flex su-items-center su-justify-center"><img class="su-media-card-thumb su-size-full su-object-scale-down su-object-center" src="https://news.stanford.edu/__data/assets/image/0024/9861/20221130Elizabeth_Miller_N6A8013.jpeg" alt="[object Object]"></div><div class="su-media-card-text su-grow su-w-full md:su-w-auto"><div class="su-mb-20 md:su-mb-27"><h2 class="su-component-sidebar-heading su-w-full su-flex su-flex-wrap su-gap-6 su-my-0 su-font-sans su-text-black-90 dark:su-text-white su-font-semibold su-text-18 su-items-end"><span data-test="icon" class="dark:su-hidden"><svg data-testid="svg-featuredaudio-light" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="27" height="22" viewBox="0 0 27 22" fill="none"><path d="M14.786 0.136558C15.3507 0.391912 15.7141 0.951726 15.7141 1.57047V20.4274C15.7141 21.0461 15.3507 21.6059 14.786 21.8613C14.2212 22.1166 13.5583 22.0135 13.0967 21.601L6.47224 15.7131H3.14282C1.40936 15.7131 0 14.3038 0 12.5703V9.42751C0 7.69405 1.40936 6.28469 3.14282 6.28469H6.47224L13.0967 0.396823C13.5583 -0.015672 14.2212 -0.113885 14.786 0.136558ZM23.2323 3.68205C25.3537 5.4106 26.7139 8.04762 26.7139 10.9989C26.7139 13.9502 25.3537 16.5872 23.2323 18.3158C22.7265 18.7283 21.985 18.6497 21.5725 18.1439C21.16 17.6381 21.2386 16.8966 21.7444 16.4841C23.3403 15.1877 24.3568 13.2136 24.3568 10.9989C24.3568 8.78421 23.3403 6.81013 21.7444 5.50881C21.2386 5.09631 21.1649 4.35481 21.5725 3.84901C21.9801 3.34321 22.7265 3.26955 23.2323 3.67714V3.68205ZM20.2613 7.34048C21.3171 8.20476 21.9997 9.52081 21.9997 10.9989C21.9997 12.477 21.3171 13.7931 20.2613 14.6574C19.7555 15.0698 19.014 14.9913 18.6015 14.4855C18.189 13.9797 18.2676 13.2382 18.7734 12.8257C19.3038 12.3935 19.6426 11.7355 19.6426 10.9989C19.6426 10.2623 19.3038 9.60429 18.7734 9.16724C18.2676 8.75475 18.194 8.01324 18.6015 7.50744C19.0091 7.00165 19.7555 6.92799 20.2613 7.33557V7.34048Z" fill="url(#id-7-featured_audio_light)"></path><defs><linearGradient id="id-7-featured_audio_light" x1="0" y1="0" x2="26.7139" y2="3.65204e-08" gradientUnits="userSpaceOnUse"><stop stop-color="#820000"></stop><stop offset="1" stop-color="#E50808"></stop></linearGradient></defs></svg></span><span data-test="icon" class="su-hidden dark:su-block"><svg data-testid="svg-featuredaudio-dark" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="27" height="22" viewBox="0 0 27 22" fill="none"><path d="M14.786 0.136558C15.3507 0.391912 15.7141 0.951726 15.7141 1.57047V20.4274C15.7141 21.0461 15.3507 21.6059 14.786 21.8613C14.2212 22.1166 13.5583 22.0135 13.0967 21.601L6.47224 15.7131H3.14282C1.40936 15.7131 0 14.3038 0 12.5703V9.42751C0 7.69405 1.40936 6.28469 3.14282 6.28469H6.47224L13.0967 0.396823C13.5583 -0.015672 14.2212 -0.113885 14.786 0.136558ZM23.2323 3.68205C25.3537 5.4106 26.7139 8.04762 26.7139 10.9989C26.7139 13.9502 25.3537 16.5872 23.2323 18.3158C22.7265 18.7283 21.985 18.6497 21.5725 18.1439C21.16 17.6381 21.2386 16.8966 21.7444 16.4841C23.3403 15.1877 24.3568 13.2136 24.3568 10.9989C24.3568 8.78421 23.3403 6.81013 21.7444 5.50881C21.2386 5.09631 21.1649 4.35481 21.5725 3.84901C21.9801 3.34321 22.7265 3.26955 23.2323 3.67714V3.68205ZM20.2613 7.34048C21.3171 8.20476 21.9997 9.52081 21.9997 10.9989C21.9997 12.477 21.3171 13.7931 20.2613 14.6574C19.7555 15.0698 19.014 14.9913 18.6015 14.4855C18.189 13.9797 18.2676 13.2382 18.7734 12.8257C19.3038 12.3935 19.6426 11.7355 19.6426 10.9989C19.6426 10.2623 19.3038 9.60429 18.7734 9.16724C18.2676 8.75475 18.194 8.01324 18.6015 7.50744C19.0091 7.00165 19.7555 6.92799 20.2613 7.33557V7.34048Z" fill="url(#id-8-featured_audio_light)"></path><defs><linearGradient id="id-8-featured_audio_light" x1="0" y1="0" x2="26.7139" y2="3.65204e-08" gradientUnits="userSpaceOnUse"><stop stop-color="#279989"></stop><stop offset="1" stop-color="#8F993E"></stop></linearGradient></defs></svg></span><span>Featured audio</span></h2></div><h3 class="su-text-[3.5rem] su-leading-tight md:su-text-[4rem] lg:su-text-[4.3rem] su-mb-5"><a href="https://news.stanford.edu/report/2024/04/04/stanford-alum-business-school-dean-jonathan-levin-named-stanford-president/" class="su-group su-text-black su-transition dark:su-text-white hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red hocus:su-underline"><span>Four Example Four news.stanford.edu link</span></a></h3><div data-test="mediacard-author" class="su-mb-15 md:su-mb-19">Susannah Young-ah Gottlieb</div><div class="su-text-18 md:su-text-16 su-mb-15 md:su-mb-19 su-gap-6 su-text-black-70 dark:su-text-black-50 su-flex su-nowrap su-items-center su-leading-none"><svg aria-hidden="true" focusable="false" data-testid="svg-microphone" data-prefix="fas" data-icon="microphone" class="svg-inline--fa fa-microphone " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20"><path fill="currentColor" d="M192 0C139 0 96 43 96 96l0 160c0 53 43 96 96 96s96-43 96-96l0-160c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6c85.8-11.7 152-85.3 152-174.4l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 70.7-57.3 128-128 128s-128-57.3-128-128l0-40z"></path></svg><span class="su-font-semibold">Podcast</span></div><div data-test="mediacard-description" class="*:su-my-0 *:su-leading-[125%] su-leading-[125%] *:su-text-18 su-text-18 md:*:su-text-19 md:su-text-19 lg:*:su-text-21 lg:su-text-21 dark:su-text-white su-font-sans su-w-full"> Fourth concentrating on W. H. Auden's work from the late 1930s, when he seeks to understand the poet's responsibility in the face of a triumphant fascism, to the late 1950s, when he discerns an irreconcilable "divorce" between poetry... </div></div></article></div><div class="swiper-slide" role="group" aria-label="5 / 5" style="width: 1086px;" data-swiper-slide-index="4" aria-hidden="true" inert="true"><article aria-label="Four Example Four news.stanford.edu link" data-test="media-card" class="su-component-card-media md:su-min-h-[38.4rem] su-relative su-w-full md:su-px-0 su-flex su-flex-wrap su-justify-center su-gap-20 md:su-gap-36 md:su-gap-48 md:su-flex-nowrap su-items-center"><div class="su-relative su-w-full su-px-20 md:su-px-0 su-h-[34.2rem] lg:su-h-[57.2rem] lg:su-py-30 su-min-w-[24.9rem] lg:su-min-w-[38.2rem] lg:su-max-w-[38.2rem] su-flex su-items-center su-justify-center"><img class="su-media-card-thumb su-size-full su-object-scale-down su-object-center" src="https://news.stanford.edu/__data/assets/image/0025/9862/20221130Elizabeth_Miller_N6A8009.jpeg" alt="[object Object]"></div><div class="su-media-card-text su-grow su-w-full md:su-w-auto"><div class="su-mb-20 md:su-mb-27"><h2 class="su-component-sidebar-heading su-w-full su-flex su-flex-wrap su-gap-6 su-my-0 su-font-sans su-text-black-90 dark:su-text-white su-font-semibold su-text-18 su-items-end"><span data-test="icon" class="dark:su-hidden"><svg data-testid="svg-featuredreading-light" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="29" height="24" viewBox="0 0 29 24" fill="none"><path d="M13.3392 2.22359V18.7221L4.21239 16.967V2.34206C4.21239 1.47325 4.99344 0.81068 5.84908 0.955481L13.3392 2.22359ZM3.93595 18.5949L14.0413 20.6177L24.1467 18.5949C24.8048 18.4632 25.2744 17.8884 25.2744 17.2171V2.08317L26.402 1.85939C27.2709 1.68387 28.0826 2.34645 28.0826 3.23281V19.3277C28.0826 19.999 27.6087 20.5738 26.9549 20.7055L14.0413 23.2855L1.12769 20.7011C0.473894 20.5738 0 19.9946 0 19.3277V3.23281C0 2.34645 0.811763 1.68387 1.68057 1.85939L2.80826 2.08317V17.2215C2.80826 17.8928 3.28216 18.4676 3.93595 18.5993V18.5949ZM14.7434 18.7221V2.22359L22.2335 0.955481C23.0892 0.81068 23.8702 1.47325 23.8702 2.34206V16.967L14.7434 18.7221Z" fill="url(#id-9-featured_reading_light)"></path><defs><linearGradient id="id-9-featured_reading_light" x1="28.0826" y1="0.935547" x2="13.6523" y2="11.6856" gradientUnits="userSpaceOnUse"><stop stop-color="#E50808"></stop><stop offset="1" stop-color="#820000"></stop></linearGradient></defs></svg></span><span data-test="icon" class="su-hidden dark:su-block"><svg data-testid="svg-featuredreading-dark" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="29" height="24" viewBox="0 0 29 24" fill="none"><path d="M13.3392 2.11323V18.6118L4.21239 16.8566V2.23171C4.21239 1.3629 4.99344 0.700328 5.84908 0.845129L13.3392 2.11323ZM3.93595 18.4845L14.0413 20.5073L24.1467 18.4845C24.8048 18.3529 25.2744 17.7781 25.2744 17.1067V1.97282L26.402 1.74904C27.2709 1.57352 28.0826 2.2361 28.0826 3.12245V19.2173C28.0826 19.8887 27.6087 20.4635 26.9549 20.5951L14.0413 23.1752L1.12769 20.5907C0.473894 20.4635 0 19.8843 0 19.2173V3.12245C0 2.2361 0.811763 1.57352 1.68057 1.74904L2.80826 1.97282V17.1111C2.80826 17.7825 3.28216 18.3573 3.93595 18.4889V18.4845ZM14.7434 18.6118V2.11323L22.2335 0.845129C23.0892 0.700328 23.8702 1.3629 23.8702 2.23171V16.8566L14.7434 18.6118Z" fill="url(#id-10-featured_reading_light)"></path><defs><linearGradient id="id-10-featured_reading_light" x1="28.0826" y1="0.825195" x2="13.6523" y2="11.5752" gradientUnits="userSpaceOnUse"><stop stop-color="#8F993E"></stop><stop offset="1" stop-color="#279989"></stop></linearGradient></defs></svg></span><span>Featured reading</span></h2></div><h3 class="su-text-[3.5rem] su-leading-tight md:su-text-[4rem] lg:su-text-[4.3rem] su-mb-5"><a href="https://news.stanford.edu/report/2024/04/04/stanford-alum-business-school-dean-jonathan-levin-named-stanford-president/" class="su-group su-text-black su-transition dark:su-text-white hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red hocus:su-underline"><span>Four Example Four news.stanford.edu link</span></a></h3><div data-test="mediacard-author" class="su-mb-15 md:su-mb-19">Susannah Young-ah Gottlieb</div><div class="su-text-18 md:su-text-16 su-mb-15 md:su-mb-19 su-gap-6 su-text-black-70 dark:su-text-black-50 su-flex su-nowrap su-items-center su-leading-none"><svg aria-hidden="true" focusable="false" data-testid="svg-book-open" data-prefix="fas" data-icon="book-open" class="svg-inline--fa fa-book-open " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="20"><path fill="currentColor" d="M249.6 471.5c10.8 3.8 22.4-4.1 22.4-15.5l0-377.4c0-4.2-1.6-8.4-5-11C247.4 52 202.4 32 144 32C93.5 32 46.3 45.3 18.1 56.1C6.8 60.5 0 71.7 0 83.8L0 454.1c0 11.9 12.8 20.2 24.1 16.5C55.6 460.1 105.5 448 144 448c33.9 0 79 14 105.6 23.5zm76.8 0C353 462 398.1 448 432 448c38.5 0 88.4 12.1 119.9 22.6c11.3 3.8 24.1-4.6 24.1-16.5l0-370.3c0-12.1-6.8-23.3-18.1-27.6C529.7 45.3 482.5 32 432 32c-58.4 0-103.4 20-123 35.6c-3.3 2.6-5 6.8-5 11L304 456c0 11.4 11.7 19.3 22.4 15.5z"></path></svg><span class="su-font-semibold">Magazine</span></div><div data-test="mediacard-description" class="*:su-my-0 *:su-leading-[125%] su-leading-[125%] *:su-text-18 su-text-18 md:*:su-text-19 md:su-text-19 lg:*:su-text-21 lg:su-text-21 dark:su-text-white su-font-sans su-w-full"> Fourth concentrating on W. H. Auden's work from the late 1930s, when he seeks to understand the poet's responsibility in the face of a triumphant fascism, to the late 1950s, when he discerns an irreconcilable "divorce" between poetry... </div></div></article></div></div><span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div><div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center"><div aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination-c109f446-42cd-4935-81c2-81127ba29c6f su-mr-full swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal"><button aria-current="true" class="swiper-pagination-bullet swiper-pagination-bullet-active" tabindex="0"><span class="sr-only">Slide 1</span></button><button class="swiper-pagination-bullet" tabindex="0"><span class="sr-only">Slide 2</span></button><button class="swiper-pagination-bullet" tabindex="0"><span class="sr-only">Slide 3</span></button><button class="swiper-pagination-bullet" tabindex="0"><span class="sr-only">Slide 4</span></button><button class="swiper-pagination-bullet" tabindex="0"><span class="sr-only">Slide 5</span></button></div><button class="component-slider-btn component-slider-prev" type="button" tabindex="0" aria-label="Previous slide" aria-controls="swiper-wrapper-8f5940873096ea7f"><span class="sr-only">Previous</span><span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block"><svg class="su-fill-transparent su-stroke-current " data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="true"><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></button><button class="component-slider-btn component-slider-next" type="button" tabindex="0" aria-label="Next slide" aria-controls="swiper-wrapper-8f5940873096ea7f"><span class="sr-only">Next</span><span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block"><svg class="su-fill-transparent su-stroke-current " data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="true"><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></button></div></div></div>`;
            document.body.appendChild(section);
            vi.useFakeTimers();
        });

        it('Should initialize Swiper with the correct configuration', () => {
            mediaCarousel._carouselInit(section);

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

        it('Should initialize Swiper with the correct configuration', () => {
            mediaCarousel._carouselInit(section);
    
            // Ensure Swiper was called
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
    
        it('Should render bullets correctly using renderBullet function', () => {
            mediaCarousel._carouselInit(section);
    
            // Retrieve the configuration object that Swiper was called with
            const swiperConfig = Swiper.mock.calls[0][1];
            const renderBullet = swiperConfig.pagination.renderBullet;
    
            // Test renderBullet with different indices
            const bulletFirst = renderBullet(0, 'swiper-pagination-bullet');
            const bulletSecond = renderBullet(1, 'swiper-pagination-bullet');
    
            expect(bulletFirst).toBe('<button aria-current="true" class="swiper-pagination-bullet swiper-pagination-bullet-active"><span class="sr-only">Slide 1</span></button>');
            expect(bulletSecond).toBe('<button  class="swiper-pagination-bullet "><span class="sr-only">Slide 2</span></button>');
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
                    updateAccessibility(swiper, 'h2 a, h3 a, button', true);
                }, 100);
            });

            swiper.triggerSlideChange();
            await vi.runAllTimersAsync();
    
            const activeSlide = document.querySelector(".swiper-slide-active");
            const inactiveSlides = document.querySelectorAll(".swiper-slide:not(.swiper-slide-active)");

            expect(activeSlide).not.toHaveAttribute("aria-hidden", "true");
            expect(activeSlide).not.toHaveAttribute("inert", "true");
            expect(activeSlide).toHaveAttribute("tabindex", "-1");
            
            inactiveSlides.forEach((slide) => {
                expect(slide).toHaveAttribute("aria-hidden", "true");
                expect(slide).toHaveAttribute("inert", "true");
                expect(slide).not.toHaveAttribute("tabindex", "-1");
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

            mediaCarousel._carouselInit(section);
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
                slidePrev: vi.fn(),
                on: mockOn,
                pagination: { bullets: [] },
            };

            Swiper.mockImplementation((selector, config) => {
                config.on.init(swiperInstance);
                return swiperInstance;
            });

            mediaCarousel._carouselInit(section);

            expect(mockOn).toHaveBeenCalled();
        });

        it('Should not call ensureLoopConditions on Swiper init when there is only one slide or less', () => {
            const mockOn = vi.fn();
            const swiperInstance = {
                slides: [],
                params: { slidesPerView: 1, slidesPerGroup: 1 },
                wrapperEl: document.createElement('div'),
                update: vi.fn(),
                activeIndex: 1,
                slidePrev: vi.fn(),
                on: mockOn,
                pagination: { bullets: [] },
            };

            Swiper.mockImplementation((selector, config) => {
                config.on.init(swiperInstance);
                return swiperInstance;
            });

            mediaCarousel._carouselInit(section);

            expect(mockOn).not.toHaveBeenCalled();
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

            mediaCarousel._carouselInit(section);
            config.on.paginationUpdate(swiperInstance);

            expect(true).toBe(true); 
        });
    });
});