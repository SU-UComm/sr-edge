import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cardDataAdapter, funnelbackCardService, linkedHeadingService } from "../../global/js/utils";
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    cardDataAdapter: vi.fn().mockImplementation(() => ({
        setCardService: vi.fn(),
        getCards: vi.fn().mockResolvedValue([
            {
                "title": "Inaugural Lecturer’s Award winners honored",
                "description": ["Honorees for the annual Lecturer’s Award for Teaching and Undergraduate Education were recognized for their exceptional contributions to university life and undergraduate education."],
                "liveUrl": "https://example.com",
                "imageUrl": ["https://picsum.photos/400/400"],
                "videoUrl": "https://example.com",
                "imageAlt": ["Image of Cathy Haas, Jamie Imam, Provost Jenny Martinez, Elizabeth Kessler, Hayes"],
                "taxonomy": ["Awards, Honors & Appointments"],
                "taxonomyUrl": ["https://example.com/"],
                "type": "Video",
                "date": 1730073600000,
                "taxonomyFeaturedUnitLandingPageUrl": ["https://example.com/"],
                "taxonomyFeaturedUnitText": ["Office of the Vice Provost for Undergraduate Education"],
                "isTeaser": ["false"]
            },
            {
                "title": "Bass Fellows in Undergraduate Education announced",
                "description": ["The Bass University Fellows in Undergraduate Education Program recognizes faculty for extraordinary contributions to undergraduate education."],
                "liveUrl": "https://example.com",
                "imageUrl": ["https://picsum.photos/400/400"],
                "imageAlt": ["Main Quad as seen through arcade arch"],
                "taxonomy": ["Awards, Honors & Appointments"],
                "taxonomyUrl": ["https://example.com/"],
                "type": "News",
                "date": 1730073600000,
                "taxonomyFeaturedUnitLandingPageUrl": ["https://example.com/"],
                "taxonomyFeaturedUnitText": ["Office of the Vice Provost for Undergraduate Education"],
                "isTeaser": ["false"]
            }
        ]),
    })),
    funnelbackCardService: vi.fn(),
    linkedHeadingService: vi.fn().mockResolvedValue({
        title: 'Sample Heading',
        ctaText: 'Learn More',
        ctaLink: 'https://example.com',
        ctaNewWindow: false
    })
}));

vi.mock('../../global/js/helpers', () => ({
    multiColumnGrid: vi.fn().mockReturnValue(`<div class="su-w-full su-component-multicolumn"><div class="su-relative su-flex su-flex-wrap md:su-flex-nowrap su-flex-1 su-place-content-between su-gap-34 md:su-gap-72 lg:su-gap-[160px]"><div data-test="column-0" class="su-relative su-grow md:su-basis-1/3"><article aria-label="Kenneth Goodson named vice provost for graduate education and postdoctoral affairs" data-test="avatar-card" class="su-component-card su-relative su-w-full md:su-basis-1/3 su-flex su-flex-wrap su-gap-10 lg:su-content-start lg:su-max-w-[29.3rem]"><h3 class="su-text-21 lg:su-text-24 su-leading-display su-flex-grow su-my-0 su-font-serif su-w-full"><a href="https://news.stanford.edu/stories/2025/03/vice-provost-stanford-graduate-education-ken-goodson" class="su-transition su-text-black su-font-bold su-no-underline hocus:su-text-digital-red dark:su-text-white dark:hocus:su-text-dark-mode-red hocus:su-underline">Kenneth Goodson named vice provost for graduate education and postdoctoral affairs</a></h3></article></div><div data-test="column-1" class="su-relative su-grow md:su-basis-1/3"><article aria-label="Statement on disruption of class" data-test="avatar-card" class="su-component-card su-relative su-w-full md:su-basis-1/3 su-flex su-flex-wrap su-gap-10 lg:su-content-start lg:su-max-w-[29.3rem]"><h3 class="su-text-21 lg:su-text-24 su-leading-display su-flex-grow su-my-0 su-font-serif su-w-full"><a href="https://news.stanford.edu/stories/2025/02/statement-on-disruption-of-class" class="su-transition su-text-black su-font-bold su-no-underline hocus:su-text-digital-red dark:su-text-white dark:hocus:su-text-dark-mode-red hocus:su-underline">Statement on disruption of class</a></h3></article></div><div data-test="column-2" class="su-relative su-grow md:su-basis-1/3"><article aria-label="Report of the president: Academic Council professoriate appointments" data-test="avatar-card" class="su-component-card su-relative su-w-full md:su-basis-1/3 su-flex su-flex-wrap su-gap-10 lg:su-content-start lg:su-max-w-[29.3rem]"><h3 class="su-text-21 lg:su-text-24 su-leading-display su-flex-grow su-my-0 su-font-serif su-w-full"><a href="https://news.stanford.edu/stories/2025/02/report-of-the-president-academic-council-professoriate-appointments" class="su-transition su-text-black su-font-bold su-no-underline hocus:su-text-digital-red dark:su-text-white dark:hocus:su-text-dark-mode-red hocus:su-underline">Report of the president: Academic Council professoriate appointments</a></h3></article></div></div></div>`),
    Card: vi.fn().mockImplementation(({ data }) => `<div class="card"><h2>${data?.title}</h2>${data?.description ? `<span>${data.description}</span>`: ''}</div>`),
}));

describe('[Leadership messages]', () => {
    const mockFnsCtx = { resolveUri: vi.fn() };

    const defaultMockData = {
        headingConfiguration: {
            title: 'Sample Title',
            ctaUrl: 'https://example.com',
            ctaManualUrl: 'https://manual.example.com',
            ctaText: 'Learn More',
            ctaNewWindow: true
        },
        contentConfiguration: {
            searchQuery: 'sample-query'
        }
    };

    const defaultMockInfo = {
        env: {
            FB_JSON_URL: 'https://example.com/json'
        },
        fns: mockFnsCtx
    };
    
    beforeEach(() => {
        vi.clearAllMocks();
    });
    
    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters were provided', async () => {
            const result = await main();
            
            expect(result).toContain('<!-- Error occurred in the Leadership messages component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Leadership messages component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Leadership messages component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fns or ctx was not provided', async () => {
            const mockInfo = {
                ...defaultMockInfo,
                fns: undefined
            }

            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Leadership messages component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info do not have fns or ctx functions', async () => {
            const mockInfo = { 
                env: {
                    FB_JSON_URL: 'https://example.com/json'
                },
                test: 'test'
            }
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Leadership messages component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fns or ctx is invalid', async () => {
            const mockInfo = { 
                ...defaultMockInfo, 
                fns: undefined, 
                ctx: undefined
            };
            const result = await main(defaultMockData, mockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Leadership messages component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when searchQuery was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    searchQuery: 123
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Leadership messages component: The "searchQuery" field cannot be undefined and must be a non-empty string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when title was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                headingConfiguration: {
                    ...defaultMockData.headingConfiguration,
                    title: 123
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Leadership messages component: The "title" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when ctaUrl was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                headingConfiguration: {
                    ...defaultMockData.headingConfiguration,
                    ctaUrl: 123
                }
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Leadership messages component: The "ctaUrl" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when ctaManualUrl was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                headingConfiguration: {
                    ...defaultMockData.headingConfiguration,
                    ctaManualUrl: 123
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Leadership messages component: The "ctaManualUrl" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when ctaText was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                headingConfiguration: {
                    ...defaultMockData.headingConfiguration,
                    ctaText: 123
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Leadership messages component: The "ctaText" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when ctaNewWindow was not a boolean type', async () => {
            const mockData = {
                ...defaultMockData,
                headingConfiguration: {
                    ...defaultMockData.headingConfiguration,
                    ctaNewWindow: 123
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Leadership messages component: The "ctaNewWindow" field must be a boolean. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        it('Should return the expected HTML with valid data', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="leadership-messages"><div class="su-mx-auto su-component-container su-container-large su-container-px">  <div class="su-component-line-heading su-flex su-flex-wrap su-items-baseline su-gap-5 su-gap-x-13 md:su-gap-13"><h2 class="su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white su-text-black"> Sample Heading </h2><hr aria-hidden="true" class="md:su-mb-11 lg:su-mb-15 su-grow su-border-none su-bg-gradient-light-red-h su-h-4"/>  <a data-test="cta" href="https://example.com" class="su-group su-flex su-no-underline hocus:su-underline su-transition su-items-center md:su-items-end md:su-mb-8 lg:su-mb-12 su-flex-nowrap su-align-baseline su-gap-20 md:su-gap-13 su-text-19 su-decoration-2 dark:su-text-white su-text-black hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red"><span class="su-flex su-gap-2 su-items-baseline"><span> Learn More<!-- --><span class="sr-only">Sample Heading</span></span> <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" class="svg-inline--fa fa-chevron-right fa-fw su-text-14 group-hocus:su-translate-x-02em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="18"><path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path></svg> </span></a>  </div> <div class="su-w-full su-component-multicolumn"><div class="su-relative su-flex su-flex-wrap md:su-flex-nowrap su-flex-1 su-place-content-between su-gap-34 md:su-gap-72 lg:su-gap-[160px]"><div data-test="column-0" class="su-relative su-grow md:su-basis-1/3"><article aria-label="Kenneth Goodson named vice provost for graduate education and postdoctoral affairs" data-test="avatar-card" class="su-component-card su-relative su-w-full md:su-basis-1/3 su-flex su-flex-wrap su-gap-10 lg:su-content-start lg:su-max-w-[29.3rem]"><h3 class="su-text-21 lg:su-text-24 su-leading-display su-flex-grow su-my-0 su-font-serif su-w-full"><a href="https://news.stanford.edu/stories/2025/03/vice-provost-stanford-graduate-education-ken-goodson" class="su-transition su-text-black su-font-bold su-no-underline hocus:su-text-digital-red dark:su-text-white dark:hocus:su-text-dark-mode-red hocus:su-underline">Kenneth Goodson named vice provost for graduate education and postdoctoral affairs</a></h3></article></div><div data-test="column-1" class="su-relative su-grow md:su-basis-1/3"><article aria-label="Statement on disruption of class" data-test="avatar-card" class="su-component-card su-relative su-w-full md:su-basis-1/3 su-flex su-flex-wrap su-gap-10 lg:su-content-start lg:su-max-w-[29.3rem]"><h3 class="su-text-21 lg:su-text-24 su-leading-display su-flex-grow su-my-0 su-font-serif su-w-full"><a href="https://news.stanford.edu/stories/2025/02/statement-on-disruption-of-class" class="su-transition su-text-black su-font-bold su-no-underline hocus:su-text-digital-red dark:su-text-white dark:hocus:su-text-dark-mode-red hocus:su-underline">Statement on disruption of class</a></h3></article></div><div data-test="column-2" class="su-relative su-grow md:su-basis-1/3"><article aria-label="Report of the president: Academic Council professoriate appointments" data-test="avatar-card" class="su-component-card su-relative su-w-full md:su-basis-1/3 su-flex su-flex-wrap su-gap-10 lg:su-content-start lg:su-max-w-[29.3rem]"><h3 class="su-text-21 lg:su-text-24 su-leading-display su-flex-grow su-my-0 su-font-serif su-w-full"><a href="https://news.stanford.edu/stories/2025/02/report-of-the-president-academic-council-professoriate-appointments" class="su-transition su-text-black su-font-bold su-no-underline hocus:su-text-digital-red dark:su-text-white dark:hocus:su-text-dark-mode-red hocus:su-underline">Report of the president: Academic Council professoriate appointments</a></h3></article></div></div></div> </div></section>"`);
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

            expect(result).toMatchInlineSnapshot(`"<section data-component="leadership-messages"><div class="su-mx-auto su-component-container su-container-large su-container-px">  <div class="su-component-line-heading su-flex su-flex-wrap su-items-baseline su-gap-5 su-gap-x-13 md:su-gap-13"><h2 class="su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white su-text-black"> Sample Heading </h2><hr aria-hidden="true" class="md:su-mb-11 lg:su-mb-15 su-grow su-border-none su-bg-gradient-light-red-h su-h-4"/>  </div> <div class="su-w-full su-component-multicolumn"><div class="su-relative su-flex su-flex-wrap md:su-flex-nowrap su-flex-1 su-place-content-between su-gap-34 md:su-gap-72 lg:su-gap-[160px]"><div data-test="column-0" class="su-relative su-grow md:su-basis-1/3"><article aria-label="Kenneth Goodson named vice provost for graduate education and postdoctoral affairs" data-test="avatar-card" class="su-component-card su-relative su-w-full md:su-basis-1/3 su-flex su-flex-wrap su-gap-10 lg:su-content-start lg:su-max-w-[29.3rem]"><h3 class="su-text-21 lg:su-text-24 su-leading-display su-flex-grow su-my-0 su-font-serif su-w-full"><a href="https://news.stanford.edu/stories/2025/03/vice-provost-stanford-graduate-education-ken-goodson" class="su-transition su-text-black su-font-bold su-no-underline hocus:su-text-digital-red dark:su-text-white dark:hocus:su-text-dark-mode-red hocus:su-underline">Kenneth Goodson named vice provost for graduate education and postdoctoral affairs</a></h3></article></div><div data-test="column-1" class="su-relative su-grow md:su-basis-1/3"><article aria-label="Statement on disruption of class" data-test="avatar-card" class="su-component-card su-relative su-w-full md:su-basis-1/3 su-flex su-flex-wrap su-gap-10 lg:su-content-start lg:su-max-w-[29.3rem]"><h3 class="su-text-21 lg:su-text-24 su-leading-display su-flex-grow su-my-0 su-font-serif su-w-full"><a href="https://news.stanford.edu/stories/2025/02/statement-on-disruption-of-class" class="su-transition su-text-black su-font-bold su-no-underline hocus:su-text-digital-red dark:su-text-white dark:hocus:su-text-dark-mode-red hocus:su-underline">Statement on disruption of class</a></h3></article></div><div data-test="column-2" class="su-relative su-grow md:su-basis-1/3"><article aria-label="Report of the president: Academic Council professoriate appointments" data-test="avatar-card" class="su-component-card su-relative su-w-full md:su-basis-1/3 su-flex su-flex-wrap su-gap-10 lg:su-content-start lg:su-max-w-[29.3rem]"><h3 class="su-text-21 lg:su-text-24 su-leading-display su-flex-grow su-my-0 su-font-serif su-w-full"><a href="https://news.stanford.edu/stories/2025/02/report-of-the-president-academic-council-professoriate-appointments" class="su-transition su-text-black su-font-bold su-no-underline hocus:su-text-digital-red dark:su-text-white dark:hocus:su-text-dark-mode-red hocus:su-underline">Report of the president: Academic Council professoriate appointments</a></h3></article></div></div></div> </div></section>"`);
        });

        it('Should call cardDataAdapter and funnelbackCardService', async () => {
            await main(defaultMockData, defaultMockInfo);

            expect(cardDataAdapter).toHaveBeenCalled();
            expect(funnelbackCardService).toHaveBeenCalled();
        });
    });

    describe("[Edge cases]", () => {
        it('Should throw an error when getCards will fail', async () => {
            cardDataAdapter.mockImplementation(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockRejectedValueOnce(new Error('No cards'))
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<!-- Error occurred in the Leadership messages component: Failed to fetch event data. No cards -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });
});
