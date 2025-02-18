import { beforeEach, describe, expect, it, vi } from 'vitest';
import { basicAssetUri } from "../../global/js/utils";
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    basicAssetUri: vi.fn(),
}));

describe('[Interactive Photo Card]', () => {
    const mockFnsCtx = {
        resolveUri: vi.fn()
    };
    const defaultMockData = {
        title: 'Photo Title',
        content: 'Photo Content',
        image: 'matrix-asset://api-identifier/image-id',
        eyebrow: 'Optional Eyebrow',
        imageAlignment: 'left'
    };
    const defaultMockInfo = {
        fns: mockFnsCtx
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters were provided.', async () => {
            const result = await main();

            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info was provided', async () => {
            const result = await main(defaultMockData);

            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fns or ctx is invalid', async () => {
            const mockInfo = { foo: 'bar' };
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when title was not provided', async () => {
            const mockedData = {
                ...defaultMockData, 
                title: undefined
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "title" field cannot be undefined and must be a non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when title was an empty string', async () => {
            const mockedData = {
                ...defaultMockData, 
                title: ''
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "title" field cannot be undefined and must be a non-empty string. The "" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when title was not a string', async () => {
            const mockedData = {
                ...defaultMockData, 
                title: 123
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "title" field cannot be undefined and must be a non-empty string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when content was not provided', async () => {
            const mockedData = {
                ...defaultMockData, 
                content: undefined
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "content" field cannot be undefined and must be a non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when content was an empty string', async () => {
            const mockedData = {
                ...defaultMockData, 
                content: ''
            };
            const result = await main(mockedData, defaultMockInfo);
            
            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "content" field cannot be undefined and must be a non-empty string. The "" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when content was not a string', async () => {
            const mockedData = {
                ...defaultMockData, 
                content: 123
            };
            const result = await main(mockedData, defaultMockInfo);
            
            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "content" field cannot be undefined and must be a non-empty string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when image was not provided', async () => {
            const mockedData = {
                ...defaultMockData, 
                image: undefined
            };
            const result = await main(mockedData, defaultMockInfo);
            
            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "image" field cannot be undefined and must be a non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when image was an empty string', async () => {
            const mockedData = {
                ...defaultMockData, 
                image: ''
            };
            const result = await main(mockedData, defaultMockInfo);
            
            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "image" field cannot be undefined and must be a non-empty string. The "" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when image was not a string', async () => {
            const mockedData = {
                ...defaultMockData, 
                image: 123
            };
            const result = await main(mockedData, defaultMockInfo);
            
            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "image" field cannot be undefined and must be a non-empty string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when image was not a string', async () => {
            const mockedData = {
                ...defaultMockData, 
                eyebrow: 123
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "eyebrow" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when source was not one of ["left", "right"]', async () => {
            const mockedData = {
                ...defaultMockData, 
                imageAlignment: 'center'
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Interactive photo card component: The "imageAlignment" field cannot be undefined and must be one of ["left", "right"]. The "center" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        beforeEach(() => {
            basicAssetUri.mockResolvedValueOnce({ url: 'https://example.com/image.jpg' });
        });

        it('Should return the expected HTML with valid data', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="interactive-photo-card">
                  <div class="su-cc">
                      <article class="su-relative su-grid xl:su-grid-cols-2 su-gap-20 [perspective:100rem] su-transition-transform">
                          <div class="su-flex su-relative [transform-style:preserve-3d] su-duration-1000 xl:su-order-2" data-card-inner="true">
                              <div class="su-group/front su-relative su-bg-white su-backface-hidden su-rounded-[8px] su-shadow-lg su-min-w-full" aria-hidden="false">
                                  <div class="su-flex su-flex-col su-h-full su-rs-px-5 su-rs-pt-6 su-rs-pb-4">
                                      <div class="su-type-1 su-text-black-60 su-font-semibold su-rs-mb-1">
                                          Optional Eyebrow
                                      </div>
                                      <h2 class="su-grow su-type-4 su-font-bold su-font-sans su-text-black dark:su-text-black su-rs-mb-0">
                                          Photo Title
                                      </h2>
                                      <button type="button" aria-hidden="false" tabIndex="" aria-label="See additional information" class="su-block su-ml-auto su-mr-0 su-bg-black su-text-white group-hover/front:su-bg-digital-red focus:su-bg-digital-red su-rounded-full su-p-10 su-stretched-link su-transition-all su-opacity-100 group-aria-hidden/front:su-opacity-0">
                                          
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="50"
                      height="50"
                      viewBox="0 0 50 50"
                      fill="none"
                      class="su-size-30 md:su-size-50 su-fill-none group-hover/front:su-scale-110 group-focus-within/front:su-scale-110 su-transition-transform"
                      aria-hidden
                  >
                      <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M25 7.5C26.3807 7.5 27.5 8.61929 27.5 10V22.5H40C41.3807 22.5 42.5 23.6193 42.5 25C42.5 26.3807 41.3807 27.5 40 27.5H27.5V40C27.5 41.3807 26.3807 42.5 25 42.5C23.6193 42.5 22.5 41.3807 22.5 40V27.5H10C8.61929 27.5 7.5 26.3807 7.5 25C7.5 23.6193 8.61929 22.5 10 22.5L22.5 22.5V10C22.5 8.61929 23.6193 7.5 25 7.5Z"
                          fill="white"
                      />
                  </svg>
                                      </button>
                                  </div>
                              </div>
                              <div class="su-group/back su-relative su-flex su-flex-col su-h-full su-min-w-full su-rounded-[8px] su-rs-px-5 su-rs-pt-6 su-rs-pb-4 su-bg-digital-red-dark su-text-white [transform:rotateY(180deg)_translate(100%,0)] su-backface-hidden su-transition-transform su-shadow-lg" aria-hidden="true">
                                  <div class="su-big-paragraph su-grow">
                                      Photo Content
                                      <button type="button" aria-hidden="true" tabIndex="-1" aria-label="Dismiss content" class="su-block su-ml-auto su-mr-0 su-border-3 su-border-white su-rounded-full su-text-white focus:su-bg-black group-hover/back:su-bg-black su-p-7 lg:su-p-14 su-stretched-link su-transition-colors">
                                          
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="36"
                      height="36"
                      viewBox="0 0 36 36"
                      fill="none"
                      class="su-size-30 lg:su-size-36 su-fill-none group-hover/back:su-rotate-45 su-transition-transform"
                      aria-hidden
                  >
                      <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M7.5 4C8.4665 4 9.25 4.7835 9.25 5.75V9.4272C11.4727 7.15855 14.5709 5.75 18 5.75C23.3365 5.75 27.8717 9.16131 29.5525 13.9168C29.8746 14.8281 29.397 15.8279 28.4857 16.15C27.5745 16.4721 26.5746 15.9944 26.2526 15.0832C25.0505 11.6823 21.8071 9.25 18 9.25C15.1389 9.25 12.5961 10.6238 10.9989 12.75H16.25C17.2165 12.75 18 13.5335 18 14.5C18 15.4665 17.2165 16.25 16.25 16.25H7.5C6.5335 16.25 5.75 15.4665 5.75 14.5V5.75C5.75 4.7835 6.5335 4 7.5 4ZM7.51429 19.85C8.42554 19.5279 9.42536 20.0056 9.74744 20.9168C10.9495 24.3177 14.1929 26.75 18 26.75C20.8611 26.75 23.4039 25.3762 25.0011 23.25L19.75 23.25C18.7835 23.25 18 22.4665 18 21.5C18 20.5335 18.7835 19.75 19.75 19.75H28.5C28.9641 19.75 29.4092 19.9344 29.7374 20.2626C30.0656 20.5907 30.25 21.0359 30.25 21.5V30.25C30.25 31.2165 29.4665 32 28.5 32C27.5335 32 26.75 31.2165 26.75 30.25V26.5728C24.5273 28.8414 21.4291 30.25 18 30.25C12.6635 30.25 8.12833 26.8387 6.4475 22.0832C6.12542 21.1719 6.60304 20.1721 7.51429 19.85Z"
                          fill="white"
                      />
                  </svg>
                                      </button>
                                  </div>
                              </div>
                          </div>
                          <div class="su-rounded-[8px] su-overflow-hidden su-shadow-lg xl:su-order-first">
                              <img src=https://example.com/image.jpg alt="" class="su-object-cover su-size-full" />
                          </div>
                      </article>
                  </div>
              </section>"
            `);
        });

        it('Should handle right alignment correctly', async () => {
            const mockData = {
                ...defaultMockData, 
                imageAlignment: 'right'
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toMatchInlineSnapshot(`
              "<section data-component="interactive-photo-card">
                  <div class="su-cc">
                      <article class="su-relative su-grid xl:su-grid-cols-2 su-gap-20 [perspective:100rem] su-transition-transform">
                          <div class="su-flex su-relative [transform-style:preserve-3d] su-duration-1000 " data-card-inner="true">
                              <div class="su-group/front su-relative su-bg-white su-backface-hidden su-rounded-[8px] su-shadow-lg su-min-w-full" aria-hidden="false">
                                  <div class="su-flex su-flex-col su-h-full su-rs-px-5 su-rs-pt-6 su-rs-pb-4">
                                      <div class="su-type-1 su-text-black-60 su-font-semibold su-rs-mb-1">
                                          Optional Eyebrow
                                      </div>
                                      <h2 class="su-grow su-type-4 su-font-bold su-font-sans su-text-black dark:su-text-black su-rs-mb-0">
                                          Photo Title
                                      </h2>
                                      <button type="button" aria-hidden="false" tabIndex="" aria-label="See additional information" class="su-block su-ml-auto su-mr-0 su-bg-black su-text-white group-hover/front:su-bg-digital-red focus:su-bg-digital-red su-rounded-full su-p-10 su-stretched-link su-transition-all su-opacity-100 group-aria-hidden/front:su-opacity-0">
                                          
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="50"
                      height="50"
                      viewBox="0 0 50 50"
                      fill="none"
                      class="su-size-30 md:su-size-50 su-fill-none group-hover/front:su-scale-110 group-focus-within/front:su-scale-110 su-transition-transform"
                      aria-hidden
                  >
                      <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M25 7.5C26.3807 7.5 27.5 8.61929 27.5 10V22.5H40C41.3807 22.5 42.5 23.6193 42.5 25C42.5 26.3807 41.3807 27.5 40 27.5H27.5V40C27.5 41.3807 26.3807 42.5 25 42.5C23.6193 42.5 22.5 41.3807 22.5 40V27.5H10C8.61929 27.5 7.5 26.3807 7.5 25C7.5 23.6193 8.61929 22.5 10 22.5L22.5 22.5V10C22.5 8.61929 23.6193 7.5 25 7.5Z"
                          fill="white"
                      />
                  </svg>
                                      </button>
                                  </div>
                              </div>
                              <div class="su-group/back su-relative su-flex su-flex-col su-h-full su-min-w-full su-rounded-[8px] su-rs-px-5 su-rs-pt-6 su-rs-pb-4 su-bg-digital-red-dark su-text-white [transform:rotateY(180deg)_translate(100%,0)] su-backface-hidden su-transition-transform su-shadow-lg" aria-hidden="true">
                                  <div class="su-big-paragraph su-grow">
                                      Photo Content
                                      <button type="button" aria-hidden="true" tabIndex="-1" aria-label="Dismiss content" class="su-block su-ml-auto su-mr-0 su-border-3 su-border-white su-rounded-full su-text-white focus:su-bg-black group-hover/back:su-bg-black su-p-7 lg:su-p-14 su-stretched-link su-transition-colors">
                                          
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="36"
                      height="36"
                      viewBox="0 0 36 36"
                      fill="none"
                      class="su-size-30 lg:su-size-36 su-fill-none group-hover/back:su-rotate-45 su-transition-transform"
                      aria-hidden
                  >
                      <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M7.5 4C8.4665 4 9.25 4.7835 9.25 5.75V9.4272C11.4727 7.15855 14.5709 5.75 18 5.75C23.3365 5.75 27.8717 9.16131 29.5525 13.9168C29.8746 14.8281 29.397 15.8279 28.4857 16.15C27.5745 16.4721 26.5746 15.9944 26.2526 15.0832C25.0505 11.6823 21.8071 9.25 18 9.25C15.1389 9.25 12.5961 10.6238 10.9989 12.75H16.25C17.2165 12.75 18 13.5335 18 14.5C18 15.4665 17.2165 16.25 16.25 16.25H7.5C6.5335 16.25 5.75 15.4665 5.75 14.5V5.75C5.75 4.7835 6.5335 4 7.5 4ZM7.51429 19.85C8.42554 19.5279 9.42536 20.0056 9.74744 20.9168C10.9495 24.3177 14.1929 26.75 18 26.75C20.8611 26.75 23.4039 25.3762 25.0011 23.25L19.75 23.25C18.7835 23.25 18 22.4665 18 21.5C18 20.5335 18.7835 19.75 19.75 19.75H28.5C28.9641 19.75 29.4092 19.9344 29.7374 20.2626C30.0656 20.5907 30.25 21.0359 30.25 21.5V30.25C30.25 31.2165 29.4665 32 28.5 32C27.5335 32 26.75 31.2165 26.75 30.25V26.5728C24.5273 28.8414 21.4291 30.25 18 30.25C12.6635 30.25 8.12833 26.8387 6.4475 22.0832C6.12542 21.1719 6.60304 20.1721 7.51429 19.85Z"
                          fill="white"
                      />
                  </svg>
                                      </button>
                                  </div>
                              </div>
                          </div>
                          <div class="su-rounded-[8px] su-overflow-hidden su-shadow-lg ">
                              <img src=https://example.com/image.jpg alt="" class="su-object-cover su-size-full" />
                          </div>
                      </article>
                  </div>
              </section>"
            `);
        });

        it('Should omit eyebrow when not provided', async () => {
            const mockData = {...defaultMockData, eyebrow: undefined};
            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="interactive-photo-card">
                  <div class="su-cc">
                      <article class="su-relative su-grid xl:su-grid-cols-2 su-gap-20 [perspective:100rem] su-transition-transform">
                          <div class="su-flex su-relative [transform-style:preserve-3d] su-duration-1000 xl:su-order-2" data-card-inner="true">
                              <div class="su-group/front su-relative su-bg-white su-backface-hidden su-rounded-[8px] su-shadow-lg su-min-w-full" aria-hidden="false">
                                  <div class="su-flex su-flex-col su-h-full su-rs-px-5 su-rs-pt-6 su-rs-pb-4">
                                      <h2 class="su-grow su-type-4 su-font-bold su-font-sans su-text-black dark:su-text-black su-rs-mb-0">
                                          Photo Title
                                      </h2>
                                      <button type="button" aria-hidden="false" tabIndex="" aria-label="See additional information" class="su-block su-ml-auto su-mr-0 su-bg-black su-text-white group-hover/front:su-bg-digital-red focus:su-bg-digital-red su-rounded-full su-p-10 su-stretched-link su-transition-all su-opacity-100 group-aria-hidden/front:su-opacity-0">
                                          
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="50"
                      height="50"
                      viewBox="0 0 50 50"
                      fill="none"
                      class="su-size-30 md:su-size-50 su-fill-none group-hover/front:su-scale-110 group-focus-within/front:su-scale-110 su-transition-transform"
                      aria-hidden
                  >
                      <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M25 7.5C26.3807 7.5 27.5 8.61929 27.5 10V22.5H40C41.3807 22.5 42.5 23.6193 42.5 25C42.5 26.3807 41.3807 27.5 40 27.5H27.5V40C27.5 41.3807 26.3807 42.5 25 42.5C23.6193 42.5 22.5 41.3807 22.5 40V27.5H10C8.61929 27.5 7.5 26.3807 7.5 25C7.5 23.6193 8.61929 22.5 10 22.5L22.5 22.5V10C22.5 8.61929 23.6193 7.5 25 7.5Z"
                          fill="white"
                      />
                  </svg>
                                      </button>
                                  </div>
                              </div>
                              <div class="su-group/back su-relative su-flex su-flex-col su-h-full su-min-w-full su-rounded-[8px] su-rs-px-5 su-rs-pt-6 su-rs-pb-4 su-bg-digital-red-dark su-text-white [transform:rotateY(180deg)_translate(100%,0)] su-backface-hidden su-transition-transform su-shadow-lg" aria-hidden="true">
                                  <div class="su-big-paragraph su-grow">
                                      Photo Content
                                      <button type="button" aria-hidden="true" tabIndex="-1" aria-label="Dismiss content" class="su-block su-ml-auto su-mr-0 su-border-3 su-border-white su-rounded-full su-text-white focus:su-bg-black group-hover/back:su-bg-black su-p-7 lg:su-p-14 su-stretched-link su-transition-colors">
                                          
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="36"
                      height="36"
                      viewBox="0 0 36 36"
                      fill="none"
                      class="su-size-30 lg:su-size-36 su-fill-none group-hover/back:su-rotate-45 su-transition-transform"
                      aria-hidden
                  >
                      <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M7.5 4C8.4665 4 9.25 4.7835 9.25 5.75V9.4272C11.4727 7.15855 14.5709 5.75 18 5.75C23.3365 5.75 27.8717 9.16131 29.5525 13.9168C29.8746 14.8281 29.397 15.8279 28.4857 16.15C27.5745 16.4721 26.5746 15.9944 26.2526 15.0832C25.0505 11.6823 21.8071 9.25 18 9.25C15.1389 9.25 12.5961 10.6238 10.9989 12.75H16.25C17.2165 12.75 18 13.5335 18 14.5C18 15.4665 17.2165 16.25 16.25 16.25H7.5C6.5335 16.25 5.75 15.4665 5.75 14.5V5.75C5.75 4.7835 6.5335 4 7.5 4ZM7.51429 19.85C8.42554 19.5279 9.42536 20.0056 9.74744 20.9168C10.9495 24.3177 14.1929 26.75 18 26.75C20.8611 26.75 23.4039 25.3762 25.0011 23.25L19.75 23.25C18.7835 23.25 18 22.4665 18 21.5C18 20.5335 18.7835 19.75 19.75 19.75H28.5C28.9641 19.75 29.4092 19.9344 29.7374 20.2626C30.0656 20.5907 30.25 21.0359 30.25 21.5V30.25C30.25 31.2165 29.4665 32 28.5 32C27.5335 32 26.75 31.2165 26.75 30.25V26.5728C24.5273 28.8414 21.4291 30.25 18 30.25C12.6635 30.25 8.12833 26.8387 6.4475 22.0832C6.12542 21.1719 6.60304 20.1721 7.51429 19.85Z"
                          fill="white"
                      />
                  </svg>
                                      </button>
                                  </div>
                              </div>
                          </div>
                          <div class="su-rounded-[8px] su-overflow-hidden su-shadow-lg xl:su-order-first">
                              <img src=https://example.com/image.jpg alt="" class="su-object-cover su-size-full" />
                          </div>
                      </article>
                  </div>
              </section>"
            `);
        });
    });
});