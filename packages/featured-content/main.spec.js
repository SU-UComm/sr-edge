import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cardDataAdapter, funnelbackCardService, matrixCardService, linkedHeadingService } from "../../global/js/utils";
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
            },
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
            }
        ]),
    })),
    funnelbackCardService: vi.fn(),
    linkedHeadingService: vi.fn().mockReturnValue({
        title: 'Sample Heading',
        ctaUrl: 'https://example.com',
        ctaManualUrl: 'https://manual.example.com',
        ctaText: 'Learn More',
        ctaNewWindow: true
    }),
    matrixCardService: vi.fn(),
    containerClasses: vi.fn().mockReturnValue('su-container-class')
}));

vi.mock('../../global/js/helpers', () => ({
    LinkedHeading: vi.fn().mockReturnValue('<div class="linked-heading">Linked Heading</div>'),
    Card: vi.fn().mockImplementation(({ data }) => `<div class="card"><h2>${data?.title}</h2>${data?.description ? `<span>${data.description}</span>`: ''}</div>`),
    Modal: vi.fn().mockReturnValue('ModalHTML'),
    EmbedVideo: vi.fn().mockReturnValue('<iframe width="560" height="315" class="" src="https://example.com?autoplay=1&controls=1&rel=0" title="Watch Remembering Oct. 7 and learning about Israel, Gaza, and the Middle East" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe" ></iframe>')
}));

describe('[Feature Content]', () => {
    const mockFnsCtx = { resolveUri: vi.fn() };
    
    const defaultMockData = {
        contentConfiguration: {
            source: 'Search',
            searchQuery: 'news'
        },
        headingConfiguration: {
            title: 'Sample Heading',
            ctaUrl: 'https://example.com',
            ctaManualUrl: 'https://manual.example.com',
            ctaText: 'Learn More',
            ctaNewWindow: true
        },
        displayConfiguration: {
            alignment: 'left',
            displayThumbnails: true,
            displayDescriptions: true
        }
    };

    const defaultMockInfo = {
        env: {
            FB_JSON_URL: 'https://funnelback.example.com/json',
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
            
            expect(result).toContain('<!-- Error occurred in the Feature content component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when FB_JSON_URL was not provided', async () => {
            const mockInfo = {
                env: {
                    API_IDENTIFIER: 'sample-api',
                    BASE_DOMAIN: 'https://example.com',
                },
                fns: mockFnsCtx
            }
            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Feature content component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when FB_JSON_URL was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        API_IDENTIFIER: 'sample-api',
                        BASE_DOMAIN: 'https://example.com',
                    },
                },
                fns: mockFnsCtx
            }
            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Feature content component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when API_IDENTIFIER was not provided', async () => {
            const mockInfo = {
                env: {
                    FB_JSON_URL: 'https://example.com/json',
                    BASE_DOMAIN: 'https://example.com',
                },
                fns: mockFnsCtx
            }
            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Feature content component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
                
        it('Should throw an error when API_IDENTIFIER was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        FB_JSON_URL: 'https://example.com/json',
                        BASE_DOMAIN: 'https://example.com',
                    },
                },
                fns: mockFnsCtx
            }
            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Feature content component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when BASE_DOMAIN was not provided', async () => {
            const mockInfo = {
                env: {
                    FB_JSON_URL: 'https://example.com/json',
                    API_IDENTIFIER: 'sample-api',
                },
                fns: mockFnsCtx
            }
            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Feature content component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when BASE_DOMAIN was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        FB_JSON_URL: 'https://example.com/json',
                        API_IDENTIFIER: 'sample-api',
                    },
                },
                fns: mockFnsCtx
            }
            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Feature content component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fns or ctx was not provided', async () => {
            const mockInfo = {
                env: {
                    FB_JSON_URL: 'https://example.com/json',
                    API_IDENTIFIER: 'sample-api',
                    BASE_DOMAIN: 'https://example.com',
                }
            }

            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Feature content component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when source was not one of ["Search", "Select"]', async () => {
            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    source: [1,2,3],
                    searchQuery: 'news'
                }
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Feature content component: The "source" field cannot be undefined and must be one of ["Search", "Select"]. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when searchQuery was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    source: 'Search',
                    searchQuery: [1,2,3]
                }
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Feature content component: The "searchQuery" field cannot be undefined and must be a non-empty string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when cards was not an array', async () => {
            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    source: 'Select',
                    cards: 'test'
                }
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Feature content component: The "cards" field must be an array. The "test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when featuredDescription was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    source: 'Select',
                    cards: [
                        {
                            "cardAsset": "matrix-asset://api-identifier/63418"
                        },
                        {
                            "cardAsset": "matrix-asset://api-identifier/63436"
                        },
                        {
                            "cardAsset": "matrix-asset://api-identifier/63412"
                        }
                    ],
                    featuredDescription: [1,2,3]
                }
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Feature content component: The "featuredDescription" field must be a string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when title was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                headingConfiguration: {
                    title: [1,2,3],
                    ctaUrl: 'https://example.com',
                    ctaManualUrl: 'https://manual.example.com',
                    ctaText: 'Learn More',
                    ctaNewWindow: true
                },
                
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Feature content component: The "title" field must be a string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when ctaUrl was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                headingConfiguration: {
                    title: 'Sample Heading',
                    ctaUrl: [1,2,3],
                    ctaManualUrl: 'https://manual.example.com',
                    ctaText: 'Learn More',
                    ctaNewWindow: true
                },
                
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Feature content component: The "ctaUrl" field must be a string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when ctaManualUrl was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                headingConfiguration: {
                    title: 'Sample Heading',
                    ctaUrl: 'https://example.com',
                    ctaManualUrl: [1,2,3],
                    ctaText: 'Learn More',
                    ctaNewWindow: true
                },
                
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Feature content component: The "ctaManualUrl" field must be a string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when ctaText was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                headingConfiguration: {
                    title: 'Sample Heading',
                    ctaUrl: 'https://example.com',
                    ctaManualUrl: 'https://manual.example.com',
                    ctaText: [1,2,3],
                    ctaNewWindow: true
                },
                
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Feature content component: The "ctaText" field must be a string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when ctaNewWindow was not a boolean', async () => {
            const mockData = {
                ...defaultMockData,
                headingConfiguration: {
                    title: 'Sample Heading',
                    ctaUrl: 'https://example.com',
                    ctaManualUrl: 'https://manual.example.com',
                    ctaText: 'Learn More',
                    ctaNewWindow: [1,2,3]
                },
                
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Feature content component: The "ctaNewWindow" field must be a boolean. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when alignment was not one of ["left", "right"]', async () => {
            const mockData = {
                ...defaultMockData,
                displayConfiguration: {
                    alignment: [1,2,3],
                    displayThumbnails: true,
                    displayDescriptions: true
                }
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Feature content component: The "alignment" field cannot be undefined and must be one of ["left", "right"]. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when displayThumbnails was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                displayConfiguration: {
                    alignment: 'left',
                    displayThumbnails: [1,2,3],
                    displayDescriptions: true
                }
                
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Feature content component: The "displayThumbnails" field must be a boolean. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when displayDescriptions was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                displayConfiguration: {
                    alignment: 'left',
                    displayThumbnails: true,
                    displayDescriptions: [1,2,3]
                }
                
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Feature content component: The "displayDescriptions" field must be a boolean. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when data was not received', async () => {
            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue([])
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<!-- Error occurred in the Feature content component: The data cannot be undefined or null. The [] was received. -->');
            expect(mockedError).toBeCalledTimes(1);

        });

        it('Should throw an error when data was not having three elements', async () => {
            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue([
                    { title: 'Featured Card', description: 'Feature Description' }
                ])
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<!-- Error occurred in the Feature content component: The data cannot have less then 3 elements. The [{"title":"Featured Card","description":"Feature Description"}] was received. -->');
            expect(mockedError).toBeCalledTimes(1);

        });
    });

    describe('[Main Function - Source: Search]', () => {
        it('Should return the expected HTML with valid data for Search source', async () => {
            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue([
                    { title: 'Featured Card', description: 'Feature Description' },
                    { title: 'Card 1' },
                    { title: 'Card 2' }
                ])
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="featured-content">
                  <div class="su-container-class">
                      <div class="linked-heading">Linked Heading</div>
                      <div class="su-w-full su-component-featured-grid">
                          <div class="su-flex su-flex-wrap su-gap-[68px] md:su-gap-72 md:su-flex-nowrap lg:su-gap-[160px]">
                              <div class="md:su-basis-[58.333%] lg:su-basis-[64.5%] su-grow ">
                                  <div class="card"><h2>Featured Card</h2><span>Feature Description</span></div>
                              </div>
                              <div class="su-relative su-flex su-flex-wrap su-grow before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black su-gap-80 md:su-gap-72 lg:su-gap-[76px] before:md:su-w-px before:su-h-px before:md:su-h-full md:su-basis-[39.5%] lg:su-basis-[30%] md:su-items-start md:su-content-start before:su-left-0 before:su-top-[-35px] before:md:su-top-0 before:md:su-left-[-36px] before:lg:su-left-[-80px]">
                                  
                          <div class="su-relative su-w-full">
                              <div class="card"><h2>Card 1</h2></div>
                              </div>
                          
                          <div class="su-relative su-w-full before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black before:su-h-px before:su-left-0 before:su-top-[-40px] md:before:su-top-[-36px] lg:before:su-top-[-38px]">
                              <div class="card"><h2>Card 2</h2></div>
                              </div>
                          
                              </div>
                          </div>
                      </div>
                  </div>
                  
              </section>"
            `);
        });

        it('Should call funnelbackCardService', async () => {
            await main(defaultMockData, defaultMockInfo);

            expect(funnelbackCardService).toHaveBeenCalled();
        });
    });

    describe('[Main Function - Source: Select]', () => {
        it('Should return the expected HTML with valid data for Select source', async () => {
            const selectData = {
                ...defaultMockData,
                contentConfiguration: {
                    source: 'Select',
                    cards: ['card1', 'card2'],
                    featuredDescription: ""
                }
            };

            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue([
                    { title: 'Featured Card - Select' },
                    { title: 'Card 1 - Select' },
                    { title: 'Card 2 - Select' }
                ])
            }));

            const result = await main(selectData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="featured-content">
                  <div class="su-container-class">
                      <div class="linked-heading">Linked Heading</div>
                      <div class="su-w-full su-component-featured-grid">
                          <div class="su-flex su-flex-wrap su-gap-[68px] md:su-gap-72 md:su-flex-nowrap lg:su-gap-[160px]">
                              <div class="md:su-basis-[58.333%] lg:su-basis-[64.5%] su-grow ">
                                  <div class="card"><h2>Featured Card - Select</h2></div>
                              </div>
                              <div class="su-relative su-flex su-flex-wrap su-grow before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black su-gap-80 md:su-gap-72 lg:su-gap-[76px] before:md:su-w-px before:su-h-px before:md:su-h-full md:su-basis-[39.5%] lg:su-basis-[30%] md:su-items-start md:su-content-start before:su-left-0 before:su-top-[-35px] before:md:su-top-0 before:md:su-left-[-36px] before:lg:su-left-[-80px]">
                                  
                          <div class="su-relative su-w-full">
                              <div class="card"><h2>Card 1 - Select</h2></div>
                              </div>
                          
                          <div class="su-relative su-w-full before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black before:su-h-px before:su-left-0 before:su-top-[-40px] md:before:su-top-[-36px] lg:before:su-top-[-38px]">
                              <div class="card"><h2>Card 2 - Select</h2></div>
                              </div>
                          
                              </div>
                          </div>
                      </div>
                  </div>
                  
              </section>"
            `);
        });

        it('Should call matrixCardService with correct parameters for Select source', async () => {
            const selectData = {
                ...defaultMockData,
                contentConfiguration: {
                    source: 'Select',
                    cards: ['card1', 'card2'],
                    featuredDescription: ""
                }
            };

            await main(selectData, defaultMockInfo);

            expect(matrixCardService).toHaveBeenCalled();
        });
    });

    describe('[Header Rendering]', () => {
        it('Should not render LinkedHeading when was not provided', async () => {
            linkedHeadingService.mockImplementationOnce(null);

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="featured-content">
                  <div class="su-container-class">
                      <div class="linked-heading">Linked Heading</div>
                      <div class="su-w-full su-component-featured-grid">
                          <div class="su-flex su-flex-wrap su-gap-[68px] md:su-gap-72 md:su-flex-nowrap lg:su-gap-[160px]">
                              <div class="md:su-basis-[58.333%] lg:su-basis-[64.5%] su-grow ">
                                  <div class="card"><h2>Inaugural Lecturer’s Award winners honored</h2><span>Honorees for the annual Lecturer’s Award for Teaching and Undergraduate Education were recognized for their exceptional contributions to university life and undergraduate education.</span></div>
                              </div>
                              <div class="su-relative su-flex su-flex-wrap su-grow before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black su-gap-80 md:su-gap-72 lg:su-gap-[76px] before:md:su-w-px before:su-h-px before:md:su-h-full md:su-basis-[39.5%] lg:su-basis-[30%] md:su-items-start md:su-content-start before:su-left-0 before:su-top-[-35px] before:md:su-top-0 before:md:su-left-[-36px] before:lg:su-left-[-80px]">
                                  
                          <div class="su-relative su-w-full">
                              <div class="card"><h2>Bass Fellows in Undergraduate Education announced</h2><span>The Bass University Fellows in Undergraduate Education Program recognizes faculty for extraordinary contributions to undergraduate education.</span></div>
                              </div>
                          
                          <div class="su-relative su-w-full before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black before:su-h-px before:su-left-0 before:su-top-[-40px] md:before:su-top-[-36px] lg:before:su-top-[-38px]">
                              <div class="card"><h2>Inaugural Lecturer’s Award winners honored</h2><span>Honorees for the annual Lecturer’s Award for Teaching and Undergraduate Education were recognized for their exceptional contributions to university life and undergraduate education.</span></div>
                              </div>
                          
                              </div>
                          </div>
                      </div>
                  </div>
                  ModalHTMLModalHTML
              </section>"
            `);
        });
    })

    describe('[Card Rendering]', () => {
        it('Should handle featuredDescription correctly in Search source', async () => {
            const dataWithFeaturedDescription = {
                ...defaultMockData,
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    featuredDescription: 'Custom Featured Description'
                }
            };

            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue([
                    { title: 'Featured Card', description: 'Feature Description' },
                    { title: 'Card 1' },
                    { title: 'Card 2' }
                ])
            }));

            const result = await main(dataWithFeaturedDescription, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="featured-content">
                  <div class="su-container-class">
                      <div class="linked-heading">Linked Heading</div>
                      <div class="su-w-full su-component-featured-grid">
                          <div class="su-flex su-flex-wrap su-gap-[68px] md:su-gap-72 md:su-flex-nowrap lg:su-gap-[160px]">
                              <div class="md:su-basis-[58.333%] lg:su-basis-[64.5%] su-grow ">
                                  <div class="card"><h2>Featured Card</h2><span>Custom Featured Description</span></div>
                              </div>
                              <div class="su-relative su-flex su-flex-wrap su-grow before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black su-gap-80 md:su-gap-72 lg:su-gap-[76px] before:md:su-w-px before:su-h-px before:md:su-h-full md:su-basis-[39.5%] lg:su-basis-[30%] md:su-items-start md:su-content-start before:su-left-0 before:su-top-[-35px] before:md:su-top-0 before:md:su-left-[-36px] before:lg:su-left-[-80px]">
                                  
                          <div class="su-relative su-w-full">
                              <div class="card"><h2>Card 1</h2></div>
                              </div>
                          
                          <div class="su-relative su-w-full before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black before:su-h-px before:su-left-0 before:su-top-[-40px] md:before:su-top-[-36px] lg:before:su-top-[-38px]">
                              <div class="card"><h2>Card 2</h2></div>
                              </div>
                          
                              </div>
                          </div>
                      </div>
                  </div>
                  
              </section>"
            `);
        });

        it('Should apply alignment classes based on displayConfiguration', async () => {
            const rightAlignedData = {
                ...defaultMockData,
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    alignment: 'right'
                }
            };

            const result = await main(rightAlignedData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="featured-content">
                  <div class="su-container-class">
                      <div class="linked-heading">Linked Heading</div>
                      <div class="su-w-full su-component-featured-grid">
                          <div class="su-flex su-flex-wrap su-gap-[68px] md:su-gap-72 md:su-flex-nowrap lg:su-gap-[160px]">
                              <div class="md:su-basis-[58.333%] lg:su-basis-[64.5%] su-grow md:su-order-2">
                                  <div class="card"><h2>Inaugural Lecturer’s Award winners honored</h2><span>Honorees for the annual Lecturer’s Award for Teaching and Undergraduate Education were recognized for their exceptional contributions to university life and undergraduate education.</span></div>
                              </div>
                              <div class="su-relative su-flex su-flex-wrap su-grow before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black su-gap-80 md:su-gap-72 lg:su-gap-[76px] before:md:su-w-px before:su-h-px before:md:su-h-full md:su-basis-[39.5%] lg:su-basis-[30%] md:su-items-start md:su-content-start before:su-right-0 before:su-top-[-35px] before:md:su-top-0 before:md:su-right-[-36px] before:lg:su-right-[-80px]">
                                  
                          <div class="su-relative su-w-full">
                              <div class="card"><h2>Bass Fellows in Undergraduate Education announced</h2><span>The Bass University Fellows in Undergraduate Education Program recognizes faculty for extraordinary contributions to undergraduate education.</span></div>
                              </div>
                          
                          <div class="su-relative su-w-full before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black before:su-h-px before:su-left-0 before:su-top-[-40px] md:before:su-top-[-36px] lg:before:su-top-[-38px]">
                              <div class="card"><h2>Inaugural Lecturer’s Award winners honored</h2><span>Honorees for the annual Lecturer’s Award for Teaching and Undergraduate Education were recognized for their exceptional contributions to university life and undergraduate education.</span></div>
                              </div>
                          
                              </div>
                          </div>
                      </div>
                  </div>
                  ModalHTMLModalHTML
              </section>"
            `);
        });

        it('Should apply headingLvl based on headingData title', async () => {
            const mockData = {
                ...defaultMockData,
                headingConfiguration: {
                    ...defaultMockData.headingConfiguration,
                    title: undefined
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="featured-content">
                  <div class="su-container-class">
                      <div class="linked-heading">Linked Heading</div>
                      <div class="su-w-full su-component-featured-grid">
                          <div class="su-flex su-flex-wrap su-gap-[68px] md:su-gap-72 md:su-flex-nowrap lg:su-gap-[160px]">
                              <div class="md:su-basis-[58.333%] lg:su-basis-[64.5%] su-grow ">
                                  <div class="card"><h2>Inaugural Lecturer’s Award winners honored</h2><span>Honorees for the annual Lecturer’s Award for Teaching and Undergraduate Education were recognized for their exceptional contributions to university life and undergraduate education.</span></div>
                              </div>
                              <div class="su-relative su-flex su-flex-wrap su-grow before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black su-gap-80 md:su-gap-72 lg:su-gap-[76px] before:md:su-w-px before:su-h-px before:md:su-h-full md:su-basis-[39.5%] lg:su-basis-[30%] md:su-items-start md:su-content-start before:su-left-0 before:su-top-[-35px] before:md:su-top-0 before:md:su-left-[-36px] before:lg:su-left-[-80px]">
                                  
                          <div class="su-relative su-w-full">
                              <div class="card"><h2>Bass Fellows in Undergraduate Education announced</h2><span>The Bass University Fellows in Undergraduate Education Program recognizes faculty for extraordinary contributions to undergraduate education.</span></div>
                              </div>
                          
                          <div class="su-relative su-w-full before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black before:su-h-px before:su-left-0 before:su-top-[-40px] md:before:su-top-[-36px] lg:before:su-top-[-38px]">
                              <div class="card"><h2>Inaugural Lecturer’s Award winners honored</h2><span>Honorees for the annual Lecturer’s Award for Teaching and Undergraduate Education were recognized for their exceptional contributions to university life and undergraduate education.</span></div>
                              </div>
                          
                              </div>
                          </div>
                      </div>
                  </div>
                  ModalHTMLModalHTML
              </section>"
            `);
        });
    });
});
