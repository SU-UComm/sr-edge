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
                "image": "matrix-asset://stanfordNews/63356",
                "title": "Three Example Three",
                "author": "Susannah Young-ah Gottlieb",
                "teaserText": "Third on W. H. Auden's work from the late 1930s, when he seeks to understand the poet's responsibility in the face of a triumphant fascism, to the late 1950s, when he discerns an irreconcilable \"divorce\" between poetry...",
                "linkUrl": "https://www.squiz.net"
            },
            {
                "cardType": "Podcast",
                "image": "matrix-asset://stanfordNews/63357",
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

            expect(result).toContain('data-component="media-carousel"');
            expect(result).toContain('data-unique-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"');
            expect(result).toContain("https://picsum.photos/400/400");
            expect(result).toContain("Three Example Three");
            expect(result).toContain("Susannah Young-ah Gottlieb");
            expect(result).toContain("Magazine");
            expect(result).toContain("Third on W. H. Auden&#x27;s work from the late 1930s");
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

            expect(result).toContain('data-component="media-carousel"');
            expect(result).toContain('data-unique-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"');
            expect(result).toContain("https://picsum.photos/400/400");
            expect(result).toContain("Three Example Three");
            expect(result).toContain("Susannah Young-ah Gottlieb");
            expect(result).toContain("Magazine");
            expect(result).toContain("Third on W. H. Auden&#x27;s work from the late 1930s");
            expect(result).toContain("data-testid=svg-arrow-up-right");

        });
    });
});
