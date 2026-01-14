import { beforeEach, describe, expect, it, vi } from 'vitest';
import { basicAssetUri } from '../../global/js/utils';
import moduleToTest from './main';
const { main } = moduleToTest;
const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    basicAssetUri: vi.fn(),
    isRealExternalLink: vi.fn((url) => url.startsWith('http'))
  }));

describe('[Button]', () => {
    const mockFnsCtx = {
        resolveUri: vi.fn(),
    };
    const defaultMockData = {
        buttonText: 'Button Text',
        internalUrl: '/internal-link',
        externalUrl: 'https://external.com',
        isNewWindow: true,
    };
    const defaultMockInfo = {
        fns: mockFnsCtx,
        
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {

        it('Should throw an error when buttonText is not a string', async () => {
            const mockData = { ...defaultMockData, buttonText: [1,2,3] };
            const result = await main(mockData, defaultMockInfo);
            expect(result).toBe(
                '<!-- Error occurred in the Button component: The "buttonText" field must be a string. The [1,2,3] was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when internalUrl is not a string', async () => {
            const mockData = { ...defaultMockData, internalUrl: 123 };
            const result = await main(mockData, defaultMockInfo);
            expect(result).toBe(
                '<!-- Error occurred in the Button component: The "internalUrl" field must be a string. The 123 was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when externalUrl is not a string', async () => {
            const mockData = { ...defaultMockData, externalUrl: {} };
            const result = await main(mockData, defaultMockInfo);
            expect(result).toBe(
                '<!-- Error occurred in the Button component: The "externalUrl" field must be a string. The {} was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when isNewWindow was not a boolean', async () => {
            const mockData = {
                ...defaultMockData,
                isNewWindow: 'yes'
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toBe('<!-- Error occurred in the Button component: The "isNewWindow" field must be a boolean. The "yes" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when button URL is an empty string', async () => {
            const mockData = { 
                ...defaultMockData, 
                internalUrl: '',
                externalUrl: ''
            };
            const result = await main(mockData, defaultMockInfo);

            expect(result).toBe(
                '<!-- Error occurred in the Button component: The URL of button must be a non-empty string. The "" was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

    });

    describe('[Main Function]', () => {
        beforeEach(() => {
          basicAssetUri.mockResolvedValueOnce({
            url: 'https://example.com/internal-link',
          });
        });
      
        it('Should render button with internal URL', async () => {
            const mockData = { 
                ...defaultMockData,
                externalUrl: undefined,
                isNewWindow: undefined,
            };

            const result = await main(mockData, defaultMockInfo);
            expect(result).to.contain('Button Text');
            expect(result).to.contain('data-component="button"');
            expect(result).to.contain('<a href="https://example.com/internal-link"');
            expect(result).not.contain('svg-inline--fa fa-arrow-up');
        });
      
        it('Should handle isRealExternalLink correctly', async () => {
            const mockData = { 
                ...defaultMockData,
                internalUrl: undefined,
                isNewWindow: undefined,
            };
            const result = await main(mockData, defaultMockInfo);

            expect(result).to.contain('Button Text');
            expect(result).to.contain('data-component="button"');
            expect(result).to.contain('<a href="https://external.com"');
            expect(result).to.contain('svg-inline--fa fa-arrow-up');
        });

        it('Should handle isNewWindow correctly', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).to.contain('Button Text');
            expect(result).to.contain('data-component="button"');
            expect(result).to.contain('<a href="https://example.com/internal-link" target="_blank"');
        });
      
               
      });
});
