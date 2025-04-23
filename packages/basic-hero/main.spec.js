import { beforeEach, describe, expect, it, vi } from 'vitest';
import { basicHeroDataAdapter } from '../../global/js/utils';

import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

const mockedFetch = {
    title: 'Test hero',
    titleAlignment: "left",
    summary: "Test summary", 
    updatesPage: "no", 
    backgroundColor: "cardinal", 
    relation: "parent", 
    parentData: {
        parentTitle: "Test parent title",
        parentUrl: "https://example.com",
        parentSummary: "Test parent summary"
    }
}

vi.mock('../../global/js/utils', () => ({
    matrixBasicHeroService: vi.fn(),
    basicHeroDataAdapter: vi.fn().mockImplementation(() => ({
        setBasicHeroService: vi.fn(),
        getBasicHeroData: vi.fn().mockResolvedValue(mockedFetch),
    }))
}));


describe('[Basic Hero]', () => {
    const defaultMockData = {};

    const defaultMockInfo = {
        env: {
            BASE_DOMAIN: 'https://example.com/json',
        },
        fns: {
            assetId: '63492'
        }
    };
    
    beforeEach(() => {
        vi.clearAllMocks();
    });
    
    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters were provided', async () => {
            const result = await main();
            
            expect(result).toContain('<!-- Error occurred in the Basic Hero component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Basic Hero component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Basic Hero component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw error when fns or ctx is invalid', async () => {
            const mockInfo = { 
                env: defaultMockInfo.env,
                fns: undefined, 
                ctx: undefined,
            };
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Basic Hero component: The "info.fns.assetId" must be a non-empty string. The undefined was received. -->');
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

            expect(result).toBe('<!-- Error occurred in the Basic Hero component: The "info.fns.assetId" must be a non-empty string. The "" was received. -->');
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

            expect(result).toBe('<!-- Error occurred in the Basic Hero component: The "info.fns.assetId" must be a non-empty string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        it('Should return the expected HTML with valid data', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='basic-hero'><div class='su-mx-auto su-component-container su-container-large su-container-px'><div class='su-flex su-justify-between su-flex-wrap su-rs-mb-5'><h1 class='su-font-serif su-mb-0 ' >Test hero</h1></div></div></section>"`);
        });

        it('Should return the expected HTML without titleAlignment', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    title: 'Test hero',
                })
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='basic-hero'><div class='su-mx-auto su-component-container su-container-large su-container-px'><div class='su-flex su-justify-between su-flex-wrap su-rs-mb-5'><h1 class='su-font-serif su-mb-0 ' >Test hero</h1></div></div></section>"`);
        });

        it('Should return the expected HTML with parentData', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    updatesPage: "yes",
                    relation: "child",
                    parentData: {
                        parentSummary: "test summary"
                    }
                })
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='basic-hero'><div class="su-rs-py-3 su-bg-gradient-to-t su-from-cardinal-red-dark su-from-5% su-via-cardinal-red su-via-50% su-to-cardinal-red-dark su-to-95%  su-rs-mb-3"><div class='su-mx-auto su-component-container su-container-wide su-container-px su-grid su-grid-cols-6 su-grid-gap su-gap-y-0 md:su-grid-cols-12 su-text-white'><h1 class="su-font-serif su-drop-shadow-md su-mb-0 su-col-span-full lg:su-col-span-10 lg:su-col-start-2  su-type-3  "></h1><div class="su-col-span-full lg:su-col-span-10 lg:su-col-start-2 xl:su-col-span-8 xl:su-col-start-3 su-font-serif su-mb-0 su-rs-mt-2 su-text-18">test summary</div></div></div><div class='su-mx-auto su-component-container su-container-wide su-container-px su-grid su-grid-cols-6 su-grid-gap su-gap-y-0 md:su-grid-cols-12'><div class="su-col-span-full lg:su-col-span-10 lg:su-col-start-2 xl:su-col-span-8 xl:su-col-start-3"><nav aria-label="breadcrumb" class="su-rs-mb-3"><ul class="su-p-0 su-text-18 su-font-semibold"><li class="su-inline after:su-content-['>'] after:su-mx-6"><a href="" class="!su-text-black dark:!su-text-white"></a></li><li aria-current="page" class="su-inline su-text-cardinal-red dark:su-text-dark-mode-red">Test hero</li></ul></nav><h2>Test hero</h2><div class="su-text-[1.125em]" >test summary</div></div></div></section>"`);
        });
    });

    describe('[Edge Cases]', () => {
        it('Should throw error when fetch for header data will fail', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockRejectedValueOnce(new Error('Network Error'))
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Basic Hero component: Error parsing hero data JSON response: Network Error -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will not return object', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce('test')
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Basic Hero component: Error parsing hero data JSON response: Invalid API response: heroData is missing or not an object. -->');
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

            expect(result).toBe('<!-- Error occurred in the Basic Hero component: The "title" must be non-empty string. The undefined was received. -->');
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

            expect(result).toBe('<!-- Error occurred in the Basic Hero component: The "title" must be non-empty string. The "" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will return titleAlignment not one of ["center", "left"]', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    titleAlignment: "test"
                })
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Basic Hero component: The "titleAlignment" must be one of ["center", "left"]. The "test" was received. -->');
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

            expect(result).toBe('<!-- Error occurred in the Basic Hero component: The "summary" must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will return updatesPage that is not a string', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    updatesPage: 123
                })
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Basic Hero component: The "updatesPage" must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will return backgroundColor that is not a string', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    backgroundColor: 123
                })
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Basic Hero component: The "backgroundColor" must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will return relation that is not a string', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    relation: 123
                })
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Basic Hero component: The "relation" must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will return parentData that is not a string', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    ...mockedFetch,
                    parentData: 123
                })
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Basic Hero component: The "parentData" must be an object. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });
});
