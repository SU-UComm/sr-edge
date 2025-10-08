import { beforeEach, describe, expect, it, vi } from 'vitest';
import main from './main';

describe('Campaign Hero Component', () => {
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

    it('should render with background image', async () => {
        const args = {
            bkgConfig: {
                type: 'Image',
                bkgImage: 'test-image.jpg'
            },
            textConfig: {
                title: 'Test Title'
            }
        };

        const result = await main.main(args, mockContext);
        expect(result).to.include('Test Title');
        expect(result).to.include('resolved-test-image.jpg');
    });

    it('should render with background video', async () => {
        const args = {
            bkgConfig: {
                type: 'Video',
                bkgVideo: 'https://vimeo.com/test'
            },
            textConfig: {
                title: 'Test Title'
            }
        };

        const result = await main.main(args, mockContext);
        expect(result).to.include('Test Title');
        expect(result).to.include('https://vimeo.com/test?background=1');
    });

    it('should render with intro text', async () => {
        const args = {
            bkgConfig: {
                type: 'Image',
                bkgImage: 'test-image.jpg'
            },
            textConfig: {
                title: 'Test Title',
                intro: 'Test intro text'
            }
        };

        const result = await main.main(args, mockContext);
        expect(result).to.include('Test Title');
        expect(result).to.include('Test intro text');
    });

    it('should render with YouTube video', async () => {
        const args = {
            bkgConfig: {
                type: 'Image',
                bkgImage: 'test-image.jpg'
            },
            textConfig: {
                title: 'Test Title'
            },
            youtubeId: 'test123'
        };

        const result = await main.main(args, mockContext);
        expect(result).to.include('Test Title');
        expect(result).to.include('youtube-modal-test123');
    });

    it('should render with quote', async () => {
        const args = {
            bkgConfig: {
                type: 'Image',
                bkgImage: 'test-image.jpg'
            },
            textConfig: {
                title: 'Test Title'
            },
            quoteConfig: {
                include: true,
                quote: 'Test quote',
                name: 'Test Name',
                extra: 'Test Title',
                image: 'test-quote-image.jpg'
            }
        };

        const result = await main.main(args, mockContext);
        expect(result).to.include('Test Title');
        expect(result).to.include('Test quote');
        expect(result).to.include('Test Name');
        expect(result).to.include('Test Title');
        expect(result).to.include('resolved-test-quote-image.jpg');
    });

    it('should handle missing required fields', async () => {
        const args = {
            textConfig: {
                title: 'Test Title'
            }
        };

        const result = await main.main(args, mockContext);
        expect(result).to.include('Error occurred in the Campaign Hero component');
        expect(result).to.include('bkgConfig');
    });

    it('should handle invalid field types', async () => {
        const args = {
            bkgConfig: {
                type: 'Image',
                bkgImage: 'test-image.jpg'
            },
            textConfig: {
                title: 123 // Should be a string
            }
        };

        const result = await main.main(args, mockContext);
        expect(result).to.include('Error occurred in the Campaign Hero component');
        expect(result).to.include('title');
    });

    it('should handle edit mode', async () => {
        const args = {
            bkgConfig: {
                type: 'Image',
                bkgImage: 'test-image.jpg'
            },
            textConfig: {}
        };

        const editContext = {
            ...mockContext,
            ctx: {
                editor: true
            }
        };

        const result = await main.main(args, editContext);
        expect(result).to.include('Heading text');
        expect(result).to.include('Introduction text');
    });
}); 