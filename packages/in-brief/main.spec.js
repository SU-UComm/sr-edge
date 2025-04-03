import xss from "xss";
import { beforeEach, describe, expect, it, vi } from 'vitest';
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;


describe('[In Brief Component]', () => {
    const mockFnsCtx = {
        resolveUri: vi.fn()
    };

    const defaultMockData = {
        points: ['First point', 'Second point', 'Third point']
    };

    const defaultMockInfo = {
        fns: mockFnsCtx
    };


    beforeEach(() => {
        vi.clearAllMocks();
    });

    // General Error Handling
    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters was provided.', async () => {
            const result = await main();

            expect(result).toBe('<!-- Error occurred in the In Brief component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when no info was provided', async () => {
            const result = await main(defaultMockData);

            expect(result).toBe('<!-- Error occurred in the In Brief component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info do not have fns or ctx functions', async () => {
            const mockInfo = {test: 'test'}
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the In Brief component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when fns or ctx is invalid', async () => {
            const mockInfo = { fns: undefined, ctx: undefined,  };
            const result = await main(defaultMockData, mockInfo);
    
            expect(result).toBe('<!-- Error occurred in the In Brief component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when points are not an array', async () => {
            const mockedData = {
                points: 123,
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the In Brief component: The "points" field must be an array and cannot be empty. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when points are an empty array', async () => {
            const mockedData = {
                points: [],
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the In Brief component: The "points" field must be an array and cannot be empty. The [] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    // Check if component returns the correct HTML
    describe('[Main function]', () => {
        it('Should render the component with valid data', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='in-brief'><div class='su-mx-auto su-component-container su-container-narrow su-container-px'><div data-test='in-brief' class='su-border-b su-border-black-20'><div class='su-relative su-overflow-hidden'><h2 class='su-font-serif su-font-black su-inline su-bg-white dark:su-bg-black-true !su-text-23 su-pr-10 su-m-0' >In brief</h2><span class='su-w-full su-bg-black-20 su-h-px su-absolute su-bottom-4' /></div><div class='su-wysiwyg-content'><ul class='su-basefont-19 su-flex su-flex-col su-mb-0 su-gap-18 su-pt-34 su-pb-27 [&>li]:su-m-0' ><li class='su-basefont-19 su-leading-[125%] su-text-16 md:su-text-19 lg:su-text-19 *:su-text-16 md:*:su-text-19 *:su-leading-[125%]' >First point</li><li class='su-basefont-19 su-leading-[125%] su-text-16 md:su-text-19 lg:su-text-19 *:su-text-16 md:*:su-text-19 *:su-leading-[125%]' >Second point</li><li class='su-basefont-19 su-leading-[125%] su-text-16 md:su-text-19 lg:su-text-19 *:su-text-16 md:*:su-text-19 *:su-leading-[125%]' >Third point</li></ul></div></div></div></section>"`); 
        });

        it('Should escape XSS in content', async () => {
            const mockData = {
                points: ['<script>alert("xss")</script>', '<img src=x onerror=alert(1)>'],
            };

            const result = await moduleToTest.main(mockData, defaultMockInfo);

            expect(result).toContain(xss('<script>alert("xss")</script>'));
            expect(result).toContain(xss('<img src=x onerror=alert(1)>'));
            expect(result).not.toContain('<script>alert("xss")</script>');
            expect(result).not.toContain('<img src=x onerror=alert(1)>');
        });

    });
});
