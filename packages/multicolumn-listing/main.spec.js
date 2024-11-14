/**
 * @jest-environment jsdom
 */

import { CardDataAdapter, MatrixCardService, linkedHeadingService } from "../../global/js/utils";
import moduleToTest from './main';

const mockedError = jest.fn();
console.error = mockedError;

jest.mock('../../global/js/utils', () => ({
    CardDataAdapter: jest.fn().mockImplementation(() => ({
        setCardService: jest.fn(),
        getCards: jest.fn().mockResolvedValue([
            {
                "type": "Research",
                "title": "New Lagunita signs alert visitors to basin’s usage",
                "liveUrl": "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/new-lagunita-signs-alert-visitors-to-basins-usage",
                "description": "<p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>",
                "imageUrl": "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0023/63365/photo-1505771215590-c5fa0aec29b8.jpeg",
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
                "liveUrl": "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/new-lagunita-signs-alert-visitors-to-basins-usage",
                "description": "<p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>",
                "imageUrl": "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0023/63365/photo-1505771215590-c5fa0aec29b8.jpeg",
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
                "liveUrl": "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/new-lagunita-signs-alert-visitors-to-basins-usage",
                "description": "<p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>",
                "imageUrl": "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0023/63365/photo-1505771215590-c5fa0aec29b8.jpeg",
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
    FunnelbackCardService: jest.fn(),
    MatrixCardService: jest.fn(),
    linkedHeadingService: jest.fn().mockResolvedValue({
        title: 'Sample Heading',
        ctaText: 'Learn More',
        ctaLink: 'https://example.com',
        ctaNewWindow: false
    }),

    containerClasses: jest.fn().mockReturnValue('su-container-class'),
    faIcon: {
        "ChevronRight": [`<svg class="su-fill-transparent su-stroke-current" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden=""><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`],
        "CirclePlay": [`<svg class="su-fill-transparent su-stroke-current" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden=""><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`]
    },
    multicolumnGrid: jest.fn().mockImplementation(()=>`<div class="su-w-full su-component-multicolumn">
    <div class="su-relative su-flex su-flex-wrap md:su-flex-nowrap su-flex-1 su-place-content-between su-gap-34 md:su-gap-72 lg:su-gap-[160px]">
    
          <div data-test="column-0" class="su-relative su-grow md:su-basis-1/3 ">
          
  <article aria-label="New Lagunita signs alert visitors to basin’s usage" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
  
      <div class="su-mb-15 md:su-mb-18 lg:su-mb-19">
          
  <div classname="su-component-card-thumbnail su-w-full su-h-full">
  <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">
      <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0023/63365/photo-1505771215590-c5fa0aec29b8.jpeg" alt="">
  </span>

      </div>
      
      <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
          <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
              <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/new-lagunita-signs-alert-visitors-to-basins-usage" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
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
                  <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0023/63365/photo-1505771215590-c5fa0aec29b8.jpeg" alt="">
              </span>
          
                  </div>
                  
                  <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                      <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                          <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/new-lagunita-signs-alert-visitors-to-basins-usage" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
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
                  <img classname="su-absolute su-object-cover su-object-center su-size-full" src="https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0023/63365/photo-1505771215590-c5fa0aec29b8.jpeg" alt="">
              </span>
          
                  </div>
                  
                  <div class="su-flex su-flex-wrap su-gap-11 md:su-gap-12 lg:su-gap-9">
                      <h2 class="su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-w-full su-font-serif su-my-0 su-order-2">
                          <a href="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/new-lagunita-signs-alert-visitors-to-basins-usage" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red">
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

describe('[Multicolumn listing]', () => {
    const mockFnsCtx = {
        resolveUri: jest.fn()
    };

    const defaultMockData = {
        "headingConfiguration": {
            "title": "Multicolumn Listing",
            "ctaText": "View all",
            "ctaUrl": "matrix-asset://api-identifier/89422",
            "ctaNewWindow": true
        },
        "contentConfiguration": {
            "source": "Select",
            "cards": [
                {
                    "type": "Research",
                    "title": "New Lagunita signs alert visitors to basin’s usage",
                    "liveUrl": "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/new-lagunita-signs-alert-visitors-to-basins-usage",
                    "description": "<p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>",
                    "imageUrl": "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0023/63365/photo-1505771215590-c5fa0aec29b8.jpeg",
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
                    "liveUrl": "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/new-lagunita-signs-alert-visitors-to-basins-usage",
                    "description": "<p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>",
                    "imageUrl": "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0023/63365/photo-1505771215590-c5fa0aec29b8.jpeg",
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
                    "liveUrl": "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/new-lagunita-signs-alert-visitors-to-basins-usage",
                    "description": "<p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>",
                    "imageUrl": "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0023/63365/photo-1505771215590-c5fa0aec29b8.jpeg",
                    "imageAlt": "",
                    "taxonomy": null,
                    "taxonomyUrl": null,
                    "videoUrl": "",
                    "date": "2024-01-01 00:00:00",
                    "source": null,
                    "authorName": null,
                    "authorEmail": null
                }
            ]
        },
        "displayConfiguration": {
            "displayThumbnails": true,
            "displayDescriptions": true
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
        jest.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no env variables were provided.', async () => {
            const result = await moduleToTest.main();
            expect(result).toBe('<!-- Error: Error occurred in the multicolumn content component, FB_JSON_URL variable cannot be undefined and must be non-empty string. The "undefined" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        it('Should throw an error when FB_JSON_URL is empty string.', async () => {
            const customMockInfo = { ...defaultMockInfo, set: { environment: { ...defaultMockInfo.set.environment, FB_JSON_URL:'' } } }
            const result = await moduleToTest.main({},customMockInfo);
            expect(result).toBe('<!-- Error: Error occurred in the multicolumn content component, FB_JSON_URL variable cannot be undefined and must be non-empty string. The "" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        it('Should throw an error when FB_JSON_URL is not a string.', async () => {
            const customMockInfo = { ...defaultMockInfo, set: { environment: { ...defaultMockInfo.set.environment, FB_JSON_URL:{} } } }
            const result = await moduleToTest.main({},customMockInfo);
            expect(result).toBe('<!-- Error: Error occurred in the multicolumn content component, FB_JSON_URL variable cannot be undefined and must be non-empty string. The "[object Object]" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        it('Should throw an error when API_IDENTIFIER is empty string.', async () => {
            const customMockInfo = { ...defaultMockInfo, set: { environment: { ...defaultMockInfo.set.environment, API_IDENTIFIER:'' } } }
            const result = await moduleToTest.main({},customMockInfo);
            expect(result).toBe('<!-- Error: Error occurred in the multicolumn content component, API_IDENTIFIER variable cannot be undefined and must be non-empty string. The "" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        it('Should throw an error when API_IDENTIFIER is not a string.', async () => {
            const customMockInfo = { ...defaultMockInfo, set: { environment: { ...defaultMockInfo.set.environment, API_IDENTIFIER:{} } } }
            const result = await moduleToTest.main({},customMockInfo);
            expect(result).toBe('<!-- Error: Error occurred in the multicolumn content component, API_IDENTIFIER variable cannot be undefined and must be non-empty string. The "[object Object]" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        it('Should throw an error when BASE_DOMAIN is empty string.', async () => {
            const customMockInfo = { ...defaultMockInfo, set: { environment: { ...defaultMockInfo.set.environment, BASE_DOMAIN:'' } } }
            const result = await moduleToTest.main({},customMockInfo);
            expect(result).toBe('<!-- Error: Error occurred in the multicolumn content component, BASE_DOMAIN variable cannot be undefined and must be non-empty string. The "" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        it('Should throw an error when BASE_DOMAIN is not a string.', async () => {
            const customMockInfo = { ...defaultMockInfo, set: { environment: { ...defaultMockInfo.set.environment, BASE_DOMAIN:{} } } }
            const result = await moduleToTest.main({},customMockInfo);
            expect(result).toBe('<!-- Error: Error occurred in the multicolumn content component, BASE_DOMAIN variable cannot be undefined and must be non-empty string. The "[object Object]" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        it('Should throw an error when fnsCtx is not an object.', async () => {
            const customMockInfo = { ...defaultMockInfo, fns: 'string', ctx: 'string'}
            const result = await moduleToTest.main({},customMockInfo);
            expect(result).toBe('<!-- Error: Error occurred in the multicolumn content component, info.fns cannot be undefined or null. The "string" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        it('Should throw an error when fnsCtx is is undefined.', async () => {
            const customMockInfo = { ...defaultMockInfo, fns: undefined, ctx: undefined,}
            const result = await moduleToTest.main({},customMockInfo);
            expect(result).toBe('<!-- Error: Error occurred in the multicolumn content component, info.fns cannot be undefined or null. The "[object Object]" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        it('Should throw an error when args does not exist', async () => {
            const result = await moduleToTest.main(undefined,defaultMockInfo);
            expect(result).toBe('<!-- TypeError: Cannot read properties of undefined (reading \'contentConfiguration\') -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        it('Should throw an error when contentConfiguration does not exist', async () => {
            const customMockData = { ...defaultMockData, contentConfiguration:undefined}
            const result = await moduleToTest.main(customMockData,defaultMockInfo);
            expect(result).toBe('<!-- Error: Error occurred in the multicolumn content component, contentConfiguration prop cannot be undefined. The "[object Object]" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        it('Should throw an error when headingConfiguration does not exist', async () => {
            const customMockData = { ...defaultMockData, headingConfiguration: undefined };
            const result = await moduleToTest.main(customMockData, defaultMockInfo);
            expect(result).toBe('<!-- Error: Error occurred in the multicolumn content component, headingConfiguration prop cannot be undefined. The "[object Object]" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    
        it('Should throw an error when displayConfiguration does not exist', async () => {
            const customMockData = { ...defaultMockData, displayConfiguration: undefined };
            const result = await moduleToTest.main(customMockData, defaultMockInfo);
            expect(result).toBe('<!-- Error: Error occurred in the multicolumn content component, displayConfiguration prop cannot be undefined. The "[object Object]" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    
        it('Should throw an error when title is not a string', async () => {
            const customMockData = { 
                ...defaultMockData, 
                headingConfiguration: { ...defaultMockData.headingConfiguration, title: {} } 
            };
            const result = await moduleToTest.main(customMockData, defaultMockInfo);
            expect(result).toBe('<!-- Error: Error occurred in the multicolumn content component, title field must be a string. The "[object Object]" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    
        it('Should throw an error when ctaUrl is not a string', async () => {
            const customMockData = { 
                ...defaultMockData, 
                headingConfiguration: { ...defaultMockData.headingConfiguration, ctaUrl: {} } 
            };
            const result = await moduleToTest.main(customMockData, defaultMockInfo);
            expect(result).toBe('<!-- Error: Error occurred in the multicolumn content component, ctaUrl field must be a string. The "[object Object]" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    
        it('Should throw an error when ctaManualUrl is not a string', async () => {
            const customMockData = { 
                ...defaultMockData, 
                headingConfiguration: { ...defaultMockData.headingConfiguration, ctaManualUrl: {} } 
            };
            const result = await moduleToTest.main(customMockData, defaultMockInfo);
            expect(result).toBe('<!-- Error: Error occurred in the multicolumn content component, ctaManualUrl field must be a string. The "[object Object]" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    
        it('Should throw an error when ctaText is not a string', async () => {
            const customMockData = { 
                ...defaultMockData, 
                headingConfiguration: { ...defaultMockData.headingConfiguration, ctaText: {} } 
            };
            const result = await moduleToTest.main(customMockData, defaultMockInfo);
            expect(result).toBe('<!-- Error: Error occurred in the multicolumn content component, ctaText field must be a string. The "[object Object]" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    
        it('Should throw an error when ctaNewWindow is not a boolean', async () => {
            const customMockData = { 
                ...defaultMockData, 
                headingConfiguration: { ...defaultMockData.headingConfiguration, ctaNewWindow: 'not_boolean' } 
            };
            const result = await moduleToTest.main(customMockData, defaultMockInfo);
            expect(result).toBe('<!-- Error: Error occurred in the multicolumn content component, ctaNewWindow field must be a boolean. The "not_boolean" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when source is undefined', async () => {
            const customMockData = { 
                ...defaultMockData, 
                contentConfiguration: { ...defaultMockData.contentConfiguration, source: undefined } 
            };
            const result = await moduleToTest.main(customMockData, defaultMockInfo);
            expect(result).toBe('<!-- Error: Error occurred in the multicolumn content component, source field cannot be undefined and must be one of [\'Search\', \'Select\'] value, "undefined" was received -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    
        it('Should throw an error when source is not a string', async () => {
            const customMockData = { 
                ...defaultMockData, 
                contentConfiguration: { ...defaultMockData.contentConfiguration, source: {} } 
            };
            const result = await moduleToTest.main(customMockData, defaultMockInfo);
            expect(result).toBe('<!-- Error: Error occurred in the multicolumn content component, source field cannot be undefined and must be one of [\'Search\', \'Select\'] value, "[object Object]" was received -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when source is not one of ["Select", "Search"] value', async () => {
            const customMockData = { 
                ...defaultMockData, 
                contentConfiguration: { ...defaultMockData.contentConfiguration, source: "test" } 
            };
            const result = await moduleToTest.main(customMockData, defaultMockInfo);
            expect(result).toBe('<!-- Error: Error occurred in the multicolumn content component, source field cannot be undefined and must be one of [\'Search\', \'Select\'] value, "test" was received -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    
        it('Should throw an error when displayDescriptions is not a boolean', async () => {
            const customMockData = { 
                ...defaultMockData, 
                displayConfiguration: { ...defaultMockData.displayConfiguration, displayDescriptions: 'not_boolean' } 
            };
            const result = await moduleToTest.main(customMockData, defaultMockInfo);
            expect(result).toBe('<!-- Error: Error occurred in the multicolumn content component, displayDescriptions field must be a boolean. The "not_boolean" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    
        it('Should throw an error when displayThumbnails is not a boolean', async () => {
            const customMockData = { 
                ...defaultMockData, 
                displayConfiguration: { ...defaultMockData.displayConfiguration, displayThumbnails: 'not_boolean' } 
            };
            const result = await moduleToTest.main(customMockData, defaultMockInfo);
            expect(result).toBe('<!-- Error: Error occurred in the multicolumn content component, displayThumbnails field must be a boolean. The "not_boolean" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        it('Should return the expected HTML with valid data for source="Select', async () => {
            const result = await moduleToTest.main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<section data-component="multicolumn-listing">');
            expect(result).toContain('<div class="component-multicolumn-listing has-title">');
            expect(result).toContain('<div class="su-container-class">');
            expect(result).toContain('<div data-test="column-0" class="su-relative su-grow md:su-basis-1/3 ">');
            expect(result).toContain('<div data-test="column-1" class="su-relative su-grow md:su-basis-1/3 ">');
            expect(result).toContain('<div data-test="column-2" class="su-relative su-grow md:su-basis-1/3 ">');
        });

        it('Should return the expected heading HTML with valid data for source="Select', async () => {
            const result = await moduleToTest.main(defaultMockData, defaultMockInfo);
            expect(result).toContain('<h2 class="su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white su-text-black">');
        });

        it('Should return the expected HTML with valid data for source="Search" and searchMaxCards=3', async () => {
            const customMockData = {...defaultMockData, contentConfiguration:{...defaultMockData.contentConfiguration, source: "Search", searchMaxCards: 3, searchQuery: "?"}}
            const result = await moduleToTest.main(customMockData, defaultMockInfo);

            expect(result).toContain('<section data-component="multicolumn-listing">');
            expect(result).toContain('<div class="component-multicolumn-listing has-title">');
            expect(result).toContain('<div class="su-container-class">');
            expect(result).toContain('<div data-test="column-0" class="su-relative su-grow md:su-basis-1/3 ">');
            expect(result).toContain('<div data-test="column-1" class="su-relative su-grow md:su-basis-1/3 ">');
            expect(result).toContain('<div data-test="column-2" class="su-relative su-grow md:su-basis-1/3 ">');
        });

        it('Should return the expected HTML with valid data for source="Search" and searchMaxCards=2', async () => {
            const customMockData = {...defaultMockData, contentConfiguration:{...defaultMockData.contentConfiguration, source: "Search", searchMaxCards: 2, searchQuery: "?"}}
            const result = await moduleToTest.main(customMockData, defaultMockInfo);

            expect(result).toContain('<section data-component="multicolumn-listing">');
            expect(result).toContain('<div class="component-multicolumn-listing has-title">');
            expect(result).toContain('<div class="su-container-class">');
            expect(result).toContain('<div data-test="column-0" class="su-relative su-grow md:su-basis-1/3 ">');
            expect(result).toContain('<div data-test="column-1" class="su-relative su-grow md:su-basis-1/3 ">');
            expect(result).toContain('<div data-test="column-2" class="su-relative su-grow md:su-basis-1/3 ">');
        });

        it('Should add the has-title class if the component title exists', async () => {
            const result = await moduleToTest.main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<div class="component-multicolumn-listing has-title">');
        });

        it('Should add the has-no-title class if the component title does not exists', async () => {
            linkedHeadingService.mockResolvedValueOnce({
                title: '',
                ctaText: 'Learn More',
                ctaLink: 'https://example.com',
                ctaNewWindow: false
            });

            const result = await moduleToTest.main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<div class="component-multicolumn-listing has-no-title">');
        });

        it('Should render a video modal if the card type is "Video"', async () => {
            CardDataAdapter.mockImplementation(() => ({
                setCardService: jest.fn(),
                getCards: jest.fn().mockResolvedValue([
                    {
                        "type": "Video",
                        "title": "New Lagunita signs alert visitors to basin’s usage",
                        "liveUrl": "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/new-lagunita-signs-alert-visitors-to-basins-usage",
                        "description": "<p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>",
                        "imageUrl": "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0023/63365/photo-1505771215590-c5fa0aec29b8.jpeg",
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
                        "liveUrl": "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/new-lagunita-signs-alert-visitors-to-basins-usage",
                        "description": "<p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>",
                        "imageUrl": "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0023/63365/photo-1505771215590-c5fa0aec29b8.jpeg",
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
                        "liveUrl": "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/new-lagunita-signs-alert-visitors-to-basins-usage",
                        "description": "<p>Stanford students and conservationists created signs that remind the community that Lagunita – Stanford’s constructed basin, currently dry – supports wildlife and ongoing conservation and research efforts.</p>",
                        "imageUrl": "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0023/63365/photo-1505771215590-c5fa0aec29b8.jpeg",
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
            }))

            const result = await moduleToTest.main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<div data-overlay-container="true" class="su-modal su-hidden" data-modal="modal"');
        });

        it('Should call CardDataAdapter and MatrixCardService', async () => {
            await moduleToTest.main(defaultMockData, defaultMockInfo);
            expect(CardDataAdapter).toHaveBeenCalled();
            expect(MatrixCardService).toHaveBeenCalled();
        });

    });
});
