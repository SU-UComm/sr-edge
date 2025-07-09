import componentTemplate from './component-template.hbs';

export default {
    
    async main(args, info) {

        // component functions
        const componentFunctions = info?.fns || null;
        // component context
        const componentContext = info?.ctx || null;

        // component input
        let { title, description, image } = args || {};

        // context value to determine if the component is being edited
        const squizEdit = componentContext?.editor || false;

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
            editing: squizEdit
        };

        // return the component data
        return componentTemplate(componentData);
    }
};

