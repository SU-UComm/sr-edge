export const helpers = {
    alignClass: function(align) {
        const alignClasses = new Map();
        alignClasses.set("right", "md:su-order-2");
        alignClasses.set("left", "");
        
        return alignClasses.get(align) || "";
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
    containerClasses: function(width = "large", paddingX = true, paddingY = "none", marginTop = "default", marginBottom = "default", customClasses) {   
        const outputClasses = ['su-mx-auto', 'su-component-container'];

        const widthClasses = new Map();
        widthClasses.set("none", "");
        widthClasses.set("narrow", "su-container-narrow");
        widthClasses.set("large", "su-container-large");
        widthClasses.set("wide", "su-container-wide");
        widthClasses.set("full", "su-container-full");
        widthClasses.set("cc", "su-cc");

        outputClasses.push(widthClasses.get(width));

        paddingX && outputClasses.push('su-container-px');
        
        const paddingYClasses = new Map(); 
        paddingYClasses.set("none", "");
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
        marginTopClasses.set("default", "");
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
        marginBottomClasses.set("default", "");
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

        return outputClasses.join(' ').trim();
    },
    ctaTarget: function(ctaNewWindow) {
        return ctaNewWindow ? "_blank" : undefined;
    },
    externalLinkClasses: function(ctaSize) {
        const externalLinkClass = new Map();
        externalLinkClass.set("small", "");
        externalLinkClass.set("su-font-semibold su-text-21 su-leading-[26.25px]");
        
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
        const iconObject = Object.values(fas).find(icon => 
            icon.iconName === arg1 && icon.prefix === arg2
        );
        
        return iconObject?.icon[4] || 'Icon not found';
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
    hasFirstItem: function(items) {
        return Array.isArray(items) && items.length > 0;
    },
    ifEquals: function (arg1, arg2, options) {
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    },
    increment: function(value) {
        return value + 1;
    },
    linkButtonClasses: function(variant, size) {
        const baseClasses = ['su-group su-flex su-items-center su-w-fit hocus:su-underline'];
        
        const sizeClasses = new Map(); 

        sizeClasses.set('default','md:su-px-30 md:su-pt-12 md:su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1');
        sizeClasses.set('large','su-rs-py-0 su-rs-px-4 su-font-semibold su-type-1 dark:hocus:su-ring-2');
         
        baseClasses.push(sizeClasses.get(size));

        const variantClasses =  new Map(); 

        variantClasses.set('default','su-button dark:hocus:su-ring-white');
        variantClasses.set('gradient','su-text-white hocus:su-text-white su-no-underline hocus:su-underline su-bg-gradient-to-r su-from-digital-red-light su-to-cardinal-red-dark hocus:su-bg-none hocus:su-bg-black dark:su-from-olive dark:su-to-palo-verde dark:su-text-black-true dark:hocus:su-text-white dark:hocus:su-ring-white');

        baseClasses.push(variantClasses.get(variant));

        return baseClasses.join(' ').trim();
    },
    linkedHeadingAClasses: function(isAlwaysLight) {
        const headingClasses = new Map();

        headingClasses.set(true, 'su-text-white hocus:su-text-white/95 dark:hocus:su-text-white/95');
        headingClasses.set(false, 'su-text-black hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red');
        
        return headingClasses.get(isAlwaysLight)
    },
    linkedHeadingHeaderClasses: function(isAlwaysLight) {
        return isAlwaysLight ? "su-text-white" : "su-text-black";
    },
    removeParagraphTags: function(text) {
        return text.replace(/<p>|<\/p>/g, "");
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
    gtOne: function(value) {
        return value > 1;
    }
}
  
export default helpers;