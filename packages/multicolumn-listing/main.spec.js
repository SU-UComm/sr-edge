import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cardDataAdapter, funnelbackCardService, matrixCardService, linkedHeadingService } from "../../global/js/utils";
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    cardDataAdapter: vi.fn().mockImplementation(() => ({
        setCardService: vi.fn(),
        getCards: vi.fn().mockResolvedValue([
            {
                "type": "Research",
                "title": "New Lagunita signs alert visitors to basin’s usage",
                "liveUrl": "https://example.com/",
                "description": "<p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>",
                "imageUrl": "https://picsum.photos/400/400",
                "imageAlt": "",
                "taxonomy": null,
                "taxonomyUrl": null,
                "videoUrl": "",
                "date": "2024-01-01 00:00:00",
                "source": null,
                "authorName": null,
                "authorEmail": null
            },
            {
                "type": "Research",
                "title": "New Lagunita signs alert visitors to basin’s usage",
                "liveUrl": "https://example.com",
                "description": "<p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>",
                "imageUrl": "https://picsum.photos/400/400",
                "imageAlt": "",
                "taxonomy": null,
                "taxonomyUrl": null,
                "videoUrl": "",
                "date": "2024-01-01 00:00:00",
                "source": null,
                "authorName": null,
                "authorEmail": null
            },
            {
                "type": "Research",
                "title": "New Lagunita signs alert visitors to basin’s usage",
                "liveUrl": "https://example.com",
                "description": "<p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>",
                "imageUrl": "https://picsum.photos/400/400",
                "imageAlt": "",
                "taxonomy": null,
                "taxonomyUrl": null,
                "videoUrl": "",
                "date": "2024-01-01 00:00:00",
                "source": null,
                "authorName": null,
                "authorEmail": null
            }
        ]),
    })),
    funnelbackCardService: vi.fn(),
    matrixCardService: vi.fn(),
    linkedHeadingService: vi.fn().mockResolvedValue({
        title: 'Sample Heading',
        ctaText: 'Learn More',
        ctaLink: 'https://example.com',
        ctaNewWindow: false
    }),
    faIcon: {
        "ChevronRight": [`<svg class="su-fill-transparent su-stroke-current" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden=""><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`],
        "CirclePlay": [`<svg class="su-fill-transparent su-stroke-current" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden=""><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`]
    },
    multicolumnGrid: vi.fn().mockImplementation(()=>`<div class="su-w-full su-component-multicolumn">
    <div class="su-relative su-flex su-flex-wrap md:su-flex-nowrap su-flex-1 su-place-content-between su-gap-34 md:su-gap-72 lg:su-gap-[160px]">
    
          <div data-test="column-0" class="su-relative su-grow md:su-basis-1/3 ">
          
  <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
  
      <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
          
  <div classname="su-component-card-thumbnail su-w-full su-h-full">
  <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
      <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
  </span>

      </div>
      
      <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
          <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
              <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                  New Lagunita signs alert visitors to basin’s usage
                  
              </a>
          </h2>
          
          
          <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
              
  <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
      <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
  </svg>
              <span>Research</span>
          </p>
          
          
          <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
              <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
          </div>
          
      </div>
  </div></article>
          </div>
          
          <div data-test="column-1" class="su-relative su-grow md:su-basis-1/3 ">
          
              <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
  
                  <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                      
              <div classname="su-component-card-thumbnail su-w-full su-h-full">
              <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                  <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
              </span>
          
                  </div>
                  
                  <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                      <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                          <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                              New Lagunita signs alert visitors to basin’s usage
                              
                          </a>
                      </h2>
                      
                      
                      <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                          
              <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                  <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
              </svg>
                          <span>Research</span>
                      </p>
                      
                      
                      <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                          <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                      </div>
                      
                  </div>
              </div></article>
          </div>
          
          <div data-test="column-2" class="su-relative su-grow md:su-basis-1/3 ">
          
              <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
  
                  <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                      
              <div classname="su-component-card-thumbnail su-w-full su-h-full">
              <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                  <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
              </span>
          
                  </div>
                  
                  <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                      <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                          <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                              New Lagunita signs alert visitors to basin’s usage
                              
                          </a>
                      </h2>
                      
                      
                      <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                          
              <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                  <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
              </svg>
                          <span>Research</span>
                      </p>
                      
                      
                      <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                          <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                      </div>
                      
                  </div>
              </div></article>
          </div>
          
    </div>
  </div>`),
}));

vi.mock('../../global/js/helpers', () => ({
    LinkedHeading: vi.fn().mockReturnValue('<div class="linked-heading">Linked Heading</div>'),
    Card: vi.fn().mockImplementation(({ data }) => `<div class="card"><h2>${data?.title}</h2>${data?.description ? `<span>${data.description}</span>`: ''}</div>`),
    Modal: vi.fn().mockReturnValue('ModalHTML'),
    EmbedVideo: vi.fn().mockReturnValue('<iframe width="560" height="315" class="" src="https://example.com?autoplay=1&controls=1&rel=0" title="Watch Remembering Oct. 7 and learning about Israel, Gaza, and the Middle East" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe" ></iframe>')
}));

describe('[Multicolumn listing]', () => {
    const mockFnsCtx = {
        resolveUri: vi.fn()
    };

    const defaultMockData = {
        headingConfiguration: {
            title: "Multicolumn Listing",
            ctaText: "View all",
            ctaUrl: "matrix-asset://api-identifier/89422",
            ctaNewWindow: true
        },
        contentConfiguration: {
            source: "Select",
            cards: [
                {
                    type: "Research",
                    title: "New Lagunita signs alert visitors to basin’s usage",
                    liveUrl: "https://example.com",
                    description: "<p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>",
                    imageUrl: "https://picsum.photos/400/400",
                    imageAlt: "",
                    taxonomy: null,
                    taxonomyUrl: null,
                    videoUrl: "",
                    date: "2024-01-01 00:00:00",
                    source: null,
                    authorName: null,
                    authorEmail: null
                },
                {
                    type: "Research",
                    title: "New Lagunita signs alert visitors to basin’s usage",
                    liveUrl: "https://example.com",
                    description: "<p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>",
                    imageUrl: "https://picsum.photos/400/400",
                    imageAlt: "",
                    taxonomy: null,
                    taxonomyUrl: null,
                    videoUrl: "",
                    date: "2024-01-01 00:00:00",
                    source: null,
                    authorName: null,
                    authorEmail: null
                },
                {
                    type: "Research",
                    title: "New Lagunita signs alert visitors to basin’s usage",
                    liveUrl: "https://example.com",
                    description: "<p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>",
                    imageUrl: "https://picsum.photos/400/400",
                    imageAlt: "",
                    taxonomy: null,
                    taxonomyUrl: null,
                    videoUrl: "",
                    date: "2024-01-01 00:00:00",
                    source: null,
                    authorName: null,
                    authorEmail: null
                }
            ]
        },
        displayConfiguration: {
            displayThumbnails: true,
            displayDescriptions: true
        }
    };

    const defaultMockInfo = {
        fns: mockFnsCtx,
        set: {
            environment: {
                FB_JSON_URL: 'exampleUrl',
                API_IDENTIFIER: 'exampleId',
                BASE_DOMAIN: 'exampleDomain'
            }
        }
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no env variables were provided.', async () => {
            const result = await main();
            
            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when FB_JSON_URL is empty string.', async () => {
            const customMockInfo = {
                ...defaultMockInfo, 
                set: { 
                    environment: {
                        ...defaultMockInfo.set.environment, 
                        FB_JSON_URL: '' 
                    }
                }
            };

            const result = await main({},customMockInfo);
            
            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The "" was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when FB_JSON_URL is not a string.', async () => {
            const customMockInfo = {
                ...defaultMockInfo, 
                set: { 
                    environment: {
                        ...defaultMockInfo.set.environment, 
                        FB_JSON_URL: 123 
                    }
                }
            };

            const result = await main({},customMockInfo);

            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The 123 was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when API_IDENTIFIER is empty string.', async () => {
            const customMockInfo = {
                ...defaultMockInfo, 
                set: { 
                    environment: {
                        ...defaultMockInfo.set.environment, 
                        API_IDENTIFIER: '' 
                    }
                }
            };

            const result = await main({},customMockInfo);

            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The "" was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when API_IDENTIFIER is not a string.', async () => {
            const customMockInfo = {
                ...defaultMockInfo, 
                set: { 
                    environment: {
                        ...defaultMockInfo.set.environment, 
                        API_IDENTIFIER: 123 
                    }
                }
            };
            
            const result = await main({},customMockInfo);
            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The 123 was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when BASE_DOMAIN is empty string.', async () => {
            const customMockInfo = {
                ...defaultMockInfo, 
                set: { 
                    environment: {
                        ...defaultMockInfo.set.environment, 
                        BASE_DOMAIN: '' 
                    }
                }
            };
            
            const result = await main({},customMockInfo);
            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The "" was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when BASE_DOMAIN is not a string.', async () => {
            const customMockInfo = {
                ...defaultMockInfo, 
                set: { 
                    environment: {
                        ...defaultMockInfo.set.environment, 
                        BASE_DOMAIN: 123
                    }
                }
            };
            
            const result = await main({},customMockInfo);
            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The 123 was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when fnsCtx is not an object.', async () => {
            const customMockInfo = {
                ...defaultMockInfo, 
                fns: 'string', 
                ctx: 'string'
            };

            const result = await main({},customMockInfo);
            
            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "info.fns" cannot be undefined or null. The "string" was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fnsCtx is is undefined.', async () => {
            const customMockInfo = {
                ...defaultMockInfo, 
                fns: undefined, 
                ctx: undefined
            };

            const result = await main({},customMockInfo);
            
            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "info.fns" cannot be undefined or null. The {} was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when args does not exist', async () => {
            const result = await main(undefined, defaultMockInfo);
            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "source" field cannot be undefined and must be one of ['Search', 'Select'] value, undefined was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });
    
        it('Should throw an error when title is not a string', async () => {
            const customMockData = { 
                ...defaultMockData, 
                headingConfiguration: { 
                    ...defaultMockData.headingConfiguration, 
                    title: {} 
                } 
            };

            const result = await main(customMockData, defaultMockInfo);

            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "title" field must be a string. The {} was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });
    
        it('Should throw an error when ctaUrl is not a string', async () => {
            const customMockData = { 
                ...defaultMockData, 
                headingConfiguration: { 
                    ...defaultMockData.headingConfiguration, 
                    ctaUrl: {}
                } 
            };

            const result = await main(customMockData, defaultMockInfo);
            
            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "ctaUrl" field must be a string. The {} was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });
    
        it('Should throw an error when ctaManualUrl is not a string', async () => {
            const customMockData = { 
                ...defaultMockData, 
                headingConfiguration: { 
                    ...defaultMockData.headingConfiguration, 
                    ctaManualUrl: {} 
                } 
            };

            const result = await main(customMockData, defaultMockInfo);

            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "ctaManualUrl" field must be a string. The {} was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });
    
        it('Should throw an error when ctaText is not a string', async () => {
            const customMockData = { 
                ...defaultMockData, 
                headingConfiguration: { 
                    ...defaultMockData.headingConfiguration, 
                    ctaText: {} 
                } 
            };

            const result = await main(customMockData, defaultMockInfo);

            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "ctaText" field must be a string. The {} was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });
    
        it('Should throw an error when ctaNewWindow is not a boolean', async () => {
            const customMockData = { 
                ...defaultMockData, 
                headingConfiguration: { 
                    ...defaultMockData.headingConfiguration, 
                    ctaNewWindow: 'not_boolean' 
                } 
            };

            const result = await main(customMockData, defaultMockInfo);

            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "ctaNewWindow" field must be a boolean. The "not_boolean" was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when source is undefined', async () => {
            const customMockData = { 
                ...defaultMockData, 
                contentConfiguration: { 
                    ...defaultMockData.contentConfiguration, 
                    source: undefined 
                } 
            };

            const result = await main(customMockData, defaultMockInfo);

            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "source" field cannot be undefined and must be one of ['Search', 'Select'] value, undefined was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });
    
        it('Should throw an error when source is not a string', async () => {
            const customMockData = { 
                ...defaultMockData, 
                contentConfiguration: { 
                    ...defaultMockData.contentConfiguration, 
                    source: {} 
                } 
            };

            const result = await main(customMockData, defaultMockInfo);

            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "source" field cannot be undefined and must be one of ['Search', 'Select'] value, {} was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when source is not one of ["Select", "Search"] value', async () => {
            const customMockData = { 
                ...defaultMockData, 
                contentConfiguration: { 
                    ...defaultMockData.contentConfiguration, 
                    source: "test" 
                } 
            };

            const result = await main(customMockData, defaultMockInfo);

            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "source" field cannot be undefined and must be one of ['Search', 'Select'] value, "test" was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when searchMaxCards is not a number', async () => {
            const customMockData = { 
                ...defaultMockData, 
                contentConfiguration: { 
                    ...defaultMockData.contentConfiguration, 
                    source: 'Search',
                    searchQuery: '?test-query=test-value',
                    searchMaxCards: 'not a number' 
                } 
            };

            const result = await main(customMockData, defaultMockInfo);

            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "searchMaxCards" field cannot be undefined and must be a number between 2 and 3. The "not a number" was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when searchMaxCards is not one of [2, 3]', async () => {
            const customMockData = { 
                ...defaultMockData, 
                contentConfiguration: { 
                    ...defaultMockData.contentConfiguration, 
                    source: 'Search',
                    searchQuery: '?test-query=test-value',
                    searchMaxCards: 4
                } 
            };

            const result = await main(customMockData, defaultMockInfo);

            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "searchMaxCards" field cannot be undefined and must be a number between 2 and 3. The 4 was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });
    
        it('Should throw an error when searchQuery not a string', async () => {
            const mockData = {
                ...defaultMockData, 
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration, 
                    source: "Search", 
                    searchMaxCards: 3, 
                    searchQuery: 123
                }
            }

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "searchQuery" field cannot be undefined and must be a non-empty string. The 123 was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when searchQuery is empty strong', async () => {
            const mockData = {
                ...defaultMockData, 
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration, 
                    source: "Search", 
                    searchMaxCards: 3, 
                    searchQuery: ""
                }
            }

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "searchQuery" field cannot be undefined and must be a non-empty string. The "" was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when searchQuery contains only "?"', async () => {
            const mockData = {
                ...defaultMockData, 
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration, 
                    source: "Search", 
                    searchMaxCards: 3, 
                    searchQuery: "?"
                }
            }

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "searchQuery" field cannot be undefined and must be a non-empty string. The "?" was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when cards was not an array', async () => {
            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    source: 'Select',
                    cards: 'test'
                }
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Multicolumn listing component: The "cards" field must be an array. The "test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when displayDescriptions is not a boolean', async () => {
            const customMockData = { 
                ...defaultMockData, 
                displayConfiguration: { 
                    ...defaultMockData.displayConfiguration, 
                    displayDescriptions: 'not_boolean' 
                } 
            };

            const result = await main(customMockData, defaultMockInfo);

            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "displayDescriptions" field must be a boolean. The "not_boolean" was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });
    
        it('Should throw an error when displayThumbnails is not a boolean', async () => {
            const customMockData = { 
                ...defaultMockData, 
                displayConfiguration: { 
                    ...defaultMockData.displayConfiguration, 
                    displayThumbnails: 'not_boolean' 
                } 
            };

            const result = await main(customMockData, defaultMockInfo);

            expect(result).toBe(`<!-- Error occurred in the Multicolumn listing component: The "displayThumbnails" field must be a boolean. The "not_boolean" was received. -->`);
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        describe('[Main Function - Source: Select]', () => {
            it('Should return the expected HTML with valid data for Select source', async () => {
                cardDataAdapter.mockImplementationOnce(() => ({
                    setCardService: vi.fn(),
                    getCards: vi.fn().mockResolvedValue([
                        { title: 'Featured Card - Select' },
                        { title: 'Card 1 - Select' },
                        { title: 'Card 2 - Select' }
                    ])
                }));
    
                const result = await main(defaultMockData, defaultMockInfo);
    
                expect(result).toMatchInlineSnapshot(`
                  "<section data-component="multicolumn-listing">
                      <div class="component-multicolumn-listing has-title">
                          <div class="su-mx-auto su-component-container su-container-large su-container-px">    
                              <div class="linked-heading">Linked Heading</div>
                              <div class="su-w-full su-component-multicolumn">
                      <div class="su-relative su-flex su-flex-wrap md:su-flex-nowrap su-flex-1 su-place-content-between su-gap-34 md:su-gap-72 lg:su-gap-[160px]">
                      
                            <div data-test="column-0" class="su-relative su-grow md:su-basis-1/3 ">
                            
                    <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                        <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                            
                    <div classname="su-component-card-thumbnail su-w-full su-h-full">
                    <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                        <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
                    </span>

                        </div>
                        
                        <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                            <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                                <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                                    New Lagunita signs alert visitors to basin’s usage
                                    
                                </a>
                            </h2>
                            
                            
                            <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                                
                    <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                        <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
                    </svg>
                                <span>Research</span>
                            </p>
                            
                            
                            <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                                <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                            </div>
                            
                        </div>
                    </div></article>
                            </div>
                            
                            <div data-test="column-1" class="su-relative su-grow md:su-basis-1/3 ">
                            
                                <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                                    <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                                        
                                <div classname="su-component-card-thumbnail su-w-full su-h-full">
                                <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                                    <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
                                </span>
                            
                                    </div>
                                    
                                    <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                                        <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                                            <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                                                New Lagunita signs alert visitors to basin’s usage
                                                
                                            </a>
                                        </h2>
                                        
                                        
                                        <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                                            
                                <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                    <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
                                </svg>
                                            <span>Research</span>
                                        </p>
                                        
                                        
                                        <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                                            <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                                        </div>
                                        
                                    </div>
                                </div></article>
                            </div>
                            
                            <div data-test="column-2" class="su-relative su-grow md:su-basis-1/3 ">
                            
                                <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                                    <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                                        
                                <div classname="su-component-card-thumbnail su-w-full su-h-full">
                                <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                                    <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
                                </span>
                            
                                    </div>
                                    
                                    <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                                        <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                                            <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                                                New Lagunita signs alert visitors to basin’s usage
                                                
                                            </a>
                                        </h2>
                                        
                                        
                                        <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                                            
                                <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                    <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
                                </svg>
                                            <span>Research</span>
                                        </p>
                                        
                                        
                                        <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                                            <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                                        </div>
                                        
                                    </div>
                                </div></article>
                            </div>
                            
                      </div>
                    </div>
                          </div>
                      </div>
                      
                  </section>"
                `);
            });
    
            it('Should call matrixCardService with correct parameters for Select source', async () => {
                await main(defaultMockData, defaultMockInfo);
    
                expect(matrixCardService).toHaveBeenCalled();
            });
        });
    
        describe('[Main Function - Source: Search]', () => {
            it('Should return the expected HTML with valid data for Search source', async () => {
                cardDataAdapter.mockImplementationOnce(() => ({
                    setCardService: vi.fn(),
                    getCards: vi.fn().mockResolvedValue([
                        { title: 'Featured Card', description: 'Feature Description' },
                        { title: 'Card 1' },
                        { title: 'Card 2' }
                    ])
                }));
    
                const mockData = {
                    ...defaultMockData,
                    contentConfiguration: {
                        source: "Search",
                        searchQuery: "?f.Tabs%7Csug~ds-stanford-youtube=Videos&profile=_default&collection=sug~sp-stanford-report-search",
                        searchMaxCards: 3
                    }
                }

                const result = await main(mockData, defaultMockInfo);
    
                expect(result).toMatchInlineSnapshot(`
                  "<section data-component="multicolumn-listing">
                      <div class="component-multicolumn-listing has-title">
                          <div class="su-mx-auto su-component-container su-container-large su-container-px">    
                              <div class="linked-heading">Linked Heading</div>
                              <div class="su-w-full su-component-multicolumn">
                      <div class="su-relative su-flex su-flex-wrap md:su-flex-nowrap su-flex-1 su-place-content-between su-gap-34 md:su-gap-72 lg:su-gap-[160px]">
                      
                            <div data-test="column-0" class="su-relative su-grow md:su-basis-1/3 ">
                            
                    <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                        <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                            
                    <div classname="su-component-card-thumbnail su-w-full su-h-full">
                    <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                        <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
                    </span>

                        </div>
                        
                        <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                            <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                                <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                                    New Lagunita signs alert visitors to basin’s usage
                                    
                                </a>
                            </h2>
                            
                            
                            <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                                
                    <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                        <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
                    </svg>
                                <span>Research</span>
                            </p>
                            
                            
                            <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                                <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                            </div>
                            
                        </div>
                    </div></article>
                            </div>
                            
                            <div data-test="column-1" class="su-relative su-grow md:su-basis-1/3 ">
                            
                                <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                                    <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                                        
                                <div classname="su-component-card-thumbnail su-w-full su-h-full">
                                <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                                    <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
                                </span>
                            
                                    </div>
                                    
                                    <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                                        <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                                            <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                                                New Lagunita signs alert visitors to basin’s usage
                                                
                                            </a>
                                        </h2>
                                        
                                        
                                        <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                                            
                                <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                    <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
                                </svg>
                                            <span>Research</span>
                                        </p>
                                        
                                        
                                        <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                                            <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                                        </div>
                                        
                                    </div>
                                </div></article>
                            </div>
                            
                            <div data-test="column-2" class="su-relative su-grow md:su-basis-1/3 ">
                            
                                <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                                    <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                                        
                                <div classname="su-component-card-thumbnail su-w-full su-h-full">
                                <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                                    <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
                                </span>
                            
                                    </div>
                                    
                                    <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                                        <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                                            <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                                                New Lagunita signs alert visitors to basin’s usage
                                                
                                            </a>
                                        </h2>
                                        
                                        
                                        <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                                            
                                <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                    <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
                                </svg>
                                            <span>Research</span>
                                        </p>
                                        
                                        
                                        <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                                            <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                                        </div>
                                        
                                    </div>
                                </div></article>
                            </div>
                            
                      </div>
                    </div>
                          </div>
                      </div>
                      
                  </section>"
                `);
            });
    
            it('Should call funnelbackCardService', async () => {
                const mockData = {
                    ...defaultMockData,
                    contentConfiguration: {
                        source: "Search",
                        searchQuery: "?f.Tabs%7Csug~ds-stanford-youtube=Videos&profile=_default&collection=sug~sp-stanford-report-search",
                        searchMaxCards: 3
                    }
                }

                await main(mockData, defaultMockInfo);
    
                expect(funnelbackCardService).toHaveBeenCalled();
            });

            it('Should return the expected HTML with valid data for source="Search" and searchMaxCards=3', async () => {
                const mockData = {
                    ...defaultMockData, 
                    contentConfiguration: {
                        ...defaultMockData.contentConfiguration, 
                        source: "Search", 
                        searchMaxCards: 3, 
                        searchQuery: "?query=family+weekend&profile=_default&"
                    }
                }
    
                const result = await main(mockData, defaultMockInfo);
    
                expect(result).toMatchInlineSnapshot(`
                  "<section data-component="multicolumn-listing">
                      <div class="component-multicolumn-listing has-title">
                          <div class="su-mx-auto su-component-container su-container-large su-container-px">    
                              <div class="linked-heading">Linked Heading</div>
                              <div class="su-w-full su-component-multicolumn">
                      <div class="su-relative su-flex su-flex-wrap md:su-flex-nowrap su-flex-1 su-place-content-between su-gap-34 md:su-gap-72 lg:su-gap-[160px]">
                      
                            <div data-test="column-0" class="su-relative su-grow md:su-basis-1/3 ">
                            
                    <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                        <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                            
                    <div classname="su-component-card-thumbnail su-w-full su-h-full">
                    <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                        <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
                    </span>

                        </div>
                        
                        <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                            <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                                <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                                    New Lagunita signs alert visitors to basin’s usage
                                    
                                </a>
                            </h2>
                            
                            
                            <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                                
                    <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                        <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
                    </svg>
                                <span>Research</span>
                            </p>
                            
                            
                            <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                                <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                            </div>
                            
                        </div>
                    </div></article>
                            </div>
                            
                            <div data-test="column-1" class="su-relative su-grow md:su-basis-1/3 ">
                            
                                <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                                    <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                                        
                                <div classname="su-component-card-thumbnail su-w-full su-h-full">
                                <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                                    <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
                                </span>
                            
                                    </div>
                                    
                                    <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                                        <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                                            <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                                                New Lagunita signs alert visitors to basin’s usage
                                                
                                            </a>
                                        </h2>
                                        
                                        
                                        <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                                            
                                <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                    <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
                                </svg>
                                            <span>Research</span>
                                        </p>
                                        
                                        
                                        <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                                            <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                                        </div>
                                        
                                    </div>
                                </div></article>
                            </div>
                            
                            <div data-test="column-2" class="su-relative su-grow md:su-basis-1/3 ">
                            
                                <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                                    <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                                        
                                <div classname="su-component-card-thumbnail su-w-full su-h-full">
                                <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                                    <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
                                </span>
                            
                                    </div>
                                    
                                    <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                                        <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                                            <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                                                New Lagunita signs alert visitors to basin’s usage
                                                
                                            </a>
                                        </h2>
                                        
                                        
                                        <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                                            
                                <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                    <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
                                </svg>
                                            <span>Research</span>
                                        </p>
                                        
                                        
                                        <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                                            <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                                        </div>
                                        
                                    </div>
                                </div></article>
                            </div>
                            
                      </div>
                    </div>
                          </div>
                      </div>
                      
                  </section>"
                `);
            });
    
            it('Should return the expected HTML with valid data for source="Search" and searchMaxCards=2', async () => {
                const mockData = {
                    ...defaultMockData, 
                    contentConfiguration: {
                        ...defaultMockData.contentConfiguration, 
                        source: "Search", 
                        searchMaxCards: 2, 
                        searchQuery: "?query=family+weekend&profile=_default"
                    }
                }
                const result = await main(mockData, defaultMockInfo);
    
                expect(result).toMatchInlineSnapshot(`
                  "<section data-component="multicolumn-listing">
                      <div class="component-multicolumn-listing has-title">
                          <div class="su-mx-auto su-component-container su-container-large su-container-px">    
                              <div class="linked-heading">Linked Heading</div>
                              <div class="su-w-full su-component-multicolumn">
                      <div class="su-relative su-flex su-flex-wrap md:su-flex-nowrap su-flex-1 su-place-content-between su-gap-34 md:su-gap-72 lg:su-gap-[160px]">
                      
                            <div data-test="column-0" class="su-relative su-grow md:su-basis-1/3 ">
                            
                    <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                        <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                            
                    <div classname="su-component-card-thumbnail su-w-full su-h-full">
                    <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                        <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
                    </span>

                        </div>
                        
                        <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                            <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                                <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                                    New Lagunita signs alert visitors to basin’s usage
                                    
                                </a>
                            </h2>
                            
                            
                            <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                                
                    <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                        <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
                    </svg>
                                <span>Research</span>
                            </p>
                            
                            
                            <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                                <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                            </div>
                            
                        </div>
                    </div></article>
                            </div>
                            
                            <div data-test="column-1" class="su-relative su-grow md:su-basis-1/3 ">
                            
                                <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                                    <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                                        
                                <div classname="su-component-card-thumbnail su-w-full su-h-full">
                                <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                                    <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
                                </span>
                            
                                    </div>
                                    
                                    <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                                        <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                                            <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                                                New Lagunita signs alert visitors to basin’s usage
                                                
                                            </a>
                                        </h2>
                                        
                                        
                                        <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                                            
                                <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                    <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
                                </svg>
                                            <span>Research</span>
                                        </p>
                                        
                                        
                                        <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                                            <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                                        </div>
                                        
                                    </div>
                                </div></article>
                            </div>
                            
                            <div data-test="column-2" class="su-relative su-grow md:su-basis-1/3 ">
                            
                                <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                                    <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                                        
                                <div classname="su-component-card-thumbnail su-w-full su-h-full">
                                <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                                    <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
                                </span>
                            
                                    </div>
                                    
                                    <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                                        <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                                            <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                                                New Lagunita signs alert visitors to basin’s usage
                                                
                                            </a>
                                        </h2>
                                        
                                        
                                        <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                                            
                                <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                    <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
                                </svg>
                                            <span>Research</span>
                                        </p>
                                        
                                        
                                        <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                                            <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                                        </div>
                                        
                                    </div>
                                </div></article>
                            </div>
                            
                      </div>
                    </div>
                          </div>
                      </div>
                      
                  </section>"
                `);
            });
        }); 

        describe('[Header Rendering]', () => {
            it('Should not render LinkedHeading when was not provided', async () => {
                linkedHeadingService.mockImplementationOnce(null);
    
                const result = await main(defaultMockData, defaultMockInfo);
    
                expect(result).toMatchInlineSnapshot(`
                  "<section data-component="multicolumn-listing">
                      <div class="component-multicolumn-listing has-title">
                          <div class="su-mx-auto su-component-container su-container-large su-container-px">    
                              <div class="linked-heading">Linked Heading</div>
                              <div class="su-w-full su-component-multicolumn">
                      <div class="su-relative su-flex su-flex-wrap md:su-flex-nowrap su-flex-1 su-place-content-between su-gap-34 md:su-gap-72 lg:su-gap-[160px]">
                      
                            <div data-test="column-0" class="su-relative su-grow md:su-basis-1/3 ">
                            
                    <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                        <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                            
                    <div classname="su-component-card-thumbnail su-w-full su-h-full">
                    <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                        <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
                    </span>

                        </div>
                        
                        <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                            <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                                <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                                    New Lagunita signs alert visitors to basin’s usage
                                    
                                </a>
                            </h2>
                            
                            
                            <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                                
                    <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                        <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
                    </svg>
                                <span>Research</span>
                            </p>
                            
                            
                            <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                                <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                            </div>
                            
                        </div>
                    </div></article>
                            </div>
                            
                            <div data-test="column-1" class="su-relative su-grow md:su-basis-1/3 ">
                            
                                <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                                    <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                                        
                                <div classname="su-component-card-thumbnail su-w-full su-h-full">
                                <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                                    <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
                                </span>
                            
                                    </div>
                                    
                                    <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                                        <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                                            <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                                                New Lagunita signs alert visitors to basin’s usage
                                                
                                            </a>
                                        </h2>
                                        
                                        
                                        <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                                            
                                <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                    <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
                                </svg>
                                            <span>Research</span>
                                        </p>
                                        
                                        
                                        <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                                            <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                                        </div>
                                        
                                    </div>
                                </div></article>
                            </div>
                            
                            <div data-test="column-2" class="su-relative su-grow md:su-basis-1/3 ">
                            
                                <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                                    <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                                        
                                <div classname="su-component-card-thumbnail su-w-full su-h-full">
                                <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                                    <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
                                </span>
                            
                                    </div>
                                    
                                    <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                                        <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                                            <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                                                New Lagunita signs alert visitors to basin’s usage
                                                
                                            </a>
                                        </h2>
                                        
                                        
                                        <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                                            
                                <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                    <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
                                </svg>
                                            <span>Research</span>
                                        </p>
                                        
                                        
                                        <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                                            <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                                        </div>
                                        
                                    </div>
                                </div></article>
                            </div>
                            
                      </div>
                    </div>
                          </div>
                      </div>
                      
                  </section>"
                `);
            });

            it('Should render right component title state class when title was not provided', async () => {
                linkedHeadingService.mockResolvedValue({
                    title: '',
                    ctaText: 'Learn More',
                    ctaLink: 'https://example.com',
                    ctaNewWindow: false
                });
    
                const result = await main(defaultMockData, defaultMockInfo);
    
                expect(result).toMatchInlineSnapshot(`
                  "<section data-component="multicolumn-listing">
                      <div class="component-multicolumn-listing has-no-title">
                          <div class="su-mx-auto su-component-container su-container-large su-container-px">    
                              <div class="linked-heading">Linked Heading</div>
                              <div class="su-w-full su-component-multicolumn">
                      <div class="su-relative su-flex su-flex-wrap md:su-flex-nowrap su-flex-1 su-place-content-between su-gap-34 md:su-gap-72 lg:su-gap-[160px]">
                      
                            <div data-test="column-0" class="su-relative su-grow md:su-basis-1/3 ">
                            
                    <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                        <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                            
                    <div classname="su-component-card-thumbnail su-w-full su-h-full">
                    <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                        <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
                    </span>

                        </div>
                        
                        <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                            <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                                <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                                    New Lagunita signs alert visitors to basin’s usage
                                    
                                </a>
                            </h2>
                            
                            
                            <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                                
                    <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                        <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
                    </svg>
                                <span>Research</span>
                            </p>
                            
                            
                            <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                                <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                            </div>
                            
                        </div>
                    </div></article>
                            </div>
                            
                            <div data-test="column-1" class="su-relative su-grow md:su-basis-1/3 ">
                            
                                <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                                    <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                                        
                                <div classname="su-component-card-thumbnail su-w-full su-h-full">
                                <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                                    <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
                                </span>
                            
                                    </div>
                                    
                                    <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                                        <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                                            <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                                                New Lagunita signs alert visitors to basin’s usage
                                                
                                            </a>
                                        </h2>
                                        
                                        
                                        <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                                            
                                <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                    <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
                                </svg>
                                            <span>Research</span>
                                        </p>
                                        
                                        
                                        <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                                            <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                                        </div>
                                        
                                    </div>
                                </div></article>
                            </div>
                            
                            <div data-test="column-2" class="su-relative su-grow md:su-basis-1/3 ">
                            
                                <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                                    <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                                        
                                <div classname="su-component-card-thumbnail su-w-full su-h-full">
                                <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                                    <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
                                </span>
                            
                                    </div>
                                    
                                    <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                                        <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                                            <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                                                New Lagunita signs alert visitors to basin’s usage
                                                
                                            </a>
                                        </h2>
                                        
                                        
                                        <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                                            
                                <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                    <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
                                </svg>
                                            <span>Research</span>
                                        </p>
                                        
                                        
                                        <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                                            <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                                        </div>
                                        
                                    </div>
                                </div></article>
                            </div>
                            
                      </div>
                    </div>
                          </div>
                      </div>
                      
                  </section>"
                `);
            });
        });

        describe('[Card Rendering]', () => {
            it('Should handle video type of card', async () => {
                cardDataAdapter.mockImplementationOnce(() => ({
                    setCardService: vi.fn(),
                    getCards: vi.fn().mockResolvedValue([
                        {
                            type: "Video",
                            title: "Card 1",
                            liveUrl: "https://example.com",
                            description: "<p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>",
                            imageUrl: "https://picsum.photos/400/400",
                            imageAlt: "",
                            taxonomy: null,
                            taxonomyUrl: null,
                            videoUrl: "",
                            date: "2024-01-01 00:00:00",
                            source: null,
                            authorName: null,
                            authorEmail: null
                        },
                        { type: "Video",
                            title: "Card 2",
                            liveUrl: "https://example.com",
                            description: "<p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>",
                            imageUrl: "https://picsum.photos/400/400",
                            imageAlt: "",
                            taxonomy: null,
                            taxonomyUrl: null,
                            videoUrl: "",
                            date: "2024-01-01 00:00:00",
                            source: null,
                            authorName: null,
                            authorEmail: null },
                        { type: "Video",
                            title: "Card 3",
                            liveUrl: "https://example.com",
                            description: "<p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>",
                            imageUrl: "https://picsum.photos/400/400",
                            imageAlt: "",
                            taxonomy: null,
                            taxonomyUrl: null,
                            videoUrl: "",
                            date: "2024-01-01 00:00:00",
                            source: null,
                            authorName: null,
                            authorEmail: null }
                    ])
                }));
    
                const result = await main(defaultMockData, defaultMockInfo);
                defaultMockData
                expect(result).toMatchInlineSnapshot(`
                  "<section data-component="multicolumn-listing">
                      <div class="component-multicolumn-listing has-no-title">
                          <div class="su-mx-auto su-component-container su-container-large su-container-px">    
                              <div class="linked-heading">Linked Heading</div>
                              <div class="su-w-full su-component-multicolumn">
                      <div class="su-relative su-flex su-flex-wrap md:su-flex-nowrap su-flex-1 su-place-content-between su-gap-34 md:su-gap-72 lg:su-gap-[160px]">
                      
                            <div data-test="column-0" class="su-relative su-grow md:su-basis-1/3 ">
                            
                    <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                        <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                            
                    <div classname="su-component-card-thumbnail su-w-full su-h-full">
                    <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                        <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
                    </span>

                        </div>
                        
                        <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                            <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                                <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                                    New Lagunita signs alert visitors to basin’s usage
                                    
                                </a>
                            </h2>
                            
                            
                            <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                                
                    <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                        <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
                    </svg>
                                <span>Research</span>
                            </p>
                            
                            
                            <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                                <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                            </div>
                            
                        </div>
                    </div></article>
                            </div>
                            
                            <div data-test="column-1" class="su-relative su-grow md:su-basis-1/3 ">
                            
                                <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                                    <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                                        
                                <div classname="su-component-card-thumbnail su-w-full su-h-full">
                                <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                                    <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
                                </span>
                            
                                    </div>
                                    
                                    <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                                        <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                                            <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                                                New Lagunita signs alert visitors to basin’s usage
                                                
                                            </a>
                                        </h2>
                                        
                                        
                                        <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                                            
                                <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                    <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
                                </svg>
                                            <span>Research</span>
                                        </p>
                                        
                                        
                                        <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                                            <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                                        </div>
                                        
                                    </div>
                                </div></article>
                            </div>
                            
                            <div data-test="column-2" class="su-relative su-grow md:su-basis-1/3 ">
                            
                                <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
                    
                                    <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
                                        
                                <div classname="su-component-card-thumbnail su-w-full su-h-full">
                                <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
                                    <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="">
                                </span>
                            
                                    </div>
                                    
                                    <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                                        <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                                            <a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
                                                New Lagunita signs alert visitors to basin’s usage
                                                
                                            </a>
                                        </h2>
                                        
                                        
                                        <p data-testid="vertical-card-type" class="su-text-16 su-leading-[20.8px] su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3">
                                            
                                <svg aria-hidden="true" data-testid="svg-research" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                    <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z"></path>
                                </svg>
                                            <span>Research</span>
                                        </p>
                                        
                                        
                                        <div class="*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px] su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0 su-order-4">
                                            <p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>
                                        </div>
                                        
                                    </div>
                                </div></article>
                            </div>
                            
                      </div>
                    </div>
                          </div>
                      </div>
                      ModalHTMLModalHTMLModalHTML
                  </section>"
                `);
            });
        });
    });
});
