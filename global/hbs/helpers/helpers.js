/* eslint-disable no-undef */
import { faSolid, faRegular } from '../../js/libraries';

export const helpers = {
    alignClass: function(align) {
        const alignClasses = new Map();
        alignClasses.set("right", "md:su-order-2");
        alignClasses.set("left", "");
        
        return alignClasses.get(align) || "";
    },
    aspectRatioSize: function(cardSize) {
        return `card-${cardSize}`;
    },
    aspectRatioClass: function(aspectRatio) {
        const aspectRatios = new Map();

        aspectRatios.set('card-small','su-aspect-[3/2]');
        aspectRatios.set('card-medium','su-aspect-[3/2]');
        aspectRatios.set('card-large','su-aspect-[3/2]');
        aspectRatios.set('card-featured','su-aspect-[3/2]');
        aspectRatios.set('square','su-aspect-[1/1]');
        aspectRatios.set('video','su-aspect-[16/9]');
        aspectRatios.set('vertical-video','su-aspect-[9/16]');

        return aspectRatios.get(aspectRatio);
    },
    avatarImageClasses: function(avatarSize) {
        const avatarImageClasses = new Map();

        avatarImageClasses.set("small", "su-w-50 su-h-50 su-top-3 su-left-3");
        avatarImageClasses.set("medium", "su-size-150 su-top-7 su-left-8");
        avatarImageClasses.set("large", "su-size-200 su-top-9 su-left-9");
        
        return avatarImageClasses.get(avatarSize);
    },
    avatarWrapperClasses: function(avatarSize) {
        const avatarWrapperClasses = new Map();
        
        avatarWrapperClasses.set("small", "su-min-w-[56px] su-w-[56px] su-h-[56px] su-p-3");
        avatarWrapperClasses.set("medium", "su-min-w-[165px] su-w-[165px] su-h-[165px] su-p-7");
        avatarWrapperClasses.set("large", "su-min-w-[218px] su-w-[218px] su-h-[218px] su-p-9");

        return avatarWrapperClasses.get(avatarSize);
    },
    cardsAlignmentClasses: function(alignment) {
        const alignClasses = new Map();
        alignClasses.set("right", "before:su-right-0 before:su-top-[-35px] before:md:su-top-0 before:md:su-right-[-36px] before:lg:su-right-[-80px]");
        alignClasses.set("left", "before:su-left-0 before:su-top-[-35px] before:md:su-top-0 before:md:su-left-[-36px] before:lg:su-left-[-80px]");
        
        return alignClasses.get(alignment);
    },
    cardsGrowClasses: function(alignment) {
        const alignClasses = new Map();
        alignClasses.set("right", "md:su-order-2");
        alignClasses.set("left", "");
        
        return alignClasses.get(alignment) || "";
    },
    containerClasses: function (options) {
        const { width = "large", paddingX = true, paddingY = "none", marginTop = "none", marginBottom = "none", customClasses } = options.hash;
        const outputClasses = ['su-mx-auto', 'su-component-container'];

        const widthClasses = new Map();
        widthClasses.set("narrow", "su-container-narrow");
        widthClasses.set("large", "su-container-large");
        widthClasses.set("wide", "su-container-wide");
        widthClasses.set("full", "su-container-full");
        widthClasses.set("cc", "su-cc");

        outputClasses.push(widthClasses.get(width));

        paddingX && outputClasses.push('su-container-px');
        
        const paddingYClasses = new Map(); 
        paddingYClasses.set("base", "su-rs-py-0");
        paddingYClasses.set("1", "su-rs-py-1");
        paddingYClasses.set("2", "su-rs-py-2");
        paddingYClasses.set("3", "su-rs-py-3");
        paddingYClasses.set("4", "su-rs-py-4");
        paddingYClasses.set("5", "su-rs-py-5");
        paddingYClasses.set("6", "su-rs-py-6");
        paddingYClasses.set("7", "su-rs-py-7");
        paddingYClasses.set("8", "su-rs-py-8");
        paddingYClasses.set("9", "su-rs-py-9");
        paddingYClasses.set("10", "su-rs-py-10");
    
        outputClasses.push(paddingYClasses.get(paddingY));

        const marginTopClasses = new Map();
        marginTopClasses.set("base", "su-rs-mt-0");
        marginTopClasses.set("1", "su-rs-mt-1");
        marginTopClasses.set("2", "su-rs-mt-2");
        marginTopClasses.set("3", "su-rs-mt-3");
        marginTopClasses.set("4", "su-rs-mt-4");
        marginTopClasses.set("5", "su-rs-mt-5");
        marginTopClasses.set("6", "su-rs-mt-6");
        marginTopClasses.set("7", "su-rs-mt-7");
        marginTopClasses.set("8", "su-rs-mt-8");
        marginTopClasses.set("9", "su-rs-mt-9");
        marginTopClasses.set("10", "su-rs-mt-10");

        outputClasses.push(marginTopClasses.get(marginTop));

        const marginBottomClasses = new Map();
        marginBottomClasses.set("base", "su-rs-mb-0");
        marginBottomClasses.set("1", "su-rs-mb-1");
        marginBottomClasses.set("2", "su-rs-mb-2");
        marginBottomClasses.set("3", "su-rs-mb-3");
        marginBottomClasses.set("4", "su-rs-mb-4");
        marginBottomClasses.set("5", "su-rs-mb-5");
        marginBottomClasses.set("6", "su-rs-mb-6");
        marginBottomClasses.set("7", "su-rs-mb-7");
        marginBottomClasses.set("8", "su-rs-mb-8");
        marginBottomClasses.set("9", "su-rs-mb-9");
        marginBottomClasses.set("10", "su-rs-mb-10");

        outputClasses.push(marginBottomClasses.get(marginBottom));

        customClasses && outputClasses.push(customClasses);

        return outputClasses.filter(Boolean).join(' ').trim();
    },
    ctaTarget: function(ctaNewWindow) {
        return ctaNewWindow ? "_blank" : undefined;
    },
    externalLinkClasses: function(ctaSize) {
        const externalLinkClass = new Map();
        externalLinkClass.set("small", "");
        externalLinkClass.set("large", "su-font-semibold su-text-21 su-leading-[26.25px]");
        
        return externalLinkClass.get(ctaSize);
    },
    featuredGridClasses: function(isNested) {
        return isNested ? "lg:su-flex-wrap lg:su-gap-[76px]" : "lg:su-gap-[160px]";
    },
    featuredGridContentClasses: function(isNested) {
        return isNested ? "md:before:su-w-full lg:before:su-w-px lg:before:su-h-full before:su-left-0 lg:before:su-left-[-38px] before:su-top-[-40px] md:before:su-top-[-36px] lg:before:su-top-0" : "before:su-left-0 before:su-top-[-40px] md:before:su-top-[-36px] lg:before:su-top-[-38px]";
    },
    featuredGridDivClasses: function(isNested, alignment) {
        const alignClasses = new Map();
        alignClasses.set("right", "before:su-right-0 before:su-top-[-35px] before:md:su-top-0 before:md:su-right-[-36px] before:lg:su-right-[-80px]");
        alignClasses.set("left", "before:su-left-0 before:su-top-[-35px] before:md:su-top-0 before:md:su-left-[-36px] before:lg:su-left-[-80px]");
        
        return isNested
          ? "lg:before:su-w-full lg:before:su-h-px before:su-left-0 before:su-top-[-40px] before:md:su-top-0 lg:before:su-top-[-38px] before:md:su-left-[-36px] before:lg:su-left-0 md:su-flex-wrap lg:su-flex-nowrap"
          : "md:su-items-start md:su-content-start " + alignClasses.get(alignment);
    },
    fontawesomePathData: function(arg1, arg2) {
        const iconSet = arg2 === "regular" ? faRegular : faSolid;
    
        if (!iconSet) return 'Icon not found';
        
        const iconObject = Object.values(iconSet).find(
            icon => icon.iconName === arg1
        );
        
        return iconObject?.icon[4] ?? 'Icon not found';
    },
    fontawesomeViewData: function(arg1, arg2) {
        if (arg2 === "regular") {
            const iconObject = Object.values(faRegular).find(icon => 
                icon.iconName === arg1
            );

            return `0 0 ${iconObject?.icon[0]} ${iconObject?.icon[1]}`;
        } else if (arg2 === "solid") {
            const iconObject = Object.values(faSolid).find(icon => 
                icon.iconName === arg1
            );

            return `0 0 ${iconObject?.icon[0]} ${iconObject?.icon[1]}`;
        } 
    },
    formatFirstWord: function (content, firstWord) {
        if (!content) return content;
        if (!firstWord) return content;

        const truncatedFirstWord = firstWord.trim().substring(1);
        
        return truncatedFirstWord.length > 0
            ? content.replace(/'/g, "'").replace("&nbsp;", " ").replace(/\s+/g, " ").replace(
                firstWord,
                `<span aria-hidden="true">${truncatedFirstWord}</span><span class="sr-only">${firstWord}</span>`
              )
            : content.replace(/'/g, "'").replace("&nbsp;", " ").replace(/\s+/g, " ").replace(
                firstWord,
                `<span class="sr-only">${firstWord}</span>`
              );
    },
    getAspectRatio: function(aspectRatio) {
        const aspectRatioClasses = new Map();
    
        aspectRatioClasses.set("card-small", 'su-aspect-[3/2]');
        aspectRatioClasses.set("card-medium", 'su-aspect-[3/2]');
        aspectRatioClasses.set("card-large", 'su-aspect-[3/2]');
        aspectRatioClasses.set("card-featured", 'su-aspect-[3/2]');
        aspectRatioClasses.set("square", 'su-aspect-[1/1]');
        aspectRatioClasses.set("video", 'su-aspect-[16/9]');
        aspectRatioClasses.set("vertical-video", 'su-aspect-[9/16]');
    
        
        return aspectRatioClasses.get(aspectRatio)
    },
    getThumbnailIconClass: function(size) {
        const thumbnailIconClasses = new Map();
    
        thumbnailIconClasses.set("small", 'su-left-13 su-bottom-13 [&>svg]:su-text-[4rem]');
        thumbnailIconClasses.set("medium", 'su-left-13 su-bottom-13 md:su-left-27 md:su-bottom-27 [&>svg]:su-text-[4rem] [&>svg]:md:su-text-[6rem]');
        thumbnailIconClasses.set("large", 'su-left-13 su-bottom-13 [&>svg]:su-text-[4rem]');
        thumbnailIconClasses.set("featured", 'su-left-13 su-bottom-13 md:su-left-27 md:su-bottom-27 [&>svg]:su-text-[4rem] [&>svg]:md:su-text-[6rem]');
        thumbnailIconClasses.set("vertical-video", 'su-z-30 su-left-32 su-bottom-34 sm:su-left-48 sm:su-bottom-61 lg:su-left-32 lg:su-bottom-34 2xl:su-left-48 2xl:su-bottom-61 [&>svg]:su-text-[6rem]');
        
        return thumbnailIconClasses.get(size)
    },
    hasFirstItem: function(items) {
        return Array.isArray(items) && items.length > 0;
    },
    ifEquals: function (arg1, arg2, options) {
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    },
    increment: function(value) {
        return value + 1;
    },
    imageBackgroundClasses: function(variant) {
        const backgroundClasses = new Map();
        backgroundClasses.set("Grey", "su-bg-fog-light su-rs-pt-6 su-rs-pb-8 dark:su-bg-black/[0.5]");
        backgroundClasses.set("Transparent", "");
        
        return backgroundClasses.get(variant) || '';
    },
    isValidUrl: function(value, options) {
        const urlPattern = /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/.*)?$/;
    
        if (typeof value === "string" && urlPattern.test(value)) {
            return options.fn ? options.fn(this) : true;
        }
        return options.inverse ? options.inverse(this) : false;
    },
    linkButtonClasses: function(variant = "default", size = "default", customClasses = "") {
        const baseClasses = ['su-group su-flex su-items-center su-w-fit hocus:su-underline'];
        
        const sizeClasses = new Map(); 

        sizeClasses.set('default','su-px-30 su-pt-12 su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1');
        sizeClasses.set('large','su-rs-py-0 su-rs-px-4 su-font-semibold su-type-1 dark:hocus:su-ring-2');
         
        baseClasses.push(sizeClasses.get(size));

        const variantClasses =  new Map(); 

        variantClasses.set('default','su-button dark:hocus:su-ring-white');
        variantClasses.set('gradient','su-text-white hocus:su-text-white su-no-underline hocus:su-underline su-bg-gradient-to-r su-from-digital-red-light su-to-cardinal-red-dark hocus:su-bg-none hocus:su-bg-black dark:su-from-olive dark:su-to-palo-verde dark:su-text-black-true dark:hocus:su-text-white dark:hocus:su-ring-white');

        baseClasses.push(variantClasses.get(variant));

        baseClasses.push(customClasses);

        return baseClasses.join(' ').trim();
    },
    linkedHeadingHeaderClasses: function(isAlwaysLight) {
        return isAlwaysLight ? "su-text-white" : "su-text-black";
    },

    multicolumnGridClasses: function(columns, separator) {
        const gapClasses = new Map();
        gapClasses.set(
          2,
          separator
            ? "su-gap-[68px] md:su-gap-72 lg:su-gap-[160px]"
            : "su-gap-34 md:su-gap-72 lg:su-gap-[160px]"
        );
        gapClasses.set(
          3,
          separator
            ? "su-gap-[68px] md:su-gap-72 lg:su-gap-[102px]"
            : "su-gap-34 md:su-gap-72 lg:su-gap-[160px]"
        );

        return gapClasses.get(columns)
    },
    removeParagraphTags: function(text) {
        return text.replace(/<p>|<\/p>/g, "");
    },
    titleStateClass: function(hasTitle) {
        return hasTitle ? "has-title" : "has-no-title";
    },
    unlessEquals: function (arg1, arg2, options) {
        return arg1 != arg2 ? options.fn(this) : options.inverse(this);
    },
    variantClasses: function(variant) {
        const variantClasses = new Map()

        variantClasses.set('Featured Story', '*:su-text-20 md:*:su-text-25 lg:*:su-text-26 su-font-serif su-font-medium');
        variantClasses.set('Basic Story', 'su-story-first-letter *:su-text-18 md:*:su-text-23');
        
        return variantClasses.get(variant);
    },
    headingTag: function(tagName) {
        if (tagName == null) return 'h2';
        
        const sanitizedTagName = (tagName || '').toString().trim();
        
        if (sanitizedTagName === 'p') return 'p';
        
        if (!sanitizedTagName.match(/^h[1-6]$/)) {
            return 'h2';
        }
        
        return sanitizedTagName;
    },
    horizontalCardOrientation: function(orientation) {
        const orientationClasses = new Map();

        orientationClasses.set("vertical", "su-grid-cols-1 su-gap-36 md:su-gap-27");
        orientationClasses.set("horizontal", "su-grid-cols-1 md:su-grid-cols-2 lg:su-grid-cols-3 su-gap-34 md:su-gap-36 lg:su-gap-48");
        orientationClasses.set("topiclisting", "su-grid-cols-1 su-gap-30 md:su-gap-48 lg:su-gap-61");
        
        return orientationClasses.get(orientation);
    },
    sidebarHeadingClasses: function(color) {
        const colorClassMap = new Map();
        colorClassMap.set(
            "grey",
            "su-text-black-90 dark:su-text-white su-font-semibold su-text-18 su-items-end"
        );
        colorClassMap.set(
            "black",
            "su-text-black dark:su-text-white su-font-bold su-text-20 md:su-text-28 su-items-start"
        );
        colorClassMap.set(
            "media",
            "su-text-black-90 dark:su-text-black-20 su-font-semibold su-text-18 su-items-center"
        );

        return colorClassMap.get(color) || colorClassMap.get("grey");
    },
    getStringByCondition: function(options) {
        const { value, expectedValue, trueResult, falseResult } = options.hash;
    
        return value === expectedValue ? trueResult : falseResult;
    },
    getStringForLastIndex:  function (options) {
        const {array, index, trueResult, falseResult } = options.hash;

        return Array.isArray(array) && index === array.length - 1 ? trueResult : falseResult;
    },
    concatClasses: function(str1, str2) {
        if (!str2) {
            return str1
        } else {
            return (str1 + ' ' + str2)
        }
    },
    cardTitleSizeClasses: function(cardSize) {
        const titleSize = new Map();

        titleSize.set("featured", "su-text-[35px] md:su-text-[40px] lg:su-text-[43px] su-leading-[42px] md:su-leading-[48px] lg:su-leading-[51.6px]");
        titleSize.set("medium", "su-text-21 lg:su-text-[33px] su-leading-[25.2px] lg:su-leading-[39.6px]");
        titleSize.set("default", "su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px]");
        
        const size = cardSize === "featured" || cardSize === "medium" ? cardSize : "default";
        return titleSize.get(size);
    },
    cardTaxonomySizeClasses: function (cardSize) {
        const taxonomySize = new Map();
        
        taxonomySize.set("featured", "su-text-20 md:su-text-20 su-leading-[26px]")
        taxonomySize.set("medium", "su-text-16 md:su-text-16 md:su-text-20 su-leading-[20.8px] md:su-leading-[26px]");
        taxonomySize.set("default", "su-text-18 su-leading-[23.4px]");

        const size = cardSize === "featured" || cardSize === "medium" ? cardSize : "default";
        return taxonomySize.get(size);
    },
    cardTypeSizeClasses: function(cardSize) {
        const typeSize = new Map();
        
        typeSize.set("featured", "su-text-18 su-leading-[23.4px] md:su-text-20 md:su-leading-[26px] lg:su-text-20 lg:su-leading-[26px]")
        typeSize.set("medium", "su-text-16 su-leading-[20.8px] lg:su-text-18 lg:su-leading-[23.4px]");
        typeSize.set("default", "su-text-16 su-leading-[20.8px]");

        const size = cardSize === "featured" || cardSize === "medium" ? cardSize : "default";
        return typeSize.get(size);
    },
    unescapeHtml: function (text) {
        return text.replace(/&lt;/g, '<')
                   .replace(/&gt;/g, '>')
                   .replace(/&amp;/g, '&')
                   .replace(/&quot;/g, '"')
                   .replace(/&#039;/g, "'")
                   .replace(/&rsquo;/g, "’")
                   .replace(/&ldquo;/g, '“')
                   .replace(/&rdquo;/g, '”');
    },
    getStringIfGreater: function (options) {
        const { value, expectedValue, trueResult, falseResult } = options.hash;
        return value > expectedValue ? trueResult : falseResult;
    }
}
  
export default helpers;