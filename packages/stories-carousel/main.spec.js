 /**
 * @jest-environment jsdom
 */

import hash from 'object-hash';
import { CardDataAdapter, FunnelbackCardService, linkedHeadingService } from "../../global/js/utils";
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
            }
        ]),
    })),
    FunnelbackCardService: jest.fn(),
    linkedHeadingService: jest.fn().mockResolvedValue({
        title: 'Sample Heading',
        ctaText: 'Learn More',
        ctaLink: 'https://example.com',
        ctaNewWindow: false
    }),
    containerClasses: jest.fn().mockReturnValue('su-container-class'),
    faIcon: {
        "ChevronRight": [`<svg class="su-fill-transparent su-stroke-current" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden=""><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`],
        "CirclePlay": [`<svg class="su-fill-transparent su-stroke-current" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden=""><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`]
    }
}));

describe('[Stories Carousel]', () => {
    const mockFnsCtx = { resolveUri: jest.fn() };

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
        jest.clearAllMocks();
    });
    
    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters were provided', async () => {
            const result = await moduleToTest.main();
            
            expect(result).toContain('<!-- Error: Error occurred in the stories carousel component, FB_JSON_URL variable cannot be undefined and must be non-empty string. The "undefined" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when FB_JSON_URL was not provided', async () => {
            const mockInfo = {
                env: {
                    API_IDENTIFIER: 'sample-api',
                    BASE_DOMAIN: 'https://example.com',
                    BASE_PATH: '/base',
                    NEWS_ARCHIVE_PATH: '/archive'
                },
                fns: mockFnsCtx
            }
            const result = await moduleToTest.main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the stories carousel component, FB_JSON_URL variable cannot be undefined and must be non-empty string. The "undefined" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when API_IDENTIFIER was not provided', async () => {
            const mockInfo = {
                env: {
                    FB_JSON_URL: 'https://example.com/json',
                    BASE_DOMAIN: 'https://example.com',
                    BASE_PATH: '/base',
                    NEWS_ARCHIVE_PATH: '/archive'
                },
                fns: mockFnsCtx
            }
            const result = await moduleToTest.main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error: Error occurred in the stories carousel component, API_IDENTIFIER variable cannot be undefined and must be non-empty string. The "undefined" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when BASE_DOMAIN was not provided', async () => {
            const mockInfo = {
                env: {
                    FB_JSON_URL: 'https://example.com/json',
                    API_IDENTIFIER: 'sample-api',
                    BASE_PATH: '/base',
                    NEWS_ARCHIVE_PATH: '/archive'
                },
                fns: mockFnsCtx
            }
            const result = await moduleToTest.main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error: Error occurred in the stories carousel component, BASE_DOMAIN variable cannot be undefined and must be non-empty string. The "undefined" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when BASE_PATH was not provided', async () => {
            const mockInfo = {
                env: {
                    FB_JSON_URL: 'https://example.com/json',
                    API_IDENTIFIER: 'sample-api',
                    BASE_DOMAIN: 'https://example.com',
                    NEWS_ARCHIVE_PATH: '/archive'
                },
                fns: mockFnsCtx
            }
            const result = await moduleToTest.main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error: Error occurred in the stories carousel component, BASE_PATH variable cannot be undefined and must be non-empty string. The "undefined" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when NEWS_ARCHIVE_PATH was not provided', async () => {
            const mockInfo = {
                env: {
                    FB_JSON_URL: 'https://example.com/json',
                    API_IDENTIFIER: 'sample-api',
                    BASE_DOMAIN: 'https://example.com',
                    BASE_PATH: '/base',
                },
                fns: mockFnsCtx
            }
            const result = await moduleToTest.main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error: Error occurred in the stories carousel component, NEWS_ARCHIVE_PATH variable cannot be undefined and must be non-empty string. The "undefined" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fns or ctx was not provided', async () => {
            const mockInfo = {
                env: {
                    FB_JSON_URL: 'https://example.com/json',
                    API_IDENTIFIER: 'sample-api',
                    BASE_DOMAIN: 'https://example.com',
                    BASE_PATH: '/base',
                    NEWS_ARCHIVE_PATH: '/archive'
                }
            }

            const result = await moduleToTest.main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error: Error occurred in the stories carousel component, info.fns cannot be undefined or null. The "[object Object]" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when contentConfiguration was not provided', async () => {
            const mockData = {
                headingConfiguration: {
                    title: 'Sample Title',
                    ctaUrl: 'https://example.com',
                    ctaManualUrl: 'https://manual.example.com',
                    ctaText: 'Learn More',
                    ctaNewWindow: true
                }
            };
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the stories carousel component, contentConfiguration prop cannot be undefined. The "[object Object]" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when headingConfiguration was not provided', async () => {
            const mockData = {
                contentConfiguration: {
                    searchQuery: 'sample-query'
                }
            };
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the stories carousel component, headingConfiguration prop cannot be undefined. The "[object Object]" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when searchQuery was not a string', async () => {
            const mockData = {
                contentConfiguration: {
                    searchQuery: [1,2,3]
                },
                headingConfiguration: {
                    title: 'Sample Title',
                    ctaUrl: 'https://example.com',
                    ctaManualUrl: 'https://manual.example.com',
                    ctaText: 'Learn More',
                    ctaNewWindow: true
                }
            };
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the stories carousel component, searchQuery field cannot be undefined and must be a non-empty string. The "1,2,3" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when title was not a string', async () => {
            const mockData = {
                contentConfiguration: {
                    searchQuery: 'sample-query'
                },
                headingConfiguration: {
                    title: [1,2,3],
                    ctaUrl: 'https://example.com',
                    ctaManualUrl: 'https://manual.example.com',
                    ctaText: 'Learn More',
                    ctaNewWindow: true
                }
            };
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the stories carousel component, title field must be a string. The "1,2,3" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when ctaUrl was not a string', async () => {
            const mockData = {
                contentConfiguration: {
                    searchQuery: 'sample-query'
                },
                headingConfiguration: {
                    title: 'Sample Title',
                    ctaUrl: [1,2,3],
                    ctaManualUrl: 'https://manual.example.com',
                    ctaText: 'Learn More',
                    ctaNewWindow: true
                }
            };
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the stories carousel component, ctaUrl field must be a string. The "1,2,3" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when ctaManualUrl was not a string', async () => {
            const mockData = {
                contentConfiguration: {
                    searchQuery: 'sample-query'
                },
                headingConfiguration: {
                    title: 'Sample Title',
                    ctaUrl: 'https://example.com',
                    ctaManualUrl: [1,2,3],
                    ctaText: 'Learn More',
                    ctaNewWindow: true
                }
            };
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the stories carousel component, ctaManualUrl field must be a string. The "1,2,3" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when ctaText was not a string', async () => {
            const mockData = {
                contentConfiguration: {
                    searchQuery: 'sample-query'
                },
                headingConfiguration: {
                    title: 'Sample Title',
                    ctaUrl: 'https://example.com',
                    ctaManualUrl: 'https://manual.example.com',
                    ctaText: [1,2,3],
                    ctaNewWindow: true
                }
            };
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the stories carousel component, ctaText field must be a string. The "1,2,3" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when ctaNewWindow was not a boolean type', async () => {
            const mockData = {
                contentConfiguration: {
                    searchQuery: 'sample-query'
                },
                headingConfiguration: {
                    title: 'Sample Title',
                    ctaUrl: 'https://example.com',
                    ctaManualUrl: 'https://manual.example.com',
                    ctaText: 'Learn More',
                    ctaNewWindow: [1,2,3]
                }
            };
            const result = await moduleToTest.main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error: Error occurred in the stories carousel component, ctaNewWindow field must be a boolean. The "1,2,3" was received. -->');
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

            const result = await moduleToTest.main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<section data-component="stories-carousel"');
            expect(result).toContain('su-container-class');
            expect(result).toContain('Sample Heading');
            expect(result).toContain('Learn More');
        });

        it('Should set default ctaLink if ctaLink is empty', async () => {
            linkedHeadingService.mockResolvedValueOnce({
                title: "Sample Heading",
                ctaText: "Learn More",
                ctaLink: "",
                ctaNewWindow: false
            });

            const result = await moduleToTest.main(defaultMockData, defaultMockInfo);

            const expectedDefaultLink = `${defaultMockInfo.env.BASE_DOMAIN}${defaultMockInfo.env.BASE_PATH}${defaultMockInfo.env.NEWS_ARCHIVE_PATH}`;
            expect(result).toContain(expectedDefaultLink);
        });

        it('Should call CardDataAdapter and FunnelbackCardService', async () => {
            await moduleToTest.main(defaultMockData, defaultMockInfo);

            expect(CardDataAdapter).toHaveBeenCalled();
            expect(FunnelbackCardService).toHaveBeenCalled();
        });

        it('Should render LinkedHeading and Carousel components correctly', async () => {
            const result = await moduleToTest.main(defaultMockData, defaultMockInfo);

            expect(result).toContain('Sample Heading');
            expect(result).toContain('<div class="swiper component-slider-cards component-slider-peek">');
        });

        it('Should render data-unique-id when data existing', async () => {

            const result = await moduleToTest.main(defaultMockData, defaultMockInfo);

            expect(result).not.toContain('data-unique-id=""');
        });

        it('Should render empty data-unique-id when data not provided', async () => {
            CardDataAdapter.mockImplementationOnce(() => ({
                setCardService: jest.fn(),
                getCards: jest.fn().mockResolvedValue([]),
            }));

            const result = await moduleToTest.main(defaultMockData, defaultMockInfo);

            expect(result).toContain('');
        });

        it('Should not render LinkedHeading when was not provided', async () => {
            linkedHeadingService.mockImplementationOnce(null);

            const result = await moduleToTest.main(defaultMockData, defaultMockInfo);

            expect(result).not.toContain('Sample Heading');
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

            CardDataAdapter.mockImplementationOnce(() => ({
                setCardService: jest.fn(),
                getCards: jest.fn().mockResolvedValue(cardData),
            }));

            const result = await moduleToTest.main(defaultMockData, defaultMockInfo);

            const dataHash = hash.MD5(JSON.stringify(cardData));
            expect(result).toContain(`data-unique-id="${dataHash}"`);
        });

        it('Should render Card and Modal components based on data type', async () => {
            const result = await moduleToTest.main(defaultMockData, defaultMockInfo);
            expect(result).toContain('<button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="5406e0dcde991ec1bb67556816259e9e">');
            expect(result).toContain('<div data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="5406e0dcde991ec1bb67556816259e9e">');
        });

        it('Should not render output when data is null', async () => {
            const cardData = null;

            CardDataAdapter.mockImplementationOnce(() => ({
                setCardService: jest.fn(),
                getCards: jest.fn().mockResolvedValue(cardData),
            }));

            const result = await moduleToTest.main(defaultMockData, defaultMockInfo);

            expect(result).toContain('');
        });
    });
});
