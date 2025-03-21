import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { cardDataAdapter, matrixMediaCardService, isRealExternalLink, uuid } from "../../global/js/utils";
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    uuid: vi.fn(),
    isRealExternalLink: vi.fn(),
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
    SidebarHeading: vi.fn().mockImplementation(() => `
    <h2 class="su-component-sidebar-heading su-w-full su-flex su-flex-wrap su-gap-6 su-my-0 su-font-sans su-text-black-90 dark:su-text-white su-font-semibold su-text-18 su-items-end">
    <span data-test="icon" class="dark:su-hidden">
        <svg data-testid="svg-featuredreading-light" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="29" height="24" viewBox="0 0 29 24" fill="none">
        <path d="M13.3392 2.22359V18.7221L4.21239 16.967V2.34206C4.21239 1.47325 4.99344 0.81068 5.84908 0.955481L13.3392 2.22359ZM3.93595 18.5949L14.0413 20.6177L24.1467 18.5949C24.8048 18.4632 25.2744 17.8884 25.2744 17.2171V2.08317L26.402 1.85939C27.2709 1.68387 28.0826 2.34645 28.0826 3.23281V19.3277C28.0826 19.999 27.6087 20.5738 26.9549 20.7055L14.0413 23.2855L1.12769 20.7011C0.473894 20.5738 0 19.9946 0 19.3277V3.23281C0 2.34645 0.811763 1.68387 1.68057 1.85939L2.80826 2.08317V17.2215C2.80826 17.8928 3.28216 18.4676 3.93595 18.5993V18.5949ZM14.7434 18.7221V2.22359L22.2335 0.955481C23.0892 0.81068 23.8702 1.47325 23.8702 2.34206V16.967L14.7434 18.7221Z" fill="url(#id-1-featured_reading_light)"></path>
        <defs>
            <linearGradient id="id-1-featured_reading_light" x1="28.0826" y1="0.935547" x2="13.6523" y2="11.6856" gradientUnits="userSpaceOnUse">
            <stop stop-color="#E50808"></stop>
            <stop offset="1" stop-color="#820000"></stop>
            </linearGradient>
        </defs>
        </svg>
    `),
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
              "<section data-component="media-carousel" data-unique-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"> <div class="su-mx-auto su-component-container su-container-large su-container-px"> <div class="component-slider"> <div class="swiper component-slider-single component-slider-peek"> <div class="swiper-wrapper">   <div class="swiper-slide"> <article aria-label="Three Example Three" data-test="media-card" class="su-component-card-media md:su-min-h-[38.4rem] su-relative su-w-full md:su-px-0 su-flex su-flex-wrap su-justify-center su-gap-20 md:su-gap-36 md:su-gap-48 md:su-flex-nowrap su-items-center">  <div class="su-relative su-w-full su-px-20 md:su-px-0 su-h-[34.2rem] lg:su-h-[57.2rem] lg:su-py-30 su-min-w-[24.9rem] lg:su-min-w-[38.2rem] lg:su-max-w-[38.2rem] su-flex su-items-center su-justify-center"> <img class="su-media-card-thumb su-size-full su-object-scale-down su-object-center" src="https://picsum.photos/400/400" alt="" /> </div>  <div class="su-media-card-text su-grow su-w-full md:su-w-auto">  <div class="su-mb-20 md:su-mb-27"> 
                  <h2 class="su-component-sidebar-heading su-w-full su-flex su-flex-wrap su-gap-6 su-my-0 su-font-sans su-text-black-90 dark:su-text-white su-font-semibold su-text-18 su-items-end">
                  <span data-test="icon" class="dark:su-hidden">
                      <svg data-testid="svg-featuredreading-light" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="29" height="24" viewBox="0 0 29 24" fill="none">
                      <path d="M13.3392 2.22359V18.7221L4.21239 16.967V2.34206C4.21239 1.47325 4.99344 0.81068 5.84908 0.955481L13.3392 2.22359ZM3.93595 18.5949L14.0413 20.6177L24.1467 18.5949C24.8048 18.4632 25.2744 17.8884 25.2744 17.2171V2.08317L26.402 1.85939C27.2709 1.68387 28.0826 2.34645 28.0826 3.23281V19.3277C28.0826 19.999 27.6087 20.5738 26.9549 20.7055L14.0413 23.2855L1.12769 20.7011C0.473894 20.5738 0 19.9946 0 19.3277V3.23281C0 2.34645 0.811763 1.68387 1.68057 1.85939L2.80826 2.08317V17.2215C2.80826 17.8928 3.28216 18.4676 3.93595 18.5993V18.5949ZM14.7434 18.7221V2.22359L22.2335 0.955481C23.0892 0.81068 23.8702 1.47325 23.8702 2.34206V16.967L14.7434 18.7221Z" fill="url(#id-1-featured_reading_light)"></path>
                      <defs>
                          <linearGradient id="id-1-featured_reading_light" x1="28.0826" y1="0.935547" x2="13.6523" y2="11.6856" gradientUnits="userSpaceOnUse">
                          <stop stop-color="#E50808"></stop>
                          <stop offset="1" stop-color="#820000"></stop>
                          </linearGradient>
                      </defs>
                      </svg>
                   </div>   <h3 class="su-text-[3.5rem] su-leading-tight md:su-text-[4rem] lg:su-text-[4.3rem] su-mb-5">  <a href="https://www.squiz.net" class="su-group su-text-black su-transition dark:su-text-white hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red hocus:su-underline"> <span>Three Example Three</span>  </a>  </h3>  <div data-test="mediacard-author" class="su-mb-15 md:su-mb-19">Susannah Young-ah Gottlieb</div>  <div class="su-text-18 md:su-text-16 su-mb-15 md:su-mb-19 su-gap-6 su-text-black-70 dark:su-text-black-50 su-flex su-nowrap su-items-center su-leading-none"> <svg aria-hidden="true" focusable="false" data-testid=svg-book-open data-prefix="fas" data-icon="book-open" class="svg-inline--fa fa-book-open " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="20"> <path fill="currentColor" d="M249.6 471.5c10.8 3.8 22.4-4.1 22.4-15.5l0-377.4c0-4.2-1.6-8.4-5-11C247.4 52 202.4 32 144 32C93.5 32 46.3 45.3 18.1 56.1C6.8 60.5 0 71.7 0 83.8L0 454.1c0 11.9 12.8 20.2 24.1 16.5C55.6 460.1 105.5 448 144 448c33.9 0 79 14 105.6 23.5zm76.8 0C353 462 398.1 448 432 448c38.5 0 88.4 12.1 119.9 22.6c11.3 3.8 24.1-4.6 24.1-16.5l0-370.3c0-12.1-6.8-23.3-18.1-27.6C529.7 45.3 482.5 32 432 32c-58.4 0-103.4 20-123 35.6c-3.3 2.6-5 6.8-5 11L304 456c0 11.4 11.7 19.3 22.4 15.5z"></path> </svg> <span class="su-font-semibold">Magazine</span> </div>   <div data-test="mediacard-description" class="*:su-my-0 *:su-leading-[125%] su-leading-[125%] *:su-text-18 su-text-18 md:*:su-text-19 md:su-text-19 lg:*:su-text-21 lg:su-text-21 dark:su-text-white su-font-sans su-w-full"> Third on W. H. Auden&#x27;s work from the late 1930s, when he seeks to understand the poet&#x27;s responsibility in the face of a triumphant fascism, to the late 1950s, when he discerns an irreconcilable &quot;divorce&quot; between poetry... </div>  </div> </article> </div>  <div class="swiper-slide"> <article aria-label="Four Example Four news.stanford.edu link" data-test="media-card" class="su-component-card-media md:su-min-h-[38.4rem] su-relative su-w-full md:su-px-0 su-flex su-flex-wrap su-justify-center su-gap-20 md:su-gap-36 md:su-gap-48 md:su-flex-nowrap su-items-center">  <div class="su-relative su-w-full su-px-20 md:su-px-0 su-h-[34.2rem] lg:su-h-[57.2rem] lg:su-py-30 su-min-w-[24.9rem] lg:su-min-w-[38.2rem] lg:su-max-w-[38.2rem] su-flex su-items-center su-justify-center"> <img class="su-media-card-thumb su-size-full su-object-scale-down su-object-center" src="https://picsum.photos/400/400" alt="" /> </div>  <div class="su-media-card-text su-grow su-w-full md:su-w-auto">  <div class="su-mb-20 md:su-mb-27"> 
                  <h2 class="su-component-sidebar-heading su-w-full su-flex su-flex-wrap su-gap-6 su-my-0 su-font-sans su-text-black-90 dark:su-text-white su-font-semibold su-text-18 su-items-end">
                  <span data-test="icon" class="dark:su-hidden">
                      <svg data-testid="svg-featuredreading-light" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="29" height="24" viewBox="0 0 29 24" fill="none">
                      <path d="M13.3392 2.22359V18.7221L4.21239 16.967V2.34206C4.21239 1.47325 4.99344 0.81068 5.84908 0.955481L13.3392 2.22359ZM3.93595 18.5949L14.0413 20.6177L24.1467 18.5949C24.8048 18.4632 25.2744 17.8884 25.2744 17.2171V2.08317L26.402 1.85939C27.2709 1.68387 28.0826 2.34645 28.0826 3.23281V19.3277C28.0826 19.999 27.6087 20.5738 26.9549 20.7055L14.0413 23.2855L1.12769 20.7011C0.473894 20.5738 0 19.9946 0 19.3277V3.23281C0 2.34645 0.811763 1.68387 1.68057 1.85939L2.80826 2.08317V17.2215C2.80826 17.8928 3.28216 18.4676 3.93595 18.5993V18.5949ZM14.7434 18.7221V2.22359L22.2335 0.955481C23.0892 0.81068 23.8702 1.47325 23.8702 2.34206V16.967L14.7434 18.7221Z" fill="url(#id-1-featured_reading_light)"></path>
                      <defs>
                          <linearGradient id="id-1-featured_reading_light" x1="28.0826" y1="0.935547" x2="13.6523" y2="11.6856" gradientUnits="userSpaceOnUse">
                          <stop stop-color="#E50808"></stop>
                          <stop offset="1" stop-color="#820000"></stop>
                          </linearGradient>
                      </defs>
                      </svg>
                   </div>   <h3 class="su-text-[3.5rem] su-leading-tight md:su-text-[4rem] lg:su-text-[4.3rem] su-mb-5">  <a href="https://news.stanford.edu/report/2024/04/04/stanford-alum-business-school-dean-jonathan-levin-named-stanford-president/" class="su-group su-text-black su-transition dark:su-text-white hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red hocus:su-underline"> <span>Four Example Four news.stanford.edu link</span>  </a>  </h3>  <div data-test="mediacard-author" class="su-mb-15 md:su-mb-19">Susannah Young-ah Gottlieb</div>  <div class="su-text-18 md:su-text-16 su-mb-15 md:su-mb-19 su-gap-6 su-text-black-70 dark:su-text-black-50 su-flex su-nowrap su-items-center su-leading-none"> <svg aria-hidden="true" focusable="false" data-testid=svg-microphone data-prefix="fas" data-icon="microphone" class="svg-inline--fa fa-microphone " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20"> <path fill="currentColor" d="M192 0C139 0 96 43 96 96l0 160c0 53 43 96 96 96s96-43 96-96l0-160c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6c85.8-11.7 152-85.3 152-174.4l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 70.7-57.3 128-128 128s-128-57.3-128-128l0-40z"></path> </svg> <span class="su-font-semibold">Podcast</span> </div>   <div data-test="mediacard-description" class="*:su-my-0 *:su-leading-[125%] su-leading-[125%] *:su-text-18 su-text-18 md:*:su-text-19 md:su-text-19 lg:*:su-text-21 lg:su-text-21 dark:su-text-white su-font-sans su-w-full"> Fourth concentrating on W. H. Auden&#x27;s work from the late 1930s, when he seeks to understand the poet&#x27;s responsibility in the face of a triumphant fascism, to the late 1950s, when he discerns an irreconcilable &quot;divorce&quot; between poetry... </div>  </div> </article> </div>   </div> </div> <div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center"> <div aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination-476f6893-b77b-43d8-ac8c-ac74d3d75dd7 su-mr-full"></div> <button class="component-slider-btn component-slider-prev" type="button"> <span class="sr-only">Previous</span> <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">                                                                         <svg class='su-fill-transparent su-stroke-current ' data-testid='svg-chevron-right' xmlns='http://www.w3.org/2000/svg' width='18' height='19' viewBox='0 0 18 19' fill='none' aria-hidden='true' > <path d='M6.75 4.25L12 9.5L6.75 14.75' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' /> </svg>                                              </span> </button> <button class="component-slider-btn component-slider-next" type="button"> <span class="sr-only">Next</span> <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">                                                                         <svg class='su-fill-transparent su-stroke-current ' data-testid='svg-chevron-right' xmlns='http://www.w3.org/2000/svg' width='18' height='19' viewBox='0 0 18 19' fill='none' aria-hidden='true' > <path d='M6.75 4.25L12 9.5L6.75 14.75' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' /> </svg>                                              </span> </button> </div> </div> </div></section>"
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

        it('Should return the expected HTML with external links', async () => {
            isRealExternalLink.mockReturnValue(true);
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`
              "<section data-component="media-carousel" data-unique-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"> <div class="su-mx-auto su-component-container su-container-large su-container-px"> <div class="component-slider"> <div class="swiper component-slider-single component-slider-peek"> <div class="swiper-wrapper">   <div class="swiper-slide"> <article aria-label="Three Example Three" data-test="media-card" class="su-component-card-media md:su-min-h-[38.4rem] su-relative su-w-full md:su-px-0 su-flex su-flex-wrap su-justify-center su-gap-20 md:su-gap-36 md:su-gap-48 md:su-flex-nowrap su-items-center">  <div class="su-relative su-w-full su-px-20 md:su-px-0 su-h-[34.2rem] lg:su-h-[57.2rem] lg:su-py-30 su-min-w-[24.9rem] lg:su-min-w-[38.2rem] lg:su-max-w-[38.2rem] su-flex su-items-center su-justify-center"> <img class="su-media-card-thumb su-size-full su-object-scale-down su-object-center" src="https://picsum.photos/400/400" alt="" /> </div>  <div class="su-media-card-text su-grow su-w-full md:su-w-auto">  <div class="su-mb-20 md:su-mb-27"> 
                  <h2 class="su-component-sidebar-heading su-w-full su-flex su-flex-wrap su-gap-6 su-my-0 su-font-sans su-text-black-90 dark:su-text-white su-font-semibold su-text-18 su-items-end">
                  <span data-test="icon" class="dark:su-hidden">
                      <svg data-testid="svg-featuredreading-light" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="29" height="24" viewBox="0 0 29 24" fill="none">
                      <path d="M13.3392 2.22359V18.7221L4.21239 16.967V2.34206C4.21239 1.47325 4.99344 0.81068 5.84908 0.955481L13.3392 2.22359ZM3.93595 18.5949L14.0413 20.6177L24.1467 18.5949C24.8048 18.4632 25.2744 17.8884 25.2744 17.2171V2.08317L26.402 1.85939C27.2709 1.68387 28.0826 2.34645 28.0826 3.23281V19.3277C28.0826 19.999 27.6087 20.5738 26.9549 20.7055L14.0413 23.2855L1.12769 20.7011C0.473894 20.5738 0 19.9946 0 19.3277V3.23281C0 2.34645 0.811763 1.68387 1.68057 1.85939L2.80826 2.08317V17.2215C2.80826 17.8928 3.28216 18.4676 3.93595 18.5993V18.5949ZM14.7434 18.7221V2.22359L22.2335 0.955481C23.0892 0.81068 23.8702 1.47325 23.8702 2.34206V16.967L14.7434 18.7221Z" fill="url(#id-1-featured_reading_light)"></path>
                      <defs>
                          <linearGradient id="id-1-featured_reading_light" x1="28.0826" y1="0.935547" x2="13.6523" y2="11.6856" gradientUnits="userSpaceOnUse">
                          <stop stop-color="#E50808"></stop>
                          <stop offset="1" stop-color="#820000"></stop>
                          </linearGradient>
                      </defs>
                      </svg>
                   </div>   <h3 class="su-text-[3.5rem] su-leading-tight md:su-text-[4rem] lg:su-text-[4.3rem] su-mb-5">  <a href="https://www.squiz.net" class="su-group su-text-black su-transition dark:su-text-white hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red hocus:su-underline"> <span>Three Example Three</span>  <svg aria-hidden="true" focusable="false" data-testid=svg-arrow-up-right data-prefix="far" data-icon="arrow-up-right" class="svg-inline--fa fa-arrow-up-right su-h-auto su-align-middle su-ml-5 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="24"> <path fill="currentColor" d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"></path> </svg>  </a>  </h3>  <div data-test="mediacard-author" class="su-mb-15 md:su-mb-19">Susannah Young-ah Gottlieb</div>  <div class="su-text-18 md:su-text-16 su-mb-15 md:su-mb-19 su-gap-6 su-text-black-70 dark:su-text-black-50 su-flex su-nowrap su-items-center su-leading-none"> <svg aria-hidden="true" focusable="false" data-testid=svg-book-open data-prefix="fas" data-icon="book-open" class="svg-inline--fa fa-book-open " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="20"> <path fill="currentColor" d="M249.6 471.5c10.8 3.8 22.4-4.1 22.4-15.5l0-377.4c0-4.2-1.6-8.4-5-11C247.4 52 202.4 32 144 32C93.5 32 46.3 45.3 18.1 56.1C6.8 60.5 0 71.7 0 83.8L0 454.1c0 11.9 12.8 20.2 24.1 16.5C55.6 460.1 105.5 448 144 448c33.9 0 79 14 105.6 23.5zm76.8 0C353 462 398.1 448 432 448c38.5 0 88.4 12.1 119.9 22.6c11.3 3.8 24.1-4.6 24.1-16.5l0-370.3c0-12.1-6.8-23.3-18.1-27.6C529.7 45.3 482.5 32 432 32c-58.4 0-103.4 20-123 35.6c-3.3 2.6-5 6.8-5 11L304 456c0 11.4 11.7 19.3 22.4 15.5z"></path> </svg> <span class="su-font-semibold">Magazine</span> </div>   <div data-test="mediacard-description" class="*:su-my-0 *:su-leading-[125%] su-leading-[125%] *:su-text-18 su-text-18 md:*:su-text-19 md:su-text-19 lg:*:su-text-21 lg:su-text-21 dark:su-text-white su-font-sans su-w-full"> Third on W. H. Auden&#x27;s work from the late 1930s, when he seeks to understand the poet&#x27;s responsibility in the face of a triumphant fascism, to the late 1950s, when he discerns an irreconcilable &quot;divorce&quot; between poetry... </div>  </div> </article> </div>  <div class="swiper-slide"> <article aria-label="Four Example Four news.stanford.edu link" data-test="media-card" class="su-component-card-media md:su-min-h-[38.4rem] su-relative su-w-full md:su-px-0 su-flex su-flex-wrap su-justify-center su-gap-20 md:su-gap-36 md:su-gap-48 md:su-flex-nowrap su-items-center">  <div class="su-relative su-w-full su-px-20 md:su-px-0 su-h-[34.2rem] lg:su-h-[57.2rem] lg:su-py-30 su-min-w-[24.9rem] lg:su-min-w-[38.2rem] lg:su-max-w-[38.2rem] su-flex su-items-center su-justify-center"> <img class="su-media-card-thumb su-size-full su-object-scale-down su-object-center" src="https://picsum.photos/400/400" alt="" /> </div>  <div class="su-media-card-text su-grow su-w-full md:su-w-auto">  <div class="su-mb-20 md:su-mb-27"> 
                  <h2 class="su-component-sidebar-heading su-w-full su-flex su-flex-wrap su-gap-6 su-my-0 su-font-sans su-text-black-90 dark:su-text-white su-font-semibold su-text-18 su-items-end">
                  <span data-test="icon" class="dark:su-hidden">
                      <svg data-testid="svg-featuredreading-light" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="29" height="24" viewBox="0 0 29 24" fill="none">
                      <path d="M13.3392 2.22359V18.7221L4.21239 16.967V2.34206C4.21239 1.47325 4.99344 0.81068 5.84908 0.955481L13.3392 2.22359ZM3.93595 18.5949L14.0413 20.6177L24.1467 18.5949C24.8048 18.4632 25.2744 17.8884 25.2744 17.2171V2.08317L26.402 1.85939C27.2709 1.68387 28.0826 2.34645 28.0826 3.23281V19.3277C28.0826 19.999 27.6087 20.5738 26.9549 20.7055L14.0413 23.2855L1.12769 20.7011C0.473894 20.5738 0 19.9946 0 19.3277V3.23281C0 2.34645 0.811763 1.68387 1.68057 1.85939L2.80826 2.08317V17.2215C2.80826 17.8928 3.28216 18.4676 3.93595 18.5993V18.5949ZM14.7434 18.7221V2.22359L22.2335 0.955481C23.0892 0.81068 23.8702 1.47325 23.8702 2.34206V16.967L14.7434 18.7221Z" fill="url(#id-1-featured_reading_light)"></path>
                      <defs>
                          <linearGradient id="id-1-featured_reading_light" x1="28.0826" y1="0.935547" x2="13.6523" y2="11.6856" gradientUnits="userSpaceOnUse">
                          <stop stop-color="#E50808"></stop>
                          <stop offset="1" stop-color="#820000"></stop>
                          </linearGradient>
                      </defs>
                      </svg>
                   </div>   <h3 class="su-text-[3.5rem] su-leading-tight md:su-text-[4rem] lg:su-text-[4.3rem] su-mb-5">  <a href="https://news.stanford.edu/report/2024/04/04/stanford-alum-business-school-dean-jonathan-levin-named-stanford-president/" class="su-group su-text-black su-transition dark:su-text-white hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red hocus:su-underline"> <span>Four Example Four news.stanford.edu link</span>  <svg aria-hidden="true" focusable="false" data-testid=svg-arrow-up-right data-prefix="far" data-icon="arrow-up-right" class="svg-inline--fa fa-arrow-up-right su-h-auto su-align-middle su-ml-5 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="24"> <path fill="currentColor" d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"></path> </svg>  </a>  </h3>  <div data-test="mediacard-author" class="su-mb-15 md:su-mb-19">Susannah Young-ah Gottlieb</div>  <div class="su-text-18 md:su-text-16 su-mb-15 md:su-mb-19 su-gap-6 su-text-black-70 dark:su-text-black-50 su-flex su-nowrap su-items-center su-leading-none"> <svg aria-hidden="true" focusable="false" data-testid=svg-microphone data-prefix="fas" data-icon="microphone" class="svg-inline--fa fa-microphone " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20"> <path fill="currentColor" d="M192 0C139 0 96 43 96 96l0 160c0 53 43 96 96 96s96-43 96-96l0-160c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6c85.8-11.7 152-85.3 152-174.4l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 70.7-57.3 128-128 128s-128-57.3-128-128l0-40z"></path> </svg> <span class="su-font-semibold">Podcast</span> </div>   <div data-test="mediacard-description" class="*:su-my-0 *:su-leading-[125%] su-leading-[125%] *:su-text-18 su-text-18 md:*:su-text-19 md:su-text-19 lg:*:su-text-21 lg:su-text-21 dark:su-text-white su-font-sans su-w-full"> Fourth concentrating on W. H. Auden&#x27;s work from the late 1930s, when he seeks to understand the poet&#x27;s responsibility in the face of a triumphant fascism, to the late 1950s, when he discerns an irreconcilable &quot;divorce&quot; between poetry... </div>  </div> </article> </div>   </div> </div> <div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center"> <div aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination-476f6893-b77b-43d8-ac8c-ac74d3d75dd7 su-mr-full"></div> <button class="component-slider-btn component-slider-prev" type="button"> <span class="sr-only">Previous</span> <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">                                                                         <svg class='su-fill-transparent su-stroke-current ' data-testid='svg-chevron-right' xmlns='http://www.w3.org/2000/svg' width='18' height='19' viewBox='0 0 18 19' fill='none' aria-hidden='true' > <path d='M6.75 4.25L12 9.5L6.75 14.75' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' /> </svg>                                              </span> </button> <button class="component-slider-btn component-slider-next" type="button"> <span class="sr-only">Next</span> <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">                                                                         <svg class='su-fill-transparent su-stroke-current ' data-testid='svg-chevron-right' xmlns='http://www.w3.org/2000/svg' width='18' height='19' viewBox='0 0 18 19' fill='none' aria-hidden='true' > <path d='M6.75 4.25L12 9.5L6.75 14.75' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' /> </svg>                                              </span> </button> </div> </div> </div></section>"
            `);
        });
    });
});
