import storyLeadTemplate from './story-lead.hbs';
import {
    LetterA,
    LetterB,
    LetterC,
    LetterD,
    LetterE,
    LetterF,
    LetterG,
    LetterH,
    LetterI,
    LetterJ,
    LetterK,
    LetterL,
    LetterM,
    LetterN,
    LetterO,
    LetterP,
    LetterQ,
    LetterR,
    LetterS,
    LetterT,
    LetterU,
    LetterV,
    LetterW,
    LetterX,
    LetterY,
    LetterZ,
} from "../../global/js/helpers/SVG-library";

const letterSvgs = new Map([
    ['a', LetterA],
    ['b', LetterB],
    ['c', LetterC],
    ['d', LetterD],
    ['e', LetterE],
    ['f', LetterF],
    ['g', LetterG],
    ['h', LetterH],
    ['i', LetterI],
    ['j', LetterJ],
    ['k', LetterK],
    ['l', LetterL],
    ['m', LetterM],
    ['n', LetterN],
    ['o', LetterO],
    ['p', LetterP],
    ['q', LetterQ],
    ['r', LetterR],
    ['s', LetterS],
    ['t', LetterT],
    ['u', LetterU],
    ['v', LetterV],
    ['w', LetterW],
    ['x', LetterX],
    ['y', LetterY],
    ['z', LetterZ]
]);

export default {
    async main(args, info) {
        // Extracting functions from provided info
        const fnsCtx = info?.fns || info?.ctx || {};

        // Extracting configuration data from arguments
        const { content, variant } = args || {};

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

        let formattedContent = content ? content.replace(/'/g, "'").replace("&nbsp;", " ").replace(/\s+/g, " ") : "";

        let selectedSvg = null;
        const isFeaturedStory = variant === "Featured Story";

        if (content !== null && content !== undefined) {
            const textContent = formattedContent.replace(/(<([^>]+)>)/gi, "");
            const firstWord = textContent.trim().split(" ")[0];
            const firstLetter = firstWord[0];
            const svgFunction = letterSvgs.get(firstLetter.toLowerCase());
            selectedSvg = svgFunction ? svgFunction() : null;

            if (isFeaturedStory) {
                const truncatedFirstWord = firstWord.trim().substring(1);
                formattedContent = truncatedFirstWord.length > 0
                ? formattedContent.replace(
                    firstWord,
                    `<span aria-hidden="true">${truncatedFirstWord}</span><span class="sr-only">${firstWord}</span>`
                    )
                : formattedContent.replace(
                    firstWord,
                    `<span class="sr-only">${firstWord}</span>`
                    );
            }
        }

        const componentData = {
            content: formattedContent,
            isFeaturedStory,
            letterSvg: selectedSvg,
            variant,
            width: "narrow"
        };

        return storyLeadTemplate(componentData);
    }
};
