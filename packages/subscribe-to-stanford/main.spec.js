import { describe, it, expect, vi, beforeEach } from 'vitest';
import moduleToTest from './main';

const { main } = moduleToTest;

const mockError = vi.fn();
console.error = mockError;

describe('[Content Component]', () => {
    // Reset mocks before each test
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Error handling', () => {
        it('Should return error when args is not an object', async () => {
            const result = await main(null);
            expect(result).toContain(
                '<!-- Error rendering content: args must be an object -->',
            );
        });

        it('Should return error when contentConfiguration is missing', async () => {
            const result = await main({});
            expect(result).toContain(
                '<!-- Error rendering content: contentConfiguration must be an object -->',
            );
        });

        it('Should return error when actionLink is not a string or empty', async () => {
            // Providing invalid actionLink
            const result = await main({
                contentConfiguration: {
                    actionLink: null,
                    title: 'Test title',
                    summary: 'Some summary',
                },
            });
            expect(result).toContain(
                '<!-- Error rendering content: actionLink must be a string -->',
            );
        });

        it('Should return error when title is not a string', async () => {
            // Providing invalid title
            const result = await main({
                contentConfiguration: {
                    actionLink: 'https://example.com',
                    title: null,
                    summary: 'Summary',
                },
            });
            expect(result).toContain(
                '<!-- Error rendering content: title must be a string -->',
            );
        });
    });

    describe('Successful rendering', () => {
        it('Should render the template with valid data', async () => {
            // Rendering with full, valid input data
            const result = await main({
                contentConfiguration: {
                    actionLink: 'https://example.com/subscribe',
                    title: 'Subscribe to our newsletter',
                    summary: 'Stay updated with the latest news.',
                },
            });

            expect(result).toContain('Subscribe to our newsletter');
            expect(result).toContain('Stay updated with the latest news.');
            expect(result).toContain('https://example.com/subscribe');
            expect(result).toContain(
                'data-component="subscribe-to-stanford-report"',
            );
        });

        it('Should fallback to empty summary when not provided', async () => {
            // Summary is optional - test fallback behavior
            const result = await main({
                contentConfiguration: {
                    actionLink: 'https://example.com',
                    title: 'Test Title',
                },
            });

            expect(result).toContain('Test Title');
            expect(result).toContain('<p class="su-m-0 su-text-16');
        });
    });
});
