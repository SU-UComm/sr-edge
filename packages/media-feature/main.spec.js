import { beforeEach, describe, expect, it, vi } from 'vitest';
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    basicAssetUri: vi.fn().mockImplementation((ctx, uri) => {
        if (uri.includes('background')) {
            return {
                url: 'https://example.com/background.jpg',
                attributes: {
                    alt: 'Background image'
                }
            };
        }
        return {
            url: 'https://example.com/image.jpg',
            attributes: {
                alt: 'Featured image'
            }
        };
    })
}));

vi.mock('../../global/js/helpers', () => ({
    SidebarHeading: vi.fn().mockReturnValue('<div>Sidebar Heading</div>')
}));

describe('[Media Feature]', () => {
    const mockFnsCtx = { resolveUri: vi.fn() };
    
    const defaultMockData = {
        contentConfiguration: {
            backgroundImage: 'matrix-asset://api-identifier/background-image',
            image: 'matrix-asset://api-identifier/image',
            title: 'Test Title',
            teaserText: 'Test Description',
            mediaType: 'Book',
            linkUrl: 'https://example.com'
        }
    };

    const defaultMockInfo = {
        fns: mockFnsCtx
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters was provided.', async () => {
            const result = await main();

            expect(result).toBe('<!-- Error occurred in the Media feature component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info was provided', async () => {
            const result = await main(defaultMockData);

            expect(result).toBe('<!-- Error occurred in the Media feature component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info do not have fns or ctx functions', async () => {
            const mockInfo = {test: 'test'}
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Media feature component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fns or ctx is invalid', async () => {
            const mockInfo = { fns: undefined, ctx: undefined,  };
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Media feature component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when backgroundImage is not a string', async () => {
            const mockedData = {
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    backgroundImage: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Media feature component: The "backgroundImage" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when image is not a string', async () => {
            const mockedData = {
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    image: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Media feature component: The "image" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when title is not a string', async () => {
            const mockedData = {
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    title: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Media feature component: The "title" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when teaserText is not a string', async () => {
            const mockedData = {
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    teaserText: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Media feature component: The "teaserText" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when linkUrl is not a string', async () => {
            const mockedData = {
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    linkUrl: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Media feature component: The "linkUrl" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
       
         it('Should throw an error when mediaType was not one of ["Podcast", "Book", "Magazine"]', async () => {
            const mockData = {
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    mediaType: [1,2,3],
                }
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Media feature component: The "mediaType" field must be one of ["Podcast", "Book", "Magazine"]. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        it('Should return the expected HTML with valid data for Book type', async () => {
            const result = await main(defaultMockData, defaultMockInfo);
            
            expect(result).toContain('Test Title');
            expect(result).toContain('Test Description');
            expect(result).toContain('Book');
            expect(result).toContain('https://example.com');
        });

        it('Should return the expected HTML with valid data for Podcast type', async () => {
            const podcastData = {
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    mediaType: 'Podcast'
                }
            };

            const result = await main(podcastData, defaultMockInfo);
            
            expect(result).toContain('Test Title');
            expect(result).toContain('Test Description');
            expect(result).toContain('Podcast');
            expect(result).toContain('https://example.com');
        });

        it('Should return the expected HTML with valid data for Magazine type', async () => {
            const magazineData = {
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    mediaType: 'Magazine'
                }
            };

            const result = await main(magazineData, defaultMockInfo);
            
            expect(result).toContain('Test Title');
            expect(result).toContain('Test Description');
            expect(result).toContain('Magazine');
            expect(result).toContain('https://example.com');
        });
    });
});
