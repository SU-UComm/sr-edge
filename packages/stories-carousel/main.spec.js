import hash from 'object-hash';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cardDataAdapter, funnelbackCardService, linkedHeadingService } from "../../global/js/utils";
import { LinkedHeading } from "../../global/js/helpers";
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
                "isTeaser": ["false"]
            },
            {
                "title": "Bass Fellows in Undergraduate Education announced",
                "description": ["The Bass University Fellows in Undergraduate Education Program recognizes faculty for extraordinary contributions to undergraduate education."],
                "liveUrl": "https://example.com",
                "imageUrl": ["https://picsum.photos/400/400"],
                "imageAlt": ["Main Quad as seen through arcade arch"],
                "taxonomy": ["Awards, Honors & Appointments"],
                "taxonomyUrl": ["https://example.com/"],
                "type": "News",
                "date": 1730073600000,
                "taxonomyFeaturedUnitLandingPageUrl": ["https://example.com/"],
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

vi.mock('../../global/js/helpers', () => ({
    LinkedHeading: vi.fn().mockReturnValue('<div class="linked-heading">Linked Heading</div>'),
    Card: vi.fn().mockImplementation(({ data }) => `<div class="card"><h2>${data?.title}</h2>${data?.description ? `<span>${data.description}</span>`: ''}</div>`),
    Modal: vi.fn().mockReturnValue('ModalHTML'),
    EmbedVideo: vi.fn().mockReturnValue('<iframe width="560" height="315" class="" src="https://example.com?autoplay=1&controls=1&rel=0" title="Watch Remembering Oct. 7 and learning about Israel, Gaza, and the Middle East" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe" ></iframe>'),
    Carousel: vi.fn().mockReturnValue(`<div class="component-slider">
    <div class="swiper component-slider-cards component-slider-peek">
        <div class="swiper-wrapper">  
        </div>
    </div>
    <div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center">
        <div aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination- su-mr-full"></div>
        <button class="component-slider-btn component-slider-prev" type="button">
            <span class="sr-only">Previous</span>
            <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                
            </span>
        </button>
        <button class="component-slider-btn component-slider-next" type="button">
            <span class="sr-only">Next</span>
            <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                
            </span>
        </button>
    </div>
</div>`),
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
              "<section data-component="stories-carousel" data-unique-id="a707350bcf9bea3cb7fe28e0219c12af">
                  <div class="su-container-class">
                      <div class="linked-heading">Linked Heading</div>
                      <div class="component-slider">
                  <div class="swiper component-slider-cards component-slider-peek">
                      <div class="swiper-wrapper">  
                      </div>
                  </div>
                  <div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center">
                      <div aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination- su-mr-full"></div>
                      <button class="component-slider-btn component-slider-prev" type="button">
                          <span class="sr-only">Previous</span>
                          <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                              
                          </span>
                      </button>
                      <button class="component-slider-btn component-slider-next" type="button">
                          <span class="sr-only">Next</span>
                          <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                              
                          </span>
                      </button>
                  </div>
              </div>
                  </div>
                  ModalHTML
              </section>"
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

            await main(defaultMockData, defaultMockInfo);
            

            linkedData.ctaLink = `${defaultMockInfo.env.BASE_DOMAIN}${defaultMockInfo.env.BASE_PATH}${defaultMockInfo.env.NEWS_ARCHIVE_PATH}`;

            expect(LinkedHeading).toHaveBeenCalledWith(linkedData);
            // expect(result).toContain(expectedDefaultLink);
        });

        it('Should call cardDataAdapter and funnelbackCardService', async () => {
            await main(defaultMockData, defaultMockInfo);

            expect(cardDataAdapter).toHaveBeenCalled();
            expect(funnelbackCardService).toHaveBeenCalled();
        });

        it('Should render LinkedHeading and Carousel components correctly', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="stories-carousel" data-unique-id="a707350bcf9bea3cb7fe28e0219c12af">
                  <div class="su-container-class">
                      <div class="linked-heading">Linked Heading</div>
                      <div class="component-slider">
                  <div class="swiper component-slider-cards component-slider-peek">
                      <div class="swiper-wrapper">  
                      </div>
                  </div>
                  <div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center">
                      <div aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination- su-mr-full"></div>
                      <button class="component-slider-btn component-slider-prev" type="button">
                          <span class="sr-only">Previous</span>
                          <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                              
                          </span>
                      </button>
                      <button class="component-slider-btn component-slider-next" type="button">
                          <span class="sr-only">Next</span>
                          <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                              
                          </span>
                      </button>
                  </div>
              </div>
                  </div>
                  ModalHTML
              </section>"
            `);
        });

        it('Should render data-unique-id when data existing', async () => {

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="stories-carousel" data-unique-id="a707350bcf9bea3cb7fe28e0219c12af">
                  <div class="su-container-class">
                      <div class="linked-heading">Linked Heading</div>
                      <div class="component-slider">
                  <div class="swiper component-slider-cards component-slider-peek">
                      <div class="swiper-wrapper">  
                      </div>
                  </div>
                  <div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center">
                      <div aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination- su-mr-full"></div>
                      <button class="component-slider-btn component-slider-prev" type="button">
                          <span class="sr-only">Previous</span>
                          <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                              
                          </span>
                      </button>
                      <button class="component-slider-btn component-slider-next" type="button">
                          <span class="sr-only">Next</span>
                          <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                              
                          </span>
                      </button>
                  </div>
              </div>
                  </div>
                  ModalHTML
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
              "<section data-component="stories-carousel" data-unique-id="a707350bcf9bea3cb7fe28e0219c12af">
                  <div class="su-container-class">
                      <div class="linked-heading">Linked Heading</div>
                      <div class="component-slider">
                  <div class="swiper component-slider-cards component-slider-peek">
                      <div class="swiper-wrapper">  
                      </div>
                  </div>
                  <div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center">
                      <div aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination- su-mr-full"></div>
                      <button class="component-slider-btn component-slider-prev" type="button">
                          <span class="sr-only">Previous</span>
                          <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                              
                          </span>
                      </button>
                      <button class="component-slider-btn component-slider-next" type="button">
                          <span class="sr-only">Next</span>
                          <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                              
                          </span>
                      </button>
                  </div>
              </div>
                  </div>
                  ModalHTML
              </section>"
            `);
        });

        it('Should generate a unique class ID based on data hash', async () => {
            const cardData = [
                {
                    "title": "Inaugural Lecturer’s Award winners honored",
                    "description": ["Honorees for the annual Lecturer’s Award for Teaching and Undergraduate Education were recognized for their exceptional contributions to university life and undergraduate education."],
                    "liveUrl": "https://example.com",
                    "imageUrl": ["https://picsum.photos/400/400"],
                    "imageAlt": ["Image of Cathy Haas, Jamie Imam, Provost Jenny Martinez, Elizabeth Kessler Hayes"],
                    "taxonomy": ["Awards, Honors & Appointments"],
                    "taxonomyUrl": ["https://example.com/"],
                    "type": "Photo",
                    "date": 1730073600000,
                    "taxonomyFeaturedUnitLandingPageUrl": ["https://example.com/"],
                    "taxonomyFeaturedUnitText": ["Office of the Vice Provost for Undergraduate Education"],
                    "isTeaser": ["false"]
                },
                {
                    "title": "Bass Fellows in Undergraduate Education announced",
                    "description": ["The Bass University Fellows in Undergraduate Education Program recognizes faculty for extraordinary contributions to undergraduate education."],
                    "liveUrl": "https://example.com",
                    "imageUrl": ["https://picsum.photos/400/400"],
                    "imageAlt": ["Main Quad as seen through arcade arch"],
                    "taxonomy": ["Awards, Honors & Appointments"],
                    "taxonomyUrl": ["https://example.com/"],
                    "type": "News",
                    "date": 1730073600000,
                    "taxonomyFeaturedUnitLandingPageUrl": ["https://example.com/"],
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
              "<section data-component="stories-carousel" data-unique-id="a707350bcf9bea3cb7fe28e0219c12af">
                  <div class="su-container-class">
                      <div class="linked-heading">Linked Heading</div>
                      <div class="component-slider">
                  <div class="swiper component-slider-cards component-slider-peek">
                      <div class="swiper-wrapper">  
                      </div>
                  </div>
                  <div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center">
                      <div aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination- su-mr-full"></div>
                      <button class="component-slider-btn component-slider-prev" type="button">
                          <span class="sr-only">Previous</span>
                          <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                              
                          </span>
                      </button>
                      <button class="component-slider-btn component-slider-next" type="button">
                          <span class="sr-only">Next</span>
                          <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                              
                          </span>
                      </button>
                  </div>
              </div>
                  </div>
                  ModalHTML
              </section>"
            `);
        });
    });
});
