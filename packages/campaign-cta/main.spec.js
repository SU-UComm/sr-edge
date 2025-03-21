import { beforeEach, describe, expect, it, vi } from 'vitest';
import { basicAssetUri } from "../../global/js/utils";
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    basicAssetUri: vi.fn(),
}));

describe('[Campaign CTA]', () => {
    const mockFnsCtx = {
        resolveUri: vi.fn()
    };

    const defaultMockData = {
        displayConfiguration: {
            image: 'matrix-asset://api-identifier/63353',
            title: 'Campaign Title',
            description: 'Campaign Description',
            linkUrl: 'matrix-asset://api-identifier/63492',
            linkText: 'Click Here'
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

            expect(result).toBe('<!-- Error occurred in the Campaign cta component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when no info was provided', async () => {
            const result = await main(defaultMockData);

            expect(result).toBe('<!-- Error occurred in the Campaign cta component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info do not have fns or ctx functions', async () => {
            const mockInfo = {test: 'test'}
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Campaign cta component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when fns or ctx is invalid', async () => {
            const mockInfo = { fns: undefined, ctx: undefined,  };
            const result = await main(defaultMockData, mockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Campaign cta component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should handle errors when image is not provided', async () => {
            const mockedData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    image: undefined,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Campaign cta component: The "image" field cannot be undefined and must be a string type. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when image is not a string', async () => {
            const mockedData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    image: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Campaign cta component: The "image" field cannot be undefined and must be a string type. The 123 was received. -->');
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
    
            expect(result).toBe('<!-- Error occurred in the Campaign cta component: The "title" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when description is not a string', async () => {
            const mockedData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    description: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Campaign cta component: The "description" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when linkText is not a string', async () => {
            const mockedData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    linkText: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Campaign cta component: The "linkText" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when linkUrl is not a string', async () => {
            const mockedData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    linkUrl: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Campaign cta component: The "linkUrl" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        it('Should return the expected HTML with valid data', async () => {
            // Mocking basicAssetUri to return URL data
            basicAssetUri.mockResolvedValueOnce({ url: 'https://example.com' });
            basicAssetUri.mockResolvedValueOnce({ url: 'https://picsum.photos/400/400', attributes: { alt: 'Alt Text' } });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="campaign-cta"> <div class="su-mx-auto su-component-container su-container-full"> <div class="su-container-inner su-relative su-flex su-items-center su-justify-center su-flex-col"> <div class="su-component-campaigncta-wrap su-pt-126 su-pb-108 su-relative su-z-[2] su-text-white su-p-20 md:su-px-50 su-flex su-flex-col md:su-flex-row"> <div class="su-component-campaigncta-content su-relative md:su-border-r-black-30 md:su-border-r md:su-mr-25 su-w-full md:su-max-w-[65.5rem] md:su-pr-25">  <h2 class="su-font-serif su-text-[5.5rem] su-leading-none md:su-text-[7.2rem] su-m-0 su-font-bold">Campaign Title</h2>   <div class="su-mt-34 su-font-serif su-text-20 md:su-text-24 su-mb-0 md:su-mb-[5.9rem] su-text-semibold md:su-mt-61 su-font-semibold su-leading-[130.245%]">Campaign Description</div>  </div>  <a href="https://example.com" class="su-text-18 su-mt-50 su-font-normal su-leading-display su-inline-block su-px-30 su-pt-10 su-pb-12 su-bg-digital-red su-mr-auto su-text-white su-no-underline hover:su-bg-black su-transition md:su-px-35 md:su-pt-14 md:su-pb-16 md:su-text-24 md:su-leading-[119.415%] md:su-mt-auto su-shrink-0"> Click Here </a>  </div>  <img class="su-absolute su-object-cover su-size-full su-z-[1]" src="https://picsum.photos/400/400" alt="" />  <div class="su-campaign-cta-gradient su-z-[1]"></div> </div> </div></section>"`);
        });

        it('Should return HTML without link when linkUrl is missing', async () => {
            const mockData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    linkUrl: null,
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="campaign-cta"> <div class="su-mx-auto su-component-container su-container-full"> <div class="su-container-inner su-relative su-flex su-items-center su-justify-center su-flex-col"> <div class="su-component-campaigncta-wrap su-pt-126 su-pb-108 su-relative su-z-[2] su-text-white su-p-20 md:su-px-50 su-flex su-flex-col md:su-flex-row"> <div class="su-component-campaigncta-content su-relative md:su-border-r-black-30 md:su-border-r md:su-mr-25 su-w-full md:su-max-w-[65.5rem] md:su-pr-25">  <h2 class="su-font-serif su-text-[5.5rem] su-leading-none md:su-text-[7.2rem] su-m-0 su-font-bold">Campaign Title</h2>   <div class="su-mt-34 su-font-serif su-text-20 md:su-text-24 su-mb-0 md:su-mb-[5.9rem] su-text-semibold md:su-mt-61 su-font-semibold su-leading-[130.245%]">Campaign Description</div>  </div>  </div>  <div class="su-campaign-cta-gradient su-z-[1]"></div> </div> </div></section>"`);
        });

        it('Should return HTML without title when title is an empty string', async () => {
            const mockData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    title: '',
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="campaign-cta"> <div class="su-mx-auto su-component-container su-container-full"> <div class="su-container-inner su-relative su-flex su-items-center su-justify-center su-flex-col"> <div class="su-component-campaigncta-wrap su-pt-126 su-pb-108 su-relative su-z-[2] su-text-white su-p-20 md:su-px-50 su-flex su-flex-col md:su-flex-row"> <div class="su-component-campaigncta-content su-relative md:su-border-r-black-30 md:su-border-r md:su-mr-25 su-w-full md:su-max-w-[65.5rem] md:su-pr-25">   <div class="su-mt-34 su-font-serif su-text-20 md:su-text-24 su-mb-0 md:su-mb-[5.9rem] su-text-semibold md:su-mt-61 su-font-semibold su-leading-[130.245%]">Campaign Description</div>  </div>  </div>  <div class="su-campaign-cta-gradient su-z-[1]"></div> </div> </div></section>"`);
        });

        it('Should return HTML without description when description is an empty string', async () => {
            const mockData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    description: '',
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="campaign-cta"> <div class="su-mx-auto su-component-container su-container-full"> <div class="su-container-inner su-relative su-flex su-items-center su-justify-center su-flex-col"> <div class="su-component-campaigncta-wrap su-pt-126 su-pb-108 su-relative su-z-[2] su-text-white su-p-20 md:su-px-50 su-flex su-flex-col md:su-flex-row"> <div class="su-component-campaigncta-content su-relative md:su-border-r-black-30 md:su-border-r md:su-mr-25 su-w-full md:su-max-w-[65.5rem] md:su-pr-25">  <h2 class="su-font-serif su-text-[5.5rem] su-leading-none md:su-text-[7.2rem] su-m-0 su-font-bold">Campaign Title</h2>   </div>  </div>  <div class="su-campaign-cta-gradient su-z-[1]"></div> </div> </div></section>"`);
        });

        it('Should return HTML with empty alt attribute when attributes alt is missing', async () => {
            // Mocking basicAssetUri to return URL data
            basicAssetUri.mockResolvedValueOnce({ url: 'https://example.com' });
            basicAssetUri.mockResolvedValueOnce({ url: 'https://picsum.photos/400/400'});

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="campaign-cta"> <div class="su-mx-auto su-component-container su-container-full"> <div class="su-container-inner su-relative su-flex su-items-center su-justify-center su-flex-col"> <div class="su-component-campaigncta-wrap su-pt-126 su-pb-108 su-relative su-z-[2] su-text-white su-p-20 md:su-px-50 su-flex su-flex-col md:su-flex-row"> <div class="su-component-campaigncta-content su-relative md:su-border-r-black-30 md:su-border-r md:su-mr-25 su-w-full md:su-max-w-[65.5rem] md:su-pr-25">  <h2 class="su-font-serif su-text-[5.5rem] su-leading-none md:su-text-[7.2rem] su-m-0 su-font-bold">Campaign Title</h2>   <div class="su-mt-34 su-font-serif su-text-20 md:su-text-24 su-mb-0 md:su-mb-[5.9rem] su-text-semibold md:su-mt-61 su-font-semibold su-leading-[130.245%]">Campaign Description</div>  </div>  <a href="https://example.com" class="su-text-18 su-mt-50 su-font-normal su-leading-display su-inline-block su-px-30 su-pt-10 su-pb-12 su-bg-digital-red su-mr-auto su-text-white su-no-underline hover:su-bg-black su-transition md:su-px-35 md:su-pt-14 md:su-pb-16 md:su-text-24 md:su-leading-[119.415%] md:su-mt-auto su-shrink-0"> Click Here </a>  </div>  <img class="su-absolute su-object-cover su-size-full su-z-[1]" src="https://picsum.photos/400/400" alt="" />  <div class="su-campaign-cta-gradient su-z-[1]"></div> </div> </div></section>"`);
        });

        it('Should sanitize the description using xss', async () => {
            const mockData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    description: '<script>alert("xss")</script>',
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).not.toContain('<script>alert("xss")</script>');
        });
    });
});
