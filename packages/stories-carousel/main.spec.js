import hash from 'object-hash';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cardDataAdapter, funnelbackCardService, linkedHeadingService } from "../../global/js/utils";
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    cardDataAdapter: vi.fn().mockImplementation(() => ({
        setCardService: vi.fn(),
        getCards: vi.fn().mockResolvedValue([
            {
                "title": "Inaugural Lecturer’s Award winners honored",
                "description": ["Honorees for the annual Lecturer’s Award for Teaching and Undergraduate Education were recognized for their exceptional contributions to university life and undergraduate education."],
                "liveUrl": "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford",
                "imageUrl": ["https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/image.jpg"],
                "videoUrl": "https://example.com",
                "imageAlt": ["Image of Cathy Haas, Jamie Imam, Provost Jenny Martinez, Elizabeth Kessler, Hayes"],
                "taxonomy": ["Awards, Honors & Appointments"],
                "taxonomyUrl": ["https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/"],
                "type": "Video",
                "date": 1730073600000,
                "taxonomyFeaturedUnitLandingPageUrl": ["https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/"],
                "taxonomyFeaturedUnitText": ["Office of the Vice Provost for Undergraduate Education"],
                "isTeaser": ["false"]
            },
            {
                "title": "Bass Fellows in Undergraduate Education announced",
                "description": ["The Bass University Fellows in Undergraduate Education Program recognizes faculty for extraordinary contributions to undergraduate education."],
                "liveUrl": "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford",
                "imageUrl": ["https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/image.jpg"],
                "imageAlt": ["Main Quad as seen through arcade arch"],
                "taxonomy": ["Awards, Honors & Appointments"],
                "taxonomyUrl": ["https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/"],
                "type": "News",
                "date": 1730073600000,
                "taxonomyFeaturedUnitLandingPageUrl": ["https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/"],
                "taxonomyFeaturedUnitText": ["Office of the Vice Provost for Undergraduate Education"],
                "isTeaser": ["false"]
            }
        ]),
    })),
    funnelbackCardService: vi.fn(),
    linkedHeadingService: vi.fn().mockResolvedValue({
        title: 'Sample Heading',
        ctaText: 'Learn More',
        ctaLink: 'https://example.com',
        ctaNewWindow: false
    }),
    containerClasses: vi.fn().mockReturnValue('su-container-class'),
    faIcon: {
        "ChevronRight": [`<svg class="su-fill-transparent su-stroke-current" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden=""><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`],
        "CirclePlay": [`<svg class="su-fill-transparent su-stroke-current" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden=""><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`]
    }
}));

describe('[Stories Carousel]', () => {
    const mockFnsCtx = { resolveUri: vi.fn() };

    const defaultMockData = {
        contentConfiguration: {
            searchQuery: 'sample-query'
        },
        headingConfiguration: {
            title: 'Sample Title',
            ctaUrl: 'https://example.com',
            ctaManualUrl: 'https://manual.example.com',
            ctaText: 'Learn More',
            ctaNewWindow: true
        }
    };

    const defaultMockInfo = {
        env: {
            FB_JSON_URL: 'https://example.com/json',
            API_IDENTIFIER: 'sample-api',
            BASE_DOMAIN: 'https://example.com',
            BASE_PATH: '/base',
            NEWS_ARCHIVE_PATH: '/archive'
        },
        fns: mockFnsCtx
    };
    
    beforeEach(() => {
        vi.clearAllMocks();
    });
    
    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters were provided', async () => {
            const result = await main();
            
            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when FB_JSON_URL was not provided', async () => {
            const mockInfo = {
                env: {
                    ...defaultMockInfo.env,
                    FB_JSON_URL: undefined
                }
            }

            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when FB_JSON_URL was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        ...defaultMockInfo.env,
                        FB_JSON_URL: undefined
                    }
                }
            }

            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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

            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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

            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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

            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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

            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when BASE_PATH was not provided', async () => {
            const mockInfo = {
                ...defaultMockInfo,
                env: {
                    ...defaultMockInfo.env,
                    BASE_PATH: undefined
                }
            }

            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "BASE_PATH" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when BASE_PATH was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        ...defaultMockInfo.env,
                        BASE_PATH: undefined
                    }
                }
            }

            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "BASE_PATH" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when NEWS_ARCHIVE_PATH was not provided', async () => {
            const mockInfo = {
                ...defaultMockInfo,
                env: {
                    ...defaultMockInfo.env,
                    NEWS_ARCHIVE_PATH: undefined
                }
            }
            
            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "NEWS_ARCHIVE_PATH" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when NEWS_ARCHIVE_PATH was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        ...defaultMockInfo.env,
                        NEWS_ARCHIVE_PATH: undefined
                    }
                }
            }
            
            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "NEWS_ARCHIVE_PATH" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fns or ctx was not provided', async () => {
            const mockInfo = {
                ...defaultMockInfo,
                fns: undefined
            }

            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Stories carousel component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when searchQuery was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    searchQuery: 123
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "searchQuery" field cannot be undefined and must be a non-empty string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when title was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                headingConfiguration: {
                    ...defaultMockData.headingConfiguration,
                    title: 123
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "title" field must be a string. The 123 was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "ctaUrl" field must be a string. The 123 was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "ctaManualUrl" field must be a string. The 123 was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "ctaText" field must be a string. The 123 was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "ctaNewWindow" field must be a boolean. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when data is null', async () => {
            const cardData = null;

            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue(cardData),
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the Stories carousel component: The "data" cannot be undefined or null. The [] was received. -->"`);
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        it('Should return the expected HTML with valid data', async () => {
            linkedHeadingService.mockResolvedValueOnce({
                title: "Sample Heading",
                ctaText: "Learn More",
                ctaLink: "https://example.com",
                ctaNewWindow: false
            });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "

              <section data-component="stories-carousel" data-unique-id="f268797d515beb47bd677ded4e48bf66">
                  <div class="su-container-class">
                      
                  
                      <div class="su-component-line-heading su-flex su-flex-wrap su-items-baseline su-gap-5 su-gap-x-13 md:su-gap-13 ">
                          <h2 class="su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white su-text-black">
                              Sample Heading
                          </h2>
                          <hr aria-hidden="true" class="md:su-mb-11 lg:su-mb-15 su-grow su-border-none su-bg-gradient-light-red-h su-h-4" />
                          
                          <a data-test="cta" href="https://example.com" class="su-group su-flex su-no-underline hocus:su-underline su-transition su-items-center md:su-items-end md:su-mb-8 lg:su-mb-12 su-flex-nowrap su-align-baseline su-gap-20 md:su-gap-13 su-text-19 su-decoration-2 dark:su-text-white su-text-black hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red">
                              <span class="su-flex su-gap-2 su-items-baseline">
                                  <span>
                                      Learn More <span class="sr-only">Sample Heading</span>
                                  </span>
                                  <svg class="svg-inline--fa fa-chevron-right fa-fw su-text-14 group-hocus:su-translate-x-02em su-transition-transform" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden=""><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                              </span>
                          </a>
                          
                      </div>
                  
                  
                      <div class="component-slider ">
                          <div class="swiper component-slider-cards component-slider-peek">
                              <div class="swiper-wrapper">
                                  <div class="swiper-slide">
                                      
                  <article aria-label="Inaugural Lecturer’s Award winners honored" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                      
                      <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                          
                      <button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="5406e0dcde991ec1bb67556816259e9e">
                          
                  <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                      
                      
                      <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/image.jpg" alt="Open video Image of Cathy Haas, Jamie Imam, Provost Jenny Martinez, Elizabeth Kessler, Hayes in a modal" />
                      
                                    
                                  
                                  
                                      <span class="*:su-w-[40px] su-absolute su-leading-none  su-left-13 su-bottom-13 [&>svg]:su-text-[4rem] ">
                                          <svg class="fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden=""><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                      </span>
                                  
                              
                  </span>
                      </button>
                  
                      </div>
                      
                      <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                          
                              <span data-testid="vertical-card-taxonomy" class="su-relative su-inline-block su-z-10 su-font-semibold su-text-18 su-leading-[23.4px]">
                                  <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/" class="su-text-digital-red dark:su-text-dark-mode-red su-no-underline hocus:su-underline hocus:su-text-black hocus:dark:su-text-white focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-black dark:focus-visible:su-ring-white focus-visible:su-outline-none">
                                      Awards, Honors & Appointments
                                  </a>
                              </span>
                          
                          <h2 class="su-w-full su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-font-serif su-my-0">
                              <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford" class="su-stretched-link focus:su-outline-0 focus:before:su-ring hocus:su-underline hover:su-text-digital-red su-transition su-text-black dark:su-text-white dark:hover:su-text-dark-mode-red before:su-absolute before:su-w-full before:su-h-full before:su-block before:su-top-0 before:su-left-0">
                                  Inaugural Lecturer’s Award winners honored
                                  
                              </a>
                          </h2>
                          
                          <p data-testid="vertical-card-type" class="su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-text-16 su-leading-[20.8px]">
                              
                  <svg
                      aria-hidden="true"
                      data-testid="svg-video"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="13"
                      viewBox="0 0 18 13"
                      fill="none"
                  >
                      <path d="M0 2.5C0 1.39688 0.896875 0.5 2 0.5H10C11.1031 0.5 12 1.39688 12 2.5V10.5C12 11.6031 11.1031 12.5 10 12.5H2C0.896875 12.5 0 11.6031 0 10.5V2.5ZM17.4719 1.61875C17.7969 1.79375 18 2.13125 18 2.5V10.5C18 10.8687 17.7969 11.2063 17.4719 11.3813C17.1469 11.5563 16.7531 11.5375 16.4438 11.3313L13.4438 9.33125L13 9.03438V8.5V4.5V3.96562L13.4438 3.66875L16.4438 1.66875C16.75 1.46563 17.1437 1.44375 17.4719 1.61875Z" />
                  </svg>
                              <span>Video</span>
                          </p>
                          
                          
                      </div>
                  </article>
                                  </div><div class="swiper-slide">
                                      
                  <article aria-label="Bass Fellows in Undergraduate Education announced" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                      
                      <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                          
                      <div class="su-component-card-thumbnail su-w-full su-h-full">
                       
                  <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                      
                      
                      <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/image.jpg" alt="Main Quad as seen through arcade arch" />
                      
                      
                  </span>
                      </div>
                  
                      </div>
                      
                      <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                          
                              <span data-testid="vertical-card-taxonomy" class="su-relative su-inline-block su-z-10 su-font-semibold su-text-18 su-leading-[23.4px]">
                                  <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/" class="su-text-digital-red dark:su-text-dark-mode-red su-no-underline hocus:su-underline hocus:su-text-black hocus:dark:su-text-white focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-black dark:focus-visible:su-ring-white focus-visible:su-outline-none">
                                      Awards, Honors & Appointments
                                  </a>
                              </span>
                          
                          <h2 class="su-w-full su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-font-serif su-my-0">
                              <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford" class="su-stretched-link focus:su-outline-0 focus:before:su-ring hocus:su-underline hover:su-text-digital-red su-transition su-text-black dark:su-text-white dark:hover:su-text-dark-mode-red before:su-absolute before:su-w-full before:su-h-full before:su-block before:su-top-0 before:su-left-0">
                                  Bass Fellows in Undergraduate Education announced
                                  
                              </a>
                          </h2>
                          
                          <p data-testid="vertical-card-type" class="su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-text-16 su-leading-[20.8px]">
                              
                  <svg
                      aria-hidden="true"
                      data-testid="svg-news"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                  >
                      <path d="M3 2.5C3 1.39688 3.89687 0.5 5 0.5H14C15.1031 0.5 16 1.39688 16 2.5V12.5C16 13.6031 15.1031 14.5 14 14.5H2.5C1.11875 14.5 0 13.3813 0 12V3.5C0 2.94688 0.446875 2.5 1 2.5C1.55313 2.5 2 2.94688 2 3.5V12C2 12.275 2.225 12.5 2.5 12.5C2.775 12.5 3 12.275 3 12V2.5ZM5 3.25V5.75C5 6.16563 5.33437 6.5 5.75 6.5H9.25C9.66562 6.5 10 6.16563 10 5.75V3.25C10 2.83437 9.66562 2.5 9.25 2.5H5.75C5.33437 2.5 5 2.83437 5 3.25ZM11.5 3C11.5 3.275 11.725 3.5 12 3.5H13.5C13.775 3.5 14 3.275 14 3C14 2.725 13.775 2.5 13.5 2.5H12C11.725 2.5 11.5 2.725 11.5 3ZM11.5 6C11.5 6.275 11.725 6.5 12 6.5H13.5C13.775 6.5 14 6.275 14 6C14 5.725 13.775 5.5 13.5 5.5H12C11.725 5.5 11.5 5.725 11.5 6ZM5 9C5 9.275 5.225 9.5 5.5 9.5H13.5C13.775 9.5 14 9.275 14 9C14 8.725 13.775 8.5 13.5 8.5H5.5C5.225 8.5 5 8.725 5 9ZM5 12C5 12.275 5.225 12.5 5.5 12.5H13.5C13.775 12.5 14 12.275 14 12C14 11.725 13.775 11.5 13.5 11.5H5.5C5.225 11.5 5 11.725 5 12Z" />
                  </svg>
                              <span>News</span>
                          </p>
                          
                          
                      </div>
                  </article>
                                  </div>
                              </div>
                          </div>
                          <div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center">
                              <div aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination-f268797d515beb47bd677ded4e48bf66 su-mr-full"></div>
                              <button class="component-slider-btn component-slider-prev" type="button">
                                  <span class="sr-only">Previous</span>
                                  <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                                      
                  <svg
                      class="su-fill-transparent su-stroke-current"
                      data-testid="svg-chevron-right"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                      class=""
                      aria-hidden
                  >
                      <path
                          d="M6.75 4.25L12 9.5L6.75 14.75"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                      />
                  </svg>
                                  </span>
                              </button>
                              <button class="component-slider-btn component-slider-next" type="button">
                                  <span class="sr-only">Next</span>
                                  <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                                      
                  <svg
                      class="su-fill-transparent su-stroke-current"
                      data-testid="svg-chevron-right"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                      class=""
                      aria-hidden
                  >
                      <path
                          d="M6.75 4.25L12 9.5L6.75 14.75"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                      />
                  </svg>
                                  </span>
                              </button>
                          </div>
                      </div>
                  </div>
                  
                  <div data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="5406e0dcde991ec1bb67556816259e9e">
                      <span data-focus-scope-start="true" hidden=""></span>
                      <div aria-describedby="card-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true">
                          <div class="su-modal-content">
                          
                      <iframe
                          width="560"
                          height="315"
                          class=""
                          src="https://www.youtube.com/embed/https://example.com?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0"
                          title="Watch Inaugural Lecturer’s Award winners honored"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowfullscreen="true"
                          data-modal="iframe"
                      ></iframe>
                  
                          </div>
                      </div>
                      <button type="button" class="su-component-close su-text-center" data-dismiss="modal">
                          
                      <svg
                          class="su-fill-currentcolor"
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          viewBox="0 0 30 30"
                          fill="none"
                      >
                      <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z"
                      />
                  </svg>
                          <span>Close</span>
                      </button>
                      <span data-focus-scope-end="true" hidden=""></span>
                  </div>
              </section>"
            `);
        });

        it('Should set default ctaLink if ctaLink is empty', async () => {
            linkedHeadingService.mockResolvedValueOnce({
                title: "Sample Heading",
                ctaText: "Learn More",
                ctaLink: "",
                ctaNewWindow: false
            });

            const result = await main(defaultMockData, defaultMockInfo);

            const expectedDefaultLink = `${defaultMockInfo.env.BASE_DOMAIN}${defaultMockInfo.env.BASE_PATH}${defaultMockInfo.env.NEWS_ARCHIVE_PATH}`;
            expect(result).toContain(expectedDefaultLink);
        });

        it('Should call cardDataAdapter and funnelbackCardService', async () => {
            await main(defaultMockData, defaultMockInfo);

            expect(cardDataAdapter).toHaveBeenCalled();
            expect(funnelbackCardService).toHaveBeenCalled();
        });

        it('Should render LinkedHeading and Carousel components correctly', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "

              <section data-component="stories-carousel" data-unique-id="f268797d515beb47bd677ded4e48bf66">
                  <div class="su-container-class">
                      
                  
                      <div class="su-component-line-heading su-flex su-flex-wrap su-items-baseline su-gap-5 su-gap-x-13 md:su-gap-13 ">
                          <h2 class="su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white su-text-black">
                              Sample Heading
                          </h2>
                          <hr aria-hidden="true" class="md:su-mb-11 lg:su-mb-15 su-grow su-border-none su-bg-gradient-light-red-h su-h-4" />
                          
                          <a data-test="cta" href="https://example.com" class="su-group su-flex su-no-underline hocus:su-underline su-transition su-items-center md:su-items-end md:su-mb-8 lg:su-mb-12 su-flex-nowrap su-align-baseline su-gap-20 md:su-gap-13 su-text-19 su-decoration-2 dark:su-text-white su-text-black hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red">
                              <span class="su-flex su-gap-2 su-items-baseline">
                                  <span>
                                      Learn More <span class="sr-only">Sample Heading</span>
                                  </span>
                                  <svg class="svg-inline--fa fa-chevron-right fa-fw su-text-14 group-hocus:su-translate-x-02em su-transition-transform" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden=""><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                              </span>
                          </a>
                          
                      </div>
                  
                  
                      <div class="component-slider ">
                          <div class="swiper component-slider-cards component-slider-peek">
                              <div class="swiper-wrapper">
                                  <div class="swiper-slide">
                                      
                  <article aria-label="Inaugural Lecturer’s Award winners honored" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                      
                      <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                          
                      <button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="5406e0dcde991ec1bb67556816259e9e">
                          
                  <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                      
                      
                      <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/image.jpg" alt="Open video Image of Cathy Haas, Jamie Imam, Provost Jenny Martinez, Elizabeth Kessler, Hayes in a modal" />
                      
                                    
                                  
                                  
                                      <span class="*:su-w-[40px] su-absolute su-leading-none  su-left-13 su-bottom-13 [&>svg]:su-text-[4rem] ">
                                          <svg class="fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden=""><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                      </span>
                                  
                              
                  </span>
                      </button>
                  
                      </div>
                      
                      <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                          
                              <span data-testid="vertical-card-taxonomy" class="su-relative su-inline-block su-z-10 su-font-semibold su-text-18 su-leading-[23.4px]">
                                  <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/" class="su-text-digital-red dark:su-text-dark-mode-red su-no-underline hocus:su-underline hocus:su-text-black hocus:dark:su-text-white focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-black dark:focus-visible:su-ring-white focus-visible:su-outline-none">
                                      Awards, Honors & Appointments
                                  </a>
                              </span>
                          
                          <h2 class="su-w-full su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-font-serif su-my-0">
                              <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford" class="su-stretched-link focus:su-outline-0 focus:before:su-ring hocus:su-underline hover:su-text-digital-red su-transition su-text-black dark:su-text-white dark:hover:su-text-dark-mode-red before:su-absolute before:su-w-full before:su-h-full before:su-block before:su-top-0 before:su-left-0">
                                  Inaugural Lecturer’s Award winners honored
                                  
                              </a>
                          </h2>
                          
                          <p data-testid="vertical-card-type" class="su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-text-16 su-leading-[20.8px]">
                              
                  <svg
                      aria-hidden="true"
                      data-testid="svg-video"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="13"
                      viewBox="0 0 18 13"
                      fill="none"
                  >
                      <path d="M0 2.5C0 1.39688 0.896875 0.5 2 0.5H10C11.1031 0.5 12 1.39688 12 2.5V10.5C12 11.6031 11.1031 12.5 10 12.5H2C0.896875 12.5 0 11.6031 0 10.5V2.5ZM17.4719 1.61875C17.7969 1.79375 18 2.13125 18 2.5V10.5C18 10.8687 17.7969 11.2063 17.4719 11.3813C17.1469 11.5563 16.7531 11.5375 16.4438 11.3313L13.4438 9.33125L13 9.03438V8.5V4.5V3.96562L13.4438 3.66875L16.4438 1.66875C16.75 1.46563 17.1437 1.44375 17.4719 1.61875Z" />
                  </svg>
                              <span>Video</span>
                          </p>
                          
                          
                      </div>
                  </article>
                                  </div><div class="swiper-slide">
                                      
                  <article aria-label="Bass Fellows in Undergraduate Education announced" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                      
                      <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                          
                      <div class="su-component-card-thumbnail su-w-full su-h-full">
                       
                  <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                      
                      
                      <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/image.jpg" alt="Main Quad as seen through arcade arch" />
                      
                      
                  </span>
                      </div>
                  
                      </div>
                      
                      <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                          
                              <span data-testid="vertical-card-taxonomy" class="su-relative su-inline-block su-z-10 su-font-semibold su-text-18 su-leading-[23.4px]">
                                  <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/" class="su-text-digital-red dark:su-text-dark-mode-red su-no-underline hocus:su-underline hocus:su-text-black hocus:dark:su-text-white focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-black dark:focus-visible:su-ring-white focus-visible:su-outline-none">
                                      Awards, Honors & Appointments
                                  </a>
                              </span>
                          
                          <h2 class="su-w-full su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-font-serif su-my-0">
                              <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford" class="su-stretched-link focus:su-outline-0 focus:before:su-ring hocus:su-underline hover:su-text-digital-red su-transition su-text-black dark:su-text-white dark:hover:su-text-dark-mode-red before:su-absolute before:su-w-full before:su-h-full before:su-block before:su-top-0 before:su-left-0">
                                  Bass Fellows in Undergraduate Education announced
                                  
                              </a>
                          </h2>
                          
                          <p data-testid="vertical-card-type" class="su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-text-16 su-leading-[20.8px]">
                              
                  <svg
                      aria-hidden="true"
                      data-testid="svg-news"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                  >
                      <path d="M3 2.5C3 1.39688 3.89687 0.5 5 0.5H14C15.1031 0.5 16 1.39688 16 2.5V12.5C16 13.6031 15.1031 14.5 14 14.5H2.5C1.11875 14.5 0 13.3813 0 12V3.5C0 2.94688 0.446875 2.5 1 2.5C1.55313 2.5 2 2.94688 2 3.5V12C2 12.275 2.225 12.5 2.5 12.5C2.775 12.5 3 12.275 3 12V2.5ZM5 3.25V5.75C5 6.16563 5.33437 6.5 5.75 6.5H9.25C9.66562 6.5 10 6.16563 10 5.75V3.25C10 2.83437 9.66562 2.5 9.25 2.5H5.75C5.33437 2.5 5 2.83437 5 3.25ZM11.5 3C11.5 3.275 11.725 3.5 12 3.5H13.5C13.775 3.5 14 3.275 14 3C14 2.725 13.775 2.5 13.5 2.5H12C11.725 2.5 11.5 2.725 11.5 3ZM11.5 6C11.5 6.275 11.725 6.5 12 6.5H13.5C13.775 6.5 14 6.275 14 6C14 5.725 13.775 5.5 13.5 5.5H12C11.725 5.5 11.5 5.725 11.5 6ZM5 9C5 9.275 5.225 9.5 5.5 9.5H13.5C13.775 9.5 14 9.275 14 9C14 8.725 13.775 8.5 13.5 8.5H5.5C5.225 8.5 5 8.725 5 9ZM5 12C5 12.275 5.225 12.5 5.5 12.5H13.5C13.775 12.5 14 12.275 14 12C14 11.725 13.775 11.5 13.5 11.5H5.5C5.225 11.5 5 11.725 5 12Z" />
                  </svg>
                              <span>News</span>
                          </p>
                          
                          
                      </div>
                  </article>
                                  </div>
                              </div>
                          </div>
                          <div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center">
                              <div aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination-f268797d515beb47bd677ded4e48bf66 su-mr-full"></div>
                              <button class="component-slider-btn component-slider-prev" type="button">
                                  <span class="sr-only">Previous</span>
                                  <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                                      
                  <svg
                      class="su-fill-transparent su-stroke-current"
                      data-testid="svg-chevron-right"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                      class=""
                      aria-hidden
                  >
                      <path
                          d="M6.75 4.25L12 9.5L6.75 14.75"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                      />
                  </svg>
                                  </span>
                              </button>
                              <button class="component-slider-btn component-slider-next" type="button">
                                  <span class="sr-only">Next</span>
                                  <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                                      
                  <svg
                      class="su-fill-transparent su-stroke-current"
                      data-testid="svg-chevron-right"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                      class=""
                      aria-hidden
                  >
                      <path
                          d="M6.75 4.25L12 9.5L6.75 14.75"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                      />
                  </svg>
                                  </span>
                              </button>
                          </div>
                      </div>
                  </div>
                  
                  <div data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="5406e0dcde991ec1bb67556816259e9e">
                      <span data-focus-scope-start="true" hidden=""></span>
                      <div aria-describedby="card-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true">
                          <div class="su-modal-content">
                          
                      <iframe
                          width="560"
                          height="315"
                          class=""
                          src="https://www.youtube.com/embed/https://example.com?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0"
                          title="Watch Inaugural Lecturer’s Award winners honored"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowfullscreen="true"
                          data-modal="iframe"
                      ></iframe>
                  
                          </div>
                      </div>
                      <button type="button" class="su-component-close su-text-center" data-dismiss="modal">
                          
                      <svg
                          class="su-fill-currentcolor"
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          viewBox="0 0 30 30"
                          fill="none"
                      >
                      <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z"
                      />
                  </svg>
                          <span>Close</span>
                      </button>
                      <span data-focus-scope-end="true" hidden=""></span>
                  </div>
              </section>"
            `);
        });

        it('Should render data-unique-id when data existing', async () => {

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "

              <section data-component="stories-carousel" data-unique-id="f268797d515beb47bd677ded4e48bf66">
                  <div class="su-container-class">
                      
                  
                      <div class="su-component-line-heading su-flex su-flex-wrap su-items-baseline su-gap-5 su-gap-x-13 md:su-gap-13 ">
                          <h2 class="su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white su-text-black">
                              Sample Heading
                          </h2>
                          <hr aria-hidden="true" class="md:su-mb-11 lg:su-mb-15 su-grow su-border-none su-bg-gradient-light-red-h su-h-4" />
                          
                          <a data-test="cta" href="https://example.com" class="su-group su-flex su-no-underline hocus:su-underline su-transition su-items-center md:su-items-end md:su-mb-8 lg:su-mb-12 su-flex-nowrap su-align-baseline su-gap-20 md:su-gap-13 su-text-19 su-decoration-2 dark:su-text-white su-text-black hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red">
                              <span class="su-flex su-gap-2 su-items-baseline">
                                  <span>
                                      Learn More <span class="sr-only">Sample Heading</span>
                                  </span>
                                  <svg class="svg-inline--fa fa-chevron-right fa-fw su-text-14 group-hocus:su-translate-x-02em su-transition-transform" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden=""><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                              </span>
                          </a>
                          
                      </div>
                  
                  
                      <div class="component-slider ">
                          <div class="swiper component-slider-cards component-slider-peek">
                              <div class="swiper-wrapper">
                                  <div class="swiper-slide">
                                      
                  <article aria-label="Inaugural Lecturer’s Award winners honored" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                      
                      <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                          
                      <button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="5406e0dcde991ec1bb67556816259e9e">
                          
                  <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                      
                      
                      <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/image.jpg" alt="Open video Image of Cathy Haas, Jamie Imam, Provost Jenny Martinez, Elizabeth Kessler, Hayes in a modal" />
                      
                                    
                                  
                                  
                                      <span class="*:su-w-[40px] su-absolute su-leading-none  su-left-13 su-bottom-13 [&>svg]:su-text-[4rem] ">
                                          <svg class="fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden=""><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                      </span>
                                  
                              
                  </span>
                      </button>
                  
                      </div>
                      
                      <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                          
                              <span data-testid="vertical-card-taxonomy" class="su-relative su-inline-block su-z-10 su-font-semibold su-text-18 su-leading-[23.4px]">
                                  <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/" class="su-text-digital-red dark:su-text-dark-mode-red su-no-underline hocus:su-underline hocus:su-text-black hocus:dark:su-text-white focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-black dark:focus-visible:su-ring-white focus-visible:su-outline-none">
                                      Awards, Honors & Appointments
                                  </a>
                              </span>
                          
                          <h2 class="su-w-full su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-font-serif su-my-0">
                              <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford" class="su-stretched-link focus:su-outline-0 focus:before:su-ring hocus:su-underline hover:su-text-digital-red su-transition su-text-black dark:su-text-white dark:hover:su-text-dark-mode-red before:su-absolute before:su-w-full before:su-h-full before:su-block before:su-top-0 before:su-left-0">
                                  Inaugural Lecturer’s Award winners honored
                                  
                              </a>
                          </h2>
                          
                          <p data-testid="vertical-card-type" class="su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-text-16 su-leading-[20.8px]">
                              
                  <svg
                      aria-hidden="true"
                      data-testid="svg-video"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="13"
                      viewBox="0 0 18 13"
                      fill="none"
                  >
                      <path d="M0 2.5C0 1.39688 0.896875 0.5 2 0.5H10C11.1031 0.5 12 1.39688 12 2.5V10.5C12 11.6031 11.1031 12.5 10 12.5H2C0.896875 12.5 0 11.6031 0 10.5V2.5ZM17.4719 1.61875C17.7969 1.79375 18 2.13125 18 2.5V10.5C18 10.8687 17.7969 11.2063 17.4719 11.3813C17.1469 11.5563 16.7531 11.5375 16.4438 11.3313L13.4438 9.33125L13 9.03438V8.5V4.5V3.96562L13.4438 3.66875L16.4438 1.66875C16.75 1.46563 17.1437 1.44375 17.4719 1.61875Z" />
                  </svg>
                              <span>Video</span>
                          </p>
                          
                          
                      </div>
                  </article>
                                  </div><div class="swiper-slide">
                                      
                  <article aria-label="Bass Fellows in Undergraduate Education announced" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                      
                      <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                          
                      <div class="su-component-card-thumbnail su-w-full su-h-full">
                       
                  <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                      
                      
                      <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/image.jpg" alt="Main Quad as seen through arcade arch" />
                      
                      
                  </span>
                      </div>
                  
                      </div>
                      
                      <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                          
                              <span data-testid="vertical-card-taxonomy" class="su-relative su-inline-block su-z-10 su-font-semibold su-text-18 su-leading-[23.4px]">
                                  <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/" class="su-text-digital-red dark:su-text-dark-mode-red su-no-underline hocus:su-underline hocus:su-text-black hocus:dark:su-text-white focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-black dark:focus-visible:su-ring-white focus-visible:su-outline-none">
                                      Awards, Honors & Appointments
                                  </a>
                              </span>
                          
                          <h2 class="su-w-full su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-font-serif su-my-0">
                              <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford" class="su-stretched-link focus:su-outline-0 focus:before:su-ring hocus:su-underline hover:su-text-digital-red su-transition su-text-black dark:su-text-white dark:hover:su-text-dark-mode-red before:su-absolute before:su-w-full before:su-h-full before:su-block before:su-top-0 before:su-left-0">
                                  Bass Fellows in Undergraduate Education announced
                                  
                              </a>
                          </h2>
                          
                          <p data-testid="vertical-card-type" class="su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-text-16 su-leading-[20.8px]">
                              
                  <svg
                      aria-hidden="true"
                      data-testid="svg-news"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                  >
                      <path d="M3 2.5C3 1.39688 3.89687 0.5 5 0.5H14C15.1031 0.5 16 1.39688 16 2.5V12.5C16 13.6031 15.1031 14.5 14 14.5H2.5C1.11875 14.5 0 13.3813 0 12V3.5C0 2.94688 0.446875 2.5 1 2.5C1.55313 2.5 2 2.94688 2 3.5V12C2 12.275 2.225 12.5 2.5 12.5C2.775 12.5 3 12.275 3 12V2.5ZM5 3.25V5.75C5 6.16563 5.33437 6.5 5.75 6.5H9.25C9.66562 6.5 10 6.16563 10 5.75V3.25C10 2.83437 9.66562 2.5 9.25 2.5H5.75C5.33437 2.5 5 2.83437 5 3.25ZM11.5 3C11.5 3.275 11.725 3.5 12 3.5H13.5C13.775 3.5 14 3.275 14 3C14 2.725 13.775 2.5 13.5 2.5H12C11.725 2.5 11.5 2.725 11.5 3ZM11.5 6C11.5 6.275 11.725 6.5 12 6.5H13.5C13.775 6.5 14 6.275 14 6C14 5.725 13.775 5.5 13.5 5.5H12C11.725 5.5 11.5 5.725 11.5 6ZM5 9C5 9.275 5.225 9.5 5.5 9.5H13.5C13.775 9.5 14 9.275 14 9C14 8.725 13.775 8.5 13.5 8.5H5.5C5.225 8.5 5 8.725 5 9ZM5 12C5 12.275 5.225 12.5 5.5 12.5H13.5C13.775 12.5 14 12.275 14 12C14 11.725 13.775 11.5 13.5 11.5H5.5C5.225 11.5 5 11.725 5 12Z" />
                  </svg>
                              <span>News</span>
                          </p>
                          
                          
                      </div>
                  </article>
                                  </div>
                              </div>
                          </div>
                          <div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center">
                              <div aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination-f268797d515beb47bd677ded4e48bf66 su-mr-full"></div>
                              <button class="component-slider-btn component-slider-prev" type="button">
                                  <span class="sr-only">Previous</span>
                                  <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                                      
                  <svg
                      class="su-fill-transparent su-stroke-current"
                      data-testid="svg-chevron-right"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                      class=""
                      aria-hidden
                  >
                      <path
                          d="M6.75 4.25L12 9.5L6.75 14.75"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                      />
                  </svg>
                                  </span>
                              </button>
                              <button class="component-slider-btn component-slider-next" type="button">
                                  <span class="sr-only">Next</span>
                                  <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                                      
                  <svg
                      class="su-fill-transparent su-stroke-current"
                      data-testid="svg-chevron-right"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                      class=""
                      aria-hidden
                  >
                      <path
                          d="M6.75 4.25L12 9.5L6.75 14.75"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                      />
                  </svg>
                                  </span>
                              </button>
                          </div>
                      </div>
                  </div>
                  
                  <div data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="5406e0dcde991ec1bb67556816259e9e">
                      <span data-focus-scope-start="true" hidden=""></span>
                      <div aria-describedby="card-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true">
                          <div class="su-modal-content">
                          
                      <iframe
                          width="560"
                          height="315"
                          class=""
                          src="https://www.youtube.com/embed/https://example.com?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0"
                          title="Watch Inaugural Lecturer’s Award winners honored"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowfullscreen="true"
                          data-modal="iframe"
                      ></iframe>
                  
                          </div>
                      </div>
                      <button type="button" class="su-component-close su-text-center" data-dismiss="modal">
                          
                      <svg
                          class="su-fill-currentcolor"
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          viewBox="0 0 30 30"
                          fill="none"
                      >
                      <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z"
                      />
                  </svg>
                          <span>Close</span>
                      </button>
                      <span data-focus-scope-end="true" hidden=""></span>
                  </div>
              </section>"
            `);
        });

        it('Should render empty data-unique-id when data not provided', async () => {
            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue([]),
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the Stories carousel component: The "data" cannot be undefined or null. The [] was received. -->"`);
        });

        it('Should not render LinkedHeading when was not provided', async () => {
            linkedHeadingService.mockImplementationOnce(null);

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "

              <section data-component="stories-carousel" data-unique-id="f268797d515beb47bd677ded4e48bf66">
                  <div class="su-container-class">
                      
                  
                      <div class="su-component-line-heading su-flex su-flex-wrap su-items-baseline su-gap-5 su-gap-x-13 md:su-gap-13 ">
                          <h2 class="su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white su-text-black">
                              Sample Heading
                          </h2>
                          <hr aria-hidden="true" class="md:su-mb-11 lg:su-mb-15 su-grow su-border-none su-bg-gradient-light-red-h su-h-4" />
                          
                          <a data-test="cta" href="https://example.com" class="su-group su-flex su-no-underline hocus:su-underline su-transition su-items-center md:su-items-end md:su-mb-8 lg:su-mb-12 su-flex-nowrap su-align-baseline su-gap-20 md:su-gap-13 su-text-19 su-decoration-2 dark:su-text-white su-text-black hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red">
                              <span class="su-flex su-gap-2 su-items-baseline">
                                  <span>
                                      Learn More <span class="sr-only">Sample Heading</span>
                                  </span>
                                  <svg class="svg-inline--fa fa-chevron-right fa-fw su-text-14 group-hocus:su-translate-x-02em su-transition-transform" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden=""><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                              </span>
                          </a>
                          
                      </div>
                  
                  
                      <div class="component-slider ">
                          <div class="swiper component-slider-cards component-slider-peek">
                              <div class="swiper-wrapper">
                                  <div class="swiper-slide">
                                      
                  <article aria-label="Inaugural Lecturer’s Award winners honored" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                      
                      <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                          
                      <button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="5406e0dcde991ec1bb67556816259e9e">
                          
                  <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                      
                      
                      <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/image.jpg" alt="Open video Image of Cathy Haas, Jamie Imam, Provost Jenny Martinez, Elizabeth Kessler, Hayes in a modal" />
                      
                                    
                                  
                                  
                                      <span class="*:su-w-[40px] su-absolute su-leading-none  su-left-13 su-bottom-13 [&>svg]:su-text-[4rem] ">
                                          <svg class="fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden=""><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                      </span>
                                  
                              
                  </span>
                      </button>
                  
                      </div>
                      
                      <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                          
                              <span data-testid="vertical-card-taxonomy" class="su-relative su-inline-block su-z-10 su-font-semibold su-text-18 su-leading-[23.4px]">
                                  <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/" class="su-text-digital-red dark:su-text-dark-mode-red su-no-underline hocus:su-underline hocus:su-text-black hocus:dark:su-text-white focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-black dark:focus-visible:su-ring-white focus-visible:su-outline-none">
                                      Awards, Honors & Appointments
                                  </a>
                              </span>
                          
                          <h2 class="su-w-full su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-font-serif su-my-0">
                              <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford" class="su-stretched-link focus:su-outline-0 focus:before:su-ring hocus:su-underline hover:su-text-digital-red su-transition su-text-black dark:su-text-white dark:hover:su-text-dark-mode-red before:su-absolute before:su-w-full before:su-h-full before:su-block before:su-top-0 before:su-left-0">
                                  Inaugural Lecturer’s Award winners honored
                                  
                              </a>
                          </h2>
                          
                          <p data-testid="vertical-card-type" class="su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-text-16 su-leading-[20.8px]">
                              
                  <svg
                      aria-hidden="true"
                      data-testid="svg-video"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="13"
                      viewBox="0 0 18 13"
                      fill="none"
                  >
                      <path d="M0 2.5C0 1.39688 0.896875 0.5 2 0.5H10C11.1031 0.5 12 1.39688 12 2.5V10.5C12 11.6031 11.1031 12.5 10 12.5H2C0.896875 12.5 0 11.6031 0 10.5V2.5ZM17.4719 1.61875C17.7969 1.79375 18 2.13125 18 2.5V10.5C18 10.8687 17.7969 11.2063 17.4719 11.3813C17.1469 11.5563 16.7531 11.5375 16.4438 11.3313L13.4438 9.33125L13 9.03438V8.5V4.5V3.96562L13.4438 3.66875L16.4438 1.66875C16.75 1.46563 17.1437 1.44375 17.4719 1.61875Z" />
                  </svg>
                              <span>Video</span>
                          </p>
                          
                          
                      </div>
                  </article>
                                  </div><div class="swiper-slide">
                                      
                  <article aria-label="Bass Fellows in Undergraduate Education announced" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                      
                      <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                          
                      <div class="su-component-card-thumbnail su-w-full su-h-full">
                       
                  <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                      
                      
                      <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/image.jpg" alt="Main Quad as seen through arcade arch" />
                      
                      
                  </span>
                      </div>
                  
                      </div>
                      
                      <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                          
                              <span data-testid="vertical-card-taxonomy" class="su-relative su-inline-block su-z-10 su-font-semibold su-text-18 su-leading-[23.4px]">
                                  <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/" class="su-text-digital-red dark:su-text-dark-mode-red su-no-underline hocus:su-underline hocus:su-text-black hocus:dark:su-text-white focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-black dark:focus-visible:su-ring-white focus-visible:su-outline-none">
                                      Awards, Honors & Appointments
                                  </a>
                              </span>
                          
                          <h2 class="su-w-full su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-font-serif su-my-0">
                              <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford" class="su-stretched-link focus:su-outline-0 focus:before:su-ring hocus:su-underline hover:su-text-digital-red su-transition su-text-black dark:su-text-white dark:hover:su-text-dark-mode-red before:su-absolute before:su-w-full before:su-h-full before:su-block before:su-top-0 before:su-left-0">
                                  Bass Fellows in Undergraduate Education announced
                                  
                              </a>
                          </h2>
                          
                          <p data-testid="vertical-card-type" class="su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-text-16 su-leading-[20.8px]">
                              
                  <svg
                      aria-hidden="true"
                      data-testid="svg-news"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                  >
                      <path d="M3 2.5C3 1.39688 3.89687 0.5 5 0.5H14C15.1031 0.5 16 1.39688 16 2.5V12.5C16 13.6031 15.1031 14.5 14 14.5H2.5C1.11875 14.5 0 13.3813 0 12V3.5C0 2.94688 0.446875 2.5 1 2.5C1.55313 2.5 2 2.94688 2 3.5V12C2 12.275 2.225 12.5 2.5 12.5C2.775 12.5 3 12.275 3 12V2.5ZM5 3.25V5.75C5 6.16563 5.33437 6.5 5.75 6.5H9.25C9.66562 6.5 10 6.16563 10 5.75V3.25C10 2.83437 9.66562 2.5 9.25 2.5H5.75C5.33437 2.5 5 2.83437 5 3.25ZM11.5 3C11.5 3.275 11.725 3.5 12 3.5H13.5C13.775 3.5 14 3.275 14 3C14 2.725 13.775 2.5 13.5 2.5H12C11.725 2.5 11.5 2.725 11.5 3ZM11.5 6C11.5 6.275 11.725 6.5 12 6.5H13.5C13.775 6.5 14 6.275 14 6C14 5.725 13.775 5.5 13.5 5.5H12C11.725 5.5 11.5 5.725 11.5 6ZM5 9C5 9.275 5.225 9.5 5.5 9.5H13.5C13.775 9.5 14 9.275 14 9C14 8.725 13.775 8.5 13.5 8.5H5.5C5.225 8.5 5 8.725 5 9ZM5 12C5 12.275 5.225 12.5 5.5 12.5H13.5C13.775 12.5 14 12.275 14 12C14 11.725 13.775 11.5 13.5 11.5H5.5C5.225 11.5 5 11.725 5 12Z" />
                  </svg>
                              <span>News</span>
                          </p>
                          
                          
                      </div>
                  </article>
                                  </div>
                              </div>
                          </div>
                          <div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center">
                              <div aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination-f268797d515beb47bd677ded4e48bf66 su-mr-full"></div>
                              <button class="component-slider-btn component-slider-prev" type="button">
                                  <span class="sr-only">Previous</span>
                                  <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                                      
                  <svg
                      class="su-fill-transparent su-stroke-current"
                      data-testid="svg-chevron-right"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                      class=""
                      aria-hidden
                  >
                      <path
                          d="M6.75 4.25L12 9.5L6.75 14.75"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                      />
                  </svg>
                                  </span>
                              </button>
                              <button class="component-slider-btn component-slider-next" type="button">
                                  <span class="sr-only">Next</span>
                                  <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                                      
                  <svg
                      class="su-fill-transparent su-stroke-current"
                      data-testid="svg-chevron-right"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                      class=""
                      aria-hidden
                  >
                      <path
                          d="M6.75 4.25L12 9.5L6.75 14.75"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                      />
                  </svg>
                                  </span>
                              </button>
                          </div>
                      </div>
                  </div>
                  
                  <div data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="5406e0dcde991ec1bb67556816259e9e">
                      <span data-focus-scope-start="true" hidden=""></span>
                      <div aria-describedby="card-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true">
                          <div class="su-modal-content">
                          
                      <iframe
                          width="560"
                          height="315"
                          class=""
                          src="https://www.youtube.com/embed/https://example.com?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0"
                          title="Watch Inaugural Lecturer’s Award winners honored"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowfullscreen="true"
                          data-modal="iframe"
                      ></iframe>
                  
                          </div>
                      </div>
                      <button type="button" class="su-component-close su-text-center" data-dismiss="modal">
                          
                      <svg
                          class="su-fill-currentcolor"
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          viewBox="0 0 30 30"
                          fill="none"
                      >
                      <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z"
                      />
                  </svg>
                          <span>Close</span>
                      </button>
                      <span data-focus-scope-end="true" hidden=""></span>
                  </div>
              </section>"
            `);
        });

        it('Should generate a unique class ID based on data hash', async () => {
            const cardData = [
                {
                    "title": "Inaugural Lecturer’s Award winners honored",
                    "description": ["Honorees for the annual Lecturer’s Award for Teaching and Undergraduate Education were recognized for their exceptional contributions to university life and undergraduate education."],
                    "liveUrl": "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford",
                    "imageUrl": ["https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/image.jpg"],
                    "imageAlt": ["Image of Cathy Haas, Jamie Imam, Provost Jenny Martinez, Elizabeth Kessler Hayes"],
                    "taxonomy": ["Awards, Honors & Appointments"],
                    "taxonomyUrl": ["https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/"],
                    "type": "Photo",
                    "date": 1730073600000,
                    "taxonomyFeaturedUnitLandingPageUrl": ["https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/"],
                    "taxonomyFeaturedUnitText": ["Office of the Vice Provost for Undergraduate Education"],
                    "isTeaser": ["false"]
                },
                {
                    "title": "Bass Fellows in Undergraduate Education announced",
                    "description": ["The Bass University Fellows in Undergraduate Education Program recognizes faculty for extraordinary contributions to undergraduate education."],
                    "liveUrl": "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford",
                    "imageUrl": ["https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/image.jpg"],
                    "imageAlt": ["Main Quad as seen through arcade arch"],
                    "taxonomy": ["Awards, Honors & Appointments"],
                    "taxonomyUrl": ["https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/"],
                    "type": "News",
                    "date": 1730073600000,
                    "taxonomyFeaturedUnitLandingPageUrl": ["https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/"],
                    "taxonomyFeaturedUnitText": ["Office of the Vice Provost for Undergraduate Education"],
                    "isTeaser": ["false"]
                }
            ];

            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue(cardData),
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            const dataHash = hash.MD5(JSON.stringify(cardData));
            expect(result).toContain(`data-unique-id="${dataHash}"`);
        });

        it('Should render Card and Modal components based on data type', async () => {
            const result = await main(defaultMockData, defaultMockInfo);
            
            expect(result).toMatchInlineSnapshot(`
              "

              <section data-component="stories-carousel" data-unique-id="f268797d515beb47bd677ded4e48bf66">
                  <div class="su-container-class">
                      
                  
                      <div class="su-component-line-heading su-flex su-flex-wrap su-items-baseline su-gap-5 su-gap-x-13 md:su-gap-13 ">
                          <h2 class="su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white su-text-black">
                              Sample Heading
                          </h2>
                          <hr aria-hidden="true" class="md:su-mb-11 lg:su-mb-15 su-grow su-border-none su-bg-gradient-light-red-h su-h-4" />
                          
                          <a data-test="cta" href="https://example.com" class="su-group su-flex su-no-underline hocus:su-underline su-transition su-items-center md:su-items-end md:su-mb-8 lg:su-mb-12 su-flex-nowrap su-align-baseline su-gap-20 md:su-gap-13 su-text-19 su-decoration-2 dark:su-text-white su-text-black hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red">
                              <span class="su-flex su-gap-2 su-items-baseline">
                                  <span>
                                      Learn More <span class="sr-only">Sample Heading</span>
                                  </span>
                                  <svg class="svg-inline--fa fa-chevron-right fa-fw su-text-14 group-hocus:su-translate-x-02em su-transition-transform" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden=""><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                              </span>
                          </a>
                          
                      </div>
                  
                  
                      <div class="component-slider ">
                          <div class="swiper component-slider-cards component-slider-peek">
                              <div class="swiper-wrapper">
                                  <div class="swiper-slide">
                                      
                  <article aria-label="Inaugural Lecturer’s Award winners honored" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                      
                      <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                          
                      <button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="5406e0dcde991ec1bb67556816259e9e">
                          
                  <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                      
                      
                      <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/image.jpg" alt="Open video Image of Cathy Haas, Jamie Imam, Provost Jenny Martinez, Elizabeth Kessler, Hayes in a modal" />
                      
                                    
                                  
                                  
                                      <span class="*:su-w-[40px] su-absolute su-leading-none  su-left-13 su-bottom-13 [&>svg]:su-text-[4rem] ">
                                          <svg class="fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden=""><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                      </span>
                                  
                              
                  </span>
                      </button>
                  
                      </div>
                      
                      <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                          
                              <span data-testid="vertical-card-taxonomy" class="su-relative su-inline-block su-z-10 su-font-semibold su-text-18 su-leading-[23.4px]">
                                  <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/" class="su-text-digital-red dark:su-text-dark-mode-red su-no-underline hocus:su-underline hocus:su-text-black hocus:dark:su-text-white focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-black dark:focus-visible:su-ring-white focus-visible:su-outline-none">
                                      Awards, Honors & Appointments
                                  </a>
                              </span>
                          
                          <h2 class="su-w-full su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-font-serif su-my-0">
                              <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford" class="su-stretched-link focus:su-outline-0 focus:before:su-ring hocus:su-underline hover:su-text-digital-red su-transition su-text-black dark:su-text-white dark:hover:su-text-dark-mode-red before:su-absolute before:su-w-full before:su-h-full before:su-block before:su-top-0 before:su-left-0">
                                  Inaugural Lecturer’s Award winners honored
                                  
                              </a>
                          </h2>
                          
                          <p data-testid="vertical-card-type" class="su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-text-16 su-leading-[20.8px]">
                              
                  <svg
                      aria-hidden="true"
                      data-testid="svg-video"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="13"
                      viewBox="0 0 18 13"
                      fill="none"
                  >
                      <path d="M0 2.5C0 1.39688 0.896875 0.5 2 0.5H10C11.1031 0.5 12 1.39688 12 2.5V10.5C12 11.6031 11.1031 12.5 10 12.5H2C0.896875 12.5 0 11.6031 0 10.5V2.5ZM17.4719 1.61875C17.7969 1.79375 18 2.13125 18 2.5V10.5C18 10.8687 17.7969 11.2063 17.4719 11.3813C17.1469 11.5563 16.7531 11.5375 16.4438 11.3313L13.4438 9.33125L13 9.03438V8.5V4.5V3.96562L13.4438 3.66875L16.4438 1.66875C16.75 1.46563 17.1437 1.44375 17.4719 1.61875Z" />
                  </svg>
                              <span>Video</span>
                          </p>
                          
                          
                      </div>
                  </article>
                                  </div><div class="swiper-slide">
                                      
                  <article aria-label="Bass Fellows in Undergraduate Education announced" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                      
                      <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                          
                      <div class="su-component-card-thumbnail su-w-full su-h-full">
                       
                  <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                      
                      
                      <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/image.jpg" alt="Main Quad as seen through arcade arch" />
                      
                      
                  </span>
                      </div>
                  
                      </div>
                      
                      <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                          
                              <span data-testid="vertical-card-taxonomy" class="su-relative su-inline-block su-z-10 su-font-semibold su-text-18 su-leading-[23.4px]">
                                  <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/" class="su-text-digital-red dark:su-text-dark-mode-red su-no-underline hocus:su-underline hocus:su-text-black hocus:dark:su-text-white focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-black dark:focus-visible:su-ring-white focus-visible:su-outline-none">
                                      Awards, Honors & Appointments
                                  </a>
                              </span>
                          
                          <h2 class="su-w-full su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-font-serif su-my-0">
                              <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford" class="su-stretched-link focus:su-outline-0 focus:before:su-ring hocus:su-underline hover:su-text-digital-red su-transition su-text-black dark:su-text-white dark:hover:su-text-dark-mode-red before:su-absolute before:su-w-full before:su-h-full before:su-block before:su-top-0 before:su-left-0">
                                  Bass Fellows in Undergraduate Education announced
                                  
                              </a>
                          </h2>
                          
                          <p data-testid="vertical-card-type" class="su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-text-16 su-leading-[20.8px]">
                              
                  <svg
                      aria-hidden="true"
                      data-testid="svg-news"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                  >
                      <path d="M3 2.5C3 1.39688 3.89687 0.5 5 0.5H14C15.1031 0.5 16 1.39688 16 2.5V12.5C16 13.6031 15.1031 14.5 14 14.5H2.5C1.11875 14.5 0 13.3813 0 12V3.5C0 2.94688 0.446875 2.5 1 2.5C1.55313 2.5 2 2.94688 2 3.5V12C2 12.275 2.225 12.5 2.5 12.5C2.775 12.5 3 12.275 3 12V2.5ZM5 3.25V5.75C5 6.16563 5.33437 6.5 5.75 6.5H9.25C9.66562 6.5 10 6.16563 10 5.75V3.25C10 2.83437 9.66562 2.5 9.25 2.5H5.75C5.33437 2.5 5 2.83437 5 3.25ZM11.5 3C11.5 3.275 11.725 3.5 12 3.5H13.5C13.775 3.5 14 3.275 14 3C14 2.725 13.775 2.5 13.5 2.5H12C11.725 2.5 11.5 2.725 11.5 3ZM11.5 6C11.5 6.275 11.725 6.5 12 6.5H13.5C13.775 6.5 14 6.275 14 6C14 5.725 13.775 5.5 13.5 5.5H12C11.725 5.5 11.5 5.725 11.5 6ZM5 9C5 9.275 5.225 9.5 5.5 9.5H13.5C13.775 9.5 14 9.275 14 9C14 8.725 13.775 8.5 13.5 8.5H5.5C5.225 8.5 5 8.725 5 9ZM5 12C5 12.275 5.225 12.5 5.5 12.5H13.5C13.775 12.5 14 12.275 14 12C14 11.725 13.775 11.5 13.5 11.5H5.5C5.225 11.5 5 11.725 5 12Z" />
                  </svg>
                              <span>News</span>
                          </p>
                          
                          
                      </div>
                  </article>
                                  </div>
                              </div>
                          </div>
                          <div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center">
                              <div aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination-f268797d515beb47bd677ded4e48bf66 su-mr-full"></div>
                              <button class="component-slider-btn component-slider-prev" type="button">
                                  <span class="sr-only">Previous</span>
                                  <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                                      
                  <svg
                      class="su-fill-transparent su-stroke-current"
                      data-testid="svg-chevron-right"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                      class=""
                      aria-hidden
                  >
                      <path
                          d="M6.75 4.25L12 9.5L6.75 14.75"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                      />
                  </svg>
                                  </span>
                              </button>
                              <button class="component-slider-btn component-slider-next" type="button">
                                  <span class="sr-only">Next</span>
                                  <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                                      
                  <svg
                      class="su-fill-transparent su-stroke-current"
                      data-testid="svg-chevron-right"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                      class=""
                      aria-hidden
                  >
                      <path
                          d="M6.75 4.25L12 9.5L6.75 14.75"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                      />
                  </svg>
                                  </span>
                              </button>
                          </div>
                      </div>
                  </div>
                  
                  <div data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="5406e0dcde991ec1bb67556816259e9e">
                      <span data-focus-scope-start="true" hidden=""></span>
                      <div aria-describedby="card-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true">
                          <div class="su-modal-content">
                          
                      <iframe
                          width="560"
                          height="315"
                          class=""
                          src="https://www.youtube.com/embed/https://example.com?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0"
                          title="Watch Inaugural Lecturer’s Award winners honored"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowfullscreen="true"
                          data-modal="iframe"
                      ></iframe>
                  
                          </div>
                      </div>
                      <button type="button" class="su-component-close su-text-center" data-dismiss="modal">
                          
                      <svg
                          class="su-fill-currentcolor"
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          viewBox="0 0 30 30"
                          fill="none"
                      >
                      <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z"
                      />
                  </svg>
                          <span>Close</span>
                      </button>
                      <span data-focus-scope-end="true" hidden=""></span>
                  </div>
              </section>"
            `);
        });
    });
});
