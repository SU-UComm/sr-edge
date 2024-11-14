/**
 * @jest-environment jsdom
 */

import xss from 'xss';
import { basicAssetUri } from "../../global/js/utils";
import moduleToTest from './main';

const mockedError = jest.fn();
console.error = mockedError;

jest.mock('../../global/js/utils', () => ({
    basicAssetUri: jest.fn(),
    containerClasses: jest.fn().mockReturnValue('su-container-class')
}));

describe('[Campaign CTA]', () => {
    const mockFnsCtx = {
        resolveUri: jest.fn()
    };

    const defaultMockData = {
        displayConfiguration: {
            image: 'https://example.com/image.jpg',
            title: 'Campaign Title',
            description: 'Campaign Description',
            linkUrl: 'https://example.com',
            linkText: 'Click Here'
        }
    };

    const defaultMockInfo = {
        fns: mockFnsCtx
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters was provided.', async () => {
            const result = await moduleToTest.main();

            expect(result).toBe('<!-- Error: Error occurred in the campaign cta component, info.fns cannot be undefined or null. The "[object Object]" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when no info was provided', async () => {
            const result = await moduleToTest.main(defaultMockData);

            expect(result).toBe('<!-- Error: Error occurred in the campaign cta component, info.fns cannot be undefined or null. The "[object Object]" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info do not have fns or cts functions', async () => {
            const mockInfo = {test: 'test'}
            const result = await moduleToTest.main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error: Error occurred in the campaign cta component, info.fns cannot be undefined or null. The "[object Object]" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle errors when fns or ctx is invalid', async () => {
            const mockInfo = { fns: undefined, ctx: undefined,  };
            const result = await moduleToTest.main(defaultMockData, mockInfo);
    
            expect(result).toBe('<!-- Error: Error occurred in the campaign cta component, info.fns cannot be undefined or null. The "[object Object]" was received. -->');
            expect(console.error).toHaveBeenCalledWith(expect.any(Error));
        });
        
        it('Should handle errors when title is not a string', async () => {
            const mockedData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    title: [1, 2],
                }
            };
            const result = await moduleToTest.main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error: Error occurred in the campaign cta component, title field must be a string. The "1,2" was received. -->');
            expect(console.error).toHaveBeenCalledWith(expect.any(Error));
        });

        it('Should handle errors when description is not a string', async () => {
            const mockedData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    description: [1, 2],
                }
            };
            const result = await moduleToTest.main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error: Error occurred in the campaign cta component, description field must be a string. The "1,2" was received. -->');
            expect(console.error).toHaveBeenCalledWith(expect.any(Error));
        });

        it('Should handle errors when linkText is not a string', async () => {
            const mockedData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    linkText: [1, 2],
                }
            };
            const result = await moduleToTest.main(mockedData, defaultMockInfo);
    
            expect(result).toBe('<!-- Error: Error occurred in the campaign cta component, linkText field must be a string. The "1,2" was received. -->');
            expect(console.error).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('[Main Function]', () => {
        it('Should return the expected HTML with valid data', async () => {
            // Mocking basicAssetUri to return URL data
            basicAssetUri.mockResolvedValueOnce({ url: 'https://example.com' });
            basicAssetUri.mockResolvedValueOnce({ url: 'https://example.com/image.jpg', attributes: { alt: 'Alt Text' } });

            const result = await moduleToTest.main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<section data-component="campaign-cta">');
            expect(result).toContain('<h2 class="su-font-serif su-text-[5.5rem] su-leading-none md:su-text-[7.2rem] su-m-0 su-font-bold">');
            expect(result).toContain('Campaign Title');
            expect(result).toContain('<div class="su-mt-34 su-font-serif su-text-20 md:su-text-24 su-mb-0 md:su-mb-[5.9rem] su-text-semibold md:su-mt-61 su-font-semibold su-leading-[130.245%]">');
            expect(result).toContain('Campaign Description');
            expect(result).toContain('<a href="https://example.com"');
            expect(result).toContain('Click Here');
            expect(result).toContain('<img class="su-absolute su-object-cover su-size-full su-z-[1]" src="https://example.com/image.jpg" alt="Alt Text" />');
        });

        it('Should return HTML without link when linkUrl is missing', async () => {
            const partialArgs = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    linkUrl: null,
                }
            };

            const result = await moduleToTest.main(partialArgs, defaultMockInfo);

            expect(result).not.toContain('<a href=');
        });

        it('Should return HTML without title when title is an empty string', async () => {
            const partialArgs = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    title: '',
                }
            };

            const result = await moduleToTest.main(partialArgs, defaultMockInfo);

            expect(result).not.toContain('<h2 class="su-font-serif su-text-[5.5rem] su-leading-none md:su-text-[7.2rem] su-m-0 su-font-bold">');
            expect(result).not.toContain('Campaign Title');
        });

        it('Should return HTML without description when description is an empty string', async () => {
            const partialArgs = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    description: '',
                }
            };

            const result = await moduleToTest.main(partialArgs, defaultMockInfo);

            expect(result).not.toContain('<div class="su-mt-34 su-font-serif su-text-20 md:su-text-24 su-mb-0 md:su-mb-[5.9rem] su-text-semibold md:su-mt-61 su-font-semibold su-leading-[130.245%]">');
            expect(result).not.toContain('Campaign Description');
        });

        it('Should return HTML with empty alt attribute when attributes alt is missing', async () => {
            // Mocking basicAssetUri to return URL data
            basicAssetUri.mockResolvedValueOnce({ url: 'https://example.com' });
            basicAssetUri.mockResolvedValueOnce({ url: 'https://example.com/image.jpg'});

            const result = await moduleToTest.main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<img class="su-absolute su-object-cover su-size-full su-z-[1]" src="https://example.com/image.jpg" alt="" />');
        });

        it('Should sanitize the description using xss', async () => {
            const mockXssDescription = '<script>alert("XSS")</script>';
            const xssSanitized = xss(mockXssDescription);

            const argsWithXss = {
                displayConfiguration: {
                    title: 'Title with XSS',
                    description: mockXssDescription,
                    linkUrl: 'https://example.com',
                    linkText: 'Click Here'
                }
            };

            const result = await moduleToTest.main(argsWithXss, defaultMockInfo);

            expect(result).toContain(xssSanitized);
            expect(result).not.toContain('<script>alert("XSS")</script>');
        });
    });
});
