import { beforeEach, describe, expect, it, vi } from 'vitest';
import { basicAssetUri } from "../../global/js/utils";
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    basicAssetUri: vi.fn(),
}));

describe('[Campaign Sidebar CTA]', () => {
    const mockFnsCtx = {
        resolveUri: vi.fn()
    };

    const defaultMockData = {
        image: 'matrix-asset://api-identifier/63353',
        title: 'Campaign Title',
        description: 'Campaign Description',
        linkUrl: 'matrix-asset://api-identifier/63492',
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
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    image: undefined,
                }
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Campaign cta component: The "image" field cannot be undefined and must be a string type. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        it('Should return the expected HTML with valid data', async () => {
            // Mocking basicAssetUri to return URL data
            basicAssetUri.mockResolvedValueOnce({ url: 'https://example.com' });
            basicAssetUri.mockResolvedValueOnce({ url: 'https://picsum.photos/400/400', attributes: { alt: 'Alt Text' } });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<div data-component='campaign-sidebar-cta' class='su-relative'><div class='su-h-10 su-bg-gradient-report'></div><img class='su-rs-mb-0 su-w-full' src='https://picsum.photos/400/400' alt='' /><div class='su-rs-mb-1'><h2 class='su-font-serif su-fluid-type-1 su-mb-10'>Campaign Title</h2><div class='su-card-paragraph'>Campaign Description</div></div><a href='https://example.com' class='su-button su-stretched-link su-text-16 md:su-text-20' ></a></div>"`);
        });

        it('Should return HTML without link when linkUrl is missing', async () => {
            const mockData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    linkUrl: null,
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the Campaign cta component: The "image" field cannot be undefined and must be a string type. The undefined was received. -->"`);
        });

        it('Should return HTML without title when title is an empty string', async () => {
            const mockData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    title: '',
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the Campaign cta component: The "image" field cannot be undefined and must be a string type. The undefined was received. -->"`);
        });

        it('Should return HTML without description when description is an empty string', async () => {
            const mockData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    description: '',
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the Campaign cta component: The "image" field cannot be undefined and must be a string type. The undefined was received. -->"`);
        });

        it('Should return HTML with empty alt attribute when attributes alt is missing', async () => {
            // Mocking basicAssetUri to return URL data
            basicAssetUri.mockResolvedValueOnce({ url: 'https://example.com' });
            basicAssetUri.mockResolvedValueOnce({ url: 'https://picsum.photos/400/400'});

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<div data-component='campaign-sidebar-cta' class='su-relative'><div class='su-h-10 su-bg-gradient-report'></div><img class='su-rs-mb-0 su-w-full' src='https://picsum.photos/400/400' alt='' /><div class='su-rs-mb-1'><h2 class='su-font-serif su-fluid-type-1 su-mb-10'>Campaign Title</h2><div class='su-card-paragraph'>Campaign Description</div></div><a href='https://example.com' class='su-button su-stretched-link su-text-16 md:su-text-20' ></a></div>"`);
        });

        it('Should sanitize the description using xss', async () => {
            const mockData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    description: '<script>alert("xss")</script>',
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).not.toContain('<script>alert("xss")</script>');
        });
    });
});
