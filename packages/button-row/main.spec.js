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

describe('[ButtonRow]', () => {
    const mockFnsCtx = {
        resolveUri: vi.fn(),
    };
    const defaultButtons = [
        {
            buttonText: 'Primary Button',
            internalUrl: '/primary-link',
            externalUrl: undefined,
            isNewWindow: false,
        },
        {
            buttonText: 'External Link',
            internalUrl: undefined,
            externalUrl: 'https://external.com',
            isNewWindow: true,
        }
    ];
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
                '<!-- Error occurred in the Button Row component: The "info.fns" cannot be undefined or null. The {} was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info was provided', async () => {
            const result = await main(defaultButtons);
            expect(result).toBe(
                '<!-- Error occurred in the Button Row component: The "info.fns" cannot be undefined or null. The {} was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fns or ctx is invalid', async () => {
            const mockInfo = { test: 'test' };
            const result = await main(defaultButtons, mockInfo);
            expect(result).toBe(
                '<!-- Error occurred in the Button Row component: The "info.fns" cannot be undefined or null. The {} was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when buttons array is missing', async () => {
            const mockData = {};
            const result = await main(mockData, defaultMockInfo);
            expect(result).toBe(
                '<!-- Error occurred in the Button Row component: The "buttons" field must be a non-empty array. The undefined was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when buttons array is empty', async () => {
            const mockData = { buttons: [] };
            const result = await main(mockData, defaultMockInfo);
            expect(result).toBe(
                '<!-- Error occurred in the Button Row component: The "buttons" field must be a non-empty array. The [] was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        it('Should render button row with internal URLs', async () => {
            const mockButtons = [{
                buttonText: 'Internal Link',
                internalUrl: '/internal-link',
            }];
            const result = await main({ buttons: mockButtons }, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="button-row">
               <div class="su-mx-auto su-component-container  su-container-px">
               <div class="su-flex su-flex-wrap su-justify-center su-gap-x-18 md:su-gap-x-27 su-gap-y-12 su-mx-auto su-w-fit">
                <a href="https://example.com/internal-link" class="su-group su-flex su-items-center su-w-fit hocus:su-underline md:su-px-30 md:su-pt-12 md:su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-button dark:hocus:su-ring-white"> Internal Link    </a>  </div>
               </div>
              </section>

              "
            `);
        });

        it('Should handle external links correctly', async () => {
            const mockButtons = [{
                buttonText: 'External Link',
                externalUrl: 'https://external.com',
                isNewWindow: true,
            }];
            const result = await main({ buttons: mockButtons }, defaultMockInfo);
            
            expect(result).toMatchInlineSnapshot(`
              "<section data-component="button-row">
               <div class="su-mx-auto su-component-container  su-container-px">
               <div class="su-flex su-flex-wrap su-justify-center su-gap-x-18 md:su-gap-x-27 su-gap-y-12 su-mx-auto su-w-fit">
                <a href="https://external.com" target="_blank" rel="noopener nofollow" class="su-group su-flex su-items-center su-w-fit hocus:su-underline md:su-px-30 md:su-pt-12 md:su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-button dark:hocus:su-ring-white"> External Link  <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up" class="svg-inline--fa fa-arrow-up fa-fw su-inline-block su-shrink-0 su-text-white group-hocus:su-text-white su-text-[0.9em] su-ml-04em su-transition-transform su-rotate-45 group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20"> <path fill="currentColor" d="M209.4 39.4C204.8 34.7 198.6 32 192 32s-12.8 2.7-17.4 7.4l-168 176c-9.2 9.6-8.8 24.8 .8 33.9s24.8 8.8 33.9-.8L168 115.9 168 456c0 13.3 10.7 24 24 24s24-10.7 24-24l0-340.1L342.6 248.6c9.2 9.6 24.3 9.9 33.9 .8s9.9-24.3 .8-33.9l-168-176z"></path> </svg>    </a>  </div>
               </div>
              </section>

              "
            `);
        });

        it('Should handle multiple buttons correctly', async () => {
            const result = await main({ buttons: defaultButtons }, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="button-row">
               <div class="su-mx-auto su-component-container  su-container-px">
               <div class="su-flex su-flex-wrap su-justify-center su-gap-x-18 md:su-gap-x-27 su-gap-y-12 su-mx-auto su-w-fit">
                <a href="https://example.com/internal-link" class="su-group su-flex su-items-center su-w-fit hocus:su-underline md:su-px-30 md:su-pt-12 md:su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-button dark:hocus:su-ring-white"> Primary Button    </a>   <a href="https://external.com" target="_blank" rel="noopener nofollow" class="su-group su-flex su-items-center su-w-fit hocus:su-underline md:su-px-30 md:su-pt-12 md:su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-button dark:hocus:su-ring-white"> External Link  <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up" class="svg-inline--fa fa-arrow-up fa-fw su-inline-block su-shrink-0 su-text-white group-hocus:su-text-white su-text-[0.9em] su-ml-04em su-transition-transform su-rotate-45 group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20"> <path fill="currentColor" d="M209.4 39.4C204.8 34.7 198.6 32 192 32s-12.8 2.7-17.4 7.4l-168 176c-9.2 9.6-8.8 24.8 .8 33.9s24.8 8.8 33.9-.8L168 115.9 168 456c0 13.3 10.7 24 24 24s24-10.7 24-24l0-340.1L342.6 248.6c9.2 9.6 24.3 9.9 33.9 .8s9.9-24.3 .8-33.9l-168-176z"></path> </svg>    </a>  </div>
               </div>
              </section>

              "
            `);
        });

        it('Should handle no URL buttons correctly', async () => {
            const mockButtons = [
                ...defaultButtons,
                {
                    buttonText: 'External Link',
                    internalUrl: '',
                    externalUrl: '',
                    isNewWindow: true,
                }
            ]           

            const result = await main({ buttons: mockButtons }, defaultMockInfo);
            
            expect(result).toMatchInlineSnapshot(`
              "<section data-component="button-row">
               <div class="su-mx-auto su-component-container  su-container-px">
               <div class="su-flex su-flex-wrap su-justify-center su-gap-x-18 md:su-gap-x-27 su-gap-y-12 su-mx-auto su-w-fit">
                <a href="https://example.com/internal-link" class="su-group su-flex su-items-center su-w-fit hocus:su-underline md:su-px-30 md:su-pt-12 md:su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-button dark:hocus:su-ring-white"> Primary Button    </a>   <a href="https://external.com" target="_blank" rel="noopener nofollow" class="su-group su-flex su-items-center su-w-fit hocus:su-underline md:su-px-30 md:su-pt-12 md:su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-button dark:hocus:su-ring-white"> External Link  <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up" class="svg-inline--fa fa-arrow-up fa-fw su-inline-block su-shrink-0 su-text-white group-hocus:su-text-white su-text-[0.9em] su-ml-04em su-transition-transform su-rotate-45 group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20"> <path fill="currentColor" d="M209.4 39.4C204.8 34.7 198.6 32 192 32s-12.8 2.7-17.4 7.4l-168 176c-9.2 9.6-8.8 24.8 .8 33.9s24.8 8.8 33.9-.8L168 115.9 168 456c0 13.3 10.7 24 24 24s24-10.7 24-24l0-340.1L342.6 248.6c9.2 9.6 24.3 9.9 33.9 .8s9.9-24.3 .8-33.9l-168-176z"></path> </svg>    </a>  </div>
               </div>
              </section>

              "
            `);
        });
    });
});