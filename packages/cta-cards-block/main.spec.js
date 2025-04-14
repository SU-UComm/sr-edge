import { beforeEach, describe, expect, it, vi } from 'vitest';
import { basicAssetUri } from '../../global/js/utils';
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    basicAssetUri: vi.fn(),
    isRealExternalLink: vi.fn((url) => url.startsWith('http'))
}));

describe('[CTA Cards Block]', () => {
    const mockFnsCtx = {
        resolveUri: vi.fn(),
    };

    const defaultMockData = {
        cards: [
            {
                title: 'Default Card',
                eyebrow: 'Eyebrow Text',
                description: 'Description text goes here',
                linkDetails: {
                    internalUrl: '/internal-link',
                    externalUrl: undefined,
                }
            },
            {
                title: 'External Link Card',
                eyebrow: 'External Eyebrow',
                description: 'External Description',
                linkDetails: {
                    internalUrl: undefined,
                    externalUrl: 'https://external.com',
                }
            }
        ]
    };

    const defaultMockInfo = {
        fns: mockFnsCtx,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        basicAssetUri.mockResolvedValueOnce({
            url: 'https://example.com/internal-link',
        });
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters are provided.', async () => {
            const result = await main();
            
            expect(result).toBe(
                '<!-- Error occurred in the Cta cards block component: The "info.fns" cannot be undefined or null. The {} was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info was provided', async () => {
            const result = await main(defaultMockData);
           
            expect(result).toBe(
                '<!-- Error occurred in the Cta cards block component: The "info.fns" cannot be undefined or null. The {} was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fns or ctx is invalid', async () => {
            const mockInfo = { test: 'test' };
            
            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toBe(
                '<!-- Error occurred in the Cta cards block component: The "info.fns" cannot be undefined or null. The {} was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when cards array is missing', async () => {
            const mockData = {};
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toBe(
                '<!-- Error occurred in the Cta cards block component: The cards cannot be undefined or null. The undefined was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when cards array is empty', async () => {
            const mockData = { cards: [] };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toBe(
                '<!-- Error occurred in the Cta cards block component: The "cards" array cannot have less than 1 element. The 0 elements were received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when cards array is more then 3 items', async () => {
            const mockData = { cards: [...defaultMockData.cards, ...defaultMockData.cards] };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toBe(
                '<!-- Error occurred in the Cta cards block component: The "cards" array cannot have more than 3 elements. The 4 elements were received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        it('Should return the expected HTML with valid data', async () => {
            const result = await main(defaultMockData, defaultMockInfo);
            
            expect(result).toMatchInlineSnapshot(`"<section data-component="cta-cards-block"><div class="su-relative su-cc su-flex su-grid-gap su-flex-col 2xl:su-flex-row"><article aria-label="Default Card" class="su-group su-relative su-w-full su-flex su-flex-col su-break-words su-rounded-[8px] su-rs-pt-5 su-rs-px-4 su-max-w-900 su-mx-auto su-transition-shadow su-border dark:su-border-2 su-border-black-30/30 dark:su-border-black su-shadow dark:su-shadow-black/80 su-bg-white dark:su-bg-black-true su-text-black dark:su-text-white hover:su-shadow-md focus-within:su-shadow-md su-rs-pb-4"><span aria-hidden="true" class="su-type-1 su-text-black-60 su-font-semibold su-rs-mb-1">Eyebrow Text</span><h3 class="su-type-5 md:su-type-4 2xl:su-type-3 su-mb-0 su-font-sans su-text-black dark:su-text-white"><a href="https://example.com/internal-link" class="group-hocus-within:su-underline su-stretched-link su-text-black dark:su-text-white group-hocus-within:su-text-digital-red dark:group-hocus-within:su-text-digital-red-light"><span class="su-sr-only">Eyebrow Text:</span>Default Card</a></h3><div class="su-grow"><div data-test="cta-card-content" class="su-text-black dark:su-text-white su-big-paragraph su-rs-mt-4 *:su-leading-snug *:last:su-mb-0">Description text goes here</div></div><div class="su-mt-auto"><div class="su-flex su-rs-mt-1 su-transition-transform su-items-center su-justify-center su-size-50 md:su-size-70 su-rounded-full su-bg-gradient-to-r su-from-digital-red-light su-to-cardinal-red-dark dark:su-from-olive dark:su-to-palo-verde su-ml-auto group-hocus-within:su-translate-x-03em"><svg class='su-fill-transparent su-stroke-current su-inline-block su-w-22 md:su-w-36 su-text-white dark:su-text-black-true *:su-stroke-3' data-testid='svg-chevron-right' xmlns='http://www.w3.org/2000/svg'   viewBox='0 0 18 19' fill='none' aria-hidden='true'><path d='M6.75 4.25L12 9.5L6.75 14.75' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' /></svg></div></div></article><article aria-label="External Link Card" class="su-group su-relative su-w-full su-flex su-flex-col su-break-words su-rounded-[8px] su-rs-pt-5 su-rs-px-4 su-max-w-900 su-mx-auto su-transition-shadow su-border dark:su-border-2 su-border-black-30/30 dark:su-border-black su-shadow dark:su-shadow-black/80 su-bg-white dark:su-bg-black-true su-text-black dark:su-text-white hover:su-shadow-md focus-within:su-shadow-md su-rs-pb-4"><span aria-hidden="true" class="su-type-1 su-text-black-60 su-font-semibold su-rs-mb-1">External Eyebrow</span><h3 class="su-type-5 md:su-type-4 2xl:su-type-3 su-mb-0 su-font-sans su-text-black dark:su-text-white"><a href="https://external.com" rel="noopener nofollow" class="group-hocus-within:su-underline su-stretched-link su-text-black dark:su-text-white group-hocus-within:su-text-digital-red dark:group-hocus-within:su-text-digital-red-light"><span class="su-sr-only">External Eyebrow:</span>External Link Card<span class="su-sr-only">(link is external)</span></a></h3><div class="su-grow"><div data-test="cta-card-content" class="su-text-black dark:su-text-white su-big-paragraph su-rs-mt-4 *:su-leading-snug *:last:su-mb-0">External Description</div></div><div class="su-mt-auto"><div class="su-flex su-rs-mt-1 su-transition-transform su-items-center su-justify-center su-size-50 md:su-size-70 su-rounded-full su-bg-gradient-to-r su-from-digital-red-light su-to-cardinal-red-dark dark:su-from-olive dark:su-to-palo-verde su-ml-auto group-hocus-within:su-translate-x-02em group-hocus-within:su--translate-y-02em"><svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='3' stroke='currentColor' aria-hidden='true' class='su-inline-block su-w-20 md:su-w-30 su-text-white dark:su-text-black-true *:su-stroke-3'><path stroke-linecap='round' stroke-linejoin='round' d='m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25' /></svg></div></div></article></div></section>"`);
        });

        it('Should handle single cards correctly', async () => {
            const mockData = {
                cards: [
                    {
                        title: 'Default Card',
                        eyebrow: 'Eyebrow Text',
                        description: 'Description text goes here',
                        linkDetails: {
                            internalUrl: '/internal-link',
                            externalUrl: undefined,
                        }
                    }
                ]
            }

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toMatchInlineSnapshot(`"<section data-component="cta-cards-block"><div class="su-relative su-cc su-flex su-grid-gap su-flex-col 2xl:su-flex-row"><article aria-label="Default Card" class="su-group su-relative su-w-full su-flex su-flex-col su-break-words su-rounded-[8px] su-rs-pt-5 su-rs-px-4 su-max-w-900 su-mx-auto su-transition-shadow su-border dark:su-border-2 su-border-black-30/30 dark:su-border-black su-shadow dark:su-shadow-black/80 su-bg-white dark:su-bg-black-true su-text-black dark:su-text-white hover:su-shadow-md focus-within:su-shadow-md su-rs-pb-4"><span aria-hidden="true" class="su-type-1 su-text-black-60 su-font-semibold su-rs-mb-1">Eyebrow Text</span><h3 class="su-type-5 md:su-type-4 2xl:su-type-3 su-mb-0 su-font-sans su-text-black dark:su-text-white"><a href="https://example.com/internal-link" class="group-hocus-within:su-underline su-stretched-link su-text-black dark:su-text-white group-hocus-within:su-text-digital-red dark:group-hocus-within:su-text-digital-red-light"><span class="su-sr-only">Eyebrow Text:</span>Default Card</a></h3><div class="su-grow"><div data-test="cta-card-content" class="su-text-black dark:su-text-white su-big-paragraph su-rs-mt-4 *:su-leading-snug *:last:su-mb-0">Description text goes here</div></div><div class="su-mt-auto"><div class="su-flex su-rs-mt-1 su-transition-transform su-items-center su-justify-center su-size-50 md:su-size-70 su-rounded-full su-bg-gradient-to-r su-from-digital-red-light su-to-cardinal-red-dark dark:su-from-olive dark:su-to-palo-verde su-ml-auto group-hocus-within:su-translate-x-03em"><svg class='su-fill-transparent su-stroke-current su-inline-block su-w-22 md:su-w-36 su-text-white dark:su-text-black-true *:su-stroke-3' data-testid='svg-chevron-right' xmlns='http://www.w3.org/2000/svg'   viewBox='0 0 18 19' fill='none' aria-hidden='true'><path d='M6.75 4.25L12 9.5L6.75 14.75' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' /></svg></div></div></article></div></section>"`);
        });

        it('Should handle card without linkDetails', async () => {
            const mockData = {
                cards: [
                    {
                        title: 'Default Card',
                        eyebrow: 'Eyebrow Text',
                        description: 'Description text goes here',
                    }
                ]
            }

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toMatchInlineSnapshot(`"<section data-component="cta-cards-block"><div class="su-relative su-cc su-flex su-grid-gap su-flex-col 2xl:su-flex-row"><article aria-label="Default Card" class="su-group su-relative su-w-full su-flex su-flex-col su-break-words su-rounded-[8px] su-rs-pt-5 su-rs-px-4 su-max-w-900 su-mx-auto su-transition-shadow su-border dark:su-border-2 su-border-black-30/30 dark:su-border-black su-shadow dark:su-shadow-black/80 su-bg-white dark:su-bg-black-true su-text-black dark:su-text-white su-rs-pb-5"><span aria-hidden="true" class="su-type-1 su-text-black-60 su-font-semibold su-rs-mb-1">Eyebrow Text</span><h3 class="su-type-5 md:su-type-4 2xl:su-type-3 su-mb-0 su-font-sans su-text-black dark:su-text-white"><span class="su-sr-only">Eyebrow Text:</span>Default Card</h3><div class="su-grow"><div data-test="cta-card-content" class="su-text-black dark:su-text-white su-big-paragraph su-rs-mt-4 *:su-leading-snug *:last:su-mb-0">Description text goes here</div></div></article></div></section>"`);
        });
    });

    describe('[Data Validation]', () => {
        it('Should throw an error when data is undefined', async () => {
            // Mock Promise.all to return undefined
            const mockPromiseAll = vi.spyOn(Promise, 'all').mockResolvedValueOnce(undefined);
            
            const result = await main(defaultMockData, defaultMockInfo);
            
            expect(result).toBe(
                '<!-- Error occurred in the CTA cards block component: The "data" cannot be undefined or null. The undefined was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
            expect(mockedError).toHaveBeenCalledWith('Error occurred in the CTA cards block component: ', expect.any(Error)
            );
            
            mockPromiseAll.mockRestore();
        });
    
        it('Should throw an error when data array is empty', async () => {
            // Mock Promise.all to return empty array
            const mockPromiseAll = vi.spyOn(Promise, 'all').mockResolvedValueOnce([]);
            
            const result = await main(defaultMockData, defaultMockInfo);
            
            expect(result).toBe(
                '<!-- Error occurred in the CTA cards block component: The "data" cannot be undefined or null. The [] was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
            expect(mockedError).toHaveBeenCalledWith(
                'Error occurred in the CTA cards block component: ',
                expect.any(Error)
            );
            
            mockPromiseAll.mockRestore();
        });
    
        it('Should throw an error when data is not an object', async () => {
            // Mock Promise.all to return string
            const mockPromiseAll = vi.spyOn(Promise, 'all').mockResolvedValueOnce('invalid');
            
            const result = await main(defaultMockData, defaultMockInfo);
            
            expect(result).toBe(
                '<!-- Error occurred in the CTA cards block component: The "data" cannot be undefined or null. The "invalid" was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
            expect(mockedError).toHaveBeenCalledWith(
                'Error occurred in the CTA cards block component: ',
                expect.any(Error)
            );
            
            mockPromiseAll.mockRestore();
        });
    });
});