import { beforeEach, describe, expect, it, vi } from 'vitest';
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

describe('[Link List]', () => {
    const defaultMockData = {
        dataUrl: "https://news.stanford.edu/__data/assets/js_file/0028/129619/site-data.js",
        title: "Stories for you"
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters are provided.', async () => {
            const result = await main();
            
            expect(result).toBe(
                '<!-- Error occurred in the Link List component: The "dataUrl" field cannot be undefined and must be a non-empty string. The undefined was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when dataUrl is undefined', async () => {
            const mockData = { ...defaultMockData, dataUrl: undefined };
            const result = await main(mockData);

            expect(result).toBe(
                '<!-- Error occurred in the Link List component: The "dataUrl" field cannot be undefined and must be a non-empty string. The undefined was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when dataUrl is not a string', async () => {
            const mockData = { ...defaultMockData, dataUrl: 123 };
            const result = await main(mockData);

            expect(result).toBe(
                '<!-- Error occurred in the Link List component: The "dataUrl" field cannot be undefined and must be a non-empty string. The 123 was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when dataUrl is not an empty string', async () => {
            const mockData = { ...defaultMockData, dataUrl: '' };
            const result = await main(mockData);

            expect(result).toBe(
                '<!-- Error occurred in the Link List component: The "dataUrl" field cannot be undefined and must be a non-empty string. The "" was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when title is undefined', async () => {
            const mockData = { ...defaultMockData, title: undefined };
            const result = await main(mockData);

            expect(result).toBe(
                '<!-- Error occurred in the Link List component: The "title" field cannot be undefined and must be a string. The undefined was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when title is not a string', async () => {
            const mockData = { ...defaultMockData, title: 123 };
            const result = await main(mockData);

            expect(result).toBe(
                '<!-- Error occurred in the Link List component: The "title" field cannot be undefined and must be a string. The 123 was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when title is not an empty string', async () => {
            const mockData = { ...defaultMockData, title: '' };
            const result = await main(mockData);

            expect(result).toBe(
                '<!-- Error occurred in the Link List component: The "title" field cannot be undefined and must be a string. The "" was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {  
        it('Should render expected HTML with proper data', async () => {
            const result = await main(defaultMockData);

            expect(result).to.contain('data-component="link-list"');
            expect(result).to.contain('id="link-drawer"');
        });               
    });
});
