import { beforeEach, describe, expect, it, vi } from 'vitest';
import { basicAssetUri } from "../../global/js/utils";
import moduleToTest from './main';

const { main } = moduleToTest;

// Mock console.error
const mockedError = vi.fn();
console.error = mockedError;

// Mock dependencies
vi.mock('../../global/js/utils', () => ({
    basicAssetUri: vi.fn().mockResolvedValue({ url: 'https://example.com/image.jpg' }),
    isRealExternalLink: vi.fn()
}));

describe('[Single CTA Block]', () => {
    const mockFnsCtx = { resolveUri: vi.fn() };

    const defaultMockData = {
        size: 'normal',
        title: 'Test Title',
        eyebrow: 'Test Eyebrow',
        description: 'Test Description',
        image: 'matrix-asset://test-image',
        isCard: true,
        marginTop: 'base',
        marginBottom: 'base',
        ctaConfiguration: {
            ctaText: 'Click Me',
            ctaType: 'link',
            externalUrl: 'https://example.com',
            isNewWindow: false
        }
    };
    const defaultMockInfo = {
         fns: mockFnsCtx
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it("Should throw an error when no parameters are provided", async () => {
            const result = await main();

            expect(result).toBe('<!-- Error occurred in the Single CTA Block component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should throw an error when no info is provided", async () => {
            const result = await main(defaultMockData);

            expect(result).toBe('<!-- Error occurred in the Single CTA Block component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should throw an error when info does not contain fns or ctx", async () => {
            const mockInfo = { test: "test" };
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Single CTA Block component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it("Should throw an error when size is not a one of ['normal', 'campaign']", async () => {
            const mockData = { ...defaultMockData, size: 'test',};
            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Single CTA Block component: The "size" field must be one of ["normal", "campaign"]. The "test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when title is not a string', async () => {
            const mockData = { ...defaultMockData, title: 123 }
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toBe('<!-- Error occurred in the Single CTA Block component: The "title" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when eyebrow is not a string', async () => {
            const mockData = { ...defaultMockData, eyebrow: 123 }
            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Single CTA Block component: The "eyebrow" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when description is not a string', async () => {
            const mockData = { ...defaultMockData, description: 123 }
            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Single CTA Block component: The "description" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when image is not a string', async () => {
            const mockData = { ...defaultMockData, image: 123 }
            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Single CTA Block component: The "image" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when isCard is not a boolean', async () => {
            const mockData = { ...defaultMockData, isCard: 123 }
            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Single CTA Block component: The "isCard" field must be a boolean type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should throw an error when marginTop is not a one of ['default', 'base', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']", async () => {
            const mockData = { ...defaultMockData, marginTop: 123 };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toBe('<!-- Error occurred in the Single CTA Block component: The "marginTop" field must be one of ["default", "base", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should throw an error when marginBottom is not a one of ['default', 'base', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']", async () => {
            const mockData = { ...defaultMockData, marginBottom: 123 };
            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Single CTA Block component: The "marginBottom" field must be one of ["default", "base", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when ctaType is invalid', async () => {
            const mockData = { ...defaultMockData, ctaConfiguration: {...defaultMockData.ctaConfiguration, ctaType: 'invalid' }  };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Single CTA Block component: The "ctaType" must be one of ["download", "email", "link"]. The "invalid" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when email is not a string', async () => {
            const mockData = { ...defaultMockData, ctaConfiguration: {...defaultMockData.ctaConfiguration, ctaType: 'email', email: 123 }  };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Single CTA Block component: The "email" field must be a non-empty string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when isNewWindow is not boolean', async () => {
            const mockData = { ...defaultMockData, ctaConfiguration: {...defaultMockData.ctaConfiguration, isNewWindow: 'true' }  };
            const result = await main(mockData, defaultMockInfo);
            expect(result).toBe('<!-- Error occurred in the Single CTA Block component: The "isNewWindow" field must be a boolean type. The "true" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when externalUrl is not a string', async () => {
            const mockData = { ...defaultMockData, ctaConfiguration: {
                ...defaultMockData.ctaConfiguration,
                externalUrl: 789
            }};
            const result = await main(mockData, defaultMockInfo);
            expect(result).toBe('<!-- Error occurred in the Single CTA Block component: The "externalUrl" field must be a string type. The 789 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when internalUrl is not a string', async () => {
            const mockData = { ...defaultMockData, ctaConfiguration: {
                ...defaultMockData.ctaConfiguration,
                internalUrl: 1011
            }};
            const result = await main(mockData, defaultMockInfo);
            expect(result).toBe('<!-- Error occurred in the Single CTA Block component: The "internalUrl" field must be a string type. The 1011 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when ctaText is not a string', async () => {
            const mockData = { ...defaultMockData, ctaConfiguration: {
                ...defaultMockData.ctaConfiguration,
                ctaText: 123
            }};
            const result = await main(mockData, defaultMockInfo);
            expect(result).toBe('<!-- Error occurred in the Single CTA Block component: The "ctaText" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        it("Should return the expected HTML with valid data", async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="single-cta-block"><div class="su-mx-auto su-component-container su-container-large su-rs-mt-0 su-rs-mb-0"><div class="su-flex su-flex-col-reverse xl:su-flex-row-reverse su-items-center su-justify-center su-gap-34 xl:su-gap-60 su-rounded-[8px] su-break-words su-text-black dark:su-text-white su-rs-py-8 su-rs-px-4 su-border dark:su-border-2 su-border-black-30/30 dark:su-border-black su-shadow dark:su-shadow-black/80 su-bg-white dark:su-bg-black-true su-rs-py-4"><div class="su-flex su-flex-col">  <span aria-hidden="true" class="su-block su-mx-auto su-mb-02em su-text-center su-text-black-60 dark:su-text-black-40 su-font-semibold su-type-1 su-leading-display su-type-0"> Test Eyebrow </span>   <div class="su-mx-auto xl:su-max-w-900 su-flex su-flex-col md:su-flex-row su-gap-20 su-items-center su-rs-mb-2"><div aria-hidden="true" class="su-relative md:su-top-06em su-hidden su-min-w-100 md:su-block su-grow su-shrink-0 su-h-4 su-bg-gradient-to-r su-from-digital-red-light su-to-digital-red-dark dark:su-from-palo-verde dark:su-to-olive su-w-auto"></div><h2 class="su-mx-auto su-text-center su-leading-tight dark:su-text-white su-mb-0 su-type-3">  <span class="su-sr-only">Test Eyebrow: </span>  Test Title </h2><div aria-hidden="true" class="su-relative md:su-top-06em su-mx-auto su-min-w-100 su-grow su-shrink-0 su-w-180 su-h-4 su-bg-gradient-to-l su-from-digital-red-light su-to-digital-red-dark dark:su-from-palo-verde dark:su-to-olive md:su-w-auto su-mb-20 md:su-mb-0"></div></div>  <div data-test="single-text-block-content" class="su-mx-auto su-text-center su-max-w-prose-wide *:su-leading-snug last:*:su-mb-0 dark:su-text-white su-text-18  xl:su-text-left"> Test Description </div>  <a href="https://example.com" class="su-group su-flex su-items-center su-w-fit hocus:su-underline su-px-30 su-pt-12 su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-text-white hocus:su-text-white su-no-underline hocus:su-underline su-bg-gradient-to-r su-from-digital-red-light su-to-cardinal-red-dark hocus:su-bg-none hocus:su-bg-black dark:su-from-olive dark:su-to-palo-verde dark:su-text-black-true dark:hocus:su-text-white dark:hocus:su-ring-white su-mx-auto su-rs-mt-2"> Click Me   </a>  </div>  <img src="https://example.com/image.jpg" alt="" class="su-w-1/2 sm:su-w-1/3 xl:su-w-1/4 su-shrink-0"/>  </div></div></section>"`);
        });

        it("Should return the expected HTML with valid data when size is set to campaign", async () => {
            const mockData = { 
                ...defaultMockData, 
                size: "campaign"
            };
            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="single-cta-block"><div class="su-mx-auto su-component-container su-cc su-rs-mt-0 su-rs-mb-0"><div class="su-flex su-flex-col-reverse xl:su-flex-row-reverse su-items-center su-justify-center su-gap-34 xl:su-gap-60 su-rounded-[8px] su-break-words su-text-black dark:su-text-white su-rs-py-8 su-rs-px-4 su-border dark:su-border-2 su-border-black-30/30 dark:su-border-black su-shadow dark:su-shadow-black/80 su-bg-white dark:su-bg-black-true su-rs-py-8"><div class="su-flex su-flex-col">  <span aria-hidden="true" class="su-block su-mx-auto su-mb-02em su-text-center su-text-black-60 dark:su-text-black-40 su-font-semibold su-type-1 su-leading-display su-type-1"> Test Eyebrow </span>   <div class="su-mx-auto xl:su-max-w-900 su-flex su-flex-col md:su-flex-row su-gap-20 su-items-center su-rs-mb-4"><div aria-hidden="true" class="su-relative md:su-top-06em su-hidden su-min-w-100 md:su-block su-grow su-shrink-0 su-h-4 su-bg-gradient-to-r su-from-digital-red-light su-to-digital-red-dark dark:su-from-palo-verde dark:su-to-olive su-w-auto"></div><h2 class="su-mx-auto su-text-center su-leading-tight dark:su-text-white su-mb-0 su-type-4">  <span class="su-sr-only">Test Eyebrow: </span>  Test Title </h2><div aria-hidden="true" class="su-relative md:su-top-06em su-mx-auto su-min-w-100 su-grow su-shrink-0 su-w-180 su-h-4 su-bg-gradient-to-l su-from-digital-red-light su-to-digital-red-dark dark:su-from-palo-verde dark:su-to-olive md:su-w-auto su-mb-20 md:su-mb-0"></div></div>  <div data-test="single-text-block-content" class="su-mx-auto su-text-center su-max-w-prose-wide *:su-leading-snug last:*:su-mb-0 dark:su-text-white su-text-18  xl:su-text-left"> Test Description </div>  <a href="https://example.com" class="su-group su-flex su-items-center su-w-fit hocus:su-underline su-rs-py-0 su-rs-px-4 su-font-semibold su-type-1 dark:hocus:su-ring-2 su-text-white hocus:su-text-white su-no-underline hocus:su-underline su-bg-gradient-to-r su-from-digital-red-light su-to-cardinal-red-dark hocus:su-bg-none hocus:su-bg-black dark:su-from-olive dark:su-to-palo-verde dark:su-text-black-true dark:hocus:su-text-white dark:hocus:su-ring-white su-mx-auto su-rs-mt-4"> Click Me   </a>  </div>  <img src="https://example.com/image.jpg" alt="" class="su-w-1/2 sm:su-w-1/3 xl:su-w-1/4 su-shrink-0"/>  </div></div></section>"`);
        });


        it('Should render template with valid data and image', async () => {
            basicAssetUri.mockResolvedValueOnce({
                url: 'https://example.com/image.jpg',
                attributes: { alt: 'Test Image' }
            });
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<section data-component="single-cta-block">');
            expect(result).toContain(defaultMockData.title);
            expect(result).toContain(defaultMockData.description);
            expect(result).toContain(defaultMockData.ctaConfiguration.ctaText);
        });

        it('Should render email CTA correctly', async () => {
            const mockData = { 
                ...defaultMockData, 
                ctaConfiguration: {
                    ...defaultMockData.ctaConfiguration,
                    ctaType: 'email',
                    email: 'test@example.com',
                } 
            };
            const result = await main(mockData, defaultMockInfo);

            expect(result).toContain('mailto:test@example.com');
        });

        it('Should render external link CTA correctly', async () => {
            const mockData = { 
                ...defaultMockData, 
                ctaConfiguration: {
                    ...defaultMockData.ctaConfiguration,
                    externalUrl: 'https://external.example.com',
                } 
            };
            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="single-cta-block"><div class="su-mx-auto su-component-container su-container-large su-rs-mt-0 su-rs-mb-0"><div class="su-flex su-flex-col-reverse xl:su-flex-row-reverse su-items-center su-justify-center su-gap-34 xl:su-gap-60 su-rounded-[8px] su-break-words su-text-black dark:su-text-white su-rs-py-8 su-rs-px-4 su-border dark:su-border-2 su-border-black-30/30 dark:su-border-black su-shadow dark:su-shadow-black/80 su-bg-white dark:su-bg-black-true su-rs-py-4"><div class="su-flex su-flex-col">  <span aria-hidden="true" class="su-block su-mx-auto su-mb-02em su-text-center su-text-black-60 dark:su-text-black-40 su-font-semibold su-type-1 su-leading-display su-type-0"> Test Eyebrow </span>   <div class="su-mx-auto xl:su-max-w-900 su-flex su-flex-col md:su-flex-row su-gap-20 su-items-center su-rs-mb-2"><div aria-hidden="true" class="su-relative md:su-top-06em su-hidden su-min-w-100 md:su-block su-grow su-shrink-0 su-h-4 su-bg-gradient-to-r su-from-digital-red-light su-to-digital-red-dark dark:su-from-palo-verde dark:su-to-olive su-w-auto"></div><h2 class="su-mx-auto su-text-center su-leading-tight dark:su-text-white su-mb-0 su-type-3">  <span class="su-sr-only">Test Eyebrow: </span>  Test Title </h2><div aria-hidden="true" class="su-relative md:su-top-06em su-mx-auto su-min-w-100 su-grow su-shrink-0 su-w-180 su-h-4 su-bg-gradient-to-l su-from-digital-red-light su-to-digital-red-dark dark:su-from-palo-verde dark:su-to-olive md:su-w-auto su-mb-20 md:su-mb-0"></div></div>  <div data-test="single-text-block-content" class="su-mx-auto su-text-center su-max-w-prose-wide *:su-leading-snug last:*:su-mb-0 dark:su-text-white su-text-18  xl:su-text-left"> Test Description </div>  <a href="https://external.example.com" class="su-group su-flex su-items-center su-w-fit hocus:su-underline su-px-30 su-pt-12 su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-text-white hocus:su-text-white su-no-underline hocus:su-underline su-bg-gradient-to-r su-from-digital-red-light su-to-cardinal-red-dark hocus:su-bg-none hocus:su-bg-black dark:su-from-olive dark:su-to-palo-verde dark:su-text-black-true dark:hocus:su-text-white dark:hocus:su-ring-white su-mx-auto su-rs-mt-2"> Click Me   </a>  </div>  <img src="https://example.com/image.jpg" alt="" class="su-w-1/2 sm:su-w-1/3 xl:su-w-1/4 su-shrink-0"/>  </div></div></section>"`);
        });
    });

    describe('[Edge Cases]', () => {
        it('Should render without image when none provided', async () => {
            const mockData = { ...defaultMockData };
            delete mockData.image;
            const result = await main(mockData, defaultMockInfo);

            expect(result).toContain('<section data-component="single-cta-block">');
            expect(result).not.toContain('img');
        });

        it('Should render card variant correctly', async () => {
            const mockData = { ...defaultMockData, isCard: true };
            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="single-cta-block"><div class="su-mx-auto su-component-container su-container-large su-rs-mt-0 su-rs-mb-0"><div class="su-flex su-flex-col-reverse xl:su-flex-row-reverse su-items-center su-justify-center su-gap-34 xl:su-gap-60 su-rounded-[8px] su-break-words su-text-black dark:su-text-white su-rs-py-8 su-rs-px-4 su-border dark:su-border-2 su-border-black-30/30 dark:su-border-black su-shadow dark:su-shadow-black/80 su-bg-white dark:su-bg-black-true su-rs-py-4"><div class="su-flex su-flex-col">  <span aria-hidden="true" class="su-block su-mx-auto su-mb-02em su-text-center su-text-black-60 dark:su-text-black-40 su-font-semibold su-type-1 su-leading-display su-type-0"> Test Eyebrow </span>   <div class="su-mx-auto xl:su-max-w-900 su-flex su-flex-col md:su-flex-row su-gap-20 su-items-center su-rs-mb-2"><div aria-hidden="true" class="su-relative md:su-top-06em su-hidden su-min-w-100 md:su-block su-grow su-shrink-0 su-h-4 su-bg-gradient-to-r su-from-digital-red-light su-to-digital-red-dark dark:su-from-palo-verde dark:su-to-olive su-w-auto"></div><h2 class="su-mx-auto su-text-center su-leading-tight dark:su-text-white su-mb-0 su-type-3">  <span class="su-sr-only">Test Eyebrow: </span>  Test Title </h2><div aria-hidden="true" class="su-relative md:su-top-06em su-mx-auto su-min-w-100 su-grow su-shrink-0 su-w-180 su-h-4 su-bg-gradient-to-l su-from-digital-red-light su-to-digital-red-dark dark:su-from-palo-verde dark:su-to-olive md:su-w-auto su-mb-20 md:su-mb-0"></div></div>  <div data-test="single-text-block-content" class="su-mx-auto su-text-center su-max-w-prose-wide *:su-leading-snug last:*:su-mb-0 dark:su-text-white su-text-18  xl:su-text-left"> Test Description </div>  <a href="https://example.com" class="su-group su-flex su-items-center su-w-fit hocus:su-underline su-px-30 su-pt-12 su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-text-white hocus:su-text-white su-no-underline hocus:su-underline su-bg-gradient-to-r su-from-digital-red-light su-to-cardinal-red-dark hocus:su-bg-none hocus:su-bg-black dark:su-from-olive dark:su-to-palo-verde dark:su-text-black-true dark:hocus:su-text-white dark:hocus:su-ring-white su-mx-auto su-rs-mt-2"> Click Me   </a>  </div>  <img src="https://example.com/image.jpg" alt="" class="su-w-1/2 sm:su-w-1/3 xl:su-w-1/4 su-shrink-0"/>  </div></div></section>"`);
        });

        it('Should render external link CTA correctly when linkData is undefined', async () => {
            basicAssetUri.mockResolvedValueOnce(undefined);
            
            const result = await main(defaultMockData, defaultMockInfo);
            expect(result).toMatchInlineSnapshot(`"<section data-component="single-cta-block"><div class="su-mx-auto su-component-container su-container-large su-rs-mt-0 su-rs-mb-0"><div class="su-flex su-flex-col-reverse xl:su-flex-row-reverse su-items-center su-justify-center su-gap-34 xl:su-gap-60 su-rounded-[8px] su-break-words su-text-black dark:su-text-white su-rs-py-8 su-rs-px-4 su-border dark:su-border-2 su-border-black-30/30 dark:su-border-black su-shadow dark:su-shadow-black/80 su-bg-white dark:su-bg-black-true su-rs-py-4"><div class="su-flex su-flex-col">  <span aria-hidden="true" class="su-block su-mx-auto su-mb-02em su-text-center su-text-black-60 dark:su-text-black-40 su-font-semibold su-type-1 su-leading-display su-type-0"> Test Eyebrow </span>   <div class="su-mx-auto xl:su-max-w-900 su-flex su-flex-col md:su-flex-row su-gap-20 su-items-center su-rs-mb-2"><div aria-hidden="true" class="su-relative md:su-top-06em su-hidden su-min-w-100 md:su-block su-grow su-shrink-0 su-h-4 su-bg-gradient-to-r su-from-digital-red-light su-to-digital-red-dark dark:su-from-palo-verde dark:su-to-olive su-w-auto"></div><h2 class="su-mx-auto su-text-center su-leading-tight dark:su-text-white su-mb-0 su-type-3">  <span class="su-sr-only">Test Eyebrow: </span>  Test Title </h2><div aria-hidden="true" class="su-relative md:su-top-06em su-mx-auto su-min-w-100 su-grow su-shrink-0 su-w-180 su-h-4 su-bg-gradient-to-l su-from-digital-red-light su-to-digital-red-dark dark:su-from-palo-verde dark:su-to-olive md:su-w-auto su-mb-20 md:su-mb-0"></div></div>  <div data-test="single-text-block-content" class="su-mx-auto su-text-center su-max-w-prose-wide *:su-leading-snug last:*:su-mb-0 dark:su-text-white su-text-18 "> Test Description </div>  <a href="https://example.com" class="su-group su-flex su-items-center su-w-fit hocus:su-underline su-px-30 su-pt-12 su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-text-white hocus:su-text-white su-no-underline hocus:su-underline su-bg-gradient-to-r su-from-digital-red-light su-to-cardinal-red-dark hocus:su-bg-none hocus:su-bg-black dark:su-from-olive dark:su-to-palo-verde dark:su-text-black-true dark:hocus:su-text-white dark:hocus:su-ring-white su-mx-auto su-rs-mt-2"> Click Me   </a>  </div>  </div></div></section>"`);
        });
    });

    describe('[Internal URL Resolution]', () => {
        it('Should resolve internal URL when provided', async () => {
            basicAssetUri.mockResolvedValueOnce({
                url: 'https://resolved-internal-path.com',
                attributes: {}
            });

            const mockData = {
                ...defaultMockData, 
                ctaConfiguration: { 
                    ...defaultMockData.ctaConfiguration, 
                    internalUrl:'/internal/path' 
                }
            };
            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="single-cta-block"><div class="su-mx-auto su-component-container su-container-large su-rs-mt-0 su-rs-mb-0"><div class="su-flex su-flex-col-reverse xl:su-flex-row-reverse su-items-center su-justify-center su-gap-34 xl:su-gap-60 su-rounded-[8px] su-break-words su-text-black dark:su-text-white su-rs-py-8 su-rs-px-4 su-border dark:su-border-2 su-border-black-30/30 dark:su-border-black su-shadow dark:su-shadow-black/80 su-bg-white dark:su-bg-black-true su-rs-py-4"><div class="su-flex su-flex-col">  <span aria-hidden="true" class="su-block su-mx-auto su-mb-02em su-text-center su-text-black-60 dark:su-text-black-40 su-font-semibold su-type-1 su-leading-display su-type-0"> Test Eyebrow </span>   <div class="su-mx-auto xl:su-max-w-900 su-flex su-flex-col md:su-flex-row su-gap-20 su-items-center su-rs-mb-2"><div aria-hidden="true" class="su-relative md:su-top-06em su-hidden su-min-w-100 md:su-block su-grow su-shrink-0 su-h-4 su-bg-gradient-to-r su-from-digital-red-light su-to-digital-red-dark dark:su-from-palo-verde dark:su-to-olive su-w-auto"></div><h2 class="su-mx-auto su-text-center su-leading-tight dark:su-text-white su-mb-0 su-type-3">  <span class="su-sr-only">Test Eyebrow: </span>  Test Title </h2><div aria-hidden="true" class="su-relative md:su-top-06em su-mx-auto su-min-w-100 su-grow su-shrink-0 su-w-180 su-h-4 su-bg-gradient-to-l su-from-digital-red-light su-to-digital-red-dark dark:su-from-palo-verde dark:su-to-olive md:su-w-auto su-mb-20 md:su-mb-0"></div></div>  <div data-test="single-text-block-content" class="su-mx-auto su-text-center su-max-w-prose-wide *:su-leading-snug last:*:su-mb-0 dark:su-text-white su-text-18  xl:su-text-left"> Test Description </div>  <a href="https://example.com/image.jpg" class="su-group su-flex su-items-center su-w-fit hocus:su-underline su-px-30 su-pt-12 su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-text-white hocus:su-text-white su-no-underline hocus:su-underline su-bg-gradient-to-r su-from-digital-red-light su-to-cardinal-red-dark hocus:su-bg-none hocus:su-bg-black dark:su-from-olive dark:su-to-palo-verde dark:su-text-black-true dark:hocus:su-text-white dark:hocus:su-ring-white su-mx-auto su-rs-mt-2"> Click Me   </a>  </div>  <img src="https://resolved-internal-path.com" alt="" class="su-w-1/2 sm:su-w-1/3 xl:su-w-1/4 su-shrink-0"/>  </div></div></section>"`);
            expect(basicAssetUri).toHaveBeenCalledWith(defaultMockInfo.fns, '/internal/path');
            expect(basicAssetUri).toHaveBeenCalledTimes(2);
        });
  
        it('Should use external URL when no internal URL is provided', async () => {
            const mockData = { 
                ...defaultMockData, 
                ctaConfiguration: { 
                    ...defaultMockData.ctaConfiguration, 
                    externalUrl:'https://default-url.com' 
                }
            };
            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="single-cta-block"><div class="su-mx-auto su-component-container su-container-large su-rs-mt-0 su-rs-mb-0"><div class="su-flex su-flex-col-reverse xl:su-flex-row-reverse su-items-center su-justify-center su-gap-34 xl:su-gap-60 su-rounded-[8px] su-break-words su-text-black dark:su-text-white su-rs-py-8 su-rs-px-4 su-border dark:su-border-2 su-border-black-30/30 dark:su-border-black su-shadow dark:su-shadow-black/80 su-bg-white dark:su-bg-black-true su-rs-py-4"><div class="su-flex su-flex-col">  <span aria-hidden="true" class="su-block su-mx-auto su-mb-02em su-text-center su-text-black-60 dark:su-text-black-40 su-font-semibold su-type-1 su-leading-display su-type-0"> Test Eyebrow </span>   <div class="su-mx-auto xl:su-max-w-900 su-flex su-flex-col md:su-flex-row su-gap-20 su-items-center su-rs-mb-2"><div aria-hidden="true" class="su-relative md:su-top-06em su-hidden su-min-w-100 md:su-block su-grow su-shrink-0 su-h-4 su-bg-gradient-to-r su-from-digital-red-light su-to-digital-red-dark dark:su-from-palo-verde dark:su-to-olive su-w-auto"></div><h2 class="su-mx-auto su-text-center su-leading-tight dark:su-text-white su-mb-0 su-type-3">  <span class="su-sr-only">Test Eyebrow: </span>  Test Title </h2><div aria-hidden="true" class="su-relative md:su-top-06em su-mx-auto su-min-w-100 su-grow su-shrink-0 su-w-180 su-h-4 su-bg-gradient-to-l su-from-digital-red-light su-to-digital-red-dark dark:su-from-palo-verde dark:su-to-olive md:su-w-auto su-mb-20 md:su-mb-0"></div></div>  <div data-test="single-text-block-content" class="su-mx-auto su-text-center su-max-w-prose-wide *:su-leading-snug last:*:su-mb-0 dark:su-text-white su-text-18  xl:su-text-left"> Test Description </div>  <a href="https://default-url.com" class="su-group su-flex su-items-center su-w-fit hocus:su-underline su-px-30 su-pt-12 su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-text-white hocus:su-text-white su-no-underline hocus:su-underline su-bg-gradient-to-r su-from-digital-red-light su-to-cardinal-red-dark hocus:su-bg-none hocus:su-bg-black dark:su-from-olive dark:su-to-palo-verde dark:su-text-black-true dark:hocus:su-text-white dark:hocus:su-ring-white su-mx-auto su-rs-mt-2"> Click Me   </a>  </div>  <img src="https://example.com/image.jpg" alt="" class="su-w-1/2 sm:su-w-1/3 xl:su-w-1/4 su-shrink-0"/>  </div></div></section>"`);
        });
  });
});