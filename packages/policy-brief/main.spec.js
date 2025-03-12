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

describe('[Policy Brief Component]', () => {
    // Test fixtures
    const mockFnsCtx = {
        resolveUri: vi.fn()
    };

    const defaultMockData = {
        contentConfiguration: {
            image: "matrix-asset://api-identifier/12345",
            type: "Policy Brief",
            title: "Test Policy Brief",
            summary: "Test summary content",
            linkUrl: "https://example.com",
            linkText: "Read more"
        }
    };

    const defaultMockInfo = {
        fns: mockFnsCtx
    };

    // Clear mocks before each test
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters was provided.', async () => {
            const result = await main();

            expect(result).toBe('<!-- Error occurred in the Policy brief component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when no info was provided', async () => {
            const result = await main(defaultMockData);

            expect(result).toBe('<!-- Error occurred in the Policy brief component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info do not have fns or ctx functions', async () => {
            const mockInfo = {test: 'test'}
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Policy brief component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fns or ctx is invalid', async () => {
            const mockInfo = { fns: undefined, ctx: undefined,  };
            const result = await main(defaultMockData, mockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Policy brief component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when image is not a string', async () => {
            const mockedData = {
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    image: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Policy brief component: The "image" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when type was not one of ["Policy Brief", "Case Study"]', async () => {
            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    type: 'Custom type',

                }
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Policy brief component: The "type" field must be one of ["Policy Brief", "Case Study"] values. The "Custom type" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when title is not a string', async () => {
            const mockedData = {
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    title: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Policy brief component: The "title" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when summary is not a string', async () => {
            const mockedData = {
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    summary: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Policy brief component: The "summary" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when linkText is not a string', async () => {
            const mockedData = {
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    linkText: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Policy brief component: The "linkText" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when linkUrl is not a string', async () => {
            const mockedData = {
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    linkUrl: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Policy brief component: The "linkUrl" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main function]', () => {
        it('Should return the expected HTML with valid data', async () => { 
            basicAssetUri.mockResolvedValueOnce({ url: 'https://example.com' });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="policy-brief">
                  <div class="su-mx-auto su-component-container su-container-wide">
                      <div class="su-relative su-flex su-flex-col su-gap-20 su-py-30 su-px-20 su-bg-fog-light md:su-mx-50 md:su-flex-row md:su-gap-18 lg:su-gap-48 md:su-p-36 lg:su-py-61 lg:su-px-65 dark:su-bg-transparent dark:before:su-bg-black dark:before:su-opacity-[0.5] dark:before:su-content-[''] dark:before:su-absolute dark:before:su-w-full dark:before:su-h-full dark:before:su-top-0 dark:before:su-left-0 dark:before:su-z-1">
                          <div class="su-relative su-w-full su-h-[233px] md:su-h-auto md:su-min-w-[257px] lg:su-h-[378.331px] lg:su-flex-1 su-z-2">
                              <img src="https://example.com" class="su-absolute su-size-full su-object-cover" alt="" />
                          </div>
                          <div class="lg:su-flex-1 su-relative su-z-2">
                              <div class="su-flex su-gap-6 su-items-center su-text-18 su-font-semibold su-pb-20 md:su-pb-27">
                                      <span class="dark:su-hidden"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="22" viewBox="0 0 17 22" fill="none">
                  <path
                      d="M2.75 0C1.2332 0 0 1.2332 0 2.75V19.25C0 20.7668 1.2332 22 2.75 22H13.75C15.2668 22 16.5 20.7668 16.5 19.25V6.875H11C10.2395 6.875 9.625 6.26055 9.625 5.5V0H2.75ZM11 0V5.5H16.5L11 0ZM3.4375 2.75H6.1875C6.56562 2.75 6.875 3.05937 6.875 3.4375C6.875 3.81562 6.56562 4.125 6.1875 4.125H3.4375C3.05937 4.125 2.75 3.81562 2.75 3.4375C2.75 3.05937 3.05937 2.75 3.4375 2.75ZM3.4375 5.5H6.1875C6.56562 5.5 6.875 5.80937 6.875 6.1875C6.875 6.56562 6.56562 6.875 6.1875 6.875H3.4375C3.05937 6.875 2.75 6.56562 2.75 6.1875C2.75 5.80937 3.05937 5.5 3.4375 5.5ZM5.76641 16.4055C5.5043 17.2777 4.70078 17.875 3.78984 17.875H3.4375C3.05937 17.875 2.75 17.5656 2.75 17.1875C2.75 16.8094 3.05937 16.5 3.4375 16.5H3.78984C4.09492 16.5 4.36133 16.3023 4.44727 16.0102L5.0875 13.8832C5.23359 13.3977 5.68047 13.0625 6.1875 13.0625C6.69453 13.0625 7.14141 13.3934 7.2875 13.8832L7.78594 15.5418C8.10391 15.2754 8.50781 15.125 8.9375 15.125C9.6207 15.125 10.2437 15.5117 10.5488 16.1219L10.7379 16.5H13.0625C13.4406 16.5 13.75 16.8094 13.75 17.1875C13.75 17.5656 13.4406 17.875 13.0625 17.875H10.3125C10.0504 17.875 9.81406 17.7289 9.69805 17.4969L9.31992 16.7363C9.24687 16.5902 9.10078 16.5 8.9418 16.5C8.78281 16.5 8.63242 16.5902 8.56367 16.7363L8.18555 17.4969C8.06094 17.7504 7.79023 17.9008 7.51094 17.875C7.23164 17.8492 6.99102 17.6559 6.91367 17.3895L6.1875 14.9961L5.76641 16.4055Z"
                      fill="url(#paint0_linear_1077_1864)"
                  />
                  <defs>
                      <linearGradient
                          id="paint0_linear_1077_1864"
                          x1="16.5"
                          y1="0"
                          x2="-5.43552"
                          y2="9.66991"
                          gradientUnits="userSpaceOnUse"
                      >
                          <stop stop-color="#E50808" />
                          <stop offset="1" stop-color="#820000" />
                      </linearGradient>
                  </defs>
              </svg>
              </span>
                                      <span class="su-hidden dark:su-block"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="23" viewBox="0 0 17 23" fill="none">
                  <path
                      d="M2.75 0.389648C1.2332 0.389648 0 1.62285 0 3.13965V19.6396C0 21.1564 1.2332 22.3896 2.75 22.3896H13.75C15.2668 22.3896 16.5 21.1564 16.5 19.6396V7.26465H11C10.2395 7.26465 9.625 6.6502 9.625 5.88965V0.389648H2.75ZM11 0.389648V5.88965H16.5L11 0.389648ZM3.4375 3.13965H6.1875C6.56562 3.13965 6.875 3.44902 6.875 3.82715C6.875 4.20527 6.56562 4.51465 6.1875 4.51465H3.4375C3.05937 4.51465 2.75 4.20527 2.75 3.82715C2.75 3.44902 3.05937 3.13965 3.4375 3.13965ZM3.4375 5.88965H6.1875C6.56562 5.88965 6.875 6.19902 6.875 6.57715C6.875 6.95527 6.56562 7.26465 6.1875 7.26465H3.4375C3.05937 7.26465 2.75 6.95527 2.75 6.57715C2.75 6.19902 3.05937 5.88965 3.4375 5.88965ZM5.76641 16.7951C5.5043 17.6674 4.70078 18.2646 3.78984 18.2646H3.4375C3.05937 18.2646 2.75 17.9553 2.75 17.5771C2.75 17.199 3.05937 16.8896 3.4375 16.8896H3.78984C4.09492 16.8896 4.36133 16.692 4.44727 16.3998L5.0875 14.2729C5.23359 13.7873 5.68047 13.4521 6.1875 13.4521C6.69453 13.4521 7.14141 13.783 7.2875 14.2729L7.78594 15.9314C8.10391 15.665 8.50781 15.5146 8.9375 15.5146C9.6207 15.5146 10.2437 15.9014 10.5488 16.5115L10.7379 16.8896H13.0625C13.4406 16.8896 13.75 17.199 13.75 17.5771C13.75 17.9553 13.4406 18.2646 13.0625 18.2646H10.3125C10.0504 18.2646 9.81406 18.1186 9.69805 17.8865L9.31992 17.126C9.24687 16.9799 9.10078 16.8896 8.9418 16.8896C8.78281 16.8896 8.63242 16.9799 8.56367 17.126L8.18555 17.8865C8.06094 18.14 7.79023 18.2904 7.51094 18.2646C7.23164 18.2389 6.99102 18.0455 6.91367 17.7791L6.1875 15.3857L5.76641 16.7951Z"
                      fill="url(#paint0_linear_1077_1870)"
                  />
                  <defs>
                      <linearGradient
                          id="paint0_linear_1077_1870"
                          x1="16.5"
                          y1="0.389648"
                          x2="-5.43552"
                          y2="10.0596"
                          gradientUnits="userSpaceOnUse"
                      >
                          <stop stop-color="#8F993E" />
                          <stop offset="1" stop-color="#279989" />
                      </linearGradient>
                  </defs>
              </svg>
              </span>
                                      <span>Policy Brief</span>
                              </div>
                                  <h2 class="su-text-[33px] su-font-bold su-leading-[125%] su-font-serif su-pb-19 su-m-0">Test Policy Brief</h2>
                                  <p class="su-text-19 su-font-normal su-leading-[125%] su-pb-20 md:su-pb-27 su-m-0">Test summary content</p>
                                  <a href="https://example.com" class="su-flex su-gap-2 su-group su-text-19 su-font-semibold su-leading-[125%] su-text-digital-red su-no-underline dark:su-text-dark-mode-red hocus:su-underline">
                                      Read more
                                      <span class="su-transition group-hocus:su--translate-y-01em group-hocus:su-translate-x-01em [&>svg]:su-translate-y-1">
                                          <svg xmlns="http://www.w3.org/2000/svg" class="su-stroke-digital-red dark:su-stroke-dark-mode-red" width="23" height="23" viewBox="0 0 23 23" fill="none">
                                              <path d="M8.95664 7.42241L15.5563 7.42241M15.5563 7.42241L15.5563 14.0221M15.5563 7.42241L7.07102 15.9077" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>                        </span>
                                  </a>
                          </div>
                      </div>
                  </div>
              </section> "
            `)
        }); 

        it('Should return the expected HTML when type is set to Case Study', async () => {
            basicAssetUri.mockResolvedValueOnce({ url: 'https://example.com' });

            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    type: "Case Study",
                }
            }
            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="policy-brief">
                  <div class="su-mx-auto su-component-container su-container-wide">
                      <div class="su-relative su-flex su-flex-col su-gap-20 su-py-30 su-px-20 su-bg-fog-light md:su-mx-50 md:su-flex-row md:su-gap-18 lg:su-gap-48 md:su-p-36 lg:su-py-61 lg:su-px-65 dark:su-bg-transparent dark:before:su-bg-black dark:before:su-opacity-[0.5] dark:before:su-content-[''] dark:before:su-absolute dark:before:su-w-full dark:before:su-h-full dark:before:su-top-0 dark:before:su-left-0 dark:before:su-z-1">
                          <div class="su-relative su-w-full su-h-[233px] md:su-h-auto md:su-min-w-[257px] lg:su-h-[378.331px] lg:su-flex-1 su-z-2">
                              <img src="https://example.com" class="su-absolute su-size-full su-object-cover" alt="" />
                          </div>
                          <div class="lg:su-flex-1 su-relative su-z-2">
                              <div class="su-flex su-gap-6 su-items-center su-text-18 su-font-semibold su-pb-20 md:su-pb-27">
                                      <span class="dark:su-hidden"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="23" viewBox="0 0 17 23" fill="none">
                  <path
                      d="M2.75 0.389648C1.2332 0.389648 0 1.62285 0 3.13965V19.6396C0 21.1564 1.2332 22.3896 2.75 22.3896H13.75C15.2668 22.3896 16.5 21.1564 16.5 19.6396V7.26465H11C10.2395 7.26465 9.625 6.6502 9.625 5.88965V0.389648H2.75ZM11 0.389648V5.88965H16.5L11 0.389648ZM11.6875 13.4521C11.6875 14.217 11.477 14.9346 11.116 15.5533L12.7617 17.199C13.1656 17.6029 13.1656 18.2561 12.7617 18.6557C12.3578 19.0553 11.7047 19.0596 11.3051 18.6557L9.65508 17.0057C9.04062 17.3709 8.32734 17.5771 7.5625 17.5771C5.28516 17.5771 3.4375 15.7295 3.4375 13.4521C3.4375 11.1748 5.28516 9.32715 7.5625 9.32715C9.83984 9.32715 11.6875 11.1748 11.6875 13.4521ZM7.5625 15.5146C8.10951 15.5146 8.63411 15.2973 9.02091 14.9106C9.4077 14.5238 9.625 13.9992 9.625 13.4521C9.625 12.9051 9.4077 12.3805 9.02091 11.9937C8.63411 11.6069 8.10951 11.3896 7.5625 11.3896C7.01549 11.3896 6.49089 11.6069 6.10409 11.9937C5.7173 12.3805 5.5 12.9051 5.5 13.4521C5.5 13.9992 5.7173 14.5238 6.10409 14.9106C6.49089 15.2973 7.01549 15.5146 7.5625 15.5146Z"
                      fill="url(#paint0_linear_1077_1867)"
                  />
                  <defs>
                      <linearGradient
                          id="paint0_linear_1077_1867"
                          x1="16.5"
                          y1="0.389648"
                          x2="-5.43552"
                          y2="10.0596"
                          gradientUnits="userSpaceOnUse"
                      >
                          <stop stop-color="#E50808" />
                          <stop offset="1" stop-color="#820000" />
                      </linearGradient>
                  </defs>
              </svg>
              </span>
                                      <span class="su-hidden dark:su-block"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="23" viewBox="0 0 17 23" fill="none">
                  <path
                      d="M2.75 0.779297C1.2332 0.779297 0 2.0125 0 3.5293V20.0293C0 21.5461 1.2332 22.7793 2.75 22.7793H13.75C15.2668 22.7793 16.5 21.5461 16.5 20.0293V7.6543H11C10.2395 7.6543 9.625 7.03984 9.625 6.2793V0.779297H2.75ZM11 0.779297V6.2793H16.5L11 0.779297ZM11.6875 13.8418C11.6875 14.6066 11.477 15.3242 11.116 15.943L12.7617 17.5887C13.1656 17.9926 13.1656 18.6457 12.7617 19.0453C12.3578 19.4449 11.7047 19.4492 11.3051 19.0453L9.65508 17.3953C9.04062 17.7605 8.32734 17.9668 7.5625 17.9668C5.28516 17.9668 3.4375 16.1191 3.4375 13.8418C3.4375 11.5645 5.28516 9.7168 7.5625 9.7168C9.83984 9.7168 11.6875 11.5645 11.6875 13.8418ZM7.5625 15.9043C8.10951 15.9043 8.63411 15.687 9.02091 15.3002C9.4077 14.9134 9.625 14.3888 9.625 13.8418C9.625 13.2948 9.4077 12.7702 9.02091 12.3834C8.63411 11.9966 8.10951 11.7793 7.5625 11.7793C7.01549 11.7793 6.49089 11.9966 6.10409 12.3834C5.7173 12.7702 5.5 13.2948 5.5 13.8418C5.5 14.3888 5.7173 14.9134 6.10409 15.3002C6.49089 15.687 7.01549 15.9043 7.5625 15.9043Z"
                      fill="url(#paint0_linear_1077_1873)"
                  />
                  <defs>
                      <linearGradient
                          id="paint0_linear_1077_1873"
                          x1="16.5"
                          y1="0.779297"
                          x2="-5.43552"
                          y2="10.4492"
                          gradientUnits="userSpaceOnUse"
                      >
                          <stop stop-color="#8F993E" />
                          <stop offset="1" stop-color="#279989" />
                      </linearGradient>
                  </defs>
              </svg>
              </span>
                                      <span>Case Study</span>
                              </div>
                                  <h2 class="su-text-[33px] su-font-bold su-leading-[125%] su-font-serif su-pb-19 su-m-0">Test Policy Brief</h2>
                                  <p class="su-text-19 su-font-normal su-leading-[125%] su-pb-20 md:su-pb-27 su-m-0">Test summary content</p>
                                  <a href="https://example.com" class="su-flex su-gap-2 su-group su-text-19 su-font-semibold su-leading-[125%] su-text-digital-red su-no-underline dark:su-text-dark-mode-red hocus:su-underline">
                                      Read more
                                      <span class="su-transition group-hocus:su--translate-y-01em group-hocus:su-translate-x-01em [&>svg]:su-translate-y-1">
                                          <svg xmlns="http://www.w3.org/2000/svg" class="su-stroke-digital-red dark:su-stroke-dark-mode-red" width="23" height="23" viewBox="0 0 23 23" fill="none">
                                              <path d="M8.95664 7.42241L15.5563 7.42241M15.5563 7.42241L15.5563 14.0221M15.5563 7.42241L7.07102 15.9077" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>                        </span>
                                  </a>
                          </div>
                      </div>
                  </div>
              </section> "
            `)
        }); 

        it('Should return the expected HTML when image url is empty', async () => { 
            basicAssetUri.mockResolvedValueOnce({});

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="policy-brief">
                  <div class="su-mx-auto su-component-container su-container-wide">
                      <div class="su-relative su-flex su-flex-col su-gap-20 su-py-30 su-px-20 su-bg-fog-light md:su-mx-50 md:su-flex-row md:su-gap-18 lg:su-gap-48 md:su-p-36 lg:su-py-61 lg:su-px-65 dark:su-bg-transparent dark:before:su-bg-black dark:before:su-opacity-[0.5] dark:before:su-content-[''] dark:before:su-absolute dark:before:su-w-full dark:before:su-h-full dark:before:su-top-0 dark:before:su-left-0 dark:before:su-z-1">
                          <div class="su-relative su-w-full su-h-[233px] md:su-h-auto md:su-min-w-[257px] lg:su-h-[378.331px] lg:su-flex-1 su-z-2">
                          </div>
                          <div class="lg:su-flex-1 su-relative su-z-2">
                              <div class="su-flex su-gap-6 su-items-center su-text-18 su-font-semibold su-pb-20 md:su-pb-27">
                                      <span class="dark:su-hidden"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="22" viewBox="0 0 17 22" fill="none">
                  <path
                      d="M2.75 0C1.2332 0 0 1.2332 0 2.75V19.25C0 20.7668 1.2332 22 2.75 22H13.75C15.2668 22 16.5 20.7668 16.5 19.25V6.875H11C10.2395 6.875 9.625 6.26055 9.625 5.5V0H2.75ZM11 0V5.5H16.5L11 0ZM3.4375 2.75H6.1875C6.56562 2.75 6.875 3.05937 6.875 3.4375C6.875 3.81562 6.56562 4.125 6.1875 4.125H3.4375C3.05937 4.125 2.75 3.81562 2.75 3.4375C2.75 3.05937 3.05937 2.75 3.4375 2.75ZM3.4375 5.5H6.1875C6.56562 5.5 6.875 5.80937 6.875 6.1875C6.875 6.56562 6.56562 6.875 6.1875 6.875H3.4375C3.05937 6.875 2.75 6.56562 2.75 6.1875C2.75 5.80937 3.05937 5.5 3.4375 5.5ZM5.76641 16.4055C5.5043 17.2777 4.70078 17.875 3.78984 17.875H3.4375C3.05937 17.875 2.75 17.5656 2.75 17.1875C2.75 16.8094 3.05937 16.5 3.4375 16.5H3.78984C4.09492 16.5 4.36133 16.3023 4.44727 16.0102L5.0875 13.8832C5.23359 13.3977 5.68047 13.0625 6.1875 13.0625C6.69453 13.0625 7.14141 13.3934 7.2875 13.8832L7.78594 15.5418C8.10391 15.2754 8.50781 15.125 8.9375 15.125C9.6207 15.125 10.2437 15.5117 10.5488 16.1219L10.7379 16.5H13.0625C13.4406 16.5 13.75 16.8094 13.75 17.1875C13.75 17.5656 13.4406 17.875 13.0625 17.875H10.3125C10.0504 17.875 9.81406 17.7289 9.69805 17.4969L9.31992 16.7363C9.24687 16.5902 9.10078 16.5 8.9418 16.5C8.78281 16.5 8.63242 16.5902 8.56367 16.7363L8.18555 17.4969C8.06094 17.7504 7.79023 17.9008 7.51094 17.875C7.23164 17.8492 6.99102 17.6559 6.91367 17.3895L6.1875 14.9961L5.76641 16.4055Z"
                      fill="url(#paint0_linear_1077_1864)"
                  />
                  <defs>
                      <linearGradient
                          id="paint0_linear_1077_1864"
                          x1="16.5"
                          y1="0"
                          x2="-5.43552"
                          y2="9.66991"
                          gradientUnits="userSpaceOnUse"
                      >
                          <stop stop-color="#E50808" />
                          <stop offset="1" stop-color="#820000" />
                      </linearGradient>
                  </defs>
              </svg>
              </span>
                                      <span class="su-hidden dark:su-block"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="23" viewBox="0 0 17 23" fill="none">
                  <path
                      d="M2.75 0.389648C1.2332 0.389648 0 1.62285 0 3.13965V19.6396C0 21.1564 1.2332 22.3896 2.75 22.3896H13.75C15.2668 22.3896 16.5 21.1564 16.5 19.6396V7.26465H11C10.2395 7.26465 9.625 6.6502 9.625 5.88965V0.389648H2.75ZM11 0.389648V5.88965H16.5L11 0.389648ZM3.4375 3.13965H6.1875C6.56562 3.13965 6.875 3.44902 6.875 3.82715C6.875 4.20527 6.56562 4.51465 6.1875 4.51465H3.4375C3.05937 4.51465 2.75 4.20527 2.75 3.82715C2.75 3.44902 3.05937 3.13965 3.4375 3.13965ZM3.4375 5.88965H6.1875C6.56562 5.88965 6.875 6.19902 6.875 6.57715C6.875 6.95527 6.56562 7.26465 6.1875 7.26465H3.4375C3.05937 7.26465 2.75 6.95527 2.75 6.57715C2.75 6.19902 3.05937 5.88965 3.4375 5.88965ZM5.76641 16.7951C5.5043 17.6674 4.70078 18.2646 3.78984 18.2646H3.4375C3.05937 18.2646 2.75 17.9553 2.75 17.5771C2.75 17.199 3.05937 16.8896 3.4375 16.8896H3.78984C4.09492 16.8896 4.36133 16.692 4.44727 16.3998L5.0875 14.2729C5.23359 13.7873 5.68047 13.4521 6.1875 13.4521C6.69453 13.4521 7.14141 13.783 7.2875 14.2729L7.78594 15.9314C8.10391 15.665 8.50781 15.5146 8.9375 15.5146C9.6207 15.5146 10.2437 15.9014 10.5488 16.5115L10.7379 16.8896H13.0625C13.4406 16.8896 13.75 17.199 13.75 17.5771C13.75 17.9553 13.4406 18.2646 13.0625 18.2646H10.3125C10.0504 18.2646 9.81406 18.1186 9.69805 17.8865L9.31992 17.126C9.24687 16.9799 9.10078 16.8896 8.9418 16.8896C8.78281 16.8896 8.63242 16.9799 8.56367 17.126L8.18555 17.8865C8.06094 18.14 7.79023 18.2904 7.51094 18.2646C7.23164 18.2389 6.99102 18.0455 6.91367 17.7791L6.1875 15.3857L5.76641 16.7951Z"
                      fill="url(#paint0_linear_1077_1870)"
                  />
                  <defs>
                      <linearGradient
                          id="paint0_linear_1077_1870"
                          x1="16.5"
                          y1="0.389648"
                          x2="-5.43552"
                          y2="10.0596"
                          gradientUnits="userSpaceOnUse"
                      >
                          <stop stop-color="#8F993E" />
                          <stop offset="1" stop-color="#279989" />
                      </linearGradient>
                  </defs>
              </svg>
              </span>
                                      <span>Policy Brief</span>
                              </div>
                                  <h2 class="su-text-[33px] su-font-bold su-leading-[125%] su-font-serif su-pb-19 su-m-0">Test Policy Brief</h2>
                                  <p class="su-text-19 su-font-normal su-leading-[125%] su-pb-20 md:su-pb-27 su-m-0">Test summary content</p>
                                  <a href="https://example.com" class="su-flex su-gap-2 su-group su-text-19 su-font-semibold su-leading-[125%] su-text-digital-red su-no-underline dark:su-text-dark-mode-red hocus:su-underline">
                                      Read more
                                      <span class="su-transition group-hocus:su--translate-y-01em group-hocus:su-translate-x-01em [&>svg]:su-translate-y-1">
                                          <svg xmlns="http://www.w3.org/2000/svg" class="su-stroke-digital-red dark:su-stroke-dark-mode-red" width="23" height="23" viewBox="0 0 23 23" fill="none">
                                              <path d="M8.95664 7.42241L15.5563 7.42241M15.5563 7.42241L15.5563 14.0221M15.5563 7.42241L7.07102 15.9077" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>                        </span>
                                  </a>
                          </div>
                      </div>
                  </div>
              </section> "
            `)
        }); 
    });
});