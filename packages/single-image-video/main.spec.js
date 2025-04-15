import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { basicAssetUri, uuid } from "../../global/js/utils";
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    uuid: vi.fn(),
    basicAssetUri: vi.fn(),
}));

describe('[Single Image or Video]', () => {
    const mockFnsCtx = { resolveUri: vi.fn() };

    const defaultMockData = {
        section: {
            title: "Single image or video title is centered",
            summary: "<p>Balch, an experimental physicist in the Dionne lab at Stanford, has developed a thumbnail-sized optical sensor that can track the health of marine ecosystems in near-real time through quick detection of environmental DNA. It could be a critical tool for natural resource managers in the face of climate change impacts like coral bleaching, warming seas, and migration of species.</p>",
            summaryAlign: "left"
        },
        image: "matrix-asset://api-identifier/99100",
        caption: "Caption text goes here lorem ipsum dolor sit amet",
        credit: "Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit",
        width: "Wide",
        video: {
            heading: "This is a test title",
            vimeoid: "908030173",
            youtubeid: "dYdi0Aek664"
        },
        marginTop: "default",
        marginBottom: "default"
    };

    const defaultMockInfo = {
        env: {
            API_IDENTIFIER: 'sample-api',
            BASE_DOMAIN: 'https://example.com',
        },
        fns: mockFnsCtx
    };
    
    beforeEach(() => {
        vi.clearAllMocks();
    });
    
    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters were provided', async () => {
            const result = await main();
            
            expect(result).toContain('<!-- Error occurred in the Single Image or Video component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info was provided', async () => {
            const result = await main(defaultMockData);

            expect(result).toBe('<!-- Error occurred in the Single Image or Video component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info do not have fns, ctx or env functions', async () => {
            const mockInfo = {}
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Single Image or Video component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when API_IDENTIFIER was not provided', async () => {
            const mockInfo = {
                env: {
                    ...defaultMockInfo.env,
                    API_IDENTIFIER: undefined
                }
            }

            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Single Image or Video component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when API_IDENTIFIER was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        ...defaultMockInfo.env,
                        API_IDENTIFIER: undefined
                    }
                }
            }

            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Single Image or Video component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when BASE_DOMAIN was not provided', async () => {
            const mockInfo = {
                ...defaultMockInfo,
                env: {
                    ...defaultMockInfo.env,
                    BASE_DOMAIN: undefined
                }
            }

            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Single Image or Video component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when BASE_DOMAIN was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        ...defaultMockInfo.env,
                        BASE_DOMAIN: undefined
                    }
                }
            }

            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Single Image or Video component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw error when fns or ctx is invalid', async () => {
            const mockInfo = { 
                env: {
                    API_IDENTIFIER: 'sample-api',
                    BASE_DOMAIN: 'https://example.com',
                },
                fns: undefined, 
                ctx: undefined,
            };
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Single Image or Video component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when title is not a string', async () => {
            const mockData = {
                ...defaultMockData,
                section: {
                    ...defaultMockData.section,
                    title: 123
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Single Image or Video component: The "title" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when summary was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                section: {
                    ...defaultMockData.section,
                    summary: 123
                }
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Single Image or Video component: The "summary" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when summaryAlign was not one of ["left", "center"]', async () => {
            const mockData = {
                ...defaultMockData,
                section: {
                    ...defaultMockData.section,
                    summaryAlign: 'test'
                }
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Single Image or Video component: The "summaryAlign" field must be one of ["left", "center"]. The "test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when image was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                image: 123
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Single Image or Video component: The "image" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when caption was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                caption: 123
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Single Image or Video component: The "caption" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when credit was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                credit: 123
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Single Image or Video component: The "credit" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when width was not one of ["Wide", "Narrow"]', async () => {
            const mockData = {
                ...defaultMockData,
                width: 'test'
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Single Image or Video component: The "width" field must be one of ["Wide", "Narrow"]. The "test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when heading was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                video: {
                    ...defaultMockData.video,
                    heading: 123
                }
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Single Image or Video component: The "heading" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when vimeoid was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                video: {
                    ...defaultMockData.video,
                    vimeoid: 123
                }
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Single Image or Video component: The "vimeoid" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when youtubeid was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                video: {
                    ...defaultMockData.video,
                    youtubeid: 123
                }
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Single Image or Video component: The "youtubeid" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when marginTop was not one of ["default", "base", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]', async () => {
            const mockData = {
                ...defaultMockData,
                marginTop: 'test'
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Single Image or Video component: The "marginTop" field cannot be undefined and must be one of ["default", "base", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]. The "test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when marginBottom was not one of ["default", "base", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]', async () => {
            const mockData = {
                ...defaultMockData,
                marginBottom: 'test'
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Single Image or Video component: The "marginBottom" field cannot be undefined and must be one of ["default", "base", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]. The "test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

    });

    describe('[Main Function]', () => {
        beforeAll(() => {
            uuid.mockReturnValue('476f6893-b77b-43d8-ac8c-ac74d3d75dd7');
            basicAssetUri.mockResolvedValue({url: 'https://picsum.photos/400/400', attributes: { alt: 'image alt'}});
        });

        it('Should return the expected HTML with valid data', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="single-image-video"><div class="su-mx-auto su-component-container su-container-wide su-container-px"><section class="su-flex su-flex-col su-items-center"><div class="su-w-full md:su-max-w-[60.7rem] lg:su-max-w-[63.6rem] su-mx-auto su-rs-mb-3"><h2 class="su-text-center su-text-[3.5rem] su-leading-[4.179rem] su-font-bold md:su-text-[4.0rem] md:su-leading-[4.776rem] lg:su-text-[4.9rem] lg:su-leading-[6.37rem]">Single image or video title is centered</h2><div data-test="component-story-lead" class="su-text-left su-wysiwyg-content su-rs-mt-0 su-text-[1.8rem] su-leading-[2.25rem] su-mt-[1.5rem] md:su-text-[1.9rem] md:su-leading-[2.375rem] md:su-mt-[1.9rem] lg:su-text-[2.1rem] lg:su-leading-[2.625rem]"><p>Balch, an experimental physicist in the Dionne lab at Stanford, has developed a thumbnail-sized optical sensor that can track the health of marine ecosystems in near-real time through quick detection of environmental DNA. It could be a critical tool for natural resource managers in the face of climate change impacts like coral bleaching, warming seas, and migration of species.</p></div></div><div class="su-w-full su-aspect-[16/9] su-relative"><button data-click="open-modal" class="su-cursor-pointer su-absolute su-top-0 su-left-0 su-size-full su-play-scale" aria-haspopup="dialog" aria-label="Watch video" title="Watch video" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7" ><iframe src="https://player.vimeo.com/video/908030173?autoplay=0&loop=1&autopause=0&background=1" class="su-size-full su-absolute su-top-0 su-left-0 su-pointer-events-none" allow="autoplay; fullscreen" data-role="video-player" title="Watch This is a test title" ></iframe><span class="*:su-w-[40px] *:su-h-[40px] *:md:su-w-[60px] *:md:su-h-[60px] *:lg:su-w-[100px] *:lg:su-h-[100px] *:lg:su-size-100 lg:su-bottom-38 lg:su-left-38 su-play-button-icon su-play-btn su-transition-all su-absolute su-bottom-20 su-left-20 md:su-left-27 md:su-bottom-27 md:su-block"><svg data-testid='svg-videoplay' class='su-drop-shadow-[0px_14px_28px_rgba(0,0,0,0.20)] {classes}}' aria-hidden='true' width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' fill='white' /></svg></span></button></div><div class="su-flex su-gap-8 md:su-gap-22 su-w-full su-relative su-flex-col su-items-center lg:su-flex-row lg:su-items-start su-mt-8 md:su-mt-9 lg:su-mt-15"><div class="su-mx-auto su-flex su-justify-center su-w-full"><p class="dark:su-text-white su-m-0 su-text-14 su-max-w-[633px] su-leading-[16.72px] su-font-normal su-text-black-70 md:su-text-16 md:su-leading-[19.11px] md:su-text-left">Caption text goes here lorem ipsum dolor sit amet | Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit</p></div><button data-role="video-control" data-label-play="Play looping video" data-label-pause="Pause looping video" type="button" class="su-text-black-70 su-relative su-shrink-0 dark:su-text-white hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red hocus:su-underline"><span class="*:su-size-14 su-flex su-gap-6 su-items-center su-text-14 lg:su-top-0 lg:su-right-0"><svg data-testid='svg-videoplay' aria-hidden='true' width='30' height='30' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg' class='' data-control='play'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' /></svg> <svg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg' class='su-hidden' data-control='pause'><path d='M27.1875 15C27.1875 11.7677 25.9035 8.66774 23.6179 6.38214C21.3323 4.09654 18.2323 2.8125 15 2.8125C11.7677 2.8125 8.66774 4.09654 6.38214 6.38214C4.09654 8.66774 2.8125 11.7677 2.8125 15C2.8125 18.2323 4.09654 21.3323 6.38214 23.6179C8.66774 25.9035 11.7677 27.1875 15 27.1875C18.2323 27.1875 21.3323 25.9035 23.6179 23.6179C25.9035 21.3323 27.1875 18.2323 27.1875 15ZM0 15C0 11.0218 1.58035 7.20644 4.3934 4.3934C7.20644 1.58035 11.0218 0 15 0C18.9782 0 22.7936 1.58035 25.6066 4.3934C28.4196 7.20644 30 11.0218 30 15C30 18.9782 28.4196 22.7936 25.6066 25.6066C22.7936 28.4196 18.9782 30 15 30C11.0218 30 7.20644 28.4196 4.3934 25.6066C1.58035 22.7936 0 18.9782 0 15ZM13.125 10.7812V19.2188C13.125 19.998 12.498 20.625 11.7188 20.625C10.9395 20.625 10.3125 19.998 10.3125 19.2188V10.7812C10.3125 10.002 10.9395 9.375 11.7188 9.375C12.498 9.375 13.125 10.002 13.125 10.7812ZM19.6875 10.7812V19.2188C19.6875 19.998 19.0605 20.625 18.2812 20.625C17.502 20.625 16.875 19.998 16.875 19.2188V10.7812C16.875 10.002 17.502 9.375 18.2812 9.375C19.0605 9.375 19.6875 10.002 19.6875 10.7812Z' /></svg> Play looping video</span></button></div></section></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span tabindex="0" data-focus-scope-start="true"></span><div aria-describedby="video-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="315" height="560" class="" src="https://www.youtube.com/embed/dYdi0Aek664?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch This is a test title" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
        });

        it('Should return the expected HTML with no image', async () => {
            const mockData = {
                ...defaultMockData,
                image: undefined
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="single-image-video"><div class="su-mx-auto su-component-container su-container-wide su-container-px"><section class="su-flex su-flex-col su-items-center"><div class="su-w-full md:su-max-w-[60.7rem] lg:su-max-w-[63.6rem] su-mx-auto su-rs-mb-3"><h2 class="su-text-center su-text-[3.5rem] su-leading-[4.179rem] su-font-bold md:su-text-[4.0rem] md:su-leading-[4.776rem] lg:su-text-[4.9rem] lg:su-leading-[6.37rem]">Single image or video title is centered</h2><div data-test="component-story-lead" class="su-text-left su-wysiwyg-content su-rs-mt-0 su-text-[1.8rem] su-leading-[2.25rem] su-mt-[1.5rem] md:su-text-[1.9rem] md:su-leading-[2.375rem] md:su-mt-[1.9rem] lg:su-text-[2.1rem] lg:su-leading-[2.625rem]"><p>Balch, an experimental physicist in the Dionne lab at Stanford, has developed a thumbnail-sized optical sensor that can track the health of marine ecosystems in near-real time through quick detection of environmental DNA. It could be a critical tool for natural resource managers in the face of climate change impacts like coral bleaching, warming seas, and migration of species.</p></div></div><div class="su-w-full su-aspect-[16/9] su-relative"><button data-click="open-modal" class="su-cursor-pointer su-absolute su-top-0 su-left-0 su-size-full su-play-scale" aria-haspopup="dialog" aria-label="Watch video" title="Watch video" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7" ><iframe src="https://player.vimeo.com/video/908030173?autoplay=0&loop=1&autopause=0&background=1" class="su-size-full su-absolute su-top-0 su-left-0 su-pointer-events-none" allow="autoplay; fullscreen" data-role="video-player" title="Watch This is a test title" ></iframe><span class="*:su-w-[40px] *:su-h-[40px] *:md:su-w-[60px] *:md:su-h-[60px] *:lg:su-w-[100px] *:lg:su-h-[100px] *:lg:su-size-100 lg:su-bottom-38 lg:su-left-38 su-play-button-icon su-play-btn su-transition-all su-absolute su-bottom-20 su-left-20 md:su-left-27 md:su-bottom-27 md:su-block"><svg data-testid='svg-videoplay' class='su-drop-shadow-[0px_14px_28px_rgba(0,0,0,0.20)] {classes}}' aria-hidden='true' width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' fill='white' /></svg></span></button></div><div class="su-flex su-gap-8 md:su-gap-22 su-w-full su-relative su-flex-col su-items-center lg:su-flex-row lg:su-items-start su-mt-8 md:su-mt-9 lg:su-mt-15"><div class="su-mx-auto su-flex su-justify-center su-w-full"><p class="dark:su-text-white su-m-0 su-text-14 su-max-w-[633px] su-leading-[16.72px] su-font-normal su-text-black-70 md:su-text-16 md:su-leading-[19.11px] md:su-text-left">Caption text goes here lorem ipsum dolor sit amet | Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit</p></div><button data-role="video-control" data-label-play="Play looping video" data-label-pause="Pause looping video" type="button" class="su-text-black-70 su-relative su-shrink-0 dark:su-text-white hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red hocus:su-underline"><span class="*:su-size-14 su-flex su-gap-6 su-items-center su-text-14 lg:su-top-0 lg:su-right-0"><svg data-testid='svg-videoplay' aria-hidden='true' width='30' height='30' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg' class='' data-control='play'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' /></svg> <svg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg' class='su-hidden' data-control='pause'><path d='M27.1875 15C27.1875 11.7677 25.9035 8.66774 23.6179 6.38214C21.3323 4.09654 18.2323 2.8125 15 2.8125C11.7677 2.8125 8.66774 4.09654 6.38214 6.38214C4.09654 8.66774 2.8125 11.7677 2.8125 15C2.8125 18.2323 4.09654 21.3323 6.38214 23.6179C8.66774 25.9035 11.7677 27.1875 15 27.1875C18.2323 27.1875 21.3323 25.9035 23.6179 23.6179C25.9035 21.3323 27.1875 18.2323 27.1875 15ZM0 15C0 11.0218 1.58035 7.20644 4.3934 4.3934C7.20644 1.58035 11.0218 0 15 0C18.9782 0 22.7936 1.58035 25.6066 4.3934C28.4196 7.20644 30 11.0218 30 15C30 18.9782 28.4196 22.7936 25.6066 25.6066C22.7936 28.4196 18.9782 30 15 30C11.0218 30 7.20644 28.4196 4.3934 25.6066C1.58035 22.7936 0 18.9782 0 15ZM13.125 10.7812V19.2188C13.125 19.998 12.498 20.625 11.7188 20.625C10.9395 20.625 10.3125 19.998 10.3125 19.2188V10.7812C10.3125 10.002 10.9395 9.375 11.7188 9.375C12.498 9.375 13.125 10.002 13.125 10.7812ZM19.6875 10.7812V19.2188C19.6875 19.998 19.0605 20.625 18.2812 20.625C17.502 20.625 16.875 19.998 16.875 19.2188V10.7812C16.875 10.002 17.502 9.375 18.2812 9.375C19.0605 9.375 19.6875 10.002 19.6875 10.7812Z' /></svg> Play looping video</span></button></div></section></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span tabindex="0" data-focus-scope-start="true"></span><div aria-describedby="video-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="315" height="560" class="" src="https://www.youtube.com/embed/dYdi0Aek664?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch This is a test title" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
        });

        it('Should return the expected HTML with no vimeoid', async () => {
            const mockData = {
                ...defaultMockData,
                video: {
                    heading: "This is a test title",
                    youtubeid: "dYdi0Aek664"
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="single-image-video"><div class="su-mx-auto su-component-container su-container-wide su-container-px"><section class="su-flex su-flex-col su-items-center"><div class="su-w-full md:su-max-w-[60.7rem] lg:su-max-w-[63.6rem] su-mx-auto su-rs-mb-3"><h2 class="su-text-center su-text-[3.5rem] su-leading-[4.179rem] su-font-bold md:su-text-[4.0rem] md:su-leading-[4.776rem] lg:su-text-[4.9rem] lg:su-leading-[6.37rem]">Single image or video title is centered</h2><div data-test="component-story-lead" class="su-text-left su-wysiwyg-content su-rs-mt-0 su-text-[1.8rem] su-leading-[2.25rem] su-mt-[1.5rem] md:su-text-[1.9rem] md:su-leading-[2.375rem] md:su-mt-[1.9rem] lg:su-text-[2.1rem] lg:su-leading-[2.625rem]"><p>Balch, an experimental physicist in the Dionne lab at Stanford, has developed a thumbnail-sized optical sensor that can track the health of marine ecosystems in near-real time through quick detection of environmental DNA. It could be a critical tool for natural resource managers in the face of climate change impacts like coral bleaching, warming seas, and migration of species.</p></div></div><div class="su-w-full su-aspect-[16/9] su-relative"><button data-click="open-modal" class="su-cursor-pointer su-absolute su-top-0 su-left-0 su-size-full su-play-scale" aria-haspopup="dialog" aria-label="Watch video" title="Watch video" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7" ><img src="https://picsum.photos/400/400" alt="image alt" class="su-size-full" /><span class="*:su-w-[40px] *:su-h-[40px] *:md:su-w-[60px] *:md:su-h-[60px] *:lg:su-w-[100px] *:lg:su-h-[100px] *:lg:su-size-100 lg:su-bottom-38 lg:su-left-38 su-play-button-icon su-play-btn su-transition-all su-absolute su-bottom-20 su-left-20 md:su-left-27 md:su-bottom-27 md:su-block"><svg data-testid='svg-videoplay' class='su-drop-shadow-[0px_14px_28px_rgba(0,0,0,0.20)] {classes}}' aria-hidden='true' width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' fill='white' /></svg></span></button></div><div class="su-flex su-gap-8 md:su-gap-22 su-w-full su-relative su-flex-col su-items-center lg:su-flex-row lg:su-items-start su-mt-8 md:su-mt-9 lg:su-mt-15"><div class="su-mx-auto su-flex su-justify-center su-w-full"><p class="dark:su-text-white su-m-0 su-text-14 su-max-w-[633px] su-leading-[16.72px] su-font-normal su-text-black-70 md:su-text-16 md:su-leading-[19.11px] md:su-text-left">Caption text goes here lorem ipsum dolor sit amet | Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit</p></div></div></section></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span tabindex="0" data-focus-scope-start="true"></span><div aria-describedby="video-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="315" height="560" class="" src="https://www.youtube.com/embed/dYdi0Aek664?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch This is a test title" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
        });

        it('Should return the expected HTML with no youtubeid', async () => {
            const mockData = {
                ...defaultMockData,
                video: {
                    heading: "This is a test title",
                    vimeoid: "908030173"
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="single-image-video"><div class="su-mx-auto su-component-container su-container-wide su-container-px"><section class="su-flex su-flex-col su-items-center"><div class="su-w-full md:su-max-w-[60.7rem] lg:su-max-w-[63.6rem] su-mx-auto su-rs-mb-3"><h2 class="su-text-center su-text-[3.5rem] su-leading-[4.179rem] su-font-bold md:su-text-[4.0rem] md:su-leading-[4.776rem] lg:su-text-[4.9rem] lg:su-leading-[6.37rem]">Single image or video title is centered</h2><div data-test="component-story-lead" class="su-text-left su-wysiwyg-content su-rs-mt-0 su-text-[1.8rem] su-leading-[2.25rem] su-mt-[1.5rem] md:su-text-[1.9rem] md:su-leading-[2.375rem] md:su-mt-[1.9rem] lg:su-text-[2.1rem] lg:su-leading-[2.625rem]"><p>Balch, an experimental physicist in the Dionne lab at Stanford, has developed a thumbnail-sized optical sensor that can track the health of marine ecosystems in near-real time through quick detection of environmental DNA. It could be a critical tool for natural resource managers in the face of climate change impacts like coral bleaching, warming seas, and migration of species.</p></div></div><div class="su-w-full su-aspect-[16/9] su-relative"><iframe src="https://player.vimeo.com/video/908030173?autoplay=0&loop=1&autopause=0&background=1" class="su-size-full su-absolute su-top-0 su-left-0 su-pointer-events-none" allow="autoplay; fullscreen" data-role="video-player" title="Watch This is a test title" ></iframe></div><div class="su-flex su-gap-8 md:su-gap-22 su-w-full su-relative su-flex-col su-items-center lg:su-flex-row lg:su-items-start su-mt-8 md:su-mt-9 lg:su-mt-15"><div class="su-mx-auto su-flex su-justify-center su-w-full"><p class="dark:su-text-white su-m-0 su-text-14 su-max-w-[633px] su-leading-[16.72px] su-font-normal su-text-black-70 md:su-text-16 md:su-leading-[19.11px] md:su-text-left">Caption text goes here lorem ipsum dolor sit amet | Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit</p></div><button data-role="video-control" data-label-play="Play looping video" data-label-pause="Pause looping video" type="button" class="su-text-black-70 su-relative su-shrink-0 dark:su-text-white hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red hocus:su-underline"><span class="*:su-size-14 su-flex su-gap-6 su-items-center su-text-14 lg:su-top-0 lg:su-right-0"><svg data-testid='svg-videoplay' aria-hidden='true' width='30' height='30' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg' class='' data-control='play'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' /></svg> <svg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg' class='su-hidden' data-control='pause'><path d='M27.1875 15C27.1875 11.7677 25.9035 8.66774 23.6179 6.38214C21.3323 4.09654 18.2323 2.8125 15 2.8125C11.7677 2.8125 8.66774 4.09654 6.38214 6.38214C4.09654 8.66774 2.8125 11.7677 2.8125 15C2.8125 18.2323 4.09654 21.3323 6.38214 23.6179C8.66774 25.9035 11.7677 27.1875 15 27.1875C18.2323 27.1875 21.3323 25.9035 23.6179 23.6179C25.9035 21.3323 27.1875 18.2323 27.1875 15ZM0 15C0 11.0218 1.58035 7.20644 4.3934 4.3934C7.20644 1.58035 11.0218 0 15 0C18.9782 0 22.7936 1.58035 25.6066 4.3934C28.4196 7.20644 30 11.0218 30 15C30 18.9782 28.4196 22.7936 25.6066 25.6066C22.7936 28.4196 18.9782 30 15 30C11.0218 30 7.20644 28.4196 4.3934 25.6066C1.58035 22.7936 0 18.9782 0 15ZM13.125 10.7812V19.2188C13.125 19.998 12.498 20.625 11.7188 20.625C10.9395 20.625 10.3125 19.998 10.3125 19.2188V10.7812C10.3125 10.002 10.9395 9.375 11.7188 9.375C12.498 9.375 13.125 10.002 13.125 10.7812ZM19.6875 10.7812V19.2188C19.6875 19.998 19.0605 20.625 18.2812 20.625C17.502 20.625 16.875 19.998 16.875 19.2188V10.7812C16.875 10.002 17.502 9.375 18.2812 9.375C19.0605 9.375 19.6875 10.002 19.6875 10.7812Z' /></svg> Play looping video</span></button></div></section></div></section>"`);
        });

        it('Should return the expected HTML with no youtubeid and vimeoid', async () => {
            const mockData = {
                ...defaultMockData,
                video: {
                    heading: "This is a test title",
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="single-image-video"><div class="su-mx-auto su-component-container su-container-wide su-container-px"><section class="su-flex su-flex-col su-items-center"><div class="su-w-full md:su-max-w-[60.7rem] lg:su-max-w-[63.6rem] su-mx-auto su-rs-mb-3"><h2 class="su-text-center su-text-[3.5rem] su-leading-[4.179rem] su-font-bold md:su-text-[4.0rem] md:su-leading-[4.776rem] lg:su-text-[4.9rem] lg:su-leading-[6.37rem]">Single image or video title is centered</h2><div data-test="component-story-lead" class="su-text-left su-wysiwyg-content su-rs-mt-0 su-text-[1.8rem] su-leading-[2.25rem] su-mt-[1.5rem] md:su-text-[1.9rem] md:su-leading-[2.375rem] md:su-mt-[1.9rem] lg:su-text-[2.1rem] lg:su-leading-[2.625rem]"><p>Balch, an experimental physicist in the Dionne lab at Stanford, has developed a thumbnail-sized optical sensor that can track the health of marine ecosystems in near-real time through quick detection of environmental DNA. It could be a critical tool for natural resource managers in the face of climate change impacts like coral bleaching, warming seas, and migration of species.</p></div></div><div class="su-w-full su-aspect-[16/9] su-relative"><img src="https://picsum.photos/400/400" alt="image alt" class="su-w-full su-object-cover" /></div><div class="su-flex su-gap-8 md:su-gap-22 su-w-full su-relative su-flex-col su-items-center lg:su-flex-row lg:su-items-start su-mt-8 md:su-mt-9 lg:su-mt-15"><div class="su-mx-auto su-flex su-justify-center su-w-full"><p class="dark:su-text-white su-m-0 su-text-14 su-max-w-[633px] su-leading-[16.72px] su-font-normal su-text-black-70 md:su-text-16 md:su-leading-[19.11px] md:su-text-left">Caption text goes here lorem ipsum dolor sit amet | Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit</p></div></div></section></div></section>"`);
        });

        it('Should return the expected HTML with no title', async () => {
            const mockData = {
                ...defaultMockData,
                section: {
                    title: undefined,
                    summary: "<p> summary</p>"
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="single-image-video"><div class="su-mx-auto su-component-container su-container-wide su-container-px"><section class="su-flex su-flex-col su-items-center"><div class="su-w-full md:su-max-w-[60.7rem] lg:su-max-w-[63.6rem] su-mx-auto su-rs-mb-3"><div data-test="component-story-lead" class="su-text-left su-wysiwyg-content su-rs-mt-0 su-text-[1.8rem] su-leading-[2.25rem] su-mt-[1.5rem] md:su-text-[1.9rem] md:su-leading-[2.375rem] md:su-mt-[1.9rem] lg:su-text-[2.1rem] lg:su-leading-[2.625rem]"><p> summary</p></div></div><div class="su-w-full su-aspect-[16/9] su-relative"><button data-click="open-modal" class="su-cursor-pointer su-absolute su-top-0 su-left-0 su-size-full su-play-scale" aria-haspopup="dialog" aria-label="Watch video" title="Watch video" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7" ><iframe src="https://player.vimeo.com/video/908030173?autoplay=0&loop=1&autopause=0&background=1" class="su-size-full su-absolute su-top-0 su-left-0 su-pointer-events-none" allow="autoplay; fullscreen" data-role="video-player" title="Watch This is a test title" ></iframe><span class="*:su-w-[40px] *:su-h-[40px] *:md:su-w-[60px] *:md:su-h-[60px] *:lg:su-w-[100px] *:lg:su-h-[100px] *:lg:su-size-100 lg:su-bottom-38 lg:su-left-38 su-play-button-icon su-play-btn su-transition-all su-absolute su-bottom-20 su-left-20 md:su-left-27 md:su-bottom-27 md:su-block"><svg data-testid='svg-videoplay' class='su-drop-shadow-[0px_14px_28px_rgba(0,0,0,0.20)] {classes}}' aria-hidden='true' width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' fill='white' /></svg></span></button></div><div class="su-flex su-gap-8 md:su-gap-22 su-w-full su-relative su-flex-col su-items-center lg:su-flex-row lg:su-items-start su-mt-8 md:su-mt-9 lg:su-mt-15"><div class="su-mx-auto su-flex su-justify-center su-w-full"><p class="dark:su-text-white su-m-0 su-text-14 su-max-w-[633px] su-leading-[16.72px] su-font-normal su-text-black-70 md:su-text-16 md:su-leading-[19.11px] md:su-text-left">Caption text goes here lorem ipsum dolor sit amet | Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit</p></div><button data-role="video-control" data-label-play="Play looping video" data-label-pause="Pause looping video" type="button" class="su-text-black-70 su-relative su-shrink-0 dark:su-text-white hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red hocus:su-underline"><span class="*:su-size-14 su-flex su-gap-6 su-items-center su-text-14 lg:su-top-0 lg:su-right-0"><svg data-testid='svg-videoplay' aria-hidden='true' width='30' height='30' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg' class='' data-control='play'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' /></svg> <svg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg' class='su-hidden' data-control='pause'><path d='M27.1875 15C27.1875 11.7677 25.9035 8.66774 23.6179 6.38214C21.3323 4.09654 18.2323 2.8125 15 2.8125C11.7677 2.8125 8.66774 4.09654 6.38214 6.38214C4.09654 8.66774 2.8125 11.7677 2.8125 15C2.8125 18.2323 4.09654 21.3323 6.38214 23.6179C8.66774 25.9035 11.7677 27.1875 15 27.1875C18.2323 27.1875 21.3323 25.9035 23.6179 23.6179C25.9035 21.3323 27.1875 18.2323 27.1875 15ZM0 15C0 11.0218 1.58035 7.20644 4.3934 4.3934C7.20644 1.58035 11.0218 0 15 0C18.9782 0 22.7936 1.58035 25.6066 4.3934C28.4196 7.20644 30 11.0218 30 15C30 18.9782 28.4196 22.7936 25.6066 25.6066C22.7936 28.4196 18.9782 30 15 30C11.0218 30 7.20644 28.4196 4.3934 25.6066C1.58035 22.7936 0 18.9782 0 15ZM13.125 10.7812V19.2188C13.125 19.998 12.498 20.625 11.7188 20.625C10.9395 20.625 10.3125 19.998 10.3125 19.2188V10.7812C10.3125 10.002 10.9395 9.375 11.7188 9.375C12.498 9.375 13.125 10.002 13.125 10.7812ZM19.6875 10.7812V19.2188C19.6875 19.998 19.0605 20.625 18.2812 20.625C17.502 20.625 16.875 19.998 16.875 19.2188V10.7812C16.875 10.002 17.502 9.375 18.2812 9.375C19.0605 9.375 19.6875 10.002 19.6875 10.7812Z' /></svg> Play looping video</span></button></div></section></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span tabindex="0" data-focus-scope-start="true"></span><div aria-describedby="video-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="315" height="560" class="" src="https://www.youtube.com/embed/dYdi0Aek664?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch This is a test title" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
        });

        it('Should return the expected HTML with no title and summary', async () => {
            const mockData = {
                ...defaultMockData,
                section: {
                    title: undefined,
                    summary: undefined
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="single-image-video"><div class="su-mx-auto su-component-container su-container-wide su-container-px"><section class="su-flex su-flex-col su-items-center"><div class="su-w-full su-aspect-[16/9] su-relative"><button data-click="open-modal" class="su-cursor-pointer su-absolute su-top-0 su-left-0 su-size-full su-play-scale" aria-haspopup="dialog" aria-label="Watch video" title="Watch video" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7" ><iframe src="https://player.vimeo.com/video/908030173?autoplay=0&loop=1&autopause=0&background=1" class="su-size-full su-absolute su-top-0 su-left-0 su-pointer-events-none" allow="autoplay; fullscreen" data-role="video-player" title="Watch This is a test title" ></iframe><span class="*:su-w-[40px] *:su-h-[40px] *:md:su-w-[60px] *:md:su-h-[60px] *:lg:su-w-[100px] *:lg:su-h-[100px] *:lg:su-size-100 lg:su-bottom-38 lg:su-left-38 su-play-button-icon su-play-btn su-transition-all su-absolute su-bottom-20 su-left-20 md:su-left-27 md:su-bottom-27 md:su-block"><svg data-testid='svg-videoplay' class='su-drop-shadow-[0px_14px_28px_rgba(0,0,0,0.20)] {classes}}' aria-hidden='true' width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' fill='white' /></svg></span></button></div><div class="su-flex su-gap-8 md:su-gap-22 su-w-full su-relative su-flex-col su-items-center lg:su-flex-row lg:su-items-start su-mt-8 md:su-mt-9 lg:su-mt-15"><div class="su-mx-auto su-flex su-justify-center su-w-full"><p class="dark:su-text-white su-m-0 su-text-14 su-max-w-[633px] su-leading-[16.72px] su-font-normal su-text-black-70 md:su-text-16 md:su-leading-[19.11px] md:su-text-left">Caption text goes here lorem ipsum dolor sit amet | Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit</p></div><button data-role="video-control" data-label-play="Play looping video" data-label-pause="Pause looping video" type="button" class="su-text-black-70 su-relative su-shrink-0 dark:su-text-white hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red hocus:su-underline"><span class="*:su-size-14 su-flex su-gap-6 su-items-center su-text-14 lg:su-top-0 lg:su-right-0"><svg data-testid='svg-videoplay' aria-hidden='true' width='30' height='30' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg' class='' data-control='play'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' /></svg> <svg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg' class='su-hidden' data-control='pause'><path d='M27.1875 15C27.1875 11.7677 25.9035 8.66774 23.6179 6.38214C21.3323 4.09654 18.2323 2.8125 15 2.8125C11.7677 2.8125 8.66774 4.09654 6.38214 6.38214C4.09654 8.66774 2.8125 11.7677 2.8125 15C2.8125 18.2323 4.09654 21.3323 6.38214 23.6179C8.66774 25.9035 11.7677 27.1875 15 27.1875C18.2323 27.1875 21.3323 25.9035 23.6179 23.6179C25.9035 21.3323 27.1875 18.2323 27.1875 15ZM0 15C0 11.0218 1.58035 7.20644 4.3934 4.3934C7.20644 1.58035 11.0218 0 15 0C18.9782 0 22.7936 1.58035 25.6066 4.3934C28.4196 7.20644 30 11.0218 30 15C30 18.9782 28.4196 22.7936 25.6066 25.6066C22.7936 28.4196 18.9782 30 15 30C11.0218 30 7.20644 28.4196 4.3934 25.6066C1.58035 22.7936 0 18.9782 0 15ZM13.125 10.7812V19.2188C13.125 19.998 12.498 20.625 11.7188 20.625C10.9395 20.625 10.3125 19.998 10.3125 19.2188V10.7812C10.3125 10.002 10.9395 9.375 11.7188 9.375C12.498 9.375 13.125 10.002 13.125 10.7812ZM19.6875 10.7812V19.2188C19.6875 19.998 19.0605 20.625 18.2812 20.625C17.502 20.625 16.875 19.998 16.875 19.2188V10.7812C16.875 10.002 17.502 9.375 18.2812 9.375C19.0605 9.375 19.6875 10.002 19.6875 10.7812Z' /></svg> Play looping video</span></button></div></section></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span tabindex="0" data-focus-scope-start="true"></span><div aria-describedby="video-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="315" height="560" class="" src="https://www.youtube.com/embed/dYdi0Aek664?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch This is a test title" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
        });

        it('Should return the expected HTML with no width', async () => {
            const mockData = {
                ...defaultMockData,
                width: undefined,
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="single-image-video"><div class="su-mx-auto su-component-container su-container-wide su-container-px"><section class="su-flex su-flex-col su-items-center"><div class="su-w-full md:su-max-w-[60.7rem] lg:su-max-w-[63.6rem] su-mx-auto su-rs-mb-3"><h2 class="su-text-center su-text-[3.5rem] su-leading-[4.179rem] su-font-bold md:su-text-[4.0rem] md:su-leading-[4.776rem] lg:su-text-[4.9rem] lg:su-leading-[6.37rem]">Single image or video title is centered</h2><div data-test="component-story-lead" class="su-text-left su-wysiwyg-content su-rs-mt-0 su-text-[1.8rem] su-leading-[2.25rem] su-mt-[1.5rem] md:su-text-[1.9rem] md:su-leading-[2.375rem] md:su-mt-[1.9rem] lg:su-text-[2.1rem] lg:su-leading-[2.625rem]"><p>Balch, an experimental physicist in the Dionne lab at Stanford, has developed a thumbnail-sized optical sensor that can track the health of marine ecosystems in near-real time through quick detection of environmental DNA. It could be a critical tool for natural resource managers in the face of climate change impacts like coral bleaching, warming seas, and migration of species.</p></div></div><div class="su-w-full su-aspect-[16/9] su-relative"><button data-click="open-modal" class="su-cursor-pointer su-absolute su-top-0 su-left-0 su-size-full su-play-scale" aria-haspopup="dialog" aria-label="Watch video" title="Watch video" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7" ><iframe src="https://player.vimeo.com/video/908030173?autoplay=0&loop=1&autopause=0&background=1" class="su-size-full su-absolute su-top-0 su-left-0 su-pointer-events-none" allow="autoplay; fullscreen" data-role="video-player" title="Watch This is a test title" ></iframe><span class="*:su-w-[40px] *:su-h-[40px] *:md:su-w-[60px] *:md:su-h-[60px] *:lg:su-w-[100px] *:lg:su-h-[100px] *:lg:su-size-100 lg:su-bottom-38 lg:su-left-38 su-play-button-icon su-play-btn su-transition-all su-absolute su-bottom-20 su-left-20 md:su-left-27 md:su-bottom-27 md:su-block"><svg data-testid='svg-videoplay' class='su-drop-shadow-[0px_14px_28px_rgba(0,0,0,0.20)] {classes}}' aria-hidden='true' width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' fill='white' /></svg></span></button></div><div class="su-flex su-gap-8 md:su-gap-22 su-w-full su-relative su-flex-col su-items-center lg:su-flex-row lg:su-items-start su-mt-8 md:su-mt-9 lg:su-mt-15"><div class="su-mx-auto su-flex su-justify-center su-w-full"><p class="dark:su-text-white su-m-0 su-text-14 su-max-w-[633px] su-leading-[16.72px] su-font-normal su-text-black-70 md:su-text-16 md:su-leading-[19.11px] md:su-text-left">Caption text goes here lorem ipsum dolor sit amet | Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit</p></div><button data-role="video-control" data-label-play="Play looping video" data-label-pause="Pause looping video" type="button" class="su-text-black-70 su-relative su-shrink-0 dark:su-text-white hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red hocus:su-underline"><span class="*:su-size-14 su-flex su-gap-6 su-items-center su-text-14 lg:su-top-0 lg:su-right-0"><svg data-testid='svg-videoplay' aria-hidden='true' width='30' height='30' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg' class='' data-control='play'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' /></svg> <svg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg' class='su-hidden' data-control='pause'><path d='M27.1875 15C27.1875 11.7677 25.9035 8.66774 23.6179 6.38214C21.3323 4.09654 18.2323 2.8125 15 2.8125C11.7677 2.8125 8.66774 4.09654 6.38214 6.38214C4.09654 8.66774 2.8125 11.7677 2.8125 15C2.8125 18.2323 4.09654 21.3323 6.38214 23.6179C8.66774 25.9035 11.7677 27.1875 15 27.1875C18.2323 27.1875 21.3323 25.9035 23.6179 23.6179C25.9035 21.3323 27.1875 18.2323 27.1875 15ZM0 15C0 11.0218 1.58035 7.20644 4.3934 4.3934C7.20644 1.58035 11.0218 0 15 0C18.9782 0 22.7936 1.58035 25.6066 4.3934C28.4196 7.20644 30 11.0218 30 15C30 18.9782 28.4196 22.7936 25.6066 25.6066C22.7936 28.4196 18.9782 30 15 30C11.0218 30 7.20644 28.4196 4.3934 25.6066C1.58035 22.7936 0 18.9782 0 15ZM13.125 10.7812V19.2188C13.125 19.998 12.498 20.625 11.7188 20.625C10.9395 20.625 10.3125 19.998 10.3125 19.2188V10.7812C10.3125 10.002 10.9395 9.375 11.7188 9.375C12.498 9.375 13.125 10.002 13.125 10.7812ZM19.6875 10.7812V19.2188C19.6875 19.998 19.0605 20.625 18.2812 20.625C17.502 20.625 16.875 19.998 16.875 19.2188V10.7812C16.875 10.002 17.502 9.375 18.2812 9.375C19.0605 9.375 19.6875 10.002 19.6875 10.7812Z' /></svg> Play looping video</span></button></div></section></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span tabindex="0" data-focus-scope-start="true"></span><div aria-describedby="video-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="315" height="560" class="" src="https://www.youtube.com/embed/dYdi0Aek664?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch This is a test title" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
        });

        it('Should return the expected HTML with no marginTop', async () => {
            const mockData = {
                ...defaultMockData,
                marginTop: undefined,
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="single-image-video"><div class="su-mx-auto su-component-container su-container-wide su-container-px"><section class="su-flex su-flex-col su-items-center"><div class="su-w-full md:su-max-w-[60.7rem] lg:su-max-w-[63.6rem] su-mx-auto su-rs-mb-3"><h2 class="su-text-center su-text-[3.5rem] su-leading-[4.179rem] su-font-bold md:su-text-[4.0rem] md:su-leading-[4.776rem] lg:su-text-[4.9rem] lg:su-leading-[6.37rem]">Single image or video title is centered</h2><div data-test="component-story-lead" class="su-text-left su-wysiwyg-content su-rs-mt-0 su-text-[1.8rem] su-leading-[2.25rem] su-mt-[1.5rem] md:su-text-[1.9rem] md:su-leading-[2.375rem] md:su-mt-[1.9rem] lg:su-text-[2.1rem] lg:su-leading-[2.625rem]"><p>Balch, an experimental physicist in the Dionne lab at Stanford, has developed a thumbnail-sized optical sensor that can track the health of marine ecosystems in near-real time through quick detection of environmental DNA. It could be a critical tool for natural resource managers in the face of climate change impacts like coral bleaching, warming seas, and migration of species.</p></div></div><div class="su-w-full su-aspect-[16/9] su-relative"><button data-click="open-modal" class="su-cursor-pointer su-absolute su-top-0 su-left-0 su-size-full su-play-scale" aria-haspopup="dialog" aria-label="Watch video" title="Watch video" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7" ><iframe src="https://player.vimeo.com/video/908030173?autoplay=0&loop=1&autopause=0&background=1" class="su-size-full su-absolute su-top-0 su-left-0 su-pointer-events-none" allow="autoplay; fullscreen" data-role="video-player" title="Watch This is a test title" ></iframe><span class="*:su-w-[40px] *:su-h-[40px] *:md:su-w-[60px] *:md:su-h-[60px] *:lg:su-w-[100px] *:lg:su-h-[100px] *:lg:su-size-100 lg:su-bottom-38 lg:su-left-38 su-play-button-icon su-play-btn su-transition-all su-absolute su-bottom-20 su-left-20 md:su-left-27 md:su-bottom-27 md:su-block"><svg data-testid='svg-videoplay' class='su-drop-shadow-[0px_14px_28px_rgba(0,0,0,0.20)] {classes}}' aria-hidden='true' width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' fill='white' /></svg></span></button></div><div class="su-flex su-gap-8 md:su-gap-22 su-w-full su-relative su-flex-col su-items-center lg:su-flex-row lg:su-items-start su-mt-8 md:su-mt-9 lg:su-mt-15"><div class="su-mx-auto su-flex su-justify-center su-w-full"><p class="dark:su-text-white su-m-0 su-text-14 su-max-w-[633px] su-leading-[16.72px] su-font-normal su-text-black-70 md:su-text-16 md:su-leading-[19.11px] md:su-text-left">Caption text goes here lorem ipsum dolor sit amet | Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit</p></div><button data-role="video-control" data-label-play="Play looping video" data-label-pause="Pause looping video" type="button" class="su-text-black-70 su-relative su-shrink-0 dark:su-text-white hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red hocus:su-underline"><span class="*:su-size-14 su-flex su-gap-6 su-items-center su-text-14 lg:su-top-0 lg:su-right-0"><svg data-testid='svg-videoplay' aria-hidden='true' width='30' height='30' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg' class='' data-control='play'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' /></svg> <svg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg' class='su-hidden' data-control='pause'><path d='M27.1875 15C27.1875 11.7677 25.9035 8.66774 23.6179 6.38214C21.3323 4.09654 18.2323 2.8125 15 2.8125C11.7677 2.8125 8.66774 4.09654 6.38214 6.38214C4.09654 8.66774 2.8125 11.7677 2.8125 15C2.8125 18.2323 4.09654 21.3323 6.38214 23.6179C8.66774 25.9035 11.7677 27.1875 15 27.1875C18.2323 27.1875 21.3323 25.9035 23.6179 23.6179C25.9035 21.3323 27.1875 18.2323 27.1875 15ZM0 15C0 11.0218 1.58035 7.20644 4.3934 4.3934C7.20644 1.58035 11.0218 0 15 0C18.9782 0 22.7936 1.58035 25.6066 4.3934C28.4196 7.20644 30 11.0218 30 15C30 18.9782 28.4196 22.7936 25.6066 25.6066C22.7936 28.4196 18.9782 30 15 30C11.0218 30 7.20644 28.4196 4.3934 25.6066C1.58035 22.7936 0 18.9782 0 15ZM13.125 10.7812V19.2188C13.125 19.998 12.498 20.625 11.7188 20.625C10.9395 20.625 10.3125 19.998 10.3125 19.2188V10.7812C10.3125 10.002 10.9395 9.375 11.7188 9.375C12.498 9.375 13.125 10.002 13.125 10.7812ZM19.6875 10.7812V19.2188C19.6875 19.998 19.0605 20.625 18.2812 20.625C17.502 20.625 16.875 19.998 16.875 19.2188V10.7812C16.875 10.002 17.502 9.375 18.2812 9.375C19.0605 9.375 19.6875 10.002 19.6875 10.7812Z' /></svg> Play looping video</span></button></div></section></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span tabindex="0" data-focus-scope-start="true"></span><div aria-describedby="video-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="315" height="560" class="" src="https://www.youtube.com/embed/dYdi0Aek664?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch This is a test title" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
        });

        it('Should return the expected HTML with no marginBottom', async () => {
            const mockData = {
                ...defaultMockData,
                marginBottom: undefined,
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="single-image-video"><div class="su-mx-auto su-component-container su-container-wide su-container-px"><section class="su-flex su-flex-col su-items-center"><div class="su-w-full md:su-max-w-[60.7rem] lg:su-max-w-[63.6rem] su-mx-auto su-rs-mb-3"><h2 class="su-text-center su-text-[3.5rem] su-leading-[4.179rem] su-font-bold md:su-text-[4.0rem] md:su-leading-[4.776rem] lg:su-text-[4.9rem] lg:su-leading-[6.37rem]">Single image or video title is centered</h2><div data-test="component-story-lead" class="su-text-left su-wysiwyg-content su-rs-mt-0 su-text-[1.8rem] su-leading-[2.25rem] su-mt-[1.5rem] md:su-text-[1.9rem] md:su-leading-[2.375rem] md:su-mt-[1.9rem] lg:su-text-[2.1rem] lg:su-leading-[2.625rem]"><p>Balch, an experimental physicist in the Dionne lab at Stanford, has developed a thumbnail-sized optical sensor that can track the health of marine ecosystems in near-real time through quick detection of environmental DNA. It could be a critical tool for natural resource managers in the face of climate change impacts like coral bleaching, warming seas, and migration of species.</p></div></div><div class="su-w-full su-aspect-[16/9] su-relative"><button data-click="open-modal" class="su-cursor-pointer su-absolute su-top-0 su-left-0 su-size-full su-play-scale" aria-haspopup="dialog" aria-label="Watch video" title="Watch video" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7" ><iframe src="https://player.vimeo.com/video/908030173?autoplay=0&loop=1&autopause=0&background=1" class="su-size-full su-absolute su-top-0 su-left-0 su-pointer-events-none" allow="autoplay; fullscreen" data-role="video-player" title="Watch This is a test title" ></iframe><span class="*:su-w-[40px] *:su-h-[40px] *:md:su-w-[60px] *:md:su-h-[60px] *:lg:su-w-[100px] *:lg:su-h-[100px] *:lg:su-size-100 lg:su-bottom-38 lg:su-left-38 su-play-button-icon su-play-btn su-transition-all su-absolute su-bottom-20 su-left-20 md:su-left-27 md:su-bottom-27 md:su-block"><svg data-testid='svg-videoplay' class='su-drop-shadow-[0px_14px_28px_rgba(0,0,0,0.20)] {classes}}' aria-hidden='true' width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' fill='white' /></svg></span></button></div><div class="su-flex su-gap-8 md:su-gap-22 su-w-full su-relative su-flex-col su-items-center lg:su-flex-row lg:su-items-start su-mt-8 md:su-mt-9 lg:su-mt-15"><div class="su-mx-auto su-flex su-justify-center su-w-full"><p class="dark:su-text-white su-m-0 su-text-14 su-max-w-[633px] su-leading-[16.72px] su-font-normal su-text-black-70 md:su-text-16 md:su-leading-[19.11px] md:su-text-left">Caption text goes here lorem ipsum dolor sit amet | Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit</p></div><button data-role="video-control" data-label-play="Play looping video" data-label-pause="Pause looping video" type="button" class="su-text-black-70 su-relative su-shrink-0 dark:su-text-white hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red hocus:su-underline"><span class="*:su-size-14 su-flex su-gap-6 su-items-center su-text-14 lg:su-top-0 lg:su-right-0"><svg data-testid='svg-videoplay' aria-hidden='true' width='30' height='30' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg' class='' data-control='play'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' /></svg> <svg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg' class='su-hidden' data-control='pause'><path d='M27.1875 15C27.1875 11.7677 25.9035 8.66774 23.6179 6.38214C21.3323 4.09654 18.2323 2.8125 15 2.8125C11.7677 2.8125 8.66774 4.09654 6.38214 6.38214C4.09654 8.66774 2.8125 11.7677 2.8125 15C2.8125 18.2323 4.09654 21.3323 6.38214 23.6179C8.66774 25.9035 11.7677 27.1875 15 27.1875C18.2323 27.1875 21.3323 25.9035 23.6179 23.6179C25.9035 21.3323 27.1875 18.2323 27.1875 15ZM0 15C0 11.0218 1.58035 7.20644 4.3934 4.3934C7.20644 1.58035 11.0218 0 15 0C18.9782 0 22.7936 1.58035 25.6066 4.3934C28.4196 7.20644 30 11.0218 30 15C30 18.9782 28.4196 22.7936 25.6066 25.6066C22.7936 28.4196 18.9782 30 15 30C11.0218 30 7.20644 28.4196 4.3934 25.6066C1.58035 22.7936 0 18.9782 0 15ZM13.125 10.7812V19.2188C13.125 19.998 12.498 20.625 11.7188 20.625C10.9395 20.625 10.3125 19.998 10.3125 19.2188V10.7812C10.3125 10.002 10.9395 9.375 11.7188 9.375C12.498 9.375 13.125 10.002 13.125 10.7812ZM19.6875 10.7812V19.2188C19.6875 19.998 19.0605 20.625 18.2812 20.625C17.502 20.625 16.875 19.998 16.875 19.2188V10.7812C16.875 10.002 17.502 9.375 18.2812 9.375C19.0605 9.375 19.6875 10.002 19.6875 10.7812Z' /></svg> Play looping video</span></button></div></section></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span tabindex="0" data-focus-scope-start="true"></span><div aria-describedby="video-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="315" height="560" class="" src="https://www.youtube.com/embed/dYdi0Aek664?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch This is a test title" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
        });

        it('Should return the expected HTML with no heading', async () => {
            const mockData = {
                ...defaultMockData,
                video: {
                    ...defaultMockData.video,
                    heading: undefined,
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="single-image-video"><div class="su-mx-auto su-component-container su-container-wide su-container-px"><section class="su-flex su-flex-col su-items-center"><div class="su-w-full md:su-max-w-[60.7rem] lg:su-max-w-[63.6rem] su-mx-auto su-rs-mb-3"><h2 class="su-text-center su-text-[3.5rem] su-leading-[4.179rem] su-font-bold md:su-text-[4.0rem] md:su-leading-[4.776rem] lg:su-text-[4.9rem] lg:su-leading-[6.37rem]">Single image or video title is centered</h2><div data-test="component-story-lead" class="su-text-left su-wysiwyg-content su-rs-mt-0 su-text-[1.8rem] su-leading-[2.25rem] su-mt-[1.5rem] md:su-text-[1.9rem] md:su-leading-[2.375rem] md:su-mt-[1.9rem] lg:su-text-[2.1rem] lg:su-leading-[2.625rem]"><p>Balch, an experimental physicist in the Dionne lab at Stanford, has developed a thumbnail-sized optical sensor that can track the health of marine ecosystems in near-real time through quick detection of environmental DNA. It could be a critical tool for natural resource managers in the face of climate change impacts like coral bleaching, warming seas, and migration of species.</p></div></div><div class="su-w-full su-aspect-[16/9] su-relative"><button data-click="open-modal" class="su-cursor-pointer su-absolute su-top-0 su-left-0 su-size-full su-play-scale" aria-haspopup="dialog" aria-label="Watch video" title="Watch video" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7" ><iframe src="https://player.vimeo.com/video/908030173?autoplay=0&loop=1&autopause=0&background=1" class="su-size-full su-absolute su-top-0 su-left-0 su-pointer-events-none" allow="autoplay; fullscreen" data-role="video-player" title="" ></iframe><span class="*:su-w-[40px] *:su-h-[40px] *:md:su-w-[60px] *:md:su-h-[60px] *:lg:su-w-[100px] *:lg:su-h-[100px] *:lg:su-size-100 lg:su-bottom-38 lg:su-left-38 su-play-button-icon su-play-btn su-transition-all su-absolute su-bottom-20 su-left-20 md:su-left-27 md:su-bottom-27 md:su-block"><svg data-testid='svg-videoplay' class='su-drop-shadow-[0px_14px_28px_rgba(0,0,0,0.20)] {classes}}' aria-hidden='true' width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' fill='white' /></svg></span></button></div><div class="su-flex su-gap-8 md:su-gap-22 su-w-full su-relative su-flex-col su-items-center lg:su-flex-row lg:su-items-start su-mt-8 md:su-mt-9 lg:su-mt-15"><div class="su-mx-auto su-flex su-justify-center su-w-full"><p class="dark:su-text-white su-m-0 su-text-14 su-max-w-[633px] su-leading-[16.72px] su-font-normal su-text-black-70 md:su-text-16 md:su-leading-[19.11px] md:su-text-left">Caption text goes here lorem ipsum dolor sit amet | Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit</p></div><button data-role="video-control" data-label-play="Play looping video" data-label-pause="Pause looping video" type="button" class="su-text-black-70 su-relative su-shrink-0 dark:su-text-white hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red hocus:su-underline"><span class="*:su-size-14 su-flex su-gap-6 su-items-center su-text-14 lg:su-top-0 lg:su-right-0"><svg data-testid='svg-videoplay' aria-hidden='true' width='30' height='30' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg' class='' data-control='play'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' /></svg> <svg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg' class='su-hidden' data-control='pause'><path d='M27.1875 15C27.1875 11.7677 25.9035 8.66774 23.6179 6.38214C21.3323 4.09654 18.2323 2.8125 15 2.8125C11.7677 2.8125 8.66774 4.09654 6.38214 6.38214C4.09654 8.66774 2.8125 11.7677 2.8125 15C2.8125 18.2323 4.09654 21.3323 6.38214 23.6179C8.66774 25.9035 11.7677 27.1875 15 27.1875C18.2323 27.1875 21.3323 25.9035 23.6179 23.6179C25.9035 21.3323 27.1875 18.2323 27.1875 15ZM0 15C0 11.0218 1.58035 7.20644 4.3934 4.3934C7.20644 1.58035 11.0218 0 15 0C18.9782 0 22.7936 1.58035 25.6066 4.3934C28.4196 7.20644 30 11.0218 30 15C30 18.9782 28.4196 22.7936 25.6066 25.6066C22.7936 28.4196 18.9782 30 15 30C11.0218 30 7.20644 28.4196 4.3934 25.6066C1.58035 22.7936 0 18.9782 0 15ZM13.125 10.7812V19.2188C13.125 19.998 12.498 20.625 11.7188 20.625C10.9395 20.625 10.3125 19.998 10.3125 19.2188V10.7812C10.3125 10.002 10.9395 9.375 11.7188 9.375C12.498 9.375 13.125 10.002 13.125 10.7812ZM19.6875 10.7812V19.2188C19.6875 19.998 19.0605 20.625 18.2812 20.625C17.502 20.625 16.875 19.998 16.875 19.2188V10.7812C16.875 10.002 17.502 9.375 18.2812 9.375C19.0605 9.375 19.6875 10.002 19.6875 10.7812Z' /></svg> Play looping video</span></button></div></section></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span tabindex="0" data-focus-scope-start="true"></span><div aria-describedby="video-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="315" height="560" class="" src="https://www.youtube.com/embed/dYdi0Aek664?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch " frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
        });

    });


    describe('[Edge cases]', () => {
        beforeAll(() => {
            uuid.mockReturnValue('476f6893-b77b-43d8-ac8c-ac74d3d75dd7');
        });

        afterEach(() => {
            uuid.mockClear();
            basicAssetUri.mockClear();
        });
        
         it("Should correctly render alt when image data will return empty alt", async () => {
            basicAssetUri.mockResolvedValueOnce({
                url: "https://google.com/image.jpg",
            });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Single Image or Video component: Failed to fetch image data. data.attributes must be a non-null object -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fetch for image will fail', async () => {
            basicAssetUri.mockRejectedValueOnce(new Error('No image'))

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<!-- Error occurred in the Single Image or Video component: Failed to fetch image data. No image -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fetch for image return data without url', async () => {
            basicAssetUri.mockResolvedValueOnce({
                test: "https://google.com/image.jpg",
            });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<!-- Error occurred in the Single Image or Video component: Failed to fetch image data. data.url must be a non-empty string -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fetch for image return data that is not an object', async () => {
            basicAssetUri.mockResolvedValueOnce("https://google.com/image.jpg");

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<!-- Error occurred in the Single Image or Video component: Failed to fetch image data. basicAssetUri did not return an object -->');
            expect(mockedError).toBeCalledTimes(1);
        });

    });
});