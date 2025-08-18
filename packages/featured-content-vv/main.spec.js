import { expect } from 'chai';
import { describe, it } from 'mocha';
import main from './main';

describe('Featured Content with Vertical Video Component', () => {
    const mockContext = {
        fns: {
            resolveUri: async (uri) => {
                return {
                    url: `resolved-${uri}`,
                    attributes: { alt: 'Test alt text' }
                };
            },
            registerPartial: () => {}
        }
    };

    it('should render with heading', async () => {
        const args = {
            headingConfiguration: {
                includeSectionHeading: true,
                title: 'Test Title',
                ctaText: 'View all',
                ctaUrl: 'test-url'
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
        expect(result).to.include('resolved-test-featured-story');
        expect(result).to.include('resolved-test-related-story');
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
        expect(result).to.include('resolved-test-featured-story');
        expect(result).to.include('resolved-test-related-story');
        expect(result).to.include('resolved-test-video-image');
        expect(result).to.include('test123');
        expect(result).to.include('md:su-order-2');
    });

    it('should render with description overrides', async () => {
        const args = {
            headingConfiguration: {
                includeSectionHeading: false
            },
            contentConfiguration: {
                featuredStory: 'test-featured-story',
                featuredDescriptionOverride: 'Featured override',
                relatedStory: 'test-related-story',
                relatedDescriptionOverride: 'Related override',
                videoImage: 'test-video-image',
                youtubeId: 'test123'
            },
            displayConfiguration: {
                alignment: 'left'
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

    it('should handle edit mode', async () => {
        const args = {
            headingConfiguration: {
                includeSectionHeading: true
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

        const editContext = {
            ...mockContext,
            ctx: {
                editor: true
            }
        };

        const result = await main.main(args, editContext);
        expect(result).to.include('data-se="title"');
        expect(result).to.include('data-se="ctaText"');
    });
}); 