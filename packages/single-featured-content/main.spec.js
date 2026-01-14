import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cardDataAdapter, matrixCardService, linkedHeadingService  } from "../../global/js/utils";
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    cardDataAdapter: vi.fn().mockImplementation(() => ({
        setCardService: vi.fn(),
        getCards: vi.fn().mockResolvedValue([
            {
                id: "167215",
                type: "Research",
                liveUrl: "https://news.stanford.edu/stories/2025/03/digital-tool-adhd-feedback-brain-research",
                imageUrl: "https://news.stanford.edu/__data/assets/image/0024/167217/adhd-1500x1000.jpg",
                imageAlt: "ADHD tool",
                videoUrl: "",
                date: "2025-03-20 00:00:00",
                source: null,
                authorName: "",
                authorEmail: "",
                taxonomy: "Health & Medicine",
                taxonomyUrl: "https://news.stanford.edu/research-and-scholarship/topic/health-and-medicine",
                description: "<p>In a recent study of a technique to help kids with ADHD strengthen their working memory, about half of participants showed improvements in their symptoms. The concept holds promise for other neuropsychiatric conditions, too.</p>",
                avatar: null,
                avatarAlt: null,
                imageUrlDefault: "https://news.stanford.edu/__data/assets/image/0015/130443/Quad-Arch-Close.png",
                imageAltDefault: "Arches",
                title: "Digital tool gives kids with ADHD real-time feedback on their brains ",
                assetName: "Digital tool gives kids with ADHD real-time feedback on their brains ",
                assetShortName: "Digital tool gives kids with ADHD real-time feedback on their brains ",
                assetType: "page_content"
            }
        ]),
    })),
    matrixCardService: vi.fn(),
    linkedHeadingService: vi.fn(),
    uuid: vi.fn().mockReturnValue('test-uuid-12345'),
}));

describe('[Single Featured Content Component]', () => {
    const mockFnsCtx = { resolveUri: vi.fn() };

    const defaultMockData = {
        headingConfiguration: {
            title: "Welcome to Stanford University!",
            ctaText: "View all",
            ctaUrl: "matrix-asset://stanfordNews/28397"
        },
        contentConfiguration: {
            source: "matrix-asset://stanfordNews/162618",
            description: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>"
        }
    };

    const defaultMockInfo = {
        env: {
            API_IDENTIFIER: 'stanfordNews',
            BASE_DOMAIN: 'https://google.com'
        },
        fns: mockFnsCtx
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // No error handling, the component always outputs, even if there is no data

    // Check if HTML structure is rendered correctly
    describe('[Main function]', () => {
        it('Should return the expected HTML with valid data', async () => {
            linkedHeadingService.mockResolvedValueOnce({
                title: "Sample Heading",
                ctaText: "Learn More",
                ctaLink: "https://example.com",
                ctaNewWindow: false
            });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component='single-featured-content'><div class="su-mx-auto su-component-container su-container-large su-container-px"><div class="su-component-line-heading su-flex su-flex-wrap su-items-baseline su-gap-5 su-gap-x-13 md:su-gap-13"><h2 class="su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white su-text-black" data-se="headingTitle">Sample Heading</h2><hr aria-hidden="true" class="md:su-mb-11 lg:su-mb-15 su-grow su-border-none su-bg-gradient-light-red-h su-h-4"/><a data-test="cta" href="https://example.com" class="su-group su-flex su-no-underline hocus:su-underline su-transition su-items-center md:su-items-end md:su-mb-8 lg:su-mb-12 su-flex-nowrap su-align-baseline su-gap-20 md:su-gap-13 su-text-19 su-decoration-2 dark:su-text-white su-text-black hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red"><span class="su-flex su-gap-2 su-items-baseline"><span data-se="headingCtaText">Learn More<span class="sr-only">Sample Heading</span></span><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" class="svg-inline--fa fa-chevron-right fa-fw su-text-14 group-hocus:su-translate-x-02em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="18" ><path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path></svg></span></a></div><div class='su-single-featured-content md:su-px-[6.4rem] lg:su-px-[122.5px]'>
                  <article aria-label="Digital tool gives kids with ADHD real-time feedback on their brains " class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                      <div class="su-mb-15 md:su-mb-26 lg:su-mb-38">
                      
                  <div class="su-component-card-thumbnail su-w-full su-h-full">
                    
                  <span
                    class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]"
                  >
                    
                    
                      <img
                        class="su-absolute su-object-cover su-object-center su-size-full"
                        src="https://news.stanford.edu/__data/assets/image/0024/167217/adhd-1500x1000.jpg"
                        alt="ADHD tool"
                      />
                    
                    
                  </span>
                
                  </div>
                
                      </div>
                    

                    <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-13 lg:su-gap-13">
                      
                        <h2 class="su-w-full su-text-[35px] md:su-text-[40px] lg:su-text-[43px] su-leading-[42px] md:su-leading-[48px] lg:su-leading-[51.6px] su-font-serif su-my-0 su-order-2">
                          
                  <a href="https://news.stanford.edu/stories/2025/03/digital-tool-adhd-feedback-brain-research" 
                     class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                    <span>Digital tool gives kids with ADHD real-time feedback on their brains </span>
                    
                  </a>
                
                        </h2>
                      

                      
                        <span data-testid="vertical-card-taxonomy"
                              class="su-relative su-inline-block su-z-10 su-font-semibold su-order-1 su-text-20 md:su-text-20 su-leading-[26px]">
                          <a href="https://news.stanford.edu/research-and-scholarship/topic/health-and-medicine"
                             class="su-text-digital-red dark:su-text-dark-mode-red su-no-underline hocus:su-underline hocus:su-text-black hocus:dark:su-text-white focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-black dark:focus-visible:su-ring-white focus-visible:su-outline-none">
                            Health & Medicine
                          </a>
                        </span>
                      

                      
                        <p data-testid="vertical-card-type"
                           class="su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3 su-text-18 su-leading-[23.4px] md:su-text-20 md:su-leading-[26px] lg:su-text-20 lg:su-leading-[26px]">
                            
                  <svg
                      aria-hidden="true"
                      data-testid="svg-research"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                  >
                      <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z" />
                  </svg>
                          <span>Research</span>
                        </p>
                      

                      
                        <div class="su-mb-0 su-w-full [&>*:last-child]:su-mb-0 su-order-4 *:su-text-18 su-text-18 *:md:su-text-19 md:su-text-19 *:su-leading-[22.5px] su-leading-[22.5px] *:md:su-leading-[23.75px] md:su-leading-[23.75px] *:su-mt-4 *:md:su-mt-14" data-se="featDesc">
                          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>
                      
                    </div>
                  </article>
                </div></div></section>"
            `);
        });

        it('Should return the expected HTML with valid data', async () => {
            linkedHeadingService.mockResolvedValueOnce({
                title: "Sample Heading",
                ctaText: "Learn More",
                ctaLink: "https://example.com",
                ctaNewWindow: false
            });

            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    ctaNewWindow: '<p></p>'
                }
            };
            
            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component='single-featured-content'><div class="su-mx-auto su-component-container su-container-large su-container-px"><div class="su-component-line-heading su-flex su-flex-wrap su-items-baseline su-gap-5 su-gap-x-13 md:su-gap-13"><h2 class="su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white su-text-black" data-se="headingTitle">Sample Heading</h2><hr aria-hidden="true" class="md:su-mb-11 lg:su-mb-15 su-grow su-border-none su-bg-gradient-light-red-h su-h-4"/><a data-test="cta" href="https://example.com" class="su-group su-flex su-no-underline hocus:su-underline su-transition su-items-center md:su-items-end md:su-mb-8 lg:su-mb-12 su-flex-nowrap su-align-baseline su-gap-20 md:su-gap-13 su-text-19 su-decoration-2 dark:su-text-white su-text-black hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red"><span class="su-flex su-gap-2 su-items-baseline"><span data-se="headingCtaText">Learn More<span class="sr-only">Sample Heading</span></span><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" class="svg-inline--fa fa-chevron-right fa-fw su-text-14 group-hocus:su-translate-x-02em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="18" ><path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path></svg></span></a></div><div class='su-single-featured-content md:su-px-[6.4rem] lg:su-px-[122.5px]'>
                  <article aria-label="Digital tool gives kids with ADHD real-time feedback on their brains " class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                      <div class="su-mb-15 md:su-mb-26 lg:su-mb-38">
                      
                  <div class="su-component-card-thumbnail su-w-full su-h-full">
                    
                  <span
                    class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]"
                  >
                    
                    
                      <img
                        class="su-absolute su-object-cover su-object-center su-size-full"
                        src="https://news.stanford.edu/__data/assets/image/0024/167217/adhd-1500x1000.jpg"
                        alt="ADHD tool"
                      />
                    
                    
                  </span>
                
                  </div>
                
                      </div>
                    

                    <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-13 lg:su-gap-13">
                      
                        <h2 class="su-w-full su-text-[35px] md:su-text-[40px] lg:su-text-[43px] su-leading-[42px] md:su-leading-[48px] lg:su-leading-[51.6px] su-font-serif su-my-0 su-order-2">
                          
                  <a href="https://news.stanford.edu/stories/2025/03/digital-tool-adhd-feedback-brain-research" 
                     class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                    <span>Digital tool gives kids with ADHD real-time feedback on their brains </span>
                    
                  </a>
                
                        </h2>
                      

                      
                        <span data-testid="vertical-card-taxonomy"
                              class="su-relative su-inline-block su-z-10 su-font-semibold su-order-1 su-text-20 md:su-text-20 su-leading-[26px]">
                          <a href="https://news.stanford.edu/research-and-scholarship/topic/health-and-medicine"
                             class="su-text-digital-red dark:su-text-dark-mode-red su-no-underline hocus:su-underline hocus:su-text-black hocus:dark:su-text-white focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-black dark:focus-visible:su-ring-white focus-visible:su-outline-none">
                            Health & Medicine
                          </a>
                        </span>
                      

                      
                        <p data-testid="vertical-card-type"
                           class="su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3 su-text-18 su-leading-[23.4px] md:su-text-20 md:su-leading-[26px] lg:su-text-20 lg:su-leading-[26px]">
                            
                  <svg
                      aria-hidden="true"
                      data-testid="svg-research"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                  >
                      <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z" />
                  </svg>
                          <span>Research</span>
                        </p>
                      

                      
                        <div class="su-mb-0 su-w-full [&>*:last-child]:su-mb-0 su-order-4 *:su-text-18 su-text-18 *:md:su-text-19 md:su-text-19 *:su-leading-[22.5px] su-leading-[22.5px] *:md:su-leading-[23.75px] md:su-leading-[23.75px] *:su-mt-4 *:md:su-mt-14" data-se="featDesc">
                          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>
                      
                    </div>
                  </article>
                </div></div></section>"
            `);
        });

        it('Should set default ctaLink if ctaLink is empty', async () => {
            let linkedData = {
                title: "Sample Heading",
                ctaText: "Learn More",
                ctaLink: "",
                ctaNewWindow: false
            };
            
            linkedHeadingService.mockResolvedValueOnce(linkedData);

            const result = await main(defaultMockData, defaultMockInfo);

            linkedData.ctaLink = `${defaultMockInfo.env.BASE_DOMAIN}${defaultMockInfo.env.BASE_PATH}${defaultMockInfo.env.NEWS_ARCHIVE_PATH}`;

            expect(result).toMatchInlineSnapshot(`
              "<section data-component='single-featured-content'><div class="su-mx-auto su-component-container su-container-large su-container-px"><div class="su-component-line-heading su-flex su-flex-wrap su-items-baseline su-gap-5 su-gap-x-13 md:su-gap-13"><h2 class="su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white su-text-black" data-se="headingTitle">Sample Heading</h2><hr aria-hidden="true" class="md:su-mb-11 lg:su-mb-15 su-grow su-border-none su-bg-gradient-light-red-h su-h-4"/></div><div class='su-single-featured-content md:su-px-[6.4rem] lg:su-px-[122.5px]'>
                  <article aria-label="Digital tool gives kids with ADHD real-time feedback on their brains " class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                      <div class="su-mb-15 md:su-mb-26 lg:su-mb-38">
                      
                  <div class="su-component-card-thumbnail su-w-full su-h-full">
                    
                  <span
                    class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]"
                  >
                    
                    
                      <img
                        class="su-absolute su-object-cover su-object-center su-size-full"
                        src="https://news.stanford.edu/__data/assets/image/0024/167217/adhd-1500x1000.jpg"
                        alt="ADHD tool"
                      />
                    
                    
                  </span>
                
                  </div>
                
                      </div>
                    

                    <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-13 lg:su-gap-13">
                      
                        <h2 class="su-w-full su-text-[35px] md:su-text-[40px] lg:su-text-[43px] su-leading-[42px] md:su-leading-[48px] lg:su-leading-[51.6px] su-font-serif su-my-0 su-order-2">
                          
                  <a href="https://news.stanford.edu/stories/2025/03/digital-tool-adhd-feedback-brain-research" 
                     class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                    <span>Digital tool gives kids with ADHD real-time feedback on their brains </span>
                    
                  </a>
                
                        </h2>
                      

                      
                        <span data-testid="vertical-card-taxonomy"
                              class="su-relative su-inline-block su-z-10 su-font-semibold su-order-1 su-text-20 md:su-text-20 su-leading-[26px]">
                          <a href="https://news.stanford.edu/research-and-scholarship/topic/health-and-medicine"
                             class="su-text-digital-red dark:su-text-dark-mode-red su-no-underline hocus:su-underline hocus:su-text-black hocus:dark:su-text-white focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-black dark:focus-visible:su-ring-white focus-visible:su-outline-none">
                            Health & Medicine
                          </a>
                        </span>
                      

                      
                        <p data-testid="vertical-card-type"
                           class="su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3 su-text-18 su-leading-[23.4px] md:su-text-20 md:su-leading-[26px] lg:su-text-20 lg:su-leading-[26px]">
                            
                  <svg
                      aria-hidden="true"
                      data-testid="svg-research"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                  >
                      <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z" />
                  </svg>
                          <span>Research</span>
                        </p>
                      

                      
                        <div class="su-mb-0 su-w-full [&>*:last-child]:su-mb-0 su-order-4 *:su-text-18 su-text-18 *:md:su-text-19 md:su-text-19 *:su-leading-[22.5px] su-leading-[22.5px] *:md:su-leading-[23.75px] md:su-leading-[23.75px] *:su-mt-4 *:md:su-mt-14" data-se="featDesc">
                          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>
                      
                    </div>
                  </article>
                </div></div></section>"
            `);
        });

        it('Should call cardDataAdapter and matrixCardService', async () => {
            linkedHeadingService.mockResolvedValueOnce({
                title: "Sample Heading",
                ctaText: "Learn More",
                ctaLink: "https://example.com",
                ctaNewWindow: false
            });

            await main(defaultMockData, defaultMockInfo);

            expect(cardDataAdapter).toHaveBeenCalled();
            expect(matrixCardService).toHaveBeenCalled();
        });
    });

    describe("[Edge cases]", () => {
        it("Should throw an error when getCards will fail", async () => {
            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockRejectedValueOnce(new Error('No cards')),
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<!-- Error occurred in the Single featured content');
        });

        it("Should throw an error when getCards will return an empty array", async () => {
            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue([]),
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<!-- Error occurred in the Single featured content component: The "data" cannot be undefined or null. The [] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });
});
