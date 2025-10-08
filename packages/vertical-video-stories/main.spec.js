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

            expect(result).toMatchInlineSnapshot(`"<section data-component="vertical-video-stories"><div class="su-component-container su-container-px su-container-full su-max-w-900 su-mx-auto su-flex su-flex-col su-items-end su-gap-27 sm:su-flex-row-reverse"><button data-click="open-modal" class="su-component-card-thumbnail su-block su-relative su-size-full focus:su-outline-none focus-visible:su-ring-[3px] focus-visible:su-ring-offset-8 focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none" aria-haspopup="dialog" aria-label="Watch video" title="Watch video" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7" ><span class="su-component-media-ratio su-group su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16] su-rounded-3xl"><img src="" alt="" class="su-absolute su-object-cover su-object-center su-size-full" /><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none"></div><span class="su-transition-all su-absolute su-left-1/2 su-top-1/2 -su-translate-x-1/2 -su-translate-y-1/2 [&>svg]:su-text-[6rem] group-hocus:su-scale-110"><svg data-testid='svg-videoplay' class='su-drop-shadow-[0px_14px_28px_rgba(0,0,0,0.20)] {classes}}' aria-hidden='true' width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' fill='white' /></svg></span></span></button><div class="su-w-full su-mx-auto sm:su-rs-mb-3"><div class="su-h-3 su-w-full su-block su-bg-gradient-light-red-h su-mb-16"></div><div class="su-text-14 md:su-text-16 su-text-black-70 dark:su-text-white su-rs-mt-0">Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit</div></div></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id=""><span tabindex="0" data-focus-scope-start="true" "></span><div aria-describedby="" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="560" height="315" class="" src="https://www.youtube.com/embed/?si=vYU81uVmaV7GSju2&amp;autoplay=1&amp;controls=1&amp;rel=0" title="" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
        });

        it('Should return the expected HTML with no image', async () => {
            const mockData = {
                ...defaultMockData,
                image: undefined
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="vertical-video-stories"><div class="su-component-container su-container-px su-container-full su-max-w-900 su-mx-auto su-flex su-flex-col su-items-end su-gap-27 sm:su-flex-row-reverse"><button data-click="open-modal" class="su-component-card-thumbnail su-block su-relative su-size-full focus:su-outline-none focus-visible:su-ring-[3px] focus-visible:su-ring-offset-8 focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none" aria-haspopup="dialog" aria-label="Watch video" title="Watch video" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7" ><span class="su-component-media-ratio su-group su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16] su-rounded-3xl"><img src="" alt="" class="su-absolute su-object-cover su-object-center su-size-full" /><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none"></div><span class="su-transition-all su-absolute su-left-1/2 su-top-1/2 -su-translate-x-1/2 -su-translate-y-1/2 [&>svg]:su-text-[6rem] group-hocus:su-scale-110"><svg data-testid='svg-videoplay' class='su-drop-shadow-[0px_14px_28px_rgba(0,0,0,0.20)] {classes}}' aria-hidden='true' width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' fill='white' /></svg></span></span></button><div class="su-w-full su-mx-auto sm:su-rs-mb-3"><div class="su-h-3 su-w-full su-block su-bg-gradient-light-red-h su-mb-16"></div><div class="su-text-14 md:su-text-16 su-text-black-70 dark:su-text-white su-rs-mt-0">Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit</div></div></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id=""><span tabindex="0" data-focus-scope-start="true" "></span><div aria-describedby="" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="560" height="315" class="" src="https://www.youtube.com/embed/?si=vYU81uVmaV7GSju2&amp;autoplay=1&amp;controls=1&amp;rel=0" title="" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
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

            expect(result).toMatchInlineSnapshot(`"<section data-component="vertical-video-stories"><div class="su-component-container su-container-px su-container-full su-max-w-900 su-mx-auto su-flex su-flex-col su-items-end su-gap-27 sm:su-flex-row-reverse"><button data-click="open-modal" class="su-component-card-thumbnail su-block su-relative su-size-full focus:su-outline-none focus-visible:su-ring-[3px] focus-visible:su-ring-offset-8 focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none" aria-haspopup="dialog" aria-label="Watch video" title="Watch video" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7" ><span class="su-component-media-ratio su-group su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16] su-rounded-3xl"><img src="" alt="" class="su-absolute su-object-cover su-object-center su-size-full" /><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none"></div><span class="su-transition-all su-absolute su-left-1/2 su-top-1/2 -su-translate-x-1/2 -su-translate-y-1/2 [&>svg]:su-text-[6rem] group-hocus:su-scale-110"><svg data-testid='svg-videoplay' class='su-drop-shadow-[0px_14px_28px_rgba(0,0,0,0.20)] {classes}}' aria-hidden='true' width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' fill='white' /></svg></span></span></button><div class="su-w-full su-mx-auto sm:su-rs-mb-3"><div class="su-h-3 su-w-full su-block su-bg-gradient-light-red-h su-mb-16"></div><div class="su-text-14 md:su-text-16 su-text-black-70 dark:su-text-white su-rs-mt-0">Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit</div></div></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id=""><span tabindex="0" data-focus-scope-start="true" "></span><div aria-describedby="" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="560" height="315" class="" src="https://www.youtube.com/embed/?si=vYU81uVmaV7GSju2&amp;autoplay=1&amp;controls=1&amp;rel=0" title="" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
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

            expect(result).toMatchInlineSnapshot(`"<section data-component="vertical-video-stories"><div class="su-component-container su-container-px su-container-full su-max-w-900 su-mx-auto su-flex su-flex-col su-items-end su-gap-27 sm:su-flex-row-reverse"><button data-click="open-modal" class="su-component-card-thumbnail su-block su-relative su-size-full focus:su-outline-none focus-visible:su-ring-[3px] focus-visible:su-ring-offset-8 focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none" aria-haspopup="dialog" aria-label="Watch video" title="Watch video" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7" ><span class="su-component-media-ratio su-group su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16] su-rounded-3xl"><img src="" alt="" class="su-absolute su-object-cover su-object-center su-size-full" /><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none"></div><span class="su-transition-all su-absolute su-left-1/2 su-top-1/2 -su-translate-x-1/2 -su-translate-y-1/2 [&>svg]:su-text-[6rem] group-hocus:su-scale-110"><svg data-testid='svg-videoplay' class='su-drop-shadow-[0px_14px_28px_rgba(0,0,0,0.20)] {classes}}' aria-hidden='true' width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' fill='white' /></svg></span></span></button><div class="su-w-full su-mx-auto sm:su-rs-mb-3"><div class="su-h-3 su-w-full su-block su-bg-gradient-light-red-h su-mb-16"></div><div class="su-text-14 md:su-text-16 su-text-black-70 dark:su-text-white su-rs-mt-0">Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit</div></div></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id=""><span tabindex="0" data-focus-scope-start="true" "></span><div aria-describedby="" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="560" height="315" class="" src="https://www.youtube.com/embed/?si=vYU81uVmaV7GSju2&amp;autoplay=1&amp;controls=1&amp;rel=0" title="" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
        });

        it('Should return the expected HTML with no youtubeid and vimeoid', async () => {
            const mockData = {
                ...defaultMockData,
                video: {
                    heading: "This is a test title",
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="vertical-video-stories"><div class="su-component-container su-container-px su-container-full su-max-w-900 su-mx-auto su-flex su-flex-col su-items-end su-gap-27 sm:su-flex-row-reverse"><button data-click="open-modal" class="su-component-card-thumbnail su-block su-relative su-size-full focus:su-outline-none focus-visible:su-ring-[3px] focus-visible:su-ring-offset-8 focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none" aria-haspopup="dialog" aria-label="Watch video" title="Watch video" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7" ><span class="su-component-media-ratio su-group su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16] su-rounded-3xl"><img src="" alt="" class="su-absolute su-object-cover su-object-center su-size-full" /><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none"></div><span class="su-transition-all su-absolute su-left-1/2 su-top-1/2 -su-translate-x-1/2 -su-translate-y-1/2 [&>svg]:su-text-[6rem] group-hocus:su-scale-110"><svg data-testid='svg-videoplay' class='su-drop-shadow-[0px_14px_28px_rgba(0,0,0,0.20)] {classes}}' aria-hidden='true' width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' fill='white' /></svg></span></span></button><div class="su-w-full su-mx-auto sm:su-rs-mb-3"><div class="su-h-3 su-w-full su-block su-bg-gradient-light-red-h su-mb-16"></div><div class="su-text-14 md:su-text-16 su-text-black-70 dark:su-text-white su-rs-mt-0">Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit</div></div></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id=""><span tabindex="0" data-focus-scope-start="true" "></span><div aria-describedby="" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="560" height="315" class="" src="https://www.youtube.com/embed/?si=vYU81uVmaV7GSju2&amp;autoplay=1&amp;controls=1&amp;rel=0" title="" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
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

            expect(result).toMatchInlineSnapshot(`"<section data-component="vertical-video-stories"><div class="su-component-container su-container-px su-container-full su-max-w-900 su-mx-auto su-flex su-flex-col su-items-end su-gap-27 sm:su-flex-row-reverse"><button data-click="open-modal" class="su-component-card-thumbnail su-block su-relative su-size-full focus:su-outline-none focus-visible:su-ring-[3px] focus-visible:su-ring-offset-8 focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none" aria-haspopup="dialog" aria-label="Watch video" title="Watch video" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7" ><span class="su-component-media-ratio su-group su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16] su-rounded-3xl"><img src="" alt="" class="su-absolute su-object-cover su-object-center su-size-full" /><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none"></div><span class="su-transition-all su-absolute su-left-1/2 su-top-1/2 -su-translate-x-1/2 -su-translate-y-1/2 [&>svg]:su-text-[6rem] group-hocus:su-scale-110"><svg data-testid='svg-videoplay' class='su-drop-shadow-[0px_14px_28px_rgba(0,0,0,0.20)] {classes}}' aria-hidden='true' width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' fill='white' /></svg></span></span></button><div class="su-w-full su-mx-auto sm:su-rs-mb-3"><div class="su-h-3 su-w-full su-block su-bg-gradient-light-red-h su-mb-16"></div><div class="su-text-14 md:su-text-16 su-text-black-70 dark:su-text-white su-rs-mt-0">Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit</div></div></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id=""><span tabindex="0" data-focus-scope-start="true" "></span><div aria-describedby="" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="560" height="315" class="" src="https://www.youtube.com/embed/?si=vYU81uVmaV7GSju2&amp;autoplay=1&amp;controls=1&amp;rel=0" title="" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
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

            expect(result).toMatchInlineSnapshot(`"<section data-component="vertical-video-stories"><div class="su-component-container su-container-px su-container-full su-max-w-900 su-mx-auto su-flex su-flex-col su-items-end su-gap-27 sm:su-flex-row-reverse"><button data-click="open-modal" class="su-component-card-thumbnail su-block su-relative su-size-full focus:su-outline-none focus-visible:su-ring-[3px] focus-visible:su-ring-offset-8 focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none" aria-haspopup="dialog" aria-label="Watch video" title="Watch video" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7" ><span class="su-component-media-ratio su-group su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16] su-rounded-3xl"><img src="" alt="" class="su-absolute su-object-cover su-object-center su-size-full" /><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none"></div><span class="su-transition-all su-absolute su-left-1/2 su-top-1/2 -su-translate-x-1/2 -su-translate-y-1/2 [&>svg]:su-text-[6rem] group-hocus:su-scale-110"><svg data-testid='svg-videoplay' class='su-drop-shadow-[0px_14px_28px_rgba(0,0,0,0.20)] {classes}}' aria-hidden='true' width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' fill='white' /></svg></span></span></button><div class="su-w-full su-mx-auto sm:su-rs-mb-3"><div class="su-h-3 su-w-full su-block su-bg-gradient-light-red-h su-mb-16"></div><div class="su-text-14 md:su-text-16 su-text-black-70 dark:su-text-white su-rs-mt-0">Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit</div></div></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id=""><span tabindex="0" data-focus-scope-start="true" "></span><div aria-describedby="" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="560" height="315" class="" src="https://www.youtube.com/embed/?si=vYU81uVmaV7GSju2&amp;autoplay=1&amp;controls=1&amp;rel=0" title="" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
        });

        it('Should return the expected HTML with no width', async () => {
            const mockData = {
                ...defaultMockData,
                width: undefined,
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="vertical-video-stories"><div class="su-component-container su-container-px su-container-full su-max-w-900 su-mx-auto su-flex su-flex-col su-items-end su-gap-27 sm:su-flex-row-reverse"><button data-click="open-modal" class="su-component-card-thumbnail su-block su-relative su-size-full focus:su-outline-none focus-visible:su-ring-[3px] focus-visible:su-ring-offset-8 focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none" aria-haspopup="dialog" aria-label="Watch video" title="Watch video" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7" ><span class="su-component-media-ratio su-group su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16] su-rounded-3xl"><img src="" alt="" class="su-absolute su-object-cover su-object-center su-size-full" /><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none"></div><span class="su-transition-all su-absolute su-left-1/2 su-top-1/2 -su-translate-x-1/2 -su-translate-y-1/2 [&>svg]:su-text-[6rem] group-hocus:su-scale-110"><svg data-testid='svg-videoplay' class='su-drop-shadow-[0px_14px_28px_rgba(0,0,0,0.20)] {classes}}' aria-hidden='true' width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' fill='white' /></svg></span></span></button><div class="su-w-full su-mx-auto sm:su-rs-mb-3"><div class="su-h-3 su-w-full su-block su-bg-gradient-light-red-h su-mb-16"></div><div class="su-text-14 md:su-text-16 su-text-black-70 dark:su-text-white su-rs-mt-0">Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit</div></div></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id=""><span tabindex="0" data-focus-scope-start="true" "></span><div aria-describedby="" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="560" height="315" class="" src="https://www.youtube.com/embed/?si=vYU81uVmaV7GSju2&amp;autoplay=1&amp;controls=1&amp;rel=0" title="" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
        });

        it('Should return the expected HTML with no marginTop', async () => {
            const mockData = {
                ...defaultMockData,
                marginTop: undefined,
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="vertical-video-stories"><div class="su-component-container su-container-px su-container-full su-max-w-900 su-mx-auto su-flex su-flex-col su-items-end su-gap-27 sm:su-flex-row-reverse"><button data-click="open-modal" class="su-component-card-thumbnail su-block su-relative su-size-full focus:su-outline-none focus-visible:su-ring-[3px] focus-visible:su-ring-offset-8 focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none" aria-haspopup="dialog" aria-label="Watch video" title="Watch video" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7" ><span class="su-component-media-ratio su-group su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16] su-rounded-3xl"><img src="" alt="" class="su-absolute su-object-cover su-object-center su-size-full" /><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none"></div><span class="su-transition-all su-absolute su-left-1/2 su-top-1/2 -su-translate-x-1/2 -su-translate-y-1/2 [&>svg]:su-text-[6rem] group-hocus:su-scale-110"><svg data-testid='svg-videoplay' class='su-drop-shadow-[0px_14px_28px_rgba(0,0,0,0.20)] {classes}}' aria-hidden='true' width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' fill='white' /></svg></span></span></button><div class="su-w-full su-mx-auto sm:su-rs-mb-3"><div class="su-h-3 su-w-full su-block su-bg-gradient-light-red-h su-mb-16"></div><div class="su-text-14 md:su-text-16 su-text-black-70 dark:su-text-white su-rs-mt-0">Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit</div></div></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id=""><span tabindex="0" data-focus-scope-start="true" "></span><div aria-describedby="" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="560" height="315" class="" src="https://www.youtube.com/embed/?si=vYU81uVmaV7GSju2&amp;autoplay=1&amp;controls=1&amp;rel=0" title="" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
        });

        it('Should return the expected HTML with no marginBottom', async () => {
            const mockData = {
                ...defaultMockData,
                marginBottom: undefined,
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="vertical-video-stories"><div class="su-component-container su-container-px su-container-full su-max-w-900 su-mx-auto su-flex su-flex-col su-items-end su-gap-27 sm:su-flex-row-reverse"><button data-click="open-modal" class="su-component-card-thumbnail su-block su-relative su-size-full focus:su-outline-none focus-visible:su-ring-[3px] focus-visible:su-ring-offset-8 focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none" aria-haspopup="dialog" aria-label="Watch video" title="Watch video" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7" ><span class="su-component-media-ratio su-group su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16] su-rounded-3xl"><img src="" alt="" class="su-absolute su-object-cover su-object-center su-size-full" /><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none"></div><span class="su-transition-all su-absolute su-left-1/2 su-top-1/2 -su-translate-x-1/2 -su-translate-y-1/2 [&>svg]:su-text-[6rem] group-hocus:su-scale-110"><svg data-testid='svg-videoplay' class='su-drop-shadow-[0px_14px_28px_rgba(0,0,0,0.20)] {classes}}' aria-hidden='true' width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' fill='white' /></svg></span></span></button><div class="su-w-full su-mx-auto sm:su-rs-mb-3"><div class="su-h-3 su-w-full su-block su-bg-gradient-light-red-h su-mb-16"></div><div class="su-text-14 md:su-text-16 su-text-black-70 dark:su-text-white su-rs-mt-0">Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit</div></div></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id=""><span tabindex="0" data-focus-scope-start="true" "></span><div aria-describedby="" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="560" height="315" class="" src="https://www.youtube.com/embed/?si=vYU81uVmaV7GSju2&amp;autoplay=1&amp;controls=1&amp;rel=0" title="" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
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

            expect(result).toMatchInlineSnapshot(`"<section data-component="vertical-video-stories"><div class="su-component-container su-container-px su-container-full su-max-w-900 su-mx-auto su-flex su-flex-col su-items-end su-gap-27 sm:su-flex-row-reverse"><button data-click="open-modal" class="su-component-card-thumbnail su-block su-relative su-size-full focus:su-outline-none focus-visible:su-ring-[3px] focus-visible:su-ring-offset-8 focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none" aria-haspopup="dialog" aria-label="Watch video" title="Watch video" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7" ><span class="su-component-media-ratio su-group su-overflow-hidden su-relative su-size-full su-block su-aspect-[9/16] su-rounded-3xl"><img src="" alt="" class="su-absolute su-object-cover su-object-center su-size-full" /><div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none"></div><span class="su-transition-all su-absolute su-left-1/2 su-top-1/2 -su-translate-x-1/2 -su-translate-y-1/2 [&>svg]:su-text-[6rem] group-hocus:su-scale-110"><svg data-testid='svg-videoplay' class='su-drop-shadow-[0px_14px_28px_rgba(0,0,0,0.20)] {classes}}' aria-hidden='true' width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' fill='white' /></svg></span></span></button><div class="su-w-full su-mx-auto sm:su-rs-mb-3"><div class="su-h-3 su-w-full su-block su-bg-gradient-light-red-h su-mb-16"></div><div class="su-text-14 md:su-text-16 su-text-black-70 dark:su-text-white su-rs-mt-0">Credit goes here lorem ipsum lorem ipsum lorem ipsum lorem dolor site amit</div></div></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id=""><span tabindex="0" data-focus-scope-start="true" "></span><div aria-describedby="" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="560" height="315" class="" src="https://www.youtube.com/embed/?si=vYU81uVmaV7GSju2&amp;autoplay=1&amp;controls=1&amp;rel=0" title="" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
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