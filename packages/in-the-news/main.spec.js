import { beforeEach, describe, expect, it, vi } from 'vitest';
import { basicAssetUri, cardDataAdapter, matrixCardService, linkedHeadingService } from "../../global/js/utils";
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    basicAssetUri: vi.fn(),
    cardDataAdapter: vi.fn().mockImplementation(() => ({
        setCardService: vi.fn(),
        getCards: vi.fn().mockResolvedValue([
            {
                type: "Video",
                title: "Remembering Oct. 7 and learning about Israel, Gaza, and the Middle East",
                liveUrl: "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/remembering-oct.-7-and-learning-about-israel,-gaza,-and-the-middle-east",
                description: "This is a custom feature desc",
                imageUrl: "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0022/63364/photo-1460661419201-fd4cecdf8a8b.jpeg",
                taxonomy: null,
                taxonomyUrl: null,
                videoUrl: "Vh-rvUKOOp8",
                date: "2024-01-01 00:00:00",
                source: null,
                authorName: null,
                authorEmail: null,
                quote: "A sanctuary, it's a forever thing. And so we want to know not only what's here now, but how it's changing over time.",
                ctaText: "Read the story on NPR",
                imageURL: "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0020/63353/photo-1461749280684-dccba630e2f6.jpg"
            },
            {
                type: "Book",
                title: "Researchers illuminate inner workings of new-age soft semiconductors",
                liveUrl: "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/researchers-illuminate-inner-workings-of-new-age-soft-semiconductors",
                description: "Teaser 1 custom description",
                imageUrl: "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0028/63379/squiz-dxp.png",
                imageAlt: "",
                taxonomy: null,
                taxonomyUrl: null,
                videoUrl: "",
                date: "2024-01-01 00:00:00",
                source: null,
                authorName: null,
                authorEmail: null
            },
            {
                type: "News",
                title: "Stanford releases preliminary enrollment data for Class of 2028",
                liveUrl: "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/stanford-releases-preliminary-enrollment-data-for-class-of-2028",
                description: "<p>The class is the first to be admitted under last year's U.S. Supreme Court ruling on college admissions. Stanford will continue and expand outreach activities in support of diversity broadly defined.</p>",
                imageUrl: "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0023/63356/photo-1496171367470-9ed9a91ea931.jpeg",
                imageAlt: "",
                taxonomy: null,
                taxonomyUrl: null,
                videoUrl: "",
                date: "2024-01-01 00:00:00",
                source: null,
                authorName: null,
                authorEmail: null
            }
        ]),
    })),
    matrixCardService: vi.fn(),
    linkedHeadingService: vi.fn()
}));

describe('[In the news]', () => {
    const mockFnsCtx = { resolveUri: vi.fn() };
    
    const defaultMockData = {
        headingConfiguration: {
            title: "In the news",
            ctaText: "View all",
            ctaUrl: "matrix-asset://api-identifier/162707",

        },
        featuredContent: {
            featuredTeaser: "matrix-asset://api-identifier/162707",
            personHeadshot: "matrix-asset://api-identifier/163591",
            featuredCtaText: "Read the story on NPR",
            featuredTeaserDescription: "This is a custom feature desc",
            featuredQuote: "A sanctuary, it’s a forever thing. And so we want to know not only what’s here now, but how it’s changing over time.”"
        },
        supplementaryTeaserOne: {
            teaserOne: "matrix-asset://api-identifier/162707",
            teaserOneDescription: "John Doe"
        },
        supplementaryTeaserTwo: {
            teaserTwo: "matrix-asset://api-identifier/162707",
            teaserTwoDescription: "Jane Smith"
        }
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
        it('Should throw an error when no parameters was provided.', async () => {
            const result = await main();

            expect(result).toBe('<!-- Error occurred in the In the news component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when no info was provided', async () => {
            const result = await main(defaultMockData);

            expect(result).toBe('<!-- Error occurred in the In the news component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info do not have fns or ctx functions', async () => {
            const mockInfo = {test: 'test'}
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the In the news component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fns or ctx is invalid', async () => {
            const mockInfo = { fns: undefined, ctx: undefined,  };
            const result = await main(defaultMockData, mockInfo);
    
            expect(result).toBe('<!-- Error occurred in the In the news component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when API_IDENTIFIER was not provided', async () => {
            const mockInfo = {
                env: {
                    BASE_DOMAIN: 'https://example.com',
                },
                fns: mockFnsCtx
            }
            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the In the news component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
                
        it('Should throw an error when API_IDENTIFIER was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        BASE_DOMAIN: 'https://example.com',
                    },
                },
                fns: mockFnsCtx
            }
            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the In the news component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when BASE_DOMAIN was not provided', async () => {
            const mockInfo = {
                env: {
                    API_IDENTIFIER: 'https://example.com',
                },
                fns: mockFnsCtx
            }
            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the In the news component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
                
        it('Should throw an error when BASE_DOMAIN was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        API_IDENTIFIER: 'https://example.com',
                    },
                },
                fns: mockFnsCtx
            }
            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the In the news component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when title is not a string', async () => {
            const mockData = {
                ...defaultMockData,
                headingConfiguration: {
                    title: [1,2,3], 
                    ctaText: 'Read More',
                    ctaUrl: 'https://example.com'
                }
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the In the news component: The "title" field must be a string type. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when ctaUrl was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                headingConfiguration: {
                    ...defaultMockData.headingConfiguration,
                    ctaUrl: 123
                }
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the In the news component: The "ctaUrl" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when ctaManualUrl was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                headingConfiguration: {
                    ...defaultMockData.headingConfiguration,
                    ctaManualUrl: 123
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the In the news component: The "ctaManualUrl" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when ctaText was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                headingConfiguration: {
                    ...defaultMockData.headingConfiguration,
                    ctaText: 123
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the In the news component: The "ctaText" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when ctaNewWindow was not a boolean type', async () => {
            const mockData = {
                ...defaultMockData,
                headingConfiguration: {
                    ...defaultMockData.headingConfiguration,
                    ctaNewWindow: 123
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the In the news component: The "ctaNewWindow" field must be a boolean. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when featuredTeaser is not a string', async () => {
            const mockData = {
                ...defaultMockData,
                featuredContent: {
                    ...defaultMockData.featuredContent,
                    featuredTeaser: [1,2,3],
                }
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the In the news component: The "featuredTeaser" field must be a string type. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when personHeadshot is not a string', async () => {
            const mockData = {
                ...defaultMockData,
                featuredContent: {
                    ...defaultMockData.featuredContent,
                    personHeadshot: { url: 'headshot.jpg' },
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the In the news component: The "personHeadshot" field must be a string type. The {"url":"headshot.jpg"} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when featuredQuote is not a string', async () => {
            const mockData = {
                ...defaultMockData,
                featuredContent: {
                    ...defaultMockData.featuredContent,
                    featuredQuote: 12345
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toContain('<!-- Error occurred in the In the news component: The "featuredQuote" field must be a string type. The 12345 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
      
        it('Should throw an error when featuredTeaserDescription is not a string', async () => {
            const mockData = {
                ...defaultMockData,
                featuredContent: {
                    ...defaultMockData.featuredContent,
                    featuredTeaserDescription: [1,2,3],
                }
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the In the news component: The "featuredTeaserDescription" field must be a string type. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when featuredCtaText is not a string', async () => {
            const mockData = {
                ...defaultMockData,
                featuredContent: {
                    ...defaultMockData.featuredContent,
                    featuredCtaText: true
                }
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the In the news component: The "featuredCtaText" field must be a string type. The true was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when teaserOne is not a string', async () => {
        const mockData = {
            ...defaultMockData,
            supplementaryTeaserOne: {
                ...defaultMockData.supplementaryTeaserOne,
                teaserOne: [1,2,3],
            }
        };
        const result = await main(mockData, defaultMockInfo);
        expect(result).toContain('<!-- Error occurred in the In the news component: The "teaserOne" field must be a string type. The [1,2,3] was received. -->');
        expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when teaserOneDescription is not a string', async () => {
        const mockData = {
            ...defaultMockData,
            supplementaryTeaserOne: {
                ...defaultMockData.supplementaryTeaserOne,
                teaserOneDescription: { desc: 'Test' }
            }
        };
        const result = await main(mockData, defaultMockInfo);
        expect(result).toContain('<!-- Error occurred in the In the news component: The "teaserOneDescription" field must be a string type. The {"desc":"Test"} was received. -->');
        expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when teaserTwo is not a string', async () => {
        const mockData = {
            ...defaultMockData,
            supplementaryTeaserTwo: {
                ...defaultMockData.supplementaryTeaserTwo,
                teaserTwo: [1,2,3],
            }
        };
        const result = await main(mockData, defaultMockInfo);
        expect(result).toContain('<!-- Error occurred in the In the news component: The "teaserTwo" field must be a string type. The [1,2,3] was received. -->');
        expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when teaserTwoDescription is not a string', async () => {
        const mockData = {
            ...defaultMockData,
            supplementaryTeaserTwo: {
            ...defaultMockData.supplementaryTeaserTwo,
            teaserTwoDescription: { desc: 'Test' }
            }
        };
        const result = await main(mockData, defaultMockInfo);
        expect(result).toContain('<!-- Error occurred in the In the news component: The "teaserTwoDescription" field must be a string type. The {"desc":"Test"} was received. -->');
        expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when data is null', async () => {
            const cardData = [];

            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue(cardData),
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the In the news component: Failed to fetch image data. basicAssetUri did not return an object -->"`);
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        beforeEach(() => {
            basicAssetUri.mockResolvedValueOnce({
                url: 'https://example.com/internal-link',
                attributes: {
                    alt: "Image alt"
                }
            });
        })

        it('Should return the expected HTML with valid data', async () => {
            linkedHeadingService.mockResolvedValueOnce({
                title: "Sample Heading",
                ctaText: "Learn More",
                ctaLink: "https://example.com",
                ctaNewWindow: false
            });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="in-the-news"><div class="su-mx-auto su-component-container su-container-large su-container-px"><div class="su-component-line-heading su-flex su-flex-wrap su-items-baseline su-gap-5 su-gap-x-13 md:su-gap-13"><h2 class="su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white su-text-black">Sample Heading</h2><hr aria-hidden="true" class="md:su-mb-11 lg:su-mb-15 su-grow su-border-none su-bg-gradient-light-red-h su-h-4"/><a data-test="cta" href="https://example.com" class="su-group su-flex su-no-underline hocus:su-underline su-transition su-items-center md:su-items-end md:su-mb-8 lg:su-mb-12 su-flex-nowrap su-align-baseline su-gap-20 md:su-gap-13 su-text-19 su-decoration-2 dark:su-text-white su-text-black hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red"><span class="su-flex su-gap-2 su-items-baseline"><span>Learn More<!-- --><span class="sr-only">Sample Heading</span></span><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" class="svg-inline--fa fa-chevron-right fa-fw su-text-14 group-hocus:su-translate-x-02em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="18"><path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path></svg></span></a></div> <div class="su-w-full su-component-featured-grid"><div class="su-flex su-flex-wrap su-gap-[68px] md:su-gap-72 md:su-flex-nowrap lg:su-gap-[160px]"><div class="md:su-basis-[58.333%] lg:su-basis-[64.5%] su-grow "><article aria-label="Quote: A sanctuary, it’s a forever thing. And so we want to know not only what’s here now, but how it’s changing over time.”" class="su-component-card-pullquote su-relative su-w-full su-pl-0 lg:su-pl-[52px] su-flex su-flex-col su-justify-center su-items-center su-gap-27"> <div class="su-component-pullquote su-mx-auto su-relative su-mt-0 su-flex su-flex-wrap su-gap-27 su-justify-center su-pr-0 su-py-0"><div data-test="size-medium" class="su-component-avatar su-relative su-block su-rounded-full su-bg-gradient-light-red-h su-overflow-hidden su-min-w-[165px] su-w-[165px] su-h-[165px] su-p-7"><img class="su-absolute su-rounded-full su-object-cover su-object-center su-size-150 su-top-7 su-left-8" src="https://example.com/internal-link" alt="" /></div><blockquote class="su-w-full su-pl-39 dark:su-text-white dark:before:su-text-white su-font-serif su-text-black lg:su-pl-0"><div class="su-font-semibold su-font-serif-0 su-text-[2.4rem] md:su-text-[3.6rem] su-leading md:su-leading-[130.245%] [&>*:last-child]:su-mb-0 [&>*:last-child]:after:su-content-['”'] su-relative before:su-text-[73px] before:su-leading-[109.5px] lg:before:su-leading-[139.5px] lg:before:su-text-[93px] before:su-font-semibold before:su--mt-25 lg:before:su--mt-38 before:su-content-['“'] before:su-text-serif before:su-text-black dark:su-text-white before:su-absolute before:su-right-full lg:before:su-right-full before:su-mr-6 lg:before:su-mr-13 dark:before:su-text-white su-leading-[33.6px] md:su-leading-[46.89px]">A sanctuary, it’s a forever thing. And so we want to know not only what’s here now, but how it’s changing over time.””</div></blockquote></div>  <div class="*:su-my-0 *:su-text-18 *:dark:su-text-white *:su-font-sans *:su-w-full su-mr-auto"><p> This is a custom feature desc</p></div> <a data-test="size-small" class="su-group su-component-external-link su-flex su-items-center su-flex-nowrap su-text-digital-red su-no-underline dark:su-text-dark-mode-red hocus:su-underline hocus:su-text-black dark:hocus:su-text-white " href=https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/remembering-oct.-7-and-learning-about-israel,-gaza,-and-the-middle-east><span>Read the story on NPR</span><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up-right" class="svg-inline--fa fa-arrow-up-right su-inline-block su-ml-5 su-text-18 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-text-black dark:group-hocus:su-text-white group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12"><path fill="currentColor" d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"></path></svg></a></article></div><div class="su-relative su-flex su-flex-wrap su-grow before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black su-gap-80 md:su-gap-72 lg:su-gap-[76px] before:md:su-w-px before:su-h-px before:md:su-h-full md:su-basis-[39.5%] lg:su-basis-[30%] md:su-items-start md:su-content-start before:su-left-0 before:su-top-[-35px] before:md:su-top-0 before:md:su-left-[-36px] before:lg:su-left-[-80px]"><div class="su-relative su-w-full"><article aria-label="Researchers illuminate inner workings of new-age soft semiconductors" class="su-group su-relative"><h3 class="su-font-bold su-leading-display su-text-24 su-m-0 md:su-pb-9"><a href=https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/researchers-illuminate-inner-workings-of-new-age-soft-semiconductors class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>Researchers illuminate inner workings of new-age soft semiconductors</span><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up-right" class="svg-inline--fa fa-arrow-up-right su-inline-block su-ml-5 su-text-18 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12"><path fill="currentColor" d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"></path></svg></a></h3><div class="su-flex su-flex-col su-text-16 su-text-black-70"><div><strong>Featured scholar:</strong> </div><div><div data-test="pullquote-description" class="*:su-my-0 *:dark:su-text-white *:su-font-sans *:su-w-full *:su-font-normal *:su-leading-snug"><p> John Doe</p></div></div></div></article></div><div class="su-relative su-w-full before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black before:su-h-px before:su-left-0 before:su-top-[-40px] md:before:su-top-[-36px] lg:before:su-top-[-38px]"><article aria-label="Stanford releases preliminary enrollment data for Class of 2028" class="su-group su-relative"><h3 class="su-font-bold su-leading-display su-text-24 su-m-0 md:su-pb-9"><a href=https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/stanford-releases-preliminary-enrollment-data-for-class-of-2028 class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>Stanford releases preliminary enrollment data for Class of 2028</span><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up-right" class="svg-inline--fa fa-arrow-up-right su-inline-block su-ml-5 su-text-18 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12"><path fill="currentColor" d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"></path></svg></a></h3><div class="su-flex su-flex-col su-text-16 su-text-black-70"><div><strong>Featured scholar:</strong> </div><div><div data-test="pullquote-description" class="*:su-my-0 *:dark:su-text-white *:su-font-sans *:su-w-full *:su-font-normal *:su-leading-snug"><p> Jane Smith</p></div></div></div></article></div></div></div></div></div></section>"`);
        });

        it('Should return the expected HTML when featuredCtaText is empty ', async () => {
            linkedHeadingService.mockResolvedValueOnce({
                title: "Sample Heading",
                ctaText: "Learn More",
                ctaLink: "https://example.com",
                ctaNewWindow: false
            });
            const mockData = {
                ...defaultMockData,
                featuredContent: {
                    ...defaultMockData.featuredContent,
                    featuredCtaText: '',
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="in-the-news"><div class="su-mx-auto su-component-container su-container-large su-container-px"><div class="su-component-line-heading su-flex su-flex-wrap su-items-baseline su-gap-5 su-gap-x-13 md:su-gap-13"><h2 class="su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white su-text-black">Sample Heading</h2><hr aria-hidden="true" class="md:su-mb-11 lg:su-mb-15 su-grow su-border-none su-bg-gradient-light-red-h su-h-4"/><a data-test="cta" href="https://example.com" class="su-group su-flex su-no-underline hocus:su-underline su-transition su-items-center md:su-items-end md:su-mb-8 lg:su-mb-12 su-flex-nowrap su-align-baseline su-gap-20 md:su-gap-13 su-text-19 su-decoration-2 dark:su-text-white su-text-black hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red"><span class="su-flex su-gap-2 su-items-baseline"><span>Learn More<!-- --><span class="sr-only">Sample Heading</span></span><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" class="svg-inline--fa fa-chevron-right fa-fw su-text-14 group-hocus:su-translate-x-02em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="18"><path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path></svg></span></a></div> <div class="su-w-full su-component-featured-grid"><div class="su-flex su-flex-wrap su-gap-[68px] md:su-gap-72 md:su-flex-nowrap lg:su-gap-[160px]"><div class="md:su-basis-[58.333%] lg:su-basis-[64.5%] su-grow "><article aria-label="Quote: A sanctuary, it’s a forever thing. And so we want to know not only what’s here now, but how it’s changing over time.”" class="su-component-card-pullquote su-relative su-w-full su-pl-0 lg:su-pl-[52px] su-flex su-flex-col su-justify-center su-items-center su-gap-27"> <div class="su-component-pullquote su-mx-auto su-relative su-mt-0 su-flex su-flex-wrap su-gap-27 su-justify-center su-pr-0 su-py-0"><div data-test="size-medium" class="su-component-avatar su-relative su-block su-rounded-full su-bg-gradient-light-red-h su-overflow-hidden su-min-w-[165px] su-w-[165px] su-h-[165px] su-p-7"><img class="su-absolute su-rounded-full su-object-cover su-object-center su-size-150 su-top-7 su-left-8" src="https://example.com/internal-link" alt="" /></div><blockquote class="su-w-full su-pl-39 dark:su-text-white dark:before:su-text-white su-font-serif su-text-black lg:su-pl-0"><div class="su-font-semibold su-font-serif-0 su-text-[2.4rem] md:su-text-[3.6rem] su-leading md:su-leading-[130.245%] [&>*:last-child]:su-mb-0 [&>*:last-child]:after:su-content-['”'] su-relative before:su-text-[73px] before:su-leading-[109.5px] lg:before:su-leading-[139.5px] lg:before:su-text-[93px] before:su-font-semibold before:su--mt-25 lg:before:su--mt-38 before:su-content-['“'] before:su-text-serif before:su-text-black dark:su-text-white before:su-absolute before:su-right-full lg:before:su-right-full before:su-mr-6 lg:before:su-mr-13 dark:before:su-text-white su-leading-[33.6px] md:su-leading-[46.89px]">A sanctuary, it’s a forever thing. And so we want to know not only what’s here now, but how it’s changing over time.””</div></blockquote></div>  <div class="*:su-my-0 *:su-text-18 *:dark:su-text-white *:su-font-sans *:su-w-full su-mr-auto"><p> This is a custom feature desc</p></div> <a data-test="size-small" class="su-group su-component-external-link su-flex su-items-center su-flex-nowrap su-text-digital-red su-no-underline dark:su-text-dark-mode-red hocus:su-underline hocus:su-text-black dark:hocus:su-text-white " href=https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/remembering-oct.-7-and-learning-about-israel,-gaza,-and-the-middle-east><span>Read the story</span><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up-right" class="svg-inline--fa fa-arrow-up-right su-inline-block su-ml-5 su-text-18 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-text-black dark:group-hocus:su-text-white group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12"><path fill="currentColor" d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"></path></svg></a></article></div><div class="su-relative su-flex su-flex-wrap su-grow before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black su-gap-80 md:su-gap-72 lg:su-gap-[76px] before:md:su-w-px before:su-h-px before:md:su-h-full md:su-basis-[39.5%] lg:su-basis-[30%] md:su-items-start md:su-content-start before:su-left-0 before:su-top-[-35px] before:md:su-top-0 before:md:su-left-[-36px] before:lg:su-left-[-80px]"><div class="su-relative su-w-full"><article aria-label="Researchers illuminate inner workings of new-age soft semiconductors" class="su-group su-relative"><h3 class="su-font-bold su-leading-display su-text-24 su-m-0 md:su-pb-9"><a href=https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/researchers-illuminate-inner-workings-of-new-age-soft-semiconductors class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>Researchers illuminate inner workings of new-age soft semiconductors</span><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up-right" class="svg-inline--fa fa-arrow-up-right su-inline-block su-ml-5 su-text-18 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12"><path fill="currentColor" d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"></path></svg></a></h3><div class="su-flex su-flex-col su-text-16 su-text-black-70"><div><strong>Featured scholar:</strong> </div><div><div data-test="pullquote-description" class="*:su-my-0 *:dark:su-text-white *:su-font-sans *:su-w-full *:su-font-normal *:su-leading-snug"><p> John Doe</p></div></div></div></article></div><div class="su-relative su-w-full before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black before:su-h-px before:su-left-0 before:su-top-[-40px] md:before:su-top-[-36px] lg:before:su-top-[-38px]"><article aria-label="Stanford releases preliminary enrollment data for Class of 2028" class="su-group su-relative"><h3 class="su-font-bold su-leading-display su-text-24 su-m-0 md:su-pb-9"><a href=https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/stanford-releases-preliminary-enrollment-data-for-class-of-2028 class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>Stanford releases preliminary enrollment data for Class of 2028</span><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up-right" class="svg-inline--fa fa-arrow-up-right su-inline-block su-ml-5 su-text-18 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12"><path fill="currentColor" d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"></path></svg></a></h3><div class="su-flex su-flex-col su-text-16 su-text-black-70"><div><strong>Featured scholar:</strong> </div><div><div data-test="pullquote-description" class="*:su-my-0 *:dark:su-text-white *:su-font-sans *:su-w-full *:su-font-normal *:su-leading-snug"><p> Jane Smith</p></div></div></div></article></div></div></div></div></div></section>"`);
        });

        it('Should call cardDataAdapter and matrixCardService', async () => {
            await main(defaultMockData, defaultMockInfo);

            expect(cardDataAdapter).toHaveBeenCalled();
            expect(matrixCardService).toHaveBeenCalled();
        });

        it('Should render component without teasers description', async () => {
            const mockData = {
                ...defaultMockData,
                featuredContent: {
                    ...defaultMockData.featuredContent,
                    featuredTeaserDescription: null,
                },
                supplementaryTeaserOne: {
                    ...defaultMockData.supplementaryTeaserOne,
                    teaserOneDescription: null
                },
                supplementaryTeaserTwo: {
                    ...defaultMockData.supplementaryTeaserTwo,
                    teaserTwoDescription: ""
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="in-the-news"><div class="su-mx-auto su-component-container su-container-large su-container-px"> <div class="su-w-full su-component-featured-grid"><div class="su-flex su-flex-wrap su-gap-[68px] md:su-gap-72 md:su-flex-nowrap lg:su-gap-[160px]"><div class="md:su-basis-[58.333%] lg:su-basis-[64.5%] su-grow "><article aria-label="Quote: A sanctuary, it’s a forever thing. And so we want to know not only what’s here now, but how it’s changing over time.”" class="su-component-card-pullquote su-relative su-w-full su-pl-0 lg:su-pl-[52px] su-flex su-flex-col su-justify-center su-items-center su-gap-27"> <div class="su-component-pullquote su-mx-auto su-relative su-mt-0 su-flex su-flex-wrap su-gap-27 su-justify-center su-pr-0 su-py-0"><div data-test="size-medium" class="su-component-avatar su-relative su-block su-rounded-full su-bg-gradient-light-red-h su-overflow-hidden su-min-w-[165px] su-w-[165px] su-h-[165px] su-p-7"><img class="su-absolute su-rounded-full su-object-cover su-object-center su-size-150 su-top-7 su-left-8" src="https://example.com/internal-link" alt="" /></div><blockquote class="su-w-full su-pl-39 dark:su-text-white dark:before:su-text-white su-font-serif su-text-black lg:su-pl-0"><div class="su-font-semibold su-font-serif-0 su-text-[2.4rem] md:su-text-[3.6rem] su-leading md:su-leading-[130.245%] [&>*:last-child]:su-mb-0 [&>*:last-child]:after:su-content-['”'] su-relative before:su-text-[73px] before:su-leading-[109.5px] lg:before:su-leading-[139.5px] lg:before:su-text-[93px] before:su-font-semibold before:su--mt-25 lg:before:su--mt-38 before:su-content-['“'] before:su-text-serif before:su-text-black dark:su-text-white before:su-absolute before:su-right-full lg:before:su-right-full before:su-mr-6 lg:before:su-mr-13 dark:before:su-text-white su-leading-[33.6px] md:su-leading-[46.89px]">A sanctuary, it’s a forever thing. And so we want to know not only what’s here now, but how it’s changing over time.””</div></blockquote></div>   <a data-test="size-small" class="su-group su-component-external-link su-flex su-items-center su-flex-nowrap su-text-digital-red su-no-underline dark:su-text-dark-mode-red hocus:su-underline hocus:su-text-black dark:hocus:su-text-white " href=https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/remembering-oct.-7-and-learning-about-israel,-gaza,-and-the-middle-east><span>Read the story on NPR</span><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up-right" class="svg-inline--fa fa-arrow-up-right su-inline-block su-ml-5 su-text-18 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-text-black dark:group-hocus:su-text-white group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12"><path fill="currentColor" d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"></path></svg></a></article></div><div class="su-relative su-flex su-flex-wrap su-grow before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black su-gap-80 md:su-gap-72 lg:su-gap-[76px] before:md:su-w-px before:su-h-px before:md:su-h-full md:su-basis-[39.5%] lg:su-basis-[30%] md:su-items-start md:su-content-start before:su-left-0 before:su-top-[-35px] before:md:su-top-0 before:md:su-left-[-36px] before:lg:su-left-[-80px]"><div class="su-relative su-w-full"><article aria-label="Researchers illuminate inner workings of new-age soft semiconductors" class="su-group su-relative"><h3 class="su-font-bold su-leading-display su-text-24 su-m-0 md:su-pb-9"><a href=https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/researchers-illuminate-inner-workings-of-new-age-soft-semiconductors class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>Researchers illuminate inner workings of new-age soft semiconductors</span><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up-right" class="svg-inline--fa fa-arrow-up-right su-inline-block su-ml-5 su-text-18 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12"><path fill="currentColor" d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"></path></svg></a></h3><div class="su-flex su-flex-col su-text-16 su-text-black-70"><div> </div><div><div data-test="pullquote-description" class="*:su-my-0 *:dark:su-text-white *:su-font-sans *:su-w-full *:su-font-normal *:su-leading-snug"><p> Teaser 1 custom description</p></div></div></div></article></div><div class="su-relative su-w-full before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black before:su-h-px before:su-left-0 before:su-top-[-40px] md:before:su-top-[-36px] lg:before:su-top-[-38px]"><article aria-label="Stanford releases preliminary enrollment data for Class of 2028" class="su-group su-relative"><h3 class="su-font-bold su-leading-display su-text-24 su-m-0 md:su-pb-9"><a href=https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/stanford-releases-preliminary-enrollment-data-for-class-of-2028 class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>Stanford releases preliminary enrollment data for Class of 2028</span><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up-right" class="svg-inline--fa fa-arrow-up-right su-inline-block su-ml-5 su-text-18 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12"><path fill="currentColor" d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"></path></svg></a></h3><div class="su-flex su-flex-col su-text-16 su-text-black-70"><div> </div><div><div data-test="pullquote-description" class="*:su-my-0 *:dark:su-text-white *:su-font-sans *:su-w-full *:su-font-normal *:su-leading-snug"><p> The class is the first to be admitted under last year&#x27;s U.S. Supreme Court ruling on college admissions. Stanford will continue and expand outreach activities in support of diversity broadly defined.</p></div></div></div></article></div></div></div></div></div></section>"`);
        });

        it('Should render component with feature teaser only', async () => {
            const cardData = [
                {
                    type: "Video",
                    title: "Remembering Oct. 7 and learning about Israel, Gaza, and the Middle East",
                    liveUrl: "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/remembering-oct.-7-and-learning-about-israel,-gaza,-and-the-middle-east",
                    description: "This is a custom feature desc",
                    imageUrl: "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0022/63364/photo-1460661419201-fd4cecdf8a8b.jpeg",
                    taxonomy: null,
                    taxonomyUrl: null,
                    videoUrl: "Vh-rvUKOOp8",
                    date: "2024-01-01 00:00:00",
                    source: null,
                    authorName: null,
                    authorEmail: null,
                    quote: "A sanctuary, it's a forever thing. And so we want to know not only what's here now, but how it's changing over time.",
                    ctaText: "Read the story on NPR",
                    imageURL: "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0020/63353/photo-1461749280684-dccba630e2f6.jpg"
                }
            ];

            const mockData = {
                headingConfiguration: {
                    title: "In the news",
                    ctaText: "View all",
                    ctaUrl: "matrix-asset://api-identifier/162707",
        
                },
                featuredContent: {
                    featuredTeaser: "matrix-asset://api-identifier/162707",
                    personHeadshot: "matrix-asset://api-identifier/163591",
                    featuredCtaText: "Read the story on NPR",
                    featuredTeaserDescription: "This is a custom feature desc",
                    featuredQuote: "A sanctuary, it’s a forever thing. And so we want to know not only what’s here now, but how it’s changing over time.”"
                },
                supplementaryTeaserOne: {
                    teaserOne: "",
                    teaserOneDescription: ""
                },
                supplementaryTeaserTwo: {
                    teaserTwo: "",
                    teaserTwoDescription: ""
                }
            };

            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue(cardData),
            }));

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="in-the-news"><div class="su-mx-auto su-component-container su-container-large su-container-px"> <div class="su-w-full su-component-featured-grid"><div class="su-flex su-flex-wrap su-gap-[68px] md:su-gap-72 md:su-flex-nowrap lg:su-gap-[160px]"><div class="md:su-basis-[58.333%] lg:su-basis-[64.5%] su-grow "><article aria-label="Quote: A sanctuary, it’s a forever thing. And so we want to know not only what’s here now, but how it’s changing over time.”" class="su-component-card-pullquote su-relative su-w-full su-pl-0 lg:su-pl-[52px] su-flex su-flex-col su-justify-center su-items-center su-gap-27"> <div class="su-component-pullquote su-mx-auto su-relative su-mt-0 su-flex su-flex-wrap su-gap-27 su-justify-center su-pr-0 su-py-0"><div data-test="size-medium" class="su-component-avatar su-relative su-block su-rounded-full su-bg-gradient-light-red-h su-overflow-hidden su-min-w-[165px] su-w-[165px] su-h-[165px] su-p-7"><img class="su-absolute su-rounded-full su-object-cover su-object-center su-size-150 su-top-7 su-left-8" src="https://example.com/internal-link" alt="" /></div><blockquote class="su-w-full su-pl-39 dark:su-text-white dark:before:su-text-white su-font-serif su-text-black lg:su-pl-0"><div class="su-font-semibold su-font-serif-0 su-text-[2.4rem] md:su-text-[3.6rem] su-leading md:su-leading-[130.245%] [&>*:last-child]:su-mb-0 [&>*:last-child]:after:su-content-['”'] su-relative before:su-text-[73px] before:su-leading-[109.5px] lg:before:su-leading-[139.5px] lg:before:su-text-[93px] before:su-font-semibold before:su--mt-25 lg:before:su--mt-38 before:su-content-['“'] before:su-text-serif before:su-text-black dark:su-text-white before:su-absolute before:su-right-full lg:before:su-right-full before:su-mr-6 lg:before:su-mr-13 dark:before:su-text-white su-leading-[33.6px] md:su-leading-[46.89px]">A sanctuary, it’s a forever thing. And so we want to know not only what’s here now, but how it’s changing over time.””</div></blockquote></div>  <div class="*:su-my-0 *:su-text-18 *:dark:su-text-white *:su-font-sans *:su-w-full su-mr-auto"><p> This is a custom feature desc</p></div> <a data-test="size-small" class="su-group su-component-external-link su-flex su-items-center su-flex-nowrap su-text-digital-red su-no-underline dark:su-text-dark-mode-red hocus:su-underline hocus:su-text-black dark:hocus:su-text-white " href=https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/remembering-oct.-7-and-learning-about-israel,-gaza,-and-the-middle-east><span>Read the story on NPR</span><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up-right" class="svg-inline--fa fa-arrow-up-right su-inline-block su-ml-5 su-text-18 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-text-black dark:group-hocus:su-text-white group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12"><path fill="currentColor" d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"></path></svg></a></article></div><div class="su-relative su-flex su-flex-wrap su-grow before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black su-gap-80 md:su-gap-72 lg:su-gap-[76px] before:md:su-w-px before:su-h-px before:md:su-h-full md:su-basis-[39.5%] lg:su-basis-[30%] md:su-items-start md:su-content-start before:su-left-0 before:su-top-[-35px] before:md:su-top-0 before:md:su-left-[-36px] before:lg:su-left-[-80px]"></div></div></div></div></section>"`);
        });

        it('Should render component without poster', async () => {
            const cardData = [
                {
                    type: "Video",
                    title: "Remembering Oct. 7 and learning about Israel, Gaza, and the Middle East",
                    liveUrl: "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/remembering-oct.-7-and-learning-about-israel,-gaza,-and-the-middle-east",
                    description: "This is a custom feature desc",
                    imageUrl: "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0022/63364/photo-1460661419201-fd4cecdf8a8b.jpeg",
                    taxonomy: null,
                    taxonomyUrl: null,
                    videoUrl: "Vh-rvUKOOp8",
                    date: "2024-01-01 00:00:00",
                    source: null,
                    authorName: null,
                    authorEmail: null,
                    quote: "A sanctuary, it's a forever thing. And so we want to know not only what's here now, but how it's changing over time.",
                    ctaText: "Read the story on NPR",
                    imageURL: "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0020/63353/photo-1461749280684-dccba630e2f6.jpg"
                }
            ];

            const mockData = {
                headingConfiguration: {
                    title: "In the news",
                    ctaText: "View all",
                    ctaUrl: "matrix-asset://api-identifier/162707",
        
                },
                featuredContent: {
                    featuredTeaser: "matrix-asset://api-identifier/162707",
                    featuredCtaText: "Read the story on NPR",
                    featuredTeaserDescription: "This is a custom feature desc",
                    featuredQuote: "A sanctuary, it’s a forever thing. And so we want to know not only what’s here now, but how it’s changing over time.”"
                },
                supplementaryTeaserOne: {
                    teaserOne: "",
                    teaserOneDescription: ""
                },
                supplementaryTeaserTwo: {
                    teaserTwo: "",
                    teaserTwoDescription: ""
                }
            };

            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue(cardData),
            }));

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="in-the-news"><div class="su-mx-auto su-component-container su-container-large su-container-px"> <div class="su-w-full su-component-featured-grid"><div class="su-flex su-flex-wrap su-gap-[68px] md:su-gap-72 md:su-flex-nowrap lg:su-gap-[160px]"><div class="md:su-basis-[58.333%] lg:su-basis-[64.5%] su-grow "><article aria-label="Quote: A sanctuary, it’s a forever thing. And so we want to know not only what’s here now, but how it’s changing over time.”" class="su-component-card-pullquote su-relative su-w-full su-pl-0 lg:su-pl-[52px] su-flex su-flex-col su-justify-center su-items-center su-gap-27"> <div class="su-component-pullquote su-mx-auto su-relative su-mt-0 su-flex su-flex-wrap su-gap-27 su-justify-center su-pr-0 su-py-0"><blockquote class="su-w-full su-pl-39 dark:su-text-white dark:before:su-text-white su-font-serif su-text-black lg:su-pl-0"><div class="su-font-semibold su-font-serif-0 su-text-[2.4rem] md:su-text-[3.6rem] su-leading md:su-leading-[130.245%] [&>*:last-child]:su-mb-0 [&>*:last-child]:after:su-content-['”'] su-relative before:su-text-[73px] before:su-leading-[109.5px] lg:before:su-leading-[139.5px] lg:before:su-text-[93px] before:su-font-semibold before:su--mt-25 lg:before:su--mt-38 before:su-content-['“'] before:su-text-serif before:su-text-black dark:su-text-white before:su-absolute before:su-right-full lg:before:su-right-full before:su-mr-6 lg:before:su-mr-13 dark:before:su-text-white su-leading-[33.6px] md:su-leading-[46.89px]">A sanctuary, it’s a forever thing. And so we want to know not only what’s here now, but how it’s changing over time.””</div></blockquote></div>  <div class="*:su-my-0 *:su-text-18 *:dark:su-text-white *:su-font-sans *:su-w-full su-mr-auto"><p> This is a custom feature desc</p></div> <a data-test="size-small" class="su-group su-component-external-link su-flex su-items-center su-flex-nowrap su-text-digital-red su-no-underline dark:su-text-dark-mode-red hocus:su-underline hocus:su-text-black dark:hocus:su-text-white " href=https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/remembering-oct.-7-and-learning-about-israel,-gaza,-and-the-middle-east><span>Read the story on NPR</span><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up-right" class="svg-inline--fa fa-arrow-up-right su-inline-block su-ml-5 su-text-18 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-text-black dark:group-hocus:su-text-white group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12"><path fill="currentColor" d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"></path></svg></a></article></div><div class="su-relative su-flex su-flex-wrap su-grow before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black su-gap-80 md:su-gap-72 lg:su-gap-[76px] before:md:su-w-px before:su-h-px before:md:su-h-full md:su-basis-[39.5%] lg:su-basis-[30%] md:su-items-start md:su-content-start before:su-left-0 before:su-top-[-35px] before:md:su-top-0 before:md:su-left-[-36px] before:lg:su-left-[-80px]"></div></div></div></div></section>"`);
        });
    });

    describe('[Edge cases]', () => {
        it('Should throw an error when basicAssetUri will not be an object', async () => {
            basicAssetUri.mockResolvedValueOnce('test');

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="in-the-news"><div class="su-mx-auto su-component-container su-container-large su-container-px"> <div class="su-w-full su-component-featured-grid"><div class="su-flex su-flex-wrap su-gap-[68px] md:su-gap-72 md:su-flex-nowrap lg:su-gap-[160px]"><div class="md:su-basis-[58.333%] lg:su-basis-[64.5%] su-grow "><article aria-label="Quote: A sanctuary, it’s a forever thing. And so we want to know not only what’s here now, but how it’s changing over time.”" class="su-component-card-pullquote su-relative su-w-full su-pl-0 lg:su-pl-[52px] su-flex su-flex-col su-justify-center su-items-center su-gap-27"> <div class="su-component-pullquote su-mx-auto su-relative su-mt-0 su-flex su-flex-wrap su-gap-27 su-justify-center su-pr-0 su-py-0"><div data-test="size-medium" class="su-component-avatar su-relative su-block su-rounded-full su-bg-gradient-light-red-h su-overflow-hidden su-min-w-[165px] su-w-[165px] su-h-[165px] su-p-7"><img class="su-absolute su-rounded-full su-object-cover su-object-center su-size-150 su-top-7 su-left-8" src="https://example.com/internal-link" alt="" /></div><blockquote class="su-w-full su-pl-39 dark:su-text-white dark:before:su-text-white su-font-serif su-text-black lg:su-pl-0"><div class="su-font-semibold su-font-serif-0 su-text-[2.4rem] md:su-text-[3.6rem] su-leading md:su-leading-[130.245%] [&>*:last-child]:su-mb-0 [&>*:last-child]:after:su-content-['”'] su-relative before:su-text-[73px] before:su-leading-[109.5px] lg:before:su-leading-[139.5px] lg:before:su-text-[93px] before:su-font-semibold before:su--mt-25 lg:before:su--mt-38 before:su-content-['“'] before:su-text-serif before:su-text-black dark:su-text-white before:su-absolute before:su-right-full lg:before:su-right-full before:su-mr-6 lg:before:su-mr-13 dark:before:su-text-white su-leading-[33.6px] md:su-leading-[46.89px]">A sanctuary, it’s a forever thing. And so we want to know not only what’s here now, but how it’s changing over time.””</div></blockquote></div>  <div class="*:su-my-0 *:su-text-18 *:dark:su-text-white *:su-font-sans *:su-w-full su-mr-auto"><p> This is a custom feature desc</p></div> <a data-test="size-small" class="su-group su-component-external-link su-flex su-items-center su-flex-nowrap su-text-digital-red su-no-underline dark:su-text-dark-mode-red hocus:su-underline hocus:su-text-black dark:hocus:su-text-white " href=https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/remembering-oct.-7-and-learning-about-israel,-gaza,-and-the-middle-east><span>Read the story on NPR</span><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up-right" class="svg-inline--fa fa-arrow-up-right su-inline-block su-ml-5 su-text-18 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-text-black dark:group-hocus:su-text-white group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12"><path fill="currentColor" d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"></path></svg></a></article></div><div class="su-relative su-flex su-flex-wrap su-grow before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black su-gap-80 md:su-gap-72 lg:su-gap-[76px] before:md:su-w-px before:su-h-px before:md:su-h-full md:su-basis-[39.5%] lg:su-basis-[30%] md:su-items-start md:su-content-start before:su-left-0 before:su-top-[-35px] before:md:su-top-0 before:md:su-left-[-36px] before:lg:su-left-[-80px]"><div class="su-relative su-w-full"><article aria-label="Researchers illuminate inner workings of new-age soft semiconductors" class="su-group su-relative"><h3 class="su-font-bold su-leading-display su-text-24 su-m-0 md:su-pb-9"><a href=https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/researchers-illuminate-inner-workings-of-new-age-soft-semiconductors class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>Researchers illuminate inner workings of new-age soft semiconductors</span><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up-right" class="svg-inline--fa fa-arrow-up-right su-inline-block su-ml-5 su-text-18 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12"><path fill="currentColor" d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"></path></svg></a></h3><div class="su-flex su-flex-col su-text-16 su-text-black-70"><div><strong>Featured scholar:</strong> </div><div><div data-test="pullquote-description" class="*:su-my-0 *:dark:su-text-white *:su-font-sans *:su-w-full *:su-font-normal *:su-leading-snug"><p> John Doe</p></div></div></div></article></div><div class="su-relative su-w-full before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black before:su-h-px before:su-left-0 before:su-top-[-40px] md:before:su-top-[-36px] lg:before:su-top-[-38px]"><article aria-label="Stanford releases preliminary enrollment data for Class of 2028" class="su-group su-relative"><h3 class="su-font-bold su-leading-display su-text-24 su-m-0 md:su-pb-9"><a href=https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/stanford-releases-preliminary-enrollment-data-for-class-of-2028 class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>Stanford releases preliminary enrollment data for Class of 2028</span><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up-right" class="svg-inline--fa fa-arrow-up-right su-inline-block su-ml-5 su-text-18 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12"><path fill="currentColor" d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"></path></svg></a></h3><div class="su-flex su-flex-col su-text-16 su-text-black-70"><div><strong>Featured scholar:</strong> </div><div><div data-test="pullquote-description" class="*:su-my-0 *:dark:su-text-white *:su-font-sans *:su-w-full *:su-font-normal *:su-leading-snug"><p> Jane Smith</p></div></div></div></article></div></div></div></div></div></section>"`);
        });

        it('Should throw an error when basicAssetUri.url will be not a string', async () => {
            basicAssetUri.mockResolvedValueOnce({
                url: 123
            });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the In the news component: Failed to fetch image data. basicAssetUri did not return an object -->"`);
        });

        it('Should throw an error when basicAssetUri.url will be empty string', async () => {
            basicAssetUri.mockResolvedValueOnce({
                url: ''
            });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the In the news component: Failed to fetch image data. data.url must be a non-empty string -->"`);
        });

        it('Should throw an error when basicAssetUri.attributes will not be an object', async () => {
            basicAssetUri.mockResolvedValueOnce({
                url: 'https://example.com/internal-link',
                attributes: 'test'
            });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the In the news component: Failed to fetch image data. data.url must be a non-empty string -->"`);
        });

        it('Should throw an error when basicAssetUri.attributes will be null', async () => {
            basicAssetUri.mockResolvedValueOnce({
                url: 'https://example.com/internal-link',
                attributes: null
            });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the In the news component: Failed to fetch image data. data.attributes must be a non-null object -->"`);
        });

        it('Should throw an error when getCards will return an empty object', async () => {
            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue({}),
            }));

            const mockData = {
                headingConfiguration: {
                    title: "In the news",
                    ctaText: "View all",
                    ctaUrl: "matrix-asset://api-identifier/162707",
        
                },
                featuredContent: {
                    featuredTeaser: "matrix-asset://api-identifier/162707",
                    featuredCtaText: "Read the story on NPR",
                    featuredTeaserDescription: "This is a custom feature desc",
                    featuredQuote: "A sanctuary, it’s a forever thing. And so we want to know not only what’s here now, but how it’s changing over time.”"
                },
                supplementaryTeaserOne: {
                    teaserOne: "",
                    teaserOneDescription: ""
                },
                supplementaryTeaserTwo: {
                    teaserTwo: "",
                    teaserTwoDescription: ""
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the In the news component: The "data" cannot be undefined or null. The [] was received. -->"`);
        });

        it('Should throw an error when getCards will fail', async () => {
            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockRejectedValueOnce(new Error('Async error')),
            }));

            const mockData = {
                headingConfiguration: {
                    title: "In the news",
                    ctaText: "View all",
                    ctaUrl: "matrix-asset://api-identifier/162707",
        
                },
                featuredContent: {
                    featuredTeaser: "matrix-asset://api-identifier/162707",
                    featuredCtaText: "Read the story on NPR",
                    featuredTeaserDescription: "This is a custom feature desc",
                    featuredQuote: "A sanctuary, it’s a forever thing. And so we want to know not only what’s here now, but how it’s changing over time.”"
                },
                supplementaryTeaserOne: {
                    teaserOne: "",
                    teaserOneDescription: ""
                },
                supplementaryTeaserTwo: {
                    teaserTwo: "",
                    teaserTwoDescription: ""
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the In the news component: Failed to fetch event data. Async error -->"`);
        });

    });
});
