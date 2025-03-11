import { beforeEach, describe, expect, it, vi } from 'vitest';
import { basicAssetUri } from "../../global/js/utils";
import { PolicyBrief, CaseStudy } from '../../global/js/helpers/SVG-library';
import moduleToTest from './main';
const { main } = moduleToTest;

// Mock console.error
const mockedError = vi.fn();
console.error = mockedError;

// Mock dependencies
vi.mock('../../global/js/utils', () => ({
    basicAssetUri: vi.fn().mockResolvedValue({ url: 'https://example.com/image.jpg' }),
}));

vi.mock('../../global/js/helpers/SVG-library', () => ({
    PolicyBrief: vi.fn().mockReturnValue({ light: 'policy-brief-light', dark: 'policy-brief-dark' }),
    CaseStudy: vi.fn().mockReturnValue({ light: 'case-study-light', dark: 'case-study-dark' })
}));

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

describe('[Policy Brief Component Tests]', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockedError.mockClear(); // Reset console.error mock
    });

    describe('[Setup Validation]', () => {
        it('Should reject invalid info.fns object', async () => {
            const mockInfo = { test: 'test' };
            const result = await main(defaultMockData, mockInfo);
            expect(result).toContain('The "info.fns" cannot be undefined or null.');
            expect(mockedError).toBeCalledTimes(1);
            expect(basicAssetUri).not.toHaveBeenCalled();
        });

        it('Should reject missing fns or ctx', async () => {
            const mockInfo = { fns: undefined, ctx: undefined };
            const result = await main(defaultMockData, mockInfo);
            expect(result).toContain('The "info.fns" cannot be undefined or null.');
            expect(mockedError).toBeCalledTimes(1);
            expect(basicAssetUri).not.toHaveBeenCalled();
        });
    });

    describe('[Main Processing Flow]', () => {
        beforeEach(() => {
          vi.clearAllMocks();
          mockedError.mockClear();
          
          // Mock SVG functions to return predictable values
          PolicyBrief.mockImplementation((opts) => ({
            light: `policy-brief-${opts.variant}`,
            dark: `policy-brief-${opts.variant}`
          }));
          CaseStudy.mockImplementation((opts) => ({
            light: `case-study-${opts.variant}`,
            dark: `case-study-${opts.variant}`
          }));
        });
      
        it('Should process valid Policy Brief data', async () => {
          const result = await main(defaultMockData, defaultMockInfo);
          
          expect(result).toContain(`<section data-component="policy-brief">
  <div class="su-mx-auto su-component-container su-container-wide">
    <div class="su-relative su-flex su-flex-col su-gap-20 su-py-30 su-px-20 su-bg-fog-light md:su-mx-50 md:su-flex-row md:su-gap-18 lg:su-gap-48 md:su-p-36 lg:su-py-61 lg:su-px-65 dark:su-bg-transparent dark:before:su-bg-black dark:before:su-opacity-[0.5] dark:before:su-content-[''] dark:before:su-absolute dark:before:su-w-full dark:before:su-h-full dark:before:su-top-0 dark:before:su-left-0 dark:before:su-z-1">
      <div class="su-relative su-w-full su-h-[233px] md:su-h-auto md:su-min-w-[257px] lg:su-h-[378.331px] lg:su-flex-1 su-z-2">
        <img src="" class="su-absolute su-size-full su-object-cover" alt="" />
      </div>

      <div class="lg:su-flex-1 su-relative su-z-2">
        <div class="su-flex su-gap-6 su-items-center su-text-18 su-font-semibold su-pb-20 md:su-pb-27">
            <span class="dark:su-hidden">[object Object]</span>
            <span class="su-hidden dark:su-block">[object Object]</span>
            <span>Policy Brief</span>
        </div>

          <h2 class="su-text-[33px] su-font-bold su-leading-[125%] su-font-serif su-pb-19 su-m-0">Test Policy Brief</h2>

          <p class="su-text-19 su-font-normal su-leading-[125%] su-pb-20 md:su-pb-27 su-m-0">Test summary content</p>

          <a href="https://example.com" class="su-flex su-gap-2 su-group su-text-19 su-font-semibold su-leading-[125%] su-text-digital-red su-no-underline dark:su-text-dark-mode-red hocus:su-underline">
            Read more
            <span class="su-transition group-hocus:su--translate-y-01em group-hocus:su-translate-x-01em [&>svg]:su-translate-y-1">
              <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up" class="svg-inline--fa fa-arrow-up fa-fw su-inline-block su-shrink-0 su-stroke-digital-red dark:su-stroke-dark-mode-red su-text-[0.9em] su-ml-04em su-transition-transform su-rotate-45 group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20">
                  <path fill="currentColor" d="M209.4 39.4C204.8 34.7 198.6 32 192 32s-12.8 2.7-17.4 7.4l-168 176c-9.2 9.6-8.8 24.8 .8 33.9s24.8 8.8 33.9-.8L168 115.9 168 456c0 13.3 10.7 24 24 24s24-10.7 24-24l0-340.1L342.6 248.6c9.2 9.6 24.3 9.9 33.9 .8s9.9-24.3 .8-33.9l-168-176z"></path>
              </svg>            </span>
          </a>
      </div>
    </div>
  </div>
</section>
`);
        });
      
        it('Should process valid Case Study data', async () => {
          const mockData = {
            ...defaultMockData,
            contentConfiguration: {
              ...defaultMockData.contentConfiguration,
              type: 'Case Study'
            }
          };
          
          const result = await main(mockData, defaultMockInfo);
          
          expect(result).toContain(`<section data-component="policy-brief">
  <div class="su-mx-auto su-component-container su-container-wide">
    <div class="su-relative su-flex su-flex-col su-gap-20 su-py-30 su-px-20 su-bg-fog-light md:su-mx-50 md:su-flex-row md:su-gap-18 lg:su-gap-48 md:su-p-36 lg:su-py-61 lg:su-px-65 dark:su-bg-transparent dark:before:su-bg-black dark:before:su-opacity-[0.5] dark:before:su-content-[''] dark:before:su-absolute dark:before:su-w-full dark:before:su-h-full dark:before:su-top-0 dark:before:su-left-0 dark:before:su-z-1">
      <div class="su-relative su-w-full su-h-[233px] md:su-h-auto md:su-min-w-[257px] lg:su-h-[378.331px] lg:su-flex-1 su-z-2">
        <img src="" class="su-absolute su-size-full su-object-cover" alt="" />
      </div>

      <div class="lg:su-flex-1 su-relative su-z-2">
        <div class="su-flex su-gap-6 su-items-center su-text-18 su-font-semibold su-pb-20 md:su-pb-27">
            <span class="dark:su-hidden">[object Object]</span>
            <span class="su-hidden dark:su-block">[object Object]</span>
            <span>Case Study</span>
        </div>

          <h2 class="su-text-[33px] su-font-bold su-leading-[125%] su-font-serif su-pb-19 su-m-0">Test Policy Brief</h2>

          <p class="su-text-19 su-font-normal su-leading-[125%] su-pb-20 md:su-pb-27 su-m-0">Test summary content</p>

          <a href="https://example.com" class="su-flex su-gap-2 su-group su-text-19 su-font-semibold su-leading-[125%] su-text-digital-red su-no-underline dark:su-text-dark-mode-red hocus:su-underline">
            Read more
            <span class="su-transition group-hocus:su--translate-y-01em group-hocus:su-translate-x-01em [&>svg]:su-translate-y-1">
              <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up" class="svg-inline--fa fa-arrow-up fa-fw su-inline-block su-shrink-0 su-stroke-digital-red dark:su-stroke-dark-mode-red su-text-[0.9em] su-ml-04em su-transition-transform su-rotate-45 group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20">
                  <path fill="currentColor" d="M209.4 39.4C204.8 34.7 198.6 32 192 32s-12.8 2.7-17.4 7.4l-168 176c-9.2 9.6-8.8 24.8 .8 33.9s24.8 8.8 33.9-.8L168 115.9 168 456c0 13.3 10.7 24 24 24s24-10.7 24-24l0-340.1L342.6 248.6c9.2 9.6 24.3 9.9 33.9 .8s9.9-24.3 .8-33.9l-168-176z"></path>
              </svg>            </span>
          </a>
      </div>
    </div>
  </div>
</section>
`);
        });
      });

      describe('[Branch Coverage Tests]', () => {
        it('Should handle undefined contentConfiguration', async () => {
          const mockData = {
            contentConfiguration: undefined
          };
          
          const result = await main(mockData, defaultMockInfo);
          
          expect(result).toContain(`<section data-component="policy-brief">
  <div class="su-mx-auto su-component-container su-container-wide">
    <div class="su-relative su-flex su-flex-col su-gap-20 su-py-30 su-px-20 su-bg-fog-light md:su-mx-50 md:su-flex-row md:su-gap-18 lg:su-gap-48 md:su-p-36 lg:su-py-61 lg:su-px-65 dark:su-bg-transparent dark:before:su-bg-black dark:before:su-opacity-[0.5] dark:before:su-content-[''] dark:before:su-absolute dark:before:su-w-full dark:before:su-h-full dark:before:su-top-0 dark:before:su-left-0 dark:before:su-z-1">
      <div class="su-relative su-w-full su-h-[233px] md:su-h-auto md:su-min-w-[257px] lg:su-h-[378.331px] lg:su-flex-1 su-z-2">
        <img src="" class="su-absolute su-size-full su-object-cover" alt="" />
      </div>

      <div class="lg:su-flex-1 su-relative su-z-2">
        <div class="su-flex su-gap-6 su-items-center su-text-18 su-font-semibold su-pb-20 md:su-pb-27">
        </div>



      </div>
    </div>
  </div>
</section>
`);
        });

        it('Should handle undefined assetData', async () => {
            // Mock basicAssetUri to return an empty object
            vi.mock('../../global/js/utils/basicAssetUri/basicAssetUri', () => ({
                basicAssetUri: vi.fn().mockResolvedValue({})
            }));
        
            const mockData = {
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    image: "matrix-asset://api-identifier/12345"
                }
            };
            
            const result = await main(mockData, defaultMockInfo);
            expect(result).toContain('<img src=""');
        });
        
      });

    describe('[Validation]', () => {
        it('Should validate image field', async () => {
            const mockedData = {
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    image: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
            expect(result).toContain('The "image" field must be a string type.');
            expect(mockedError).toBeCalledTimes(1);
            expect(basicAssetUri).not.toHaveBeenCalled();
        });

        it('Should validate type field', async () => {
            const mockedData = {
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    type: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
            expect(result).toContain('The "type" field must be a string type.');
            expect(mockedError).toBeCalledTimes(1);
            expect(basicAssetUri).not.toHaveBeenCalled();
        });

        it('Should validate type field values', async () => {
            const mockedData = {
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    type: "Invalid Type",
                }
            };
            const result = await main(mockedData, defaultMockInfo);
            expect(result).toContain('The "type" field must be one of ["Policy Brief", "Case Study"] values.');
            expect(mockedError).toBeCalledTimes(1);
            expect(basicAssetUri).not.toHaveBeenCalled();
        });

        it('Should validate title field', async () => {
            const mockedData = {
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    title: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
            expect(result).toContain('The "title" field must be a string type.');
            expect(mockedError).toBeCalledTimes(1);
            expect(basicAssetUri).not.toHaveBeenCalled();
        });

        it('Should validate summary field', async () => {
            const mockedData = {
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    summary: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
            expect(result).toContain('The "summary" field must be a string type.');
            expect(mockedError).toBeCalledTimes(1);
            expect(basicAssetUri).not.toHaveBeenCalled();
        });

        it('Should validate linkUrl field', async () => {
            const mockedData = {
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    linkUrl: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
            expect(result).toContain('The "linkUrl" field must be a string type.');
            expect(mockedError).toBeCalledTimes(1);
            expect(basicAssetUri).not.toHaveBeenCalled();
        });

        it('Should validate linkText field', async () => {
            const mockedData = {
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    linkText: 123,
                }
            };
            const result = await main(mockedData, defaultMockInfo);
            expect(result).toContain('The "linkText" field must be a string type.');
            expect(mockedError).toBeCalledTimes(1);
            expect(basicAssetUri).not.toHaveBeenCalled();
        });
    });

    describe('[Environment Validation]', () => {
        it('Should reject non-object fnsCtx', async () => {
            const mockInfo = { fns: 'not-an-object' };
            const result = await main(defaultMockData, mockInfo);
            expect(result).toContain('The "info.fns" cannot be undefined or null.');
            expect(mockedError).toBeCalledTimes(1);
            expect(basicAssetUri).not.toHaveBeenCalled();
        });

        it('Should reject fnsCtx without resolveUri', async () => {
            const mockInfo2 = { fns: {} };
            const result2 = await main(defaultMockData, mockInfo2);
            expect(result2).toContain('The "info.fns" cannot be undefined or null.');
            expect(mockedError).toBeCalledTimes(1);
            expect(basicAssetUri).not.toHaveBeenCalled();
        });
    });
});