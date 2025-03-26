import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cardDataAdapter, matrixCardService, linkedHeadingService  } from "../../global/js/utils";
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
                "liveUrl": "https://example.com",
                "imageUrl": ["https://picsum.photos/400/400"],
                "videoUrl": "https://example.com",
                "imageAlt": ["Image of Cathy Haas, Jamie Imam, Provost Jenny Martinez, Elizabeth Kessler, Hayes"],
                "taxonomy": ["Awards, Honors & Appointments"],
                "taxonomyUrl": ["https://example.com/"],
                "type": "Video",
                "date": 1730073600000,
                "taxonomyFeaturedUnitLandingPageUrl": ["https://example.com/"],
                "taxonomyFeaturedUnitText": ["Office of the Vice Provost for Undergraduate Education"],
                "isTeaser": ["false"],
                isRealExternalLink: true,
                eventStartEndDate: "<span data-testid='event-date' class='su-mb-0 su-text-16'>Mar 21 | 12:00 AM</span>",
                uniqueID: "476f6893-b77b-43d8-ac8c-ac74d3d75dd7",
                iconType: "video",
            }
        ]),
    })),
    matrixCardService: vi.fn(),
    linkedHeadingService: vi.fn(),
}));

describe('[Single Featured Content Component]', () => {
    const mockFnsCtx = { resolveUri: vi.fn() };

    const defaultMockData = {
        headingConfiguration: {
            title: "Welcome to Stanford University!",
            ctaText: "View all",
            ctaUrl: "matrix-asset://api-identifier/28397"
        },
        contentConfiguration: {
            source: "matrix-asset://api-identifier/162618"
        }
    };

    const defaultMockInfo = {
        env: {
            API_IDENTIFIER: 'api-identifier',
            BASE_DOMAIN: 'https://google.com'
        },
        fns: mockFnsCtx
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // General error check for the main function
    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters were provided', async () => {
            const result = await main();
            
            expect(result).toContain('<!-- Error occurred in the Single featured content component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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

            expect(result).toContain('<!-- Error occurred in the Single featured content component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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

            expect(result).toContain('<!-- Error occurred in the Single featured content component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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

            expect(result).toContain('<!-- Error occurred in the Single featured content component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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

            expect(result).toContain('<!-- Error occurred in the Single featured content component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info was provided', async () => {
            const result = await main(defaultMockData);

            expect(result).toBe('<!-- Error occurred in the Single featured content component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when info do not have fns or cts functions', async () => {
            const mockInfo = { 
                env: { 
                    API_IDENTIFIER: "API_IDENTIFIER", 
                    BASE_DOMAIN: "BASE_DOMAIN" 
                } 
            }
            
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Single featured content component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when fns or ctx is invalid', async () => {
            const mockInfo = { 
                env: { 
                    API_IDENTIFIER: "API_IDENTIFIER", 
                    BASE_DOMAIN: "BASE_DOMAIN" 
                }, 
                fns: undefined, 
                ctx: undefined,  
            };
            
            const result = await main(defaultMockData, mockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Single featured content component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when source was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    source: 123
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Single featured content component: The "source" field cannot be undefined and must be a non-empty string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when source was an empty string', async () => {
            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    source: ''
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Single featured content component: The "source" field cannot be undefined and must be a non-empty string. The "" was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Single featured content component: The "title" field must be a string. The 123 was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Single featured content component: The "ctaUrl" field must be a string. The 123 was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Single featured content component: The "ctaManualUrl" field must be a string. The 123 was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Single featured content component: The "ctaText" field must be a string. The 123 was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Single featured content component: The "ctaNewWindow" field must be a boolean. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

    });

    // Check if HTML structure is rendered correctly
    describe('[Main function]', () => {
        it('Should return the expected HTML with valid data', async () => {
            linkedHeadingService.mockResolvedValueOnce({
                title: "Sample Heading",
                ctaText: "Learn More",
                ctaLink: "https://example.com",
                ctaNewWindow: false
            });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component='single-featured-content'><div class="su-mx-auto su-component-container su-container-large su-container-px">  <div class="su-component-line-heading su-flex su-flex-wrap su-items-baseline su-gap-5 su-gap-x-13 md:su-gap-13"><h2 class="su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white su-text-black"> Sample Heading </h2><hr aria-hidden="true" class="md:su-mb-11 lg:su-mb-15 su-grow su-border-none su-bg-gradient-light-red-h su-h-4"/>  <a data-test="cta" href="https://example.com" class="su-group su-flex su-no-underline hocus:su-underline su-transition su-items-center md:su-items-end md:su-mb-8 lg:su-mb-12 su-flex-nowrap su-align-baseline su-gap-20 md:su-gap-13 su-text-19 su-decoration-2 dark:su-text-white su-text-black hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red"><span class="su-flex su-gap-2 su-items-baseline"><span> Learn More<!-- --><span class="sr-only">Sample Heading</span></span> <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" class="svg-inline--fa fa-chevron-right fa-fw su-text-14 group-hocus:su-translate-x-02em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="18"><path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path></svg> </span></a>  </div> <div class='su-single-featured-content md:su-px-[6.4rem] lg:su-px-[122.5px]'> 
                  <article aria-label="Inaugural Lecturer’s Award winners honored" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                      <div class="su-mb-15 md:su-mb-26 lg:su-mb-38">
                      
                    <button
                      class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full"
                      type="button"
                      aria-haspopup="dialog"
                      data-click="open-modal"
                      data-modal-id="undefined"
                    >
                      
                  <span
                    class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]"
                  >
                    
                    
                      <img
                        class="su-absolute su-object-cover su-object-center su-size-full"
                        src="https://picsum.photos/400/400"
                        alt="Open video Image of Cathy Haas, Jamie Imam, Provost Jenny Martinez, Elizabeth Kessler, Hayes in a modal"
                      />
                    
                    
                      {/* Add a dark overlay over the image when used in Vertical Video Cards */}
                      
                      
                        <span
                          class="su-absolute su-leading-none su-left-13 su-bottom-13 md:su-left-27 md:su-bottom-27 [&>svg]:su-text-[4rem] [&>svg]:md:su-text-[6rem]">
                          <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg>
                        </span>
                      
                  
                  </span>
                
                    </button>
                  
                      </div>
                    

                    <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-13 lg:su-gap-13">
                      
                        <h2 class="su-w-full su-text-[35px] md:su-text-[40px] lg:su-text-[43px] su-leading-[42px] md:su-leading-[48px] lg:su-leading-[51.6px] su-font-serif su-my-0 su-order-2">
                          
                  <a href="https://example.com" 
                     class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                    <span>Inaugural Lecturer’s Award winners honored</span>
                    
                    <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up-right" class="svg-inline--fa fa-arrow-up-right su-inline-block su-h-auto su-align-middle su-ml-5 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"></path></svg>
                    
                  </a>
                
                        </h2>
                      

                      
                        <span data-testid="vertical-card-taxonomy"
                              class="su-relative su-inline-block su-z-10 su-font-semibold su-order-1 su-text-20 md:su-text-20 su-leading-[26px]">
                          <a href="https://example.com/"
                             class="su-text-digital-red dark:su-text-dark-mode-red su-no-underline hocus:su-underline hocus:su-text-black hocus:dark:su-text-white focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-black dark:focus-visible:su-ring-white focus-visible:su-outline-none">
                            Awards, Honors & Appointments
                          </a>
                        </span>
                      

                      
                        <p data-testid="vertical-card-type"
                           class="su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3 su-text-18 su-leading-[23.4px] md:su-text-20 md:su-leading-[26px] lg:su-text-20 lg:su-leading-[26px]">
                          <span class="type-icon" data-type="video"></span>
                            
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
                      

                      
                        <div class="su-mb-0 su-w-full [&>*:last-child]:su-mb-0 su-order-4 *:su-text-18 su-text-18 *:md:su-text-19 md:su-text-19 *:su-leading-[22.5px] su-leading-[22.5px] *:md:su-leading-[23.75px] md:su-leading-[23.75px] *:su-mt-4 *:md:su-mt-14">
                          Honorees for the annual Lecturer’s Award for Teaching and Undergraduate Education were recognized for their exceptional contributions to university life and undergraduate education.
                        </div>
                      
                    </div>
                  </article>
                 </div></div></section>"
            `);
        });

        it('Should set default ctaLink if ctaLink is empty', async () => {
            let linkedData = {
                title: "Sample Heading",
                ctaText: "Learn More",
                ctaLink: "",
                ctaNewWindow: false
            };
            
            linkedHeadingService.mockResolvedValueOnce(linkedData);

            const result = await main(defaultMockData, defaultMockInfo);

            linkedData.ctaLink = `${defaultMockInfo.env.BASE_DOMAIN}${defaultMockInfo.env.BASE_PATH}${defaultMockInfo.env.NEWS_ARCHIVE_PATH}`;

            expect(result).toMatchInlineSnapshot(`
              "<section data-component='single-featured-content'><div class="su-mx-auto su-component-container su-container-large su-container-px">  <div class="su-component-line-heading su-flex su-flex-wrap su-items-baseline su-gap-5 su-gap-x-13 md:su-gap-13"><h2 class="su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white su-text-black"> Sample Heading </h2><hr aria-hidden="true" class="md:su-mb-11 lg:su-mb-15 su-grow su-border-none su-bg-gradient-light-red-h su-h-4"/>  </div> <div class='su-single-featured-content md:su-px-[6.4rem] lg:su-px-[122.5px]'> 
                  <article aria-label="Inaugural Lecturer’s Award winners honored" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                      <div class="su-mb-15 md:su-mb-26 lg:su-mb-38">
                      
                    <button
                      class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full"
                      type="button"
                      aria-haspopup="dialog"
                      data-click="open-modal"
                      data-modal-id="undefined"
                    >
                      
                  <span
                    class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]"
                  >
                    
                    
                      <img
                        class="su-absolute su-object-cover su-object-center su-size-full"
                        src="https://picsum.photos/400/400"
                        alt="Open video Image of Cathy Haas, Jamie Imam, Provost Jenny Martinez, Elizabeth Kessler, Hayes in a modal"
                      />
                    
                    
                      {/* Add a dark overlay over the image when used in Vertical Video Cards */}
                      
                      
                        <span
                          class="su-absolute su-leading-none su-left-13 su-bottom-13 md:su-left-27 md:su-bottom-27 [&>svg]:su-text-[4rem] [&>svg]:md:su-text-[6rem]">
                          <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg>
                        </span>
                      
                  
                  </span>
                
                    </button>
                  
                      </div>
                    

                    <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-13 lg:su-gap-13">
                      
                        <h2 class="su-w-full su-text-[35px] md:su-text-[40px] lg:su-text-[43px] su-leading-[42px] md:su-leading-[48px] lg:su-leading-[51.6px] su-font-serif su-my-0 su-order-2">
                          
                  <a href="https://example.com" 
                     class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                    <span>Inaugural Lecturer’s Award winners honored</span>
                    
                    <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up-right" class="svg-inline--fa fa-arrow-up-right su-inline-block su-h-auto su-align-middle su-ml-5 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"></path></svg>
                    
                  </a>
                
                        </h2>
                      

                      
                        <span data-testid="vertical-card-taxonomy"
                              class="su-relative su-inline-block su-z-10 su-font-semibold su-order-1 su-text-20 md:su-text-20 su-leading-[26px]">
                          <a href="https://example.com/"
                             class="su-text-digital-red dark:su-text-dark-mode-red su-no-underline hocus:su-underline hocus:su-text-black hocus:dark:su-text-white focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-black dark:focus-visible:su-ring-white focus-visible:su-outline-none">
                            Awards, Honors & Appointments
                          </a>
                        </span>
                      

                      
                        <p data-testid="vertical-card-type"
                           class="su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3 su-text-18 su-leading-[23.4px] md:su-text-20 md:su-leading-[26px] lg:su-text-20 lg:su-leading-[26px]">
                          <span class="type-icon" data-type="video"></span>
                            
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
                      

                      
                        <div class="su-mb-0 su-w-full [&>*:last-child]:su-mb-0 su-order-4 *:su-text-18 su-text-18 *:md:su-text-19 md:su-text-19 *:su-leading-[22.5px] su-leading-[22.5px] *:md:su-leading-[23.75px] md:su-leading-[23.75px] *:su-mt-4 *:md:su-mt-14">
                          Honorees for the annual Lecturer’s Award for Teaching and Undergraduate Education were recognized for their exceptional contributions to university life and undergraduate education.
                        </div>
                      
                    </div>
                  </article>
                 </div></div></section>"
            `);
        });

        it('Should call cardDataAdapter and matrixCardService', async () => {
            linkedHeadingService.mockResolvedValueOnce({
                title: "Sample Heading",
                ctaText: "Learn More",
                ctaLink: "https://example.com",
                ctaNewWindow: false
            });

            await main(defaultMockData, defaultMockInfo);

            expect(cardDataAdapter).toHaveBeenCalled();
            expect(matrixCardService).toHaveBeenCalled();
        });
    });

    describe("[Edge cases]", () => {
        it("Should throw an error when getCards will fail", async () => {
            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockRejectedValueOnce(new Error('No cards')),
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<!-- Error occurred in the Single featured content: Failed to fetch feature data. No cards -->');
            expect(mockedError).toBeCalledTimes(1);

        });

        it("Should throw an error when getCards will return an empty array", async () => {
            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue([]),
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<!-- Error occurred in the Single featured content component: The "data" cannot be undefined or null. The [] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });
});
