import { beforeEach, describe, expect, it, vi } from 'vitest';
import { basicHeroDataAdapter } from '../../global/js/utils';

import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

const mockedFetch = {
    storyType: "Basic",
    bannerType: "normal",
    contentType: "Video",
    titleAlignment: "left",
    orientation: "vertical",
    pubDate: "2024-01-01 00:00:00",
    pubDateFormatted: "January 1st, 2024",
    mediaType: "carousel",
    topic: {
        asset_assetid: "28411",
        asset_name: "Community & Culture",
        asset_url: "https://news.stanford.edu/on-campus/topic/community-and-culture",
        topicPath: "/on-campus/topic/community-and-culture",
        target_id: "141735",
        group: "127852",
        type: "content_topic",
        sectionSummary: ""
    },
    media: {
        type: "standard",
        featureImage: {
            id: "152005",
            url: "https://news.stanford.edu/__data/assets/image/0013/152005/Architecture-Model-Making-Class-Workshop.jpg",
            alt: "Students in a woodshop workshop pose for a photo with their tools.",
            height: "1000",
            width: "1500"
        },
        featureVideo: {
            id: "N3LIzuRaYzg"
        },
        carousel: [
            {
                asset_assetid: "166306",
                asset_url: "https://news.stanford.edu/__data/assets/image/0022/166306/GettyImages-453700781-seaweed.jpg",
                asset_attribute_alt: "A woman in a straw hat pulls up a rope of seaweed in a tidal seaweed farm on Nusa Lemongan Island where the economy is driven by seaweed production and tourism. A basket of harvested seeweed floats on an inner tube behind her.",
                asset_attribute_height: "1000",
                asset_attribute_width: "1500",
                asset_attribute_caption: ""
            },
            {
                asset_assetid: "166316",
                asset_url: "https://news.stanford.edu/__data/assets/image/0023/166316/SDSConference050724_604DG.jpg",
                asset_attribute_alt: "An image of SDS scholar alumna, Grace Guan, presenting her research at the 2024 Stanford Data Science Conference.",
                asset_attribute_height: "1000",
                asset_attribute_width: "1500",
                asset_attribute_caption: ""
            },
            {
                asset_assetid: "166335",
                asset_url: "https://news.stanford.edu/__data/assets/image/0024/166335/LS103940-1500x1000-Imbens.jpg",
                asset_attribute_alt: "Guido Imbens stands on the distinctive stairway of the Computing and Data Science building.",
                asset_attribute_height: "1000",
                asset_attribute_width: "1500",
                asset_attribute_caption: "Credit: Aaron Kehoe"
            },
            {
                asset_assetid: "166440",
                asset_url: "https://news.stanford.edu/__data/assets/image/0021/166440/Carolyn-bertozzi_baner.jpeg",
                asset_attribute_alt: "",
                asset_attribute_height: "844",
                asset_attribute_width: "1500",
                asset_attribute_caption: ""
            }
        ],
        caption: "",
        credit: "Image: Courtesy of making@stanford",
        captions: [
            {
                caption: "This is caption 01",
                credit: "Dave"
            },
            {
                caption: "This is caption 02",
                credit: "Also Dave"
            },
            {
                caption: "This is caption 03",
                credit: "Dave again"
            },
            {
                caption: "This is caption 04",
                credit: "Aaaaand Dave again"
            },
            {
                caption: "",
                credit: ""
            },
            {
                caption: "",
                credit: ""
            }
        ]
    },
    title: "Spotlight on Stanford makerspaces",
    summary: ""
}

vi.mock('../../global/js/utils', () => ({
    readingTime: vi.fn(() => 5),
    matrixBasicHeroService: vi.fn(),
    basicHeroDataAdapter: vi.fn().mockImplementation(() => ({
        setBasicHeroService: vi.fn(),
        getBasicHeroData: vi.fn().mockResolvedValue(mockedFetch),
    }))
}));

describe('[Feature Story Hero]', () => {
    const defaultMockData = {};

    const defaultMockInfo = {
        env: {
            BASE_DOMAIN: 'https://example.com/json',
        },
        fns: {
            assetId: '167010'
        }
    };
    
    beforeEach(() => {
        vi.clearAllMocks();
    });
    
    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters were provided', async () => {
            const result = await main();
            
            expect(result).toContain('<!-- Error occurred in the Feature Story Hero component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Feature Story Hero component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Feature Story Hero component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw error when fns or ctx is invalid', async () => {
            const mockInfo = { 
                env: defaultMockInfo.env,
                fns: undefined, 
                ctx: undefined,
            };
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Feature Story Hero component: The "info.fns.assetId" field cannot be undefined and must be a non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fns.assetId is an empty string', async () => {
            const mockInfo = { 
                env: defaultMockInfo.env,
                fns: {
                    assetId: ''
                }, 
            };
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Feature Story Hero component: The "info.fns.assetId" field cannot be undefined and must be a non-empty string. The "" was received. -->');
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

            expect(result).toBe('<!-- Error occurred in the Feature Story Hero component: The "info.fns.assetId" field cannot be undefined and must be a non-empty string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        it('Should return the expected HTML with valid data', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='feature-story-hero'> <div class='su-mx-auto su-component-container su-container-large su-container-px'><div class='basic-story__header su-rs-pt-8 su-relative su-flex su-flex-col su-items-start md:su-items-end' ><div class='su-relative su-w-full su-z-10'><h1 class='su-text-shadow-title su-shadow-white dark:su-shadow-black-true su-mt-0 su-break-words su-font-bold su-leading-[119.4%] md:su-leading-leading su-text-[4.6rem] sm:su-text-[6.1rem] lg:su-text-[9.6rem] font-serif-4 su-w-[83.333%] md:su-w-[66.666%] lg:su-w-[70%] su-pr-20 su-mb-[-.5em]' >Spotlight on Stanford makerspaces</h1></div><div class='sm:su-overflow-visible su-relative su-pl-[calc(16.666%+10px)] lg:su-pl-[20%] su-w-full' ><div aria-hidden='true' class='su-mt-[-63px] sm:su-mt-[-85px] lg:su-mt-[-131px] su-w-[16.66%] md:su-w-1/3 lg:su-w-[30%] su-h-2 md:su-h-3 su-absolute su-right-0 su-top-0 su-bg-gradient' ></div><div aria-hidden='true' class='su-leading-[119.4%] md:su-leading-display su-text-[4.6rem] sm:su-text-[6.1rem] lg:su-text-[9.6rem] su-w-[2px] md:su-w-[3px] su-absolute su-left-0 su-bottom-0 su-bg-gradient-b su-h-[calc(100%-1.25em)]' ></div><figure class='basic-story__header-image su-relative su-flex su-items-center su-flex-col su-gap-8 sm:su-gap-15 su-pb-11 md:su-pb-13 su-rs-mb-5 md:su-rs-mb-7 xl:su-rs-mb-9' ><img src='https://news.stanford.edu/__data/assets/image/0013/152005/Architecture-Model-Making-Class-Workshop.jpg' alt='Students in a woodshop workshop pose for a photo with their tools.' class='su-relative su-w-full su-block' /><figcaption class='su-text-14 md:su-text-16 su-text-center su-m-0 sm:su-w-3/4' >Image: Courtesy of making@stanford</figcaption><div class='su-bg-gradient-to-b su-from-white su-via-[rgb(255_255_255/.5)_8%] dark:su-from-black-true dark:su-via-[rgb(0_0_0/.5)_8%] su-to-50% su-opacity-75 su-absolute su-w-full su-h-full su-bottom-0 su-left-0' ></div></figure><div class='su-w-full su-h-min su-mx-auto su-font-semibold su-text-center font-serif-4 su-text-21 su-leading-[28.79px] su-m-0 sm:su-text-[22.5px] sm:su-leading-[27px] md:su-w-4/5 lg:su-text-[32px] lg:su-leading-[41.68px]' ></div><span class='su-w-full su-flex su-items-center su-justify-center su-text-18 su-leading-[27px] su-gap-7 su-rs-mt-5 md:su-rs-mt-7 sm:su-text-23 sm:su-leading-[28.75px] md:su-basefont-23 md:su-flex-row' ><time class='su-m-0 su-font-semibold' >January 1st, 2024</time>|&nbsp;<span data-reading='true'>5</span>&nbsp;min read</span></div></div></div> </section>"`);
        });

        it('Should return the expected HTML for orientation set to full', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    orientation: 'full',
                })
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='feature-story-hero'> <div class='su-mx-auto su-component-container su-container-wide su-container-px'><header class='featured-story__header-v2 su-relative'><div class='su-relative su-w-screen su-left-[50%] su-translate-x-[-50%]' ><img class='su-w-full su-max-w-none' src='https://news.stanford.edu/__data/assets/image/0013/152005/Architecture-Model-Making-Class-Workshop.jpg' alt='Students in a woodshop workshop pose for a photo with their tools.' /><div class='su-bg-gradient-to-t su-from-white su-via-[rgb(255_255_255/.5)_8%] dark:su-from-black-true dark:su-via-[rgb(0_0_0/.5)_8%] su-to-50% su-absolute su-w-full su-h-full su-bottom-0 su-left-0' ></div></div><div id='main-content' class='su-relative su-z-10 su-grid su-grid-cols-6 md:su-items-center md:su-grid-cols-12 su-gap-y-0 su-grid-gap md:su-px-0 su-flex-wrap su-mx-auto su-pt-[11.4rem] -su-mt-[16.2rem]' ><div class='su-col-span-6 md:su-col-span-7 md:su-col-start-1 lg:su-col-span-8 lg:su-col-start-1 lg:su-pr-30' ><h1 class='su-text-shadow-title su-shadow-white dark:su-shadow-black-true su-text-left su-w-full su-break-words su-my-0 md:su-rs-py-6 lg:su-rs-py-5 md:su-text-right su-font-serif su-leading-[119.4%] md:su-leading-[120%] su-text-[4.6rem] sm:su-text-[6.1rem] lg:su-text-[9.5rem]' >Spotlight on Stanford makerspaces</h1></div><div class='su-hidden md:su-block md:su-col-span-1 md:su-col-start-8 lg:su-col-start-9 lg:su-col-span-4 su-h-full lg:su-hidden' ><div class='su-bg-gradient-light-red su-h-full su-w-3 su-left-0 su-top-0 su-mx-auto' ></div></div><div class='su-relative su-mt-50 md:su-mt-0 su-col-span-6 su-pl-32 md:su-pl-0 md:su-col-span-4 md:su-col-start-9 su-self-stretch lg:su-pl-48 lg:su-translate-x-[1.5rem]' ><div class='su-flex su-flex-col su-h-full'><div class='md:su-hidden su-absolute su-bg-gradient-light-red su-h-full su-w-3 su-left-0 su-top-0 lg:su-block' ></div><div class='su-text-shadow-title su-shadow-white dark:su-shadow-black-true lg:su-max-w-[29.2rem] su-m-0 su-font-serif su-text-20 su-leading-[119.4%] su-mb-rs-5 md:su-text-21 md:su-leading-[130.245%] md:su-pb-72 lg:su-text-24 su-font-semibold su-pb-80 md:su-pb-0' ></div><span class='su-w-auto md:su-mt-auto su-text-16 su-leading-[19.1px] su-flex su-gap-[7px] md:su-basefont-23 md:su-text-21 md:su-leading-[26.25px]' ><time class='su-m-0 md:su-mt-0 md:su-mr-4 su-font-semibold' >January 1st, 2024</time>|&nbsp;<span data-reading='true'>5</span>&nbsp;min read</span></div></div></div></header></div> </section>"`);
        });

        it('Should return the expected HTML for orientation set to horizontal', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    orientation: 'horizontal',
                })
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='feature-story-hero'> <header class='basic-story__header su-rs-pt-8 su-relative su-w-full'><div class='su-mx-auto su-component-container su-container-large su-container-px'><div class='su-relative'><div class='su-relative'><div class='su-leading-[119.4%] md:su-leading-display su-text-[4.6rem] sm:su-text-[6.1rem] lg:su-text-[9.5rem] su-w-2 su-z-0 md:su-w-3 lg:su-w-4 su-absolute su-rotate-180 su-top-[1.75em] su-left-0 su-bg-gradient-light-red md:su-hidden su-h-[calc(100%-2.25em)]' ></div><div class='su-relative su-grid su-grid-cols-6 md:su-grid-cols-12 lg:su-grid-cols-10 su-grid-gap' ><h1 class='su-leading-[119.4%] md:su-leading-display su-text-[4.6rem] sm:su-text-[6.1rem] lg:su-text-[9.5rem] su-text-shadow-title su-shadow-white dark:su-shadow-black-true selection:su-relative md:su-max-h-[6em] su-z-10 su-text-right su-ml-auto su-mt-0 su-break-words su-font-bold font-serif-4 su-col-span-5 md:su-col-span-8 lg:su-col-span-7 su-col-start-2 md:su-col-start-5 lg:su-col-start-4 su-mb-[-.5em]' >Spotlight on Stanford makerspaces</h1><div class='su-leading-[119.4%] md:su-leading-display su-text-[4.6rem] sm:su-text-[6.1rem] lg:su-text-[9.5rem] su-absolute su-w-full su-grid su-grid-gap su-grid-cols-6 md:su-grid-cols-12 lg:su-grid-cols-10 su-z-0 su-top-[1.75em] md:su-top-auto md:su-bottom-[12.3rem] lg:su-bottom-[15.5rem]' ><div class='su-col-span-1 md:su-col-span-4 lg:su-col-span-3 su-h-[2px] md:su-h-[3px] lg:su-h-[4px] su-bg-gradient-light-red-h su-rotate-180' ></div></div></div><div class='su-relative'><div class='su-leading-[119.4%] md:su-leading-display su-text-[4.6rem] sm:su-text-[6.1rem] lg:su-text-[9.5rem] su-w-[2px] su-z-0 md:su-w-[3px] lg:su-w-[4px] su-absolute su-top-[1.75em] su-left-0 su-bg-gradient-light-red dark:su-rotate-180 su-hidden md:su-top-auto md:su-block su-h-[calc(100%+12.3rem-.5em)] lg:su-h-[calc(100%+15.5rem-.5em)] md:su-bottom-[.5em]' ></div><figure class='basic-story__header-image su-gap-6 su-col-span-full su-z-0 md:su-gap-18 lg:su-gap-15' ><div class='su-relative su-w-screen su-left-1/2 su-translate-x-[-50%] su-max-w-1500' ><img src='https://news.stanford.edu/__data/assets/image/0013/152005/Architecture-Model-Making-Class-Workshop.jpg' alt='Students in a woodshop workshop pose for a photo with their tools.' class='su-relative su-w-full su-max-w-none' /><div class='su-bg-gradient-to-b su-from-white su-via-[rgb(255_255_255/.5)_8%] dark:su-from-black-true dark:su-via-[rgb(0_0_0/.5)_8%] su-to-50% su-opacity-75 su-absolute su-w-full su-h-full su-bottom-0 su-left-0' ></div></div><div class='su-rs-pb-9 su-relative'><div aria-hidden='true' class='su-w-[2px] md:su-w-[3px] lg:su-w-[4px] su-h-full su-absolute su-right-0 su-bg-digital-red-light dark:su-bg-olive su-z-0' ></div><figcaption class='su-text-inherit su-pb-[1.1rem] md:su-pb-[1.3rem] su-pt-[.9rem] su-mt-0 su-mb-0 su-w-[calc(100%-40px)] md:su-w-[83.333%] lg:su-w-[50%] lg:su-max-w-[633px] su-mx-auto su-text-center su-text-[1.4rem] md:su-text-[1.6rem]' >Image: Courtesy of making@stanford</figcaption></div></figure></div></div><div class='su-relative ' ><div aria-hidden='true' class='su-w-2 md:su-w-3 lg:su-w-4 su-h-full su-absolute su-top-0 su-right-0 su-bg-gradient-light-red dark:su-rotate-180 su-z-0' ></div><div class='su-grid su-grid-gap su-grid-cols-6 md:su-grid-cols-12 lg:su-grid-cols-10 su-px-20 md:su-px-0' ><div class='su-font-semibold su-text-left su-col-span-6 md:su-col-span-10 md:su-col-start-2 lg:su-col-span-6 lg:su-col-start-2 font-serif-4 su-text-21 su-leading-[125.28%] md:su-text-25 lg:su-text-32 su-mb-0' ></div></div><div class='su-grid su-grid-gap su-grid-cols-6 md:su-grid-cols-12 lg:su-grid-cols-10 su-px-20 md:su-px-0' ><span class='su-col-span-6 md:su-col-span-10 md:su-col-start-2 lg:su-col-span-8 lg:su-col-start-2 su-rs-mt-5 su-text-right su-text-1' ><time class='su-m-0 md:su-mt-0 md:su-mr-4 su-font-semibold' >January 1st, 2024</time>|&nbsp;<span data-reading='true'>5</span>&nbsp;min read</span></div></div></div></div></header> </section>"`);
        });
    });

    describe('[Edge Cases]', () => {
        it('Should throw error when fetch for header data will fail', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockRejectedValueOnce(new Error('Network Error'))
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Feature Story Hero component: Error parsing hero data JSON response: Network Error -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will not return object', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce('test')
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Feature Story Hero component: Error parsing hero data JSON response: Invalid API response: heroData is missing or not an object. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will return data without title', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    title: undefined
                })
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Feature Story Hero component: The "title" must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will return data with empty title', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    title: ""
                })
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Feature Story Hero component: The "title" must be non-empty string. The "" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will return media that is not an object', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    media: 123
                })
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Feature Story Hero component: The "media" must be an object. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will return summary that is not a string', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    summary: 123
                })
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Feature Story Hero component: The "summary" must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will return pubDateFormatted that is not a string', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    pubDateFormatted: 123
                })
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Feature Story Hero component: The "pubDateFormatted" must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will return orientation not one of ["vertical", "full", "horizontal"]', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    orientation: "test"
                })
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Feature Story Hero component: The "orientation" must be one of ["vertical", "full", "horizontal"]. The "test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });
});
