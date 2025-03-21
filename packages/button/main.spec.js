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

describe('[Button]', () => {
    const mockFnsCtx = {
        resolveUri: vi.fn(),
    };
    const defaultMockData = {
        buttonText: 'Button Text',
        internalUrl: '/internal-link',
        externalUrl: 'https://external.com',
        isNewWindow: true,
    };
    const defaultMockInfo = {
        fns: mockFnsCtx,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters are provided.', async () => {
            const result = await main();
            expect(result).toBe(
                '<!-- Error occurred in the Button component: The "info.fns" cannot be undefined or null. The {} was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info was provided', async () => {
            const result = await main(defaultMockData);
            expect(result).toBe(
                '<!-- Error occurred in the Button component: The "info.fns" cannot be undefined or null. The {} was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fns or ctx is invalid', async () => {
            const mockInfo = { test: 'test' };
            const result = await main(defaultMockData, mockInfo);
            expect(result).toBe(
                '<!-- Error occurred in the Button component: The "info.fns" cannot be undefined or null. The {} was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when buttonText is not a string', async () => {
            const mockData = { ...defaultMockData, buttonText: [1,2,3] };
            const result = await main(mockData, defaultMockInfo);
            expect(result).toBe(
                '<!-- Error occurred in the Button component: The "buttonText" field must be a string. The [1,2,3] was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when internalUrl is not a string', async () => {
            const mockData = { ...defaultMockData, internalUrl: 123 };
            const result = await main(mockData, defaultMockInfo);
            expect(result).toBe(
                '<!-- Error occurred in the Button component: The "internalUrl" field must be a string. The 123 was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when externalUrl is not a string', async () => {
            const mockData = { ...defaultMockData, externalUrl: {} };
            const result = await main(mockData, defaultMockInfo);
            expect(result).toBe(
                '<!-- Error occurred in the Button component: The "externalUrl" field must be a string. The {} was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when isNewWindow was not a boolean', async () => {
            const mockData = {
                ...defaultMockData,
                isNewWindow: 'yes'
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toBe('<!-- Error occurred in the Button component: The "isNewWindow" field must be a boolean. The "yes" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when button URL is an empty string', async () => {
            const mockData = { 
                ...defaultMockData, 
                internalUrl: '',
                externalUrl: ''
            };
            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe(
                '<!-- Error occurred in the Button component: The URL of button must be a non-empty string. The "" was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

    });

    describe('[Main Function]', () => {
        beforeEach(() => {
          basicAssetUri.mockResolvedValueOnce({
            url: 'https://example.com/internal-link',
          });
        });
      
        it('Should render button with internal URL', async () => {
            const mockData = { 
                ...defaultMockData,
                externalUrl: undefined,
                isNewWindow: undefined,
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="button">
               <div class="su-mx-auto su-component-container su-container-large su-container-px">
                <a href="https://example.com/internal-link" class="su-group su-flex su-items-center su-w-fit hocus:su-underline md:su-px-30 md:su-pt-12 md:su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-button dark:hocus:su-ring-white"> Button Text    </a>  </div>
              </section>"
            `);
        });
      
        it('Should handle isRealExternalLink correctly', async () => {
            const mockData = { 
                ...defaultMockData,
                internalUrl: undefined,
                isNewWindow: undefined,
            };
            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="button">
               <div class="su-mx-auto su-component-container su-container-large su-container-px">
                <a href="https://external.com" rel="noopener nofollow" class="su-group su-flex su-items-center su-w-fit hocus:su-underline md:su-px-30 md:su-pt-12 md:su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-button dark:hocus:su-ring-white"> Button Text  <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up" class="svg-inline--fa fa-arrow-up fa-fw su-inline-block su-shrink-0 su-text-white group-hocus:su-text-white su-text-[0.9em] su-ml-04em su-transition-transform su-rotate-45 group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20"> <path fill="currentColor" d="M209.4 39.4C204.8 34.7 198.6 32 192 32s-12.8 2.7-17.4 7.4l-168 176c-9.2 9.6-8.8 24.8 .8 33.9s24.8 8.8 33.9-.8L168 115.9 168 456c0 13.3 10.7 24 24 24s24-10.7 24-24l0-340.1L342.6 248.6c9.2 9.6 24.3 9.9 33.9 .8s9.9-24.3 .8-33.9l-168-176z"></path> </svg>    </a>  </div>
              </section>"
            `);
        });

        it('Should handle isNewWindow correctly', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="button">
               <div class="su-mx-auto su-component-container su-container-large su-container-px">
                <a href="https://example.com/internal-link" target="_blank" class="su-group su-flex su-items-center su-w-fit hocus:su-underline md:su-px-30 md:su-pt-12 md:su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-button dark:hocus:su-ring-white"> Button Text    </a>  </div>
              </section>"
            `);
        });
      
               
      });
});
