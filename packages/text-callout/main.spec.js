import { beforeEach, describe, expect, it, vi } from "vitest";
import { basicAssetUri } from "../../global/js/utils";
import moduleToTest from "./main";

const { main } = moduleToTest;

// Mock console.error
const mockedError = vi.fn();
console.error = mockedError;

// Mock dependencies
vi.mock("../../global/js/utils", () => ({
    basicAssetUri: vi.fn(),
    isRealExternalLink: vi.fn((url) => url.startsWith('http'))
}));

describe("[Text Callout]", () => {
    const mockFnsCtx = {
        resolveUri: vi.fn(),
    };

    const defaultMockData = {
        displayConfiguration: {
            title: "Test Title",
            content: "This is a test content.",
        },
        imageConfiguration: {
            image: "matrix-asset://api-identifier/99100",
            caption: "Test Caption",
            credit: "Test Credit",
            imagePlacement: "Below content",
        },
        buttonConfiguration: {
            buttonText: "Click here",
            internalUrl: "matrix-asset://api-identifier/67890",
            externalUrl: "https://google.com",
            isNewWindow: false,
        },
    };

    const defaultMockInfo = {
        fns: mockFnsCtx,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("[Error Handling]", () => {
        it("Should return an error when no parameters are provided", async () => {
            const result = await main();

            expect(result).toBe(
                '<!-- Error occurred in the Text callout component: The "info.fns" cannot be undefined or null. The {} was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should return an error when no info is provided", async () => {
            const result = await main(defaultMockData);

            expect(result).toBe(
                '<!-- Error occurred in the Text callout component: The "info.fns" cannot be undefined or null. The {} was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should return an error when info does not contain fns or ctx", async () => {
            const mockInfo = { test: "test" };
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe(
                '<!-- Error occurred in the Text callout component: The "info.fns" cannot be undefined or null. The {} was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should return an error when title is not a string", async () => {
            const mockData = {
                ...defaultMockData,
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    title: 123,
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe(
                '<!-- Error occurred in the Text callout component: The "title" field must be a string. The 123 was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should return an error when content is not a string", async () => {
            const mockData = {
                ...defaultMockData,
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    content: 123,
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe(
                '<!-- Error occurred in the Text callout component: The "content" field must be a string. The 123 was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should return an error when image is not a string", async () => {
            const mockData = {
                ...defaultMockData,
                imageConfiguration: {
                    ...defaultMockData.imageConfiguration,
                    image: 123,
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe(
                '<!-- Error occurred in the Text callout component: The "image" field must be a string. The 123 was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should return an error when caption is not a string", async () => {
            const mockData = {
                ...defaultMockData,
                imageConfiguration: {
                    ...defaultMockData.imageConfiguration,
                    caption: 123,
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Text callout component: The "caption" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should return an error when credit is not a string", async () => {
            const mockData = {
                ...defaultMockData,
                imageConfiguration: {
                    ...defaultMockData.imageConfiguration,
                    credit: 123,
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Text callout component: The "credit" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should return an error when imagePlacement is not a string", async () => {
            const mockData = {
                ...defaultMockData,
                imageConfiguration: {
                    ...defaultMockData.imageConfiguration,
                    imagePlacement: 123,
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Text callout component: The "imagePlacement" field must be one of ["Below content", "Above content"]. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should return an error when imagePlacement is not a one of ['Below content', 'Above content']", async () => {
            const mockData = {
                ...defaultMockData,
                imageConfiguration: {
                    ...defaultMockData.imageConfiguration,
                    imagePlacement: 'test',
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Text callout component: The "imagePlacement" field must be one of ["Below content", "Above content"]. The "test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should return an error when buttonText is not a string", async () => {
            const mockData = {
                ...defaultMockData,
                buttonConfiguration: {
                    ...defaultMockData.buttonConfiguration,
                    buttonText: 123,
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Text callout component: The "buttonText" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should return an error when internalUrl is not a string", async () => {
            const mockData = {
                ...defaultMockData,
                buttonConfiguration: {
                    ...defaultMockData.buttonConfiguration,
                    internalUrl: 123,
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Text callout component: The "internalUrl" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should return an error when externalUrl is not a string", async () => {
            const mockData = {
                ...defaultMockData,
                buttonConfiguration: {
                    ...defaultMockData.buttonConfiguration,
                    externalUrl: 123,
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Text callout component: The "externalUrl" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should return an error when isNewWindow is not a boolean", async () => {
            const mockData = {
                ...defaultMockData,
                buttonConfiguration: {
                    ...defaultMockData.buttonConfiguration,
                    isNewWindow: 123,
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Text callout component: The "isNewWindow" field must be a boolean. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    // General HTML elements rendering
    describe("[Main Function]", () => {
        beforeEach(() => {
            basicAssetUri.mockResolvedValueOnce({
                url: "https://google.com/image.jpg",
                attributes: { alt: "Alt Text" },
            });
        });

        it("Should return the expected HTML with valid data", async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component="text-callout"><div class="su-mx-auto su-component-container su-container-narrow su-container-px"><section class="su-flex su-flex-col su-p-20 md:su-p-36 su-bg-fog-light lg:su-mx-auto dark:su-bg-black [&>p]:su-m-0 [&>p]:!su-mb-0 [&>p]:su-text-16 md:[&>p]:!su-text-19 last-of-type:[&>p]:!su-mb-0"><div class="su-relative su-overflow-hidden su-mb-12"><h3 class="su-font-serif su-font-black su-inline !su-text-23 su-pr-10 su-m-0"> Test Title </h3><span class="su-w-full su-bg-black-20 su-h-px su-absolute su-bottom-4"></span></div>  <div class="su-flex su-flex-col su-gap-12 su-order-2"><div class="su-wysiwyg-content *:su-text-16 *:md:su-text-19 *:su-leading last-of-type:[&>p]:!su-mb-0"> This is a test content. </div></div>   <figure class='su-order-3 su-pt-20 md:su-pt-12 lg:su-pt-27 su-w-full'><img src='https://google.com/image.jpg' alt='Alt Text' class='su-w-full' />  <figcaption class='su-m-0 su-text-14 su-leading-[1.672rem] md:su-leading-[1.911rem] md:su-text-16 su-mt-8 md:su-mt-12' > Test Caption | Test Credit </figcaption> </figure>    <div class="su-order-3 su-rs-mt-1"> <a href="https://google.com" rel="noopener nofollow" class="su-group su-flex su-items-center su-w-fit hocus:su-underline md:su-px-30 md:su-pt-12 md:su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1 su-button dark:hocus:su-ring-white"> Click here  <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up" class="svg-inline--fa fa-arrow-up fa-fw su-inline-block su-shrink-0 su-text-white group-hocus:su-text-white su-text-[0.9em] su-ml-04em su-transition-transform su-rotate-45 group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20"><path fill="currentColor" d="M209.4 39.4C204.8 34.7 198.6 32 192 32s-12.8 2.7-17.4 7.4l-168 176c-9.2 9.6-8.8 24.8 .8 33.9s24.8 8.8 33.9-.8L168 115.9 168 456c0 13.3 10.7 24 24 24s24-10.7 24-24l0-340.1L342.6 248.6c9.2 9.6 24.3 9.9 33.9 .8s9.9-24.3 .8-33.9l-168-176z"></path></svg>   </a> </div>  </section></div></section>"`);
        });

        it("Should return expected HTML when no image is provided", async () => {
            const mockData = {
                ...defaultMockData,
                imageConfiguration: {},
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toContain('<section data-component="text-callout">');
            expect(result).toContain("Test Title");
            expect(result).toContain("This is a test content.");
            expect(result).not.toContain("<figure");
        });

        it("Should return expected HTML when button is missing", async () => {
            const mockData = {
                ...defaultMockData,
                buttonConfiguration: {},
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toContain('<section data-component="text-callout">');
            expect(result).toContain("Test Title");
            expect(result).toContain("This is a test content.");
            expect(result).not.toContain("Click here"); // Button shouldn't exist
        });

        it('Should render correctly when no image is provided', async () => {
            const mockData = {
                displayConfiguration: {
                    title: "Test Title",
                    content: "Some text content"
                },
                imageConfiguration: {},
                buttonConfiguration: {
                    buttonText: "Click Here",
                    externalUrl: "https://google.com",
                    isNewWindow: false
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toContain('<section data-component="text-callout">');
            expect(result).toContain('Test Title');
            expect(result).toContain('Some text content');
            expect(result).toContain('Click Here');
            expect(result).toContain('href="https://google.com"');
            expect(result).not.toContain('<img');
        });

        it("Should correctly render caption when only caption is provided", async () => {
            const mockData = {
                ...defaultMockData,
                imageConfiguration: {
                    ...defaultMockData.imageConfiguration,
                    image: "matrix-asset://api-identifier/99100",
                    caption: "Test Caption",
                    credit: undefined,
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toContain("<figure");
            expect(result).toContain("Test Caption");
        });

        it("Should correctly render credit when only credit is provided", async () => {
            const mockData = {
                ...defaultMockData,
                imageConfiguration: {
                    ...defaultMockData.imageConfiguration,
                    image: "matrix-asset://api-identifier/99100",
                    caption: undefined,
                    credit: "Test Credit",
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toContain("<figure");
            expect(result).toContain("Test Credit");
        });

    });

    describe("[Edge cases]", () => {
        it("Should correctly render alt when image data will return empty alt", async () => {
            basicAssetUri.mockResolvedValueOnce({
                url: "https://google.com/image.jpg",
            });
            const mockData = {
                ...defaultMockData,
                imageConfiguration: {
                    ...defaultMockData.imageConfiguration,
                    image: "matrix-asset://api-identifier/99100",
                    caption: undefined,
                    credit: "Test Credit",
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toContain("<img");
            expect(result).toContain("alt=''");
        });

        it('Should throw an error when fetch for image will fail', async () => {
            basicAssetUri.mockRejectedValueOnce(new Error('No image'))

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<!-- Error occurred in the Text callout component: Failed to fetch image data. No image -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fetch for image will fail', async () => {
            basicAssetUri.mockResolvedValueOnce({
                url: "https://google.com/image.jpg",
            });
            basicAssetUri.mockRejectedValueOnce(new Error('No link'))

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<!-- Error occurred in the Text callout component: Failed to fetch link data. No link -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });
});
