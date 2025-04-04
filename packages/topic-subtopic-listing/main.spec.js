import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { cardDataAdapter, funnelbackCardService, uuid } from "../../global/js/utils";

import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

const cards = [
    {
        title: "Update to graduate student mail and packages process",
        description: "To address ongoing issues while supporting Stanford&rsquo;s net-zero carbon emission goals, the university is introducing a new, centralized process for graduate mail distribution.",
        liveUrl: "https://news.stanford.edu/stories/2025/03/update-to-graduate-student-mail-and-packages-process",
        imageUrl: "https://news.stanford.edu/__data/assets/image/0016/152440/2x3-7.jpg",
        imageAlt: "A symmetrical Spanish-style courtyard on a sunny day. A fountain in front is surrounded by flowers, and behind is the Old Union building.",
        taxonomy: "Campus &amp; Facilities",
        taxonomyUrl: "https://news.stanford.edu/university-news/topic/campus-and-facilities",
        type: "University Updates",
        date: 1741219200000,
        isTeaser: "false"
    },
    {
        title: "Statement on disruption of class",
        description: "University leaders respond to a Feb. 25 incident in the &ldquo;Democracy and Disagreement&rdquo; course by protestors who were not Stanford students.",
        liveUrl: "https://news.stanford.edu/stories/2025/02/statement-on-disruption-of-class",
        imageUrl: "https://news.stanford.edu/__data/assets/image/0022/152437/2x3-1.jpg",
        imageAlt: "Hoover Tower is framed in the arch of an arcade. Sun streams in through the arch onto the floor's flower-shaped tile design.",
        taxonomy: "Leadership &amp; Governance",
        taxonomyUrl: "https://news.stanford.edu/university-news/topic/leadership-and-governance",
        type: "University Updates",
        date: 1740528000000,
        isTeaser: ["true"],
        authorDisplayName: 'Name',
        authorAvatar: "https://news.stanford.edu/__data/assets/image/0022/152437/2x3-1.jpg",
    },
    {
        title: "New Stanford basketball coaches Kate Paye and Kyle Smith talk hoops",
        description: "The newly appointed head coaches sit down to chat about their approaches to leading great teams.",
        liveUrl: "https://news.stanford.edu/stories/2025/02/coaches-smith-and-paye-talk-stanford-hoops",
        imageUrl: "https://news.stanford.edu/__data/assets/image/0024/165822/coaches.jpg",
        imageAlt: "",
        taxonomy: "Athletics",
        taxonomyUrl: "https://news.stanford.edu/on-campus/topic/athletics",
        type: "Video",
        videoUrl: "gIeGdtig_WA",
        date: 1740009600000,
        taxonomyFeaturedUnitLandingPageUrl: "https://news.stanford.edu/featured-unit/stanford-athletics",
        taxonomyFeaturedUnitText: "Stanford Athletics",
        authorDisplayName: 'Name',
        authorAvatar: "https://news.stanford.edu/__data/assets/image/0022/152437/2x3-1.jpg",
    },
    {
        title: "New Stanford basketball coaches Kate Paye and Kyle Smith talk hoops",
        description: "The newly appointed head coaches sit down to chat about their approaches to leading great teams.",
        liveUrl: "https://news.stanford.edu/stories/2025/02/coaches-smith-and-paye-talk-stanford-hoops",
        imageUrl: "https://news.stanford.edu/__data/assets/image/0024/165822/coaches.jpg",
        imageAlt: "",
        taxonomy: "Athletics",
        taxonomyUrl: "https://news.stanford.edu/on-campus/topic/athletics",
        type: "Video",
        videoUrl: "gIeGdtig_WA",
        date: 1740009600000,
        taxonomyFeaturedUnitLandingPageUrl: "https://news.stanford.edu/featured-unit/stanford-athletics",
        taxonomyFeaturedUnitText: "Stanford Athletics",
        isTeaser: "false"
    }
]

const resultsSummary = {
    fullyMatching: 201,
    collapsed: 0,
    partiallyMatching: 0,
    totalMatching: 201,
    estimatedCounts: false,
    carriedOverFtd: null,
    totalDistinctMatchingUrls: null,
    numRanks: 10,
    currStart: 1,
    currEnd: 10,
    prevStart: null,
    nextStart: 11,
    totalSecurityObscuredUrls: null,
    anyUrlsPromoted: false,
    resultDiversificationApplied: false
}

vi.mock('../../global/js/utils', () => ({
    uuid: vi.fn(),
    cardDataAdapter: vi.fn().mockImplementation(() => ({
        setCardService: vi.fn(),
        getResultData: vi.fn(),
    })),
    funnelbackCardService: vi.fn(),
    formatNewsDate: vi.fn(),
}));

vi.mock('../../global/js/helpers', () => ({
    pagination: vi.fn().mockReturnValue('<div data-element="topics-pagination"><div class="su-mx-auto su-component-container"><div class="su-flex su-gap-9 su-items-center su-justify-center su-rs-mt-4 lg:su-rs-mt-7"><button type="button" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center dark:su-text-white su-text-black-50" disabled="" data-offset="1" aria-label="Previous page" title="Previous page"><svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.24855 0.351472C7.71718 0.820101 7.71718 1.5799 7.24855 2.04853L3.29708 6L7.24855 9.95147C7.71718 10.4201 7.71718 11.1799 7.24855 11.6485C6.77992 12.1172 6.02013 12.1172 5.5515 11.6485L0.751496 6.84853C0.282867 6.3799 0.282867 5.6201 0.751496 5.15147L5.5515 0.351472C6.02013 -0.117157 6.77992 -0.117157 7.24855 0.351472Z"></path></svg></button><button data-offset="1" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center su-text-18 dark:su-text-white su-bg-digital-red su-rounded-[100px] su-text-white" disabled="" type="button">1</button><button data-offset="11" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center su-text-18 dark:su-text-white su-text-black" type="button">2</button><button type="button" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center dark:su-text-white " data-offset="11" aria-label="Next page" title="Next page"><svg class="su-fill-transparent su-stroke-current" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="true"><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></button></div></div></div>'),
}));

describe('[Topic Subtopic Listing]', () => {
    const defaultMockData = {
        displayConfiguration: {
            searchQuery: '?query=sample-query',
            displayStyle: "News Archive"
        }
    };

    const defaultMockInfo = {
        env: {
            FB_JSON_URL: 'https://example.com/json',
        },
    };
    
    beforeEach(() => {
        vi.clearAllMocks();
    });
    
    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters were provided', async () => {
            const result = await main();
            
            expect(result).toContain('<!-- Error occurred in the Topic subtopic listing component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when FB_JSON_URL was not provided', async () => {
            const mockInfo = {
                env: {
                    ...defaultMockInfo.env,
                    FB_JSON_URL: undefined
                }
            }

            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Topic subtopic listing component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when FB_JSON_URL was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        ...defaultMockInfo.env,
                        FB_JSON_URL: undefined
                    }
                }
            }

            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Topic subtopic listing component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when searchQuery was not a string', async () => {
            const mockData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    searchQuery: 123
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Topic subtopic listing component: The "searchQuery" field cannot be undefined and must be a non-empty string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when searchQuery was an empty string', async () => {
            const mockData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    searchQuery: ''
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Topic subtopic listing component: The "searchQuery" field cannot be undefined and must be a non-empty string. The "" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when searchQuery was only "?" char', async () => {
            const mockData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    searchQuery: '?'
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Topic subtopic listing component: The "searchQuery" field cannot be undefined and must be a non-empty string. The "?" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when displayStyle was not one of ["Default", "News Archive", "Press Center", "Announcements", "In the News", "University Updates", "Leadership Messages"]', async () => {
            const mockData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    displayStyle: "test value"
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Topic subtopic listing component: The "displayStyle" field cannot be undefined and must be one of ["Default", "News Archive", "Press Center", "Announcements", "In the News", "University Updates", "Leadership Messages"]. The "test value" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        beforeAll(() => {
            uuid.mockReturnValue('476f6893-b77b-43d8-ac8c-ac74d3d75dd7');
        });

        it('Should return the expected HTML with valid data', async () => {
            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getResultData: vi.fn().mockResolvedValue({
                    cards: [...cards],
                    resultsSummary: {...resultsSummary}
                }),
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='topic-subtopic-listing' data-query='?query&#x3D;sample-query' data-endpoint='https://example.com/json' data-display='News Archive'><div class='su-mx-auto su-component-container su-container-px'><div data-element='topics-list'><div class='su-w-full su-component-horizontal-card-grid' data-test='orientation-topiclisting'><div class="su-relative su-grid su-grid-cols-1 su-gap-30 md:su-gap-48 lg:su-gap-61">   <article aria-label="Update to graduate student mail and packages process" class="listing-item su-flex su-gap-20 lg:su-gap-48 su-relative" data-testid="horizontal-card"><div class="su-shrink-0 su-w-[103px] su-h-[69px] md:su-w-[169px] md:su-h-[113px] lg:su-w-[292px] lg:su-h-[193px]"><div class="su-component-card-thumbnail su-w-full su-h-full"><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]"><img class="su-absolute su-object-cover su-object-center su-size-full" src="https://news.stanford.edu/__data/assets/image/0016/152440/2x3-7.jpg" alt="A symmetrical Spanish-style courtyard on a sunny day. A fountain in front is surrounded by flowers, and behind is the Old Union building."/> </span></div></div><div class="su-flex su-flex-col su-gap-9 lg:su-gap-12"><h3 class="su-text-18 md:su-text-21 lg:su-text-23 su-font-bold su-leading-[21.6px] md:su-leading-[25.2px] lg:su-leading-[27.6px] su-font-sans su-my-0 su-group"><a href="https://news.stanford.edu/stories/2025/03/update-to-graduate-student-mail-and-packages-process" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>Update to graduate student mail and packages process</span></a></h3><p data-testid="horizontal-card-type" class="su-text-black-70 dark:su-text-black-30 su-w-full su-text-14 lg:su-text-16 su-mt-9 md:su-mt-12 su-mb-0 su-flex su-gap-6 su-items-center su-justify-start"><svg aria-hidden='true' data-testid='svg-university-updates' xmlns='http://www.w3.org/2000/svg' width='16' height='17' viewBox='0 0 16 17' fill='none' class=''><path d='M7.60856 0.580466L0.608565 3.58047C0.171065 3.76797 -0.0726847 4.23672 0.0241903 4.69922C0.121065 5.16172 0.527315 5.49922 1.00232 5.49922V5.74922C1.00232 6.16484 1.33669 6.49922 1.75232 6.49922H14.2523C14.6679 6.49922 15.0023 6.16484 15.0023 5.74922V5.49922C15.4773 5.49922 15.8867 5.16484 15.9804 4.69922C16.0742 4.23359 15.8304 3.76484 15.3961 3.58047L8.39607 0.580466C8.14607 0.474216 7.85856 0.474216 7.60856 0.580466ZM4.00232 7.49922H2.00232V13.6336C1.98357 13.643 1.96482 13.6555 1.94607 13.668L0.446065 14.668C0.0804403 14.9117 -0.0851848 15.368 0.0429402 15.7898C0.171065 16.2117 0.56169 16.4992 1.00232 16.4992H15.0023C15.4429 16.4992 15.8304 16.2117 15.9586 15.7898C16.0867 15.368 15.9242 14.9117 15.5554 14.668L14.0554 13.668C14.0367 13.6555 14.0179 13.6461 13.9992 13.6336V7.49922H12.0023V13.4992H10.7523V7.49922H8.75232V13.4992H7.25232V7.49922H5.25232V13.4992H4.00232V7.49922ZM8.00232 2.49922C8.26753 2.49922 8.52189 2.60457 8.70942 2.79211C8.89696 2.97965 9.00232 3.234 9.00232 3.49922C9.00232 3.76443 8.89696 4.01879 8.70942 4.20632C8.52189 4.39386 8.26753 4.49922 8.00232 4.49922C7.7371 4.49922 7.48274 4.39386 7.29521 4.20632C7.10767 4.01879 7.00232 3.76443 7.00232 3.49922C7.00232 3.234 7.10767 2.97965 7.29521 2.79211C7.48274 2.60457 7.7371 2.49922 8.00232 2.49922Z' ></path></svg><span class="su-font-semibold su-text-14 md:su-text-16 su-leading-4">University Updates</span></p><div data-testid="horizontal-card-description" class="su-hidden md:su-block su-text-16 lg:su-text-18 su-mt-9 md:su-mt-12 su-mb-0"><div class="su-mb-0 su-w-full [&>*:last-child]:su-mb-0">To address ongoing issues while supporting Stanford&rsquo;s net-zero carbon emission goals, the university is introducing a new, centralized process for graduate mail distribution.</div></div></div></article>    <article aria-label="Statement on disruption of class" class="listing-item su-flex su-gap-20 lg:su-gap-48 su-relative" data-testid="horizontal-card"><div class="su-shrink-0 su-w-[103px] su-h-[69px] md:su-w-[169px] md:su-h-[113px] lg:su-w-[292px] lg:su-h-[193px]"><div class="su-component-card-thumbnail su-w-full su-h-full"><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]"><img class="su-absolute su-object-cover su-object-center su-size-full" src="https://news.stanford.edu/__data/assets/image/0022/152437/2x3-1.jpg" alt="Hoover Tower is framed in the arch of an arcade. Sun streams in through the arch onto the floor&#x27;s flower-shaped tile design."/> </span></div></div><div class="su-flex su-flex-col su-gap-9 lg:su-gap-12"><h3 class="su-text-18 md:su-text-21 lg:su-text-23 su-font-bold su-leading-[21.6px] md:su-leading-[25.2px] lg:su-leading-[27.6px] su-font-sans su-my-0 su-group"><a href="https://news.stanford.edu/stories/2025/02/statement-on-disruption-of-class" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>Statement on disruption of class</span></a></h3><p data-testid="horizontal-card-type" class="su-text-black-70 dark:su-text-black-30 su-w-full su-text-14 lg:su-text-16 su-mt-9 md:su-mt-12 su-mb-0 su-flex su-gap-6 su-items-center su-justify-start"><svg aria-hidden='true' data-testid='svg-university-updates' xmlns='http://www.w3.org/2000/svg' width='16' height='17' viewBox='0 0 16 17' fill='none' class=''><path d='M7.60856 0.580466L0.608565 3.58047C0.171065 3.76797 -0.0726847 4.23672 0.0241903 4.69922C0.121065 5.16172 0.527315 5.49922 1.00232 5.49922V5.74922C1.00232 6.16484 1.33669 6.49922 1.75232 6.49922H14.2523C14.6679 6.49922 15.0023 6.16484 15.0023 5.74922V5.49922C15.4773 5.49922 15.8867 5.16484 15.9804 4.69922C16.0742 4.23359 15.8304 3.76484 15.3961 3.58047L8.39607 0.580466C8.14607 0.474216 7.85856 0.474216 7.60856 0.580466ZM4.00232 7.49922H2.00232V13.6336C1.98357 13.643 1.96482 13.6555 1.94607 13.668L0.446065 14.668C0.0804403 14.9117 -0.0851848 15.368 0.0429402 15.7898C0.171065 16.2117 0.56169 16.4992 1.00232 16.4992H15.0023C15.4429 16.4992 15.8304 16.2117 15.9586 15.7898C16.0867 15.368 15.9242 14.9117 15.5554 14.668L14.0554 13.668C14.0367 13.6555 14.0179 13.6461 13.9992 13.6336V7.49922H12.0023V13.4992H10.7523V7.49922H8.75232V13.4992H7.25232V7.49922H5.25232V13.4992H4.00232V7.49922ZM8.00232 2.49922C8.26753 2.49922 8.52189 2.60457 8.70942 2.79211C8.89696 2.97965 9.00232 3.234 9.00232 3.49922C9.00232 3.76443 8.89696 4.01879 8.70942 4.20632C8.52189 4.39386 8.26753 4.49922 8.00232 4.49922C7.7371 4.49922 7.48274 4.39386 7.29521 4.20632C7.10767 4.01879 7.00232 3.76443 7.00232 3.49922C7.00232 3.234 7.10767 2.97965 7.29521 2.79211C7.48274 2.60457 7.7371 2.49922 8.00232 2.49922Z' ></path></svg><span class="su-font-semibold su-text-14 md:su-text-16 su-leading-4">University Updates</span></p><div data-testid="horizontal-card-description" class="su-hidden md:su-block su-text-16 lg:su-text-18 su-mt-9 md:su-mt-12 su-mb-0"><div class="su-mb-0 su-w-full [&>*:last-child]:su-mb-0">University leaders respond to a Feb. 25 incident in the &ldquo;Democracy and Disagreement&rdquo; course by protestors who were not Stanford students.</div></div></div></article>    <article aria-label="New Stanford basketball coaches Kate Paye and Kyle Smith talk hoops" class="listing-item su-flex su-gap-20 lg:su-gap-48 su-relative" data-testid="horizontal-card"><div class="su-shrink-0 su-w-[103px] su-h-[69px] md:su-w-[169px] md:su-h-[113px] lg:su-w-[292px] lg:su-h-[193px]"><button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]"><img class="su-absolute su-object-cover su-object-center su-size-full" src="https://news.stanford.edu/__data/assets/image/0024/165822/coaches.jpg" alt=""/><span class="su-absolute su-leading-none su-left-13 su-bottom-13 [&amp;&gt;svg]:su-text-[4rem] "><svg aria-hidden="true" focusable="false" data-testid=svg-circle-play data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width=""><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg></span></span></button></div><div class="su-flex su-flex-col su-gap-9 lg:su-gap-12"><h3 class="su-text-18 md:su-text-21 lg:su-text-23 su-font-bold su-leading-[21.6px] md:su-leading-[25.2px] lg:su-leading-[27.6px] su-font-sans su-my-0 su-group"><a href="https://news.stanford.edu/stories/2025/02/coaches-smith-and-paye-talk-stanford-hoops" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>New Stanford basketball coaches Kate Paye and Kyle Smith talk hoops</span></a></h3><p data-testid="horizontal-card-type" class="su-text-black-70 dark:su-text-black-30 su-w-full su-text-14 lg:su-text-16 su-mt-9 md:su-mt-12 su-mb-0 su-flex su-gap-6 su-items-center su-justify-start"><svg aria-hidden='true' data-testid='svg-video' xmlns='http://www.w3.org/2000/svg' width='18' height='13' viewBox='0 0 18 13' fill='none' class=''><path d='M0 2.5C0 1.39688 0.896875 0.5 2 0.5H10C11.1031 0.5 12 1.39688 12 2.5V10.5C12 11.6031 11.1031 12.5 10 12.5H2C0.896875 12.5 0 11.6031 0 10.5V2.5ZM17.4719 1.61875C17.7969 1.79375 18 2.13125 18 2.5V10.5C18 10.8687 17.7969 11.2063 17.4719 11.3813C17.1469 11.5563 16.7531 11.5375 16.4438 11.3313L13.4438 9.33125L13 9.03438V8.5V4.5V3.96562L13.4438 3.66875L16.4438 1.66875C16.75 1.46563 17.1437 1.44375 17.4719 1.61875Z' /></svg><svg aria-hidden='true' data-testid='svg-video' xmlns='http://www.w3.org/2000/svg' width='18' height='13' viewBox='0 0 18 13' fill='none' class=''><path d='M0 2.5C0 1.39688 0.896875 0.5 2 0.5H10C11.1031 0.5 12 1.39688 12 2.5V10.5C12 11.6031 11.1031 12.5 10 12.5H2C0.896875 12.5 0 11.6031 0 10.5V2.5ZM17.4719 1.61875C17.7969 1.79375 18 2.13125 18 2.5V10.5C18 10.8687 17.7969 11.2063 17.4719 11.3813C17.1469 11.5563 16.7531 11.5375 16.4438 11.3313L13.4438 9.33125L13 9.03438V8.5V4.5V3.96562L13.4438 3.66875L16.4438 1.66875C16.75 1.46563 17.1437 1.44375 17.4719 1.61875Z' /></svg><span class="su-font-semibold su-text-14 md:su-text-16 su-leading-4">Video</span></p><div data-testid="horizontal-card-description" class="su-hidden md:su-block su-text-16 lg:su-text-18 su-mt-9 md:su-mt-12 su-mb-0"><div class="su-mb-0 su-w-full [&>*:last-child]:su-mb-0">The newly appointed head coaches sit down to chat about their approaches to leading great teams.</div></div></div></article>    <article aria-label="New Stanford basketball coaches Kate Paye and Kyle Smith talk hoops" class="listing-item su-flex su-gap-20 lg:su-gap-48 su-relative" data-testid="horizontal-card"><div class="su-shrink-0 su-w-[103px] su-h-[69px] md:su-w-[169px] md:su-h-[113px] lg:su-w-[292px] lg:su-h-[193px]"><button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]"><img class="su-absolute su-object-cover su-object-center su-size-full" src="https://news.stanford.edu/__data/assets/image/0024/165822/coaches.jpg" alt=""/><span class="su-absolute su-leading-none su-left-13 su-bottom-13 [&amp;&gt;svg]:su-text-[4rem] "><svg aria-hidden="true" focusable="false" data-testid=svg-circle-play data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width=""><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg></span></span></button></div><div class="su-flex su-flex-col su-gap-9 lg:su-gap-12"><h3 class="su-text-18 md:su-text-21 lg:su-text-23 su-font-bold su-leading-[21.6px] md:su-leading-[25.2px] lg:su-leading-[27.6px] su-font-sans su-my-0 su-group"><a href="https://news.stanford.edu/stories/2025/02/coaches-smith-and-paye-talk-stanford-hoops" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>New Stanford basketball coaches Kate Paye and Kyle Smith talk hoops</span></a></h3><p data-testid="horizontal-card-type" class="su-text-black-70 dark:su-text-black-30 su-w-full su-text-14 lg:su-text-16 su-mt-9 md:su-mt-12 su-mb-0 su-flex su-gap-6 su-items-center su-justify-start"><svg aria-hidden='true' data-testid='svg-video' xmlns='http://www.w3.org/2000/svg' width='18' height='13' viewBox='0 0 18 13' fill='none' class=''><path d='M0 2.5C0 1.39688 0.896875 0.5 2 0.5H10C11.1031 0.5 12 1.39688 12 2.5V10.5C12 11.6031 11.1031 12.5 10 12.5H2C0.896875 12.5 0 11.6031 0 10.5V2.5ZM17.4719 1.61875C17.7969 1.79375 18 2.13125 18 2.5V10.5C18 10.8687 17.7969 11.2063 17.4719 11.3813C17.1469 11.5563 16.7531 11.5375 16.4438 11.3313L13.4438 9.33125L13 9.03438V8.5V4.5V3.96562L13.4438 3.66875L16.4438 1.66875C16.75 1.46563 17.1437 1.44375 17.4719 1.61875Z' /></svg><svg aria-hidden='true' data-testid='svg-video' xmlns='http://www.w3.org/2000/svg' width='18' height='13' viewBox='0 0 18 13' fill='none' class=''><path d='M0 2.5C0 1.39688 0.896875 0.5 2 0.5H10C11.1031 0.5 12 1.39688 12 2.5V10.5C12 11.6031 11.1031 12.5 10 12.5H2C0.896875 12.5 0 11.6031 0 10.5V2.5ZM17.4719 1.61875C17.7969 1.79375 18 2.13125 18 2.5V10.5C18 10.8687 17.7969 11.2063 17.4719 11.3813C17.1469 11.5563 16.7531 11.5375 16.4438 11.3313L13.4438 9.33125L13 9.03438V8.5V4.5V3.96562L13.4438 3.66875L16.4438 1.66875C16.75 1.46563 17.1437 1.44375 17.4719 1.61875Z' /></svg><span class="su-font-semibold su-text-14 md:su-text-16 su-leading-4">Video</span></p><div data-testid="horizontal-card-description" class="su-hidden md:su-block su-text-16 lg:su-text-18 su-mt-9 md:su-mt-12 su-mb-0"><div class="su-mb-0 su-w-full [&>*:last-child]:su-mb-0">The newly appointed head coaches sit down to chat about their approaches to leading great teams.</div></div></div></article>   </div></div></div><div data-element='topics-pagination'><div data-element="topics-pagination"><div class="su-mx-auto su-component-container"><div class="su-flex su-gap-9 su-items-center su-justify-center su-rs-mt-4 lg:su-rs-mt-7"><button type="button" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center dark:su-text-white su-text-black-50" disabled="" data-offset="1" aria-label="Previous page" title="Previous page"><svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.24855 0.351472C7.71718 0.820101 7.71718 1.5799 7.24855 2.04853L3.29708 6L7.24855 9.95147C7.71718 10.4201 7.71718 11.1799 7.24855 11.6485C6.77992 12.1172 6.02013 12.1172 5.5515 11.6485L0.751496 6.84853C0.282867 6.3799 0.282867 5.6201 0.751496 5.15147L5.5515 0.351472C6.02013 -0.117157 6.77992 -0.117157 7.24855 0.351472Z"></path></svg></button><button data-offset="1" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center su-text-18 dark:su-text-white su-bg-digital-red su-rounded-[100px] su-text-white" disabled="" type="button">1</button><button data-offset="11" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center su-text-18 dark:su-text-white su-text-black" type="button">2</button><button type="button" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center dark:su-text-white " data-offset="11" aria-label="Next page" title="Next page"><svg class="su-fill-transparent su-stroke-current" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="true"><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></button></div></div></div></div></div><section data-element="modal-wrapper"> <div hidden="true" aria-modal="true" role="dialog" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span data-focus-scope-start="true" hidden="true"></span><div aria-describedby="card-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="560" height="315" class="" src="https://www.youtube.com/embed/gIeGdtig_WA?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch New Stanford basketball coaches Kate Paye and Kyle Smith talk hoops" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span data-focus-scope-end="true" hidden="true"></span></div>  <div hidden="true" aria-modal="true" role="dialog" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span data-focus-scope-start="true" hidden="true"></span><div aria-describedby="card-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="560" height="315" class="" src="https://www.youtube.com/embed/gIeGdtig_WA?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch New Stanford basketball coaches Kate Paye and Kyle Smith talk hoops" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span data-focus-scope-end="true" hidden="true"></span></div> </section></section>"`);
        });

        it('Should call cardDataAdapter and funnelbackCardService', async () => {
            await main(defaultMockData, defaultMockInfo);

            expect(cardDataAdapter).toHaveBeenCalled();
            expect(funnelbackCardService).toHaveBeenCalled();
        });

        it('Should return the expected HTML when display style is set to one of ["Press Center", "Leadership Messages", "University Updates", "Announcements", "In the News"]', async () => {
            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getResultData: vi.fn().mockResolvedValue({
                    cards: [...cards],
                    resultsSummary: {...resultsSummary}
                }),
            }));

            const mockData = {
                displayConfiguration: {
                    searchQuery: '?query=sample-query',
                    displayStyle: "Leadership Messages"
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='topic-subtopic-listing' data-query='?query&#x3D;sample-query' data-endpoint='https://example.com/json' data-display='Leadership Messages'><div class='su-mx-auto su-component-container su-container-px'><div data-element='topics-list'><div class='su-w-full su-component-horizontal-card-grid' data-test='orientation-topiclisting'><div class="su-relative su-grid su-grid-cols-1 su-gap-30 md:su-gap-48 lg:su-gap-61">   <article aria-label="Update to graduate student mail and packages process" class="su-grid su-grid-gap su-grid-cols-6 lg:su-grid-cols-10" data-testid="narrow-horizontal-card"><div class="su-flex su-flex-col su-gap-12 su-col-start-1 su-col-span-full lg:su-col-span-6 lg:su-col-start-3"> <h3 class="su-font-serif su-basefont-23 su-my-0"><a class="su-group hocus:su-text-digital-red hocus:su-underline su-transition su-text-black dark:su-text-white dark:hocus:su-text-dark-mode-red" href="https://news.stanford.edu/stories/2025/03/update-to-graduate-student-mail-and-packages-process"><span>Update to graduate student mail and packages process</span><span class="su-text-digital-red dark:su-text-dark-mode-red su-translate-x-0 su-translate-y-0 su-transition group-hocus:su-translate-y-[-.1em] group-hocus:su-translate-x-[.1em] su-inline-block"><span class="[&>*]:su-inline-block [&>*]:su-stroke-current [&>*]:su-w-24 [&>*]:su-h-23 [&>*]:su-rotate-[-45deg] [&>*]:su-translate-x-[.12em] [&>*]:su-translate-y-[-.08em]"></span></span></a></h3><div data-testid="narrow-horizontal-card-description" class="su-my-0 su-text-16 su-leading-[2.4rem] lg:su-text-18 lg:su-leading-[2.7rem]"><div class="su-mb-0 su-w-full [&>*:last-child]:su-mb-0">To address ongoing issues while supporting Stanford&rsquo;s net-zero carbon emission goals, the university is introducing a new, centralized process for graduate mail distribution.</div></div> <div class="su-flex su-w-full su-min-h-[56px] su-self-end lg:su-self-start su-items-center su-gap-10 su-text-black dark:su-text-white su-text-16 su-leading-[19.106px]"> <div data-test="size-small" class="su-component-avatar su-relative su-block su-rounded-full su-bg-gradient-light-red-h su-overflow-hidden su-min-w-[56px] su-w-[56px] su-h-[56px] su-p-3"><img class="su-absolute su-rounded-full su-object-cover su-object-center su-w-50 su-h-50 su-top-3 su-left-3" src="https://news.stanford.edu/__data/assets/image/0016/152440/2x3-7.jpg" alt="Photo of Update to graduate student mail and packages process" /></div>  <time class="su-text-black-70 dark:su-text-black-60 su-font-semibold"></time></div> </div></article>    <article aria-label="Statement on disruption of class" class="su-grid su-grid-gap su-grid-cols-6 lg:su-grid-cols-10" data-testid="narrow-horizontal-card"><div class="su-flex su-flex-col su-gap-12 su-col-start-1 su-col-span-full lg:su-col-span-6 lg:su-col-start-3"> <h3 class="su-font-serif su-basefont-23 su-my-0"><a class="su-group hocus:su-text-digital-red hocus:su-underline su-transition su-text-black dark:su-text-white dark:hocus:su-text-dark-mode-red" href="https://news.stanford.edu/stories/2025/02/statement-on-disruption-of-class"><span>Statement on disruption of class</span><span class="su-text-digital-red dark:su-text-dark-mode-red su-translate-x-0 su-translate-y-0 su-transition group-hocus:su-translate-y-[-.1em] group-hocus:su-translate-x-[.1em] su-inline-block"><span class="[&>*]:su-inline-block [&>*]:su-stroke-current [&>*]:su-w-24 [&>*]:su-h-23 [&>*]:su-rotate-[-45deg] [&>*]:su-translate-x-[.12em] [&>*]:su-translate-y-[-.08em]"></span></span></a></h3><div data-testid="narrow-horizontal-card-description" class="su-my-0 su-text-16 su-leading-[2.4rem] lg:su-text-18 lg:su-leading-[2.7rem]"><div class="su-mb-0 su-w-full [&>*:last-child]:su-mb-0">University leaders respond to a Feb. 25 incident in the &ldquo;Democracy and Disagreement&rdquo; course by protestors who were not Stanford students.</div></div> <div class="su-flex su-w-full su-min-h-[56px] su-self-end lg:su-self-start su-items-center su-gap-10 su-text-black dark:su-text-white su-text-16 su-leading-[19.106px]"> <div data-test="size-small" class="su-component-avatar su-relative su-block su-rounded-full su-bg-gradient-light-red-h su-overflow-hidden su-min-w-[56px] su-w-[56px] su-h-[56px] su-p-3"><img class="su-absolute su-rounded-full su-object-cover su-object-center su-w-50 su-h-50 su-top-3 su-left-3" src="h" alt="Photo of Name" /></div>  <time class="su-text-black-70 dark:su-text-black-60 su-font-semibold"></time></div> </div></article>    <article aria-label="New Stanford basketball coaches Kate Paye and Kyle Smith talk hoops" class="su-grid su-grid-gap su-grid-cols-6 lg:su-grid-cols-10" data-testid="narrow-horizontal-card"><div class="su-flex su-flex-col su-gap-12 su-col-start-1 su-col-span-full lg:su-col-span-6 lg:su-col-start-3"> <h3 class="su-font-serif su-basefont-23 su-my-0"><a class="su-group hocus:su-text-digital-red hocus:su-underline su-transition su-text-black dark:su-text-white dark:hocus:su-text-dark-mode-red" href="https://news.stanford.edu/stories/2025/02/coaches-smith-and-paye-talk-stanford-hoops"><span>New Stanford basketball coaches Kate Paye and Kyle Smith talk hoops</span></a></h3><div data-testid="narrow-horizontal-card-description" class="su-my-0 su-text-16 su-leading-[2.4rem] lg:su-text-18 lg:su-leading-[2.7rem]"><div class="su-mb-0 su-w-full [&>*:last-child]:su-mb-0">The newly appointed head coaches sit down to chat about their approaches to leading great teams.</div></div> <div class="su-flex su-w-full su-min-h-[56px] su-self-end lg:su-self-start su-items-center su-gap-10 su-text-black dark:su-text-white su-text-16 su-leading-[19.106px]"> <div data-test="size-small" class="su-component-avatar su-relative su-block su-rounded-full su-bg-gradient-light-red-h su-overflow-hidden su-min-w-[56px] su-w-[56px] su-h-[56px] su-p-3"><img class="su-absolute su-rounded-full su-object-cover su-object-center su-w-50 su-h-50 su-top-3 su-left-3" src="h" alt="Photo of Name" /></div>  <time class="su-text-black-70 dark:su-text-black-60 su-font-semibold"></time></div> </div></article>    <article aria-label="New Stanford basketball coaches Kate Paye and Kyle Smith talk hoops" class="su-grid su-grid-gap su-grid-cols-6 lg:su-grid-cols-10" data-testid="narrow-horizontal-card"><div class="su-flex su-flex-col su-gap-12 su-col-start-1 su-col-span-full lg:su-col-span-6 lg:su-col-start-3"> <h3 class="su-font-serif su-basefont-23 su-my-0"><a class="su-group hocus:su-text-digital-red hocus:su-underline su-transition su-text-black dark:su-text-white dark:hocus:su-text-dark-mode-red" href="https://news.stanford.edu/stories/2025/02/coaches-smith-and-paye-talk-stanford-hoops"><span>New Stanford basketball coaches Kate Paye and Kyle Smith talk hoops</span><span class="su-text-digital-red dark:su-text-dark-mode-red su-translate-x-0 su-translate-y-0 su-transition group-hocus:su-translate-y-[-.1em] group-hocus:su-translate-x-[.1em] su-inline-block"><span class="[&>*]:su-inline-block [&>*]:su-stroke-current [&>*]:su-w-24 [&>*]:su-h-23 [&>*]:su-rotate-[-45deg] [&>*]:su-translate-x-[.12em] [&>*]:su-translate-y-[-.08em]"></span></span></a></h3><div data-testid="narrow-horizontal-card-description" class="su-my-0 su-text-16 su-leading-[2.4rem] lg:su-text-18 lg:su-leading-[2.7rem]"><div class="su-mb-0 su-w-full [&>*:last-child]:su-mb-0">The newly appointed head coaches sit down to chat about their approaches to leading great teams.</div></div> <div class="su-flex su-w-full su-min-h-[56px] su-self-end lg:su-self-start su-items-center su-gap-10 su-text-black dark:su-text-white su-text-16 su-leading-[19.106px]"> <div data-test="size-small" class="su-component-avatar su-relative su-block su-rounded-full su-bg-gradient-light-red-h su-overflow-hidden su-min-w-[56px] su-w-[56px] su-h-[56px] su-p-3"><img class="su-absolute su-rounded-full su-object-cover su-object-center su-w-50 su-h-50 su-top-3 su-left-3" src="https://news.stanford.edu/__data/assets/image/0024/165822/coaches.jpg" alt="Photo of New Stanford basketball coaches Kate Paye and Kyle Smith talk hoops" /></div>  <time class="su-text-black-70 dark:su-text-black-60 su-font-semibold"></time></div> </div></article>   </div></div></div><div data-element='topics-pagination'><div data-element="topics-pagination"><div class="su-mx-auto su-component-container"><div class="su-flex su-gap-9 su-items-center su-justify-center su-rs-mt-4 lg:su-rs-mt-7"><button type="button" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center dark:su-text-white su-text-black-50" disabled="" data-offset="1" aria-label="Previous page" title="Previous page"><svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.24855 0.351472C7.71718 0.820101 7.71718 1.5799 7.24855 2.04853L3.29708 6L7.24855 9.95147C7.71718 10.4201 7.71718 11.1799 7.24855 11.6485C6.77992 12.1172 6.02013 12.1172 5.5515 11.6485L0.751496 6.84853C0.282867 6.3799 0.282867 5.6201 0.751496 5.15147L5.5515 0.351472C6.02013 -0.117157 6.77992 -0.117157 7.24855 0.351472Z"></path></svg></button><button data-offset="1" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center su-text-18 dark:su-text-white su-bg-digital-red su-rounded-[100px] su-text-white" disabled="" type="button">1</button><button data-offset="11" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center su-text-18 dark:su-text-white su-text-black" type="button">2</button><button type="button" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center dark:su-text-white " data-offset="11" aria-label="Next page" title="Next page"><svg class="su-fill-transparent su-stroke-current" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="true"><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></button></div></div></div></div></div><section data-element="modal-wrapper"> <div hidden="true" aria-modal="true" role="dialog" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span data-focus-scope-start="true" hidden="true"></span><div aria-describedby="card-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="560" height="315" class="" src="https://www.youtube.com/embed/gIeGdtig_WA?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch New Stanford basketball coaches Kate Paye and Kyle Smith talk hoops" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span data-focus-scope-end="true" hidden="true"></span></div>  <div hidden="true" aria-modal="true" role="dialog" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"><span data-focus-scope-start="true" hidden="true"></span><div aria-describedby="card-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content"> <iframe width="560" height="315" class="" src="https://www.youtube.com/embed/gIeGdtig_WA?si=vYU81uVmaV7GSju2&amp;autoplay=0&amp;controls=1&amp;rel=0" title="Watch New Stanford basketball coaches Kate Paye and Kyle Smith talk hoops" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe> </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg><span>Close</span></button><span data-focus-scope-end="true" hidden="true"></span></div> </section></section>"`);
        });
    });

    describe('[Edge cases]', () => {
        it('Should  throw an error when fetch will return bad data', async () => {
            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getResultData: vi.fn().mockImplementation({
                    cards: [{
                        title: "Inaugural Lecturer’s Award winners honored",
                        description: "Honorees for the annual Lecturer’s Award for Teaching and Undergraduate Education were recognized for their exceptional contributions to university life and undergraduate education.",
                        liveUrl: "https://example.com",
                        imageUrl: "https://picsum.photos/400/400",
                        videoUrl: "https://example.com",
                        imageAlt: "Image of Cathy Haas, Jamie Imam, Provost Jenny Martinez, Elizabeth Kessler, Hayes",
                        taxonomy: "Awards, Honors & Appointments",
                        taxonomyUrl: "https://example.com/",
                        avatarRef: 'https://picsum.photos/400/400',
                        avatarAlt: 'Avatar alt',
                        type: "Video",
                        date: 1730073600000,
                        taxonomyFeaturedUnitLandingPageUrl: "https://example.com/",
                        taxonomyFeaturedUnitText: "Office of the Vice Provost for Undergraduate Education",
                        isTeaser: "false",
                        storySource: 'card.storySource',
                    }],
                    resultsSummary: {
                        fullyMatching: 201,
                        collapsed: 0,
                        partiallyMatching: 0,
                        totalMatching: 201,
                        estimatedCounts: false,
                        carriedOverFtd: null,
                        totalDistinctMatchingUrls: null,
                        numRanks: 10,
                        currStart: 11,
                        currEnd: 20,
                        prevStart: 1,
                        nextStart: 21,
                        totalSecurityObscuredUrls: null,
                        anyUrlsPromoted: false,
                        resultDiversificationApplied: false
                    }
                }),
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the Topic subtopic listing component: Error parsing Funnelback JSON response: impl.apply is not a function -->"`);
        });

        it('Should throw an error when cards is empty array', async () => {
            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getResultData: vi.fn().mockResolvedValue({cards : []}),
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the Topic subtopic listing component: The "cards" cannot be undefined or null. The [] was received. -->"`);
        });

        it('Should throw an error when cards is not defined', async () => {
            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getResultData: vi.fn().mockResolvedValue([]),
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the Topic subtopic listing component: The "cards" cannot be undefined or null. The undefined was received. -->"`);
        });
    });
});
