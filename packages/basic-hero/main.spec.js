import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FetchAdapter } from '../../global/js/utils/fetchAdapter';

import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;


vi.mock('../../global/js/utils/fetchAdapter', () => ({
    FetchAdapter: vi.fn().mockImplementation(() => ({
        fetch: vi.fn().mockResolvedValue({
            title: 'Test hero',
            titleAlignment: "left"
        }),
        assets: vi.fn(),
        data: vi.fn(),
        request: vi.fn()
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
            FetchAdapter.mockImplementation(() => ({
                fetch: vi.fn().mockResolvedValueOnce({
                    title: 'Test hero',
                })
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='basic-hero'><div class='su-mx-auto su-component-container su-container-large su-container-px'><div class='su-flex su-justify-between su-flex-wrap su-rs-mb-5'><h1 class='su-font-serif su-mb-0 ' >Test hero</h1></div></div></section>"`);
        });
    });

    describe('[Edge Cases]', () => {
        it('Should throw error when fetch for header data will fail', async () => {
            FetchAdapter.mockImplementation(() => ({
                fetch: vi.fn().mockRejectedValueOnce(new Error('Network Error'))
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Basic Hero component: Error parsing hero data JSON response: Network Error -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will not return object', async () => {
            FetchAdapter.mockImplementation(() => ({
                fetch: vi.fn().mockResolvedValueOnce('test')
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Basic Hero component: Error parsing hero data JSON response: Invalid API response: heroData is missing or not an object. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for header data will return data without title', async () => {
            FetchAdapter.mockImplementation(() => ({
                fetch: vi.fn().mockResolvedValueOnce({test: 'test'})
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Basic Hero component: Title cannot be empty -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });
});
