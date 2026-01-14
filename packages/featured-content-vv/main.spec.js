import { describe, expect, it, vi } from 'vitest';
import main from './main';

vi.mock('../../global/js/utils', () => ({
    uuid: vi.fn(),
    cardDataAdapter: vi.fn().mockImplementation(() => ({
        setCardService: vi.fn(),
        getCards: vi.fn().mockResolvedValue([
            {
                "title": "Inaugural Lecturer's Award winners honored",
                "description": ["Honorees for the annual Lecturer's Award for Teaching and Undergraduate Education were recognized for their exceptional contributions to university life and undergraduate education."],
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
                "title": "Inaugural Lecturer's Award winners honored",
                "description": ["Honorees for the annual Lecturer's Award for Teaching and Undergraduate Education were recognized for their exceptional contributions to university life and undergraduate education."],
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
    linkedHeadingService: vi.fn().mockImplementation((fnsCtx, {title, ctaText, ctaUrl, ctaManualUrl, ctaNewWindow}) => {
        return Promise.resolve({
            title: title || 'Sample Heading',
            ctaText: ctaText || 'Learn More',
            ctaLink: ctaUrl || ctaManualUrl || 'https://example.com',
            ctaNewWindow: ctaNewWindow || false
        });
    }),
    matrixCardService: vi.fn(),
    basicAssetUri: vi.fn().mockImplementation((fnsCtx, assetUri) => {
        return Promise.resolve({
            url: `resolved-${assetUri}`,
            attributes: {
                alt: `Alt text for ${assetUri}`
            }
        });
    }),
}));

vi.mock('../../global/js/helpers', () => ({
    LinkedHeading: vi.fn().mockReturnValue('<div class="linked-heading">Linked Heading</div>'),
    Card: vi.fn().mockImplementation(({ data }) => `<div class="card"><h2>${data?.title}</h2>${data?.description ? `<span>${data.description}</span>`: ''}</div>`),
    Modal: vi.fn().mockReturnValue('ModalHTML'),
    EmbedVideo: vi.fn().mockReturnValue('<iframe width="560" height="315" class="" src="https://example.com?autoplay=1&controls=1&rel=0" title="Watch Remembering Oct. 7 and learning about Israel, Gaza, and the Middle East" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe" ></iframe>')
}));

describe('Featured Content with Vertical Video Component', () => {
    const mockFnsCtx = { resolveUri: vi.fn() };
    const mockContext = {
        env: {
            FB_JSON_URL: 'https://funnelback.example.com/json',
            API_IDENTIFIER: 'sample-api',
            BASE_DOMAIN: 'https://example.com',
        },
        fns: mockFnsCtx
    };

    it('should render with heading', async () => {
        const args = {
            headingConfiguration: {
                includeSectionHeading: true,
                title: 'Test Title',
                ctaText: 'View all',
                ctaUrl: 'test-url',
                ctaNewWindow: false
            },
            contentConfiguration: {
                featuredStory: 'test-featured-story',
                relatedStory: 'test-related-story',
                videoImage: 'test-video-image',
                youtubeId: 'test123'
            },
            displayConfiguration: {
                alignment: 'left'
            }
        };

        const result = await main.main(args, mockContext);
        expect(result).to.include('Test Title');
        expect(result).to.include('View all');
        expect(result).to.include('Inaugural Lecturer\'s Award winners honored');
        expect(result).to.include('Bass Fellows in Undergraduate Education announced');
        expect(result).to.include('resolved-test-video-image');
        expect(result).to.include('test123');
    });

    it('should render without heading', async () => {
        const args = {
            headingConfiguration: {
                includeSectionHeading: false
            },
            contentConfiguration: {
                featuredStory: 'test-featured-story',
                relatedStory: 'test-related-story',
                videoImage: 'test-video-image',
                youtubeId: 'test123'
            },
            displayConfiguration: {
                alignment: 'right'
            }
        };

        const result = await main.main(args, mockContext);
        expect(result).to.not.include('Test Title');
        expect(result).to.not.include('View all');
        expect(result).to.include('Inaugural Lecturer\'s Award winners honored');
        expect(result).to.include('Bass Fellows in Undergraduate Education announced');
        expect(result).to.include('resolved-test-video-image');
        expect(result).to.include('test123');
    });

    it('should render with description overrides', async () => {
        const args = {
            headingConfiguration: {
                includeSectionHeading: true,
                title: "Here's a headline",
                ctaText: "View all",
                ctaUrl: "matrix-asset://api-identifier/89422",
                ctaNewWindow: false
            },
            contentConfiguration: {
                featuredStory: "matrix-asset://api-identifier/159910",
                featuredDescriptionOverride: 'Featured override',
                relatedStory: "matrix-asset://api-identifier/157852",
                youtubeId: "xCJ43cpcnNs",
                videoImage: "matrix-asset://api-identifier/99100",
                relatedDescriptionOverride: 'Related override',
            },
            displayConfiguration: {
                alignment: "left"
            }
        };

        const result = await main.main(args, mockContext);
        expect(result).to.include('Featured override');
        expect(result).to.include('Related override');
    });

    it('should handle missing required fields', async () => {
        const args = {
            headingConfiguration: {
                includeSectionHeading: false
            },
            contentConfiguration: {
                featuredStory: 'test-featured-story'
            },
            displayConfiguration: {
                alignment: 'left'
            }
        };

        const result = await main.main(args, mockContext);
        expect(result).to.include('Error occurred in the Featured content with vertical video component');
        expect(result).to.include('videoImage');
    });

    it('should handle invalid field types', async () => {
        const args = {
            headingConfiguration: {
                includeSectionHeading: true,
                title: 123 // Should be a string
            },
            contentConfiguration: {
                featuredStory: 'test-featured-story',
                relatedStory: 'test-related-story',
                videoImage: 'test-video-image',
                youtubeId: 'test123'
            },
            displayConfiguration: {
                alignment: 'left'
            }
        };

        const result = await main.main(args, mockContext);
        expect(result).to.include('Error occurred in the Featured content with vertical video component');
        expect(result).to.include('title');
    });
}); 