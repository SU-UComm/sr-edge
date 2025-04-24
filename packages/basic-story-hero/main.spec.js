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
    uuid: vi.fn(() => '72582803-9357-4d58-823c-c4c2b95b55c6'),
    matrixBasicHeroService: vi.fn(),
    basicHeroDataAdapter: vi.fn().mockImplementation(() => ({
        setBasicHeroService: vi.fn(),
        getBasicHeroData: vi.fn().mockResolvedValue(mockedFetch),
    }))
}));


describe('[Basic Story Hero]', () => {
    const defaultMockData = {};

    const defaultMockInfo = {
        env: {
            BASE_DOMAIN: 'https://example.com/json',
        },
        ctx: {
            assetId: '167010'
        }
    };
    
    beforeEach(() => {
        vi.clearAllMocks();
    });
    
    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters were provided', async () => {
            const result = await main();
            
            expect(result).toContain('<!-- Error occurred in the Basic Story Hero component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Basic Story Hero component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Basic Story Hero component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw error when fns or ctx is invalid', async () => {
            const mockInfo = { 
                env: defaultMockInfo.env,
                fns: undefined, 
                ctx: undefined,
            };
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Basic Story Hero component: The "info.fns.assetId" field cannot be undefined and must be a non-empty string. The undefined was received. -->');
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

            expect(result).toBe('<!-- Error occurred in the Basic Story Hero component: The "info.fns.assetId" field cannot be undefined and must be a non-empty string. The "" was received. -->');
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

            expect(result).toBe('<!-- Error occurred in the Basic Story Hero component: The "info.fns.assetId" field cannot be undefined and must be a non-empty string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        it('Should return the expected HTML with valid data', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='basic-story-hero' data-unique-id="72582803-9357-4d58-823c-c4c2b95b55c6"><div class='su-mx-auto su-component-container su-container-wide su-container-px'><div class='su-grid su-gap su-grid-cols-6 md:su-grid-cols-12'><div class='su-col-span-6 su-col-start-1 md:su-col-span-10 md:su-col-start-2' ><div class='su-flex su-gap-y-8 su-gap-x-16 su-justify-between su-flex-wrap su-text-16 md:su-basefont-23' ><span class='su-flex su-items-center su-justify-center'><time class='su-m-0 su-mr-4 su-font-semibold'>January 1st, 2024</time><span class='su-reading-time su-reading-time-separator' ></span>|&nbsp;<span data-reading='true'>5</span>&nbsp;min read</span><a class='su-font-semibold su-text-digital-red dark:su-text-dark-mode-red su-no-underline hocus:su-underline' href='https://news.stanford.edu/on-campus/topic/community-and-culture' >Community &amp; Culture</a></div><h1 class='su-font-bold su-rs-mt-4 su-font-serif su-mb-0 xl:su-text-[6.4rem]' >Spotlight on Stanford makerspaces</h1><p class='su-font-serif su-intro-text su-mb-0 su-rs-mt-2 su-text-21 su-leading-[27.35px] md:su-text-28 md:su-leading-[36.47px]' ></p></div><div class='su-col-span-6 su-col-start-1 md:su-col-span-12 md:su-col-start-1 su-w-full basic-story__header-slider su-overflow-visible su-rs-mt-4' ><figure class='basic-story__header-image su-col-span-full su-relative su-z-0' ><div class='su-relative su-w-full'><div class="component-slider"><div class="swiper component-slider-single component-slider-peek"><div class="swiper-wrapper"><div class="swiper-slide"><div class="su-aspect-[3/2] su-relative"><img src="https://news.stanford.edu/__data/assets/image/0022/166306/GettyImages-453700781-seaweed.jpg" alt="A woman in a straw hat pulls up a rope of seaweed in a tidal seaweed farm on Nusa Lemongan Island where the economy is driven by seaweed production and tourism. A basket of harvested seeweed floats on an inner tube behind her." class="su-absolute su-top-0 su-left-0 su-w-full su-h-full su-object-scale-down su-object-center" /></div><figcaption class="su-text-16 su-text-black su-mb-0 su-rs-mt-neg1 dark:su-text-white">This is caption 01 | Dave</figcaption></div><div class="swiper-slide"><div class="su-aspect-[3/2] su-relative"><img src="https://news.stanford.edu/__data/assets/image/0023/166316/SDSConference050724_604DG.jpg" alt="An image of SDS scholar alumna, Grace Guan, presenting her research at the 2024 Stanford Data Science Conference." class="su-absolute su-top-0 su-left-0 su-w-full su-h-full su-object-scale-down su-object-center" /></div><figcaption class="su-text-16 su-text-black su-mb-0 su-rs-mt-neg1 dark:su-text-white">This is caption 02 | Also Dave</figcaption></div><div class="swiper-slide"><div class="su-aspect-[3/2] su-relative"><img src="https://news.stanford.edu/__data/assets/image/0024/166335/LS103940-1500x1000-Imbens.jpg" alt="Guido Imbens stands on the distinctive stairway of the Computing and Data Science building." class="su-absolute su-top-0 su-left-0 su-w-full su-h-full su-object-scale-down su-object-center" /></div><figcaption class="su-text-16 su-text-black su-mb-0 su-rs-mt-neg1 dark:su-text-white">This is caption 03 | Dave again</figcaption></div><div class="swiper-slide"><div class="su-aspect-[3/2] su-relative"><img src="https://news.stanford.edu/__data/assets/image/0021/166440/Carolyn-bertozzi_baner.jpeg" alt="" class="su-absolute su-top-0 su-left-0 su-w-full su-h-full su-object-scale-down su-object-center" /></div><figcaption class="su-text-16 su-text-black su-mb-0 su-rs-mt-neg1 dark:su-text-white">This is caption 04 | Aaaaand Dave again</figcaption></div></div></div><div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center"><div aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination-72582803-9357-4d58-823c-c4c2b95b55c6 su-mr-full"></div><button class="component-slider-btn component-slider-prev" type="button"><span class="sr-only">Previous</span><span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block"><svg class='su-fill-transparent su-stroke-current ' data-testid='svg-chevron-right' xmlns='http://www.w3.org/2000/svg' width='18' height='19' viewBox='0 0 18 19' fill='none' aria-hidden='true'><path d='M6.75 4.25L12 9.5L6.75 14.75' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' /></svg></span></button><button class="component-slider-btn component-slider-next" type="button"><span class="sr-only">Next</span><span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block"><svg class='su-fill-transparent su-stroke-current ' data-testid='svg-chevron-right' xmlns='http://www.w3.org/2000/svg' width='18' height='19' viewBox='0 0 18 19' fill='none' aria-hidden='true'><path d='M6.75 4.25L12 9.5L6.75 14.75' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' /></svg></span></button></div></div></div><figcaption class='su-text-16 su-text-black su-mb-0 su-rs-mt-neg1 dark:su-text-white' >Image: Courtesy of making@stanford</figcaption></figure></div></div></div><section data-modal="modal-wrapper"></section></section>"`);
        });

        it('Should return the expected HTML for mediaType set to video', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    mediaType: 'video',
                })
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='basic-story-hero' data-unique-id="72582803-9357-4d58-823c-c4c2b95b55c6"><div class='su-mx-auto su-component-container su-container-wide su-container-px'><div class='su-grid su-gap su-grid-cols-6 md:su-grid-cols-12'><div class='su-col-span-6 su-col-start-1 md:su-col-span-10 md:su-col-start-2' ><div class='su-flex su-gap-y-8 su-gap-x-16 su-justify-between su-flex-wrap su-text-16 md:su-basefont-23' ><span class='su-flex su-items-center su-justify-center'><time class='su-m-0 su-mr-4 su-font-semibold'>January 1st, 2024</time><span class='su-reading-time su-reading-time-separator' ></span>|&nbsp;<span data-reading='true'>5</span>&nbsp;min read</span><a class='su-font-semibold su-text-digital-red dark:su-text-dark-mode-red su-no-underline hocus:su-underline' href='https://news.stanford.edu/on-campus/topic/community-and-culture' >Community &amp; Culture</a></div><h1 class='su-font-bold su-rs-mt-4 su-font-serif su-mb-0 xl:su-text-[6.4rem]' >Spotlight on Stanford makerspaces</h1><p class='su-font-serif su-intro-text su-mb-0 su-rs-mt-2 su-text-21 su-leading-[27.35px] md:su-text-28 md:su-leading-[36.47px]' ></p></div><div class='su-col-span-6 su-col-start-1 md:su-col-span-12 md:su-col-start-1 su-w-full basic-story__header-slider su-overflow-visible su-rs-mt-4' ><figure class='basic-story__header-image su-col-span-full su-relative su-z-0' ><div class='su-relative su-w-full'><button type="button" aria-haspopup="dialog" class="su-w-full su-aspect-[16/9] su-video-trigger" data-click="open-modal" data-modal-id="72582803-9357-4d58-823c-c4c2b95b55c6" ><img src="https://news.stanford.edu/__data/assets/image/0013/152005/Architecture-Model-Making-Class-Workshop.jpg" alt="Students in a woodshop workshop pose for a photo with their tools." class="su-w-full su-h-full su-absolute su-top-0 su-left-0 su-object-cover su-object-center" /><span class="su-play-button-icon-hero su-transition-all su-absolute su-bottom-20 su-left-20 *:su-w-[40px] *:su-h-[40px] *:md:su-w-[60px] *:md:su-h-[60px] *:lg:su-w-[100px] *:lg:su-h-[100px]"><svg data-testid='svg-videoplay' class='su-drop-shadow-[0px_14px_28px_rgba(0,0,0,0.20)] {classes}}' aria-hidden='true' width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M54.375 30C54.375 23.5353 51.8069 17.3355 47.2357 12.7643C42.6645 8.1931 36.4647 5.625 30 5.625C23.5353 5.625 17.3355 8.1931 12.7643 12.7643C8.1931 17.3355 5.625 23.5353 5.625 30C5.625 36.4647 8.1931 42.6645 12.7643 47.2357C17.3355 51.8069 23.5353 54.375 30 54.375C36.4647 54.375 42.6645 51.8069 47.2357 47.2357C51.8069 42.6645 54.375 36.4647 54.375 30ZM0 30C0 22.0435 3.1607 14.4129 8.7868 8.7868C14.4129 3.1607 22.0435 0 30 0C37.9565 0 45.5871 3.1607 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132C3.1607 45.5871 0 37.9565 0 30ZM22.0664 17.2383C22.957 16.7461 24.0352 16.7578 24.9141 17.2969L41.7891 27.6094C42.6211 28.125 43.1367 29.0273 43.1367 30.0117C43.1367 30.9961 42.6211 31.8984 41.7891 32.4141L24.9141 42.7266C24.0469 43.2539 22.957 43.2773 22.0664 42.7852C21.1758 42.293 20.625 41.3555 20.625 40.3359V19.6875C20.625 18.668 21.1758 17.7305 22.0664 17.2383Z' fill='white' /></svg></span></button></div><figcaption class='su-text-16 su-text-black su-mb-0 su-rs-mt-neg1 dark:su-text-white' >Image: Courtesy of making@stanford</figcaption></figure></div></div></div><section data-modal="modal-wrapper"><div hidden="true" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="72582803-9357-4d58-823c-c4c2b95b55c6"><span tabindex="0" data-focus-scope-start="true" aria-label="Watch Spotlight on Stanford makerspaces"></span><div aria-describedby="video-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="560" height="315" class="su-absolute su-top-0 su-left-0 su-w-full su-h-full" src="https://www.youtube.com/embed/N3LIzuRaYzg?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch Spotlight on Stanford makerspaces" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span tabindex="0" data-focus-scope-end="true"></span></div></section></section>"`);
        });

        it('Should return the expected HTML with no mediaFeature', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    media: {
                        ...mockedFetch.media,
                        featureImage: {
                            id: undefined
                        },
                        featureVideo: {
                            id: undefined
                        },
                        carousel: undefined
                    }
                })
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='basic-story-hero' data-unique-id="72582803-9357-4d58-823c-c4c2b95b55c6"><div class='su-mx-auto su-component-container su-container-wide su-container-px'><div class='su-grid su-gap su-grid-cols-6 md:su-grid-cols-12'><div class='su-col-span-6 su-col-start-1 md:su-col-span-10 md:su-col-start-2' ><div class='su-flex su-gap-y-8 su-gap-x-16 su-justify-between su-flex-wrap su-text-16 md:su-basefont-23' ><span class='su-flex su-items-center su-justify-center'><time class='su-m-0 su-mr-4 su-font-semibold'>January 1st, 2024</time><span class='su-reading-time su-reading-time-separator' ></span>|&nbsp;<span data-reading='true'>5</span>&nbsp;min read</span><a class='su-font-semibold su-text-digital-red dark:su-text-dark-mode-red su-no-underline hocus:su-underline' href='https://news.stanford.edu/on-campus/topic/community-and-culture' >Community &amp; Culture</a></div><h1 class='su-font-bold su-rs-mt-4 su-font-serif su-mb-0 xl:su-text-[6.4rem]' >Spotlight on Stanford makerspaces</h1><p class='su-font-serif su-intro-text su-mb-0 su-rs-mt-2 su-text-21 su-leading-[27.35px] md:su-text-28 md:su-leading-[36.47px]' ></p></div></div></div><section data-modal="modal-wrapper"></section></section>"`);
        });
    });

    describe('[Edge Cases]', () => {
        it('Should throw error when fetch for header data will fail', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockRejectedValueOnce(new Error('Network Error'))
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Basic Story Hero component: Error parsing hero data JSON response: Network Error -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will not return object', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce('test')
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Basic Story Hero component: Error parsing hero data JSON response: Invalid API response: heroData is missing or not an object. -->');
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

            expect(result).toBe('<!-- Error occurred in the Basic Story Hero component: The "title" must be non-empty string. The undefined was received. -->');
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

            expect(result).toBe('<!-- Error occurred in the Basic Story Hero component: The "title" must be non-empty string. The "" was received. -->');
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

            expect(result).toBe('<!-- Error occurred in the Basic Story Hero component: The "media" must be an object. The 123 was received. -->');
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

            expect(result).toBe('<!-- Error occurred in the Basic Story Hero component: The "summary" must be a string. The 123 was received. -->');
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

            expect(result).toBe('<!-- Error occurred in the Basic Story Hero component: The "pubDateFormatted" must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will return topic that is not an object', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    topic: 123
                })
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Basic Story Hero component: The "topic" must be an object. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will return mediaType not one of ["image", "video", "carousel"]', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    mediaType: "test"
                })
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Basic Story Hero component: The "mediaType" must be one of ["image", "video", "carousel"]. The "test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
    });
});
