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
                    imageAsset: "matrix-asset://stanfordNews/image1",
                    imageCaption: "Test caption 1"
                },
                {
                    imageAsset: "matrix-asset://stanfordNews/image2",
                    imageCaption: "Test caption 2"
                },
                {
                    imageAsset: "matrix-asset://stanfordNews/image3",
                    imageCaption: ""
                }
            ]
        }
    };
    
    const defaultMockInfo = {
        fns: mockFnsCtx,
        env: {
            API_IDENTIFIER: 'test-stanfordNews'
        }
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockedError.mockClear();
    });

    // No error handling, this component always outputs HTML - the manifest forces minimums

    describe('[Main Function]', () => {  
        it('Should return the expected HTML with valid data', async () => {
            // Mocking basicAssetUri to return URL data
            basicAssetUri.mockResolvedValueOnce({ url: 'https://example.com' });
            basicAssetUri.mockResolvedValueOnce({ url: 'https://picsum.photos/400/400'});
            basicAssetUri.mockResolvedValueOnce({ url: 'https://picsum.photos/400/400'});

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="multicolumn-image"><div class="su-mx-auto su-component-container su-container-wide su-container-px"><section class="su-flex su-flex-col su-items-center su-gap-8 md:su-gap-9"><div class="su-flex su-gap-20 su-items-center lg:su-gap-48"><div class='su-relative su-flex su-flex-col su-gap-8 su-flex-1'><img src='https://example.com' class='su-object-cover' alt='' /><p class='su-text-14 su-text-black-70 dark:su-text-black-30 su-font-normal su-leading-[119.415%] su-text-center su-m-0 md:su-text-16' data-se="caption" >Test caption 1</p></div><div class='su-relative su-flex su-flex-col su-gap-8 su-flex-1'><img src='https://picsum.photos/400/400' class='su-object-cover' alt='' /><p class='su-text-14 su-text-black-70 dark:su-text-black-30 su-font-normal su-leading-[119.415%] su-text-center su-m-0 md:su-text-16' data-se="caption" >Test caption 2</p></div><div class='su-relative su-flex su-flex-col su-gap-8 su-flex-1'><img src='https://picsum.photos/400/400' class='su-object-cover' alt='' /></div></div></section></div></section>"`);
        });
        
        it('Should return the expected HTML with section caption', async () => {
            const mockData = {
                contentConfiguration: {
                    images: [
                        {
                            imageAsset: "matrix-asset://stanfordNews/image1",
                            imageCaption: "Test caption 1"
                        },
                        {
                            imageAsset: "matrix-asset://stanfordNews/image2",
                            imageCaption: ""
                        },
                        {
                            imageAsset: "matrix-asset://stanfordNews/image3",
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

            expect(result).toMatchInlineSnapshot(`"<section data-component="multicolumn-image"><div class="su-mx-auto su-component-container su-container-wide su-container-px"><section class="su-flex su-flex-col su-items-center su-gap-8 md:su-gap-9"><div class="su-flex su-gap-20 su-items-center lg:su-gap-48"><div class='su-relative su-flex su-flex-col su-gap-8 su-flex-1'><img src='https://example.com' class='su-object-cover' alt='' /></div><div class='su-relative su-flex su-flex-col su-gap-8 su-flex-1'><img src='https://picsum.photos/400/400' class='su-object-cover' alt='' /></div><div class='su-relative su-flex su-flex-col su-gap-8 su-flex-1'><img src='https://picsum.photos/400/400' class='su-object-cover' alt='' /></div></div><p class="su-text-14 su-text-black-70 dark:su-text-black-30 su-font-normal su-max-w-[63.3rem] su-leading-[119.415%] su-text-center md:su-text-16 su-mb-0" data-se="sectionCaption">Test caption 1</p></section></div></section>"`);
        });
    });
});