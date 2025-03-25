import { beforeEach, describe, expect, it, vi } from 'vitest';
import moduleToTest from './main';

const { main } = moduleToTest;

vi.mock('../../global/js/utils', () => ({
    linkedHeadingService: vi.fn().mockResolvedValue({
        title: 'Test title',
        ctaText: 'Click here',
        ctaLink: 'https://example.com',
        ctaNewWindow: true
    }),
}));

const mockedError = vi.fn();
console.error = mockedError;

describe('[Single Featured Content Component]', () => {
    const mockData = {
        headingConfiguration: {
            title: 'Test title',
            ctaText: 'Click here',
            ctaUrl: 'matrix-asset://api-identifier/63411'
        }
    };

    const mockInfo = {
        env: {
            API_IDENTIFIER: 'api-identifier',
            BASE_DOMAIN: 'https://google.com'
        },
        ctx: {
            resolveUri: vi.fn().mockResolvedValue({ url: 'https://resolved-url.com' })
        }
    };

    beforeEach(() => {
        vi.mock('../../global/js/utils', async (importOriginal) => {
            const actual = await importOriginal();
            console.log('Mocking getCards');
            return {
                ...actual,
                matrixCardService: vi.fn(),
                linkedHeadingService: vi.fn().mockResolvedValue({
                    title: 'Test title',
                    ctaText: 'Click here',
                    ctaLink: 'https://example.com',
                    ctaNewWindow: true
                }),
                cardDataAdapter: vi.fn().mockImplementation(() => ({
                    setCardService: vi.fn(),
                    getCards: vi.fn().mockRejectedValue(new Error('Card service failed'))
                }))
            };
        });

        vi.resetModules();
        vi.clearAllMocks();
        mockedError.mockClear();
    });

    // General error check for the main function
    describe('[Error Handling]', () => {
        it('Should return an error when no parameters are provided', async () => {
            const result = await main();
            expect(result).toBe(
                "<!-- Error occurred in the Single Featured Content component: Cannot read properties of undefined (reading 'contentConfiguration') -->"
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should return an error when contentConfiguration.source is missing', async () => {
            const result = await main(mockData, mockInfo);
            expect(result).toBe(
                "<!-- Error occurred in the Single Featured Content component: Cannot read properties of undefined (reading 'source') -->"
            );
            expect(mockedError.mock.calls.some(call =>
                call[1]?.message?.includes("Cannot read properties of undefined (reading 'source')")
            )).toBe(true);
        });

        it('Should log an error when getCards() fails', async () => {
            const mockDataWithSource = {
                ...mockData,
                contentConfiguration: { source: 'matrix-asset://api-identifier/63436' }
            };

            await main(mockDataWithSource, mockInfo);
            const errorMessages = mockedError.mock.calls.map(call => call[1]?.message);

            console.log("Logged errors:", errorMessages);
            expect(mockedError).toBeCalled();
        });
    });

    // Check if HTML structure is rendered correctly
    describe('[Rendering]', () => {
        it('Should return the correct container class', async () => {
            const mockDataWithSource = {
                ...mockData,
                contentConfiguration: { source: 'matrix-asset://api-identifier/63436' }
            };

            const result = await main(mockDataWithSource, mockInfo);
            expect(result).toContain('su-component-container');
        });

        it('Should render the main wrapper elements', async () => {
            const mockDataWithSource = {
                ...mockData,
                contentConfiguration: { source: 'matrix-asset://api-identifier/63436' }
            };

            const result = await main(mockDataWithSource, mockInfo);
            const normalizedResult = result.replace(/'/g, '"');
            expect(normalizedResult).toContain('su-single-featured-content');
        });

        it('Should render the heading when heading data is available', async () => {
            const mockDataWithSource = {
                ...mockData,
                contentConfiguration: { source: 'matrix-asset://api-identifier/63436' }
            };

            const result = await main(mockDataWithSource, mockInfo);
            expect(result).toContain('Test title');
            expect(result).toContain('Click here');
        });
    });
});
