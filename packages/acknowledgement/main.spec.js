import { beforeEach, describe, expect, it, vi } from 'vitest';
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

describe('[Acknowledgement]', () => {
    const defaultMockData = {
        title: 'Test Title',
        content: 'Test Content'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Main Function]', () => {
        it('Should render component with valid data', async () => {
            const result = await main(defaultMockData);
            
            expect(result).toContain("data-component='acknowledgement'");
            expect(result).toContain("data-se='title'>Test Title</h2>");
            expect(result).toContain("data-se='content'");
            expect(result).toContain(">Test Content</div>");
        });
    });
});