import { processEditor } from '../../global/js/utils/processEditor';
import componentTemplate from './component-template-se.hbs';

export default {
    
    async main(args, info) {

        // component functions
        const componentFunctions = info?.fns || null;
        // component context
        const componentContext = info?.ctx || null;
        // component environment variables
        const componentEnvironment = info?.env || null;

        // component input
        let { title, description, image } = args || {};

        // The current page asset id (if needed)
        const currentPage = componentContext?.assetId || null;

        // context value to determine if the component is being edited
        const squizEdit = componentContext?.editor || false;
        const squizEditTargets = {
            "titleTarget": {
                "field": "title"
            },
            "descriptionTarget": {
                "field": "description"
            }
        };
        // Provide some defaults if squizEdit is true
        if (squizEdit) {
            // Add fallback values for inline edit
            // allows for graceful degradation in edit mode
            
            // when title is empty, the component will display a default title
            title = title || 'Title text';
            // when description is empty, the component will display a default description
            description = description || 'Add content';
            // when image is empty, the component will display a default image
            // matrix asset uri example
            image = image || 'matrix-asset://StanfordNews/172387';
        }

        // Resolve image asset URI
        let imageData = null;
        if (image) {
            try {
                imageData = await componentFunctions.resolveUri(image);
            } catch (er) {
                console.error(er);
                imageData = null;
            }
        }

        // component data for template rendering
        const componentData = {
            title: title, 
            description: description, 
            image: imageData,
            currentPage: currentPage,
            editing: squizEdit
        };

        // return frontend code
        if (!squizEdit) return componentTemplate(componentData);

        // return edit code
        return processEditor(componentTemplate(componentData), squizEditTargets);

    }
};

