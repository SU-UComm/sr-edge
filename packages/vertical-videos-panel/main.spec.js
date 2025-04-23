import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { basicAssetUri, linkedHeadingService, uuid } from "../../global/js/utils";
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    uuid: vi.fn(),
    basicAssetUri: vi.fn(),
    linkedHeadingService: vi.fn(),
}));

describe('[Vertical Video Panel]', () => {
    const mockFnsCtx = { resolveUri: vi.fn() };

    const defaultMockData = {
        sectionConfiguration: {
            title: "Videos at Stanford",
            ctaText: "Watch all",
            ctaUrl: "matrix-asset://api-identifier/28192",
            ctaManualUrl: "https://news.stanford.edu/video",
            bgImage: "matrix-asset://api-identifier/9861",
            marginTop: "10",
            marginBottom: "10"
        },
        videos: [
            {
                heading: "The future of transparent tissue",
                youtubeId: "MrbhPacSTpg",
                videoImage: "matrix-asset://api-identifier/99100"
            },
            {
                heading: "Aboard the Western Flyer, Stanford students study science and literature",
                subheading: "The Western Flyer, the same fishing vessel that novelist John Steinbeck chartered to the Sea of Cortez, is restored and used as part of a three-week course for Stanford’s Sophomore College program.",
                youtubeId: "DImCsDKydLA",
                videoImage: "matrix-asset://api-identifier/128610"
            },
            {
                heading: "Highlights from Big Ideas in Sustainability with Jeanne Gang",
                subheading: "Jeanne Gang, architect and founding partner of Studio Gang, joined the Stanford Doerr School of Sustainability for a discussion on Jan. 16 about shaping healthy and livable communities through design.",
                youtubeId: "dW7Kcgtgp7E",
                videoImage: "matrix-asset://api-identifier/125800"
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
        it('Should throw an error when no parameters were provided', async () => {
            const result = await main();
            
            expect(result).toContain('<!-- Error occurred in the Vertical video panel component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when no info was provided', async () => {
            const result = await main(defaultMockData);

            expect(result).toBe('<!-- Error occurred in the Vertical video panel component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info do not have fns or ctx functions', async () => {
            const mockInfo = {}
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Vertical video panel component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fns or ctx is invalid', async () => {
            const mockInfo = { 
                fns: undefined, 
                ctx: undefined,
            };
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Vertical video panel component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when videos is not an array', async () => {
            const mockData = {
                ...defaultMockData,
                videos: 123
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Vertical video panel component: The "videos" field must be an array. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when videos is an empty array', async () => {
            const mockData = {
                ...defaultMockData,
                videos: []
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Vertical video panel component: The "videos" array cannot have less than 1 element. The 0 elements were received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when videos is an empty array', async () => {
            const mockData = {
                ...defaultMockData,
                videos: [ {
                    heading: "The future of transparent tissue",
                    youtubeId: "MrbhPacSTpg",
                    videoImage: "matrix-asset://api-identifier/99100"
                },
                {
                    heading: "Aboard the Western Flyer, Stanford students study science and literature",
                    subheading: "The Western Flyer, the same fishing vessel that novelist John Steinbeck chartered to the Sea of Cortez, is restored and used as part of a three-week course for Stanford’s Sophomore College program.",
                    youtubeId: "DImCsDKydLA",
                    videoImage: "matrix-asset://api-identifier/128610"
                },
                {
                    heading: "Highlights from Big Ideas in Sustainability with Jeanne Gang",
                    subheading: "Jeanne Gang, architect and founding partner of Studio Gang, joined the Stanford Doerr School of Sustainability for a discussion on Jan. 16 about shaping healthy and livable communities through design.",
                    youtubeId: "dW7Kcgtgp7E",
                    videoImage: "matrix-asset://api-identifier/125800"
                },
                {
                    heading: "The future of transparent tissue",
                    youtubeId: "MrbhPacSTpg",
                    videoImage: "matrix-asset://api-identifier/99100"
                },
                {
                    heading: "Aboard the Western Flyer, Stanford students study science and literature",
                    subheading: "The Western Flyer, the same fishing vessel that novelist John Steinbeck chartered to the Sea of Cortez, is restored and used as part of a three-week course for Stanford’s Sophomore College program.",
                    youtubeId: "DImCsDKydLA",
                    videoImage: "matrix-asset://api-identifier/128610"
                },
                {
                    heading: "Highlights from Big Ideas in Sustainability with Jeanne Gang",
                    subheading: "Jeanne Gang, architect and founding partner of Studio Gang, joined the Stanford Doerr School of Sustainability for a discussion on Jan. 16 about shaping healthy and livable communities through design.",
                    youtubeId: "dW7Kcgtgp7E",
                    videoImage: "matrix-asset://api-identifier/125800"
                }]
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Vertical video panel component: The "videos" array cannot have more than 3 elements. The 6 elements were received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when title was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                sectionConfiguration: {
                    ...defaultMockData.sectionConfiguration,
                    title: 123
                }
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Vertical video panel component: The "title" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when ctaText was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                sectionConfiguration: {
                    ...defaultMockData.sectionConfiguration,
                    ctaText: 123
                }
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Vertical video panel component: The "ctaText" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when ctaUrl was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                sectionConfiguration: {
                    ...defaultMockData.sectionConfiguration,
                    ctaUrl: 123
                }
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Vertical video panel component: The "ctaUrl" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when ctaManualUrl was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                sectionConfiguration: {
                    ...defaultMockData.sectionConfiguration,
                    ctaManualUrl: 123
                }
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Vertical video panel component: The "ctaManualUrl" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when bgImage was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                sectionConfiguration: {
                    ...defaultMockData.sectionConfiguration,
                    bgImage: 123
                }
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Vertical video panel component: The "bgImage" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when marginTop was not one of ["default", "base", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]', async () => {
            const mockData = {
                ...defaultMockData,
                sectionConfiguration: {
                    ...defaultMockData.sectionConfiguration,
                    marginTop: 'test'
                }
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Vertical video panel component: The "marginTop" field cannot be undefined and must be one of ["default", "base", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]. The "test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when marginBottom was not one of ["default", "base", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]', async () => {
            const mockData = {
                ...defaultMockData,
                sectionConfiguration: {
                    ...defaultMockData.sectionConfiguration,
                    marginBottom: 'test'
                }
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Vertical video panel component: The "marginBottom" field cannot be undefined and must be one of ["default", "base", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]. The "test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

    });

    describe('[Main Function]', () => {
        beforeAll(() => {
            uuid.mockReturnValue('476f6893-b77b-43d8-ac8c-ac74d3d75dd7');
            basicAssetUri.mockResolvedValue({url: 'https://picsum.photos/400/400', attributes: { alt: 'image alt'}});
            linkedHeadingService.mockResolvedValue({
                title: "Sample Heading",
                ctaText: "Learn More",
                ctaLink: "https://example.com",
                ctaNewWindow: false
            }); 
        });

        it('Should return the expected HTML with valid data', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="vertical-video-panel" data-unique-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><div class="su-mx-auto su-component-container su-container-full su-rs-py-10 su-rs-mt-10 su-rs-mb-10 su-relative su-break-words"><div class="su-relative su-z-30"><div class="su-cc"><div class="su-component-line-heading su-flex su-flex-wrap su-items-baseline su-gap-5 su-gap-x-13 md:su-gap-13 2xl:su-px-[17rem] su-rs-mb-5"><h2 class="su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white su-text-white">Sample Heading</h2><hr aria-hidden="true" class="md:su-mb-11 lg:su-mb-15 su-grow su-border-none su-bg-gradient-light-red-h su-h-4"/><a data-test="cta" href="https://example.com" class="su-group su-flex su-no-underline hocus:su-underline su-transition su-items-center md:su-items-end md:su-mb-8 lg:su-mb-12 su-flex-nowrap su-align-baseline su-gap-20 md:su-gap-13 su-text-19 su-decoration-2 dark:su-text-white su-text-white hocus:su-text-white/95 dark:hocus:su-text-white/95"><span class="su-flex su-gap-2 su-items-baseline"><span>Learn More<!-- --><span class="sr-only">Sample Heading</span></span><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" class="svg-inline--fa fa-chevron-right fa-fw su-text-14 group-hocus:su-translate-x-02em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="18"><path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path></svg></span></a></div></div><div class="lg:su-hidden"><div class="component-slider su-slider-dark"><div class="swiper component-slider-single component-slider-vertical-videos component-slider-peek"><div class="swiper-wrapper"><div class="swiper-slide"><article class="su-relative su-flex su-flex-col su-text-white su-bg-black-true"><div class="su-absolute su-inset su-z-40 su-px-32 2xl:su-px-48 su-bottom-100 sm:su-bottom-120 lg:su-bottom-80 2xl:su-bottom-120 su-pointer-events-none su-text-center su-flex su-flex-col su-items-center su-w-full su-rs-mb-3"><h3 class="su-text-[3.6rem] sm:su-text-[4.8rem] lg:su-text-[3.6rem] 2xl:su-text-[4.8rem] su-leading-display su-mb-6">The future of transparent tissue</h3><p class="su-text-21 su-mb-0 su-leading-display xl:su-leading-snug"></p></div><div class="su-relative su-w-full"><button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16]"><img class="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="image alt"/><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none su-z-20" ></div><span class="su-absolute su-leading-none su-z-30 su-left-32 su-bottom-34 sm:su-left-48 sm:su-bottom-61 lg:su-left-32 lg:su-bottom-34 2xl:su-left-48 2xl:su-bottom-61 [&amp;&gt;svg]:su-text-[6rem] group-hocus:su-scale-110 su-transition-transform"><svg aria-hidden="true" focusable="false" data-testid=svg-circle-play data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg></span></span></button></div></article></div><div class="swiper-slide"><article class="su-relative su-flex su-flex-col su-text-white su-bg-black-true"><div class="su-absolute su-inset su-z-40 su-px-32 2xl:su-px-48 su-bottom-100 sm:su-bottom-120 lg:su-bottom-80 2xl:su-bottom-120 su-pointer-events-none su-text-center su-flex su-flex-col su-items-center su-w-full su-rs-mb-3"><h3 class="su-text-[3.6rem] sm:su-text-[4.8rem] lg:su-text-[3.6rem] 2xl:su-text-[4.8rem] su-leading-display su-mb-6">Aboard the Western Flyer, Stanford students study science and literature</h3><p class="su-text-21 su-mb-0 su-leading-display xl:su-leading-snug">The Western Flyer, the same fishing vessel that novelist John Steinbeck chartered to the Sea of Cortez, is restored and used as part of a three-week course for Stanford’s Sophomore College program.</p></div><div class="su-relative su-w-full"><button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16]"><img class="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="image alt"/><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none su-z-20" ></div><span class="su-absolute su-leading-none su-z-30 su-left-32 su-bottom-34 sm:su-left-48 sm:su-bottom-61 lg:su-left-32 lg:su-bottom-34 2xl:su-left-48 2xl:su-bottom-61 [&amp;&gt;svg]:su-text-[6rem] group-hocus:su-scale-110 su-transition-transform"><svg aria-hidden="true" focusable="false" data-testid=svg-circle-play data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg></span></span></button></div></article></div><div class="swiper-slide"><article class="su-relative su-flex su-flex-col su-text-white su-bg-black-true"><div class="su-absolute su-inset su-z-40 su-px-32 2xl:su-px-48 su-bottom-100 sm:su-bottom-120 lg:su-bottom-80 2xl:su-bottom-120 su-pointer-events-none su-text-center su-flex su-flex-col su-items-center su-w-full su-rs-mb-3"><h3 class="su-text-[3.6rem] sm:su-text-[4.8rem] lg:su-text-[3.6rem] 2xl:su-text-[4.8rem] su-leading-display su-mb-6">Highlights from Big Ideas in Sustainability with Jeanne Gang</h3><p class="su-text-21 su-mb-0 su-leading-display xl:su-leading-snug">Jeanne Gang, architect and founding partner of Studio Gang, joined the Stanford Doerr School of Sustainability for a discussion on Jan. 16 about shaping healthy and livable communities through design.</p></div><div class="su-relative su-w-full"><button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16]"><img class="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="image alt"/><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none su-z-20" ></div><span class="su-absolute su-leading-none su-z-30 su-left-32 su-bottom-34 sm:su-left-48 sm:su-bottom-61 lg:su-left-32 lg:su-bottom-34 2xl:su-left-48 2xl:su-bottom-61 [&amp;&gt;svg]:su-text-[6rem] group-hocus:su-scale-110 su-transition-transform"><svg aria-hidden="true" focusable="false" data-testid=svg-circle-play data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg></span></span></button></div></article></div></div><div class="swiper-pagination component-slider-pagination-\${uniqueClass}"></div></div><div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center"><nav aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination-476f6893-b77b-43d8-ac8c-ac74d3d75dd7 su-mr-full"></nav><button class="component-slider-btn component-slider-prev" type="button"><span class="sr-only">Previous</span><span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block"><svg class='su-fill-transparent su-stroke-current ' data-testid='svg-chevron-right' xmlns='http://www.w3.org/2000/svg' width='18' height='19' viewBox='0 0 18 19' fill='none' aria-hidden='true'><path d='M6.75 4.25L12 9.5L6.75 14.75' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' /></svg></span></button><button class="component-slider-btn component-slider-next" type="button"><span class="sr-only">Next</span><span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block"><svg class='su-fill-transparent su-stroke-current ' data-testid='svg-chevron-right' xmlns='http://www.w3.org/2000/svg' width='18' height='19' viewBox='0 0 18 19' fill='none' aria-hidden='true'><path d='M6.75 4.25L12 9.5L6.75 14.75' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' /></svg></span></button></div></div></div><div class="su-cc su-hidden lg:su-block"><div class="su-relative su-mx-auto su-flex su-justify-center su-gap-20 xl:su-gap-40 su-z-30 *:lg:su-basis-1/3"><article class="su-relative su-flex su-flex-col su-text-white su-bg-black-true"><div class="su-absolute su-inset su-z-40 su-px-32 2xl:su-px-48 su-bottom-100 sm:su-bottom-120 lg:su-bottom-80 2xl:su-bottom-120 su-pointer-events-none su-text-center su-flex su-flex-col su-items-center su-w-full su-rs-mb-3"><h3 class="su-text-[3.6rem] sm:su-text-[4.8rem] lg:su-text-[3.6rem] 2xl:su-text-[4.8rem] su-leading-display su-mb-6">The future of transparent tissue</h3><p class="su-text-21 su-mb-0 su-leading-display xl:su-leading-snug"></p></div><div class="su-relative su-w-full"><button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16]"><img class="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="image alt"/><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none su-z-20" ></div><span class="su-absolute su-leading-none su-z-30 su-left-32 su-bottom-34 sm:su-left-48 sm:su-bottom-61 lg:su-left-32 lg:su-bottom-34 2xl:su-left-48 2xl:su-bottom-61 [&amp;&gt;svg]:su-text-[6rem] group-hocus:su-scale-110 su-transition-transform"><svg aria-hidden="true" focusable="false" data-testid=svg-circle-play data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg></span></span></button></div></article><article class="su-relative su-flex su-flex-col su-text-white su-bg-black-true"><div class="su-absolute su-inset su-z-40 su-px-32 2xl:su-px-48 su-bottom-100 sm:su-bottom-120 lg:su-bottom-80 2xl:su-bottom-120 su-pointer-events-none su-text-center su-flex su-flex-col su-items-center su-w-full su-rs-mb-3"><h3 class="su-text-[3.6rem] sm:su-text-[4.8rem] lg:su-text-[3.6rem] 2xl:su-text-[4.8rem] su-leading-display su-mb-6">Aboard the Western Flyer, Stanford students study science and literature</h3><p class="su-text-21 su-mb-0 su-leading-display xl:su-leading-snug">The Western Flyer, the same fishing vessel that novelist John Steinbeck chartered to the Sea of Cortez, is restored and used as part of a three-week course for Stanford’s Sophomore College program.</p></div><div class="su-relative su-w-full"><button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16]"><img class="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="image alt"/><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none su-z-20" ></div><span class="su-absolute su-leading-none su-z-30 su-left-32 su-bottom-34 sm:su-left-48 sm:su-bottom-61 lg:su-left-32 lg:su-bottom-34 2xl:su-left-48 2xl:su-bottom-61 [&amp;&gt;svg]:su-text-[6rem] group-hocus:su-scale-110 su-transition-transform"><svg aria-hidden="true" focusable="false" data-testid=svg-circle-play data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg></span></span></button></div></article><article class="su-relative su-flex su-flex-col su-text-white su-bg-black-true"><div class="su-absolute su-inset su-z-40 su-px-32 2xl:su-px-48 su-bottom-100 sm:su-bottom-120 lg:su-bottom-80 2xl:su-bottom-120 su-pointer-events-none su-text-center su-flex su-flex-col su-items-center su-w-full su-rs-mb-3"><h3 class="su-text-[3.6rem] sm:su-text-[4.8rem] lg:su-text-[3.6rem] 2xl:su-text-[4.8rem] su-leading-display su-mb-6">Highlights from Big Ideas in Sustainability with Jeanne Gang</h3><p class="su-text-21 su-mb-0 su-leading-display xl:su-leading-snug">Jeanne Gang, architect and founding partner of Studio Gang, joined the Stanford Doerr School of Sustainability for a discussion on Jan. 16 about shaping healthy and livable communities through design.</p></div><div class="su-relative su-w-full"><button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16]"><img class="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="image alt"/><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none su-z-20" ></div><span class="su-absolute su-leading-none su-z-30 su-left-32 su-bottom-34 sm:su-left-48 sm:su-bottom-61 lg:su-left-32 lg:su-bottom-34 2xl:su-left-48 2xl:su-bottom-61 [&amp;&gt;svg]:su-text-[6rem] group-hocus:su-scale-110 su-transition-transform"><svg aria-hidden="true" focusable="false" data-testid=svg-circle-play data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg></span></span></button></div></article></div></div></div><img src="https://picsum.photos/400/400" alt="" class="su-absolute su-size-full su-inset-0 su-object-cover su-inset-0" /><div aria-hidden="true" class="su-absolute su-size-full su-inset-0 su-z-10 su-bg-black-true/75"></div></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span tabindex="0" data-focus-scope-start="true" aria-label="Watch The future of transparent tissue"></span><div aria-describedby="video-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="315" height="560" class="" src="https://www.youtube.com/embed/MrbhPacSTpg?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch The future of transparent tissue" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span tabindex="0" data-focus-scope-start="true" aria-label="Watch Aboard the Western Flyer, Stanford students study science and literature"></span><div aria-describedby="video-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="315" height="560" class="" src="https://www.youtube.com/embed/DImCsDKydLA?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch Aboard the Western Flyer, Stanford students study science and literature" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span tabindex="0" data-focus-scope-start="true" aria-label="Watch Highlights from Big Ideas in Sustainability with Jeanne Gang"></span><div aria-describedby="video-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="315" height="560" class="" src="https://www.youtube.com/embed/dW7Kcgtgp7E?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch Highlights from Big Ideas in Sustainability with Jeanne Gang" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
        });

    });


    describe('[Edge cases]', () => {
        beforeAll(() => {
            uuid.mockReturnValue('476f6893-b77b-43d8-ac8c-ac74d3d75dd7');
            basicAssetUri.mockResolvedValue({});   
        });

        afterEach(() => {
            uuid.mockClear();
            basicAssetUri.mockClear();
        });
        
        it('Should not pass section background when basicAssetUri will not return url', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="vertical-video-panel" data-unique-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><div class="su-mx-auto su-component-container su-container-full su-rs-mt-10 su-rs-mb-10 su-relative su-break-words"><div class="su-relative su-z-30"><div class="su-cc"><div class="su-component-line-heading su-flex su-flex-wrap su-items-baseline su-gap-5 su-gap-x-13 md:su-gap-13 2xl:su-px-[17rem] su-rs-mb-5"><h2 class="su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white su-text-black">Sample Heading</h2><hr aria-hidden="true" class="md:su-mb-11 lg:su-mb-15 su-grow su-border-none su-bg-gradient-light-red-h su-h-4"/><a data-test="cta" href="https://example.com" class="su-group su-flex su-no-underline hocus:su-underline su-transition su-items-center md:su-items-end md:su-mb-8 lg:su-mb-12 su-flex-nowrap su-align-baseline su-gap-20 md:su-gap-13 su-text-19 su-decoration-2 dark:su-text-white su-text-black hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red"><span class="su-flex su-gap-2 su-items-baseline"><span>Learn More<!-- --><span class="sr-only">Sample Heading</span></span><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" class="svg-inline--fa fa-chevron-right fa-fw su-text-14 group-hocus:su-translate-x-02em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="18"><path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path></svg></span></a></div></div><div class="lg:su-hidden"><div class="component-slider "><div class="swiper component-slider-single component-slider-vertical-videos component-slider-peek"><div class="swiper-wrapper"><div class="swiper-slide"><article class="su-relative su-flex su-flex-col su-text-white su-bg-black-true"><div class="su-absolute su-inset su-z-40 su-px-32 2xl:su-px-48 su-bottom-100 sm:su-bottom-120 lg:su-bottom-80 2xl:su-bottom-120 su-pointer-events-none su-text-center su-flex su-flex-col su-items-center su-w-full su-rs-mb-3"><h3 class="su-text-[3.6rem] sm:su-text-[4.8rem] lg:su-text-[3.6rem] 2xl:su-text-[4.8rem] su-leading-display su-mb-6">The future of transparent tissue</h3><p class="su-text-21 su-mb-0 su-leading-display xl:su-leading-snug"></p></div><div class="su-relative su-w-full"><button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16]"><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none su-z-20" ></div><span class="su-absolute su-leading-none su-z-30 su-left-32 su-bottom-34 sm:su-left-48 sm:su-bottom-61 lg:su-left-32 lg:su-bottom-34 2xl:su-left-48 2xl:su-bottom-61 [&amp;&gt;svg]:su-text-[6rem] group-hocus:su-scale-110 su-transition-transform"><svg aria-hidden="true" focusable="false" data-testid=svg-circle-play data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg></span></span></button></div></article></div><div class="swiper-slide"><article class="su-relative su-flex su-flex-col su-text-white su-bg-black-true"><div class="su-absolute su-inset su-z-40 su-px-32 2xl:su-px-48 su-bottom-100 sm:su-bottom-120 lg:su-bottom-80 2xl:su-bottom-120 su-pointer-events-none su-text-center su-flex su-flex-col su-items-center su-w-full su-rs-mb-3"><h3 class="su-text-[3.6rem] sm:su-text-[4.8rem] lg:su-text-[3.6rem] 2xl:su-text-[4.8rem] su-leading-display su-mb-6">Aboard the Western Flyer, Stanford students study science and literature</h3><p class="su-text-21 su-mb-0 su-leading-display xl:su-leading-snug">The Western Flyer, the same fishing vessel that novelist John Steinbeck chartered to the Sea of Cortez, is restored and used as part of a three-week course for Stanford’s Sophomore College program.</p></div><div class="su-relative su-w-full"><button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16]"><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none su-z-20" ></div><span class="su-absolute su-leading-none su-z-30 su-left-32 su-bottom-34 sm:su-left-48 sm:su-bottom-61 lg:su-left-32 lg:su-bottom-34 2xl:su-left-48 2xl:su-bottom-61 [&amp;&gt;svg]:su-text-[6rem] group-hocus:su-scale-110 su-transition-transform"><svg aria-hidden="true" focusable="false" data-testid=svg-circle-play data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg></span></span></button></div></article></div><div class="swiper-slide"><article class="su-relative su-flex su-flex-col su-text-white su-bg-black-true"><div class="su-absolute su-inset su-z-40 su-px-32 2xl:su-px-48 su-bottom-100 sm:su-bottom-120 lg:su-bottom-80 2xl:su-bottom-120 su-pointer-events-none su-text-center su-flex su-flex-col su-items-center su-w-full su-rs-mb-3"><h3 class="su-text-[3.6rem] sm:su-text-[4.8rem] lg:su-text-[3.6rem] 2xl:su-text-[4.8rem] su-leading-display su-mb-6">Highlights from Big Ideas in Sustainability with Jeanne Gang</h3><p class="su-text-21 su-mb-0 su-leading-display xl:su-leading-snug">Jeanne Gang, architect and founding partner of Studio Gang, joined the Stanford Doerr School of Sustainability for a discussion on Jan. 16 about shaping healthy and livable communities through design.</p></div><div class="su-relative su-w-full"><button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16]"><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none su-z-20" ></div><span class="su-absolute su-leading-none su-z-30 su-left-32 su-bottom-34 sm:su-left-48 sm:su-bottom-61 lg:su-left-32 lg:su-bottom-34 2xl:su-left-48 2xl:su-bottom-61 [&amp;&gt;svg]:su-text-[6rem] group-hocus:su-scale-110 su-transition-transform"><svg aria-hidden="true" focusable="false" data-testid=svg-circle-play data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg></span></span></button></div></article></div></div><div class="swiper-pagination component-slider-pagination-\${uniqueClass}"></div></div><div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center"><nav aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination-476f6893-b77b-43d8-ac8c-ac74d3d75dd7 su-mr-full"></nav><button class="component-slider-btn component-slider-prev" type="button"><span class="sr-only">Previous</span><span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block"><svg class='su-fill-transparent su-stroke-current ' data-testid='svg-chevron-right' xmlns='http://www.w3.org/2000/svg' width='18' height='19' viewBox='0 0 18 19' fill='none' aria-hidden='true'><path d='M6.75 4.25L12 9.5L6.75 14.75' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' /></svg></span></button><button class="component-slider-btn component-slider-next" type="button"><span class="sr-only">Next</span><span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block"><svg class='su-fill-transparent su-stroke-current ' data-testid='svg-chevron-right' xmlns='http://www.w3.org/2000/svg' width='18' height='19' viewBox='0 0 18 19' fill='none' aria-hidden='true'><path d='M6.75 4.25L12 9.5L6.75 14.75' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' /></svg></span></button></div></div></div><div class="su-cc su-hidden lg:su-block"><div class="su-relative su-mx-auto su-flex su-justify-center su-gap-20 xl:su-gap-40 su-z-30 *:lg:su-basis-1/3"><article class="su-relative su-flex su-flex-col su-text-white su-bg-black-true"><div class="su-absolute su-inset su-z-40 su-px-32 2xl:su-px-48 su-bottom-100 sm:su-bottom-120 lg:su-bottom-80 2xl:su-bottom-120 su-pointer-events-none su-text-center su-flex su-flex-col su-items-center su-w-full su-rs-mb-3"><h3 class="su-text-[3.6rem] sm:su-text-[4.8rem] lg:su-text-[3.6rem] 2xl:su-text-[4.8rem] su-leading-display su-mb-6">The future of transparent tissue</h3><p class="su-text-21 su-mb-0 su-leading-display xl:su-leading-snug"></p></div><div class="su-relative su-w-full"><button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16]"><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none su-z-20" ></div><span class="su-absolute su-leading-none su-z-30 su-left-32 su-bottom-34 sm:su-left-48 sm:su-bottom-61 lg:su-left-32 lg:su-bottom-34 2xl:su-left-48 2xl:su-bottom-61 [&amp;&gt;svg]:su-text-[6rem] group-hocus:su-scale-110 su-transition-transform"><svg aria-hidden="true" focusable="false" data-testid=svg-circle-play data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg></span></span></button></div></article><article class="su-relative su-flex su-flex-col su-text-white su-bg-black-true"><div class="su-absolute su-inset su-z-40 su-px-32 2xl:su-px-48 su-bottom-100 sm:su-bottom-120 lg:su-bottom-80 2xl:su-bottom-120 su-pointer-events-none su-text-center su-flex su-flex-col su-items-center su-w-full su-rs-mb-3"><h3 class="su-text-[3.6rem] sm:su-text-[4.8rem] lg:su-text-[3.6rem] 2xl:su-text-[4.8rem] su-leading-display su-mb-6">Aboard the Western Flyer, Stanford students study science and literature</h3><p class="su-text-21 su-mb-0 su-leading-display xl:su-leading-snug">The Western Flyer, the same fishing vessel that novelist John Steinbeck chartered to the Sea of Cortez, is restored and used as part of a three-week course for Stanford’s Sophomore College program.</p></div><div class="su-relative su-w-full"><button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16]"><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none su-z-20" ></div><span class="su-absolute su-leading-none su-z-30 su-left-32 su-bottom-34 sm:su-left-48 sm:su-bottom-61 lg:su-left-32 lg:su-bottom-34 2xl:su-left-48 2xl:su-bottom-61 [&amp;&gt;svg]:su-text-[6rem] group-hocus:su-scale-110 su-transition-transform"><svg aria-hidden="true" focusable="false" data-testid=svg-circle-play data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg></span></span></button></div></article><article class="su-relative su-flex su-flex-col su-text-white su-bg-black-true"><div class="su-absolute su-inset su-z-40 su-px-32 2xl:su-px-48 su-bottom-100 sm:su-bottom-120 lg:su-bottom-80 2xl:su-bottom-120 su-pointer-events-none su-text-center su-flex su-flex-col su-items-center su-w-full su-rs-mb-3"><h3 class="su-text-[3.6rem] sm:su-text-[4.8rem] lg:su-text-[3.6rem] 2xl:su-text-[4.8rem] su-leading-display su-mb-6">Highlights from Big Ideas in Sustainability with Jeanne Gang</h3><p class="su-text-21 su-mb-0 su-leading-display xl:su-leading-snug">Jeanne Gang, architect and founding partner of Studio Gang, joined the Stanford Doerr School of Sustainability for a discussion on Jan. 16 about shaping healthy and livable communities through design.</p></div><div class="su-relative su-w-full"><button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16]"><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none su-z-20" ></div><span class="su-absolute su-leading-none su-z-30 su-left-32 su-bottom-34 sm:su-left-48 sm:su-bottom-61 lg:su-left-32 lg:su-bottom-34 2xl:su-left-48 2xl:su-bottom-61 [&amp;&gt;svg]:su-text-[6rem] group-hocus:su-scale-110 su-transition-transform"><svg aria-hidden="true" focusable="false" data-testid=svg-circle-play data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg></span></span></button></div></article></div></div></div></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span tabindex="0" data-focus-scope-start="true" aria-label="Watch The future of transparent tissue"></span><div aria-describedby="video-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="315" height="560" class="" src="https://www.youtube.com/embed/MrbhPacSTpg?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch The future of transparent tissue" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span tabindex="0" data-focus-scope-start="true" aria-label="Watch Aboard the Western Flyer, Stanford students study science and literature"></span><div aria-describedby="video-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="315" height="560" class="" src="https://www.youtube.com/embed/DImCsDKydLA?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch Aboard the Western Flyer, Stanford students study science and literature" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span tabindex="0" data-focus-scope-start="true" aria-label="Watch Highlights from Big Ideas in Sustainability with Jeanne Gang"></span><div aria-describedby="video-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="315" height="560" class="" src="https://www.youtube.com/embed/dW7Kcgtgp7E?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch Highlights from Big Ideas in Sustainability with Jeanne Gang" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
        });
    });
});