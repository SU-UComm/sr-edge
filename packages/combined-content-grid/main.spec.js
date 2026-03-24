import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { cardDataAdapter, funnelbackCardService, matrixCardService, eventCardService, linkedHeadingService, basicAssetUri, uuid, isRealExternalLink } from "../../global/js/utils";
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    uuid: vi.fn(),
    basicAssetUri: vi.fn(),
    isRealExternalLink: vi.fn().mockReturnValue(true),
    cardDataAdapter: vi.fn().mockImplementation(() => ({
        setCardService: vi.fn(),
        getCards: vi.fn().mockResolvedValue([
            {
                "type": "Video",
                "title": "Study uncovers hundreds of billions in missing revenue from U.S. ‘tax gap’",
                "liveUrl": "https://news.stanford.edu/stories/2025/04/study-close-tax-gap-revenue",
                "description": "<p>More than half a trillion dollars in tax revenue goes uncollected every year. In the latest episode of the GSB&rsquo;s <em>Quick Study</em> video series, Associate Professor Rebecca Lester shares how her team may have found some of it.</p>",
                "imageUrl": "https://news.stanford.edu/__data/assets/image/0037/168697/Rebecca_BioPhoto_feat.jpg",
                "imageAlt": "",
                "taxonomy": "Business",
                "taxonomyUrl": "https://news.stanford.edu/research-and-scholarship/topic/business",
                "videoUrl": "LrdJiJC5QaI",
                "date": "2025-04-14 01:00:00",
                "source": null,
                "authorName": "",
                "authorEmail": "",
                "uniqueID": "d57db862-8511-4406-9527-9da68130f306",
                "cardSize": "featured",
                "iconType": "video",
                "displayThumbnail": true,
                "displayDescription": false,
                "headingLvl": "h3"
            },
            {
                "type": "News",
                "title": " New Stanford Law School clinic connects students with low-income entrepreneurs",
                "liveUrl": "https://news.stanford.edu/stories/2025/04/entrepreneurship-clinic-stanford-law-school",
                "description": "<p>Under the leadership of Professor Bernice Grant, the Entrepreneurship Clinic gives students the opportunity to counsel underserved entrepreneurs, business leaders, and nonprofits.</p>",
                "imageUrl": "https://news.stanford.edu/__data/assets/image/0034/168586/bernice-grant.jpg",
                "imageAlt": "Bernice Grant portrait",
                "taxonomy": "Academics",
                "taxonomyUrl": "https://news.stanford.edu/student-experience/topic/academics",
                "videoUrl": "",
                "date": "2025-04-14 03:00:37",
                "source": null,
                "authorName": "",
                "authorEmail": "",
                "uniqueID": "072e8aa9-1db4-4ea6-ba67-678b51c9a3a9",
                "cardSize": "small",
                "iconType": "news",
                "displayThumbnail": true,
                "displayDescription": false,
                "headingLvl": "h3"
            },
            {
                "type": "Event Highlights",
                "title": "Grammy winner Doechii headlines sold-out Frost Fest",
                "liveUrl": "https://news.stanford.edu/stories/2025/04/doechii-sold-out-frost-fest",
                "description": "<p>At this year&rsquo;s music festival &ndash;&nbsp;run by the student organization Stanford Concert Network &ndash; Doechii performed a full set with a signature mix of rap, R&amp;B, and experimental hip-hop to a sold-out crowd.</p>",
                "imageUrl": "https://news.stanford.edu/__data/assets/image/0026/168623/FrostFest_8-smiling-faces.jpg",
                "imageAlt": "Students pose for the camera.",
                "taxonomy": "Social Life",
                "taxonomyUrl": "https://news.stanford.edu/student-experience/topic/social-life",
                "videoUrl": "",
                "date": "2025-04-14 00:00:00",
                "source": null,
                "authorName": "",
                "authorEmail": "",
                "uniqueID": "89606848-7c8c-4cf9-b767-875702ab827d",
                "cardSize": "small",
                "iconType": "event highlights",
                "displayThumbnail": true,
                "displayDescription": false,
                "headingLvl": "h3"
            }
        ]),
    })),
    funnelbackCardService: vi.fn(),
    matrixCardService: vi.fn(),
    eventCardService: vi.fn(),
    linkedHeadingService: vi.fn().mockReturnValue({
        title: 'Sample Heading',
        ctaUrl: 'https://example.com',
        ctaManualUrl: 'https://manual.example.com',
        ctaText: 'Learn More',
        ctaNewWindow: true
    }),
}));


describe('[Combined Content Grid]', () => {
    const mockFnsCtx = { resolveUri: vi.fn() };
    
    const defaultMockData = {
        headingConfiguration: {
            title: "Stories",
            ctaText: "View all",
            ctaUrl: "matrix-asset://stanfordNews/128705",
            ctaNewWindow: false
        },
        contentConfiguration: {
            source: "Select",
            cards: [
                {
                    cardAsset: "matrix-asset://stanfordNews/168663"
                },
                {
                    cardAsset: "matrix-asset://stanfordNews/168591"
                },
                {
                    cardAsset: "matrix-asset://stanfordNews/168624"
                }
            ],
            featuredDescription: ""
        },
        displayConfiguration: {
            alignment: "right",
            displayThumbnails: true,
            displayDescriptions: false
        },
        eventsConfiguration: {
            heading: "Upcoming Events",
            endPoint: "https://events.stanford.edu/api/2/events?days=365&sponsored=true",
            numberOfItems: 3,
            linkUrl: "https://events.stanford.edu"
        },
        announcementsConfiguration: {
            heading: "Announcements",
            endPoint: "?collection=sug~sp-stanford-report-search&profile=stanford-report-push-search&log=false&&sort=date&meta_taxonomyAudienceText=External&meta_taxonomyContentTypeText=Announcement&num_ranks=6",
            numberOfItems: 3,
            linkUrl: "matrix-asset://stanfordNews/128705"
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
            
            expect(result).toContain("<!-- Error occurred in the Combined Content Grid component: Cannot read properties of undefined (reading 'numberOfItems') -->");
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
            
            expect(result).toContain('<!-- Error occurred in the Combined Content Grid component: The "searchQuery" field cannot be undefined and must be a non-empty string. The [1,2,3] was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Combined Content Grid component: The "cards" field must be an array. The "test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when featuredDescription was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    source: 'Select',
                    cards: [
                        {
                            "cardAsset": "matrix-asset://stanfordNews/63418"
                        },
                        {
                            "cardAsset": "matrix-asset://stanfordNews/63436"
                        },
                        {
                            "cardAsset": "matrix-asset://stanfordNews/63412"
                        }
                    ],
                    featuredDescription: [1,2,3]
                }
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Combined Content Grid component: The "featuredDescription" field must be a string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when headingConfiguration.title was not a string', async () => {
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
            
            expect(result).toContain('<!-- Error occurred in the Combined Content Grid component: The "headingConfiguration.title" field must be a string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when headingConfiguration.ctaUrl was not a string', async () => {
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
            
            expect(result).toContain('<!-- Error occurred in the Combined Content Grid component: The "headingConfiguration.ctaUrl" field must be a string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when headingConfiguration.ctaManualUrl was not a string', async () => {
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
            
            expect(result).toContain('<!-- Error occurred in the Combined Content Grid component: The "headingConfiguration.ctaManualUrl" field must be a string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when headingConfiguration.ctaText was not a string', async () => {
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
            
            expect(result).toContain('<!-- Error occurred in the Combined Content Grid component: The "headingConfiguration.ctaText" field must be a string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when headingConfiguration.ctaNewWindow was not a boolean', async () => {
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
            
            expect(result).toContain('<!-- Error occurred in the Combined Content Grid component: The "headingConfiguration.ctaNewWindow" field must be a boolean. The [1,2,3] was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Combined Content Grid component: The "displayThumbnails" field must be a boolean. The [1,2,3] was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Combined Content Grid component: The "displayDescriptions" field must be a boolean. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when eventsConfiguration.heading was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                eventsConfiguration: {
                    ...defaultMockData.eventsConfiguration,
                    heading: [1,2,3]
                }
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Combined Content Grid component: The "eventsConfiguration.heading" field must be a string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when eventsConfiguration.endPoint was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                eventsConfiguration: {
                    ...defaultMockData.eventsConfiguration,
                    endPoint: [1,2,3]
                }
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Combined Content Grid component: The "eventsConfiguration.endPoint" field must be a string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when eventsConfiguration.numberOfItems was not a number', async () => {
            const mockData = {
                ...defaultMockData,
                eventsConfiguration: {
                    ...defaultMockData.eventsConfiguration,
                    numberOfItems: "two"
                }
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Combined Content Grid component: The "eventsConfiguration.numberOfItems" field cannot be undefined and must be a number one of [3, 4, 5, 6]. The "two" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when eventsConfiguration.numberOfItems was not one of [3, 4, 5, 6]', async () => {
            const mockData = {
                ...defaultMockData,
                eventsConfiguration: {
                    ...defaultMockData.eventsConfiguration,
                    numberOfItems: 10
                }
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Combined Content Grid component: The "eventsConfiguration.numberOfItems" field cannot be undefined and must be a number one of [3, 4, 5, 6]. The 10 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when eventsConfiguration.linkUrl was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                eventsConfiguration: {
                    ...defaultMockData.eventsConfiguration,
                    linkUrl: [1,2,3]
                }
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Combined Content Grid component: The "eventsConfiguration.linkUrl" field must be a string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when announcementsConfiguration.heading was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                announcementsConfiguration: {
                    ...defaultMockData.announcementsConfiguration,
                    heading: [1,2,3]
                }
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Combined Content Grid component: The "announcementsConfiguration.heading" field must be a string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when announcementsConfiguration.endPoint was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                announcementsConfiguration: {
                    ...defaultMockData.announcementsConfiguration,
                    endPoint: [1,2,3]
                }
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Combined Content Grid component: The "announcementsConfiguration.endPoint" field must be a string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when announcementsConfiguration.numberOfItems was not a number', async () => {
            const mockData = {
                ...defaultMockData,
                announcementsConfiguration: {
                    ...defaultMockData.announcementsConfiguration,
                    numberOfItems: "two"
                }
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Combined Content Grid component: The "announcementsConfiguration.numberOfItems" field cannot be undefined and must be a number one of [3, 4, 5, 6]. The "two" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when announcementsConfiguration.numberOfItems was not one of [3, 4, 5, 6]', async () => {
            const mockData = {
                ...defaultMockData,
                announcementsConfiguration: {
                    ...defaultMockData.announcementsConfiguration,
                    numberOfItems: 10
                }
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Combined Content Grid component: The "announcementsConfiguration.numberOfItems" field cannot be undefined and must be a number one of [3, 4, 5, 6]. The 10 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when announcementsConfiguration.linkUrl was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                announcementsConfiguration: {
                    ...defaultMockData.announcementsConfiguration,
                    linkUrl: [1,2,3]
                }
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Combined Content Grid component: The "announcementsConfiguration.linkUrl" field must be a string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

    });

    describe('[Header Rendering]', () => {
        beforeAll(() => {
            uuid.mockReturnValue('36bcda50-8e16-4255-a8aa-d558dd550b8b');
            basicAssetUri.mockReturnValue({url: 'https://example.com' })
        });

        it('Should not render LinkedHeading when was not provided', async () => {
            linkedHeadingService.mockReturnValueOnce(null);

            const result = await main(defaultMockData, defaultMockInfo);
            expect(result).toContain('data-component="combined-content-grid"');
            expect(result).not.toContain('data-se="headingCtaText"');
        });
    })

    describe('[Main Function - Source: Select]', () => {
        beforeAll(() => {
            uuid.mockReturnValue('36bcda50-8e16-4255-a8aa-d558dd550b8b');
            basicAssetUri.mockReturnValue({url: 'https://example.com' })
        });

        it('Should return the expected HTML with valid data for Select source', async () => {
            const result = await main(defaultMockData, defaultMockInfo);
            expect(result).toContain('data-component="combined-content-grid"');
            expect(result).toContain('Study uncovers hundreds of billions in missing revenue from U.S. ‘tax gap’');
        });

        it('Should return the expected HTML with valid featuredDescription ', async () => {
            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    featuredDescription: "<p>overrides description</p>"
                }
            }
            const result = await main(mockData, defaultMockInfo);

            expect(result).toContain('data-component="combined-content-grid"');
            expect(result).toContain('<p>overrides description</p>');
        });

        it('Should call matrixCardService', async () => {
            await main(defaultMockData, defaultMockInfo);

            expect(matrixCardService).toHaveBeenCalled();
        });    
    });

    describe('[Main Function - Source: Search]', () => {
        beforeAll(() => {
            uuid.mockReturnValue('36bcda50-8e16-4255-a8aa-d558dd550b8b');
            basicAssetUri.mockReturnValue({url: 'https://example.com' })
        });

        it('Should return the expected HTML with valid data for Search source', async () => {
            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    source: 'Search',
                    searchQuery: "?collection=sug~sp-stanford-report-search&profile=stanford-report-push-search&log=false&&sort=date&meta_isTeaser=false&meta_taxonomyContentTypeText_not=Leadership Message&num_ranks=3"
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toContain('data-component="combined-content-grid"');
            expect(result).toContain('data-testid="vertical-card"');
            
        });


        it('Should call funnelbackCardService', async () => {
            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    source: 'Search',
                    searchQuery: "?collection=sug~sp-stanford-report-search&profile=stanford-report-push-search&log=false&&sort=date&meta_isTeaser=false&meta_taxonomyContentTypeText_not=Leadership Message&num_ranks=3"
                }
            };
            await main(mockData, defaultMockInfo);

            expect(funnelbackCardService).toHaveBeenCalled();
        });
    });

    describe('[Events]', () => {
        it('Should call eventCardService', async () => {
             await main(defaultMockData, defaultMockInfo);
 
             expect(eventCardService).toHaveBeenCalled();
        });
    });

    describe('[Announcements]', () => {
        it('Should call funnelbackCardService', async () => {
            await main(defaultMockData, defaultMockInfo);

            expect(funnelbackCardService).toHaveBeenCalled();
        });
    });
    describe('[Edge cases]', () => {
        beforeAll(() => {
            uuid.mockReturnValue('36bcda50-8e16-4255-a8aa-d558dd550b8b');
        });

        it('Should handle isRealExternalLink correctly', async () => {
            isRealExternalLink.mockReturnValue(false);

            const result = await main(defaultMockData, defaultMockInfo);
            expect(result).not.toContain('data-icon="arrow-up-right"');
        });

    });
});
