import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sidebarNavDataAdapter } from '../../global/js/utils';

import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

const mockedParent = {
    id: "156984",
    root: "156984"
}

const mockedFetch = {
    asset_assetid: "156984",
    asset_url: "https://news.stanford.edu/squizdevreport/development/sidenav",
    asset_short_name: "Sidenav",
    menu: [
        {
            asset_assetid: "156985",
            asset_url: "https://news.stanford.edu/squizdevreport/development/sidenav/lvl-1-page-01",
            asset_short_name: "Lvl 1 page 01",
            asset_children: [
                {
                    asset_short_name: "Sub page",
                    asset_assetid: "156987",
                    asset_url: "https://news.stanford.edu/squizdevreport/development/sidenav/lvl-1-page-01/sub-page",
                },
                {
                    asset_short_name: "Sub page 02",
                    asset_assetid: "156988",
                    asset_url: "https://news.stanford.edu/squizdevreport/development/sidenav/lvl-1-page-01/sub-page-02",
                }
            ]
        },
        {
            asset_assetid: "156986",
            asset_url: "https://news.stanford.edu/squizdevreport/development/sidenav/lvl-1-page-02",
            asset_short_name: "Lvl 1 page 02",
            asset_children: null
        }
    ]
}

vi.mock('../../global/js/utils', () => ({
    matrixSidebarNavService: vi.fn(),
    sidebarNavDataAdapter: vi.fn().mockImplementation(() => ({
        setSidebarNavService: vi.fn(),
        getSidebarNavParentData: vi.fn().mockResolvedValue(mockedParent),
        getSidebarNavMenuData: vi.fn().mockResolvedValue(mockedFetch),
    }))
}));

describe('[Sidebar Navigation]', () => {
    const defaultMockData = {};

    const defaultMockInfo = {
        env: {
            BASE_DOMAIN: 'https://example.com/json',
        },
        ctx: {
            assetId: '156984'
        }
    };
    
    beforeEach(() => {
        vi.clearAllMocks();
    });
    
    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters were provided', async () => {
            const result = await main();
            
            expect(result).toContain('<!-- Error occurred in the Sidebar Navigation component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Sidebar Navigation component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Sidebar Navigation component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw error when fns or ctx is invalid', async () => {
            const mockInfo = { 
                env: defaultMockInfo.env,
                fns: undefined, 
                ctx: undefined,
            };
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Sidebar Navigation component: The "info.ctx.assetId" field cannot be undefined and must be a non-empty string. The undefined was received. -->');
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

            expect(result).toBe('<!-- Error occurred in the Sidebar Navigation component: The "info.ctx.assetId" field cannot be undefined and must be a non-empty string. The "" was received. -->');
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

            expect(result).toBe('<!-- Error occurred in the Sidebar Navigation component: The "info.ctx.assetId" field cannot be undefined and must be a non-empty string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        it('Should return the expected HTML with valid data', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='sidebar-navigation'><div class="lg:su-hidden su-rs-mb-2"><button aria-controls="sidebar-navigation" aria-label="Toggle visibility of section menu" aria-expanded="false" type="button" class="lg:su-hidden su-transition-all su-flex su-items-center su-w-full su-h-[5.6rem] su-p-15 su-text-left su-font-semibold su-shadow-[inset_0_0_0_2px_rgba(177,4,14,1)] su-text-digital-red hocus:su-shadow-[inset_0_0_0_3px_rgba(177,4,14,1)] dark:su-shadow-[inset_0_0_0_2px_rgba(236,9,9,1)] dark:su-text-dark-mode-red dark:hocus:su-shadow-[inset_0_0_0_3px_rgba(236,9,9,1)]" data-click="toggle-nav" ><span class="su-flex-auto su-leading-[0]" data-label="button" data-label-open="Section menu" data-label-close="Close">Section menu</span><svg aria-hidden="true" focusable="false" data-testid=svg-bras data-prefix="fas" data-icon="bars" class="svg-inline--fa fa-bars su-text-[3rem]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="24"><path fill="currentColor" d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"></path></svg> <svg aria-hidden="true" focusable="false" data-testid=svg-xmark data-prefix="fas" data-icon="xmark" class="svg-inline--fa fa-xmark su-text-[3rem] !su-hidden" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="24"><path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path></svg></button><nav id="sidebar-navigation" data-nav="nav" class="su-hidden" aria-label="Sidebar menu"><ul class="su-list-none su-p-0"><li class="su-m-0"><a class='su-block su-leading-display su-border-l-5 hocus:su-underline hocus:su-text-digital-red hocus:su-border-digital-red dark:hocus:su-text-dark-mode-red dark:hocus:su-border-dark-mode-red su-underline su-text-digital-red su-border-digital-red dark:su-text-dark-mode-red dark:su-border-dark-mode-red su-p-10' href='https://news.stanford.edu/squizdevreport/development/sidenav' aria-current='page'>Sidenav</a></li><li class="su-m-0"><a class='su-block su-leading-display su-border-l-5 hocus:su-underline hocus:su-text-digital-red hocus:su-border-digital-red dark:hocus:su-text-dark-mode-red dark:hocus:su-border-dark-mode-red su-no-underline su-border-white dark:su-border-black-true su-p-10' href='https://news.stanford.edu/squizdevreport/development/sidenav/lvl-1-page-01' aria-current=''>Lvl 1 page 01</a><ul class="su-list-none su-p-0"><li class="su-m-0"><a class='su-block su-leading-display su-border-l-5 hocus:su-underline hocus:su-text-digital-red hocus:su-border-digital-red dark:hocus:su-text-dark-mode-red dark:hocus:su-border-dark-mode-red su-no-underline su-border-white dark:su-border-black-true su-pl-25 su-pt-0 su-pb-10' href='https://news.stanford.edu/squizdevreport/development/sidenav/lvl-1-page-01/sub-page' aria-current=''>Sub page</a></li><li class="su-m-0"><a class='su-block su-leading-display su-border-l-5 hocus:su-underline hocus:su-text-digital-red hocus:su-border-digital-red dark:hocus:su-text-dark-mode-red dark:hocus:su-border-dark-mode-red su-no-underline su-border-white dark:su-border-black-true su-pl-25 su-pt-0 su-pb-10' href='https://news.stanford.edu/squizdevreport/development/sidenav/lvl-1-page-01/sub-page-02' aria-current=''>Sub page 02</a></li></ul></li><li class="su-m-0"><a class='su-block su-leading-display su-border-l-5 hocus:su-underline hocus:su-text-digital-red hocus:su-border-digital-red dark:hocus:su-text-dark-mode-red dark:hocus:su-border-dark-mode-red su-no-underline su-border-white dark:su-border-black-true su-p-10' href='https://news.stanford.edu/squizdevreport/development/sidenav/lvl-1-page-02' aria-current=''>Lvl 1 page 02</a></li></ul></nav></div><div class="su-hidden lg:su-block"><nav  aria-label="Sidebar menu"><ul class="su-list-none su-p-0"><li class="su-m-0"><a class='su-block su-leading-display su-border-l-5 hocus:su-underline hocus:su-text-digital-red hocus:su-border-digital-red dark:hocus:su-text-dark-mode-red dark:hocus:su-border-dark-mode-red su-underline su-text-digital-red su-border-digital-red dark:su-text-dark-mode-red dark:su-border-dark-mode-red su-p-10' href='https://news.stanford.edu/squizdevreport/development/sidenav' aria-current='page'>Sidenav</a></li><li class="su-m-0"><a class='su-block su-leading-display su-border-l-5 hocus:su-underline hocus:su-text-digital-red hocus:su-border-digital-red dark:hocus:su-text-dark-mode-red dark:hocus:su-border-dark-mode-red su-no-underline su-border-white dark:su-border-black-true su-p-10' href='https://news.stanford.edu/squizdevreport/development/sidenav/lvl-1-page-01' aria-current=''>Lvl 1 page 01</a><ul class="su-list-none su-p-0"><li class="su-m-0"><a class='su-block su-leading-display su-border-l-5 hocus:su-underline hocus:su-text-digital-red hocus:su-border-digital-red dark:hocus:su-text-dark-mode-red dark:hocus:su-border-dark-mode-red su-no-underline su-border-white dark:su-border-black-true su-pl-25 su-pt-0 su-pb-10' href='https://news.stanford.edu/squizdevreport/development/sidenav/lvl-1-page-01/sub-page' aria-current=''>Sub page</a></li><li class="su-m-0"><a class='su-block su-leading-display su-border-l-5 hocus:su-underline hocus:su-text-digital-red hocus:su-border-digital-red dark:hocus:su-text-dark-mode-red dark:hocus:su-border-dark-mode-red su-no-underline su-border-white dark:su-border-black-true su-pl-25 su-pt-0 su-pb-10' href='https://news.stanford.edu/squizdevreport/development/sidenav/lvl-1-page-01/sub-page-02' aria-current=''>Sub page 02</a></li></ul></li><li class="su-m-0"><a class='su-block su-leading-display su-border-l-5 hocus:su-underline hocus:su-text-digital-red hocus:su-border-digital-red dark:hocus:su-text-dark-mode-red dark:hocus:su-border-dark-mode-red su-no-underline su-border-white dark:su-border-black-true su-p-10' href='https://news.stanford.edu/squizdevreport/development/sidenav/lvl-1-page-02' aria-current=''>Lvl 1 page 02</a></li></ul></nav></div></section>"`);
        });
    });

    describe('[Edge Cases]', () => {
        it('Should throw error when fetch for parent data will fail', async () => {
            sidebarNavDataAdapter.mockImplementation(() => ({
                setSidebarNavService: vi.fn(),
                getSidebarNavParentData: vi.fn().mockRejectedValueOnce(new Error('Network Error')),
                getSidebarNavMenuData: vi.fn().mockResolvedValue(mockedFetch),
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Sidebar Navigation component: Error parsing parent data JSON response: Network Error -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for parent data will not return object', async () => {
            sidebarNavDataAdapter.mockImplementation(() => ({
                setSidebarNavService: vi.fn(),
                getSidebarNavParentData: vi.fn().mockResolvedValueOnce('test'),
                getSidebarNavMenuData: vi.fn().mockResolvedValue(mockedFetch),
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Sidebar Navigation component: Error parsing parent data JSON response: Invalid API response: "parentData" is missing or not an object. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for parent data will return data without id', async () => {
            sidebarNavDataAdapter.mockImplementation(() => ({
                setSidebarNavService: vi.fn(),
                getSidebarNavParentData: vi.fn().mockResolvedValueOnce({
                    ...mockedParent,
                    id: undefined
                }),
                getSidebarNavMenuData: vi.fn().mockResolvedValue(mockedFetch),
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Sidebar Navigation component: The "id" must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for parent data will return data without root', async () => {
            sidebarNavDataAdapter.mockImplementation(() => ({
                setSidebarNavService: vi.fn(),
                getSidebarNavParentData: vi.fn().mockResolvedValueOnce({
                    ...mockedParent,
                    root: undefined
                }),
                getSidebarNavMenuData: vi.fn().mockResolvedValue(mockedFetch),
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Sidebar Navigation component: The "root" must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw error when fetch for menu data will fail', async () => {
            sidebarNavDataAdapter.mockImplementation(() => ({
                setSidebarNavService: vi.fn(),
                getSidebarNavParentData: vi.fn().mockResolvedValue(mockedParent),
                getSidebarNavMenuData: vi.fn().mockRejectedValueOnce(new Error('Network Error')),
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Sidebar Navigation component: Error parsing menu data JSON response: Network Error -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for menu data will not return object', async () => {
            sidebarNavDataAdapter.mockImplementation(() => ({
                setSidebarNavService: vi.fn(),
                getSidebarNavParentData: vi.fn().mockResolvedValue(mockedParent),
                getSidebarNavMenuData: vi.fn().mockResolvedValueOnce('test'),
            }));
            const result = await main(defaultMockData, defaultMockInfo);
            
            expect(result).toBe('<!-- Error occurred in the Sidebar Navigation component: Error parsing menu data JSON response: Invalid API response: "menuData" is missing or not an object. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw error when fetch for menu data will return data without asset_assetid', async () => {
            sidebarNavDataAdapter.mockImplementation(() => ({
                setSidebarNavService: vi.fn(),
                getSidebarNavParentData: vi.fn().mockResolvedValue(mockedParent),
                getSidebarNavMenuData: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    asset_assetid: undefined
                }),
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Sidebar Navigation component: The "asset_assetid" must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for menu data will return data without asset_url', async () => {
            sidebarNavDataAdapter.mockImplementation(() => ({
                setSidebarNavService: vi.fn(),
                getSidebarNavParentData: vi.fn().mockResolvedValue(mockedParent),
                getSidebarNavMenuData: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    asset_url: undefined
                }),
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Sidebar Navigation component: The "asset_url" must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for menu data will return data without asset_short_name', async () => {
            sidebarNavDataAdapter.mockImplementation(() => ({
                setSidebarNavService: vi.fn(),
                getSidebarNavParentData: vi.fn().mockResolvedValue(mockedParent),
                getSidebarNavMenuData: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    asset_short_name: undefined
                }),
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Sidebar Navigation component: The "asset_short_name" must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for menu data will return data without menu', async () => {
            sidebarNavDataAdapter.mockImplementation(() => ({
                setSidebarNavService: vi.fn(),
                getSidebarNavParentData: vi.fn().mockResolvedValue(mockedParent),
                getSidebarNavMenuData: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    menu: 123
                }),
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Sidebar Navigation component: The "menu" must be an array. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
    });
});
