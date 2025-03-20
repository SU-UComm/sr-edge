import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import xss from "xss";
import { uuid } from "../../global/js/utils";
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    uuid: vi.fn(),
}))

describe('[Content Carousel]', () => {
    const defaultMockData = {
        title: 'Sample Title',
        slides: [
            {
                content: '<div class="test-content">Test Content 1</div>'
            },
            {
                content: '<div class="test-content">Test Content 2</div>'
            }
        ]
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters were provided', async () => {
            const result = await main();
            
            expect(result).toContain(`<!-- Error occurred in the Content Carousel component: Cannot read properties of undefined (reading 'length') -->`);
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when title is not a string', async () => {
            const mockData = {
                title: 123,
                slides: defaultMockData.slides
            };

            const result = await main(mockData);
            
            expect(result).toContain('<!-- Error occurred in the Content Carousel component: The "title" field must be a string. Received: 123 -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when slides is not an array', async () => {
            const mockData = {
                title: 'Sample Title',
                slides: 'not an array'
            };

            const result = await main(mockData);
            
            expect(result).toContain('<!-- Error occurred in the Content Carousel component: The "slides" array must have at least one item. Received length: 12 -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when slides array is empty', async () => {
            const mockData = {
                title: 'Sample Title',
                slides: []
            };

            const result = await main(mockData);
            
            expect(result).toContain('<!-- Error occurred in the Content Carousel component: The "slides" array must have at least one item. Received length: 0 -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        beforeAll(() => {
            uuid.mockReturnValue('36bcda50-8e16-4255-a8aa-d558dd550b8b');
        });

        it('Should return the expected HTML with valid data', async () => {
            const result = await main(defaultMockData);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component='content-carousel' data-unique-id='36bcda50-8e16-4255-a8aa-d558dd550b8b'>
                  <div class='su-mx-auto su-component-container su-container-narrow su-container-px'>
                      <div class='su-bg-fog-light dark:su-bg-black su-p-20 md:su-pt-36 md:su-px-36 md:su-pb-26'>
                          <div class='su-relative su-mb-38 su-overflow-hidden'>
                              <h3 class='su-relative su-text-23 su-leading-[119.415%] su-z-20 su-font-black su-mb-0 su-inline su-pr-10 su-m-0'>
                                  Sample Title
                              </h3>
                              <span class='su-w-full su-bg-black-40 dark:su-bg-black-70 su-h-1 su-absolute su-bottom-4'></span>
                          </div>
              <div class="component-slider">
                  <div class="swiper swiper-initialized swiper-horizontal swiper-pointer-events swiper-watch-progress component-slider-single swiper-backface-hidden">
                      <div class="swiper-wrapper">
                                          <div class="swiper-slide">
                                              <div>Test Content 1</div>
                                          </div>
                                          <div class="swiper-slide">
                                              <div>Test Content 2</div>
                                          </div>
                      </div>
                  </div>
                  <div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center">
                      <nav aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination-36bcda50-8e16-4255-a8aa-d558dd550b8b su-mr-full swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal"></nav>
                      <button class="component-slider-btn component-slider-prev" type="button">
                          <span class="sr-only">Previous</span>
                          <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                              <svg
                                  class='su-fill-transparent su-stroke-current '
                                  data-testid='svg-chevron-right'
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='18'
                                  height='19'
                                  viewBox='0 0 18 19'
                                  fill='none'
                                  aria-hidden
                              >
                                  <path
                                      d='M6.75 4.25L12 9.5L6.75 14.75'
                                      stroke-width='2'
                                      stroke-linecap='round'
                                      stroke-linejoin='round'
                                  />
                              </svg>            </span>
                      </button>
                      <button class="component-slider-btn component-slider-next" type="button">
                          <span class="sr-only">Next</span>
                          <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                              <svg
                                  class='su-fill-transparent su-stroke-current '
                                  data-testid='svg-chevron-right'
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='18'
                                  height='19'
                                  viewBox='0 0 18 19'
                                  fill='none'
                                  aria-hidden
                              >
                                  <path
                                      d='M6.75 4.25L12 9.5L6.75 14.75'
                                      stroke-width='2'
                                      stroke-linecap='round'
                                      stroke-linejoin='round'
                                  />
                              </svg>            </span>
                      </button>
                  </div>
              </div>        </div>
                  </div>
              </section>"
            `);
        });

        it('Should generate a unique class ID based on uuid', async () => {
            const result = await main(defaultMockData);
            const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
            
            expect(result).toMatch(uuidRegex);
        });

        it('Should handle empty slide content gracefully', async () => {
            const mockData = {
              title: 'Sample Title',
              slides: [{
                content: ''
              }]
            };
            const result = await main(mockData);
            expect(result).toContain('<div class="swiper-slide">');
            expect(result).toContain('</div>');
          });
        
        it('Should preserve valid HTML structure in slide content', async () => {
            const mockData = {
              title: 'Sample Title',
              slides: [{
                content: '<div class="valid-content">Test</div>'
              }]
            };
            const result = await main(mockData);
            expect(result).toMatchInlineSnapshot(`
              "<section data-component='content-carousel' data-unique-id='36bcda50-8e16-4255-a8aa-d558dd550b8b'>
                  <div class='su-mx-auto su-component-container su-container-narrow su-container-px'>
                      <div class='su-bg-fog-light dark:su-bg-black su-p-20 md:su-pt-36 md:su-px-36 md:su-pb-26'>
                          <div class='su-relative su-mb-38 su-overflow-hidden'>
                              <h3 class='su-relative su-text-23 su-leading-[119.415%] su-z-20 su-font-black su-mb-0 su-inline su-pr-10 su-m-0'>
                                  Sample Title
                              </h3>
                              <span class='su-w-full su-bg-black-40 dark:su-bg-black-70 su-h-1 su-absolute su-bottom-4'></span>
                          </div>
              <div class="component-slider">
                  <div class="swiper swiper-initialized swiper-horizontal swiper-pointer-events swiper-watch-progress component-slider-single swiper-backface-hidden">
                      <div class="swiper-wrapper">
                                          <div class="swiper-slide">
                                              <div>Test</div>
                                          </div>
                      </div>
                  </div>
                  <div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center">
                      <nav aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination-36bcda50-8e16-4255-a8aa-d558dd550b8b su-mr-full swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal"></nav>
                      <button class="component-slider-btn component-slider-prev" type="button">
                          <span class="sr-only">Previous</span>
                          <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                              <svg
                                  class='su-fill-transparent su-stroke-current '
                                  data-testid='svg-chevron-right'
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='18'
                                  height='19'
                                  viewBox='0 0 18 19'
                                  fill='none'
                                  aria-hidden
                              >
                                  <path
                                      d='M6.75 4.25L12 9.5L6.75 14.75'
                                      stroke-width='2'
                                      stroke-linecap='round'
                                      stroke-linejoin='round'
                                  />
                              </svg>            </span>
                      </button>
                      <button class="component-slider-btn component-slider-next" type="button">
                          <span class="sr-only">Next</span>
                          <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                              <svg
                                  class='su-fill-transparent su-stroke-current '
                                  data-testid='svg-chevron-right'
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='18'
                                  height='19'
                                  viewBox='0 0 18 19'
                                  fill='none'
                                  aria-hidden
                              >
                                  <path
                                      d='M6.75 4.25L12 9.5L6.75 14.75'
                                      stroke-width='2'
                                      stroke-linecap='round'
                                      stroke-linejoin='round'
                                  />
                              </svg>            </span>
                      </button>
                  </div>
              </div>        </div>
                  </div>
              </section>"
            `);
        });

        it('Should escape XSS in content', async () => {
            const mockData = {
                ...defaultMockData,
                slides: [
                    {
                        content: '<script>alert("xss")</script>',
                    },
                    {
                        content: '<img src=x onerror=alert(1)>',
                    },
                ],
            };

            const result = await moduleToTest.main(mockData);

            expect(result).toContain(xss('<script>alert("xss")</script>'));
            expect(result).toContain(xss('<img src=x onerror=alert(1)>'));
            expect(result).not.toContain('<script>alert("xss")</script>');
            expect(result).not.toContain('<img src=x onerror=alert(1)>');
        });
    });

});