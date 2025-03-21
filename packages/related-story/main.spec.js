import { cardDataAdapter } from "../../global/js/utils";
import { beforeEach, describe, expect, it, vi } from 'vitest';
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    cardDataAdapter: vi.fn().mockImplementation(() => ({
        setCardService: vi.fn(),
        getCards: vi.fn().mockResolvedValue([{
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
        }])
    })),
    matrixCardService: vi.fn()
}));

describe('[Related Story Content]', () => {
    const mockFnsCtx = { resolveUri: vi.fn() };
    const defaultMockData = {
        contentConfiguration: {
            story: "matrix-asset://api-identifier/63412",
            descriptionOverride: "This is an override description"
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
        it('Should throw an error when API_IDENTIFIER was not provided', async () => {
            const mockInfo = {
                env: {
                    BASE_DOMAIN: 'https://example.com',
                },
                fns: mockFnsCtx
            }

            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Related story component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Related story component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when BASE_DOMAIN was not provided', async () => {
            const mockInfo = {
                env: {
                    API_IDENTIFIER: 'sample-api',
                },
                fns: mockFnsCtx
            }

            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Related story component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when BASE_DOMAIN was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        API_IDENTIFIER: 'sample-api',
                    },
                },
                fns: mockFnsCtx
            }

            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Related story component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fns or ctx was not provided', async () => {
            const mockInfo = {
                env: {
                    API_IDENTIFIER: 'sample-api',
                    BASE_DOMAIN: 'https://example.com',
                }
            }

            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toBe('<!-- Error occurred in the Related story component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when story is not a string', async () => {
            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    story: [1,2,3],
                    descriptionOverride: "Override description"
                }
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Related story component: The "story" field must be a string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when descriptionOverride is not a string', async () => {
            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    story: "matrix-asset:///api-identifier/123",
                    descriptionOverride: { text: "Override description" }
                }
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Related story component: The "descriptionOverride" field must be a string. The {"text":"Override description"} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        it('Should return the expected HTML with valid data', async () => {
            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue([{
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
                }])
            }));

            const result = await main(defaultMockData, defaultMockInfo);
            
            expect(result).toMatchInlineSnapshot(`"<section data-component="related-story"> <div class="su-mx-auto su-component-container su-container-narrow su-container-px"> <section class="story__related-story su-col-span-full sm:su-col-span-10 sm:su-col-start-2 lg:su-col-span-6 lg:su-col-start-4 su-mx-auto">  <h3 class="su-component-sidebar-heading su-w-full su-flex su-flex-wrap su-gap-6 su-my-0 su-font-sans su-text-black dark:su-text-white su-font-bold su-text-20 md:su-text-28 su-items-start"> <span data-test="icon" class="dark:su-hidden">                                                                <svg xmlns='http://www.w3.org/2000/svg' width='27' height='27' viewBox='0 0 27 27' fill='none' class='' > <g clipPath='url(#clip0_2402_1235)'> <path d='M13.5 23.625C19.0899 23.625 23.625 19.0898 23.625 13.5C23.625 7.91016 19.0899 3.375 13.5 3.375C7.91021 3.375 3.37505 7.91016 3.37505 13.5C3.37505 13.7057 3.38032 13.9113 3.39614 14.117L0.0949707 15.0873C0.0316894 14.5652 4.88181e-05 14.0379 4.88181e-05 13.5C4.88181e-05 6.04336 6.04341 0 13.5 0C20.9567 0 27 6.04336 27 13.5C27 20.9566 20.9567 27 13.5 27C12.9622 27 12.4348 26.9684 11.9127 26.9051L12.8831 23.6039C13.0887 23.6145 13.2944 23.625 13.5 23.625ZM13.6213 21.0938L14.6602 17.5605C16.4268 17.0543 17.7188 15.4301 17.7188 13.5053C17.7188 11.1744 15.8309 9.28652 13.5 9.28652C11.5752 9.28652 9.94575 10.5785 9.44478 12.3451L5.9063 13.3787C5.96958 9.23906 9.34458 5.90625 13.5 5.90625C17.6924 5.90625 21.0938 9.30762 21.0938 13.5C21.0938 17.6555 17.761 21.0305 13.6213 21.0938ZM2.05669 16.2686L12.8567 13.0939C13.4948 12.9041 14.0907 13.5 13.9061 14.1434L10.7315 24.9434C10.5153 25.6764 9.50806 25.766 9.16528 25.0805L7.65181 22.0588C7.61489 21.9902 7.57271 21.9217 7.51997 21.8637L2.87935 26.5043C2.22017 27.1635 1.14966 27.1635 0.490479 26.5043C-0.168701 25.8451 -0.168701 24.7746 0.490479 24.1154L5.1311 19.4748C5.0731 19.4221 5.00981 19.3746 4.93599 19.343L1.91958 17.8348C1.23403 17.492 1.32368 16.4848 2.05669 16.2686Z' fill='url(#paint0_linear_2402_1235)' /> </g> <defs> <linearGradient id='paint0_linear_2402_1235'> <stop class='su-stop-red' /> <stop offset='1' class='su-stop-plum' /> </linearGradient> <clipPath id='clip0_2402_1235'> <rect width='27' height='27' fill='white' /> </clipPath> </defs> </svg>                                                       </span> <span data-test="icon" class="su-hidden dark:su-block">                                                                <svg xmlns='http://www.w3.org/2000/svg' width='27' height='27' viewBox='0 0 27 27' fill='none' class='' > <g clipPath='url(#clip0_2402_1235)'> <path d='M13.5 23.625C19.0899 23.625 23.625 19.0898 23.625 13.5C23.625 7.91016 19.0899 3.375 13.5 3.375C7.91021 3.375 3.37505 7.91016 3.37505 13.5C3.37505 13.7057 3.38032 13.9113 3.39614 14.117L0.0949707 15.0873C0.0316894 14.5652 4.88181e-05 14.0379 4.88181e-05 13.5C4.88181e-05 6.04336 6.04341 0 13.5 0C20.9567 0 27 6.04336 27 13.5C27 20.9566 20.9567 27 13.5 27C12.9622 27 12.4348 26.9684 11.9127 26.9051L12.8831 23.6039C13.0887 23.6145 13.2944 23.625 13.5 23.625ZM13.6213 21.0938L14.6602 17.5605C16.4268 17.0543 17.7188 15.4301 17.7188 13.5053C17.7188 11.1744 15.8309 9.28652 13.5 9.28652C11.5752 9.28652 9.94575 10.5785 9.44478 12.3451L5.9063 13.3787C5.96958 9.23906 9.34458 5.90625 13.5 5.90625C17.6924 5.90625 21.0938 9.30762 21.0938 13.5C21.0938 17.6555 17.761 21.0305 13.6213 21.0938ZM2.05669 16.2686L12.8567 13.0939C13.4948 12.9041 14.0907 13.5 13.9061 14.1434L10.7315 24.9434C10.5153 25.6764 9.50806 25.766 9.16528 25.0805L7.65181 22.0588C7.61489 21.9902 7.57271 21.9217 7.51997 21.8637L2.87935 26.5043C2.22017 27.1635 1.14966 27.1635 0.490479 26.5043C-0.168701 25.8451 -0.168701 24.7746 0.490479 24.1154L5.1311 19.4748C5.0731 19.4221 5.00981 19.3746 4.93599 19.343L1.91958 17.8348C1.23403 17.492 1.32368 16.4848 2.05669 16.2686Z' fill='url(#bullseyePointerDarkGradient)' /> </g> <defs> <linearGradient id='bullseyePointerDarkGradient'> <stop class='su-stop-teal' /> <stop offset='1' class='su-stop-green' /> </linearGradient> <clipPath id='clip0_2402_1235'> <rect width='27' height='27' fill='white' /> </clipPath> </defs> </svg>                                                       </span> <span>Related story</span> </h3>  <a class="su-text-black hocus:su-text-black su-no-underline su-group" href=https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/stanford-releases-preliminary-enrollment-data-for-class-of-2028> <div class="su-flex su-gap-20 sm:su-gap-40 su-mt-30 lg:su-mt-36 lg:su-mt-38"> <img class="su-object-cover su-h-auto su-max-h-[103px] su-max-w-[103px] md:su-max-h-[168px] md:su-max-w-[168px] lg:su-max-h-[185px] lg:su-max-w-[185px] su-object-center" src="https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0023/63356/photo-1496171367470-9ed9a91ea931.jpeg" alt=""/> <div> <h4 class="su-transition group-hocus:su-underline group-hocus:su-text-digital-red dark:group-hocus:su-text-dark-mode-red su-text-20 dark:su-text-white sm:su-text-24 su-font-serif !su-font-bold su-leading-display su-mb-9"> Stanford releases preliminary enrollment data for Class of 2028 </h4> <div class="su-wysiwyg-content su-text-16 sm:su-text-18 su-leading-[125%] !su-m-0 su-font-normal dark:su-text-white"> This is an override description </div> </div> </div> </a> </section> </div></section>"`);
        });
    });

    describe('[Data Validation]', () => {
        it('Should throw an error when data was not received', async () => {
            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue()
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<!-- Error occurred in the Related story content component: The data cannot be undefined or null. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle empty environment object when info.env and info.set.environment are undefined', async () => {
            const mockInfo = {
                fns: mockFnsCtx,
                env: undefined,
                set: undefined
            };
            
            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Related story component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Handling empty props]', () => {
        it('Should handle empty description when using || "" fallback', async () => {
            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue([{
                    type: "News",
                    title: "Test Story",
                    liveUrl: "https://example.com/test",
                    imageUrl: "https://example.com/image.jpg",
                    imageAlt: "",
                    description: null, // Set description to null to trigger the || "" fallback
                    date: "2024-01-01 00:00:00",
                    source: null,
                    authorName: null,
                    authorEmail: null
                }])
            }));
            
            const mockData = {
                contentConfiguration: {
                    story: "matrix-asset://api-identifier/123",
                    descriptionOverride: null // Set to null to test the || "" fallback
                }
            };
            
            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="related-story"> <div class="su-mx-auto su-component-container su-container-narrow su-container-px"> <section class="story__related-story su-col-span-full sm:su-col-span-10 sm:su-col-start-2 lg:su-col-span-6 lg:su-col-start-4 su-mx-auto">  <h3 class="su-component-sidebar-heading su-w-full su-flex su-flex-wrap su-gap-6 su-my-0 su-font-sans su-text-black dark:su-text-white su-font-bold su-text-20 md:su-text-28 su-items-start"> <span data-test="icon" class="dark:su-hidden">                                                                <svg xmlns='http://www.w3.org/2000/svg' width='27' height='27' viewBox='0 0 27 27' fill='none' class='' > <g clipPath='url(#clip0_2402_1235)'> <path d='M13.5 23.625C19.0899 23.625 23.625 19.0898 23.625 13.5C23.625 7.91016 19.0899 3.375 13.5 3.375C7.91021 3.375 3.37505 7.91016 3.37505 13.5C3.37505 13.7057 3.38032 13.9113 3.39614 14.117L0.0949707 15.0873C0.0316894 14.5652 4.88181e-05 14.0379 4.88181e-05 13.5C4.88181e-05 6.04336 6.04341 0 13.5 0C20.9567 0 27 6.04336 27 13.5C27 20.9566 20.9567 27 13.5 27C12.9622 27 12.4348 26.9684 11.9127 26.9051L12.8831 23.6039C13.0887 23.6145 13.2944 23.625 13.5 23.625ZM13.6213 21.0938L14.6602 17.5605C16.4268 17.0543 17.7188 15.4301 17.7188 13.5053C17.7188 11.1744 15.8309 9.28652 13.5 9.28652C11.5752 9.28652 9.94575 10.5785 9.44478 12.3451L5.9063 13.3787C5.96958 9.23906 9.34458 5.90625 13.5 5.90625C17.6924 5.90625 21.0938 9.30762 21.0938 13.5C21.0938 17.6555 17.761 21.0305 13.6213 21.0938ZM2.05669 16.2686L12.8567 13.0939C13.4948 12.9041 14.0907 13.5 13.9061 14.1434L10.7315 24.9434C10.5153 25.6764 9.50806 25.766 9.16528 25.0805L7.65181 22.0588C7.61489 21.9902 7.57271 21.9217 7.51997 21.8637L2.87935 26.5043C2.22017 27.1635 1.14966 27.1635 0.490479 26.5043C-0.168701 25.8451 -0.168701 24.7746 0.490479 24.1154L5.1311 19.4748C5.0731 19.4221 5.00981 19.3746 4.93599 19.343L1.91958 17.8348C1.23403 17.492 1.32368 16.4848 2.05669 16.2686Z' fill='url(#paint0_linear_2402_1235)' /> </g> <defs> <linearGradient id='paint0_linear_2402_1235'> <stop class='su-stop-red' /> <stop offset='1' class='su-stop-plum' /> </linearGradient> <clipPath id='clip0_2402_1235'> <rect width='27' height='27' fill='white' /> </clipPath> </defs> </svg>                                                       </span> <span data-test="icon" class="su-hidden dark:su-block">                                                                <svg xmlns='http://www.w3.org/2000/svg' width='27' height='27' viewBox='0 0 27 27' fill='none' class='' > <g clipPath='url(#clip0_2402_1235)'> <path d='M13.5 23.625C19.0899 23.625 23.625 19.0898 23.625 13.5C23.625 7.91016 19.0899 3.375 13.5 3.375C7.91021 3.375 3.37505 7.91016 3.37505 13.5C3.37505 13.7057 3.38032 13.9113 3.39614 14.117L0.0949707 15.0873C0.0316894 14.5652 4.88181e-05 14.0379 4.88181e-05 13.5C4.88181e-05 6.04336 6.04341 0 13.5 0C20.9567 0 27 6.04336 27 13.5C27 20.9566 20.9567 27 13.5 27C12.9622 27 12.4348 26.9684 11.9127 26.9051L12.8831 23.6039C13.0887 23.6145 13.2944 23.625 13.5 23.625ZM13.6213 21.0938L14.6602 17.5605C16.4268 17.0543 17.7188 15.4301 17.7188 13.5053C17.7188 11.1744 15.8309 9.28652 13.5 9.28652C11.5752 9.28652 9.94575 10.5785 9.44478 12.3451L5.9063 13.3787C5.96958 9.23906 9.34458 5.90625 13.5 5.90625C17.6924 5.90625 21.0938 9.30762 21.0938 13.5C21.0938 17.6555 17.761 21.0305 13.6213 21.0938ZM2.05669 16.2686L12.8567 13.0939C13.4948 12.9041 14.0907 13.5 13.9061 14.1434L10.7315 24.9434C10.5153 25.6764 9.50806 25.766 9.16528 25.0805L7.65181 22.0588C7.61489 21.9902 7.57271 21.9217 7.51997 21.8637L2.87935 26.5043C2.22017 27.1635 1.14966 27.1635 0.490479 26.5043C-0.168701 25.8451 -0.168701 24.7746 0.490479 24.1154L5.1311 19.4748C5.0731 19.4221 5.00981 19.3746 4.93599 19.343L1.91958 17.8348C1.23403 17.492 1.32368 16.4848 2.05669 16.2686Z' fill='url(#bullseyePointerDarkGradient)' /> </g> <defs> <linearGradient id='bullseyePointerDarkGradient'> <stop class='su-stop-teal' /> <stop offset='1' class='su-stop-green' /> </linearGradient> <clipPath id='clip0_2402_1235'> <rect width='27' height='27' fill='white' /> </clipPath> </defs> </svg>                                                       </span> <span>Related story</span> </h3>  <a class="su-text-black hocus:su-text-black su-no-underline su-group" href=https://example.com/test> <div class="su-flex su-gap-20 sm:su-gap-40 su-mt-30 lg:su-mt-36 lg:su-mt-38"> <img class="su-object-cover su-h-auto su-max-h-[103px] su-max-w-[103px] md:su-max-h-[168px] md:su-max-w-[168px] lg:su-max-h-[185px] lg:su-max-w-[185px] su-object-center" src="https://example.com/image.jpg" alt=""/> <div> <h4 class="su-transition group-hocus:su-underline group-hocus:su-text-digital-red dark:group-hocus:su-text-dark-mode-red su-text-20 dark:su-text-white sm:su-text-24 su-font-serif !su-font-bold su-leading-display su-mb-9"> Test Story </h4> <div class="su-wysiwyg-content su-text-16 sm:su-text-18 su-leading-[125%] !su-m-0 su-font-normal dark:su-text-white">  </div> </div> </div> </a> </section> </div></section>"`);
        });

        it('Should handle empty contentConfiguration object with OR operator', async () => {
            const mockData = {
                contentConfiguration: null
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Related story component: The "story" field must be a string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });
});