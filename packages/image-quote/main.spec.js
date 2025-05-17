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
}));

describe("[Image quote]", () => {
    const mockFnsCtx = {
        resolveUri: vi.fn(),
    };

    const defaultMockData = {
        displayConfiguration: {
            image: "matrix-asset://api-identifier/9848",
            imageCaption: "Flags with neighborhood crests fly at a Farm Games event.",
            imageCredit: "Sydney Osifeso",
            quote: "A Massachusetts court has blocked the National Institutes of Health cap on indirect costs, which university leaders say would sharply cut back U.S. biomedical research.",
            name: "Brian Smith",
            title: "Director"
        }
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

            expect(result).toBe('<!-- Error occurred in the Image quote component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should return an error when no info is provided", async () => {
            const result = await main(defaultMockData);

            expect(result).toBe(
                '<!-- Error occurred in the Image quote component: The "info.fns" cannot be undefined or null. The {} was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should return an error when info does not contain fns or ctx", async () => {
            const mockInfo = { test: "test" };
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe(
                '<!-- Error occurred in the Image quote component: The "info.fns" cannot be undefined or null. The {} was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should return an error when image is not defined", async () => {
            const mockData = {
                ...defaultMockData,
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    image: undefined,
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe(
                '<!-- Error occurred in the Image quote component: The "image" field must be a string. The undefined was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should return an error when image is not a string", async () => {
            const mockData = {
                ...defaultMockData,
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    image: 123,
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe(
                '<!-- Error occurred in the Image quote component: The "image" field must be a string. The 123 was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should return an error when imageCaption is not a string", async () => {
            const mockData = {
                ...defaultMockData,
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    imageCaption: 123,
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe(
                '<!-- Error occurred in the Image quote component: The "imageCaption" field must be a string. The 123 was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should return an error when imageCredit is not a string", async () => {
            const mockData = {
                ...defaultMockData,
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    imageCredit: 123,
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe(
                '<!-- Error occurred in the Image quote component: The "imageCredit" field must be a string. The 123 was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should return an error when quote is not a string", async () => {
            const mockData = {
                ...defaultMockData,
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    quote: 123,
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe(
                '<!-- Error occurred in the Image quote component: The "quote" field must be a string. The 123 was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it("Should return an error when name is not a string", async () => {
            const mockData = {
                ...defaultMockData,
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    name: 123,
                },
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe(
                '<!-- Error occurred in the Image quote component: The "name" field must be a string. The 123 was received. -->'
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
                '<!-- Error occurred in the Image quote component: The "title" field must be a string. The 123 was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    // General HTML elements rendering
    describe("[Main Function]", () => {
        beforeEach(() => {
            
        });

        it("Should return the expected HTML with valid data", async () => {
            basicAssetUri.mockResolvedValueOnce({
                url: "https://google.com/image.jpg",
                attributes: { alt: "Alt Text" },
            });
            
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='image-quote'><div class='su-mx-auto su-component-container su-container-large su-container-px'><section class='story__quote su-relative su-flex su-flex-wrap lg:su-flex-nowrap lg:su-items-start before:su-w-[18%] md:before:su-w-[26%] lg:before:su-w-[52%] dark:before:su-rotate-180 md:before:su-top-[20%] md:after:su-top-[20%] md:after:su-h-[80%] lg:after:su-h-[calc(100%-16rem)] before:su-absolute before:su-h-4 before:su-z-0 before:su-right-0 before:su-top-45 lg:before:su-top-72 su-bg-gradient-before-reverse after:su-absolute after:su-w-4 after:su-z-[-10] after:su-h-[calc(100%-4.5rem)] after:su-right-0 after:su-top-45 lg:after:su-top-72 su-bg-gradient-after-reverse'><figure class='su-flex su-flex-col su-gap-8 su-w-5/6 md:su-w-[75%] lg:su-w-[calc(50%-1.9rem)]'><img src='https://google.com/image.jpg' class='su-z-10 su-w-full su-h-auto su-object-center su-object-cover' alt='Alt Text'/><figcaption class='dark:su-text-white su-text-14 su-font-normal su-mt-8 md:su-text-16'>Flags with neighborhood crests fly at a Farm Games event. | Sydney Osifeso</figcaption></figure><figure class='su-ml-0 md:su-w-[83.32%]] su-pl-32 su-pr-45 md:su-pr-0 md:su-pl-50 md:su-mx-[8.33%] lg:su-mx-0 lg:su-pl-[17.7%] lg:su-mt-72 su-flex su-flex-col su-pt-49 lg:su-pt-90 su-gap-20 md:su-gap-26 lg:su-gap-27 lg:su-pr-72 su-relative lg:su-w-[62%] lg:su-ml-[-10%]'><blockquote class="story__quote-target su-relative su-pl-0 su-flex su-m-0 su-items-start su-gap-6 su-font-serif su-font-semibold su-text-black dark:su-text-white su-text-24 md:su-text-[3.6rem] su-leading-[1.5] lg:su-leading-[1.32] before:su-content-['“'] before:su-absolute before:su-right-full before:su--mt-30 md:before:su--mt-25 lg:before:su--mt-32 before:su-mr-6 md:before:su-mr-13 before:su-font-serif before:su-text-black dark:before:su-text-white before:su-text-[5.9rem] md:before:su-text-[7.3rem] lg:before:su-text-[9.3rem] before:su-leading-[1.85] md:before:su-leading-[1.6] lg:before:su-leading-[1.4]">A Massachusetts court has blocked the National Institutes of Health cap on indirect costs, which university leaders say would sharply cut back U.S. biomedical research.”</blockquote><figcaption class='su-relative su-text-black su-basefont-21 su-mt-0 su-flex su-flex-col dark:su-text-white su-text-16 md:su-text-21 su-font-normal lg:su-flex su-gap-5 md:su-gap-6'><strong>Brian Smith</strong> <span>Director</span></figcaption></figure></section></div></section>"`);
        });

        it("Should return the expected HTML with portrait data", async () => {
            basicAssetUri.mockResolvedValueOnce({
                url: "https://google.com/image.jpg",
                attributes: { alt: "Alt Text", width: 300, height: 600 },
            });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='image-quote'><div class='su-mx-auto su-component-container su-container-large su-container-px'><section class='story__quote su-relative su-flex su-flex-wrap lg:su-flex-nowrap lg:su-items-start before:su-w-[18%] md:before:su-w-[42%] lg:before:su-w-[62%] dark:before:su-rotate-180 md:before:su-top-[30%] md:after:su-top-[30%] md:after:su-h-[70%] lg:after:su-hidden before:su-absolute before:su-h-4 before:su-z-0 before:su-right-0 before:su-top-45 lg:before:su-top-72 su-bg-gradient-before-reverse after:su-absolute after:su-w-4 after:su-z-[-10] after:su-h-[calc(100%-4.5rem)] after:su-right-0 after:su-top-45 lg:after:su-top-72 su-bg-gradient-after-reverse'><figure class='su-flex su-flex-col su-gap-8 su-w-5/6 md:su-w-[58.33%] lg:su-mr-[2%] lg:su-w-[38%]'><img src='https://google.com/image.jpg' class='su-z-10 su-w-full su-h-auto su-object-center su-object-cover' alt='Alt Text'/><figcaption class='dark:su-text-white su-text-14 su-font-normal su-mt-8 md:su-text-16'>Flags with neighborhood crests fly at a Farm Games event. | Sydney Osifeso</figcaption></figure><figure class='su-ml-0 md:su-w-[83.32%]] su-pl-32 su-pr-45 md:su-pr-0 md:su-pl-50 md:su-mx-[8.33%] lg:su-mx-0 lg:su-pl-[17.7%] lg:su-mt-72 su-flex su-flex-col su-pt-49 lg:su-pt-90 su-gap-20 md:su-gap-26 lg:su-gap-27 lg:su-pr-72 su-relative lg:su-w-[70%] lg:su-ml-[-10%] after:su-hidden lg:after:su-block su-bg-gradient-after-reverse after:su-absolute after:su-w-4 after:su-z-[-10] after:su-h-[calc(100%-8.8rem)] after:su-right-0 after:su-top-0'><blockquote class="story__quote-target su-relative su-pl-0 su-flex su-m-0 su-items-start su-gap-6 su-font-serif su-font-semibold su-text-black dark:su-text-white su-text-24 md:su-text-[3.6rem] su-leading-[1.5] lg:su-leading-[1.32] before:su-content-['“'] before:su-absolute before:su-right-full before:su--mt-30 md:before:su--mt-25 lg:before:su--mt-32 before:su-mr-6 md:before:su-mr-13 before:su-font-serif before:su-text-black dark:before:su-text-white before:su-text-[5.9rem] md:before:su-text-[7.3rem] lg:before:su-text-[9.3rem] before:su-leading-[1.85] md:before:su-leading-[1.6] lg:before:su-leading-[1.4]">A Massachusetts court has blocked the National Institutes of Health cap on indirect costs, which university leaders say would sharply cut back U.S. biomedical research.”</blockquote><figcaption class='su-relative su-text-black su-basefont-21 su-mt-0 su-flex su-flex-col dark:su-text-white su-text-16 md:su-text-21 su-font-normal lg:su-flex su-gap-5 md:su-gap-6'><strong>Brian Smith</strong> <span>Director</span></figcaption></figure></section></div></section>"`);
        });

        it("Should return the expected HTML with no alt", async () => {
            basicAssetUri.mockResolvedValueOnce({
                url: "https://google.com/image.jpg",
                attributes: { width: 300, height: 600 },
            });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='image-quote'><div class='su-mx-auto su-component-container su-container-large su-container-px'><section class='story__quote su-relative su-flex su-flex-wrap lg:su-flex-nowrap lg:su-items-start before:su-w-[18%] md:before:su-w-[42%] lg:before:su-w-[62%] dark:before:su-rotate-180 md:before:su-top-[30%] md:after:su-top-[30%] md:after:su-h-[70%] lg:after:su-hidden before:su-absolute before:su-h-4 before:su-z-0 before:su-right-0 before:su-top-45 lg:before:su-top-72 su-bg-gradient-before-reverse after:su-absolute after:su-w-4 after:su-z-[-10] after:su-h-[calc(100%-4.5rem)] after:su-right-0 after:su-top-45 lg:after:su-top-72 su-bg-gradient-after-reverse'><figure class='su-flex su-flex-col su-gap-8 su-w-5/6 md:su-w-[58.33%] lg:su-mr-[2%] lg:su-w-[38%]'><img src='https://google.com/image.jpg' class='su-z-10 su-w-full su-h-auto su-object-center su-object-cover' alt=''/><figcaption class='dark:su-text-white su-text-14 su-font-normal su-mt-8 md:su-text-16'>Flags with neighborhood crests fly at a Farm Games event. | Sydney Osifeso</figcaption></figure><figure class='su-ml-0 md:su-w-[83.32%]] su-pl-32 su-pr-45 md:su-pr-0 md:su-pl-50 md:su-mx-[8.33%] lg:su-mx-0 lg:su-pl-[17.7%] lg:su-mt-72 su-flex su-flex-col su-pt-49 lg:su-pt-90 su-gap-20 md:su-gap-26 lg:su-gap-27 lg:su-pr-72 su-relative lg:su-w-[70%] lg:su-ml-[-10%] after:su-hidden lg:after:su-block su-bg-gradient-after-reverse after:su-absolute after:su-w-4 after:su-z-[-10] after:su-h-[calc(100%-8.8rem)] after:su-right-0 after:su-top-0'><blockquote class="story__quote-target su-relative su-pl-0 su-flex su-m-0 su-items-start su-gap-6 su-font-serif su-font-semibold su-text-black dark:su-text-white su-text-24 md:su-text-[3.6rem] su-leading-[1.5] lg:su-leading-[1.32] before:su-content-['“'] before:su-absolute before:su-right-full before:su--mt-30 md:before:su--mt-25 lg:before:su--mt-32 before:su-mr-6 md:before:su-mr-13 before:su-font-serif before:su-text-black dark:before:su-text-white before:su-text-[5.9rem] md:before:su-text-[7.3rem] lg:before:su-text-[9.3rem] before:su-leading-[1.85] md:before:su-leading-[1.6] lg:before:su-leading-[1.4]">A Massachusetts court has blocked the National Institutes of Health cap on indirect costs, which university leaders say would sharply cut back U.S. biomedical research.”</blockquote><figcaption class='su-relative su-text-black su-basefont-21 su-mt-0 su-flex su-flex-col dark:su-text-white su-text-16 md:su-text-21 su-font-normal lg:su-flex su-gap-5 md:su-gap-6'><strong>Brian Smith</strong> <span>Director</span></figcaption></figure></section></div></section>"`);
        });

        it("Should return the expected HTML with caption only", async () => {
            basicAssetUri.mockResolvedValueOnce({
                url: "https://google.com/image.jpg",
                attributes: { alt: "Alt Text", width: 300, height: 600 },
            });

            const mockData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    imageCaption: "Test Caption",
                    imageCredit: undefined,
                }
            }

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='image-quote'><div class='su-mx-auto su-component-container su-container-large su-container-px'><section class='story__quote su-relative su-flex su-flex-wrap lg:su-flex-nowrap lg:su-items-start before:su-w-[18%] md:before:su-w-[42%] lg:before:su-w-[62%] dark:before:su-rotate-180 md:before:su-top-[30%] md:after:su-top-[30%] md:after:su-h-[70%] lg:after:su-hidden before:su-absolute before:su-h-4 before:su-z-0 before:su-right-0 before:su-top-45 lg:before:su-top-72 su-bg-gradient-before-reverse after:su-absolute after:su-w-4 after:su-z-[-10] after:su-h-[calc(100%-4.5rem)] after:su-right-0 after:su-top-45 lg:after:su-top-72 su-bg-gradient-after-reverse'><figure class='su-flex su-flex-col su-gap-8 su-w-5/6 md:su-w-[58.33%] lg:su-mr-[2%] lg:su-w-[38%]'><img src='https://google.com/image.jpg' class='su-z-10 su-w-full su-h-auto su-object-center su-object-cover' alt='Alt Text'/><figcaption class='dark:su-text-white su-text-14 su-font-normal su-mt-8 md:su-text-16'>Test Caption</figcaption></figure><figure class='su-ml-0 md:su-w-[83.32%]] su-pl-32 su-pr-45 md:su-pr-0 md:su-pl-50 md:su-mx-[8.33%] lg:su-mx-0 lg:su-pl-[17.7%] lg:su-mt-72 su-flex su-flex-col su-pt-49 lg:su-pt-90 su-gap-20 md:su-gap-26 lg:su-gap-27 lg:su-pr-72 su-relative lg:su-w-[70%] lg:su-ml-[-10%] after:su-hidden lg:after:su-block su-bg-gradient-after-reverse after:su-absolute after:su-w-4 after:su-z-[-10] after:su-h-[calc(100%-8.8rem)] after:su-right-0 after:su-top-0'><blockquote class="story__quote-target su-relative su-pl-0 su-flex su-m-0 su-items-start su-gap-6 su-font-serif su-font-semibold su-text-black dark:su-text-white su-text-24 md:su-text-[3.6rem] su-leading-[1.5] lg:su-leading-[1.32] before:su-content-['“'] before:su-absolute before:su-right-full before:su--mt-30 md:before:su--mt-25 lg:before:su--mt-32 before:su-mr-6 md:before:su-mr-13 before:su-font-serif before:su-text-black dark:before:su-text-white before:su-text-[5.9rem] md:before:su-text-[7.3rem] lg:before:su-text-[9.3rem] before:su-leading-[1.85] md:before:su-leading-[1.6] lg:before:su-leading-[1.4]">A Massachusetts court has blocked the National Institutes of Health cap on indirect costs, which university leaders say would sharply cut back U.S. biomedical research.”</blockquote><figcaption class='su-relative su-text-black su-basefont-21 su-mt-0 su-flex su-flex-col dark:su-text-white su-text-16 md:su-text-21 su-font-normal lg:su-flex su-gap-5 md:su-gap-6'><strong>Brian Smith</strong> <span>Director</span></figcaption></figure></section></div></section>"`);
        });

        it("Should return the expected HTML with credit only", async () => {
            basicAssetUri.mockResolvedValueOnce({
                url: "https://google.com/image.jpg",
                attributes: { alt: "Alt Text", width: 300, height: 600 },
            });

            const mockData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    imageCaption: undefined,
                    imageCredit: "Test credit",
                }
            }

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='image-quote'><div class='su-mx-auto su-component-container su-container-large su-container-px'><section class='story__quote su-relative su-flex su-flex-wrap lg:su-flex-nowrap lg:su-items-start before:su-w-[18%] md:before:su-w-[42%] lg:before:su-w-[62%] dark:before:su-rotate-180 md:before:su-top-[30%] md:after:su-top-[30%] md:after:su-h-[70%] lg:after:su-hidden before:su-absolute before:su-h-4 before:su-z-0 before:su-right-0 before:su-top-45 lg:before:su-top-72 su-bg-gradient-before-reverse after:su-absolute after:su-w-4 after:su-z-[-10] after:su-h-[calc(100%-4.5rem)] after:su-right-0 after:su-top-45 lg:after:su-top-72 su-bg-gradient-after-reverse'><figure class='su-flex su-flex-col su-gap-8 su-w-5/6 md:su-w-[58.33%] lg:su-mr-[2%] lg:su-w-[38%]'><img src='https://google.com/image.jpg' class='su-z-10 su-w-full su-h-auto su-object-center su-object-cover' alt='Alt Text'/><figcaption class='dark:su-text-white su-text-14 su-font-normal su-mt-8 md:su-text-16'>Test credit</figcaption></figure><figure class='su-ml-0 md:su-w-[83.32%]] su-pl-32 su-pr-45 md:su-pr-0 md:su-pl-50 md:su-mx-[8.33%] lg:su-mx-0 lg:su-pl-[17.7%] lg:su-mt-72 su-flex su-flex-col su-pt-49 lg:su-pt-90 su-gap-20 md:su-gap-26 lg:su-gap-27 lg:su-pr-72 su-relative lg:su-w-[70%] lg:su-ml-[-10%] after:su-hidden lg:after:su-block su-bg-gradient-after-reverse after:su-absolute after:su-w-4 after:su-z-[-10] after:su-h-[calc(100%-8.8rem)] after:su-right-0 after:su-top-0'><blockquote class="story__quote-target su-relative su-pl-0 su-flex su-m-0 su-items-start su-gap-6 su-font-serif su-font-semibold su-text-black dark:su-text-white su-text-24 md:su-text-[3.6rem] su-leading-[1.5] lg:su-leading-[1.32] before:su-content-['“'] before:su-absolute before:su-right-full before:su--mt-30 md:before:su--mt-25 lg:before:su--mt-32 before:su-mr-6 md:before:su-mr-13 before:su-font-serif before:su-text-black dark:before:su-text-white before:su-text-[5.9rem] md:before:su-text-[7.3rem] lg:before:su-text-[9.3rem] before:su-leading-[1.85] md:before:su-leading-[1.6] lg:before:su-leading-[1.4]">A Massachusetts court has blocked the National Institutes of Health cap on indirect costs, which university leaders say would sharply cut back U.S. biomedical research.”</blockquote><figcaption class='su-relative su-text-black su-basefont-21 su-mt-0 su-flex su-flex-col dark:su-text-white su-text-16 md:su-text-21 su-font-normal lg:su-flex su-gap-5 md:su-gap-6'><strong>Brian Smith</strong> <span>Director</span></figcaption></figure></section></div></section>"`);
        });

        it("Should return the expected HTML with no quote", async () => {
            basicAssetUri.mockResolvedValueOnce({
                url: "https://google.com/image.jpg",
                attributes: { alt: "Alt Text" },
            });
            
            const mockData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    quote: "",
                }
            }

            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='image-quote'><div class='su-mx-auto su-component-container su-container-large su-container-px'><section class='story__quote su-relative su-flex su-flex-wrap lg:su-flex-nowrap lg:su-items-start before:su-w-[18%] md:before:su-w-[26%] lg:before:su-w-[52%] dark:before:su-rotate-180 md:before:su-top-[20%] md:after:su-top-[20%] md:after:su-h-[80%] lg:after:su-h-[calc(100%-16rem)] before:su-absolute before:su-h-4 before:su-z-0 before:su-right-0 before:su-top-45 lg:before:su-top-72 su-bg-gradient-before-reverse after:su-absolute after:su-w-4 after:su-z-[-10] after:su-h-[calc(100%-4.5rem)] after:su-right-0 after:su-top-45 lg:after:su-top-72 su-bg-gradient-after-reverse'><figure class='su-flex su-flex-col su-gap-8 su-w-5/6 md:su-w-[75%] lg:su-w-[calc(50%-1.9rem)]'><img src='https://google.com/image.jpg' class='su-z-10 su-w-full su-h-auto su-object-center su-object-cover' alt='Alt Text'/><figcaption class='dark:su-text-white su-text-14 su-font-normal su-mt-8 md:su-text-16'>Flags with neighborhood crests fly at a Farm Games event. | Sydney Osifeso</figcaption></figure><figure class='su-ml-0 md:su-w-[83.32%]] su-pl-32 su-pr-45 md:su-pr-0 md:su-pl-50 md:su-mx-[8.33%] lg:su-mx-0 lg:su-pl-[17.7%] lg:su-mt-72 su-flex su-flex-col su-pt-49 lg:su-pt-90 su-gap-20 md:su-gap-26 lg:su-gap-27 lg:su-pr-72 su-relative lg:su-w-[62%] lg:su-ml-[-10%]'><figcaption class='su-relative su-text-black su-basefont-21 su-mt-0 su-flex su-flex-col dark:su-text-white su-text-16 md:su-text-21 su-font-normal lg:su-flex su-gap-5 md:su-gap-6'><strong>Brian Smith</strong> <span>Director</span></figcaption></figure></section></div></section>"`);
        });

    });

    describe("[Edge cases]", () => {
        it("Should correctly render alt when image data will return empty alt", async () => {
            basicAssetUri.mockResolvedValueOnce({
                url: "https://google.com/image.jpg",
            });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Image quote component: Failed to fetch image data. data.attributes must be a non-null object -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fetch for image will fail', async () => {
            basicAssetUri.mockRejectedValueOnce(new Error('No image'))

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<!-- Error occurred in the Image quote component: Failed to fetch image data. No image -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fetch for image return data without url', async () => {
            basicAssetUri.mockResolvedValueOnce({
                test: "https://google.com/image.jpg",
            });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<!-- Error occurred in the Image quote component: Failed to fetch image data. data.url must be a non-empty string -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fetch for image return data that is not an object', async () => {
            basicAssetUri.mockResolvedValueOnce("https://google.com/image.jpg");

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<!-- Error occurred in the Image quote component: Failed to fetch image data. basicAssetUri did not return an object -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });
});
