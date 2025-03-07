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

        it('Should throw an error when buttonText is missing', async () => {
            const mockData = { ...defaultMockData, buttonText: undefined };
            const result = await main(mockData, defaultMockInfo);
            expect(result).toBe(
                '<!-- Error occurred in the Button component: The "buttonText" field cannot be undefined and must be a non-empty string. The undefined was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when buttonText is an empty string', async () => {
            const mockData = { ...defaultMockData, buttonText: '' };
            const result = await main(mockData, defaultMockInfo);
            expect(result).toBe(
                '<!-- Error occurred in the Button component: The "buttonText" field cannot be undefined and must be a non-empty string. The "" was received. -->',
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
                      <a href="https://example.com/internal-link" class="su-group su-flex su-items-center su-w-fit hocus:su-underline md:su-px-30 md:su-pt-12 md:su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-button dark:hocus:su-ring-white">
                          Button Text         
                      </a>    </div>
              </section>
              "
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
                      <a href="https://external.com" rel="noopener nofollow" class="su-group su-flex su-items-center su-w-fit hocus:su-underline md:su-px-30 md:su-pt-12 md:su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-button dark:hocus:su-ring-white">
                          Button Text         
                              <span class="fa-fw su-inline-block su-shrink-0 su-text-white group-hocus:su-text-white su-text-[0.9em] su-ml-04em su-transition-transform su-rotate-45 group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em">
                                  <svg viewBox="0 0 384 512">
                                      <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2 160 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-306.7L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/>
                                  </svg>
                              </span>
                      </a>    </div>
              </section>
              "
            `);
        });

        it('Should handle isNewWindow correctly', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="button">
                  <div class="su-mx-auto su-component-container su-container-large su-container-px">
                      <a href="https://example.com/internal-link" target="_blank" class="su-group su-flex su-items-center su-w-fit hocus:su-underline md:su-px-30 md:su-pt-12 md:su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-button dark:hocus:su-ring-white">
                          Button Text         
                      </a>    </div>
              </section>
              "
            `);
        });
      
               
      });
});
