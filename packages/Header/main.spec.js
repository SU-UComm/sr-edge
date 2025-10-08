import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FetchAdapter } from '../../global/js/utils';

import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

// const defaultMockInfo = {
//     fetchData: vi.fn(async () => ({})), 
//     errorHandler: vi.fn(),
// };

const mockedFetch = {
    site: {
        url: "https://sug-web.matrix.squiz.cloud/devreport",
        title: "Stanford Report",
        logo: {
            url: "https://sug-web.matrix.squiz.cloud/__data/assets/file/0034/128995/sr-logo-color.svg",
            alt: "Stanford Report"
        },
        logoLight: {
            url: "https://sug-web.matrix.squiz.cloud/__data/assets/file/0035/128996/srlogo_light.svg",
            alt: "Stanford Report"
        },
        logoTopBar: {
            url: "https://sug-web.matrix.squiz.cloud/__data/assets/image/0031/128992/logo-stanford-uni-white.png",
            alt: "Stanford University"
        },
        logoFooter: {
            url: "https://sug-web.matrix.squiz.cloud/__data/assets/file/0032/128993/global-footer-icon.svg",
            alt: "Stanford University"
        },
        copyright: "Stanford University. Stanford, California 94305.",
        mission: "Stories to keep you informed and inspired, from one of the world's leading research and teaching institutions.",
        cookieStatement: "We want to provide stories, announcements, events, leadership messages and resources that are relevant to you. Your selection is stored in a browser cookie which you can remove at any time by visiting the \"Show me...\" menu at the top right of the page. For more, read our <a href=\"#\">cookie policy</a>."
    },
    navigation: {
        major: [
            {
                asset_name: "University News",
                asset_url: "https://sug-web.matrix.squiz.cloud/devreport/university-news",
                asset_assetid: "134201",
                children: [
                    {
                        asset_name: "Awards, Honors &amp; Appointments",
                        asset_assetid: "134213",
                        asset_url: "https://sug-web.matrix.squiz.cloud/devreport/university-news/topic/awards,-honors-and-appointments"
                    },
                    {
                        asset_name: "Campus &amp; Facilities",
                        asset_assetid: "134212",
                        asset_url: "https://sug-web.matrix.squiz.cloud/devreport/university-news/topic/campus-and-facilities"
                    },
                    {
                        asset_name: "Institutional News",
                        asset_assetid: "134211",
                        asset_url: "https://sug-web.matrix.squiz.cloud/devreport/university-news/topic/institutional-news"
                    },
                    {
                        asset_name: "Leadership &amp; Governance",
                        asset_assetid: "134210",
                        asset_url: "https://sug-web.matrix.squiz.cloud/devreport/university-news/topic/leadership-and-governance"
                    },
                    {
                        asset_name: "Distinguished Visitors",
                        asset_assetid: "134209",
                        asset_url: "https://sug-web.matrix.squiz.cloud/devreport/university-news/topic/distinguished-visitors"
                    }
                ]
            },
            {
                asset_name: "Research &amp; Scholarship",
                asset_url: "https://sug-web.matrix.squiz.cloud/devreport/research-and-scholarship",
                asset_assetid: "134200",
                children: [
                    {
                        asset_name: "Science &amp; Engineering",
                        asset_assetid: "134217",
                        asset_url: "https://sug-web.matrix.squiz.cloud/devreport/research-and-scholarship/topic/science-and-engineering"
                    }
                ]
            },
            {
                asset_name: "On Campus",
                asset_url: "https://sug-web.matrix.squiz.cloud/devreport/on-campus",
                asset_assetid: "134199",
                children: ""
            },
            {
                asset_name: "Student Experience",
                asset_url: "https://sug-web.matrix.squiz.cloud/devreport/student-experience",
                asset_assetid: "134198",
                children: ""
            }
        ],
        minor: [
            {
                asset_name: "In the News",
                asset_url: "https://sug-web.matrix.squiz.cloud/devreport/in-the-news",
                asset_assetid: "134191"
            },
            {
                asset_name: "Leadership Messages",
                asset_url: "https://sug-web.matrix.squiz.cloud/devreport/leadership-messages",
                asset_assetid: "134167"
            },
            {
                asset_name: "Announcements",
                asset_url: "https://sug-web.matrix.squiz.cloud/devreport/announcement",
                asset_assetid: "134166"
            }
        ],
        contacts: [
            {
                asset_name: "Contact",
                asset_url: "https://sug-web.matrix.squiz.cloud/report/contact",
                asset_assetid: "125954"
            },
            {
                asset_name: "Subscribe",
                asset_url: "https://sug-web.matrix.squiz.cloud/report/subscribe",
                asset_assetid: "125958"
            },
            {
                asset_name: "Media Contacts",
                asset_url: "https://sug-web.matrix.squiz.cloud/report/media-contacts",
                asset_assetid: "125962"
            }
        ],
        contactsStudent: [
            {
                asset_name: "Contact",
                asset_url: "https://sug-web.matrix.squiz.cloud/report/contact",
                asset_assetid: "125954"
            }
        ],
        contactsStaff: [
            {
                asset_name: "Contact",
                asset_url: "https://sug-web.matrix.squiz.cloud/report/contact",
                asset_assetid: "125954"
            }
        ],
        external: {
            anonymous: [
                {
                    asset_name: "Community Engagement",
                    asset_attribute_redirect_url: "https://sug-web.matrix.squiz.cloud/report",
                    asset_assetid: "128891"
                },
                {
                    asset_name: "Admissions",
                    asset_attribute_redirect_url: "https://sug-web.matrix.squiz.cloud/report",
                    asset_assetid: "128892"
                },
                {
                    asset_name: "Giving",
                    asset_attribute_redirect_url: "https://sug-web.matrix.squiz.cloud/report",
                    asset_assetid: "128893"
                },
                {
                    asset_name: "Events",
                    asset_attribute_redirect_url: "https://sug-web.matrix.squiz.cloud/report",
                    asset_assetid: "128894"
                }
            ],
            student: [
                {
                    asset_name: "VPSA",
                    asset_attribute_redirect_url: "https://sug-web.matrix.squiz.cloud/report",
                    asset_assetid: "128895"
                },
                {
                    asset_name: "VPUE",
                    asset_attribute_redirect_url: "https://sug-web.matrix.squiz.cloud/report",
                    asset_assetid: "128896"
                },
                {
                    asset_name: "VPGE",
                    asset_attribute_redirect_url: "https://sug-web.matrix.squiz.cloud/report",
                    asset_assetid: "128897"
                },
                {
                    asset_name: "R&amp;DE",
                    asset_attribute_redirect_url: "https://sug-web.matrix.squiz.cloud/report",
                    asset_assetid: "128898"
                }
            ],
            staff: [
                {
                    asset_name: "Cardinal at Work",
                    asset_attribute_redirect_url: "https://sug-web.matrix.squiz.cloud/report",
                    asset_assetid: "128899"
                },
                {
                    asset_name: "University IT",
                    asset_attribute_redirect_url: "https://sug-web.matrix.squiz.cloud/report",
                    asset_assetid: "128900"
                },
                {
                    asset_name: "Department of Public Safety",
                    asset_attribute_redirect_url: "https://sug-web.matrix.squiz.cloud/report",
                    asset_assetid: "128901"
                },
                {
                    asset_name: "Stanford Transportation",
                    asset_attribute_redirect_url: "https://sug-web.matrix.squiz.cloud/report",
                    asset_assetid: "128902"
                }
            ]
        },
        footerPrimary: [
            {
                asset_name: "Stanford Home",
                asset_attribute_redirect_url: "https://www.stanford.edu/",
                asset_assetid: "129634"
            },
            {
                asset_name: "Maps &amp; Directions",
                asset_attribute_redirect_url: "https://visit.stanford.edu/plan/",
                asset_assetid: "129635"
            },
            {
                asset_name: "Search Stanford",
                asset_attribute_redirect_url: "https://www.stanford.edu/search/",
                asset_assetid: "129636"
            },
            {
                asset_name: "Emergency Info",
                asset_attribute_redirect_url: "https://emergency.stanford.edu/",
                asset_assetid: "129637"
            }
        ],
        footerSecondary: [
            {
                asset_name: "Terms of Use",
                asset_attribute_redirect_url: "https://www.stanford.edu/site/terms/",
                asset_assetid: "129638"
            },
            {
                asset_name: "Privacy",
                asset_attribute_redirect_url: "https://www.stanford.edu/site/privacy",
                asset_assetid: "129639"
            },
            {
                asset_name: "Copyright",
                asset_attribute_redirect_url: "https://uit.stanford.edu/security/copyright-infringement",
                asset_assetid: "129640"
            },
            {
                asset_name: "Trademarks",
                asset_attribute_redirect_url: "https://adminguide.stanford.edu/chapters/guiding-policies-and-principles/conflict-interest/ownership-and-use-stanford-trademarks",
                asset_assetid: "129641"
            },
            {
                asset_name: "Non-Discrimination",
                asset_attribute_redirect_url: "https://bulletin.stanford.edu/academic-polices/student-conduct-rights/nondiscrimination",
                asset_assetid: "129642"
            },
            {
                asset_name: "Accessibility",
                asset_attribute_redirect_url: "https://www.stanford.edu/site/accessibility/",
                asset_assetid: "129643"
            }
        ]
    },
    search: {
        endpoint: "https://dxp-us-search.funnelback.squiz.cloud/s/search.html",
        collection: "sug~sp-stanford-report-search",
        profile: "stanford-report-push-search"
    }
}

vi.mock('../../global/js/utils', () => ({
    FetchAdapter: vi.fn().mockImplementation(() => ({
        fetch: vi.fn().mockResolvedValue(mockedFetch),
    }))
}));


describe('[Header]', () => {
    const defaultMockData = {
        "dataUrl": "https://example.com/json"
    };

    const defaultMockInfo = {
        env: {
            CONTENT_API: 'https://example.com/json',
            CONTENT_API_KEY: 'KEY',
            FB_JSON_URL: 'https://example.com/json'

        },
        ctx: {
            resolveUri: vi.fn()
        }
    };
    
    beforeEach(() => {
        vi.clearAllMocks();
    });
    
    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters were provided', async () => {
            const result = await main();
            
            expect(result).toContain('<!-- Error occurred in the Header component: The "CONTENT_API" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when CONTENT_API was not provided', async () => {
            const mockInfo = {
                env: {
                    ...defaultMockInfo.env,
                    CONTENT_API: undefined
                }
            }

            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Header component: The "CONTENT_API" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when CONTENT_API was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        ...defaultMockInfo.env,
                        CONTENT_API: undefined
                    }
                }
            }

            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Header component: The "CONTENT_API" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when CONTENT_API_KEY was not provided', async () => {
            const mockInfo = {
                env: {
                    ...defaultMockInfo.env,
                    CONTENT_API_KEY: undefined
                }
            }

            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Header component: The "CONTENT_API_KEY" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when CONTENT_API_KEY was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        ...defaultMockInfo.env,
                        CONTENT_API_KEY: undefined
                    }
                }
            }

            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Header component: The "CONTENT_API_KEY" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Header component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Header component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw error when fns or ctx is invalid', async () => {
            const mockInfo = { 
                env: defaultMockInfo.env,
                fns: undefined, 
                ctx: undefined,
            };
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Header component: The "info.ctx" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw error when dataUrl was not defined', async () => {
            const mockData = { 
                dataUrl: undefined
            };
            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Header component: The "dataUrl" field cannot be undefined and must be a non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when dataUrl was not a string', async () => {
            const mockData = { 
                dataUrl: 123
            };
            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Header component: The "dataUrl" field cannot be undefined and must be a non-empty string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

    });

    describe('[Main Function]', () => {
        it('Should return the expected HTML with valid data', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<header data-component='header-component' class="report-header su-pb-[11rem] md:su-pb-[17.7rem] lg:su-pb-[19.3rem]"><div class="su-shadow dark:su-shadow-[0_3px_6px_0_rgba(46,45,41,0.5)] su-fixed su-top-0 su-left-0 su-w-full su-bg-white dark:su-bg-black-true su-z-50"><div class='report-header__utility su-flex su-items-center su-w-full su-bg-cardinal-red su-relative su-z-40 su-h-30'><div class='su-max-w-[141.2rem] su-px-20 md:su-px-49 su-w-full su-mx-auto'><a href='https://www.stanford.edu/' data-ga-action='logo' class='su-inline-block'></a></div></div><div class="su-w-full su-max-w-[141.2rem] su-px-20 md:su-px-49 su-mx-auto"><div class="report-header__main su-flex su-items-center lg:su-items-end su-justify-between md:su-pb-[10px] lg:su-pb-[11px]"><div class="su-flex su-items-center su-gap-20 lg:su-gap-27 su-w-32 md:su-w-85 lg:su-w-[9.1rem]"><button class="su-w-32 su-flex su-flex-wrap su-gap-3 su-justify-center hover:su-text-digital-red dark:hover:su-text-dark-mode-red" aria-controls="menu" aria-expanded="false" type="button" ><span class="su-relative su-size-32"><svg aria-hidden='true' focusable='false' class='su-hidden md:su-block su-absolute su-top-1/2 su-left-1/2 -su-translate-x-1/2 -su-translate-y-1/2' width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg' class='su-hidden md:su-block su-absolute su-top-1/2 su-left-1/2 -su-translate-x-1/2 -su-translate-y-1/2'><path fill-rule='evenodd' clip-rule='evenodd' d='M4.79999 7.99999C4.79999 7.11634 5.51633 6.39999 6.39999 6.39999H25.6C26.4836 6.39999 27.2 7.11634 27.2 7.99999C27.2 8.88365 26.4836 9.59999 25.6 9.59999H6.39999C5.51633 9.59999 4.79999 8.88365 4.79999 7.99999Z' /><path fill-rule='evenodd' clip-rule='evenodd' d='M4.79999 16C4.79999 15.1163 5.51633 14.4 6.39999 14.4H25.6C26.4836 14.4 27.2 15.1163 27.2 16C27.2 16.8836 26.4836 17.6 25.6 17.6H6.39999C5.51633 17.6 4.79999 16.8836 4.79999 16Z' /><path fill-rule='evenodd' clip-rule='evenodd' d='M4.79999 24C4.79999 23.1163 5.51633 22.4 6.39999 22.4H25.6C26.4836 22.4 27.2 23.1163 27.2 24C27.2 24.8836 26.4836 25.6 25.6 25.6H6.39999C5.51633 25.6 4.79999 24.8836 4.79999 24Z' /></svg> <svg aria-hidden='true' focusable='false' class='md:su-hidden su-absolute su-top-1/2 su-left-1/2 -su-translate-x-1/2 -su-translate-y-1/2' width='28' height='21' viewBox='0 0 28 21' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M1.69697 11.8788H12.5576C11.9636 10.8606 11.6242 9.67273 11.5394 8.48485H1.69697C0.763636 8.48485 0 9.24848 0 10.1818C0 11.1152 0.763636 11.8788 1.69697 11.8788ZM1.69697 3.39394H12.5576C13.3212 1.95152 14.4242 0.848485 15.8667 0H1.69697C0.763636 0 0 0.763636 0 1.69697C0 2.6303 0.763636 3.39394 1.69697 3.39394ZM6.36364 19.0909C6.36364 18.4121 6.61818 17.7333 7.12727 17.3091L7.46667 16.9697H1.69697C0.763636 16.9697 0 17.7333 0 18.6667C0 19.6 0.763636 20.3636 1.69697 20.3636H6.70303C6.53333 19.9394 6.36364 19.5152 6.36364 19.0909Z' /><path d='M20.3637 2.54545C23.1637 2.54545 25.4546 4.83636 25.4546 7.63636C25.4546 10.4364 23.1637 12.7273 20.3637 12.7273C17.5637 12.7273 15.2727 10.4364 15.2727 7.63636C15.2727 4.83636 17.5637 2.54545 20.3637 2.54545ZM28 7.63636C28 3.39394 24.6061 0 20.3637 0C16.1212 0 12.7273 3.39394 12.7273 7.63636C12.7273 9.24849 13.2364 10.7758 14.1697 12.0485L8.06062 18.1576C7.55153 18.6667 7.55153 19.4303 8.06062 19.9394C8.56971 20.4485 9.33335 20.4485 9.84244 19.9394L15.9515 13.8303C17.2243 14.6788 18.7515 15.2727 20.3637 15.2727C24.6061 15.2727 28 11.8788 28 7.63636Z' /></svg></span><span class="su-text-12 su-hidden md:su-block">Menu</span></button><nav id='menu' aria-label='Primary' aria-hidden='true' class='report-header__menu-tray su-hidden su-shadow su-z-50 su-fixed su-left-0 su-top-0 su-size-full'><span tabIndex='0' data-tp-to='close'></span><div class='report-header__overlay su-bg-black su-opacity-25 su-size-full' ></div><div class='report-header__primary-nav su-bg-white dark:su-bg-black-true dark:su-text-white su-h-screen su-absolute su-top-0 su-left-0 su-w-full md:su-w-[390px] su-overflow-y-auto su-pb-32 md:su-pb-[64px] su-pt-[115px] md:su-pt-[159px] md:su-pt-[167px] su-px-38' ><div class='su-flex su-flex-wrap'><form action='' method='get' role='search' class='su-mb-32 su--mx-18 md:su-hidden su-grow su-flex su-flex-wrap su-order-1 su-relative' data-location='mobile-search:input:3' ><label class='sr-only' for='mobile_search_query'>Search query</label><input type='hidden' value='sug~sp-stanford-report-search' name='collection' /><input type='hidden' value='stanford-report-push-search' name='profile' /><input type='search' class='su-w-full su-h-50 su-rounded-full su-mb-[3.2rem] dark:su-text-black su-text-20 su-leading-[2.6rem] su-py-10 su-pl-15 su-pr-120 su-border-2 su-border-black-60 dark:su-border-black-20 hover:su-border-black-70 dark:focus:su-border-digital-blue-vivid focus:su-border-digital-blue' name='query' value='' placeholder='Search' id='mobile_search_query' data-role='search-query' required='required' /><button type='reset' class='report-header__clear su-h-48 su-absolute su-top-2 su-right-70 su-text-digital-blue su-text-20' data-role='clear-search' >Clear<span class='sr-only'>Search</span></button><hr class='!su-absolute !su-z-[1] dark:su-bg-black-60 su-right-60 su-w-2 su-h-32 su-top-10 su-border-none su-bg-black-30' aria-hidden='true' /><button class='su-absolute su-size-40 su-right-10 su-top-5' type='submit' ><svg aria-hidden='true' class='su-size-30 su-mt-2 su-ml-4 su-text-digital-red dark:su-text-dark-mode-red' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' ><path d='M17.4513 4.23242C12.8013 4.23242 9.01885 8.01492 9.01885 12.6662C9.01885 14.4587 9.5851 16.1187 10.5413 17.4862L4.5001 23.5274C3.9876 24.0399 3.9876 24.8699 4.5001 25.3824C4.75635 25.6387 5.0926 25.7674 5.4276 25.7674C5.7626 25.7674 6.1001 25.6387 6.35635 25.3824L12.3638 19.3749C13.7801 20.4512 15.5388 21.0987 17.4513 21.0987C22.1013 21.0987 25.8839 17.3162 25.8839 12.6649C25.8839 8.01367 22.1013 4.23242 17.4513 4.23242ZM17.4513 18.4737C14.2488 18.4737 11.6438 15.8674 11.6438 12.6649C11.6438 9.46242 14.2488 6.85617 17.4513 6.85617C20.6538 6.85617 23.2588 9.46242 23.2588 12.6649C23.2588 15.8674 20.6526 18.4737 17.4513 18.4737Z' /></svg><span class='sr-only'>Submit search</span></button><hr aria-hidden='true' class='su-block su-mt-32 su-border-none su-grow su-bg-black-10 dark:su-bg-black su-w-full su-h-2 md:su-h-3' /></form><ul class='su-mobile-nav-major su-w-full su-order-2 su-list-none su-flex su-flex-wrap su-gap-11 md:su-gap-19 su-pl-0 su-ml-0' data-location='main-nav:a:0' ><li class='su-mb-0 su-w-full'><a class='su-text-black hocus:su-underline dark:su-text-white dark:hocus:su-text-dark-mode-red su-text-20 md:su-text-26 su-leading-[3.1rem] hocus:su-text-digital-red su-font-bold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/devreport/university-news' >University News</a></li><li class='su-mb-0 su-w-full'><a class='su-text-black hocus:su-underline dark:su-text-white dark:hocus:su-text-dark-mode-red su-text-20 md:su-text-26 su-leading-[3.1rem] hocus:su-text-digital-red su-font-bold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/devreport/research-and-scholarship' >Research & Scholarship</a></li><li class='su-mb-0 su-w-full'><a class='su-text-black hocus:su-underline dark:su-text-white dark:hocus:su-text-dark-mode-red su-text-20 md:su-text-26 su-leading-[3.1rem] hocus:su-text-digital-red su-font-bold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/devreport/on-campus' >On Campus</a></li><li class='su-mb-0 su-w-full'><a class='su-text-black hocus:su-underline dark:su-text-white dark:hocus:su-text-dark-mode-red su-text-20 md:su-text-26 su-leading-[3.1rem] hocus:su-text-digital-red su-font-bold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/devreport/student-experience' >Student Experience</a></li></ul><hr aria-hidden='true' class='su-block su-order-2 su-my-20 md:su-my-27 su-w-full su-bg-gradient-light-red-h su-h-4 su-border-none md:su-h-3' /><ul class='su-w-full su-order-2 su-list-none su-pl-0 su-ml-0'><li class='su-mb-6 su-w-full su-leading-[21px]' ><a class='su-text-black hocus:su-underline dark:su-text-white dark:hover:su-text-dark-mode-red su-text-16 md:su-text-18 focus:su-text-digital-red hover:su-text-digital-red su-font-semibold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/devreport/in-the-news' >In the News</a></li><li class='su-mb-6 su-w-full su-leading-[21px]' ><a class='su-text-black hocus:su-underline dark:su-text-white dark:hover:su-text-dark-mode-red su-text-16 md:su-text-18 focus:su-text-digital-red hover:su-text-digital-red su-font-semibold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/devreport/leadership-messages' >Leadership Messages</a></li><li class='su-mb-6 su-w-full su-leading-[21px]' ><a class='su-text-black hocus:su-underline dark:su-text-white dark:hover:su-text-dark-mode-red su-text-16 md:su-text-18 focus:su-text-digital-red hover:su-text-digital-red su-font-semibold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/devreport/announcement' >Announcements</a></li></ul><hr aria-hidden='true' class='su-block su-order-2 su-my-20 md:su-my-27 su-w-[9.1rem] su-bg-black-10 dark:su-bg-black su-border-none su-h-2' /><ul class='su-w-full su-order-2 su-list-none su-pl-0 su-ml-0' data-audience='external' ><li class='su-mb-6 su-w-full su-leading-[1.6rem]' ><a class='su-text-black hocus:su-underline dark:su-text-white dark:hocus:su-text-dark-mode-red su-text-14 hocus:su-text-digital-red su-font-semibold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/report/contact' >Contact</a></li><li class='su-mb-6 su-w-full su-leading-[1.6rem]' ><a class='su-text-black hocus:su-underline dark:su-text-white dark:hocus:su-text-dark-mode-red su-text-14 hocus:su-text-digital-red su-font-semibold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/report/subscribe' >Subscribe</a></li><li class='su-mb-6 su-w-full su-leading-[1.6rem]' ><a class='su-text-black hocus:su-underline dark:su-text-white dark:hocus:su-text-dark-mode-red su-text-14 hocus:su-text-digital-red su-font-semibold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/report/media-contacts' >Media Contacts</a></li></ul><ul class='su-w-full su-order-2 su-list-none su-pl-0 su-ml-0 su-hidden' data-audience='student' ><li class='su-mb-6 su-w-full su-leading-[1.6rem]' ><a class='su-text-black hocus:su-underline dark:su-text-white dark:hocus:su-text-dark-mode-red su-text-14 hocus:su-text-digital-red su-font-semibold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/report/contact' >Contact</a></li></ul><ul class='su-w-full su-order-2 su-list-none su-pl-0 su-ml-0 su-hidden' data-audience='faculty' ><li class='su-mb-6 su-w-full su-leading-[1.6rem]' ><a class='su-text-black hocus:su-underline dark:su-text-white dark:hocus:su-text-dark-mode-red su-text-14 hocus:su-text-digital-red su-font-semibold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/report/contact' >Contact</a></li></ul><hr aria-hidden='true' class='su-block su-order-2 su-my-20 md:su-my-27 su-w-[9.1rem] su-bg-black-10 dark:su-bg-black su-border-none su-h-2' /><ul class='su-w-full su-order-2 su-list-none su-pl-0 su-ml-0' data-audience='external' ><li class='su-mb-3 su-w-full su-leading-[16px]' ><a target='_blank' class='su-group su-flex hocus:su-underline su-items-center su-text-black dark:su-text-white dark:hocus:su-text-dark-mode-red su-text-14 hocus:su-text-digital-red su-font-semibold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/report' rel='noreferrer' ><span class='su-mr-2'>Community Engagement</span><svg class='su-stroke-digital-red dark:su-stroke-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform' xmlns='http://www.w3.org/2000/svg' width='23' height='23' viewBox='0 0 23 23' fill='none' aria-hidden='true' ><path d='M8.95664 7.07109L15.5563 7.07109M15.5563 7.07109L15.5563 13.6708M15.5563 7.07109L7.07102 15.5564' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg></a></li><li class='su-mb-3 su-w-full su-leading-[16px]' ><a target='_blank' class='su-group su-flex hocus:su-underline su-items-center su-text-black dark:su-text-white dark:hocus:su-text-dark-mode-red su-text-14 hocus:su-text-digital-red su-font-semibold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/report' rel='noreferrer' ><span class='su-mr-2'>Admissions</span><svg class='su-stroke-digital-red dark:su-stroke-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform' xmlns='http://www.w3.org/2000/svg' width='23' height='23' viewBox='0 0 23 23' fill='none' aria-hidden='true' ><path d='M8.95664 7.07109L15.5563 7.07109M15.5563 7.07109L15.5563 13.6708M15.5563 7.07109L7.07102 15.5564' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg></a></li><li class='su-mb-3 su-w-full su-leading-[16px]' ><a target='_blank' class='su-group su-flex hocus:su-underline su-items-center su-text-black dark:su-text-white dark:hocus:su-text-dark-mode-red su-text-14 hocus:su-text-digital-red su-font-semibold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/report' rel='noreferrer' ><span class='su-mr-2'>Giving</span><svg class='su-stroke-digital-red dark:su-stroke-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform' xmlns='http://www.w3.org/2000/svg' width='23' height='23' viewBox='0 0 23 23' fill='none' aria-hidden='true' ><path d='M8.95664 7.07109L15.5563 7.07109M15.5563 7.07109L15.5563 13.6708M15.5563 7.07109L7.07102 15.5564' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg></a></li><li class='su-mb-3 su-w-full su-leading-[16px]' ><a target='_blank' class='su-group su-flex hocus:su-underline su-items-center su-text-black dark:su-text-white dark:hocus:su-text-dark-mode-red su-text-14 hocus:su-text-digital-red su-font-semibold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/report' rel='noreferrer' ><span class='su-mr-2'>Events</span><svg class='su-stroke-digital-red dark:su-stroke-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform' xmlns='http://www.w3.org/2000/svg' width='23' height='23' viewBox='0 0 23 23' fill='none' aria-hidden='true' ><path d='M8.95664 7.07109L15.5563 7.07109M15.5563 7.07109L15.5563 13.6708M15.5563 7.07109L7.07102 15.5564' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg></a></li></ul><ul class='su-w-full su-order-2 su-list-none su-pl-0 su-ml-0 su-hidden' data-audience='student' ><li class='su-mb-3 su-w-full su-leading-[16px]' ><a target='_blank' class='su-group su-flex hocus:su-underline su-items-center su-text-black dark:su-text-white dark:hocus:su-text-dark-mode-red su-text-14 hocus:su-text-digital-red su-font-semibold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/report' rel='noreferrer' ><span class='su-mr-2'>VPSA</span><svg class='su-stroke-digital-red dark:su-stroke-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform' xmlns='http://www.w3.org/2000/svg' width='23' height='23' viewBox='0 0 23 23' fill='none' aria-hidden='true' ><path d='M8.95664 7.07109L15.5563 7.07109M15.5563 7.07109L15.5563 13.6708M15.5563 7.07109L7.07102 15.5564' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg></a></li><li class='su-mb-3 su-w-full su-leading-[16px]' ><a target='_blank' class='su-group su-flex hocus:su-underline su-items-center su-text-black dark:su-text-white dark:hocus:su-text-dark-mode-red su-text-14 hocus:su-text-digital-red su-font-semibold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/report' rel='noreferrer' ><span class='su-mr-2'>VPUE</span><svg class='su-stroke-digital-red dark:su-stroke-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform' xmlns='http://www.w3.org/2000/svg' width='23' height='23' viewBox='0 0 23 23' fill='none' aria-hidden='true' ><path d='M8.95664 7.07109L15.5563 7.07109M15.5563 7.07109L15.5563 13.6708M15.5563 7.07109L7.07102 15.5564' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg></a></li><li class='su-mb-3 su-w-full su-leading-[16px]' ><a target='_blank' class='su-group su-flex hocus:su-underline su-items-center su-text-black dark:su-text-white dark:hocus:su-text-dark-mode-red su-text-14 hocus:su-text-digital-red su-font-semibold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/report' rel='noreferrer' ><span class='su-mr-2'>VPGE</span><svg class='su-stroke-digital-red dark:su-stroke-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform' xmlns='http://www.w3.org/2000/svg' width='23' height='23' viewBox='0 0 23 23' fill='none' aria-hidden='true' ><path d='M8.95664 7.07109L15.5563 7.07109M15.5563 7.07109L15.5563 13.6708M15.5563 7.07109L7.07102 15.5564' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg></a></li><li class='su-mb-3 su-w-full su-leading-[16px]' ><a target='_blank' class='su-group su-flex hocus:su-underline su-items-center su-text-black dark:su-text-white dark:hocus:su-text-dark-mode-red su-text-14 hocus:su-text-digital-red su-font-semibold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/report' rel='noreferrer' ><span class='su-mr-2'>R&DE</span><svg class='su-stroke-digital-red dark:su-stroke-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform' xmlns='http://www.w3.org/2000/svg' width='23' height='23' viewBox='0 0 23 23' fill='none' aria-hidden='true' ><path d='M8.95664 7.07109L15.5563 7.07109M15.5563 7.07109L15.5563 13.6708M15.5563 7.07109L7.07102 15.5564' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg></a></li></ul><ul class='su-w-full su-order-2 su-list-none su-pl-0 su-ml-0 su-hidden' data-audience='faculty' ><li class='su-mb-3 su-w-full su-leading-[16px]' ><a target='_blank' class='su-group su-flex hocus:su-underline su-items-center su-text-black dark:su-text-white dark:hocus:su-text-dark-mode-red su-text-14 hocus:su-text-digital-red su-font-semibold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/report' rel='noreferrer' ><span class='su-mr-2'>Cardinal at Work</span><svg class='su-stroke-digital-red dark:su-stroke-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform' xmlns='http://www.w3.org/2000/svg' width='23' height='23' viewBox='0 0 23 23' fill='none' aria-hidden='true' ><path d='M8.95664 7.07109L15.5563 7.07109M15.5563 7.07109L15.5563 13.6708M15.5563 7.07109L7.07102 15.5564' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg></a></li><li class='su-mb-3 su-w-full su-leading-[16px]' ><a target='_blank' class='su-group su-flex hocus:su-underline su-items-center su-text-black dark:su-text-white dark:hocus:su-text-dark-mode-red su-text-14 hocus:su-text-digital-red su-font-semibold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/report' rel='noreferrer' ><span class='su-mr-2'>University IT</span><svg class='su-stroke-digital-red dark:su-stroke-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform' xmlns='http://www.w3.org/2000/svg' width='23' height='23' viewBox='0 0 23 23' fill='none' aria-hidden='true' ><path d='M8.95664 7.07109L15.5563 7.07109M15.5563 7.07109L15.5563 13.6708M15.5563 7.07109L7.07102 15.5564' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg></a></li><li class='su-mb-3 su-w-full su-leading-[16px]' ><a target='_blank' class='su-group su-flex hocus:su-underline su-items-center su-text-black dark:su-text-white dark:hocus:su-text-dark-mode-red su-text-14 hocus:su-text-digital-red su-font-semibold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/report' rel='noreferrer' ><span class='su-mr-2'>Department of Public Safety</span><svg class='su-stroke-digital-red dark:su-stroke-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform' xmlns='http://www.w3.org/2000/svg' width='23' height='23' viewBox='0 0 23 23' fill='none' aria-hidden='true' ><path d='M8.95664 7.07109L15.5563 7.07109M15.5563 7.07109L15.5563 13.6708M15.5563 7.07109L7.07102 15.5564' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg></a></li><li class='su-mb-3 su-w-full su-leading-[16px]' ><a target='_blank' class='su-group su-flex hocus:su-underline su-items-center su-text-black dark:su-text-white dark:hocus:su-text-dark-mode-red su-text-14 hocus:su-text-digital-red su-font-semibold su-no-underline su-transition' href='https://sug-web.matrix.squiz.cloud/report' rel='noreferrer' ><span class='su-mr-2'>Stanford Transportation</span><svg class='su-stroke-digital-red dark:su-stroke-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform' xmlns='http://www.w3.org/2000/svg' width='23' height='23' viewBox='0 0 23 23' fill='none' aria-hidden='true' ><path d='M8.95664 7.07109L15.5563 7.07109M15.5563 7.07109L15.5563 13.6708M15.5563 7.07109L7.07102 15.5564' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg></a></li></ul><button type='button' class='report-header__menu-close su-absolute su-right-20 md:su-right-48 su-top-43 md:su-top-75 su-w-32 su-flex su-flex-wrap su-gap-3 su-justify-center hocus-visible:su-text-digital-red dark:hocus-visible:su-text-dark-mode-red' aria-expanded='true' aria-controls='menu' aria-labelledby='close-menu' data-location='close' ><span class='su-relative su-size-32'><svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' aria-hidden='true' ><path fillRule='evenodd' clipRule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg></span><span id='close-menu' hidden='true'>Close menu</span><span class='su-text-14 su-block su-font-semibold' aria-hidden='true' >Close</span></button><span tabIndex='0' data-tp-to='mobile-search:input:3' class='md:su-hidden' ></span><span tabIndex='0' data-tp-to='main-nav:a:0' class='su-hidden md:su-inline' ></span></div></div></nav><span class="su-absolute"><span data-tp-to="submit-btn" data-role="search-focus-trap" class="su-hidden"></span></span><button type="button" class="su-hidden su-relative su-z-40 su-order-3 su-w-32 md:su-flex su-flex-wrap su-gap-3 su-justify-center hover:su-text-digital-red dark:hover:su-text-dark-mode-red" aria-controls="search" aria-expanded="false" aria-labelledby="toggle-search" data-location="close-search" ><span class="icon-search su-relative su-size-32"><svg aria-hidden='true' focusable='false' class='su-absolute su-top-1/2 su-left-1/2 -su-translate-x-1/2 -su-translate-y-1/2 ' width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' clip-rule='evenodd' d='M15.6 5.20001C18.4719 5.20001 20.8 7.52813 20.8 10.4C20.8 13.2719 18.4719 15.6 15.6 15.6C12.7281 15.6 10.4 13.2719 10.4 10.4C10.4 7.52813 12.7281 5.20001 15.6 5.20001ZM23.4 10.4C23.4 6.09218 19.9078 2.60001 15.6 2.60001C11.2922 2.60001 7.79999 6.09218 7.79999 10.4C7.79999 12.0846 8.33402 13.6444 9.24202 14.9195L2.98076 21.1808C2.47307 21.6884 2.47307 22.5116 2.98076 23.0192C3.48844 23.5269 4.31155 23.5269 4.81923 23.0192L11.0805 16.758C12.3556 17.666 13.9154 18.2 15.6 18.2C19.9078 18.2 23.4 14.7078 23.4 10.4Z' /></svg></span><span class="icon-close su-hidden su-relative su-size-32"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg></span><span id="toggle-search" hidden="true">Toggle Search</span><span class="text-search su-text-12 su-hidden md:su-block" aria-hidden="true" >Search</span><span class="text-close su-text-12 su-hidden" aria-hidden="true" >Close</span></button><div id='search' aria-label='Search' aria-hidden='true' class='su-hidden report-header__search-tray su-z-30 su-fixed su-left-0 su-top-0 su-w-full su-h-screen'><div class='report-header__overlay su-bg-black su-opacity-25 su-size-full' ></div><form action='' method='get' role='search' class='report-header__search su-bg-white dark:su-bg-black-true su-shadow su-shadow-black-60/50 su-absolute su-top-0 su-left-0 su-w-full su-px-50 su-pt-[249px] su-pb-[171px]' ><div class='su-max-w-[1026px] su-mx-auto su-relative'><label class='sr-only' for='desktop_search_query'>Search query</label><input type='hidden' value='sug~sp-stanford-report-search' name='collection' /><input type='hidden' value='stanford-report-push-search' name='profile' /><input type='search' class='su-w-full su-h-50 dark:su-text-black su-rounded-full su-text-20 su-leading-[26px] su-py-10 su-pl-15 su-pr-120 su-border-2 su-border-black-60 hover:su-border-black-70 focus:su-border-digital-blue dark:su-border-black-20 dark:focus:su-border-digital-blue-vivid focus:su-border-digital-blue' name='query' value='' placeholder='Search' id='desktop_search_query' tabIndex='0' data-role='search-query' required='required' /><div class='report-header__desktop-search-controls su-absolute su-top-0 su-h-[66px] su-right-0 su-flex su-gap-[18px] su-items-center' ><button type='button' data-role='clear-search' class='report-header__clear su-hidden su-h-48 su-top-2 su-right-70 su-text-digital-blue su-text-20' >Clear<span class='sr-only'>Search</span></button><hr class='dark:su-bg-black-60 su-right-60 su-w-2 su-h-32 su-top-10 su-border-none su-bg-black-30' aria-hidden='true' /><button class='su-size-40 su-right-10 su-top-5' type='submit' data-location='submit-btn' ><svg aria-hidden='true' class='su-size-30 su-text-digital-red dark:su-text-dark-mode-red' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' ><path d='M17.4513 4.23242C12.8013 4.23242 9.01885 8.01492 9.01885 12.6662C9.01885 14.4587 9.5851 16.1187 10.5413 17.4862L4.5001 23.5274C3.9876 24.0399 3.9876 24.8699 4.5001 25.3824C4.75635 25.6387 5.0926 25.7674 5.4276 25.7674C5.7626 25.7674 6.1001 25.6387 6.35635 25.3824L12.3638 19.3749C13.7801 20.4512 15.5388 21.0987 17.4513 21.0987C22.1013 21.0987 25.8839 17.3162 25.8839 12.6649C25.8839 8.01367 22.1013 4.23242 17.4513 4.23242ZM17.4513 18.4737C14.2488 18.4737 11.6438 15.8674 11.6438 12.6649C11.6438 9.46242 14.2488 6.85617 17.4513 6.85617C20.6538 6.85617 23.2588 9.46242 23.2588 12.6649C23.2588 15.8674 20.6526 18.4737 17.4513 18.4737Z' /></svg><span class='sr-only'>Submit search</span></button></div><span tabIndex='0' data-tp-to='close-search' /></div></form></div></div><div class='report-header__logo su-py-20 su-relative su-flex md:su-pt-21 md:su-ml-19 md:su-mr-13 lg:su-ml-26 lg:su-mr-36 md:su-pb-20 lg:su-pb-[8.75px] lg:su-pt-27 su-z-40'><a href='https://sug-web.matrix.squiz.cloud/devreport' class='dark:su-hidden' data-ga-action='logo'><img class='img-responsive su-w-[22.6rem] md:su-w-[27.8rem] lg:su-w-[40.6rem]' width='406' height='62' src='https://sug-web.matrix.squiz.cloud/__data/assets/file/0034/128995/sr-logo-color.svg' alt='Stanford Report' /></a><a href='https://sug-web.matrix.squiz.cloud/devreport' class='su-hidden dark:su-flex' data-ga-action='logo'><img class='img-responsive su-w-[22.6rem] md:su-w-[27.8rem] lg:su-w-[40.6rem]' width='406' height='62' src='https://sug-web.matrix.squiz.cloud/__data/assets/file/0035/128996/srlogo_light.svg' alt='Stanford Report' /></a></div><div data-subcomponent="header-preferences-tray" class="su-flex su-items-center su-justify-end su-w-32 md:su-w-[85px] lg:su-w-[91px]"><button type="button" class="su-w-58 su-flex su-flex-wrap su-gap-3 su-justify-center hover:su-text-digital-red dark:hover:su-text-dark-mode-red" aria-controls="preferences" aria-expanded="false" aria-labelledby="toggle-preferences" data-click="toggle-preferences" ><span class="icon-preferences" data-audience="external"><span class="su-relative su-size-32 su-block su-mx-auto"><svg data-testid='svg-preferences' aria-hidden='true' focusable='false' class='su-absolute su-top-1/2 su-left-1/2 -su-translate-x-1/2 -su-translate-y-1/2' width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M14.0723 3.66094C13.8789 3.73398 13.75 3.91875 13.75 4.125C13.75 4.33125 13.8789 4.51602 14.0723 4.58906L16.5 5.5L17.4109 7.92773C17.484 8.12109 17.6688 8.25 17.875 8.25C18.0812 8.25 18.266 8.12109 18.3391 7.92773L19.25 5.5L21.6777 4.58906C21.8711 4.51602 22 4.33125 22 4.125C22 3.91875 21.8711 3.73398 21.6777 3.66094L19.25 2.75L18.3391 0.322266C18.266 0.128906 18.0812 0 17.875 0C17.6688 0 17.484 0.128906 17.4109 0.322266L16.5 2.75L14.0723 3.66094ZM8.81289 3.14961C8.70117 2.90469 8.45625 2.75 8.18984 2.75C7.92344 2.75 7.67852 2.90469 7.5668 3.14961L5.29805 8.04805L0.399609 10.3125C0.154688 10.4242 0 10.6691 0 10.9398C0 11.2105 0.154688 11.4512 0.399609 11.5629L5.30234 13.8273L7.5625 18.7258C7.67422 18.9707 7.91914 19.1254 8.18555 19.1254C8.45195 19.1254 8.69687 18.9707 8.80859 18.7258L11.073 13.823L15.9758 11.5586C16.2207 11.4469 16.3754 11.202 16.3754 10.9355C16.3754 10.6691 16.2207 10.4242 15.9758 10.3125L11.0773 8.05234L8.81289 3.14961ZM16.5 16.5L14.0723 17.4109C13.8789 17.484 13.75 17.6688 13.75 17.875C13.75 18.0812 13.8789 18.266 14.0723 18.3391L16.5 19.25L17.4109 21.6777C17.484 21.8711 17.6688 22 17.875 22C18.0812 22 18.266 21.8711 18.3391 21.6777L19.25 19.25L21.6777 18.3391C21.8711 18.266 22 18.0812 22 17.875C22 17.6688 21.8711 17.484 21.6777 17.4109L19.25 16.5L18.3391 14.0723C18.266 13.8789 18.0812 13.75 17.875 13.75C17.6688 13.75 17.484 13.8789 17.4109 14.0723L16.5 16.5Z' /></svg></span><span id="toggle-preferences" hidden="true">Preferences</span><span class="su-text-12 su-hidden md:su-block" aria-hidden="true" >Show me...</span></span><span class="icon-faculty su-hidden" data-audience="faculty"><span class="su-relative su-size-32 su-block su-mx-auto"><svg data-testid='svg-faculty' class='dark:su-hidden su-absolute su-top-1/2 su-left-1/2 -su-translate-x-1/2 -su-translate-y-1/2' xmlns='http://www.w3.org/2000/svg' width='18' height='19' viewBox='0 0 18 19' fill='none' ><path d='M8.99989 9.5C10.3088 9.5 11.564 8.99956 12.4895 8.10876C13.415 7.21796 13.935 6.00978 13.935 4.75C13.935 3.49022 13.415 2.28204 12.4895 1.39124C11.564 0.500445 10.3088 0 8.99989 0C7.69103 0 6.43578 0.500445 5.51027 1.39124C4.58477 2.28204 4.06482 3.49022 4.06482 4.75C4.06482 6.00978 4.58477 7.21796 5.51027 8.10876C6.43578 8.99956 7.69103 9.5 8.99989 9.5ZM7.23792 11.2812C3.44023 11.2812 0.363525 14.2426 0.363525 17.8979C0.363525 18.5064 0.87631 19 1.50861 19H16.4912C17.1235 19 17.6363 18.5064 17.6363 17.8979C17.6363 14.2426 14.5595 11.2812 10.7619 11.2812H7.23792Z' fill='url(#paint0_linear_2047_2390)' /><defs><linearGradient id='paint0_linear_2047_2390' x1='17.6363' y1='0' x2='-3.69767' y2='11.3996' gradientUnits='userSpaceOnUse' ><stop offset='0' stop-color='#E50808' /><stop offset='1' stop-color='#820000' /></linearGradient></defs></svg> <svg class='su-hidden dark:su-block su-absolute su-top-1/2 su-left-1/2 -su-translate-x-1/2 -su-translate-y-1/2' xmlns='http://www.w3.org/2000/svg' width='18' height='19' viewBox='0 0 18 19' fill='none' ><path d='M8.99989 9.5C10.3088 9.5 11.564 8.99956 12.4895 8.10876C13.415 7.21796 13.935 6.00978 13.935 4.75C13.935 3.49022 13.415 2.28204 12.4895 1.39124C11.564 0.500445 10.3088 0 8.99989 0C7.69103 0 6.43578 0.500445 5.51027 1.39124C4.58477 2.28204 4.06482 3.49022 4.06482 4.75C4.06482 6.00978 4.58477 7.21796 5.51027 8.10876C6.43578 8.99956 7.69103 9.5 8.99989 9.5ZM7.23792 11.2812C3.44023 11.2812 0.363525 14.2426 0.363525 17.8979C0.363525 18.5064 0.87631 19 1.50861 19H16.4912C17.1235 19 17.6363 18.5064 17.6363 17.8979C17.6363 14.2426 14.5595 11.2812 10.7619 11.2812H7.23792Z' fill='url(#paint0_linear_2047_1550)' ></path><defs><linearGradient id='paint0_linear_2047_1550' x1='17.6363' y1='0' x2='-3.69767' y2='11.3996' gradientUnits='userSpaceOnUse' ><stop offset='0' stop-color='#8F993E'></stop><stop offset='1' stop-color='#279989'></stop></linearGradient></defs></svg></span><span class="su-text-12 su-hidden md:su-block su-text-digital-red dark:su-text-palo-verde" id="toggle-preferences-faculty" >Faculty/Staff</span></span><span class="icon-student su-hidden" data-audience="student"><span class="su-relative su-size-32 su-block su-mx-auto"><svg class='dark:su-hidden su-absolute su-top-1/2 su-left-1/2 -su-translate-x-1/2 -su-translate-y-1/2' xmlns='http://www.w3.org/2000/svg' width='18' height='19' viewBox='0 0 18 19' fill='none' ><path d='M8.82864 0.0167009C8.94217 -0.00556695 9.05937 -0.00556695 9.1729 0.0167009L16.4977 1.50122C16.9078 1.58287 17.2045 1.95029 17.2045 2.37338C17.2045 2.79646 16.9078 3.16388 16.4977 3.24553L13.6886 3.81707V5.93622C13.6886 8.56011 11.5901 10.6867 9.00077 10.6867C6.41147 10.6867 4.31292 8.56011 4.31292 5.93622V3.81707L2.55498 3.46079V5.87684L3.12998 8.7865C3.16294 8.96093 3.11899 9.14279 3.00912 9.28011C2.89925 9.41742 2.73078 9.49907 2.55498 9.49907H1.38302C1.20723 9.49907 1.04242 9.42113 0.928886 9.28011C0.815352 9.13908 0.771404 8.96093 0.808028 8.7865L1.38302 5.87684V3.21213C1.0351 3.08966 0.79704 2.75564 0.79704 2.37338C0.79704 1.95029 1.09369 1.58287 1.50388 1.50122L8.82864 0.0167009ZM4.89524 12.1601C5.27979 12.0339 5.69364 12.1749 5.97198 12.4755L8.57227 15.2776C8.803 15.5262 9.19488 15.5262 9.42561 15.2776L12.0259 12.4755C12.3042 12.1749 12.7181 12.0339 13.1026 12.1601C15.4832 12.9357 17.2045 15.1922 17.2045 17.8606C17.2045 18.4916 16.6991 19 16.0802 19H1.92139C1.30245 19 0.79704 18.4878 0.79704 17.8606C0.79704 15.1922 2.51836 12.9357 4.89524 12.1601Z' fill='url(#paint0_linear_2047_30)' /><defs><linearGradient id='paint0_linear_2047_30' x1='17.2045' y1='0' x2='-3.51134' y2='10.5159' gradientUnits='userSpaceOnUse' ><stop offset='0' stop-color='#E50808' /><stop offset='1' stop-color='#820000' /></linearGradient></defs></svg> <svg class='su-hidden dark:su-block su-absolute su-top-1/2 su-left-1/2 -su-translate-x-1/2 -su-translate-y-1/2' xmlns='http://www.w3.org/2000/svg' width='18' height='19' viewBox='0 0 18 19' fill='none' ><path d='M8.82864 0.0167009C8.94217 -0.00556695 9.05937 -0.00556695 9.1729 0.0167009L16.4977 1.50122C16.9078 1.58287 17.2045 1.95029 17.2045 2.37338C17.2045 2.79646 16.9078 3.16388 16.4977 3.24553L13.6886 3.81707V5.93622C13.6886 8.56011 11.5901 10.6867 9.00077 10.6867C6.41147 10.6867 4.31292 8.56011 4.31292 5.93622V3.81707L2.55498 3.46079V5.87684L3.12998 8.7865C3.16294 8.96093 3.11899 9.14279 3.00912 9.28011C2.89925 9.41742 2.73078 9.49907 2.55498 9.49907H1.38302C1.20723 9.49907 1.04242 9.42113 0.928886 9.28011C0.815352 9.13908 0.771404 8.96093 0.808028 8.7865L1.38302 5.87684V3.21213C1.0351 3.08966 0.79704 2.75564 0.79704 2.37338C0.79704 1.95029 1.09369 1.58287 1.50388 1.50122L8.82864 0.0167009ZM4.89524 12.1601C5.27979 12.0339 5.69364 12.1749 5.97198 12.4755L8.57227 15.2776C8.803 15.5262 9.19488 15.5262 9.42561 15.2776L12.0259 12.4755C12.3042 12.1749 12.7181 12.0339 13.1026 12.1601C15.4832 12.9357 17.2045 15.1922 17.2045 17.8606C17.2045 18.4916 16.6991 19 16.0802 19H1.92139C1.30245 19 0.79704 18.4878 0.79704 17.8606C0.79704 15.1922 2.51836 12.9357 4.89524 12.1601Z' fill='url(#paint0_linear_2047_809)' ></path><defs><linearGradient id='paint0_linear_2047_809' x1='17.2045' y1='0' x2='-3.51134' y2='10.5159' gradientUnits='userSpaceOnUse' ><stop offset='0' stop-color='#8F993E'></stop><stop offset='1' stop-color='#279989'></stop></linearGradient></defs></svg></span><span class="su-text-12 su-hidden md:su-block su-text-digital-red dark:su-text-palo-verde" id="toggle-preferences-student" >Student</span></span></button><div id="preferences" aria-hidden="true" class="su-hidden report-header__preferences-tray su-shadow su-z-50 su-fixed su-right-0 su-top-0 su-size-full" ><div class="report-header__overlay su-bg-black su-opacity-25 su-size-full"></div><div class="report-header__preferences su-overflow-hidden su-h-screen su-bg-white dark:su-bg-black-true su-absolute su-top-0 su-right-0 su-w-full md:su-w-[398px] su-flex su-flex-wrap su-overflow-y-auto su-pb-32 md:su-pb-[64px] su-pt-[115px] md:su-pt-[167px] su-px-38"><div class="report-header__preference-content su-transition su-text-black dark:su-text-white"><div class="su-gap-27 su-flex su-flex-wrap"><h2 class="su-text-18 su-font-semibold su-mb-0 su-font-sans su-leading-[2.25rem]" id="tray-group-label" >Along with Stanford news and stories, show me:</h2><ul class="su-flex su-list-none su-pl-0 su-gap-18 su-w-full" aria-labelledby="tray-group-label" ><li class="su-mb-0 su-w-1/2"><span tabIndex="0" data-tp-to="close-prefs"></span><button type="button" id="preference-student" aria-pressed="false" class="report-header__pref-toggle hover:su-text-white su-w-full su-h-full aria-pressed:su-text-white group su-bg-white dark:aria-pressed:su-text-black-true dark:aria-pressed:su-bg-transparent dark:hover:su-bg-transparent aria-pressed:su-bg-transparent hover:su-bg-transparent dark:su-bg-black-true &[aria-pressed=“true”]:dark:su-bg-transparent before:su-rounded-inherit after:su-rounded-inherit before:su-bg-gradient-light-red after:su-transition-none su-transition before:su-transition after:su-bg-gradient-light-red dark:after:su-rotate-180 before:su-absolute before:-su-z-10 before:-su-m-2 after:su-absolute after:-su-z-10 before:su-top-0 before:su-bottom-0 before:su-right-0 before:su-left-0 after:su-top-0 after:su-bottom-0 after:su-right-0 after:su-left-0 su-relative su-bg-transparent su-text-center" data-location="student-info" data-click="student-persona" ><span class="icon-add su-block su-mx-auto su-relative su-w-44 su-h-44 su-text-digital-red dark:su-text-dark-mode-red"><svg class='su-absolute su-top-1/2 su-left-1/2 -su-translate-x-1/2 -su-translate-y-1/2 su-w-44 su-h-44 su-fill-none' xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44' fill='none'><path fill='transparent' d='M22 16.5V22M22 22V27.5M22 22H27.5M22 22H16.5M38.5 22C38.5 31.1127 31.1127 38.5 22 38.5C12.8873 38.5 5.5 31.1127 5.5 22C5.5 12.8873 12.8873 5.5 22 5.5C31.1127 5.5 38.5 12.8873 38.5 22Z' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' /></svg></span><span class="icon-remove su-block su-mx-auto su-relative su-w-44 su-h-44"><svg class='su-absolute su-top-1/2 su-left-1/2 -su-translate-x-1/2 -su-translate-y-1/2 su-w-44 su-h-44 su-fill-none' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'><path d='M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z' strokeWidth='1' strokeLinecap='round' strokeLinejoin='round' /></svg></span><span class="icon-detail su-block su-mb-6 su-mt-18 su-mx-auto su-relative su-w-[1.838rem] su-h-21"><svg class='su-absolute su-top-1/2 su-left-1/2 -su-translate-x-1/2 -su-translate-y-1/2' xmlns='http://www.w3.org/2000/svg' width='20' height='21' viewBox='0 0 20 21' fill='none'><path d='M9.80822 0.0184588C9.93538 -0.00615295 10.0666 -0.00615295 10.1938 0.0184588L18.3977 1.65924C18.8572 1.74949 19.1894 2.15558 19.1894 2.62321C19.1894 3.09083 18.8572 3.49692 18.3977 3.58717L15.2515 4.21887V6.56109C15.2515 9.46118 12.9011 11.8116 10.001 11.8116C7.10093 11.8116 4.7505 9.46118 4.7505 6.56109V4.21887L2.78156 3.82508V6.49546L3.42557 9.7114C3.46249 9.90419 3.41326 10.1052 3.2902 10.257C3.16714 10.4087 2.97845 10.499 2.78156 10.499H1.46893C1.27204 10.499 1.08745 10.4128 0.960288 10.257C0.833127 10.1011 0.783903 9.90419 0.824923 9.7114L1.46893 6.49546V3.55025C1.07924 3.41488 0.812617 3.04571 0.812617 2.62321C0.812617 2.15558 1.14488 1.74949 1.6043 1.65924L9.80822 0.0184588ZM5.40271 13.4401C5.83342 13.3006 6.29694 13.4565 6.60869 13.7887L9.52108 16.8857C9.77951 17.1606 10.2184 17.1606 10.4768 16.8857L13.3892 13.7887C13.701 13.4565 14.1645 13.3006 14.5952 13.4401C17.2615 14.2974 19.1894 16.7914 19.1894 19.7407C19.1894 20.438 18.6233 21 17.9301 21H2.07192C1.37869 21 0.812617 20.4339 0.812617 19.7407C0.812617 16.7914 2.74054 14.2974 5.40271 13.4401Z' /></svg></span><span class="su-block su-text-18 su-leading-[2.25rem] su-w-full">Student information</span></button></li><li class="su-mb-0 su-w-1/2"><button type="button" id="preference-faculty" aria-pressed="false" data-click="faculty-persona" class="report-header__pref-toggle hover:su-text-white su-w-full su-h-full aria-pressed:su-text-white group su-bg-white dark:aria-pressed:su-text-white dark:aria-pressed:su-bg-transparent dark:hover:su-bg-transparent aria-pressed:su-bg-transparent hover:su-bg-transparent dark:su-bg-black-true &[aria-pressed=“true”]:dark:su-bg-transparent before:su-rounded-inherit after:su-rounded-inherit before:su-bg-gradient-light-red after:su-transition-none su-transition before:su-transition after:su-bg-gradient-light-red dark:after:su-rotate-180 before:su-absolute before:-su-z-10 before:-su-m-2 after:su-absolute after:-su-z-10 before:su-top-0 before:su-bottom-0 before:su-right-0 before:su-left-0 after:su-top-0 after:su-bottom-0 after:su-right-0 after:su-left-0 su-relative su-bg-transparent su-text-center" ><span class="icon-add su-block su-mx-auto su-relative su-w-44 su-h-44 su-text-digital-red dark:su-text-dark-mode-red"><svg class='su-absolute su-top-1/2 su-left-1/2 -su-translate-x-1/2 -su-translate-y-1/2 su-w-44 su-h-44 su-fill-none' xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44' fill='none'><path fill='transparent' d='M22 16.5V22M22 22V27.5M22 22H27.5M22 22H16.5M38.5 22C38.5 31.1127 31.1127 38.5 22 38.5C12.8873 38.5 5.5 31.1127 5.5 22C5.5 12.8873 12.8873 5.5 22 5.5C31.1127 5.5 38.5 12.8873 38.5 22Z' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' /></svg></span><span class="icon-remove su-block su-mx-auto su-relative su-w-44 su-h-44"><svg class='su-absolute su-top-1/2 su-left-1/2 -su-translate-x-1/2 -su-translate-y-1/2 su-w-44 su-h-44 su-fill-none' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'><path d='M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z' strokeWidth='1' strokeLinecap='round' strokeLinejoin='round' /></svg></span><span class="icon-detail su-block su-mb-6 su-mt-18 su-mx-auto su-relative su-w-[1.838rem] su-h-21"><svg class='su-absolute su-top-1/2 su-left-1/2 -su-translate-x-1/2 -su-translate-y-1/2' xmlns='http://www.w3.org/2000/svg' width='20' height='21' viewBox='0 0 20 21' fill='none'><path d='M10 10.5C11.4145 10.5 12.7711 9.94688 13.7713 8.96231C14.7715 7.97774 15.3334 6.64239 15.3334 5.25C15.3334 3.85761 14.7715 2.52226 13.7713 1.53769C12.7711 0.553123 11.4145 0 10 0C8.58553 0 7.22898 0.553123 6.22879 1.53769C5.22859 2.52226 4.66669 3.85761 4.66669 5.25C4.66669 6.64239 5.22859 7.97774 6.22879 8.96231C7.22898 9.94688 8.58553 10.5 10 10.5ZM8.09586 12.4688C3.99169 12.4688 0.666687 15.7418 0.666687 19.7818C0.666687 20.4545 1.22085 21 1.90419 21H18.0959C18.7792 21 19.3334 20.4545 19.3334 19.7818C19.3334 15.7418 16.0084 12.4688 11.9042 12.4688H8.09586Z' /></svg></span><span class="su-block su-text-18 su-leading-[2.25rem] su-w-full">Faculty/Staff information</span></button></li></ul><div class="su-flex su-flex-wrap su-gap-9"><p class="su-mb-0 su-text-16 su-font-normal su-leading-[2rem]">We want to provide announcements, events, leadership messages and resources that are relevant to you. Your selection is stored in a browser cookie which you can remove at any time using “Clear all personalization” below.</p><button type="button" id="preference-reset" class="report-header__preferences-clear su-text-black-40 su-underline su-text-18 su-leading-[2.715rem] " aria-pressed="false" disabled="disabled" data-click="clear-preferences" >Clear all personalization</button></div></div><hr class="su-h-2 su-bg-black-10 dark:su-bg-black su-w-full su-border-none su-mt-38" /><form class="su-gap-27 su-flex su-flex-wrap su-pt-38 su-cursor-pointer"><fieldset class="su-border-none su-p-0 su-whitespace-nowrap" role="radiogroup" ><legend class="su-text-18 su-font-semibold su-mb-27 su-leading-[2.25rem] su-text-black dark:su-text-white su-border-none">Appearance preference:</legend><input class="su-opacity-0 su-absolute su-peer/light" type="radio" name="ui-theme" id="light-theme" /><label class="su-inline-block su-leading-2 su-relative su-pr-50 su-z-20 after:su-border-palo-verde peer-checked/light:after:su-border-digital-red peer-checked/light:su-text-digital-red su-text-black-50 peer-checked/light:su-z-10 before:su-w-42 before:su-h-15 su-bg-gradient-before before:su-bg-gradient-light-red-h peer-checked/light:before:su-rotate-180 before:su-rounded-[12px] before:su-absolute before:su-right-0 before:su-top-6 after:su-transition after:su-top-2 after:su-shadow-sm after:su-bg-white after:su-border-2 after:su-bg-digital-red after:su-rounded-full after:su-size-24 after:su-translate-x-0 after:su-absolute after:su-right-0 peer-checked/light:after:su-translate-x-[-2rem]" for="light-theme" data-theme="light-theme" aria-label="Light mode enabled" ><span class="su-inline-block su-align-middle su-mr-6 su-text-18 su-leading-[2.25rem]">Light</span><span aria-hidden="true" class="su-inline-block su-align-middle su-relative su-w-28 su-h-28 peer-checked/light:su-hidden" ><svg class='su-absolute su-top-1/2 su-left-1/2 -su-translate-x-1/2 -su-translate-y-1/2' xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none' ><path d='M14 2.80005C14.7732 2.80005 15.4 3.42685 15.4 4.20005V5.60005C15.4 6.37325 14.7732 7.00005 14 7.00005C13.2268 7.00005 12.6 6.37325 12.6 5.60005V4.20005C12.6 3.42685 13.2268 2.80005 14 2.80005Z' fill='url(#paint0_linear_1962_1882_a0)' ></path><path d='M19.6 14C19.6 17.0928 17.0928 19.6 14 19.6C10.9072 19.6 8.39999 17.0928 8.39999 14C8.39999 10.9073 10.9072 8.40005 14 8.40005C17.0928 8.40005 19.6 10.9073 19.6 14Z' fill='url(#paint1_linear_1962_1882_b0)' ></path><path d='M18.9498 20.9296L19.9398 21.9196C20.4865 22.4663 21.3729 22.4663 21.9197 21.9196C22.4664 21.3729 22.4664 20.4864 21.9197 19.9397L20.9297 18.9497C20.383 18.403 19.4965 18.403 18.9498 18.9497C18.4031 19.4965 18.4031 20.3829 18.9498 20.9296Z' fill='url(#paint2_linear_1962_1882_c0)' ></path><path d='M21.9195 6.08038C22.4663 6.62711 22.4663 7.51354 21.9195 8.06028L20.9296 9.05023C20.3828 9.59696 19.4964 9.59696 18.9497 9.05023C18.4029 8.50349 18.4029 7.61706 18.9497 7.07033L19.9396 6.08038C20.4864 5.53365 21.3728 5.53365 21.9195 6.08038Z' fill='url(#paint3_linear_1962_1882_d0)' ></path><path d='M23.8 15.4C24.5732 15.4 25.2 14.7732 25.2 14C25.2 13.2269 24.5732 12.6 23.8 12.6H22.4C21.6268 12.6 21 13.2269 21 14C21 14.7732 21.6268 15.4 22.4 15.4H23.8Z' fill='url(#paint4_linear_1962_1882_e0)' ></path><path d='M14 21C14.7732 21 15.4 21.6269 15.4 22.4001V23.8001C15.4 24.5732 14.7732 25.2001 14 25.2001C13.2268 25.2001 12.6 24.5732 12.6 23.8001V22.4001C12.6 21.6269 13.2268 21 14 21Z' fill='url(#paint5_linear_1962_1882_f0)' ></path><path d='M7.07042 9.05025C7.61716 9.59699 8.50359 9.59699 9.05032 9.05025C9.59706 8.50352 9.59706 7.61709 9.05032 7.07035L8.06037 6.0804C7.51364 5.53367 6.62721 5.53367 6.08047 6.0804C5.53374 6.62714 5.53374 7.51357 6.08047 8.0603L7.07042 9.05025Z' fill='url(#paint6_linear_1962_1882_g0)' ></path><path d='M9.05019 20.9296L8.06024 21.9196C7.51351 22.4663 6.62708 22.4663 6.08034 21.9196C5.53361 21.3728 5.53361 20.4864 6.08034 19.9397L7.07029 18.9497C7.61703 18.403 8.50346 18.403 9.05019 18.9497C9.59693 19.4965 9.59693 20.3829 9.05019 20.9296Z' fill='url(#paint7_linear_1962_1882_h0)' ></path><path d='M5.59999 15.4C6.37319 15.4 6.99999 14.7732 6.99999 14C6.99999 13.2269 6.37319 12.6 5.59999 12.6H4.19999C3.42679 12.6 2.79999 13.2269 2.79999 14C2.79999 14.7732 3.42679 15.4 4.19999 15.4H5.59999Z' fill='url(#paint8_linear_1962_1882_i0)' ></path><defs><linearGradient id='paint0_linear_1962_1882_a0' x1='2.79999' y1='2.80005' x2='25.2' y2='2.80005' gradientUnits='userSpaceOnUse' ><stop offset='0' stop-color='#EC0909'></stop><stop offset='1' stop-color='#820000'></stop></linearGradient><linearGradient id='paint1_linear_1962_1882_b0' x1='2.79999' y1='2.80005' x2='25.2' y2='2.80005' gradientUnits='userSpaceOnUse' ><stop offset='0' stop-color='#EC0909'></stop><stop offset='1' stop-color='#820000'></stop></linearGradient><linearGradient id='paint2_linear_1962_1882_c0' x1='2.79999' y1='2.80005' x2='25.2' y2='2.80005' gradientUnits='userSpaceOnUse' ><stop offset='0' stop-color='#EC0909'></stop><stop offset='1' stop-color='#820000'></stop></linearGradient><linearGradient id='paint3_linear_1962_1882_d0' x1='2.79999' y1='2.80005' x2='25.2' y2='2.80005' gradientUnits='userSpaceOnUse' ><stop offset='0' stop-color='#EC0909'></stop><stop offset='1' stop-color='#820000'></stop></linearGradient><linearGradient id='paint4_linear_1962_1882_e0' x1='2.79999' y1='2.80005' x2='25.2' y2='2.80005' gradientUnits='userSpaceOnUse' ><stop offset='0' stop-color='#EC0909'></stop><stop offset='1' stop-color='#820000'></stop></linearGradient><linearGradient id='paint5_linear_1962_1882_f0' x1='2.79999' y1='2.80005' x2='25.2' y2='2.80005' gradientUnits='userSpaceOnUse' ><stop offset='0' stop-color='#EC0909'></stop><stop offset='1' stop-color='#820000'></stop></linearGradient><linearGradient id='paint6_linear_1962_1882_g0' x1='2.79999' y1='2.80005' x2='25.2' y2='2.80005' gradientUnits='userSpaceOnUse' ><stop offset='0' stop-color='#EC0909'></stop><stop offset='1' stop-color='#820000'></stop></linearGradient><linearGradient id='paint7_linear_1962_1882_h0' x1='2.79999' y1='2.80005' x2='25.2' y2='2.80005' gradientUnits='userSpaceOnUse' ><stop offset='0' stop-color='#EC0909'></stop><stop offset='1' stop-color='#820000'></stop></linearGradient><linearGradient id='paint8_linear_1962_1882_i0' x1='2.79999' y1='2.80005' x2='25.2' y2='2.80005' gradientUnits='userSpaceOnUse' ><stop offset='0' stop-color='#EC0909'></stop><stop offset='1' stop-color='#820000'></stop></linearGradient></defs></svg></span><span aria-hidden="true" class="su-hidden su-align-middle su-relative su-w-28 su-h-28 peer-checked/light:su-inline-block" ><svg class='su-fill-transparent' xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none' ><path d='M14 3.5V4.66667M14 23.3333V24.5M24.5 14H23.3333M4.66667 14H3.5M21.4246 21.4246L20.5997 20.5997M7.40034 7.40034L6.57538 6.57538M21.4247 6.57544L20.5997 7.4004M7.4004 20.5997L6.57544 21.4247M18.6667 14C18.6667 16.5773 16.5773 18.6667 14 18.6667C11.4227 18.6667 9.33333 16.5773 9.33333 14C9.33333 11.4227 11.4227 9.33333 14 9.33333C16.5773 9.33333 18.6667 11.4227 18.6667 14Z' stroke='#767674' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' ></path></svg></span></label><input class="dark-theme su-opacity-0 su-absolute su-peer/dark" type="radio" name="ui-theme" id="dark-theme" /><label class="su-inline-block su-leading-2 su-relative su-align-middle su-z-20 peer-checked/dark:su-z-10 su-pl-50 su--ml-44 peer-checked/dark:su-text-digital-red dark:peer-checked/dark:su-text-palo-verde su-text-black-70" for="dark-theme" data-theme="dark-theme" aria-label="Dark mode enabled" ><span aria-hidden="true" class="su-inline-block su-align-middle su-relative su-w-28 su-h-28" data-role="su-darkmode-icon-nonactive" ><svg class='su-absolute su-fill-transparent su-stroke-current su-top-1/2 su-left-1/2 -su-translate-x-1/2 -su-translate-y-1/2' xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none' ><path d='M20.3542 15.3541C19.3176 15.7707 18.1856 15.9999 17 15.9999C12.0294 15.9999 8 11.9705 8 6.99994C8 5.81437 8.22924 4.68233 8.64581 3.64575C5.33648 4.97568 3 8.21495 3 11.9999C3 16.9705 7.02944 20.9999 12 20.9999C15.785 20.9999 19.0243 18.6635 20.3542 15.3541Z' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' ></path></svg></span><span class="su-hidden su-inline-block su-align-middle su-relative su-w-28 su-h-28" data-role="su-darkmode-icon-active" ><svg class='' width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' ><path d='M20.7515 15.9516C19.5464 16.4965 18.2086 16.7999 16.8 16.7999C11.4981 16.7999 7.20002 12.5019 7.20002 7.19992C7.20002 5.79116 7.50347 4.45327 8.04857 3.24805C4.71767 4.75435 2.40002 8.10636 2.40002 11.9997C2.40002 17.3016 6.69809 21.5997 12 21.5997C15.8932 21.5997 19.2451 19.2822 20.7515 15.9516Z' fill='url(#paint0_linear_3034_2174_a1)' ></path><defs><linearGradient id='paint0_linear_3034_2174_a1' x1='2.40002' y1='3.24805' x2='20.7515' y2='3.24805' gradientUnits='userSpaceOnUse' ><stop stop-color='#279989'></stop><stop offset='1' stop-color='#8F993E'></stop></linearGradient></defs></svg></span><span class="su-inline-block su-align-middle su-text-18 su-leading-[2.25rem]">Dark</span></label></fieldset></form></div><button type="button" class="report-header__preferences-close su-absolute su-right-38 su-top-43 md:su-top-72 su-w-32 su-flex su-flex-wrap su-gap-3 su-justify-center dark:hover:su-text-dark-mode-red hover:su-text-digital-red" aria-expanded="true" aria-controls="menu" aria-labelledby="close-preferences" data-location="close-prefs" ><span class="su-relative su-size-32"><svg class='su-fill-currentcolor' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none' class=''><path fill-rule='evenodd' clip-rule='evenodd' d='M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z' /></svg></span><span id="close-preferences" hidden="true">Close preferences</span><span class="su-text-12 su-block su-font-semibold" aria-hidden="true" >Close</span></button><span tabIndex="0" data-tp-to="student-info" /></div></div></div></div><nav aria-label='Secondary' class='report-header__nav su-hidden md:su-block su-w-full before:su-h-2 before:su-block before:su-w-full before:su-bg-black-10 before:su-mx-auto before:su-w-full dark:before:su-bg-black lg:before:su-max-w-[858px]'><ul data-role='header-main-nav' class='su-list-none su-pl-0 su-ml-0 su-flex su-justify-center su-gap-60 su-mb-0 su-opacity-1 su-transition' ><li class='su-mb-0'><a href='https://sug-web.matrix.squiz.cloud/devreport/university-news' data-menu="main-nav" data-id="134201" class='su-block su-pt-13 su-pb-9 su-border-b-4 su-no-underline su-text-black dark:su-text-white dark:hover:su-text-dark-mode-red dark:hover:su-border-dark-mode-red su-transition su-ease-in-out hover:su-border-digital-red hover:su-text-digital-red su-text-16 lg:su-text-18 su-leading-[21.5px] su-border-transparent' >University News</a></li><li class='su-mb-0'><a href='https://sug-web.matrix.squiz.cloud/devreport/research-and-scholarship' data-menu="main-nav" data-id="134200" class='su-block su-pt-13 su-pb-9 su-border-b-4 su-no-underline su-text-black dark:su-text-white dark:hover:su-text-dark-mode-red dark:hover:su-border-dark-mode-red su-transition su-ease-in-out hover:su-border-digital-red hover:su-text-digital-red su-text-16 lg:su-text-18 su-leading-[21.5px] su-border-transparent' >Research & Scholarship</a></li><li class='su-mb-0'><a href='https://sug-web.matrix.squiz.cloud/devreport/on-campus' data-menu="main-nav" data-id="134199" class='su-block su-pt-13 su-pb-9 su-border-b-4 su-no-underline su-text-black dark:su-text-white dark:hover:su-text-dark-mode-red dark:hover:su-border-dark-mode-red su-transition su-ease-in-out hover:su-border-digital-red hover:su-text-digital-red su-text-16 lg:su-text-18 su-leading-[21.5px] su-border-transparent' >On Campus</a></li><li class='su-mb-0'><a href='https://sug-web.matrix.squiz.cloud/devreport/student-experience' data-menu="main-nav" data-id="134198" class='su-block su-pt-13 su-pb-9 su-border-b-4 su-no-underline su-text-black dark:su-text-white dark:hover:su-text-dark-mode-red dark:hover:su-border-dark-mode-red su-transition su-ease-in-out hover:su-border-digital-red hover:su-text-digital-red su-text-16 lg:su-text-18 su-leading-[21.5px] su-border-transparent' >Student Experience</a></li></ul></nav></div></div></header><section data-subcomponent='header-cookie-consent-banner' id='cookie-consent-banner' aria-labelledby='cookie-label' class='su-fixed su-z-50 su-bottom-0 su-left-0 su-right-0 su-top-auto su-bg-white dark:su-bg-black-true'><div class='su-mx-auto su-component-container su-container-large su-container-px md:su-flex md:su-gap-45 su-my-20' ><div class='su-text-[14px] md:su-text-[16px] su-leading-[17.5px] md:su-leading-[20px] su-mb-20 md:su-mb-0' ><h2 id='cookie-label' class='sr-only'>Stanford Report cookie usage information</h2><p class='su-mb-0'>We want to provide stories, announcements, events, leadership messages and resources that are relevant to you. Your selection is stored in a browser cookie which you can remove at any time by visiting the "Show me..." menu at the top right of the page. For more, read our <a href="#">cookie policy</a>.</p></div><div class='su-text-[14px] md:su-text-[16px] su-flex su-items-center su-justify-center su-gap-15' ><button type='button' id='accept-cdp-cookie' class='su-text-white su-shadow-[0px_3px_6px_0px_rgba(0,0,0,0.1)] su-transition su-border su-border-digital-green-dark su-bg-digital-green-dark hocus:su-bg-digital-green-bright hocus:su-border-digital-green-bright su-py-10 md:su-py-15 su-px-30 su-leading-[20px]' data-click='accept-consent' >Accept</button><button type='button' id='reject-cdp-cookie' class='su-transition su-border su-border-digital-red su-bg-transparent su-text-digital-red hocus:su-text-white hocus:su-border-digital-red hocus:su-bg-digital-red su-py-10 md:su-py-15 su-px-30 su-leading-[20px] dark:su-text-dark-mode-red dark:su-border-dark-mode-red dark:hocus:su-bg-dark-mode-red dark:hocus:su-text-white' data-click='reject-consent' >Decline</button></div></div></section>"`);
        });
    });

    describe('[Edge Cases]', () => {
        it('Should throw error when fetch for header data will fail', async () => {
            FetchAdapter.mockImplementation(() => ({
                fetch: vi.fn().mockRejectedValueOnce(new Error('Network Error'))
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Header component: Error parsing hero data JSON response: Network Error -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will not return object', async () => {
            FetchAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                fetch: vi.fn().mockResolvedValueOnce('test')
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Header component: Error parsing hero data JSON response: Invalid API response: siteData is missing or not an object. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle site being undefined in siteData', async () => {
            FetchAdapter.mockImplementation(() => ({
                fetch: vi.fn().mockResolvedValueOnce({ navigation: {}, search: {} })
            }));
        
            const result = await main({ dataUrl: 'https://example.com/json' }, defaultMockInfo);
        
            expect(result).toContain(' Error occurred in the Header component: The "site" must be an object.');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will return site.url that is not a string', async () => {
            FetchAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                fetch: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    site: {
                        ...mockedFetch.site,
                        url: 123
                    }
                })
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Header component: The "url" must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will return site.logo that is not an object', async () => {
            FetchAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                fetch: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    site: {
                        ...mockedFetch.site,
                        logo: 'test'
                    }
                })
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Header component: The "logo" must be an object. The "test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will return logoLight that is not an object', async () => {
            FetchAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                fetch: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    site: {
                        ...mockedFetch.site,
                        logoLight: 'test'
                    }
                })
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Header component: The "logoLight" must be an object. The "test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will return logoTopBar that is not an object', async () => {
            FetchAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                fetch: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    site: {
                        ...mockedFetch.site,
                        logoTopBar: 'test'
                    }
                })
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Header component: The "logoTopBar" must be an object. The "test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will return cookieStatement that is not a string', async () => {
            FetchAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                fetch: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    site: {
                        ...mockedFetch.site,
                        cookieStatement: 123
                    }
                })
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Header component: The "cookieStatement" must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will return navigation that is not an object', async () => {
            FetchAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                fetch: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    navigation: 123
                })
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Header component: The "navigation" must be an object. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });    

        it('Should throw error when fetch for header data will return search that is not an object', async () => {
            FetchAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                fetch: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    search: 123
                })
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Header component: The "search" must be an object. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });    
    });
});