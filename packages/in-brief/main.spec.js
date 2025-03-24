import { beforeEach, describe, expect, it, vi } from 'vitest';
import { containerClasses } from '../../global/js/utils/containerClasses';
import moduleToTest from './main';

const { main } = moduleToTest;

vi.mock('../../global/js/utils/containerClasses', () => ({
    containerClasses: vi.fn(() => 'mock-container-classes')
}));

describe('[In Brief Component]', () => {
    const defaultMockData = {
        points: ['First point', 'Second point', 'Third point']
    };

    beforeEach(() => {
        vi.clearAllMocks();
        containerClasses.mockReturnValue('mock-container-classes');
    });

    // General Error Handling
    describe('[Error Handling]', () => {
        it('Should return an error if info.fns is missing', async () => {
            const result = await main(defaultMockData, {});

            expect(result).toBe('<!-- Error occurred in the In Brief component: The "info.fns" cannot be undefined or null. The {} was received. -->');
        });
    });

    // Check entry data 
    describe('[Input Validation]', () => {
        it('Should not fail if points is not an array', async () => {
            const mockedData = { points: "not-an-array" };
            const result = await main(mockedData, { fns: { resolveUri: vi.fn() } });

            expect(result).toBe("");
        });

        it('Should return an empty string if points array is empty', async () => {
            const mockedData = { points: [] };
            const result = await main(mockedData, { fns: { resolveUri: vi.fn() } });

            expect(result).toBe("");
        });

        it('Should sanitize points content using xss()', async () => {
            const mockedData = { points: ['<script>alert("XSS")</script>'] };
            const result = await main(mockedData, { fns: { resolveUri: vi.fn() } });

            expect(result).not.toContain('<script>alert("XSS")</script>');
            expect(result).toContain('&lt;script&gt;alert("XSS")&lt;/script&gt;');
        });
    });

    // Check if component returns the correct HTML
    describe('[Component Rendering]', () => {
        it('Should render the component with valid data', async () => {
            const result = await main(defaultMockData, { fns: { resolveUri: vi.fn() } });

            expect(result).toContain('<section data-component=\'in-brief\'>');
            expect(result).toContain('<ul class=\'su-basefont-19 su-flex su-flex-col su-mb-0 su-gap-18 su-pt-34 su-pb-27 list-none pl-0 [&>li]:su-m-0\'>');
            expect(result).toContain('First point');
            expect(result).toContain('Second point');
            expect(result).toContain('Third point');
        });

        it('Should render with correct container class', async () => {
            const result = await main(defaultMockData, { fns: { resolveUri: vi.fn() } });

            expect(result).toContain('su-container-narrow');
        });
    });
});
