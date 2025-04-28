import { beforeEach, describe, expect, it, vi } from 'vitest';
import { metadataDataAdapter } from '../../global/js/utils';

import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

const mockedFetch = {
    type: "Basic",
    authors: [],
    producers: [],
    writers: [
        {
            asset_name: "Olivia Peterkin",
            asset_assetid: "164199"
        }
    ],
    editors: [],
    photographers: [],
    videographers: [],
    photography: [],
    media: [],
    campus: [
        {
            asset_name: "Stanford Graduate School of Education",
            asset_assetid: "28349",
            asset_url: "https://news.stanford.edu/featured-unit/stanford-graduate-school-of-education"
        }
    ],
    related: [
        {
            asset_assetid: "28403",
            asset_name: "Education",
            asset_url: "https://news.stanford.edu/research-and-scholarship/topic/education",
            topicPath: "/research-and-scholarship/topic/education",
            target_id: "141611",
            group: "127851",
            type: "content_topic",
            sectionSummary: ""
        }
    ],
    raw: {
        srFeaturedUnit: 28349,
        srContentTopic: []
    }
}

vi.mock('../../global/js/utils', () => ({
    matrixMetadataService: vi.fn(),
    metadataDataAdapter: vi.fn().mockImplementation(() => ({
        setMetadataService: vi.fn(),
        getMetadataData: vi.fn().mockResolvedValue(mockedFetch),
    }))
}));


describe('[Metadata Fields]', () => {
    const defaultMockData = {};

    const defaultMockInfo = {
        env: {
            BASE_DOMAIN: 'https://example.com/json',
        },
        ctx: {
            assetId: '166565'
        }
    };
    
    beforeEach(() => {
        vi.clearAllMocks();
    });
    
    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters were provided', async () => {
            const result = await main();
            
            expect(result).toContain('<!-- Error occurred in the Metadata Fields component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when BASE_DOMAIN was not provided', async () => {
            const mockInfo = {
                env: {
                    ...defaultMockInfo.env,
                    BASE_DOMAIN: undefined
                }
            }

            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Metadata Fields component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when BASE_DOMAIN was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        ...defaultMockInfo.env,
                        BASE_DOMAIN: undefined
                    }
                }
            }

            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Metadata Fields component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw error when fns or ctx is invalid', async () => {
            const mockInfo = { 
                env: defaultMockInfo.env,
                fns: undefined, 
                ctx: undefined,
            };
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Metadata Fields component: The "info.fns.assetId" field cannot be undefined and must be a non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fns.assetId is an empty string', async () => {
            const mockInfo = { 
                env: defaultMockInfo.env,
                ctx: {
                    assetId: ''
                }, 
            };
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Metadata Fields component: The "info.fns.assetId" field cannot be undefined and must be a non-empty string. The "" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when ctx.assetId is an empty string', async () => {
            const mockInfo = { 
                env: defaultMockInfo.env,
                ctx: {
                    assetId: 123
                }, 
            };
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Metadata Fields component: The "info.fns.assetId" field cannot be undefined and must be a non-empty string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        it('Should return the expected HTML with valid data', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component='metadata-fields'><div class='su-mx-auto su-component-container su-container-narrow su-container-px'>
                  <section class="su-border-b su-border-b-black-20 su-pt-32 su-mb-32 md:su-pt-36 lg:su-border-b-transparent lg:su-mb-[104px]">
                    

                    

                    
                      <div class="su-border-t border-t-black-20">
                        
                  <div class="su-flex su-flex-col su-gap-27 su-pt-32 su-pb-22 md:su-pt-45 md:su-pt-36 su-justify-left">
                    <h3 class="su-text-23 su-font-bold su-leading-[27.6px] su-font-sans !su-m-0">
                      Writer
                    </h3>
                    <div class="su-flex su-flex-col su-gap-6 su-text-21 ">
                      
                            <p class="!su-m-0 su-text-21 su-leading-snug" key="164199">
                              Olivia Peterkin
                            </p>
                          
                    </div>
                  </div>
                
                      </div>
                    

                    

                    

                    

                    

                    

                    

                    
                      <div class="su-border-t border-t-black-20">
                        
                  <div class="su-flex su-flex-col su-gap-27 su-pt-32 su-pb-22 md:su-pt-45 md:su-pt-36 su-justify-left">
                    <h3 class="su-text-23 su-font-bold su-leading-[27.6px] su-font-sans !su-m-0">
                      Related topics
                    </h3>
                    <div class="su-flex su-flex-col su-gap-6 su-text-21 md:su-flex-row md:su-gap-27 md:su-flex-wrap">
                      
                            <div class="" key="28403">
                              <a href="https://news.stanford.edu/research-and-scholarship/topic/education" class="su-no-underline su-leading-snug hover:su-underline su-text-digital-red dark:su-text-dark-mode-red dark:hover:su-text-white hover:su-text-black su-text-18">
                                Education
                              </a>
                            </div>
                          
                    </div>
                  </div>
                
                      </div>
                    

                    <div class="su-border-t border-t-black-20">
                      
                  <div class="su-flex su-flex-col su-gap-27 su-pt-32 su-pb-22 md:su-pt-45 md:su-pt-36 su-justify-left">
                    <h3 class="su-text-23 su-font-bold su-leading-[27.6px] su-font-sans !su-m-0">
                      Share this story
                    </h3>
                    <div class="su-flex su-flex-col su-gap-6 su-text-21 ">
                      
                          <button
                            data-role="copy-link"
                            type="button"
                            class="su-text-digital-blue dark:su-text-digital-blue-vivid su-text-21 su-font-semibold su-mr-auto hocus:su-underline su-leading-snug"
                          >
                            <span data-copy-text>Copy link</span>
                            <span class="*:su-inline-block *:su-ml-8">
                            
              	<svg
              		xmlns="http://www.w3.org/2000/svg"
              		width="16"
              		height="16"
              		viewBox="0 0 16 16"
              		fill="none"
              	>
              		<path
              		d="M13 6C14.6569 6 16 4.65685 16 3C16 1.34315 14.6569 0 13 0C11.3431 0 10 1.34315 10 3C10 3.12548 10.0077 3.24917 10.0227 3.37061L5.08259 5.84064C4.54303 5.32015 3.8089 5 3 5C1.34315 5 0 6.34315 0 8C0 9.65685 1.34315 11 3 11C3.80892 11 4.54306 10.6798 5.08263 10.1593L10.0227 12.6293C10.0077 12.7508 10 12.8745 10 13C10 14.6569 11.3431 16 13 16C14.6569 16 16 14.6569 16 13C16 11.3431 14.6569 10 13 10C12.1911 10 11.457 10.3201 10.9174 10.8406L5.97733 8.37061C5.9923 8.24917 6 8.12548 6 8C6 7.8745 5.99229 7.7508 5.97733 7.62934L10.9174 5.15932C11.4569 5.67984 12.1911 6 13 6Z"
              		fill="#006CB8"
              		/>
              	</svg>
                            </span>
                          </button>
                        
                    </div>
                  </div>
                
                    </div>
                  </section>
                </div></section>"
            `);
        });

        it('Should return the expected HTML for "Featured" type', async () => {
            metadataDataAdapter.mockImplementation(() => ({
                setMetadataService: vi.fn(),
                getMetadataData: vi.fn().mockResolvedValueOnce({
                    type: "Featured",
                    authors: [],
                    producers: [],
                    writers: [
                        {
                            asset_name: "Tara Roberts",
                            asset_assetid: "143459"
                        }
                    ],
                    editors: [],
                    photographers: [],
                    videographers: [],
                    photography: [],
                    media: [],
                    campus: [],
                    related: [
                        {
                            asset_assetid: "28401",
                            asset_name: "Earth & Climate",
                            asset_url: "https://news.stanford.edu/research-and-scholarship/topic/earth-and-climate",
                            topicPath: "/research-and-scholarship/topic/earth-and-climate",
                            target_id: "141594",
                            group: "127851",
                            type: "content_topic",
                            sectionSummary: ""
                        },
                        {
                            asset_assetid: "28605",
                            asset_name: "Sustainability",
                            asset_url: "https://news.stanford.edu/sustainability",
                            topicPath: "/sustainability",
                            target_id: "141776",
                            group: "28597",
                            type: "content_topic",
                            sectionSummary: ""
                        }
                    ],
                    raw: {
                        srFeaturedUnit: [],
                        srContentTopic: [
                            "28605"
                        ]
                    }
                })
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component='metadata-fields'><div class='su-mx-auto su-component-container su-container-large su-container-px'>
                  <section class="su-flex su-flex-col su-items-center">
                    
                      <div class="su-flex su-w-full su-flex-col su-justify-center su-items-center md:su-flex-row md:su-gap-20 lg:su-gap-40">
                        <div aria-hidden="true" class="su-border-none su-grow su-w-70 su-h-2 su-bg-gradient-to-r su-from-digital-red-light su-to-digital-red-dark dark:su-from-palo-verde dark:su-to-olive md:su-w-auto md:su-h-3 su-mb-38 md:su-mb-0"></div>

                        <div class="su-flex su-flex-col md:su-flex-row su-gap-32 su-pt-0 md:su-gap-x-20 md:su-gap-y-70 lg:su-gap-x-40 lg:su-gap-y-[6.1rem]">
                          
                            <div class="su-w-full md:su-w-auto md:su-min-w-[17rem]">
                              
                  <div class="su-text-center">
                    <h3 class="su-metadata-fields-title su-text-15 su-leading-display su-font-bold su-font-sans !su-m-0 su-pb-8 md:su-pb-9 md:su-text-19">
                      Writer
                    </h3>
                    <div>
                                      <p class="!su-m-0 su-text-16 su-leading-snug su-font-normal md:su-text-21" key="143459">
                                        Tara Roberts
                                      </p>
                                    </div>
                  </div>
                
                            </div>
                          
                        </div>

                        <div aria-hidden="true" class="su-border-none su-grow su-w-70 su-h-2 su-bg-gradient-to-r su-from-digital-red-dark su-to-digital-red-light dark:su-from-palo-verde dark:su-to-olive md:su-w-auto md:su-h-3 su-mt-38 md:su-mt-0"></div>
                      </div>
                    

                    

                    

                    

                    
                      <div class="su-text-center su-rs-mt-4 su-flex su-flex-col su-gap-20 md:su-gap-26">
                        <h3 class="su-text-18 su-font-bold su-leading-snug su-font-sans !su-m-0">Related topics</h3>
                        <div class="su-flex su-gap-20 su-max-w-[71.9rem] su-flex-col md:su-gap-x-27 md:su-gap-y-12 md:su-flex-row md:su-flex-wrap md:su-justify-center">
                          
                            <div key="28401">
                              <a href="https://news.stanford.edu/research-and-scholarship/topic/earth-and-climate" class="su-no-underline su-leading-snug hover:su-underline su-text-digital-red dark:su-text-dark-mode-red dark:hover:su-text-white hover:su-text-black su-text-19 su-font-semibold">
                                Earth & Climate
                              </a>
                            </div>
                          
                            <div key="28605">
                              <a href="https://news.stanford.edu/sustainability" class="su-no-underline su-leading-snug hover:su-underline su-text-digital-red dark:su-text-dark-mode-red dark:hover:su-text-white hover:su-text-black su-text-19 su-font-semibold">
                                Sustainability
                              </a>
                            </div>
                          
                        </div>
                      </div>
                    

                    <div class="su-text-center su-rs-mt-4 su-flex su-flex-col su-gap-20 md:su-gap-26">
                      <h3 class="su-text-18 su-font-bold su-leading-snug !su-m-0 su-font-sans">Share this story</h3>
                      <button
                        type="button"
                        data-role="copy-link"
                        class="su-text-digital-blue dark:su-text-digital-blue-vivid su-text-21 su-font-semibold su-mx-auto hocus:su-underline"
                      >
                        <span data-copy-text>Copy link</span>
                        <span class="*:su-inline-block *:su-ml-8">
                          
              	<svg
              		xmlns="http://www.w3.org/2000/svg"
              		width="16"
              		height="16"
              		viewBox="0 0 16 16"
              		fill="none"
              	>
              		<path
              		d="M13 6C14.6569 6 16 4.65685 16 3C16 1.34315 14.6569 0 13 0C11.3431 0 10 1.34315 10 3C10 3.12548 10.0077 3.24917 10.0227 3.37061L5.08259 5.84064C4.54303 5.32015 3.8089 5 3 5C1.34315 5 0 6.34315 0 8C0 9.65685 1.34315 11 3 11C3.80892 11 4.54306 10.6798 5.08263 10.1593L10.0227 12.6293C10.0077 12.7508 10 12.8745 10 13C10 14.6569 11.3431 16 13 16C14.6569 16 16 14.6569 16 13C16 11.3431 14.6569 10 13 10C12.1911 10 11.457 10.3201 10.9174 10.8406L5.97733 8.37061C5.9923 8.24917 6 8.12548 6 8C6 7.8745 5.99229 7.7508 5.97733 7.62934L10.9174 5.15932C11.4569 5.67984 12.1911 6 13 6Z"
              		fill="#006CB8"
              		/>
              	</svg>
                        </span>
                      </button>
                    </div>
                </div></section>"
            `);
        });
    });

    describe('[Edge Cases]', () => {
        it('Should throw error when fetch for metadata data will fail', async () => {
            metadataDataAdapter.mockImplementation(() => ({
                setMetadataService: vi.fn(),
                getMetadataData: vi.fn().mockRejectedValueOnce(new Error('Network Error'))
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Metadata Fields component: Error parsing metadata data JSON response: Network Error -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for metadata data will not return object', async () => {
            metadataDataAdapter.mockImplementation(() => ({
                setMetadataService: vi.fn(),
                getMetadataData: vi.fn().mockResolvedValueOnce('test')
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Metadata Fields component: Error parsing metadata data JSON response: Invalid API response: metadataData is missing or not an object. -->');
            expect(mockedError).toBeCalledTimes(1);
        });        
    });
});
