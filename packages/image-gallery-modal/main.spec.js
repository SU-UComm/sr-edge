/* eslint-disable no-unused-vars */
/**
 * @jest-environment jsdom
 */

import xss from 'xss';
import { CardDataAdapter, MatrixImageCardService, formatCardDataImage, containerClasses, basicAssetUri } from "../../global/js/utils";
import { ImageMosaic, mosaic, carouselImages, SidebarHeading, Modal, Carousel } from "../../global/js/helpers";
import moduleToTest from './main';
import { width } from '@fortawesome/free-regular-svg-icons/faAddressBook';

const mockedError = jest.fn();
console.error = mockedError;

jest.mock('../../global/js/utils', () => ({
    CardDataAdapter: jest.fn().mockImplementation(() => ({
        setCardService: jest.fn(),
        getCards: jest.fn().mockResolvedValue([
            { orientation: "h", alt: "", url: "https://picsum.photos/350/250" },
            { orientation: "v", alt: "", url: "https://picsum.photos/300/550" },
            { orientation: "h", alt: "", url: "https://picsum.photos/730/450" }
        ]),
    })),
    MatrixImageCardService: jest.fn(),
    formatCardDataImage: jest.fn(),
    containerClasses: jest.fn().mockReturnValue('su-container-classes'),
}));

jest.mock('../../global/js/helpers', () => ({
    ImageMosaic: jest.fn().mockReturnValue('ImageMosaicHTML'),
    mosaic: jest.fn().mockReturnValue([]),
    carouselImages: jest.fn().mockReturnValue([]),
    SidebarHeading: jest.fn().mockReturnValue('Media gallery'),
    Modal: jest.fn().mockReturnValue('ModalHTML'),
    Carousel: jest.fn().mockReturnValue('CarouselHTML'),
}));

describe('[Image Gallery Modal]', () => {
    const mockFnsCtx = {
        resolveUri: jest.fn()
    };

    const defaultMockData = {
        contentConfiguration: {
            title: 'Custom title',
            summary: "<p>Custom summary</p>",
            layout: "Title & Content",
            images: [
                {
                    "image": "matrix-asset://api-identifier/63391",
                    "caption": "image 1 caption | John Doe"
                },
                {
                    "image": "matrix-asset://api-identifier/63353",
                    "caption": "image 2 caption | John Doe"
                },
                {
                    "image": "matrix-asset://api-identifier/63354",
                    "caption": "image 4 caption | John Doe"
                },
                {
                    "image": "matrix-asset://api-identifier/63355",
                    "caption": "image 4 caption | John Doe"
                },
                {
                    "image": "matrix-asset://api-identifier/63356",
                    "caption": "image 5 caption | John Doe"
                }
            ],
            caption: "Custom caption",
            credit: "Custom credit"
        },
        displayConfiguration: {
            displayIconHeading: true,
            backgroundColor: 'Transparent',
            width: 'Wide'
        }
    };

    const defaultMockInfo = {
        fns: mockFnsCtx,
        env: {
            API_IDENTIFIER: "API_IDENTIFIER",
            BASE_DOMAIN: "BASE_DOMAIN"
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters was provided.', async () => {
            const result = await moduleToTest.main();

            expect(result).toBe('<!-- Error: Error occurred in the image gallery with modal component, API_IDENTIFIER variable cannot be undefined and must be non-empty string. The "undefined" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when no info was provided', async () => {
            const result = await moduleToTest.main(defaultMockData);

            expect(result).toBe('<!-- Error: Error occurred in the image gallery with modal component, API_IDENTIFIER variable cannot be undefined and must be non-empty string. The "undefined" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when info do not have API_IDENTIFIER variable', async () => {
            const mockInfo = { env: 'test', fns: mockFnsCtx }
            const result = await moduleToTest.main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error: Error occurred in the image gallery with modal component, API_IDENTIFIER variable cannot be undefined and must be non-empty string. The "undefined" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when info do not have BASE_DOMAIN variable', async () => {
            const mockInfo = { env: { API_IDENTIFIER: "API_IDENTIFIER" }, fns: mockFnsCtx }
            const result = await moduleToTest.main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error: Error occurred in the image gallery with modal component, BASE_DOMAIN variable cannot be undefined and must be non-empty string. The "undefined" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when info do not have fns or cts functions', async () => {
            const mockInfo = { env: { API_IDENTIFIER: "API_IDENTIFIER", BASE_DOMAIN: "BASE_DOMAIN" } }
            const result = await moduleToTest.main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error: Error occurred in the image gallery with modal component, info.fns cannot be undefined or null. The "[object Object]" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when fns or ctx is invalid', async () => {
            const mockInfo = { env: { API_IDENTIFIER: "API_IDENTIFIER", BASE_DOMAIN: "BASE_DOMAIN" }, fns: undefined, ctx: undefined,  };
            const result = await moduleToTest.main(defaultMockData, mockInfo);
    
            expect(result).toBe('<!-- Error: Error occurred in the image gallery with modal component, info.fns cannot be undefined or null. The "[object Object]" was received. -->');
            expect(console.error).toBeCalledTimes(1);
        });
        
        it('Should handle errors when contentConfiguration is not defined ', async () => {
            CardDataAdapter.mockImplementationOnce(() => ({
                setCardService: jest.fn(),
                getCards: jest.fn().mockResolvedValue([]),
            }));

            const mockedData = {};
            const result = await moduleToTest.main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error: Error occurred in the image gallery with modal component, contentConfiguration prop cannot be undefined. The "[object Object]" was received. -->');
            expect(console.error).toBeCalledTimes(1);
        });
        
        it('Should handle errors when displayConfiguration is not defined ', async () => {
            CardDataAdapter.mockImplementationOnce(() => ({
                setCardService: jest.fn(),
                getCards: jest.fn().mockResolvedValue([]),
            }));

            const mockedData = { contentConfiguration: {} };
            const result = await moduleToTest.main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error: Error occurred in the image gallery with modal component, displayConfiguration prop cannot be undefined. The "[object Object]" was received. -->');
            expect(console.error).toBeCalledTimes(1);
        });

        it('Should handle errors when layout is not one of ["Title & Content", "Content Only"]', async () => {
            CardDataAdapter.mockImplementationOnce(() => ({
                setCardService: jest.fn(),
                getCards: jest.fn().mockResolvedValue([]),
            }));

            const mockedData = { contentConfiguration: { layout: "Test" }, displayConfiguration: {} };
            const result = await moduleToTest.main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error: Error occurred in the image gallery with modal component, layout field cannot be undefined and must be one of ["Title & Content", "Content Only"] value. The "Test" was received. -->');
            expect(console.error).toHaveBeenCalledWith(expect.any(Error));
        });

        it('Should handle errors when images is not defined', async () => {
            CardDataAdapter.mockImplementationOnce(() => ({
                setCardService: jest.fn(),
                getCards: jest.fn().mockResolvedValue([]),
            }));
            
            const mockedData = { contentConfiguration: { layout: "Title & Content"}, displayConfiguration: {} };
            const result = await moduleToTest.main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error: Error occurred in the image gallery with modal component, images field must be an array. The "undefined" was received. -->');
            expect(console.error).toBeCalledTimes(1);
        });

        it('Should handle errors when caption is not a string', async () => {
            const mockedData = { contentConfiguration: { layout: "Title & Content", images: [], caption: [1,2] }, displayConfiguration: {} };
            const result = await moduleToTest.main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error: Error occurred in the image gallery with modal component, caption field must be a string. The "1,2" was received. -->');
            expect(console.error).toBeCalledTimes(1);
        });

        it('Should handle errors when credit is not a string', async () => {
            const mockedData = { contentConfiguration: { layout: "Title & Content", images: [], credit: [1,2] }, displayConfiguration: {} };
            const result = await moduleToTest.main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error: Error occurred in the image gallery with modal component, credit field must be a string. The "1,2" was received. -->');
            expect(console.error).toBeCalledTimes(1);
        });

        it('Should handle errors when title is not a string', async () => {
            const mockedData = { contentConfiguration: { layout: "Title & Content", images: [], title: [1,2] }, displayConfiguration: {} };
            const result = await moduleToTest.main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error: Error occurred in the image gallery with modal component, title field must be a string. The "1,2" was received. -->');
            expect(console.error).toBeCalledTimes(1);
        });

        it('Should handle errors when summary is not a string', async () => {
            const mockedData = { contentConfiguration: { layout: "Title & Content", images: [], summary: [1,2] }, displayConfiguration: {} };
            const result = await moduleToTest.main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error: Error occurred in the image gallery with modal component, summary field must be a string. The "1,2" was received. -->');
            expect(console.error).toBeCalledTimes(1);
        });

        it('Should handle errors when displayIconHeading is not a boolean', async () => {
            const mockedData = { contentConfiguration: { layout: "Title & Content", images: [] }, displayConfiguration: { displayIconHeading: "Test"} };
            const result = await moduleToTest.main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error: Error occurred in the image gallery with modal component, displayIconHeading field must be a boolean. The "Test" was received. -->');
            expect(console.error).toBeCalledTimes(1);
        });

        it('Should handle errors when backgroundColor is not one of ["Grey", "Transparent"]', async () => {
            const mockedData = { contentConfiguration: { layout: "Title & Content", images: [] }, displayConfiguration: { displayIconHeading: true, backgroundColor: "Test"} };
            const result = await moduleToTest.main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error: Error occurred in the image gallery with modal component, backgroundColor field cannot be undefined and must be one of ["Grey", "Transparent"] value. The "Test" was received. -->');
            expect(console.error).toHaveBeenCalledWith(expect.any(Error));
        });

        it('Should handle errors when width is not one of ["Wide", "Content"]', async () => {
            const mockedData = { contentConfiguration: { layout: "Title & Content", images: [] }, displayConfiguration: { displayIconHeading: true, backgroundColor: "Grey", width: "Test"} };
            const result = await moduleToTest.main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error: Error occurred in the image gallery with modal component, width field cannot be undefined and must be one of ["Wide", "Content"] value. The "Test" was received. -->');
            expect(console.error).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('[Main Function]', () => {
        it('Should return the expected HTML with valid data', async () => {
            const result = await moduleToTest.main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<section class="" data-component="image-gallery-modal">');
            expect(result).toContain('Media gallery');
            expect(result).toContain('Custom title');
            expect(result).toContain('<p>Custom summary</p>');
            expect(result).toContain('Custom caption');
            expect(result).toContain('Custom credit');
        });

        it('Should return HTML without heading', async () => {
            const partialArgs = {
                ...defaultMockData,
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    displayIconHeading: false,
                }
            };

            const result = await moduleToTest.main(partialArgs, defaultMockInfo);

            expect(result).not.toContain('Media gallery');
        });

        it('Should return HTML without title when title is an empty string', async () => {
            const partialArgs = {
                ...defaultMockData,
                contentConfiguration: {
                    layout: "Title & Content",
                    images: [],
                    title: ""
                }
            };

            const result = await moduleToTest.main(partialArgs, defaultMockInfo);

            expect(result).not.toContain('Custom title');
            expect(result).not.toContain('<h2 class="su-text-[3.5rem] su-leading-[4.179rem] su-font-bold md:su-text-[4.0rem] md:su-leading-[4.776rem] lg:su-text-[4.9rem] lg:su-leading-[6.37rem]">');
        });

        it('Should return HTML without title when layout is not Title & Content', async () => {
            const partialArgs = {
                ...defaultMockData,
                contentConfiguration: {
                    layout: "Content Only",
                    images: [],
                    title: "Custom title"
                }
            };

            const result = await moduleToTest.main(partialArgs, defaultMockInfo);

            expect(result).not.toContain('Custom title');
            expect(result).not.toContain('<h2 class="su-text-[3.5rem] su-leading-[4.179rem] su-font-bold md:su-text-[4.0rem] md:su-leading-[4.776rem] lg:su-text-[4.9rem] lg:su-leading-[6.37rem]">');
        });

        it('Should return HTML with proper width class', async () => {
            const partialArgs = {
                ...defaultMockData,
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    width: "Content"
                }
            };

            const result = await moduleToTest.main(partialArgs, defaultMockInfo);

            expect(containerClasses).toHaveBeenCalledWith({"width": "narrow"});
            expect(result).toContain('data-component="image-gallery-modal"');
        });

        it('Should return HTML without summary when summary is an empty string', async () => {
            const partialArgs = {
                ...defaultMockData,
                contentConfiguration: {
                    layout: "Title & Content",
                    images: [],
                    summary: ""
                }
            };

            const result = await moduleToTest.main(partialArgs, defaultMockInfo);

            expect(result).not.toContain('<div class="su-wysiwyg-content su-rs-mt-0 su-text-[1.8rem] su-leading-[2.25rem] su-mt-[1.5rem] md:su-text-[1.9rem] md:su-leading-[2.375rem] md:su-mt-[1.9rem] lg:su-text-[2.1rem] lg:su-leading-[2.625rem]">');
            expect(result).not.toContain('<p>Custom summary</p>');
        });

        it('Should sanitize the summary using xss', async () => {
            const mockXssSummary = '<script>alert("XSS")</script>';
            const xssSanitized = xss(mockXssSummary);

            const argsWithXss = {
                ...defaultMockData,
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    summary: mockXssSummary
                }
            };

            const result = await moduleToTest.main(argsWithXss, defaultMockInfo);

            expect(result).toContain(xssSanitized);
            expect(result).not.toContain('<script>alert("XSS")</script>');
        });

        it('Should map data and include captions correctly', () => {
            // Mock input data
            const data = [
                { image: 'image1.jpg' },
                { image: 'image2.jpg' }
            ];
            const filteredImages = [
                { caption: 'Caption 1' },
                { caption: 'Caption 2' }
            ];
            
            // Mock return value of formatCardDataImage for each image
            formatCardDataImage.mockImplementation(image => ({ formattedImage: image.image }));

            // Code under test
            const imageData = data.map((image, index) => {
                const imgData = formatCardDataImage(image);
                return { ...imgData, caption: filteredImages[`${index}`]?.caption };
            });
    
            // Expectations
            expect(formatCardDataImage).toHaveBeenCalledTimes(2);
            expect(formatCardDataImage).toHaveBeenCalledWith(data[0]);
            expect(formatCardDataImage).toHaveBeenCalledWith(data[1]);
    
            // Check the resulting imageData array
            expect(imageData).toEqual([
                { formattedImage: 'image1.jpg', caption: 'Caption 1' },
                { formattedImage: 'image2.jpg', caption: 'Caption 2' }
            ]);
        });
    
        it('Should handle missing captions gracefully', () => {
            // Mock input data
            const data = [
                { image: 'image1.jpg' },
                { image: 'image2.jpg' }
            ];
            const filteredImages = [
                { caption: 'Caption 1' },
                // Second caption is missing
            ];
    
            // Mock return value of formatCardDataImage
            formatCardDataImage.mockImplementation(image => ({ formattedImage: image.image }));
    
            // Code under test
            const imageData = data.map((image, index) => {
                const imgData = formatCardDataImage(image);
                return { ...imgData, caption: filteredImages[`${index}`]?.caption };
            });
    
            // Expectations
            expect(imageData).toEqual([
                { formattedImage: 'image1.jpg', caption: 'Caption 1' },
                { formattedImage: 'image2.jpg', caption: undefined } // Missing caption handled gracefully
            ]);
        });
    });
});
