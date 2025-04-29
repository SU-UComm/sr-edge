import { beforeEach, describe, expect, it, vi } from 'vitest';
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    isRealExternalLink: vi.fn(),
    basicAssetUri: vi.fn().mockResolvedValue({ url: 'https://example.com' })
}));


describe('[Multicolumn Info Section]', () => {
    const mockFnsCtx = { resolveUri: vi.fn() };
    
    const defaultMockData = {
        border: true,
        callout: true,
        colOne: {
            title: "Research"
        },
        colTwo: {
            infoText: "<p>Test info text</p>",
            addButton: true,
            buttonConfiguration: {
                buttonText: "Read more",
                infoInternalUrl: "matrix-asset://api-identifier/28192",
                isNewWindow: false
            }
        },
        colThree: {
            title: "More Info",
            content: "<p>Test content</p>",
            imageConfiguration: {
                image: "matrix-asset://api-identifier/99100",
                caption: "Test caption",
                credit: "Test credit",
                imagePlacement: "Below content"
            },
            buttonConfiguration: {
                buttonText: "Click me",
                internalUrl: "matrix-asset://api-identifier/28192",
                isNewWindow: false
            }
        }
    };

    const defaultMockInfo = {
        env: {
            API_IDENTIFIER: 'sample-api'
        },
        fns: mockFnsCtx
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters were provided', async () => {
            const result = await main();
            
            expect(result).toContain('<!-- Error occurred in the Multicolumn Info Section component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when API_IDENTIFIER was not provided', async () => {
            const mockInfo = {
                env: {},
                fns: mockFnsCtx
            }
            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Multicolumn Info Section component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when API_IDENTIFIER was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {}
                },
                fns: mockFnsCtx
            }
            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Multicolumn Info Section component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fns or ctx was not provided', async () => {
            const mockInfo = {
                env: {
                    API_IDENTIFIER: 'sample-api'
                }
            }
            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Multicolumn Info Section component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when border is not a boolean', async () => {
            const mockedData = {
                ...defaultMockData,
                border: 123,
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Multicolumn Info Section component: The "border" field must be a boolean. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when callout is not a boolean', async () => {
            const mockedData = {
                ...defaultMockData,
                callout: 123,
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Multicolumn Info Section component: The "callout" field must be a boolean. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when colOne is not an object', async () => {
            const mockedData = {
                ...defaultMockData,
                colOne: 123,
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Multicolumn Info Section component: The "colOne" must be an object. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when colTwo is not an object', async () => {
            const mockedData = {
                ...defaultMockData,
                colTwo: 123,
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Multicolumn Info Section component: The "colTwo" must be an object. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when colThree is not an object', async () => {
            const mockedData = {
                ...defaultMockData,
                callout: true,
                colThree: 123,
            };
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Multicolumn Info Section component: The "colThree" must be an object. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Component Rendering]', () => {
        it('Should render the component with all sections', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<div data-component="multicolumn-info-section"><div class="su-mx-auto su-component-container su-container-wide su-container-px"><div class="su-grid lg:su-grid-cols-12 su-grid-gap su-gap-y-0 su-max-w-800 su-mx-auto lg:su-max-w-none su-border-b su-rs-pb-5 su-border-b-black-30 dark:su-border-b-black"><h2 class="su-type-2 su-break-words su-col-span-full lg:su-col-span-8 xl:su-col-span-3">Research</h2><div class="su-col-span-full lg:su-col-span-8 xl:su-col-span-6 xl:last:[&amp;&gt;*]:su-mb-0"><p>Test info text</p>  <a href="https://example.com" class="su-group su-flex su-items-center su-w-fit hocus:su-underline su-px-30 su-pt-12 su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-button dark:hocus:su-ring-white su-rs-mt-1 su-order-3">Read more   </a> </div> <div class="su-mx-auto su-component-container su-container-full su-break-words su-col-span-full lg:su-col-span-4 lg:su-col-start-9 xl:su-col-span-3"><div class="su-flex su-flex-col su-justify-start su-items-start su-bg-fog-light lg:su-mx-auto dark:su-bg-black [&>p]:su-m-0 [&>p]:!su-mb-0 [&>p]:su-text-16 md:[&>p]:!su-text-19 last-of-type:[&>p]:!su-mb-0 su-p-20 md:su-p-36 lg:su-px-20 lg:su-py-26"><div class="su-relative su-justify-start su-items-center su-w-full su-gap-3 su-flex su-overflow-hidden su-rs-mb-0"><div><h3 class="su-font-serif su-text-21 md:su-text-23 su-inline su-pr-10 su-m-0">More Info</h3><span class="su-w-full su-bg-black-40 dark:su-bg-black-70 su-h-px su-absolute su-bottom-4" /></div></div><div class="su-order-1 su-flex su-flex-col su-gap-12"><div class="su-wysiwyg-content *:su-text-16 *:md:su-text-19 *:su-leading last:*:su-mb-0"><p>Test content</p></div></div><figure class=" su-order-2 su-pt-20 md:su-pt-12 lg:su-pt-27 su-w-full"><img src="https://example.com" alt="" class="su-w-full"/><figcaption class="su-m-0 su-text-14 su-leading-[1.672rem] md:su-leading-[1.911rem] md:su-text-16 su-mt-8 md:su-mt-12">Test caption | Test credit</figcaption></figure><a href="https://example.com" class="su-group su-flex su-items-center su-w-fit hocus:su-underline su-px-30 su-pt-12 su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-button dark:hocus:su-ring-white su-rs-mt-1 su-order-3">Click me   </a></div></div> </div></div></div>"`);
        });

        it('Should render proper link href for colTwo', async () => {
            const mockData = {
                ...defaultMockData,
                colTwo: {
                    ...defaultMockData.colTwo,
                    addButton: true,
                    buttonConfiguration: {
                        ...defaultMockData.colTwo.buttonConfiguration,
                        infoInternalUrl: undefined,
                        externalUrl: "https://squiz.net"
                    }
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toContain('href="https://squiz.net"');
        });

        it('Should render proper link href for colThree', async () => {
            const mockData = {
                ...defaultMockData,
                colThree: {
                    ...defaultMockData.colThree,
                    buttonConfiguration: {
                        ...defaultMockData.colThree.buttonConfiguration,
                        internalUrl: undefined,
                        externalUrl: "https://squiz.net"
                    }
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toContain('href="https://squiz.net"');
        });

        it('Should render without callout section when callout is false', async () => {
            const mockData = {
                ...defaultMockData,
                callout: false
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).not.toContain('<div class="info-box">Info Box</div>');
        });

        it('Should render without callout section when callout is false', async () => {
            const mockData = {
                ...defaultMockData,
                callout: true,
                colThree: {
                    ...defaultMockData.colThree,
                    title: undefined,
                    content: undefined
                }
            }

            const result = await main(mockData, defaultMockInfo);

            expect(result).not.toContain('<div class="info-box">Info Box</div>');
        });

        it('Should render without button when addButton is false', async () => {
            const mockData = {
                ...defaultMockData,
                colTwo: {
                    ...defaultMockData.colTwo,
                    addButton: false
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).not.toContain('<button>Link Button</button>');
        });

        it('Should include border classes when border is true', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('su-border-b su-rs-pb-5 su-border-b-black-30 dark:su-border-b-black');
        });

        it('Should not include border classes when border is false', async () => {
            const mockData = {
                ...defaultMockData,
                border: false
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).not.toContain('su-border-b su-rs-pb-5 su-border-b-black-30 dark:su-border-b-black');
        });
    });
});
