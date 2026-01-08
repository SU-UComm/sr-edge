import { beforeEach, describe, expect, it, vi } from 'vitest';
import { basicAssetUri } from "../../global/js/utils";
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    basicAssetUri: vi.fn(),
}));

describe('[Interactive Photo Card]', () => {
    const mockFnsCtx = {
        resolveUri: vi.fn()
    };
    const defaultMockData = {
        title: 'Photo Title',
        content: 'Photo Content',
        image: 'matrix-asset://stanfordNews/image-id',
        eyebrow: 'Optional Eyebrow',
        imageAlignment: 'left'
    };
    const defaultMockInfo = {
        fns: mockFnsCtx
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters were provided.', async () => {
            const result = await main();

            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info was provided', async () => {
            const result = await main(defaultMockData);

            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fns or ctx is invalid', async () => {
            const mockInfo = { foo: 'bar' };
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when title was not provided', async () => {
            const mockedData = {
                ...defaultMockData, 
                title: undefined
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "title" field cannot be undefined and must be a non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when title was an empty string', async () => {
            const mockedData = {
                ...defaultMockData, 
                title: ''
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "title" field cannot be undefined and must be a non-empty string. The "" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when title was not a string', async () => {
            const mockedData = {
                ...defaultMockData, 
                title: 123
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "title" field cannot be undefined and must be a non-empty string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when content was not provided', async () => {
            const mockedData = {
                ...defaultMockData, 
                content: undefined
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "content" field cannot be undefined and must be a non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when content was an empty string', async () => {
            const mockedData = {
                ...defaultMockData, 
                content: ''
            };
            const result = await main(mockedData, defaultMockInfo);
            
            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "content" field cannot be undefined and must be a non-empty string. The "" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when content was not a string', async () => {
            const mockedData = {
                ...defaultMockData, 
                content: 123
            };
            const result = await main(mockedData, defaultMockInfo);
            
            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "content" field cannot be undefined and must be a non-empty string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when image was not provided', async () => {
            const mockedData = {
                ...defaultMockData, 
                image: undefined
            };
            const result = await main(mockedData, defaultMockInfo);
            
            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "image" field cannot be undefined and must be a non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when image was an empty string', async () => {
            const mockedData = {
                ...defaultMockData, 
                image: ''
            };
            const result = await main(mockedData, defaultMockInfo);
            
            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "image" field cannot be undefined and must be a non-empty string. The "" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when image was not a string', async () => {
            const mockedData = {
                ...defaultMockData, 
                image: 123
            };
            const result = await main(mockedData, defaultMockInfo);
            
            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "image" field cannot be undefined and must be a non-empty string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when image was not a string', async () => {
            const mockedData = {
                ...defaultMockData, 
                eyebrow: 123
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "eyebrow" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when source was not one of ["left", "right"]', async () => {
            const mockedData = {
                ...defaultMockData, 
                imageAlignment: 'center'
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "imageAlignment" field cannot be undefined and must be one of ["left", "right"]. The "center" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        beforeEach(() => {
            basicAssetUri.mockResolvedValueOnce({ url: 'https://example.com/image.jpg' });
        });

        it('Should return the expected HTML with valid data', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).to.contain('xl:su-order-2'); // Left align

            expect(result).to.contain('data-component="interactive-photo-card"');
            expect(result).to.contain('https://example.com/image.jpg');
            expect(result).to.contain('Photo Title');
            expect(result).to.contain('Photo Content');
        });

        it('Should handle right alignment correctly', async () => {
            const mockData = {
                ...defaultMockData, 
                imageAlignment: 'right'
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).not.contain('xl:su-order-2');

            expect(result).to.contain('data-component="interactive-photo-card"');
            expect(result).to.contain('https://example.com/image.jpg');
            expect(result).to.contain('Photo Title');
            expect(result).to.contain('Photo Content');
        });

        it('Should omit eyebrow when not provided', async () => {
            const mockData = {...defaultMockData, eyebrow: undefined};
            const result = await main(mockData, defaultMockInfo);

            expect(result).not.contain('Optional Eyebrow');
            expect(result).to.contain('data-component="interactive-photo-card"');
            expect(result).to.contain('https://example.com/image.jpg');
            expect(result).to.contain('Photo Title');
            expect(result).to.contain('Photo Content');
        });
    });
});