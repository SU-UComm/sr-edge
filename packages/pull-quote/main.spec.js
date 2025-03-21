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

describe('[Pull Quote]', () => {
    const mockFnsCtx = {
        resolveUri: vi.fn()
    };

    const defaultMockData = {
        displayConfiguration: {
            asset: "matrix-asset://api-identifier/63353",
            quote: "Test quote",
            name: "Test name",
            title: "Test title",
            width: "Large"
        }
    };

    const defaultMockInfo = {
        fns: mockFnsCtx,
        env: {
            API_IDENTIFIER: 'sample-api',
        }
    };
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters was provided.', async () => {
            const result = await main();

            expect(result).toBe('<!-- Error occurred in the Pull quote component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when no info was provided', async () => {
            const result = await main(defaultMockData);

            expect(result).toBe('<!-- Error occurred in the Pull quote component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info do not have fns or ctx functions', async () => {
            const mockInfo = {test: 'test'}
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Pull quote component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when fns or ctx is invalid', async () => {
            const mockInfo = { fns: undefined, ctx: undefined,  };
            const result = await main(defaultMockData, mockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Pull quote component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when API_IDENTIFIER was not provided', async () => {
            const mockInfo = {
                env: {
                    FB_JSON_URL: 'https://example.com/json',
                    BASE_DOMAIN: 'https://example.com',
                },
                fns: mockFnsCtx
            }
            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Pull quote component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
                
        it('Should throw an error when API_IDENTIFIER was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        FB_JSON_URL: 'https://example.com/json',
                        BASE_DOMAIN: 'https://example.com',
                    },
                },
                fns: mockFnsCtx
            }
            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Pull quote component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when asset is not a string', async () => {
            const mockedData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    asset: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Pull quote component: The "asset" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when quote is not a string', async () => {
            const mockedData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    quote: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Pull quote component: The "quote" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when name is not a string', async () => {
            const mockedData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    name: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Pull quote component: The "name" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when title is not a string', async () => {
            const mockedData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    title: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Pull quote component: The "title" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when width was not one of ["Narrow", "Large"]', async () => {
            const mockData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    width: 'Full'
                }
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Pull quote component: The "width" field cannot be undefined and must be one of ["Narrow", "Large"]. The "Full" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
    });

    describe('[Main Function]', () => {
        it('Should return the expected HTML with valid data', async () => {
            basicAssetUri.mockResolvedValueOnce({ url: 'https://picsum.photos/400/400', attributes: { alt: 'Alt Text' } });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="pullquote">
               <div class="su-mx-auto su-component-container su-container-large su-container-px">
               <div class="su-component-pullquote su-mx-auto su-relative su-mt-0 su-flex su-flex-wrap su-gap-27 su-justify-center su-pr-0 su-py-0"> <div data-test="size-large" class="su-component-avatar su-relative su-block su-rounded-full su-bg-gradient-light-red-h su-overflow-hidden su-min-w-[218px] su-w-[218px] su-h-[218px] su-p-9"> <img class="su-absolute su-rounded-full su-object-cover su-object-center su-size-200 su-top-9 su-left-9" src="https://picsum.photos/400/400" alt="" /> </div> <blockquote class="su-w-full su-pl-39 dark:su-text-white dark:before:su-text-white su-font-serif su-text-black lg:su-pl-[5.2rem]"> <div class="su-font-semibold su-font-serif-0 su-text-[2.4rem] md:su-text-[3.6rem] su-leading md:su-leading-[130.245%] [&>*:last-child]:su-mb-0 [&>*:last-child]:after:su-content-['”'] su-relative before:su-text-[73px] before:su-leading-[109.5px] lg:before:su-leading-[139.5px] lg:before:su-text-[93px] before:su-font-semibold before:su--mt-25 lg:before:su--mt-38 before:su-content-['“'] before:su-text-serif before:su-text-black dark:su-text-white before:su-absolute before:su-right-full lg:before:su-right-full before:su-mr-6 lg:before:su-mr-13 dark:before:su-text-white su-leading-[33.6px] md:su-leading-[46.89px]"> Test quote” </div>  <cite class="su-mt-15 md:su-mt-26 lg:su-mt-29 su-font-sans su-text-21 su-leading-[25.2px] su-flex su-flex-col"> <span class="su-font-bold su-block su-leading-[25.2px]"> Test name </span>  <span class="su-block su-leading-[25.2px]">Test title</span>  </cite>  </blockquote> </div> </div>
              </section>"
            `);
        });

        it('Should return the expected HTML with no image data when not provided', async () => {
            basicAssetUri.mockResolvedValueOnce();

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="pullquote">
               <div class="su-mx-auto su-component-container su-container-large su-container-px">
               <div class="su-component-pullquote su-mx-auto su-relative su-mt-0 su-flex su-flex-wrap su-gap-27 su-justify-center su-pr-0 su-py-0"> <div data-test="size-large" class="su-component-avatar su-relative su-block su-rounded-full su-bg-gradient-light-red-h su-overflow-hidden su-min-w-[218px] su-w-[218px] su-h-[218px] su-p-9"> <img class="su-absolute su-rounded-full su-object-cover su-object-center su-size-200 su-top-9 su-left-9" src="" alt="" /> </div> <blockquote class="su-w-full su-pl-39 dark:su-text-white dark:before:su-text-white su-font-serif su-text-black lg:su-pl-[5.2rem]"> <div class="su-font-semibold su-font-serif-0 su-text-[2.4rem] md:su-text-[3.6rem] su-leading md:su-leading-[130.245%] [&>*:last-child]:su-mb-0 [&>*:last-child]:after:su-content-['”'] su-relative before:su-text-[73px] before:su-leading-[109.5px] lg:before:su-leading-[139.5px] lg:before:su-text-[93px] before:su-font-semibold before:su--mt-25 lg:before:su--mt-38 before:su-content-['“'] before:su-text-serif before:su-text-black dark:su-text-white before:su-absolute before:su-right-full lg:before:su-right-full before:su-mr-6 lg:before:su-mr-13 dark:before:su-text-white su-leading-[33.6px] md:su-leading-[46.89px]"> Test quote” </div>  <cite class="su-mt-15 md:su-mt-26 lg:su-mt-29 su-font-sans su-text-21 su-leading-[25.2px] su-flex su-flex-col"> <span class="su-font-bold su-block su-leading-[25.2px]"> Test name </span>  <span class="su-block su-leading-[25.2px]">Test title</span>  </cite>  </blockquote> </div> </div>
              </section>"
            `);
        });
    });

});