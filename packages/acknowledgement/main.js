import { containerClasses } from '../../global/js/utils';
import acknowledgement from './acknowledgement.hbs';

export default {
    async main( args ) {
        const { title, content } = args || {};

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
        } catch (er) {
            console.error('Error occurred in the Acknowledgement component: ', er);
            return `<!-- Error occurred in the Acknowledgement component: ${er.message} -->`;
        }

        const props = {
            classes: containerClasses({width: "narrow", paddingX: false}),
            title,
            content
        };

        return acknowledgement(props);
    },
};