import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cardDataAdapter, linkedHeadingService, uuid  } from "../../global/js/utils";
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
                "isTeaser": ["false"],
                isRealExternalLink: true,
                eventStartEndDate: "<span data-testid='event-date' class='su-mb-0 su-text-16'>Mar 21 | 12:00 AM</span>",
                uniqueID: "476f6893-b77b-43d8-ac8c-ac74d3d75dd7",
                iconType: "video",
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
                "isTeaser": ["false"],
                isRealExternalLink: true,
                eventStartEndDate: "<span data-testid='event-date' class='su-mb-0 su-text-16'>Mar 21 | 12:00 AM</span>",
                uniqueID: "476f6893-b77b-43d8-ac8c-ac74d3d75dd7",
                iconType: "video",
            }
        ]),
    })),
    eventCardService: vi.fn(),
    linkedHeadingService: vi.fn(),
    isRealExternalLink: vi.fn(),

}));

describe('[Events section]', () => {
    const mockFnsCtx = {
        resolveUri: vi.fn()
    };

    const defaultMockData = {
        headingConfiguration: {
            title: "Upcoming events",
            ctaText: "View all",
            ctaManualUrl: "https://news.stanford.edu/home-page",
            ctaUrl: "matrix-asset://api-identifier/28192",
            ctaNewWindow: false
        },
        contentConfiguration: {
            eventsUrl: "https://events.stanford.edu/api/2/events?days=365&sponsored=true"
        },
        displayConfiguration: {
            numberOfEvents: 6
        }
    };

    const defaultMockInfo = {
        fns: mockFnsCtx
    };

    beforeEach(() => {
        vi.clearAllMocks();
        uuid.mockReturnValue('476f6893-b77b-43d8-ac8c-ac74d3d75dd7');
        linkedHeadingService.mockResolvedValueOnce({
            title: "Sample Heading",
            ctaText: "Learn More",
            ctaLink: "https://example.com",
            ctaNewWindow: false
        });
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters was provided.', async () => {
            const result = await main();

            expect(result).toBe('<!-- Error occurred in the Events section component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when no info was provided', async () => {
            const result = await main(defaultMockData);

            expect(result).toBe('<!-- Error occurred in the Events section component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info do not have fns or ctx functions', async () => {
            const mockInfo = {test: 'test'}
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Events section component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when fns or ctx is invalid', async () => {
            const mockInfo = { fns: undefined, ctx: undefined,  };
            const result = await main(defaultMockData, mockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Events section component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when eventsUrl was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    eventsUrl: 123
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Events section component: The "eventsUrl" field cannot be undefined and must be a non-empty string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when eventsUrl was an empty string', async () => {
            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    eventsUrl: ''
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Events section component: The "eventsUrl" field cannot be undefined and must be a non-empty string. The "" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when numberOfEvents was not a number', async () => {
            const mockData = {
                ...defaultMockData,
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    numberOfEvents: '12'
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Events section component: The "numberOfEvents" field cannot be undefined and must be a number one of [3, 6, 9]. The "12" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when numberOfEvents was not a number one of [3, 6, 9]', async () => {
            const mockData = {
                ...defaultMockData,
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    numberOfEvents: 4
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Events section component: The "numberOfEvents" field cannot be undefined and must be a number one of [3, 6, 9]. The 4 was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Events section component: The "title" field must be a string. The 123 was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Events section component: The "ctaUrl" field must be a string. The 123 was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Events section component: The "ctaManualUrl" field must be a string. The 123 was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Events section component: The "ctaText" field must be a string. The 123 was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Events section component: The "ctaNewWindow" field must be a boolean. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        it('Should return the expected HTML with valid data', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="events-section"><div class="su-mx-auto su-component-container su-container-large su-container-px">  <div class="su-component-line-heading su-flex su-flex-wrap su-items-baseline su-gap-5 su-gap-x-13 md:su-gap-13"><h2 class="su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white su-text-black"> Sample Heading </h2><hr aria-hidden="true" class="md:su-mb-11 lg:su-mb-15 su-grow su-border-none su-bg-gradient-light-red-h su-h-4"/>  <a data-test="cta" href="https://example.com" class="su-group su-flex su-no-underline hocus:su-underline su-transition su-items-center md:su-items-end md:su-mb-8 lg:su-mb-12 su-flex-nowrap su-align-baseline su-gap-20 md:su-gap-13 su-text-19 su-decoration-2 dark:su-text-white su-text-black hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red"><span class="su-flex su-gap-2 su-items-baseline"><span> Learn More<!-- --><span class="sr-only">Sample Heading</span></span> <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" class="svg-inline--fa fa-chevron-right fa-fw su-text-14 group-hocus:su-translate-x-02em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="18"><path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path></svg> </span></a>  </div> <div class='su-w-full su-component-horizontal-card-grid' data-test='orientation-horizontal'><div class="su-relative su-grid su-grid-cols-1 md:su-grid-cols-2 lg:su-grid-cols-3 su-gap-34 md:su-gap-36 lg:su-gap-48">   <div class='su-relative su-grow'> <article aria-label="Inaugural Lecturer’s Award winners honored" class="listing-item su-flex su-gap-19 su-relative" data-testid="horizontal-card">  <div class="su-shrink-0 su-w-[73px] su-h-[73px] su-relative">  <button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="476f6893-b77b-43d8-ac8c-ac74d3d75dd7"> <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[1/1]">   <video class="su-absolute su-object-cover su-object-center su-size-full"><source src="https://example.com" type="video/mp4"> Your browser does not support the video tag. </video>   <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="Open video Image of Cathy Haas, Jamie Imam, Provost Jenny Martinez, Elizabeth Kessler, Hayes in a modal"/>    <span class="su-absolute su-leading-none su-left-13 su-bottom-13 [&amp;&gt;svg]:su-text-[4rem] "> <svg aria-hidden="true" focusable="false" data-testid=svg-circle-play data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg> </span> </span></button>  </div>  <div class="su-flex su-flex-col su-gap-6">  <p class="su-mb-0 su-text-16 su-font-semibold su-text-digital-red dark:su-text-dark-mode-red hover:dark:su-text-dark-mode-red" data-testid="horizontal-card-taxonomy"><a href="https://example.com/" class="focus:su-outline-0 focus:su-ring su-text-digital-red su-no-underline hover:su-text-digital-red dark:su-text-dark-mode-red hover:dark:su-text-dark-mode-red su-block su-mt-[-6px]"> Awards, Honors & Appointments </a></p>  <h3 class="su-font-sans su-my-0 su-group su-text-18 su-font-semibold su-leading-[21.495px]"><a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>Inaugural Lecturer’s Award winners honored</span>  </a></h3>  <div data-testid="horizontal-event-date"> <span data-testid="event-date" class="su-mb-0 su-text-16">Oct 27 | 5:00 PM</span> </div>    </div></article> </div>  <div class='su-relative su-grow'> <article aria-label="Bass Fellows in Undergraduate Education announced" class="listing-item su-flex su-gap-19 su-relative" data-testid="horizontal-card">  <div class="su-shrink-0 su-w-[73px] su-h-[73px] su-relative">  <div class="su-component-card-thumbnail su-w-full su-h-full"> <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[1/1]">   <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://picsum.photos/400/400" alt="Main Quad as seen through arcade arch"/>   </span></div>  </div>  <div class="su-flex su-flex-col su-gap-6">  <p class="su-mb-0 su-text-16 su-font-semibold su-text-digital-red dark:su-text-dark-mode-red hover:dark:su-text-dark-mode-red" data-testid="horizontal-card-taxonomy"><a href="https://example.com/" class="focus:su-outline-0 focus:su-ring su-text-digital-red su-no-underline hover:su-text-digital-red dark:su-text-dark-mode-red hover:dark:su-text-dark-mode-red su-block su-mt-[-6px]"> Awards, Honors & Appointments </a></p>  <h3 class="su-font-sans su-my-0 su-group su-text-18 su-font-semibold su-leading-[21.495px]"><a href="https://example.com" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>Bass Fellows in Undergraduate Education announced</span>  </a></h3>  <div data-testid="horizontal-event-date"> <span data-testid="event-date" class="su-mb-0 su-text-16">Oct 27 | 5:00 PM</span> </div>    </div></article> </div>   </div></div> </div></section>"`);
        });

        it('Should throw an error when getCards will return empty array', async () => {
            cardDataAdapter.mockImplementation(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValueOnce([])
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<!-- Error occurred in the Events section component: The "data" cannot be undefined or null. The [] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when getCards will fail', async () => {
            cardDataAdapter.mockImplementation(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockRejectedValueOnce(new Error('No cards'))
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<!-- Error occurred in the Events section component: Failed to fetch event data. No cards -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });
});
