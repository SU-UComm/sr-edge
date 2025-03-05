export const helpers = {
    ifEquals: function (arg1, arg2, options) {
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    },
    unlessEquals: function (arg1, arg2, options) {
        return arg1 != arg2 ? options.fn(this) : options.inverse(this);
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

    avatarWrapperClasses: function(avatarSize) {
        const avatarWrapperClasses = new Map();
        
        avatarWrapperClasses.set("small", "su-min-w-[56px] su-w-[56px] su-h-[56px] su-p-3");
        avatarWrapperClasses.set("medium", "su-min-w-[165px] su-w-[165px] su-h-[165px] su-p-7");
        avatarWrapperClasses.set("large", "su-min-w-[218px] su-w-[218px] su-h-[218px] su-p-9");

        return avatarWrapperClasses.get(avatarSize);
    },
    avatarImageClasses: function(avatarSize) {
        const avatarImageClasses = new Map();

        avatarImageClasses.set("small", "su-w-50 su-h-50 su-top-3 su-left-3");
        avatarImageClasses.set("medium", "su-size-150 su-top-7 su-left-8");
        avatarImageClasses.set("large", "su-size-200 su-top-9 su-left-9");
        
        return avatarImageClasses.get(avatarSize);
    },
    gtOne: function(value) {
        return value > 1;
    }
}
  
export default helpers;