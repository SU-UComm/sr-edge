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
            image: "matrix-asset://stanfordNews/9848",
            imageCaption: "Flags with neighborhood crests fly at a Farm Games event.",
            imageCredit: "Sydney Osifeso",
            quote: "A Massachusetts court has blocked the National Institutes of Health cap on indirect costs, which university leaders say would sharply cut back U.S. biomedical research.",
            name: "Brian Smith",
            title: "Director"
        }
    };

    const defaultMockInfo = {
        fns: mockFnsCtx,
        ctx: {
            editor: false
        }
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("[Error Handling]", () => {
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
            expect(result).toContain("data-component='image-quote'");
            expect(result).toContain("https://google.com/image.jpg");
            expect(result).toContain("Alt Text");
            expect(result).toContain("Flags with neighborhood crests fly at a Farm Games event. | Sydney Osifeso");
            expect(result).toContain("Brian Smith");
            expect(result).toContain("Director");
        });

        it("Should return the expected HTML with portrait data", async () => {
            basicAssetUri.mockResolvedValueOnce({
                url: "https://google.com/image.jpg",
                attributes: { alt: "Alt Text", width: 300, height: 600 },
            });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain("data-component='image-quote'");
            expect(result).toContain("before:su-w-[18%] md:before:su-w-[42%]");
            expect(result).toContain("https://google.com/image.jpg");
            expect(result).toContain("Alt Text");
            expect(result).toContain("Flags with neighborhood crests fly at a Farm Games event.");
            expect(result).toContain("Brian Smith");
            expect(result).toContain("Director");
        });

        it("Should return the expected HTML with no alt", async () => {
            basicAssetUri.mockResolvedValueOnce({
                url: "https://google.com/image.jpg",
                attributes: { width: 300, height: 600 },
            });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain("data-component='image-quote'");expect(result).toContain("data-component='image-quote'");
            expect(result).toContain("https://google.com/image.jpg");
            expect(result).not.toContain("Alt Text");
            expect(result).toContain("alt=''");
            expect(result).toContain("Flags with neighborhood crests fly at a Farm Games event.");
            expect(result).toContain("Brian Smith");
            expect(result).toContain("Director");
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

            expect(result).toContain("data-component='image-quote'");
            expect(result).toContain("https://google.com/image.jpg");
            expect(result).toContain("Alt Text");
            expect(result).not.toContain("Sydney Osifeso");
            expect(result).toContain("Test Caption");
            expect(result).toContain("Brian Smith");
            expect(result).toContain("Director");

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

            expect(result).toContain("data-component='image-quote'");
            expect(result).toContain("https://google.com/image.jpg");
            expect(result).toContain("Alt Text");
            expect(result).not.toContain("Flags with neighborhood crests fly at a Farm Games event.");
            expect(result).toContain("Test credit");
            expect(result).toContain("Brian Smith");
            expect(result).toContain("Director");

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

            expect(result).toContain("data-component='image-quote'");
            expect(result).toContain("https://google.com/image.jpg");
            expect(result).toContain("Alt Text");
            expect(result).toContain("Flags with neighborhood crests fly at a Farm Games event. | Sydney Osifeso");
            expect(result).toContain("Brian Smith");
            expect(result).toContain("Director");
            expect(result).not.toContain("A Massachusetts court has blocked the National Institutes of Health cap on indirect costs, which university leaders say would sharply cut back U.S. biomedical research.");
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
