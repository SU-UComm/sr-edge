import { describe, expect, it, vi, beforeEach } from 'vitest';
import moduleToTest from './main';
import { basicAssetUri } from '../../global/js/utils';

const { main } = moduleToTest;

// Mock console.error
const mockedError = vi.fn();
console.error = mockedError;

// Mock dependencies
vi.mock("../../global/js/utils", () => ({
    basicAssetUri: vi.fn(),
    isRealExternalLink: vi.fn(),
}));

vi.mock('../../global/js/helpers', () => ({
    infoBox: vi.fn().mockReturnValue('<div class="info-box">Mocked Info Box</div>'),
    container: vi.fn().mockImplementation(({children}) => `<div class="container">${children}</div>`)
}));

describe('[Two Column Text Callout]', () => {
    const mockFnsCtx = { resolveUri: vi.fn() };
    
    const defaultMockData = {
        heading: 'Test Heading',
        showTopBorder: true,
        callouts: [
            {
                title: 'Callout 1',
                content: '<p>Test content 1</p>',
                imageConfiguration: {
                    image: 'matrix-asset://test/123',
                    caption: 'Test caption',
                    credit: 'Test credit'
                },
                buttonConfiguration: {
                    buttonText: 'Click me',
                    internalUrl: 'matrix-asset://test/456',
                    isNewWindow: true
                }
            }
        ]
    };

    const defaultMockInfo = {
        fns: mockFnsCtx
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });


    describe('[Error Handling]', () => {
        beforeEach(() => {
            basicAssetUri.mockResolvedValueOnce({
                url: "https://google.com/image.jpg",
                attributes: { alt: "Alt Text" },
            });
        })
        it('Should throw an error when fns or ctx was not provided', async () => {
            const mockInfo = {};
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Two Column Text Callout component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when heading is not a string', async () => {
            const mockData = {
                ...defaultMockData,
                heading: [1,2,3]
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Two Column Text Callout component: The "heading" field must be a string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle string boolean values for showTopBorder', async () => {
            const mockData = {
                ...defaultMockData,
                showTopBorder: 'true'
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('su-border-black-30');
            expect(mockedError).not.toBeCalled();
        });

        it('Should throw an error when callouts is not an array', async () => {
            const mockData = {
                ...defaultMockData,
                callouts: 'not an array'
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Two Column Text Callout component: The "callouts" field must be an array. The "not an array" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when callouts has more than 2 elements', async () => {
            const mockData = {
                ...defaultMockData,
                callouts: [{}, {}, {}]
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Two Column Text Callout component: The "callouts" array cannot have more than 2 elements. The 3 elements were received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when callouts has lest than 1 elements', async () => {
            const mockData = {
                callouts: []
            };
            
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the Two Column Text Callout component: The "callouts" array cannot have less than 1 element. The 0 elements were received. -->"`);
        });
    });

    describe('[Main Function]', () => {
        beforeEach(() => {
            basicAssetUri.mockResolvedValueOnce({
                url: "https://google.com/image.jpg",
                attributes: { alt: "Alt Text" },
            });
        })

        it('Should return the expected HTML with valid data', async () => {        
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='two-column-text-callout'><div class='su-mx-auto su-component-container su-container-wide su-container-px su-rs-mt-3 su-rs-mb-5' ><hr class='su-border-black-30 dark:su-border-black su-rs-mb-3 su-h-1' /><h2 class='su-type-2 su-font-serif su-text-center su-w-auto su-rs-mb-2 su-text-black dark:su-text-white' >Test Heading</h2><div class='su-mx-auto su-component-container su-container-large su-flex su-grid-gap su-flex-col md:su-max-w-800' ><div class="su-mx-auto su-component-container su-container-full su-flex"><div class="su-flex su-flex-col su-justify-start su-items-start su-bg-fog-light lg:su-mx-auto dark:su-bg-black [&>p]:su-m-0 [&>p]:!su-mb-0 [&>p]:su-text-16 md:[&>p]:!su-text-19 last-of-type:[&>p]:!su-mb-0 su-p-20 md:su-p-36 su-w-full"><div class="su-relative su-justify-start su-items-center su-w-full su-gap-3 su-flex su-overflow-hidden su-rs-mb-0"><div><h3 class="su-font-serif su-text-21 md:su-text-23 su-inline su-pr-10 su-m-0">Callout 1</h3><span class="su-w-full su-bg-black-40 dark:su-bg-black-70 su-h-px su-absolute su-bottom-4" /></div></div><div class="su-order-1 su-flex su-flex-col su-gap-12"><div class="su-wysiwyg-content *:su-text-16 *:md:su-text-19 *:su-leading last:*:su-mb-0"><p>Test content 1</p></div></div><figure class=" su-order-2 su-pt-20 md:su-pt-12 lg:su-pt-27 su-w-full"><img src="https://google.com/image.jpg" alt="Alt Text" class="su-w-full"/><figcaption class="su-m-0 su-text-14 su-leading-[1.672rem] md:su-leading-[1.911rem] md:su-text-16 su-mt-8 md:su-mt-12">Test caption | Test credit</figcaption></figure><a href="https://google.com/image.jpg" target="_blank" class="su-group su-flex su-items-center su-w-fit hocus:su-underline su-px-30 su-pt-12 su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-button dark:hocus:su-ring-white su-rs-mt-1 su-order-3">Click me   </a></div></div></div></div></section>"`);
        });


        it('Should return the expected HTML with empty callouts', async () => {
            const mockData = {
                heading: "Section heading",
                showTopBorder: true,
                callouts: [
                    {
                        imageConfiguration: {
                            imagePlacement: "Below content"
                        },
                        buttonConfiguration: {
                            isNewWindow: false
                        }
                    }
                ]
            }
            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='two-column-text-callout'><div class='su-mx-auto su-component-container su-container-wide su-container-px su-rs-mt-3 su-rs-mb-5' ><hr class='su-border-black-30 dark:su-border-black su-rs-mb-3 su-h-1' /><h2 class='su-type-2 su-font-serif su-text-center su-w-auto su-rs-mb-2 su-text-black dark:su-text-white' >Section heading</h2><div class='su-mx-auto su-component-container su-container-large su-flex su-grid-gap su-flex-col md:su-max-w-800' ></div></div></section>"`);
        });

        it('Should return the expected HTML with empty callouts with external button', async () => {
            const mockData = {
                heading: "Section heading",
                showTopBorder: true,
                callouts: [
                    {
                        imageConfiguration: {
                            imagePlacement: "Below content"
                        },
                        buttonConfiguration: {
                            isNewWindow: false,
                            buttonText: "Button",
                            externalUrl: "https://squiz.net"
                        }
                    }
                ]
            }
            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='two-column-text-callout'><div class='su-mx-auto su-component-container su-container-wide su-container-px su-rs-mt-3 su-rs-mb-5' ><hr class='su-border-black-30 dark:su-border-black su-rs-mb-3 su-h-1' /><h2 class='su-type-2 su-font-serif su-text-center su-w-auto su-rs-mb-2 su-text-black dark:su-text-white' >Section heading</h2><div class='su-mx-auto su-component-container su-container-large su-flex su-grid-gap su-flex-col md:su-max-w-800' ><div class="su-mx-auto su-component-container su-container-full su-flex"><div class="su-flex su-flex-col su-justify-start su-items-start su-bg-fog-light lg:su-mx-auto dark:su-bg-black [&>p]:su-m-0 [&>p]:!su-mb-0 [&>p]:su-text-16 md:[&>p]:!su-text-19 last-of-type:[&>p]:!su-mb-0 su-p-20 md:su-p-36 su-w-full"><a href="https://squiz.net" class="su-group su-flex su-items-center su-w-fit hocus:su-underline su-px-30 su-pt-12 su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-button dark:hocus:su-ring-white su-rs-mt-1 su-order-3">Button   </a></div></div></div></div></section>"`);
        });

        it('Should return the expected HTML with empty callouts with internal button', async () => {
            const mockData = {
                heading: "Section heading",
                showTopBorder: true,
                callouts: [
                    {
                        imageConfiguration: {
                            imagePlacement: "Below content"
                        },
                        buttonConfiguration: {
                            isNewWindow: false,
                            buttonText: "Button",
                            internalUrl: "matrix-asset://api-identifier/28192",
                        }
                    }
                ]
            }
            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='two-column-text-callout'><div class='su-mx-auto su-component-container su-container-wide su-container-px su-rs-mt-3 su-rs-mb-5' ><hr class='su-border-black-30 dark:su-border-black su-rs-mb-3 su-h-1' /><h2 class='su-type-2 su-font-serif su-text-center su-w-auto su-rs-mb-2 su-text-black dark:su-text-white' >Section heading</h2><div class='su-mx-auto su-component-container su-container-large su-flex su-grid-gap su-flex-col md:su-max-w-800' ><div class="su-mx-auto su-component-container su-container-full su-flex"><div class="su-flex su-flex-col su-justify-start su-items-start su-bg-fog-light lg:su-mx-auto dark:su-bg-black [&>p]:su-m-0 [&>p]:!su-mb-0 [&>p]:su-text-16 md:[&>p]:!su-text-19 last-of-type:[&>p]:!su-mb-0 su-p-20 md:su-p-36 su-w-full"><a href="https://google.com/image.jpg" class="su-group su-flex su-items-center su-w-fit hocus:su-underline su-px-30 su-pt-12 su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-button dark:hocus:su-ring-white su-rs-mt-1 su-order-3">Button   </a></div></div></div></div></section>"`);
        });


        it('Should render heading when provided', async () => {
            const result = await main(defaultMockData, defaultMockInfo);
            
            expect(result).toContain('Test Heading');
        });

        it('Should render top border when showTopBorder is true', async () => {
            const result = await main(defaultMockData, defaultMockInfo);
            
            expect(result).toContain('su-border-black-30');
        });

        it('Should not render top border when showTopBorder is false', async () => {
            const mockData = {
                ...defaultMockData,
                showTopBorder: false
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).not.toContain('su-border-black-30');
        });

        it('Should handle two callouts correctly', async () => {
            const mockData = {
                ...defaultMockData,
                callouts: [
                    ...defaultMockData.callouts,
                    {
                        title: 'Callout 2',
                        content: '<p>Test content 2</p>'
                    }
                ]
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toMatchInlineSnapshot(`"<section data-component='two-column-text-callout'><div class='su-mx-auto su-component-container su-container-wide su-container-px su-rs-mt-3 su-rs-mb-5' ><hr class='su-border-black-30 dark:su-border-black su-rs-mb-3 su-h-1' /><h2 class='su-type-2 su-font-serif su-text-center su-w-auto su-rs-mb-2 su-text-black dark:su-text-white' >Test Heading</h2><div class='su-mx-auto su-component-container su-container-large su-flex su-grid-gap su-flex-col md:su-max-w-800 lg:su-flex-row lg:su-items-stretch lg:*:su-basis-1/2 lg:su-max-w-[118.6rem] xl:su-px-50' ><div class="su-mx-auto su-component-container su-container-full su-flex"><div class="su-flex su-flex-col su-justify-start su-items-start su-bg-fog-light lg:su-mx-auto dark:su-bg-black [&>p]:su-m-0 [&>p]:!su-mb-0 [&>p]:su-text-16 md:[&>p]:!su-text-19 last-of-type:[&>p]:!su-mb-0 su-p-20 md:su-p-36 su-w-full"><div class="su-relative su-justify-start su-items-center su-w-full su-gap-3 su-flex su-overflow-hidden su-rs-mb-0"><div><h3 class="su-font-serif su-text-21 md:su-text-23 su-inline su-pr-10 su-m-0">Callout 1</h3><span class="su-w-full su-bg-black-40 dark:su-bg-black-70 su-h-px su-absolute su-bottom-4" /></div></div><div class="su-order-1 su-flex su-flex-col su-gap-12"><div class="su-wysiwyg-content *:su-text-16 *:md:su-text-19 *:su-leading last:*:su-mb-0"><p>Test content 1</p></div></div><figure class=" su-order-2 su-pt-20 md:su-pt-12 lg:su-pt-27 su-w-full"><img src="https://google.com/image.jpg" alt="Alt Text" class="su-w-full"/><figcaption class="su-m-0 su-text-14 su-leading-[1.672rem] md:su-leading-[1.911rem] md:su-text-16 su-mt-8 md:su-mt-12">Test caption | Test credit</figcaption></figure><a href="https://google.com/image.jpg" target="_blank" class="su-group su-flex su-items-center su-w-fit hocus:su-underline su-px-30 su-pt-12 su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-button dark:hocus:su-ring-white su-rs-mt-1 su-order-3">Click me   </a></div></div><div class="su-mx-auto su-component-container su-container-full su-flex"><div class="su-flex su-flex-col su-justify-start su-items-start su-bg-fog-light lg:su-mx-auto dark:su-bg-black [&>p]:su-m-0 [&>p]:!su-mb-0 [&>p]:su-text-16 md:[&>p]:!su-text-19 last-of-type:[&>p]:!su-mb-0 su-p-20 md:su-p-36 su-w-full"><div class="su-relative su-justify-start su-items-center su-w-full su-gap-3 su-flex su-overflow-hidden su-rs-mb-0"><div><h3 class="su-font-serif su-text-21 md:su-text-23 su-inline su-pr-10 su-m-0">Callout 2</h3><span class="su-w-full su-bg-black-40 dark:su-bg-black-70 su-h-px su-absolute su-bottom-4" /></div></div><div class=" su-flex su-flex-col su-gap-12"><div class="su-wysiwyg-content *:su-text-16 *:md:su-text-19 *:su-leading last:*:su-mb-0"><p>Test content 2</p></div></div></div></div></div></div></section>"`);

        });
    });
});
