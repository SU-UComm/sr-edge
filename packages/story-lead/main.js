import storyLeadTemplate from './story-lead.hbs';
import { getFirstWord } from '../../global/js/utils';
import { processEditor } from '../../global/js/utils/processEditor';


export default {
    async main(args, info) {
        
        const componentContext = info?.ctx || null;
        const squizEdit = componentContext?.editor || false;

        let { content, variant } = args || {};

        if(squizEdit) {
            content = content || "Add content";
        }

        if(!squizEdit) {
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
        }

        const isFeaturedStory = variant === "Featured Story";
        const firstWord = getFirstWord(content);
        const firstLetter = content ? firstWord[0].toLowerCase() : '';

        const componentData = {
            content,
            firstWord,
            firstLetter,
            isFeaturedStory,
            variant,
            width: "narrow"
        };

        // Configure squizEditTargets for inline editing
        const squizEditTargets = {
            "content": { "field": "content" }
        };

        // Early return for non-edit mode
        if (!squizEdit) {
            return storyLeadTemplate(componentData);
        }

        // Process and return template with inline editing support
        return processEditor(storyLeadTemplate(componentData), squizEditTargets);
    }
};
