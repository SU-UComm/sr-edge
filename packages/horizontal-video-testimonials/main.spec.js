import { beforeEach, describe, expect, it, vi } from 'vitest';
import { basicAssetUri } from "../../global/js/utils";
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    basicAssetUri: vi.fn(),
    uuid: vi.fn(),
    isRealExternalLink: vi.fn()
}));

describe('[Horizontal Video Testimonials]', () => {
    const mockFnsCtx = {
        resolveUri: vi.fn()
    };

    const defaultMockData = {
        sectionConfiguration: {
            title: "Meet more students",
            ctaText: "Watch all",
            ctaUrl: "matrix-asset://stanfordNews/28192",
            ctaManualUrl: "https://news.stanford.edu/video",
            bgImage: "matrix-asset://stanfordNews/9861",
            marginTop: "9",
            marginBottom: "9"
        },
        testimonials: [
            {
                heading: "Alma, Class of 2024",
                youtubeId: "LoUdz1saXJU",
                videoImage: "matrix-asset://stanfordNews/99100",
                description: "The master’s student and Knight-Hennessy scholar is challenging notions of what it means to be a scholar, a soldier and a pageant winner. “The greatest things in life lie on the other side of fear.”",
                manualStoryUrl: "https://news.stanford.edu/stories/2024/07/meet-alma-cooper-army-officer-data-scientist-and-miss-michigan"
            },
            {
                heading: "Adam, Class of 2024",
                youtubeId: "dx_-W5HIVOU",
                videoImage: "matrix-asset://stanfordNews/125800",
                description: "Adam Nayak, winner of the 2022 J.E. Wallace Sterling Award for outstanding leadership and service, will graduate in June with a bachelor’s degree in civil and environmental engineering and a minor in comparative studies in race and ethnicity.",
                internalStoryUrl: "matrix-asset://stanfordNews/28192"
            }
        ]
    };

    const defaultMockInfo = {
        fns: mockFnsCtx
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters was provided.', async () => {
            const result = await main();

            expect(result).toBe('<!-- Error occurred in the Horizontal Video Testimonials component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when no info was provided', async () => {
            const result = await main(defaultMockData);

            expect(result).toBe('<!-- Error occurred in the Horizontal Video Testimonials component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info do not have fns or ctx functions', async () => {
            const mockInfo = {test: 'test'}
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Horizontal Video Testimonials component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when fns or ctx is invalid', async () => {
            const mockInfo = { fns: undefined, ctx: undefined,  };
            const result = await main(defaultMockData, mockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Horizontal Video Testimonials component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should handle errors when title is not a string', async () => {
            const mockedData = {
                sectionConfiguration: {
                    ...defaultMockData.sectionConfiguration,
                    title: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Horizontal Video Testimonials component: The "title" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when ctaText is not a string', async () => {
            const mockedData = {
                sectionConfiguration: {
                    ...defaultMockData.sectionConfiguration,
                    ctaText: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Horizontal Video Testimonials component: The "ctaText" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when ctaUrl is not a string', async () => {
            const mockedData = {
                sectionConfiguration: {
                    ...defaultMockData.sectionConfiguration,
                    ctaUrl: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Horizontal Video Testimonials component: The "ctaUrl" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when ctaManualUrl is not a string', async () => {
            const mockedData = {
                sectionConfiguration: {
                    ...defaultMockData.sectionConfiguration,
                    ctaManualUrl: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Horizontal Video Testimonials component: The "ctaManualUrl" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when bgImage is not a string', async () => {
            const mockedData = {
                sectionConfiguration: {
                    ...defaultMockData.sectionConfiguration,
                    bgImage: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Horizontal Video Testimonials component: The "bgImage" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should throw an error when marginTop is not a one of ['default', 'base', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']", async () => {
            const mockedData = {
                sectionConfiguration: {
                    ...defaultMockData.sectionConfiguration,
                    marginTop: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
            
            expect(result).toBe('<!-- Error occurred in the Horizontal Video Testimonials component: The "marginTop" field must be one of ["default", "base", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should throw an error when marginBottom is not a one of ['default', 'base', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']", async () => {
            const mockedData = {
                sectionConfiguration: {
                    ...defaultMockData.sectionConfiguration,
                    marginBottom: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Horizontal Video Testimonials component: The "marginBottom" field must be one of ["default", "base", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when testimonials is not an array', async () => {
            const mockedData = {
                ...defaultMockData,
                testimonials: 123,
            };
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Horizontal Video Testimonials component: The "testimonials" field must be a non-empty array. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

    });

    describe('[Main Function]', () => {
        it('Should return the expected HTML with valid data', async () => {
            // Mocking basicAssetUri to return URL data
            basicAssetUri.mockResolvedValueOnce({ url: 'https://example.com' });
            basicAssetUri.mockResolvedValueOnce({ url: 'https://picsum.photos/400/400', attributes: { alt: 'Alt Text' } });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='horizontal-video-testimonials'><div class='su-mx-auto su-component-container su-container-full su-rs-py-10 su-rs-mt-9 su-rs-mb-9 su-relative su-overflow-hidden su-bg-black dark:su-bg-black-true' ><div class='su-mx-auto su-component-container su-cc su-relative su-z-30' ><div class="su-component-line-heading su-flex su-flex-wrap su-items-baseline su-gap-5 su-gap-x-13 md:su-gap-13 2xl:su-px-[17rem] su-rs-mb-5"><h2 class="su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white su-text-white" data-se="headingTitle">Meet more students</h2><hr aria-hidden="true" class="md:su-mb-11 lg:su-mb-15 su-grow su-border-none su-bg-gradient-light-red-h su-h-4"/><a data-test="cta" href="https://example.com" class="su-group su-flex su-no-underline hocus:su-underline su-transition su-items-center md:su-items-end md:su-mb-8 lg:su-mb-12 su-flex-nowrap su-align-baseline su-gap-20 md:su-gap-13 su-text-19 su-decoration-2 dark:su-text-white su-text-white hocus:su-text-white/95 dark:hocus:su-text-white/95"><span class="su-flex su-gap-2 su-items-baseline"><span data-se="headingCtaText">Watch all<span class="sr-only">Meet more students</span></span><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" class="svg-inline--fa fa-chevron-right fa-fw su-text-14 group-hocus:su-translate-x-02em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="18" ><path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path></svg></span></a></div><ul class="su-relative su-grid su-gap-20 su-z-30 su-list-unstyled *:su-mb-0"><li class="su-border-2 su-border-black"><article class="su-relative su-flex su-flex-col lg:su-flex-row su-gap-30 md:su-gap-38 2xl:su-gap-72 su-items-start lg:su-items-center su-p-34 md:su-p-61 lg:su-p-38 2xl:su-pl-76 su-bg-white dark:su-bg-black-true su-text-black dark:su-text-white"><div class="su-relative su-w-full lg:su-basis-[50%] xl:su-basis-[40%] 2xl:su-basis-[30%]"><h3 class="su-type-3 su-leading-display su-rs-mb-0 "><a href="https://news.stanford.edu/stories/2024/07/meet-alma-cooper-army-officer-data-scientist-and-miss-michigan" class="su-group su-stretched-link su-no-underline hocus:su-underline dark:su-text-white dark:hocus:su-text-dark-mode-red focus:su-outline-none su-text-black hocus:su-text-digital-red" rel= ><span data-se="hcardheading">Alma, Class of 2024</span></a></h3><div class="su-max-w-prose md:su-max-w-[45ch] lg:su-max-w-none su-card-paragraph *:last:su-mb-0 *:su-leading-display xl:*:su-leading-snug" data-se="hcarddescription">The master’s student and Knight-Hennessy scholar is challenging notions of what it means to be a scholar, a soldier and a pageant winner. “The greatest things in life lie on the other side of fear.”</div></div><div class="su-w-full lg:su-basis-[50%] xl:su-basis-[60%] 2xl:su-basis-[70%] su-relative focus-within:su-ring-4"><button class="su-z-100 su-component-card-thumbnail su-group su-block su-relative su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id=""><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block  su-aspect-[16/9]"><span class="su-absolute su-leading-none su-left-13 su-bottom-13 md:su-left-27 md:su-bottom-27 [&amp;&gt;svg]:su-text-[4rem] [&amp;&gt;svg]:md:su-text-[6rem] group-hocus:su-scale-110 su-transition-transform"><svg aria-hidden="true" focusable="false" data-testid=svg-circle-play data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" ><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg></span></span></button></div></article></li><li class="su-border-2 su-border-black"><article class="su-relative su-flex su-flex-col lg:su-flex-row su-gap-30 md:su-gap-38 2xl:su-gap-72 su-items-start lg:su-items-center su-p-34 md:su-p-61 lg:su-p-38 2xl:su-pl-76 su-bg-white dark:su-bg-black-true su-text-black dark:su-text-white"><div class="su-relative su-w-full lg:su-basis-[50%] xl:su-basis-[40%] 2xl:su-basis-[30%]"><h3 class="su-type-3 su-leading-display su-rs-mb-0 "><span data-se="hcardheading">Adam, Class of 2024</span></h3><div class="su-max-w-prose md:su-max-w-[45ch] lg:su-max-w-none su-card-paragraph *:last:su-mb-0 *:su-leading-display xl:*:su-leading-snug" data-se="hcarddescription">Adam Nayak, winner of the 2022 J.E. Wallace Sterling Award for outstanding leadership and service, will graduate in June with a bachelor’s degree in civil and environmental engineering and a minor in comparative studies in race and ethnicity.</div></div><div class="su-w-full lg:su-basis-[50%] xl:su-basis-[60%] 2xl:su-basis-[70%] su-relative focus-within:su-ring-4"><button class="su-z-100 su-component-card-thumbnail su-group su-block su-relative su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id=""><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block  su-aspect-[16/9]"><span class="su-absolute su-leading-none su-left-13 su-bottom-13 md:su-left-27 md:su-bottom-27 [&amp;&gt;svg]:su-text-[4rem] [&amp;&gt;svg]:md:su-text-[6rem] group-hocus:su-scale-110 su-transition-transform"><svg aria-hidden="true" focusable="false" data-testid=svg-circle-play data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" ><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg></span></span></button></div></article></li></ul></div><img src="https://picsum.photos/400/400" alt="" class="su-absolute su-size-full su-object-cover su-inset-0" /><div aria-hidden="true" class="su-absolute su-size-full su-inset-0 su-z-10 su-bg-gradient-to-b su-from-black-true/75 su-to-black-true/60"></div></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id=""><span tabindex="0" data-focus-scope-start="true" aria-label="Watch Alma, Class of 2024"></span><div aria-describedby="video-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="315" height="560" class="" src="https://www.youtube.com/embed/LoUdz1saXJU?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch Alma, Class of 2024" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id=""><span tabindex="0" data-focus-scope-start="true" aria-label="Watch Adam, Class of 2024"></span><div aria-describedby="video-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="315" height="560" class="" src="https://www.youtube.com/embed/dx_-W5HIVOU?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch Adam, Class of 2024" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
        });
        
        it('Should return the expected HTML with basicAssetUri return empty object', async () => {
            // Mocking basicAssetUri to return URL data
            basicAssetUri.mockResolvedValue({});

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='horizontal-video-testimonials'><div class='su-mx-auto su-component-container su-container-full su-rs-py-0 su-rs-mt-9 su-rs-mb-9 su-relative su-overflow-hidden su-bg-black dark:su-bg-black-true' ><div class='su-mx-auto su-component-container su-cc su-relative su-z-30' ><div class="su-component-line-heading su-flex su-flex-wrap su-items-baseline su-gap-5 su-gap-x-13 md:su-gap-13 2xl:su-px-[17rem] su-rs-mb-5"><h2 class="su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white su-text-white" data-se="headingTitle">Meet more students</h2><hr aria-hidden="true" class="md:su-mb-11 lg:su-mb-15 su-grow su-border-none su-bg-gradient-light-red-h su-h-4"/><a data-test="cta" href="https://news.stanford.edu/video" class="su-group su-flex su-no-underline hocus:su-underline su-transition su-items-center md:su-items-end md:su-mb-8 lg:su-mb-12 su-flex-nowrap su-align-baseline su-gap-20 md:su-gap-13 su-text-19 su-decoration-2 dark:su-text-white su-text-white hocus:su-text-white/95 dark:hocus:su-text-white/95"><span class="su-flex su-gap-2 su-items-baseline"><span data-se="headingCtaText">Watch all<span class="sr-only">Meet more students</span></span><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" class="svg-inline--fa fa-chevron-right fa-fw su-text-14 group-hocus:su-translate-x-02em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="18" ><path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path></svg></span></a></div><ul class="su-relative su-grid su-gap-20 su-z-30 su-list-unstyled *:su-mb-0"><li class="su-border-2 su-border-black"><article class="su-relative su-flex su-flex-col lg:su-flex-row su-gap-30 md:su-gap-38 2xl:su-gap-72 su-items-start lg:su-items-center su-p-34 md:su-p-61 lg:su-p-38 2xl:su-pl-76 su-bg-white dark:su-bg-black-true su-text-black dark:su-text-white"><div class="su-relative su-w-full lg:su-basis-[50%] xl:su-basis-[40%] 2xl:su-basis-[30%]"><h3 class="su-type-3 su-leading-display su-rs-mb-0 "><a href="https://news.stanford.edu/stories/2024/07/meet-alma-cooper-army-officer-data-scientist-and-miss-michigan" class="su-group su-stretched-link su-no-underline hocus:su-underline dark:su-text-white dark:hocus:su-text-dark-mode-red focus:su-outline-none su-text-black hocus:su-text-digital-red" rel= ><span data-se="hcardheading">Alma, Class of 2024</span></a></h3><div class="su-max-w-prose md:su-max-w-[45ch] lg:su-max-w-none su-card-paragraph *:last:su-mb-0 *:su-leading-display xl:*:su-leading-snug" data-se="hcarddescription">The master’s student and Knight-Hennessy scholar is challenging notions of what it means to be a scholar, a soldier and a pageant winner. “The greatest things in life lie on the other side of fear.”</div></div><div class="su-w-full lg:su-basis-[50%] xl:su-basis-[60%] 2xl:su-basis-[70%] su-relative focus-within:su-ring-4"><button class="su-z-100 su-component-card-thumbnail su-group su-block su-relative su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id=""><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block  su-aspect-[16/9]"><span class="su-absolute su-leading-none su-left-13 su-bottom-13 md:su-left-27 md:su-bottom-27 [&amp;&gt;svg]:su-text-[4rem] [&amp;&gt;svg]:md:su-text-[6rem] group-hocus:su-scale-110 su-transition-transform"><svg aria-hidden="true" focusable="false" data-testid=svg-circle-play data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" ><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg></span></span></button></div></article></li><li class="su-border-2 su-border-black"><article class="su-relative su-flex su-flex-col lg:su-flex-row su-gap-30 md:su-gap-38 2xl:su-gap-72 su-items-start lg:su-items-center su-p-34 md:su-p-61 lg:su-p-38 2xl:su-pl-76 su-bg-white dark:su-bg-black-true su-text-black dark:su-text-white"><div class="su-relative su-w-full lg:su-basis-[50%] xl:su-basis-[40%] 2xl:su-basis-[30%]"><h3 class="su-type-3 su-leading-display su-rs-mb-0 "><span data-se="hcardheading">Adam, Class of 2024</span></h3><div class="su-max-w-prose md:su-max-w-[45ch] lg:su-max-w-none su-card-paragraph *:last:su-mb-0 *:su-leading-display xl:*:su-leading-snug" data-se="hcarddescription">Adam Nayak, winner of the 2022 J.E. Wallace Sterling Award for outstanding leadership and service, will graduate in June with a bachelor’s degree in civil and environmental engineering and a minor in comparative studies in race and ethnicity.</div></div><div class="su-w-full lg:su-basis-[50%] xl:su-basis-[60%] 2xl:su-basis-[70%] su-relative focus-within:su-ring-4"><button class="su-z-100 su-component-card-thumbnail su-group su-block su-relative su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id=""><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block  su-aspect-[16/9]"><span class="su-absolute su-leading-none su-left-13 su-bottom-13 md:su-left-27 md:su-bottom-27 [&amp;&gt;svg]:su-text-[4rem] [&amp;&gt;svg]:md:su-text-[6rem] group-hocus:su-scale-110 su-transition-transform"><svg aria-hidden="true" focusable="false" data-testid=svg-circle-play data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" ><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg></span></span></button></div></article></li></ul></div></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id=""><span tabindex="0" data-focus-scope-start="true" aria-label="Watch Alma, Class of 2024"></span><div aria-describedby="video-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="315" height="560" class="" src="https://www.youtube.com/embed/LoUdz1saXJU?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch Alma, Class of 2024" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id=""><span tabindex="0" data-focus-scope-start="true" aria-label="Watch Adam, Class of 2024"></span><div aria-describedby="video-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="315" height="560" class="" src="https://www.youtube.com/embed/dx_-W5HIVOU?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch Adam, Class of 2024" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
        });
    });
});
