

import { FAIcon } from "../../global/js/helpers";
import { basicAssetUri } from "../../global/js/utils";
import fullscreenImageQuoteTemplate from './fullscreen-image.hbs';

const cnb = (...classes) => classes.filter(Boolean).join(" ");

function validateEnvironment(info) {
  if (!info?.fns || typeof info.fns !== 'object') {
    throw new Error(`The "info.fns" cannot be undefined or null. The ${JSON.stringify(info.fns || {})} was received.`);
  }
}

function validateArgs(args) {
  // Required fields
  if (!args?.image || typeof args.image !== 'string') {
    throw new Error(`The "image" field cannot be undefined and must be a string. The ${JSON.stringify(args?.image)} was received.`);
  }

  if (!args?.quote || typeof args.quote !== 'string') {
    throw new Error(`The "quote" field cannot be undefined and must be a string. The ${JSON.stringify(args?.quote)} was received.`);
  }

  // Optional fields with specific values
  if (args?.quoteHAlign && !['left', 'right'].includes(args.quoteHAlign)) {
    throw new Error(`The "quoteHAlign" field must be one of ["left", "right"]. The ${JSON.stringify(args.quoteHAlign)} was received.`);
  }

  if (args?.quoteVAlign && !['top', 'center', 'bottom'].includes(args.quoteVAlign)) {
    throw new Error(`The "quoteVAlign" field must be one of ["top", "center", "bottom"]. The ${JSON.stringify(args.quoteVAlign)} was received.`);
  }

  if (args?.imageVPosition && !['top', 'center', 'bottom'].includes(args.imageVPosition)) {
    throw new Error(`The "imageVPosition" field must be one of ["top", "center", "bottom"]. The ${JSON.stringify(args.imageVPosition)} was received.`);
  }

  // CTA validation
  if (args?.ctaDetails) {
    const { ctaPreText, ctaText, ctaSubtext, externalUrl, internalUrl, isNewWindow } = args.ctaDetails;

    if (ctaPreText && typeof ctaPreText !== 'string') {
      throw new Error(`The "ctaPreText" field must be a string. The ${JSON.stringify(ctaPreText)} was received.`);
    }

    if (ctaText && typeof ctaText !== 'string') {
      throw new Error(`The "ctaText" field must be a string. The ${JSON.stringify(ctaText)} was received.`);
    }

    if (ctaSubtext && typeof ctaSubtext !== 'string') {
      throw new Error(`The "ctaSubtext" field must be a string. The ${JSON.stringify(ctaSubtext)} was received.`);
    }

    if (externalUrl && typeof externalUrl !== 'string') {
      throw new Error(`The "externalUrl" field must be a string. The ${JSON.stringify(externalUrl)} was received.`);
    }

    if (internalUrl && typeof internalUrl !== 'string') {
      throw new Error(`The "internalUrl" field must be a string. The ${JSON.stringify(internalUrl)} was received.`);
    }

    if (isNewWindow !== undefined && typeof isNewWindow !== 'boolean') {
      throw new Error(`The "isNewWindow" field must be a boolean. The ${JSON.stringify(isNewWindow)} was received.`);
    }
  }
}

export default {
  async main(args, info) {
    try {
      validateEnvironment(info);
      validateArgs(args);

      const { fns } = info;
      let imageData = null;
      
      if (args?.image) {
        imageData = await basicAssetUri(fns, args.image);
      }

      let mobileImageData = null;
      if (args?.mobileImage) {
        mobileImageData = await basicAssetUri(fns, args.mobileImage);
      }

      let linkUrl = null;
      if (args?.ctaDetails?.internalUrl) {
        linkUrl = await basicAssetUri(fns, args?.ctaDetails?.internalUrl);
      }
      const internalLinkUrl = linkUrl?.url;

      const { quote, quoteHAlign, quoteVAlign, removeTopSpacing, imageVPosition, ctaDetails } = args;
      const { ctaPreText, ctaText, ctaSubtext, externalUrl, isNewWindow } = ctaDetails || {};
      
      const isRealExternalLink = !!externalUrl && !externalUrl?.includes("news.stanford.edu");

      const ctaIcon = FAIcon({
        icon: isRealExternalLink ? "arrow-up" : "chevron-right",
        attributes: {
          width: 18,
          title: isRealExternalLink ? "link is external" : undefined,
          class: cnb(
            "su-ml-04em su-text-[0.75em] su-transition-transform su-text-dark-mode-red group-hocus:su-text-white",
            isRealExternalLink
              ? "su-rotate-45 group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em"
              : "group-hocus:su-translate-x-02em"
          )
        }
      });

      const componentData = {
        quote,
        quoteHAlign,
        quoteVAlign,
        imageVPosition,
        removeTopSpacing,
        ctaPreText,
        ctaText,
        ctaSubtext,
        externalUrl,
        internalLinkUrl,
        isNewWindow,
        isRealExternalLink,
        imageData: imageData || {},
        mobileImageData: mobileImageData || {},
        ctaIcon,
      };

      return fullscreenImageQuoteTemplate(componentData);
    } catch (error) {
      console.error(error);
      return `<!-- Error occurred in the Fullscreen Image Quote component: ${error.message} -->`;
    }
  }
};
