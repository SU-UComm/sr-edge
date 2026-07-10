import { describe, it, expect, vi, beforeEach } from 'vitest';
import moduleToTest from './main';

const { main } = moduleToTest;

const mockError = vi.fn();
console.error = mockError;

describe('[Single Text Block Component]', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {

        // General Args
        it('Should render with default values when no args are provided', async () => {
            const result = await main();
        
            expect(result).not.toContain('Error');
            expect(result).toContain("data-component='single-text-block'"); 
        });

        it('Should return error when title is not a string', async () => {
            const result = await main({ title: 123 });
            expect(result).toContain(
                '<!-- Error occurred in the Single Text Block component: The "title" field must be a string. The 123 was received.',
            );
            expect(mockError).toBeCalledTimes(1);
        });

        it('Should return error when eyebrow is not a string', async () => {
            const result = await main({ eyebrow: {} });
            expect(result).toContain(
                '<!-- Error occurred in the Single Text Block component: The "eyebrow" field must be a string. The {} was received.',
            );
            expect(mockError).toBeCalledTimes(1);
        });

        it('Should return error when description is not a string', async () => {
            const result = await main({ description: true });
            expect(result).toContain(
                '<!-- Error occurred in the Single Text Block component: The "description" field must be a string. The true was received.',
            );
            expect(mockError).toBeCalledTimes(1);
        });

        // Check if paddingY is a string, not a number
        it('Should return error when paddingY is not a string', async () => {
            const result = await main({ paddingY: 20 });
            expect(result).toContain(
                '<!-- Error occurred in the Single Text Block component: The "paddingY" field must be a string. The 20 was received.',
            );
            expect(mockError).toBeCalledTimes(1);
        });
    });

    describe('[Rendering]', () => {
        it('Should render correctly with valid data', async () => {
            const result = await main({
                title: 'A Stanford education is affordable',
                eyebrow: 'Need-based financial aid',
                description:
                    '<p>Stanford offers comprehensive, need-based financial aid that makes it possible for all admitted undergraduate students to attend. We do not expect students to borrow to meet their need.</p>',
                paddingY: '8',
            });

            expect(result).toContain('A Stanford education is affordable');
            expect(result).toContain('Need-based financial aid');
            expect(result).toContain(
                'Stanford offers comprehensive, need-based financial aid that makes it possible for all admitted undergraduate students to attend. We do not expect students to borrow to meet their need.',
            );
            expect(result).toContain("data-component='single-text-block'");
        });

        it('Should render with only title', async () => {
            const result = await main({ title: 'Just Title' });

            expect(result).toContain('Just Title');
            expect(result).not.toContain('eyebrow');
            expect(result).not.toContain('<p>');
        });
    });
});
