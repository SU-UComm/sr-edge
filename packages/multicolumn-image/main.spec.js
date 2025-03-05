import { beforeEach, describe, expect, it, vi } from 'vitest';
import { basicAssetUri } from "../../global/js/utils";
import moduleToTest from './main';
const { main } = moduleToTest;

// Mock console.error
const mockedError = vi.fn();
console.error = mockedError;

// Mock dependencies
vi.mock('../../global/js/utils', () => ({
  basicAssetUri: vi.fn().mockResolvedValue({ url: 'https://example.com/image.jpg' }),
}));

// Test fixtures
const mockFnsCtx = {
  resolveUri: vi.fn()
};

const defaultMockData = {
  contentConfiguration: {
    images: [
      {
        imageAsset: "matrix-asset://api-identifier/image1",
        imageCaption: "Test caption 1"
      },
      {
        imageAsset: "matrix-asset://api-identifier/image2",
        imageCaption: "Test caption 2"
      }
    ]
  }
};

const defaultMockInfo = {
  fns: mockFnsCtx,
  env: {
    API_IDENTIFIER: 'test-api-identifier'
  }
};

// Clear mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

describe('[Multicolumn Image Component Tests]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedError.mockClear();
  });

  describe('[Setup Validation]', () => {
    it('Should reject invalid info.fns object', async () => {
      const mockInfo = { test: 'test' };
      const result = await main(defaultMockData, mockInfo);
      expect(result).toContain('The "info.fns" cannot be undefined or null.');
      expect(mockedError).toBeCalledTimes(1);
    });

    it('Should reject missing fns or ctx', async () => {
      const mockInfo = { fns: undefined, ctx: undefined };
      const result = await main(defaultMockData, mockInfo);
      expect(result).toContain('The "info.fns" cannot be undefined or null.');
      expect(mockedError).toBeCalledTimes(1);
    });
  });

  describe('[Validation]', () => {
    it('Should validate images array', async () => {
      const mockedData = {
        contentConfiguration: {
          images: "not-an-array"
        }
      };
      const result = await main(mockedData, defaultMockInfo);
      expect(result).toContain('The "images" field must be an array.');
      expect(mockedError).toBeCalledTimes(1);
    });

    it('Should validate individual image objects', async () => {
      const mockedData = {
        contentConfiguration: {
          images: [
            {
              imageAsset: "asset1",
              imageCaption: null
            },
            {
              imageAsset: "asset2",
              imageCaption: undefined
            }
          ]
        }
      };
      const result = await main(mockedData, defaultMockInfo);
      expect(result).toContain('data-component="multicolumn-image"');
      expect(mockedError).not.toBeCalled();
    });
  });

  describe('[Image Processing]', () => {
    it('Should process multiple images correctly', async () => {
      const result = await main(defaultMockData, defaultMockInfo);
      
      // Verify template receives correct data structure
      expect(basicAssetUri).toHaveBeenCalledTimes(2);
      expect(basicAssetUri).toHaveBeenNthCalledWith(1, mockFnsCtx, defaultMockData.contentConfiguration.images[0].imageAsset);
      expect(basicAssetUri).toHaveBeenNthCalledWith(2, mockFnsCtx, defaultMockData.contentConfiguration.images[1].imageAsset);
      
      // Verify HTML structure
      expect(result).toContain('data-component="multicolumn-image"');
      expect(result).toContain('su-flex su-gap-20 su-items-center lg:su-gap-48');
      expect(result).toContain('su-mx-auto su-component-container su-container-wide su-container-px');
    });

    it('Should handle missing captions', async () => {
      const mockedData = {
        contentConfiguration: {
          images: [
            {
              imageAsset: "matrix-asset://api-identifier/image1"
            },
            {
              imageAsset: "matrix-asset://api-identifier/image2"
            }
          ]
        }
      };

      const result = await main(mockedData, defaultMockInfo);
      
      // Verify template receives correct data structure
      expect(basicAssetUri).toHaveBeenCalledTimes(2);
      expect(result).toContain('data-component="multicolumn-image"');
    });
  });

  describe('[Environment Validation]', () => {
    it('Should reject non-object fnsCtx', async () => {
      const mockInfo = { fns: 'not-an-object' };
      const result = await main(defaultMockData, mockInfo);
      expect(result).toContain('The "info.fns" cannot be undefined or null.');
      expect(mockedError).toBeCalledTimes(1);
    });

    it('Should reject fnsCtx without resolveUri', async () => {
      const mockInfo2 = { fns: {} };
      const result2 = await main(defaultMockData, mockInfo2);
      expect(result2).toContain('The "info.fns" cannot be undefined or null.');
      expect(mockedError).toBeCalledTimes(1);
    });

    it('Should reject invalid API_IDENTIFIER', async () => {
      const mockInfo = {
        fns: mockFnsCtx,
        env: {
          API_IDENTIFIER: null
        }
      };
      const result = await main(defaultMockData, mockInfo);
      expect(result).toContain('The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string.');
      expect(result).toContain('null');
      expect(mockedError).toBeCalledTimes(1);
    });

    it('Should reject empty API_IDENTIFIER', async () => {
      const mockInfo = {
        fns: mockFnsCtx,
        env: {
          API_IDENTIFIER: ''
        }
      };
      const result = await main(defaultMockData, mockInfo);
      expect(result).toContain('The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string.');
      expect(result).toContain('""');
      expect(mockedError).toBeCalledTimes(1);
    });

    it('Should reject non-string API_IDENTIFIER', async () => {
      const mockInfo = {
        fns: mockFnsCtx,
        env: {
          API_IDENTIFIER: 123
        }
      };
      const result = await main(defaultMockData, mockInfo);
      expect(result).toContain('The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string.');
      expect(result).toContain('123');
      expect(mockedError).toBeCalledTimes(1);
    });
  });

  describe('[Nullish Coalescing Tests]', () => {
    it('Should handle undefined args with || {} fallback', async () => {
        const mockInfo = {
            fns: mockFnsCtx
        };
      const result = await main(defaultMockData, mockInfo);
      expect(result).toContain('Error occurred in the Multicolumn image component:');
      expect(mockedError).toBeCalledTimes(1);
    });

    it('Should handle missing info object with optional chaining', async () => {
        const mockInfo = {
            fns: mockFnsCtx
        };
        const result = await main(defaultMockData, mockInfo);
        expect(result).toContain('<!-- Error occurred in the Multicolumn image component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
        expect(mockedError).toBeCalledTimes(1);
      });

      it('Should handle missing env object with optional chaining', async () => {
        const mockInfo = {
          fns: mockFnsCtx,
          set: {
            environment: {
              API_IDENTIFIER: 'test-api-identifier'
            }
          }
        };
        const result = await main(defaultMockData, mockInfo);
        expect(result).not.toContain('<!-- Error occurred in the Multicolumn image component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
        expect(mockedError).not.toBeCalled();
      });

    it('Should handle missing API_IDENTIFIER with optional chaining', async () => {
      const mockInfo = {
        fns: mockFnsCtx
      };
      const result = await main(defaultMockData, mockInfo);
      expect(result).toContain('The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string.');
      expect(result).toContain('undefined');
      expect(mockedError).toBeCalledTimes(1);
    });
  });
});