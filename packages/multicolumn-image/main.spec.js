import { beforeEach, describe, expect, it, vi } from 'vitest';
import { basicAssetUri } from "../../global/js/utils";
import moduleToTest from './main';

const { main } = moduleToTest;

// Mock console.error
const mockedError = vi.fn();
console.error = mockedError;

// Mock dependencies
vi.mock('../../global/js/utils', () => ({
    basicAssetUri: vi.fn(),
}));

describe('[Multicolumn Image]', () => {
    // Test fixtures
    const mockFnsCtx = {
        resolveUri: vi.fn()
    };

    const defaultMockData = {
        contentConfiguration: {
            images: [
                {
                    imageAsset: "matrix-asset://api-identifier/image1",
                    imageCaption: "Test caption 1"
                },
                {
                    imageAsset: "matrix-asset://api-identifier/image2",
                    imageCaption: "Test caption 2"
                },
                {
                    imageAsset: "matrix-asset://api-identifier/image3",
                    imageCaption: ""
                }
            ]
        }
    };
    
    const defaultMockInfo = {
        fns: mockFnsCtx,
        env: {
            API_IDENTIFIER: 'test-api-identifier'
        }
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockedError.mockClear();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters was provided.', async () => {
            const result = await main();

            expect(result).toBe('<!-- Error occurred in the Multicolumn image component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when no info was provided', async () => {
            const result = await main(defaultMockData);

            expect(result).toBe('<!-- Error occurred in the Multicolumn image component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info do not have fns or ctx functions', async () => {
            const mockInfo = {test: 'test'}
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Multicolumn image component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fns or ctx is invalid', async () => {
            const mockInfo = { fns: undefined, ctx: undefined,  };
            const result = await main(defaultMockData, mockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Multicolumn image component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

            it('Should throw an error when API_IDENTIFIER was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        TEST: 'test',
                    },
                },
                fns: mockFnsCtx
            }
            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Multicolumn image component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when API_IDENTIFIER was not provided', async () => {
            const mockInfo = {
                env: {
                    TEST: 'test',
                },
                fns: mockFnsCtx
            }
            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Multicolumn image component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when the images are not an array', async () => {
            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    images: 'test',
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe(
                '<!-- Error occurred in the Multicolumn image component: The "images" field must be an array and at least 2 elements length. The "test" was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when the images is an empty array', async () => {
            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    images: [],
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe(
                '<!-- Error occurred in the Multicolumn image component: The "images" field must be an array and at least 2 elements length. The [] was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when the images length is less than 2', async () => {
            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    images: [
                        {
                            imageAsset: "matrix-asset://api-identifier/image1",
                            imageCaption: "Test caption 1"
                        }
                    ],
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe(
                '<!-- Error occurred in the Multicolumn image component: The "images" field must be an array and at least 2 elements length. The [{"imageAsset":"matrix-asset://api-identifier/image1","imageCaption":"Test caption 1"}] was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {  
        it('Should return the expected HTML with valid data', async () => {
            // Mocking basicAssetUri to return URL data
            basicAssetUri.mockResolvedValueOnce({ url: 'https://example.com' });
            basicAssetUri.mockResolvedValueOnce({ url: 'https://picsum.photos/400/400'});
            basicAssetUri.mockResolvedValueOnce({ url: 'https://picsum.photos/400/400'});

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="multicolumn-image"><div class="su-mx-auto su-component-container su-container-wide su-container-px"><section class="su-flex su-flex-col su-items-center su-gap-8 md:su-gap-9"><div class="su-flex su-gap-20 su-items-center lg:su-gap-48"> <div class="su-relative su-flex su-flex-col su-gap-8 su-flex-1"><img src="https://example.com" class="su-object-cover" alt="" /><p class="su-text-14 su-text-black-70 dark:su-text-black-30 su-font-normal su-leading-[119.415%] su-text-center su-m-0 md:su-text-16">Test caption 1</p></div>  <div class="su-relative su-flex su-flex-col su-gap-8 su-flex-1"><img src="https://picsum.photos/400/400" class="su-object-cover" alt="" /><p class="su-text-14 su-text-black-70 dark:su-text-black-30 su-font-normal su-leading-[119.415%] su-text-center su-m-0 md:su-text-16">Test caption 2</p></div>  <div class="su-relative su-flex su-flex-col su-gap-8 su-flex-1"><img src="https://picsum.photos/400/400" class="su-object-cover" alt="" /></div> </div></section></div></section>"`);
        });
        
        it('Should return the expected HTML with section caption', async () => {
            const mockData = {
                contentConfiguration: {
                    images: [
                        {
                            imageAsset: "matrix-asset://api-identifier/image1",
                            imageCaption: "Test caption 1"
                        },
                        {
                            imageAsset: "matrix-asset://api-identifier/image2",
                            imageCaption: ""
                        },
                        {
                            imageAsset: "matrix-asset://api-identifier/image3",
                            imageCaption: ""
                        }
                    ]
                }
            };

            // Mocking basicAssetUri to return URL data
            basicAssetUri.mockResolvedValueOnce({ url: 'https://example.com' });
            basicAssetUri.mockResolvedValueOnce({ url: 'https://picsum.photos/400/400'});
            basicAssetUri.mockResolvedValueOnce({ url: 'https://picsum.photos/400/400'});

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="multicolumn-image"><div class="su-mx-auto su-component-container su-container-wide su-container-px"><section class="su-flex su-flex-col su-items-center su-gap-8 md:su-gap-9"><div class="su-flex su-gap-20 su-items-center lg:su-gap-48"> <div class="su-relative su-flex su-flex-col su-gap-8 su-flex-1"><img src="https://example.com" class="su-object-cover" alt="" /></div>  <div class="su-relative su-flex su-flex-col su-gap-8 su-flex-1"><img src="https://picsum.photos/400/400" class="su-object-cover" alt="" /></div>  <div class="su-relative su-flex su-flex-col su-gap-8 su-flex-1"><img src="https://picsum.photos/400/400" class="su-object-cover" alt="" /></div> </div><p class="su-text-14 su-text-black-70 dark:su-text-black-30 su-font-normal su-max-w-[63.3rem] su-leading-[119.415%] su-text-center md:su-text-16 su-mb-0">Test caption 1</p></section></div></section>"`);
        });
    });
});