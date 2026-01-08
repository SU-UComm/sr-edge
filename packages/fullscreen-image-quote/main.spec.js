import { expect, describe, it, vi, beforeEach } from 'vitest';
import { basicAssetUri, isRealExternalLink } from '../../global/js/utils';

import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    basicAssetUri: vi.fn(),
    uuid: vi.fn(),
    isRealExternalLink: vi.fn((url) => typeof url === 'string' && url.startsWith('http'))
}));

describe('Fullscreen Image Quote Component', () => {
    const mockFnsCtx = {
        resolveUri: vi.fn(),
    };
    
    const defaultMockData = {
        image: 'test-image-uri',
        quote: 'Test quote',
        quoteHAlign: 'left',
        quoteVAlign: 'center',
        imageVPosition: 'center',
        mobileImage: 'test-mobile-uri',
        removeTopSpacing: false,
        ctaDetails: {
            ctaPreText: 'Meet',
            ctaText: 'Jane Stanford',
            ctaSubtext: "'21, international student",
            internalUrl: 'test-internal-uri',
            externalUrl: 'https://example.com',
            isNewWindow: true
        }
    };

    const defaultMockInfo = {
        fns: mockFnsCtx
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // No specific error handling/outer checks, this component always outputs HTML
    
    describe('[Main Function]', () => {
        beforeEach(() => {
            basicAssetUri.mockResolvedValue({
                url: 'https://example.com/internal-link',
            });
        });
      
        it('Should render proper HTML with valid data', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="fullscreen-image-quote"><div class="su-aspect-w-1 su-aspect-h-2 sm:su-aspect-w-3 sm:su-aspect-h-4 lg:su-aspect-h-2 2xl:su-aspect-w-2 2xl:su-aspect-h-1 su-bg-black-true su-text-white "><div class="su-absolute su-z-20 su-h-full su-inset-0 su-flex su-items-end su-p-20 lg:su-items-center"><blockquote class="su-py-17 sm:su-py-[6.8rem] xl:su-py-100 2xl:su-py-140 su-cc lg:su-max-w-[50%] su-ml-0 su-mr-auto lg:su-pr-0"><p class="su-font-serif su-text-22 md:su-text-[3.3rem] lg:su-text-24 xl:su-text-[2.8rem] 2xl:su-text-[3.3rem] su-leading-display su-max-w-[55rem] xl:su-max-w-600 su-mb-0 su-whitespace-pre-line" su-text-shadow-[-3px_3px_5px_rgba(0,0,0,0.33)] data-se="quote">Test quote</p><div class="su-rs-mt-1 su-max-w-[55rem] xl:su-max-w-600 su-text-shadow-[-3px_3px_5px_rgba(0,0,0,0.33)]"><span class="su-inline su-text-22 md:su-text-[2.9rem] lg:su-text-24 2xl:su-text-[2.9rem] su-font-bold su-leading-display su-mr-02em" data-se="ctaPreText">Meet</span><a href="https://example.com" target="_blank" rel="noopener nofollow" class="su-group su-inline su-text-22 md:su-text-[2.9rem] lg:su-text-24 2xl:su-text-[2.9rem] su-font-bold su-leading-display su-text-white dark:su-text-white su-underline su-decoration-dark-mode-red su-underline-offset-4 su-decoration-[3px] hocus:su-decoration-white hocus:su-text-white dark:hocus:su-text-white su-transition-all"><span data-se="ctaText">Jane Stanford</span><span class="su-whitespace-nowrap"><svg aria-hidden="true" focusable="false" data-testid=svg-arrow-up data-prefix="fas" data-icon="arrow-up" class="svg-inline--fa fa-arrow-up su-ml-04em su-text-[0.75em] su-transition-transform su-text-dark-mode-red group-hocus:su-text-white su-rotate-45 group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="18" ><path fill="currentColor" d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2 160 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-306.7L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"></path></svg></span></a><div class="su-card-paragraph su-leading-display su-mt-9" data-se="ctaSubtext">&#x27;21, international student</div></div></blockquote></div><img src="https://example.com/internal-link" alt="" class="su-object-cover su-w-full su-h-full su-p-20 lg:su-hidden" /><img src="https://example.com/internal-link" alt="" class="su-object-cover su-w-full su-h-full su-p-20 su-hidden lg:su-block su-object-center" /><div aria-hidden="true" class="su-absolute su-inset-0 su-z-10 su-bg-gradient-to-t su-from-black-true  su-to-black-true/0 su-to-70% lg:su-to-60% lg:su-bg-gradient-to-r"></div></div></section>"`);
        });

        it('Should render proper HTML without external link', async () => {
            const mockData = {
                ...defaultMockData,
                ctaDetails: {
                    ...defaultMockData.ctaDetails,
                    externalUrl: undefined
                }
            }
            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="fullscreen-image-quote"><div class="su-aspect-w-1 su-aspect-h-2 sm:su-aspect-w-3 sm:su-aspect-h-4 lg:su-aspect-h-2 2xl:su-aspect-w-2 2xl:su-aspect-h-1 su-bg-black-true su-text-white "><div class="su-absolute su-z-20 su-h-full su-inset-0 su-flex su-items-end su-p-20 lg:su-items-center"><blockquote class="su-py-17 sm:su-py-[6.8rem] xl:su-py-100 2xl:su-py-140 su-cc lg:su-max-w-[50%] su-ml-0 su-mr-auto lg:su-pr-0"><p class="su-font-serif su-text-22 md:su-text-[3.3rem] lg:su-text-24 xl:su-text-[2.8rem] 2xl:su-text-[3.3rem] su-leading-display su-max-w-[55rem] xl:su-max-w-600 su-mb-0 su-whitespace-pre-line" su-text-shadow-[-3px_3px_5px_rgba(0,0,0,0.33)] data-se="quote">Test quote</p><div class="su-rs-mt-1 su-max-w-[55rem] xl:su-max-w-600 su-text-shadow-[-3px_3px_5px_rgba(0,0,0,0.33)]"><span class="su-inline su-text-22 md:su-text-[2.9rem] lg:su-text-24 2xl:su-text-[2.9rem] su-font-bold su-leading-display su-mr-02em" data-se="ctaPreText">Meet</span><a href="https://example.com/internal-link" target="_blank"  class="su-group su-inline su-text-22 md:su-text-[2.9rem] lg:su-text-24 2xl:su-text-[2.9rem] su-font-bold su-leading-display su-text-white dark:su-text-white su-underline su-decoration-dark-mode-red su-underline-offset-4 su-decoration-[3px] hocus:su-decoration-white hocus:su-text-white dark:hocus:su-text-white su-transition-all"><span data-se="ctaText">Jane Stanford</span><span class="su-whitespace-nowrap"><svg aria-hidden="true" focusable="false" data-testid=svg-chevron-right data-prefix="fas" data-icon="chevron-right" class="svg-inline--fa fa-chevron-right su-ml-04em su-text-[0.75em] su-transition-transform su-text-dark-mode-red group-hocus:su-text-white group-hocus:su-translate-x-02em" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="18" ><path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path></svg></span></a><div class="su-card-paragraph su-leading-display su-mt-9" data-se="ctaSubtext">&#x27;21, international student</div></div></blockquote></div><img src="https://example.com/internal-link" alt="" class="su-object-cover su-w-full su-h-full su-p-20 lg:su-hidden" /><img src="https://example.com/internal-link" alt="" class="su-object-cover su-w-full su-h-full su-p-20 su-hidden lg:su-block su-object-center" /><div aria-hidden="true" class="su-absolute su-inset-0 su-z-10 su-bg-gradient-to-t su-from-black-true  su-to-black-true/0 su-to-70% lg:su-to-60% lg:su-bg-gradient-to-r"></div></div></section>"`);
        });
    });

    describe('[Edge cases]', () => {
        beforeEach(() => {
            basicAssetUri.mockResolvedValue({});
            isRealExternalLink.mockResolvedValue(false);
        });
      
        it('Should render proper HTML when basicAssetUri returns empty object', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="fullscreen-image-quote"><div class="su-aspect-w-1 su-aspect-h-2 sm:su-aspect-w-3 sm:su-aspect-h-4 lg:su-aspect-h-2 2xl:su-aspect-w-2 2xl:su-aspect-h-1 su-bg-black-true su-text-white "><div class="su-absolute su-z-20 su-h-full su-inset-0 su-flex su-items-end su-p-20 lg:su-items-center"><blockquote class="su-py-17 sm:su-py-[6.8rem] xl:su-py-100 2xl:su-py-140 su-cc lg:su-max-w-[50%] su-ml-0 su-mr-auto lg:su-pr-0"><p class="su-font-serif su-text-22 md:su-text-[3.3rem] lg:su-text-24 xl:su-text-[2.8rem] 2xl:su-text-[3.3rem] su-leading-display su-max-w-[55rem] xl:su-max-w-600 su-mb-0 su-whitespace-pre-line" su-text-shadow-[-3px_3px_5px_rgba(0,0,0,0.33)] data-se="quote">Test quote</p><div class="su-rs-mt-1 su-max-w-[55rem] xl:su-max-w-600 su-text-shadow-[-3px_3px_5px_rgba(0,0,0,0.33)]"><span class="su-inline su-text-22 md:su-text-[2.9rem] lg:su-text-24 2xl:su-text-[2.9rem] su-font-bold su-leading-display su-mr-02em" data-se="ctaPreText">Meet</span><a href="https://example.com" target="_blank" rel="noopener nofollow" class="su-group su-inline su-text-22 md:su-text-[2.9rem] lg:su-text-24 2xl:su-text-[2.9rem] su-font-bold su-leading-display su-text-white dark:su-text-white su-underline su-decoration-dark-mode-red su-underline-offset-4 su-decoration-[3px] hocus:su-decoration-white hocus:su-text-white dark:hocus:su-text-white su-transition-all"><span data-se="ctaText">Jane Stanford</span><span class="su-whitespace-nowrap"><svg aria-hidden="true" focusable="false" data-testid=svg-arrow-up data-prefix="fas" data-icon="arrow-up" class="svg-inline--fa fa-arrow-up su-ml-04em su-text-[0.75em] su-transition-transform su-text-dark-mode-red group-hocus:su-text-white su-rotate-45 group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="18" ><path fill="currentColor" d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2 160 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-306.7L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"></path></svg></span></a><div class="su-card-paragraph su-leading-display su-mt-9" data-se="ctaSubtext">&#x27;21, international student</div></div></blockquote></div><div aria-hidden="true" class="su-absolute su-inset-0 su-z-10 su-bg-gradient-to-t su-from-black-true  su-to-black-true/0 su-to-70% lg:su-to-60% lg:su-bg-gradient-to-r"></div></div></section>"`);
        });
    });
});
