import { processEditor } from '../../global/js/utils/processEditor';
import { basicAssetUri } from '../../global/js/utils';
import componentTemplate from './example-component.hbs';

export default {
    
    async main(args, info) {

        // component functions
        const componentFunctions = info?.fns || null;
        // component context
        const componentContext = info?.ctx || null;
        // component environment variables
        const componentEnvironment = info?.env || null;

        let { title, description, image } = args || {};

        // get the current page asset id
        const currentPage = componentContext?.assetId || null;

        // context value to determine if the component is being edited
        const squizEdit = componentContext?.editor || false;

        // Provide some defaults if squizEdit is true
        if (squizEdit) {
            // Add fallback values for inline edit
            title = title || 'Title text';
            description = description || 'Add content';
            image = image || 'matrix-asset://StanfordNews/172387';
        }

        // Resolve image asset URI
        let imageData = null;
        if (image) {
            try {
                imageData = await componentFunctions.resolveUri(image);
            } catch (er) {
                imageData = null;
            }
        }

        // component data for template rendering
        const componentData = {
            title: title, 
            description: description, 
            image: imageData,
            currentPage: currentPage
        };

        // return frontend code
        if (!squizEdit) return componentTemplate(componentData);

        // return edit code
        return processEditor(componentTemplate(componentData), squizEditTargets);

    }
};

