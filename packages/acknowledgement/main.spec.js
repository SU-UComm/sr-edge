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

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters was provided', async () => {
            const result = await main();
            
            expect(result).toBe('<!-- Error occurred in the Acknowledgement component: The "title" field cannot be undefined and must be a non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when title is not provided', async () => {
            const mockedData = {
                ...defaultMockData,
                title: undefined 
            };
            const result = await main(mockedData);

            expect(result).toBe('<!-- Error occurred in the Acknowledgement component: The "title" field cannot be undefined and must be a non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when title is an empty string', async () => {
            const mockedData = {
                ...defaultMockData,
                title: '' 
            };
            const result = await main(mockedData);

            expect(result).toBe('<!-- Error occurred in the Acknowledgement component: The "title" field cannot be undefined and must be a non-empty string. The "" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when title is not a string', async () => {
            const mockedData = {
                ...defaultMockData,
                title: 123 
            };
            const result = await main(mockedData);

            expect(result).toBe('<!-- Error occurred in the Acknowledgement component: The "title" field cannot be undefined and must be a non-empty string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when content is not provided', async () => {
            const mockedData = {
                ...defaultMockData,
                content: undefined 
            };
            const result = await main(mockedData);

            expect(result).toBe('<!-- Error occurred in the Acknowledgement component: The "content" field cannot be undefined and must be a non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when content is an empty string', async () => {
            const mockedData = {
                ...defaultMockData,
                content: '' 
            };
            const result = await main(mockedData);
            
            expect(result).toBe('<!-- Error occurred in the Acknowledgement component: The "content" field cannot be undefined and must be a non-empty string. The "" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when content is not a string', async () => {
            const mockedData = {
                ...defaultMockData,
                content: 123 
            };
            const result = await main(mockedData);

            expect(result).toBe('<!-- Error occurred in the Acknowledgement component: The "content" field cannot be undefined and must be a non-empty string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        it('Should render component with valid data', async () => {
            const result = await main(defaultMockData);
            
            expect(result).toMatchInlineSnapshot(`"<section data-component='acknowledgement'><div class='su-mx-auto su-component-container su-container-narrow su-container-px'><hr aria-hidden='true' class='su-mb-36 su-border-none su-w-100 su-h-6 lg:su-h-9 su-bg-gradient-to-r su-from-digital-red su-to-digital-red-dark dark:su-from-palo-verde dark:su-to-olive' /><h2 class='sr-only'>Test Title</h2><div data-test='acknowledgement' class='su-wysiwyg-content *:su-basefont-19 su-mb-36 [&>*:last-child]:su-mb-0' >Test Content</div></div></section>"`);
        });
    });
});