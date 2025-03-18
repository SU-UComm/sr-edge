import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { cardDataAdapter, matrixMediaCardService, uuid } from "../../global/js/utils";
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    uuid: vi.fn(),
    cardDataAdapter: vi.fn().mockImplementation(() => ({
        setCardService: vi.fn(),
        getCards: vi.fn().mockResolvedValue([
            {
                "title": "Three Example Three",
                "liveUrl": "https://www.squiz.net",
                "description": "Third on W. H. Auden's work from the late 1930s, when he seeks to understand the poet's responsibility in the face of a triumphant fascism, to the late 1950s, when he discerns an irreconcilable \"divorce\" between poetry...",
                "imageUrl": "https://picsum.photos/400/400",
                "imageAlt": "",
                "taxonomy": "Featured reading",
                "type": "Magazine",
                "author": "Susannah Young-ah Gottlieb"
            },
            {
                "title": "Four Example Four news.stanford.edu link",
                "liveUrl": "https://news.stanford.edu/report/2024/04/04/stanford-alum-business-school-dean-jonathan-levin-named-stanford-president/",
                "description": "Fourth concentrating on W. H. Auden's work from the late 1930s, when he seeks to understand the poet's responsibility in the face of a triumphant fascism, to the late 1950s, when he discerns an irreconcilable \"divorce\" between poetry...",
                "imageUrl": "https://picsum.photos/400/400",
                "imageAlt": "",
                "taxonomy": "Featured audio",
                "type": "Podcast",
                "author": "Susannah Young-ah Gottlieb"
            }
        ]),
    })),
    matrixMediaCardService: vi.fn(),
    faIcon: {
        "ChevronRight": [`<svg class="su-fill-transparent su-stroke-current" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden=""><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`],
        "CirclePlay": [`<svg class="su-fill-transparent su-stroke-current" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden=""><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`]
    }
}));

vi.mock('../../global/js/helpers', () => ({
    Card: vi.fn().mockImplementation(({ data }) => `<div class="card"><h2>${data?.title}</h2>${data?.description ? `<span>${data.description}</span>`: ''}</div>`),
    Carousel: vi.fn().mockReturnValue(`<div class="component-slider">
    <div class="swiper component-slider-single component-slider-peek">
        <div class="swiper-wrapper">  
        </div>
    </div>
    <div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center">
        <div aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination- su-mr-full"></div>
        <button class="component-slider-btn component-slider-prev" type="button">
            <span class="sr-only">Previous</span>
            <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                
            </span>
        </button>
        <button class="component-slider-btn component-slider-next" type="button">
            <span class="sr-only">Next</span>
            <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                
            </span>
        </button>
    </div>
</div>`),
}));

describe('[Media Carousel]', () => {
    const mockFnsCtx = { resolveUri: vi.fn() };

    const defaultMockData = {
        "cards": [
            {
                "cardType": "Magazine",
                "image": "matrix-asset://api-identifier/63356",
                "title": "Three Example Three",
                "author": "Susannah Young-ah Gottlieb",
                "teaserText": "Third on W. H. Auden's work from the late 1930s, when he seeks to understand the poet's responsibility in the face of a triumphant fascism, to the late 1950s, when he discerns an irreconcilable \"divorce\" between poetry...",
                "linkUrl": "https://www.squiz.net"
            },
            {
                "cardType": "Podcast",
                "image": "matrix-asset://api-identifier/63357",
                "title": "Four Example Four news.stanford.edu link",
                "author": "Susannah Young-ah Gottlieb",
                "teaserText": "Fourth concentrating on W. H. Auden's work from the late 1930s, when he seeks to understand the poet's responsibility in the face of a triumphant fascism, to the late 1950s, when he discerns an irreconcilable \"divorce\" between poetry...",
                "linkUrl": "https://news.stanford.edu/report/2024/04/04/stanford-alum-business-school-dean-jonathan-levin-named-stanford-president/"
            }
        ]
    };

    const defaultMockInfo = {
        env: {
            API_IDENTIFIER: 'sample-api',
        },
        fns: mockFnsCtx
    };
    
    beforeEach(() => {
        vi.clearAllMocks();
    });
    
    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters were provided', async () => {
            const result = await main();
            
            expect(result).toContain('<!-- Error occurred in the Media carousel component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when API_IDENTIFIER was not provided', async () => {
            const mockInfo = {
                env: {
                    ...defaultMockInfo.env,
                    API_IDENTIFIER: undefined
                }
            }

            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Media carousel component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when API_IDENTIFIER was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        ...defaultMockInfo.env,
                        API_IDENTIFIER: undefined
                    }
                }
            }

            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Media carousel component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info was provided', async () => {
            const result = await main(defaultMockData);

            expect(result).toBe('<!-- Error occurred in the Media carousel component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info do not have fns or ctx functions', async () => {
            const mockInfo = {  
                env: {
                    API_IDENTIFIER: 'sample-api',
                }
            }
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Media carousel component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fns or ctx is invalid', async () => {
            const mockInfo = { 
                env: {
                    API_IDENTIFIER: 'sample-api',
                },
                fns: undefined, 
                ctx: undefined,
            };
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Media carousel component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when cars is not an array', async () => {
            const mockData = {
                ...defaultMockData,
                cards: 123
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Media carousel component: The "cards" field cannot be undefined and must be an array with minimum 1 element. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when cars is an empty array', async () => {
            const mockData = {
                ...defaultMockData,
                cards: []
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Media carousel component: The "cards" field cannot be undefined and must be an array with minimum 1 element. The [] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        beforeAll(() => {
            uuid.mockReturnValue('476f6893-b77b-43d8-ac8c-ac74d3d75dd7');
        });

        it('Should return the expected HTML with valid data', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="media-carousel" data-unique-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7">
                  <div class="su-mx-auto su-component-container su-container-large su-container-px">
                      <div class="component-slider">
                  <div class="swiper component-slider-single component-slider-peek">
                      <div class="swiper-wrapper">  
                      </div>
                  </div>
                  <div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center">
                      <div aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination- su-mr-full"></div>
                      <button class="component-slider-btn component-slider-prev" type="button">
                          <span class="sr-only">Previous</span>
                          <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                              
                          </span>
                      </button>
                      <button class="component-slider-btn component-slider-next" type="button">
                          <span class="sr-only">Next</span>
                          <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                              
                          </span>
                      </button>
                  </div>
              </div>
                  </div>
              </section>"
            `);
        });

        it('Should call cardDataAdapter and matrixMediaCardService', async () => {
            await main(defaultMockData, defaultMockInfo);

            expect(cardDataAdapter).toHaveBeenCalled();
            expect(matrixMediaCardService).toHaveBeenCalled();
        });

        it('Should render empty data-unique-id when data not provided', async () => {
            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue([]),
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the Media carousel component: The "data" cannot be undefined or null. The [] was received. -->"`);
        });
    });
});
