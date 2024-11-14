/**
 * @jest-environment jsdom
 */

import { CardDataAdapter, FunnelbackCardService, MatrixCardService, linkedHeadingService } from "../../global/js/utils";
import moduleToTest from './main';

const mockedError = jest.fn();
console.error = mockedError;

jest.mock('../../global/js/utils', () => ({
    CardDataAdapter: jest.fn().mockImplementation(() => ({
        setCardService: jest.fn(),
        getCards: jest.fn().mockResolvedValue([
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
            },
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
            }
        ]),
    })),
    FunnelbackCardService: jest.fn(),
    linkedHeadingService: jest.fn().mockReturnValue({
        title: 'Sample Heading',
        ctaUrl: 'https://example.com',
        ctaManualUrl: 'https://manual.example.com',
        ctaText: 'Learn More',
        ctaNewWindow: true
    }),
    MatrixCardService: jest.fn(),
    containerClasses: jest.fn().mockReturnValue('su-container-class')
}));

jest.mock('../../global/js/helpers', () => ({
    LinkedHeading: jest.fn().mockReturnValue('<div class="linked-heading">Linked Heading</div>'),
    Card: jest.fn().mockImplementation(({ data }) => `<div class="card"><h2>${data?.title}</h2>${data?.description ? `<span>${data.description}</span>`: ''}</div>`),
    Modal: jest.fn().mockReturnValue('ModalHTML'),
    EmbedVideo: jest.fn().mockReturnValue('<iframe width="560" height="315" class="" src="https://example.com?autoplay=1&controls=1&rel=0" title="Watch Remembering Oct. 7 and learning about Israel, Gaza, and the Middle East" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe" ></iframe>')
}));

describe('[Feature Content]', () => {
    const mockFnsCtx = { resolveUri: jest.fn() };
    
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
        jest.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters were provided', async () => {
            const result = await moduleToTest.main();
            
            expect(result).toContain('<!-- Error: Error occurred in the feature content component, FB_JSON_URL variable cannot be undefined and must be non-empty string. The "undefined" was received. -->');
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
            const result = await moduleToTest.main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the feature content component, FB_JSON_URL variable cannot be undefined and must be non-empty string. The "undefined" was received. -->');
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
            const result = await moduleToTest.main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error: Error occurred in the feature content component, API_IDENTIFIER variable cannot be undefined and must be non-empty string. The "undefined" was received. -->');
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
            const result = await moduleToTest.main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error: Error occurred in the feature content component, BASE_DOMAIN variable cannot be undefined and must be non-empty string. The "undefined" was received. -->');
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

            const result = await moduleToTest.main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error: Error occurred in the feature content component, info.fns cannot be undefined or null. The "[object Object]" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when contentConfiguration was not provided', async () => {
            const mockData = {
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
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the feature content component, contentConfiguration prop cannot be undefined. The "[object Object]" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when headingConfiguration was not provided', async () => {
            const mockData = {
                contentConfiguration: {
                    source: 'Search',
                    searchQuery: 'news'
                },
                displayConfiguration: {
                    alignment: 'left',
                    displayThumbnails: true,
                    displayDescriptions: true
                }
            };
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the feature content component, headingConfiguration prop cannot be undefined. The "[object Object]" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when displayConfiguration was not provided', async () => {
            const mockData = {
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
                }
            };
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the feature content component, displayConfiguration prop cannot be undefined. The "[object Object]" was received. -->');
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
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the feature content component, source field cannot be undefined and must be one of ["Search", "Select"]. The "1,2,3" was received. -->');
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
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the feature content component, searchQuery field cannot be undefined and must be a non-empty string. The "1,2,3" was received. -->');
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
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the feature content component, cards field must be an array. The "test" was received. -->');
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
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the feature content component, featuredDescription field must be a string. The "1,2,3" was received. -->');
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
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the feature content component, title field must be a string. The "1,2,3" was received. -->');
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
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the feature content component, ctaUrl field must be a string. The "1,2,3" was received. -->');
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
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the feature content component, ctaManualUrl field must be a string. The "1,2,3" was received. -->');
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
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the feature content component, ctaText field must be a string. The "1,2,3" was received. -->');
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
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the feature content component, ctaNewWindow field must be a boolean. The "1,2,3" was received. -->');
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
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the feature content component, alignment field cannot be undefined and must be one of ["left", "right"]. The "1,2,3" was received. -->');
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
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the feature content component, displayThumbnails field must be a boolean. The "1,2,3" was received. -->');
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
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the feature content component, displayDescriptions field must be a boolean. The "1,2,3" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when data was not received', async () => {
            CardDataAdapter.mockImplementationOnce(() => ({
                setCardService: jest.fn(),
                getCards: jest.fn().mockResolvedValue([])
            }));

            const result = await moduleToTest.main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<!-- Error: Error occurred in the feature content component, data cannot be undefined or null. The "" was received. -->');
            expect(mockedError).toBeCalledTimes(1);

        });

        it('Should throw an error when data was not having three elements', async () => {
            CardDataAdapter.mockImplementationOnce(() => ({
                setCardService: jest.fn(),
                getCards: jest.fn().mockResolvedValue([
                    { title: 'Featured Card', description: 'Feature Description' }
                ])
            }));

            const result = await moduleToTest.main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<!-- Error: Error occurred in the feature content component, data cannot have less then 3 elements. The "[object Object]" was received. -->');
            expect(mockedError).toBeCalledTimes(1);

        });
    });

    describe('[Main Function - Source: Search]', () => {
        it('Should return the expected HTML with valid data for Search source', async () => {
            CardDataAdapter.mockImplementationOnce(() => ({
                setCardService: jest.fn(),
                getCards: jest.fn().mockResolvedValue([
                    { title: 'Featured Card', description: 'Feature Description' },
                    { title: 'Card 1' },
                    { title: 'Card 2' }
                ])
            }));

            const result = await moduleToTest.main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<section data-component="featured-content">');
            expect(result).toContain('<div class="linked-heading">');
            expect(result).toContain('<div class="card"><h2>Featured Card</h2><span>Feature Description</span></div>');
            expect(result).toContain('<div class="card"><h2>Card 1</h2></div>');
            expect(result).toContain('<div class="card"><h2>Card 2</h2></div>');
        });

        it('Should call FunnelbackCardService', async () => {
            await moduleToTest.main(defaultMockData, defaultMockInfo);

            expect(FunnelbackCardService).toHaveBeenCalled();
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

            CardDataAdapter.mockImplementationOnce(() => ({
                setCardService: jest.fn(),
                getCards: jest.fn().mockResolvedValue([
                    { title: 'Featured Card - Select' },
                    { title: 'Card 1 - Select' },
                    { title: 'Card 2 - Select' }
                ])
            }));

            const result = await moduleToTest.main(selectData, defaultMockInfo);

            expect(result).toContain('<section data-component="featured-content">');
            expect(result).toContain('<div class="linked-heading">');
            expect(result).toContain('<div class="card"><h2>Featured Card - Select</h2></div>');
            expect(result).toContain('<div class="card"><h2>Card 1 - Select</h2></div>');
            expect(result).toContain('<div class="card"><h2>Card 2 - Select</h2></div>');
        });

        it('Should call MatrixCardService with correct parameters for Select source', async () => {
            const selectData = {
                ...defaultMockData,
                contentConfiguration: {
                    source: 'Select',
                    cards: ['card1', 'card2'],
                    featuredDescription: ""
                }
            };

            await moduleToTest.main(selectData, defaultMockInfo);

            expect(MatrixCardService).toHaveBeenCalled();
        });
    });

    describe('[Header Rendering]', () => {
        it('Should not render LinkedHeading when was not provided', async () => {
            linkedHeadingService.mockImplementationOnce(null);

            const result = await moduleToTest.main(defaultMockData, defaultMockInfo);

            expect(result).not.toContain('Sample Heading');
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

            CardDataAdapter.mockImplementationOnce(() => ({
                setCardService: jest.fn(),
                getCards: jest.fn().mockResolvedValue([
                    { title: 'Featured Card', description: 'Feature Description' },
                    { title: 'Card 1' },
                    { title: 'Card 2' }
                ])
            }));

            const result = await moduleToTest.main(dataWithFeaturedDescription, defaultMockInfo);

            expect(result).toContain('Custom Featured Description');
        });

        it('Should apply alignment classes based on displayConfiguration', async () => {
            const rightAlignedData = {
                ...defaultMockData,
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    alignment: 'right'
                }
            };

            const result = await moduleToTest.main(rightAlignedData, defaultMockInfo);

            expect(result).toContain('before:su-right-0');
        });
    });
});
