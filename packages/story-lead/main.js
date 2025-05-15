import storyLeadTemplate from './story-lead.hbs';
import { getFirstWord } from '../../global/js/utils';
import { isEditor } from "../../global/js/utils/isEditor";


export default {
    async main(args, info) {
        // Extracting functions from provided info
        const fnsCtx = info?.fns || info?.ctx || {};
        const { ctx } = info;

        // Extracting configuration data from arguments
        const { content, variant } = args || {};
        const editMode = isEditor(ctx.url);

        // Validate required functions
        try {
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Story lead component: ', er);
            return `<!-- Error occurred in the Story lead component: ${er.message} -->`;
        }


          // Validate required fields and ensure correct data types
        try {
            if (content && typeof content !== 'string') {
                throw new Error(
                    `The "content" field must be a string. The ${JSON.stringify(content)} was received.`
                );
            }
            if (variant && !['Basic Story', 'Featured Story'].includes(variant)) {
                throw new Error(
                    `The "variant" field must be one of ["Basic Story", "Featured Story"]. The ${JSON.stringify(variant)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Story lead component: ', er);
            return `<!-- Error occurred in the Story lead component: ${er.message} -->`;
        }

        const isFeaturedStory = variant === "Featured Story";
        const firstWord = getFirstWord(content);
        const firstLetter = content ? firstWord[0].toLowerCase() : '';

        const componentData = {
            content: content,
            firstWord,
            firstLetter,
            isFeaturedStory,
            variant,
            width: "narrow",
            editMode
        };

        return storyLeadTemplate(componentData);
    }
};
