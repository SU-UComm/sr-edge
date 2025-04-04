import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cardDataAdapter, formatCardDataImage } from "../../global/js/utils";
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    cardDataAdapter: vi.fn(() => ({
        setCardService: vi.fn(),
        getCards: vi.fn().mockResolvedValue([
            { orientation: "h", alt: "", url: "https://picsum.photos/350/250" },
            { orientation: "v", alt: "", url: "https://picsum.photos/300/550" },
            { orientation: "h", alt: "", url: "https://picsum.photos/730/450" },
            { orientation: "h", alt: "", url: "https://picsum.photos/730/450" }
        ]),
    })),
    matrixImageCardService: vi.fn(),
    formatCardDataImage: vi.fn(),
    uuid: vi.fn(() => '7f6b9262253c138ddbb3dff687a3ca13')
}));

vi.mock('../../global/js/helpers', () => ({
    ImageMosaic: vi.fn().mockReturnValue('ImageMosaicHTML'),
    mosaic: vi.fn().mockReturnValue([]),
    carouselImages: vi.fn().mockReturnValue([]),
    SidebarHeading: vi.fn().mockReturnValue('Media gallery'),
    Modal: vi.fn().mockReturnValue('ModalHTML'),
    Carousel: vi.fn().mockReturnValue('CarouselHTML'),
}));

describe('[Image Gallery Modal]', () => {
    const mockFnsCtx = {
        resolveUri: vi.fn()
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
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters was provided.', async () => {
            const result = await main();

            expect(result).toBe('<!-- Error occurred in the Image gallery with modal component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when no info was provided', async () => {
            const result = await main(defaultMockData);

            expect(result).toBe('<!-- Error occurred in the Image gallery with modal component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when info do not have API_IDENTIFIER variable', async () => {
            const mockInfo = { 
                ...defaultMockInfo,
                env: {
                    ...defaultMockInfo.env,
                    API_IDENTIFIER: undefined
                }
            }
            
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Image gallery with modal component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when info do not have API_IDENTIFIER variable within set object', async () => {
            const mockInfo = { 
                set: {
                    environment: {
                        ...defaultMockInfo.env,
                        API_IDENTIFIER: undefined
                    }
                }
            }
            
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Image gallery with modal component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when info do not have BASE_DOMAIN variable', async () => {
            const mockInfo = { 
                ...defaultMockInfo,
                env: {
                    ...defaultMockInfo.env,
                    BASE_DOMAIN: undefined
                }
            }

            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Image gallery with modal component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when info do not have BASE_DOMAIN variable within set object', async () => {
            const mockInfo = { 
                set: {
                    environment: {
                        ...defaultMockInfo.env,
                        BASE_DOMAIN: undefined
                    }
                }
            }

            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Image gallery with modal component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when info do not have fns or cts functions', async () => {
            const mockInfo = { 
                env: { 
                    API_IDENTIFIER: "API_IDENTIFIER", 
                    BASE_DOMAIN: "BASE_DOMAIN" 
                } 
            }
            
            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Image gallery with modal component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when fns or ctx is invalid', async () => {
            const mockInfo = { 
                env: { 
                    API_IDENTIFIER: "API_IDENTIFIER", 
                    BASE_DOMAIN: "BASE_DOMAIN" 
                }, 
                fns: undefined, 
                ctx: undefined,  
            };
            
            const result = await main(defaultMockData, mockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Image gallery with modal component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should handle errors when layout is not one of ["Title & Content", "Content Only"]', async () => {
            const mockedData = { 
                ...defaultMockData,
                contentConfiguration: { 
                    ...defaultMockData.contentConfiguration,
                    layout: "Test" 
                }, 
            };

            const result = await main(mockedData, defaultMockInfo);
            
            expect(result).toBe('<!-- Error occurred in the Image gallery with modal component: The "layout" field cannot be undefined and must be one of ["Title & Content", "Content Only"] value. The "Test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when images is not defined', async () => {
            const mockedData = {
                ...defaultMockData,
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    images: undefined
                }, 
            };
            
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Image gallery with modal component: The "images" field must be an array and cannot have less then 4 elements. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when images have less then 4 elements', async () => {
            const mockedData = {
                ...defaultMockData,
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    images: [
                        {"image": "1"},
                        {"image": "2"},
                    ]
                }, 
            };
            
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Image gallery with modal component: The "images" field must be an array and cannot have less then 4 elements. The [{"image":"1"},{"image":"2"}] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when caption is not a string', async () => {
            const mockedData = {
                ...defaultMockData,
                contentConfiguration: { 
                    ...defaultMockData.contentConfiguration,
                    layout: "Title & Content", 
                    caption: [1,2] 
                }
            };
            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Image gallery with modal component: The "caption" field must be a string. The [1,2] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when credit is not a string', async () => {
            const mockedData = {
                ...defaultMockData,
                contentConfiguration: { 
                    ...defaultMockData.contentConfiguration,
                    layout: "Title & Content", 
                    credit: [1,2]
                }
            };

            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Image gallery with modal component: The "credit" field must be a string. The [1,2] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when title is not a string', async () => {
            const mockedData = {
                ...defaultMockData,
                contentConfiguration: { 
                    ...defaultMockData.contentConfiguration,
                    layout: "Title & Content", 
                    title: [1,2]
                }
            };

            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Image gallery with modal component: The "title" field must be a string. The [1,2] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when summary is not a string', async () => {
            const mockedData = {
                ...defaultMockData,
                contentConfiguration: { 
                    ...defaultMockData.contentConfiguration,
                    layout: "Title & Content", 
                    summary: [1,2]
                }
            };

            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Image gallery with modal component: The "summary" field must be a string. The [1,2] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when displayIconHeading is not a boolean', async () => {
            const mockedData = {
                ...defaultMockData,
                displayConfiguration: { 
                    ...defaultMockData.displayConfiguration,
                    displayIconHeading: "Test"
                }
            };

            const result = await main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Image gallery with modal component: The "displayIconHeading" field must be a boolean. The "Test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when backgroundColor is not one of ["Grey", "Transparent"]', async () => {
            const mockedData = {
                ...defaultMockData,
                displayConfiguration: { 
                    ...defaultMockData.displayConfiguration,
                    backgroundColor: "Test"
                }
            };
            
            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Image gallery with modal component: The "backgroundColor" field cannot be undefined and must be one of ["Grey", "Transparent"] value. The "Test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when width is not one of ["Wide", "Content"]', async () => {
            const mockedData = {
                ...defaultMockData,
                displayConfiguration: { 
                    ...defaultMockData.displayConfiguration,
                    width: "Test"
                }
            };

            const result = await main(mockedData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Image gallery with modal component: The "width" field cannot be undefined and must be one of ["Wide", "Content"] value. The "Test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when imagesData have less then 4 elements', async () => {
            cardDataAdapter.mockReturnValueOnce({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValueOnce([
                    { orientation: "h", alt: "", url: "https://picsum.photos/350/250" },
                    { orientation: "v", alt: "", url: "https://picsum.photos/730/450" }
                ])
            });
            
            const result = await main(defaultMockData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error occurred in the Image gallery with modal component: The imageData cannot have less then 4 elements. The [{"orientation":"h","alt":"","url":"https://picsum.photos/350/250"},{"orientation":"v","alt":"","url":"https://picsum.photos/730/450"}] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {    
        it('Should return the expected HTML with valid data', async () => {
           
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='image-gallery-modal'><div class=''><div class='su-mx-auto su-component-container su-container-wide su-container-px'><div class='su-w-[100%] md:su-max-w-[60.7rem] lg:su-max-w-[63.6rem] su-mx-auto' ><div class='su-text-center [&>*]:su-justify-center [&>*]:su-rs-mb-0 su-flex su-flex-col su-gap-[2.1rem] md:su-gap-[2.5rem]' >Media gallery  <h2 class='su-text-[3.5rem] su-leading-[4.179rem] su-font-bold md:su-text-[4.0rem] md:su-leading-[4.776rem] lg:su-text-[4.9rem] lg:su-leading-[6.37rem]' >Custom title</h2> </div> <div class='su-text-left su-wysiwyg-content su-rs-mt-0 su-text-[1.8rem] su-leading-[2.25rem] su-mt-[1.5rem] md:su-text-[1.9rem] md:su-leading-[2.375rem] md:su-mt-[1.9rem] lg:su-text-[2.1rem] lg:su-leading-[2.625rem]' data-test='component-story-lead' >&lt;p&gt;Custom summary&lt;/p&gt;</div> </div><button data-click='open-gallery-modal' title='Open image gallery' aria-label='Open image gallery' class='su-grid su-grid-cols-2 su-mx-auto su-grid-rows-2 su-max-w-[1312px] su-gap-x-[0.691rem] su-gap-y-[0.572rem] su-mt-[3.2rem] su-pb-[1rem] md:su-mt-[4.8rem] md:su-gap-x-[1.448rem] md:su-gap-y-[1.199rem] lg:su-gap-x-[2.589rem] lg:su-gap-y-[2.143rem]' >ImageMosaicHTML</button><div class='su-text-[1.5rem] su-w-full su-text-center dark:su-text-white md:su-max-w-[482px] lg:su-max-w-[633px] su-mx-auto' ><p class='su-m-0 su-text-left'>Custom caption | Custom credit</p></div></div>ModalHTML</div></section>"`);
        });

        it('Should return the expected HTML when width is not set to "Wide"', async () => {
            const mockedData = {
                ...defaultMockData,
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    width: "Content"
                }
            }

            const result = await main(mockedData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='image-gallery-modal'><div class=''><div class='su-mx-auto su-component-container su-container-narrow su-container-px'><div class='su-w-[100%] md:su-max-w-[60.7rem] lg:su-max-w-[63.6rem] su-mx-auto' ><div class='su-text-center [&>*]:su-justify-center [&>*]:su-rs-mb-0 su-flex su-flex-col su-gap-[2.1rem] md:su-gap-[2.5rem]' >Media gallery  <h2 class='su-text-[3.5rem] su-leading-[4.179rem] su-font-bold md:su-text-[4.0rem] md:su-leading-[4.776rem] lg:su-text-[4.9rem] lg:su-leading-[6.37rem]' >Custom title</h2> </div> <div class='su-text-left su-wysiwyg-content su-rs-mt-0 su-text-[1.8rem] su-leading-[2.25rem] su-mt-[1.5rem] md:su-text-[1.9rem] md:su-leading-[2.375rem] md:su-mt-[1.9rem] lg:su-text-[2.1rem] lg:su-leading-[2.625rem]' data-test='component-story-lead' >&lt;p&gt;Custom summary&lt;/p&gt;</div> </div><button data-click='open-gallery-modal' title='Open image gallery' aria-label='Open image gallery' class='su-grid su-grid-cols-2 su-mx-auto su-grid-rows-2 su-max-w-[1312px] su-gap-x-[0.691rem] su-gap-y-[0.572rem] su-mt-[3.2rem] su-pb-[1rem] md:su-mt-[4.8rem] md:su-gap-x-[1.448rem] md:su-gap-y-[1.199rem] lg:su-gap-x-[2.589rem] lg:su-gap-y-[2.143rem]' >ImageMosaicHTML</button><div class='su-text-[1.5rem] su-w-full su-text-center dark:su-text-white md:su-max-w-[482px] lg:su-max-w-[633px] su-mx-auto' ><p class='su-m-0 su-text-left'>Custom caption | Custom credit</p></div></div>ModalHTML</div></section>"`);
        });

        it('Should return HTML without heading', async () => {
            const partialArgs = {
                ...defaultMockData,
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    displayIconHeading: false,
                }
            };

            const result = await main(partialArgs, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='image-gallery-modal'><div class=''><div class='su-mx-auto su-component-container su-container-wide su-container-px'><div class='su-w-[100%] md:su-max-w-[60.7rem] lg:su-max-w-[63.6rem] su-mx-auto' ><div class='su-text-center [&>*]:su-justify-center [&>*]:su-rs-mb-0 su-flex su-flex-col su-gap-[2.1rem] md:su-gap-[2.5rem]' >  <h2 class='su-text-[3.5rem] su-leading-[4.179rem] su-font-bold md:su-text-[4.0rem] md:su-leading-[4.776rem] lg:su-text-[4.9rem] lg:su-leading-[6.37rem]' >Custom title</h2> </div> <div class='su-text-left su-wysiwyg-content su-rs-mt-0 su-text-[1.8rem] su-leading-[2.25rem] su-mt-[1.5rem] md:su-text-[1.9rem] md:su-leading-[2.375rem] md:su-mt-[1.9rem] lg:su-text-[2.1rem] lg:su-leading-[2.625rem]' data-test='component-story-lead' >&lt;p&gt;Custom summary&lt;/p&gt;</div> </div><button data-click='open-gallery-modal' title='Open image gallery' aria-label='Open image gallery' class='su-grid su-grid-cols-2 su-mx-auto su-grid-rows-2 su-max-w-[1312px] su-gap-x-[0.691rem] su-gap-y-[0.572rem] su-mt-[3.2rem] su-pb-[1rem] md:su-mt-[4.8rem] md:su-gap-x-[1.448rem] md:su-gap-y-[1.199rem] lg:su-gap-x-[2.589rem] lg:su-gap-y-[2.143rem]' >ImageMosaicHTML</button><div class='su-text-[1.5rem] su-w-full su-text-center dark:su-text-white md:su-max-w-[482px] lg:su-max-w-[633px] su-mx-auto' ><p class='su-m-0 su-text-left'>Custom caption | Custom credit</p></div></div>ModalHTML</div></section>"`);
        });

        it('Should return HTML without title when title is an empty string', async () => {
            const partialArgs = {
                ...defaultMockData,
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    layout: "Title & Content",
                    title: ""
                }
            };

            const result = await main(partialArgs, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='image-gallery-modal'><div class=''><div class='su-mx-auto su-component-container su-container-wide su-container-px'><div class='su-w-[100%] md:su-max-w-[60.7rem] lg:su-max-w-[63.6rem] su-mx-auto' ><div class='su-text-center [&>*]:su-justify-center [&>*]:su-rs-mb-0 su-flex su-flex-col su-gap-[2.1rem] md:su-gap-[2.5rem]' >Media gallery   </div> <div class='su-text-left su-wysiwyg-content su-rs-mt-0 su-text-[1.8rem] su-leading-[2.25rem] su-mt-[1.5rem] md:su-text-[1.9rem] md:su-leading-[2.375rem] md:su-mt-[1.9rem] lg:su-text-[2.1rem] lg:su-leading-[2.625rem]' data-test='component-story-lead' >&lt;p&gt;Custom summary&lt;/p&gt;</div> </div><button data-click='open-gallery-modal' title='Open image gallery' aria-label='Open image gallery' class='su-grid su-grid-cols-2 su-mx-auto su-grid-rows-2 su-max-w-[1312px] su-gap-x-[0.691rem] su-gap-y-[0.572rem] su-mt-[3.2rem] su-pb-[1rem] md:su-mt-[4.8rem] md:su-gap-x-[1.448rem] md:su-gap-y-[1.199rem] lg:su-gap-x-[2.589rem] lg:su-gap-y-[2.143rem]' >ImageMosaicHTML</button><div class='su-text-[1.5rem] su-w-full su-text-center dark:su-text-white md:su-max-w-[482px] lg:su-max-w-[633px] su-mx-auto' ><p class='su-m-0 su-text-left'>Custom caption | Custom credit</p></div></div>ModalHTML</div></section>"`);
        });

        it('Should return HTML without title when layout is not Title & Content', async () => {
            const partialArgs = {
                ...defaultMockData,
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    layout: "Content Only",
                    title: "Custom title"
                }
            };

            const result = await main(partialArgs, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='image-gallery-modal'><div class=''><div class='su-mx-auto su-component-container su-container-wide su-container-px'><div class='su-w-[100%] md:su-max-w-[60.7rem] lg:su-max-w-[63.6rem] su-mx-auto' ><div class='su-text-center [&>*]:su-justify-center [&>*]:su-rs-mb-0 su-flex su-flex-col su-gap-[2.1rem] md:su-gap-[2.5rem]' >Media gallery </div></div><button data-click='open-gallery-modal' title='Open image gallery' aria-label='Open image gallery' class='su-grid su-grid-cols-2 su-mx-auto su-grid-rows-2 su-max-w-[1312px] su-gap-x-[0.691rem] su-gap-y-[0.572rem] su-mt-[3.2rem] su-pb-[1rem] md:su-mt-[4.8rem] md:su-gap-x-[1.448rem] md:su-gap-y-[1.199rem] lg:su-gap-x-[2.589rem] lg:su-gap-y-[2.143rem]' >ImageMosaicHTML</button><div class='su-text-[1.5rem] su-w-full su-text-center dark:su-text-white md:su-max-w-[482px] lg:su-max-w-[633px] su-mx-auto' ><p class='su-m-0 su-text-left'>Custom caption | Custom credit</p></div></div>ModalHTML</div></section>"`);
        });

        it('Should return HTML without summary when summary is an empty string', async () => {
            const partialArgs = {
                ...defaultMockData,
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    layout: "Title & Content",
                    summary: ""
                }
            };

            const result = await main(partialArgs, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='image-gallery-modal'><div class=''><div class='su-mx-auto su-component-container su-container-wide su-container-px'><div class='su-w-[100%] md:su-max-w-[60.7rem] lg:su-max-w-[63.6rem] su-mx-auto' ><div class='su-text-center [&>*]:su-justify-center [&>*]:su-rs-mb-0 su-flex su-flex-col su-gap-[2.1rem] md:su-gap-[2.5rem]' >Media gallery  <h2 class='su-text-[3.5rem] su-leading-[4.179rem] su-font-bold md:su-text-[4.0rem] md:su-leading-[4.776rem] lg:su-text-[4.9rem] lg:su-leading-[6.37rem]' >Custom title</h2> </div>  </div><button data-click='open-gallery-modal' title='Open image gallery' aria-label='Open image gallery' class='su-grid su-grid-cols-2 su-mx-auto su-grid-rows-2 su-max-w-[1312px] su-gap-x-[0.691rem] su-gap-y-[0.572rem] su-mt-[3.2rem] su-pb-[1rem] md:su-mt-[4.8rem] md:su-gap-x-[1.448rem] md:su-gap-y-[1.199rem] lg:su-gap-x-[2.589rem] lg:su-gap-y-[2.143rem]' >ImageMosaicHTML</button><div class='su-text-[1.5rem] su-w-full su-text-center dark:su-text-white md:su-max-w-[482px] lg:su-max-w-[633px] su-mx-auto' ><p class='su-m-0 su-text-left'>Custom caption | Custom credit</p></div></div>ModalHTML</div></section>"`);
        });

        it('Should return HTML with proper width caption', async () => {
            const partialArgs = {
                ...defaultMockData,
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    credit: undefined
                }
            };

            const result = await main(partialArgs, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='image-gallery-modal'><div class=''><div class='su-mx-auto su-component-container su-container-wide su-container-px'><div class='su-w-[100%] md:su-max-w-[60.7rem] lg:su-max-w-[63.6rem] su-mx-auto' ><div class='su-text-center [&>*]:su-justify-center [&>*]:su-rs-mb-0 su-flex su-flex-col su-gap-[2.1rem] md:su-gap-[2.5rem]' >Media gallery  <h2 class='su-text-[3.5rem] su-leading-[4.179rem] su-font-bold md:su-text-[4.0rem] md:su-leading-[4.776rem] lg:su-text-[4.9rem] lg:su-leading-[6.37rem]' >Custom title</h2> </div> <div class='su-text-left su-wysiwyg-content su-rs-mt-0 su-text-[1.8rem] su-leading-[2.25rem] su-mt-[1.5rem] md:su-text-[1.9rem] md:su-leading-[2.375rem] md:su-mt-[1.9rem] lg:su-text-[2.1rem] lg:su-leading-[2.625rem]' data-test='component-story-lead' >&lt;p&gt;Custom summary&lt;/p&gt;</div> </div><button data-click='open-gallery-modal' title='Open image gallery' aria-label='Open image gallery' class='su-grid su-grid-cols-2 su-mx-auto su-grid-rows-2 su-max-w-[1312px] su-gap-x-[0.691rem] su-gap-y-[0.572rem] su-mt-[3.2rem] su-pb-[1rem] md:su-mt-[4.8rem] md:su-gap-x-[1.448rem] md:su-gap-y-[1.199rem] lg:su-gap-x-[2.589rem] lg:su-gap-y-[2.143rem]' >ImageMosaicHTML</button><div class='su-text-[1.5rem] su-w-full su-text-center dark:su-text-white md:su-max-w-[482px] lg:su-max-w-[633px] su-mx-auto' ><p class='su-m-0 su-text-left'>Custom caption</p></div></div>ModalHTML</div></section>"`);
        });

        it('Should return HTML with proper width credit', async () => {
            const partialArgs = {
                ...defaultMockData,
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    caption: undefined
                }
            };

            const result = await main(partialArgs, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='image-gallery-modal'><div class=''><div class='su-mx-auto su-component-container su-container-wide su-container-px'><div class='su-w-[100%] md:su-max-w-[60.7rem] lg:su-max-w-[63.6rem] su-mx-auto' ><div class='su-text-center [&>*]:su-justify-center [&>*]:su-rs-mb-0 su-flex su-flex-col su-gap-[2.1rem] md:su-gap-[2.5rem]' >Media gallery  <h2 class='su-text-[3.5rem] su-leading-[4.179rem] su-font-bold md:su-text-[4.0rem] md:su-leading-[4.776rem] lg:su-text-[4.9rem] lg:su-leading-[6.37rem]' >Custom title</h2> </div> <div class='su-text-left su-wysiwyg-content su-rs-mt-0 su-text-[1.8rem] su-leading-[2.25rem] su-mt-[1.5rem] md:su-text-[1.9rem] md:su-leading-[2.375rem] md:su-mt-[1.9rem] lg:su-text-[2.1rem] lg:su-leading-[2.625rem]' data-test='component-story-lead' >&lt;p&gt;Custom summary&lt;/p&gt;</div> </div><button data-click='open-gallery-modal' title='Open image gallery' aria-label='Open image gallery' class='su-grid su-grid-cols-2 su-mx-auto su-grid-rows-2 su-max-w-[1312px] su-gap-x-[0.691rem] su-gap-y-[0.572rem] su-mt-[3.2rem] su-pb-[1rem] md:su-mt-[4.8rem] md:su-gap-x-[1.448rem] md:su-gap-y-[1.199rem] lg:su-gap-x-[2.589rem] lg:su-gap-y-[2.143rem]' >ImageMosaicHTML</button><div class='su-text-[1.5rem] su-w-full su-text-center dark:su-text-white md:su-max-w-[482px] lg:su-max-w-[633px] su-mx-auto' ><p class='su-m-0 su-text-left'>Custom credit</p></div></div>ModalHTML</div></section>"`);
        });

        it('Should return HTML with proper width sidebarHeading', async () => {
            const partialArgs = {
                ...defaultMockData,
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    displayIconHeading: false
                }
            };

            const result = await main(partialArgs, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='image-gallery-modal'><div class=''><div class='su-mx-auto su-component-container su-container-wide su-container-px'><div class='su-w-[100%] md:su-max-w-[60.7rem] lg:su-max-w-[63.6rem] su-mx-auto' ><div class='su-text-center [&>*]:su-justify-center [&>*]:su-rs-mb-0 su-flex su-flex-col su-gap-[2.1rem] md:su-gap-[2.5rem]' >  <h2 class='su-text-[3.5rem] su-leading-[4.179rem] su-font-bold md:su-text-[4.0rem] md:su-leading-[4.776rem] lg:su-text-[4.9rem] lg:su-leading-[6.37rem]' >Custom title</h2> </div> <div class='su-text-left su-wysiwyg-content su-rs-mt-0 su-text-[1.8rem] su-leading-[2.25rem] su-mt-[1.5rem] md:su-text-[1.9rem] md:su-leading-[2.375rem] md:su-mt-[1.9rem] lg:su-text-[2.1rem] lg:su-leading-[2.625rem]' data-test='component-story-lead' >&lt;p&gt;Custom summary&lt;/p&gt;</div> </div><button data-click='open-gallery-modal' title='Open image gallery' aria-label='Open image gallery' class='su-grid su-grid-cols-2 su-mx-auto su-grid-rows-2 su-max-w-[1312px] su-gap-x-[0.691rem] su-gap-y-[0.572rem] su-mt-[3.2rem] su-pb-[1rem] md:su-mt-[4.8rem] md:su-gap-x-[1.448rem] md:su-gap-y-[1.199rem] lg:su-gap-x-[2.589rem] lg:su-gap-y-[2.143rem]' >ImageMosaicHTML</button><div class='su-text-[1.5rem] su-w-full su-text-center dark:su-text-white md:su-max-w-[482px] lg:su-max-w-[633px] su-mx-auto' ><p class='su-m-0 su-text-left'>Custom caption | Custom credit</p></div></div>ModalHTML</div></section>"`);
        });

        it('Should sanitize the summary using xss', async () => {
            const argsWithXss = {
                ...defaultMockData,
                contentConfiguration: {
                    ...defaultMockData.contentConfiguration,
                    summary: '<script>alert("XSS")</script>'
                }
            };

            const result = await main(argsWithXss, defaultMockInfo);

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
