import { expect, describe, it, vi, beforeEach } from 'vitest';
import { FAIcon } from '../../global/js/helpers';
import { containerClasses, basicAssetUri } from '../../global/js/utils';
import fullscreenImageQuoteTemplate from './fullscreen-image.hbs';
import moduleToTest from './main';

const { main } = moduleToTest;

vi.mock('../../global/js/helpers', () => ({
  FAIcon: vi.fn().mockReturnValue('<svg>mocked icon</svg>')
}));

vi.mock('../../global/js/utils', () => ({
  containerClasses: vi.fn().mockReturnValue('mocked-container-classes'),
  basicAssetUri: vi.fn()
}));

vi.mock('./fullscreen-image.hbs', () => ({
  default: vi.fn().mockReturnValue('<div>mocked template</div>')
}));

describe('Fullscreen Image Quote Component', () => {
  const mockFns = { resolveUri: vi.fn() };
  
  const defaultArgs = {
    image: 'test-image-uri',
    quote: 'Test quote',
    quoteHAlign: 'left',
    quoteVAlign: 'center',
    imageVPosition: 'center',
    removeTopSpacing: false,
    ctaDetails: {
      ctaPreText: 'Meet',
      ctaText: 'Jane Stanford',
      ctaSubtext: "'21, international student",
      externalUrl: 'https://example.com',
      isNewWindow: true
    }
  };

  const defaultInfo = {
    fns: mockFns
  };

  beforeEach(() => {
    vi.clearAllMocks();
    basicAssetUri.mockImplementation((fns, uri) => 
      Promise.resolve({
        url: `resolved-${uri}`,
        attributes: {
          alt: 'mocked alt text'
        }
      })
    );
  });

  describe('Image Handling', () => {
    it('processes main image correctly', async () => {
      await main(defaultArgs, defaultInfo);

      expect(basicAssetUri).toHaveBeenCalledWith(mockFns, 'test-image-uri');
      expect(fullscreenImageQuoteTemplate).toHaveBeenCalledWith(
        expect.objectContaining({
          imageData: expect.objectContaining({
            url: 'resolved-test-image-uri',
            attributes: { alt: 'mocked alt text' }
          })
        })
      );
    });

    it('handles mobile image when provided', async () => {
      const argsWithMobile = {
        ...defaultArgs,
        mobileImage: 'mobile-image-uri'
      };

      await main(argsWithMobile, defaultInfo);

      expect(basicAssetUri).toHaveBeenCalledWith(mockFns, 'mobile-image-uri');
      expect(fullscreenImageQuoteTemplate).toHaveBeenCalledWith(
        expect.objectContaining({
          mobileImageData: expect.objectContaining({
            url: 'resolved-mobile-image-uri'
          }),
          hasMobileImage: true
        })
      );
    });
  });

  describe('CTA Configuration', () => {
    it('handles external links correctly', async () => {
      await main(defaultArgs, defaultInfo);

      expect(FAIcon).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'arrow-up'
        })
      );
      expect(fullscreenImageQuoteTemplate).toHaveBeenCalledWith(
        expect.objectContaining({
          isRealExternalLink: true
        })
      );
    });

    it('handles internal Stanford news links differently', async () => {
      const argsWithInternalLink = {
        ...defaultArgs,
        ctaDetails: {
          ...defaultArgs.ctaDetails,
          externalUrl: 'https://news.stanford.edu/story'
        }
      };

      await main(argsWithInternalLink, defaultInfo);

      expect(FAIcon).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'chevron-right'
        })
      );
      expect(fullscreenImageQuoteTemplate).toHaveBeenCalledWith(
        expect.objectContaining({
          isRealExternalLink: false
        })
      );
    });

    it('processes internal Matrix links', async () => {
      const argsWithInternalMatrixLink = {
        ...defaultArgs,
        ctaDetails: {
          ...defaultArgs.ctaDetails,
          internalUrl: 'matrix-asset://test/123'
        }
      };

      await main(argsWithInternalMatrixLink, defaultInfo);

      expect(basicAssetUri).toHaveBeenCalledWith(mockFns, 'matrix-asset://test/123');
    });
  });

  describe('Template Rendering', () => {
    it('passes correct styling classes based on alignment', async () => {
      const argsWithRightAlign = {
        ...defaultArgs,
        quoteHAlign: 'right'
      };

      await main(argsWithRightAlign, defaultInfo);

      expect(containerClasses).toHaveBeenCalled();
      expect(fullscreenImageQuoteTemplate).toHaveBeenCalledWith(
        expect.objectContaining({
          quoteHAlign: 'right',
          classes: 'mocked-container-classes'
        })
      );
    });

    it('handles top spacing removal', async () => {
      const argsWithRemovedSpacing = {
        ...defaultArgs,
        removeTopSpacing: true
      };

      await main(argsWithRemovedSpacing, defaultInfo);

      expect(containerClasses).toHaveBeenCalledWith(
        expect.objectContaining({
          width: 'full',
          paddingX: false,
          className: expect.any(String)
        })
      );
    });
  });
});
