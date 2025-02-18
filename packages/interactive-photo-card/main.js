import interactivePhotoCard from './interactive-photo-card.hbs';
import { basicAssetUri } from "../../global/js/utils";
import { ArrowsRotate, Plus } from "../../global/js/helpers/SVG-library";

export default {
    async main( args, info ) {
        const fnsCtx = info?.fns || info?.ctx || {};
        const { title, eyebrow, content, image, imageAlignment } = args || {};

        // Check for environment
         try {
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Interactive photo card component: ', er);
            return `<!-- Error occurred in the Interactive photo card component: ${er.message} -->`;
        }

        // Validating fields
        try {
            if (typeof title !== 'string' || title === '') {
                throw new Error(
                    `The "title" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(title)} was received.`,
                );
            }
            if (typeof content !== 'string' || content === '') {
                throw new Error(
                    `The "content" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(content)} was received.`,
                );
            }
            if (typeof image !== 'string' || image === '') {
                throw new Error(
                    `The "image" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(image)} was received.`,
                );
            }
            if (eyebrow && (typeof eyebrow !== 'string')) {
                throw new Error(
                    `The "eyebrow" field must be a string. The ${JSON.stringify(eyebrow)} was received.`,
                );
            }
            if (imageAlignment && !["left", "right"].includes(imageAlignment) ) {
                throw new Error(
                    `The "imageAlignment" field cannot be undefined and must be one of ["left", "right"]. The ${JSON.stringify(imageAlignment)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Interactive photo card component: ', er);
            return `<!-- Error occurred in the Interactive photo card component: ${er.message} -->`;
        }

        const imageData = await basicAssetUri(info.fns, image);

        const props = {
            title,
            eyebrow,
            content,
            imageUrl: imageData?.url,
            contentAlignmentClass: imageAlignment === 'left' ? 'xl:su-order-2' : '',
            imageAlignmentClass: imageAlignment === 'left' ? 'xl:su-order-first' : '',
            plus: Plus({
                className: "su-size-30 md:su-size-50 su-fill-none group-hover/front:su-scale-110 group-focus-within/front:su-scale-110 su-transition-transform"
            }),
            arrow: ArrowsRotate({
                className: "su-size-30 lg:su-size-36 su-fill-none group-hover/back:su-rotate-45 su-transition-transform"
            })
        };

        return interactivePhotoCard(props);
    },
};