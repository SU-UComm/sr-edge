import { beforeEach, describe, expect, it, vi } from 'vitest';
import { basicAssetUri } from "../../global/js/utils";
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        basicAssetUri: vi.fn(),
        isRealExternalLink: actual.isRealExternalLink,
        uuid: vi.fn(() => 'test-uuid'),
    };
});

describe('[Campaign Sidebar CTA]', () => {
    const mockFnsCtx = {
        resolveUri: vi.fn()
    };

    const defaultMockData = {
        image: 'matrix-asset://api-identifier/63353',
        title: 'Campaign Title',
        description: 'Campaign Description',
        linkUrl: 'matrix-asset://api-identifier/63492',
        linkText: 'Click Here',
    };

    const defaultMockInfo = {
        fns: mockFnsCtx
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters was provided.', async () => {
            const result = await main();

            expect(result).toBe('<!-- Error occurred in the Campaign cta component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info was provided', async () => {
            const result = await main(defaultMockData);

            expect(result).toBe('<!-- Error occurred in the Campaign cta component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info do not have fns or ctx functions', async () => {
            const mockInfo = {test: 'test'}
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Campaign cta component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when fns or ctx is invalid', async () => {
            const mockInfo = { fns: undefined, ctx: undefined,  };
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Campaign cta component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when image is not provided', async () => {
            const mockedData = {
                ...defaultMockData,
                image: undefined,
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Campaign cta component: The "image" field cannot be undefined and must be a string type. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when image is not a string', async () => {
            const mockedData = {
                ...defaultMockData,
                image: 123,
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Campaign cta component: The "image" field cannot be undefined and must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when title is not a string', async () => {
            const mockedData = {
                ...defaultMockData,
                title: 123,
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Campaign cta component: The "title" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when description is not a string', async () => {
            const mockedData = {
                ...defaultMockData,
                description: 123,
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Campaign cta component: The "description" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when linkText is not a string', async () => {
            const mockedData = {
                ...defaultMockData,
                linkText: 123,
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Campaign cta component: The "linkText" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when linkUrl is not a string', async () => {
            const mockedData = {
                ...defaultMockData,
                linkUrl: 123,
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Campaign cta component: The "linkUrl" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when externalUrl is not a string', async () => {
            const mockedData = {
                ...defaultMockData,
                externalUrl: 123,
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Campaign cta component: The "externalUrl" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[External Link]', () => {
        const imageData = { url: 'https://picsum.photos/400/400', attributes: { alt: 'Alt Text' } };

        it('Should use externalUrl and show the external icon when linkUrl is not set', async () => {
            basicAssetUri.mockResolvedValueOnce(imageData);
            const mockData = {
                ...defaultMockData,
                linkUrl: undefined,
                externalUrl: 'https://example.com/campaign',
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toContain("href='https://example.com/campaign'");
            expect(result).toContain("rel='noopener nofollow'");
            expect(result).toContain('data-icon="arrow-up"');
            expect(result).toContain('svg-inline--fa-title-test-uuid');
        });

        it('Should not show the external icon when externalUrl is a news.stanford.edu link', async () => {
            basicAssetUri.mockResolvedValueOnce(imageData);
            const mockData = {
                ...defaultMockData,
                linkUrl: undefined,
                externalUrl: 'https://news.stanford.edu/stories/2025/01/example',
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toContain("href='https://news.stanford.edu/stories/2025/01/example'");
            expect(result).not.toContain("rel='noopener nofollow'");
            expect(result).not.toContain('data-icon="arrow-up"');
        });

        it('Should prefer linkUrl over externalUrl when both are set', async () => {
            basicAssetUri.mockResolvedValueOnce({ url: 'https://news.stanford.edu/internal-page' });
            basicAssetUri.mockResolvedValueOnce(imageData);
            const mockData = {
                ...defaultMockData,
                externalUrl: 'https://example.com/campaign',
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toContain("href='https://news.stanford.edu/internal-page'");
            expect(result).not.toContain('https://example.com/campaign');
            expect(result).not.toContain('data-icon="arrow-up"');
        });

        it('Should not render the link when neither linkUrl nor externalUrl is set', async () => {
            basicAssetUri.mockResolvedValueOnce(imageData);
            const mockData = {
                ...defaultMockData,
                linkUrl: undefined,
                externalUrl: undefined,
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).not.toContain('<a');
        });
    });

    describe('[Main Function]', () => {
        it('Should return the expected HTML with valid data', async () => {
            // Mocking basicAssetUri to return URL data
            basicAssetUri.mockResolvedValueOnce({ url: 'https://example.com' });
            basicAssetUri.mockResolvedValueOnce({ url: 'https://picsum.photos/400/400', attributes: { alt: 'Alt Text' } });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<div data-component='campaign-sidebar-cta' class='su-relative'><div class='su-h-10 su-bg-gradient-report'></div><img class='su-rs-mb-0 su-w-full' src='https://picsum.photos/400/400' alt='' /><div class='su-rs-mb-1'><h2 class='su-font-serif su-fluid-type-1 su-mb-10'>Campaign Title</h2><div class='su-card-paragraph'>Campaign Description</div></div><a href='https://example.com'  class='su-group su-button su-stretched-link su-text-16 md:su-text-20' >Click Here </a></div>"`);
        });

        it('Should return HTML without link when linkUrl is missing', async () => {
            const mockData = {
                ...defaultMockData,
                linkUrl: null,
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<div data-component='campaign-sidebar-cta' class='su-relative'><div class='su-h-10 su-bg-gradient-report'></div><img class='su-rs-mb-0 su-w-full' src='' alt='' /><div class='su-rs-mb-1'><h2 class='su-font-serif su-fluid-type-1 su-mb-10'>Campaign Title</h2><div class='su-card-paragraph'>Campaign Description</div></div></div>"`);
        });

        it('Should return HTML without title when title is an empty string', async () => {
            const mockData = {
                ...defaultMockData,
                title: '',
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<div data-component='campaign-sidebar-cta' class='su-relative'><div class='su-h-10 su-bg-gradient-report'></div><img class='su-rs-mb-0 su-w-full' src='' alt='' /><div class='su-rs-mb-1'><h2 class='su-font-serif su-fluid-type-1 su-mb-10'></h2><div class='su-card-paragraph'>Campaign Description</div></div></div>"`);
        });

        it('Should return HTML without description when description is an empty string', async () => {
            const mockData = {
                ...defaultMockData,
                description: '',
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<div data-component='campaign-sidebar-cta' class='su-relative'><div class='su-h-10 su-bg-gradient-report'></div><img class='su-rs-mb-0 su-w-full' src='' alt='' /><div class='su-rs-mb-1'><h2 class='su-font-serif su-fluid-type-1 su-mb-10'>Campaign Title</h2><div class='su-card-paragraph'></div></div></div>"`);
        });

        it('Should return HTML with empty alt attribute when attributes alt is missing', async () => {
            // Mocking basicAssetUri to return URL data
            basicAssetUri.mockResolvedValueOnce({ url: 'https://example.com' });
            basicAssetUri.mockResolvedValueOnce({ url: 'https://picsum.photos/400/400'});

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<div data-component='campaign-sidebar-cta' class='su-relative'><div class='su-h-10 su-bg-gradient-report'></div><img class='su-rs-mb-0 su-w-full' src='https://picsum.photos/400/400' alt='' /><div class='su-rs-mb-1'><h2 class='su-font-serif su-fluid-type-1 su-mb-10'>Campaign Title</h2><div class='su-card-paragraph'>Campaign Description</div></div><a href='https://example.com'  class='su-group su-button su-stretched-link su-text-16 md:su-text-20' >Click Here </a></div>"`);
        });

        it('Should sanitize the description using xss', async () => {
            const mockData = {
                ...defaultMockData,
                description: '<script>alert("xss")</script>',
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).not.toContain('<script>alert("xss")</script>');
        });
    });
});
