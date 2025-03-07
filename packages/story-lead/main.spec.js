/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

describe('[Story Lead]', () => {
    const mockFnsCtx = { resolveUri: vi.fn() };
    
    const defaultMockData = {
        content: "<p>Test content</p>",
        variant: "Basic Story"
    }


    const defaultMockInfo = {
        fns: mockFnsCtx
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters was provided.', async () => {
            const result = await main();

            expect(result).toBe('<!-- Error occurred in the Story lead component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when no info was provided', async () => {
            const result = await main(defaultMockData);

            expect(result).toBe('<!-- Error occurred in the Story lead component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info do not have fns or ctx functions', async () => {
            const mockInfo = {test: 'test'}
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Story lead component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when fns or ctx is invalid', async () => {
            const mockInfo = { fns: undefined, ctx: undefined,  };
            const result = await main(defaultMockData, mockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Story lead component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when content is not a string', async () => {
            const mockedData = {
                ...defaultMockData,
                content: [1,2,3],
            };
            const result = await main(mockedData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Story lead component: The "content" field must be a string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when variant is not one of ["Basic Story", "Featured Story"]', async () => {
            const mockedData = {
                ...defaultMockData,
                variant: "Invalid",
            };
            const result = await main(mockedData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Story lead component: The "variant" field must be one of ["Basic Story", "Featured Story"]. The "Invalid" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Content Rendering]', () => {
        it('Should render basic story correctly', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('su-story-first-letter');
            expect(result).not.toContain('data-test="component-story-lead-letter"');
        });

        it('Should render featured story correctly', async () => {
            const mockedData = {
                ...defaultMockData,
                variant: "Featured Story",
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toContain('data-test="component-story-lead-letter"');
            expect(result).not.toContain('su-story-first-letter');
            expect(result).toContain('<span aria-hidden="true">est</span><span class="sr-only">Test</span>');
        });

        it('Should not render when no content provided', async () => {
            const result = await main({
                content: null,
                variant: "Basic Story"
            }, defaultMockInfo);

            expect(result).toBe('');
        });

        it('Should render proper HTML when fist word is single letter', async () => {
            const result = await main({
                content: "<p>I</p>",
                variant: "Featured Story"
            }, defaultMockInfo);
            
            expect(result).toContain('<span class="sr-only">I</span>');
            expect(result).not.toContain('<span aria-hidden="true">');
        });

        it('Should not render SVG when fist letter is a special char', async () => {
            const result = await main({
                content: "<p>_</p>",
                variant: "Featured Story"
            }, defaultMockInfo);

            expect(result).toContain('<span class="sr-only">_</span>');
            expect(result).not.toContain('<svg');
        });
    });
});
