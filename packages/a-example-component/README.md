# Example Component Development Guide

This component serves as a template and guide for developing new Stanford APB components. Copy this directory structure to create new components following established patterns.

## Typical Component Structure

```
a-example-component/
├── component-template.hbs          # Main template (production)
├── main.js                       # Production component logic
├── manifest.json                 # Component configuration
├── example-data/                 # Preview data
├── mocked-uris/                  # Mocked asset data for development
├── previews/                     # Preview HTML templates
└── styles.scss                   # Component-specific styles
```

## Key Files Explained

### Templates

- **`example-component.hbs`**: Production template with standard data attributes
- **`example-component-se.hbs`**: Template with `data-se` attributes for inline editing

### JavaScript Files

- **`main.js`**: Basic component logic with standard inline editing capabilities
- **`main-se.js`**: Enhanced logic with `processEditor` for advanced inline editing (primary approach used in this repo)

### Configuration

- **`manifest.json`**: Defines component metadata, inputs, outputs, and previews
- **`example-data/preview.data.json`**: Sample data for component previews
- **`mocked-uris/`**: Mocked asset data for development and testing

## Component Logic Patterns

### Basic Component with Standard Inline Editing (main.js)

This approach provides standard inline editing capabilities using `data-sq-field` attributes.

```javascript
import componentTemplate from './example-component.hbs';

export default {
    async main(args, info) {
        // Extract component functions and context
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        
        // Extract input parameters
        let { title, description, image } = args || {};
        
        // Check if in edit mode
        const squizEdit = componentContext?.editor || false;
        
        // Provide fallback values for edit mode
        if (squizEdit) {
            title = title || 'Title text';
            description = description || 'Add content';
            image = image || 'matrix-asset://StanfordNews/172387';
        }
        
        // Process assets
        let imageData = null;
        if (image) {
            try {
                imageData = await componentFunctions.resolveUri(image);
            } catch (er) {
                console.error(er);
                imageData = null;
            }
        }
        
        // Prepare component data
        const componentData = {
            title, 
            description, 
            image: imageData,
            editing: squizEdit
        };
        
        return componentTemplate(componentData);
    }
};
```

### Enhanced Component with Advanced Inline Editing (main-se.js)

**This is the primary approach used in this repository.** It uses the `processEditor` utility for enhanced inline editing capabilities and is designed for components that benefit from advanced editing features.

```javascript
import { processEditor } from '../../global/js/utils/processEditor';
import componentTemplate from './example-component-se.hbs';

export default {
    async main(args, info) {
        // Same setup as standard component
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const componentEnvironment = info?.env || null;
        
        let { title, description, image } = args || {};
        const currentPage = componentContext?.assetId || null;
        const squizEdit = componentContext?.editor || false;
        
        // Define inline editing targets
        const squizEditTargets = {
            "titleTarget": { "field": "title" },
            "descriptionTarget": { "field": "description" }
        };
        
        // Fallback values for edit mode
        if (squizEdit) {
            title = title || 'Title text';
            description = description || 'Add content';
            image = image || 'matrix-asset://StanfordNews/172387';
        }
        
        // Process assets and prepare data
        let imageData = null;
        if (image) {
            try {
                imageData = await componentFunctions.resolveUri(image);
            } catch (er) {
                console.error(er);
                imageData = null;
            }
        }
        
        const componentData = {
            title, 
            description, 
            image: imageData,
            currentPage,
            editing: squizEdit
        };
        
        // Return appropriate output based on edit mode
        if (!squizEdit) return componentTemplate(componentData);
        return processEditor(componentTemplate(componentData), squizEditTargets);
    }
};
```

## Useful Fallback Patterns

### Text Content Fallbacks

```javascript
// Basic text fallbacks
title = title || 'Title text';
description = description || 'Add content';
eyebrow = eyebrow || 'Category';
linkText = linkText || 'Learn more';

// Conditional text with context
title = title || (squizEdit ? 'Enter title here' : '');
description = description || (squizEdit ? 'Add description content' : '');
```

### Asset Fallbacks

```javascript
// Image fallbacks
image = image || 'matrix-asset://StanfordNews/172387';
video = video || 'matrix-asset://StanfordNews/123456';

// Multiple asset fallbacks
primaryImage = primaryImage || secondaryImage || 'matrix-asset://StanfordNews/172387';
```

### Array and Object Fallbacks

```javascript
// Array fallbacks
items = items || [];
cards = cards || [];
links = links || [];

// Object fallbacks with defaults
config = config || {};
config.theme = config.theme || 'light';
config.alignment = config.alignment || 'left';

// Nested object fallbacks
imageData = imageData || {};
imageData.url = imageData.url || '';
imageData.alt = imageData.alt || 'Image description';
```

### Boolean and Number Fallbacks

```javascript
// Boolean fallbacks
isVisible = isVisible !== undefined ? isVisible : true;
isExternal = isExternal || false;
showImage = showImage !== false; // Defaults to true

// Number fallbacks
maxItems = maxItems || 10;
columns = columns || 3;
height = height || 400;
```

## Template Patterns

### Standard Template (example-component.hbs)

```handlebars
<section data-component='example-component'>
    <article class="su-group su-relative su-w-full su-flex su-flex-col su-break-words su-rounded-[8px] su-rs-pt-5 su-rs-px-4 su-max-w-900 su-mx-auto su-transition-shadow su-border dark:su-border-2 su-border-black-30/30 dark:su-border-black su-shadow dark:su-shadow-black/80 su-bg-white dark:su-bg-black-true su-text-black dark:su-text-white su-rs-pb-5">
        {{#if title}}
            <h2 class="su-type-5 md:su-type-4 2xl:su-type-3 su-mb-0 su-font-sans su-text-black dark:su-text-white">
                {{#if editing}}
                    <span data-sq-field="title">{{unescapeHtml title}}</span>
                {{else}}
                    {{unescapeHtml title}}
                {{/if}}
            </h2>
        {{/if}}

        {{#if description}}
            <div data-sq-field="description" class="su-text-black dark:su-text-white su-big-paragraph su-rs-mt-4 *:su-leading-snug *:last:su-mb-0">
                {{{unescapeHtml description}}}
            </div>
        {{/if}}

        {{#if image}}
            <div class="su-rs-mt-4 su-rounded-[8px] su-overflow-hidden">
                <img data-sq-field="image" 
                     src="{{image.url}}" 
                     alt="{{image.attributes.alt}}" 
                     width="{{image.attributes.width}}" 
                     height="{{image.attributes.height}}"
                     class="su-w-full su-h-auto su-object-cover">
            </div>
        {{/if}}
    </article>
</section>
```

### Inline Editing Template (example-component-se.hbs)

```handlebars
<section data-component='example-component'>
    <article class="su-group su-relative su-w-full su-flex su-flex-col su-break-words su-rounded-[8px] su-rs-pt-5 su-rs-px-4 su-max-w-900 su-mx-auto su-transition-shadow su-border dark:su-border-2 su-border-black-30/30 dark:su-border-black su-shadow dark:su-shadow-black/80 su-bg-white dark:su-bg-black-true su-text-black dark:su-text-white su-rs-pb-5">
        {{#if title}}
            <h2 class="su-type-5 md:su-type-4 2xl:su-type-3 su-mb-0 su-font-sans su-text-black dark:su-text-white">
                {{#if editing}}
                    <span data-se="titleTarget">{{unescapeHtml title}}</span>
                {{else}}
                    {{unescapeHtml title}}
                {{/if}}
            </h2>
        {{/if}}

        {{#if description}}
            <div data-se="descriptionTarget" class="su-text-black dark:su-text-white su-big-paragraph su-rs-mt-4 *:su-leading-snug *:last:su-mb-0">
                {{{unescapeHtml description}}}
            </div>
        {{/if}}

        {{#if image}}
            <div class="su-rs-mt-4 su-rounded-[8px] su-overflow-hidden">
                <img data-sq-field="image" 
                     src="{{image.url}}" 
                     alt="{{image.attributes.alt}}" 
                     width="{{image.attributes.width}}" 
                     height="{{image.attributes.height}}"
                     class="su-w-full su-h-auto su-object-cover">
            </div>
        {{/if}}
    </article>
</section>
```

## Key Differences: Basic vs Enhanced Approaches

| Aspect | Basic (main.js) | Enhanced (main-se.js) |
|--------|----------------|----------------------|
| Use Case | Simple components | **Primary approach for this repo** |
| Template | `example-component.hbs` | `example-component-se.hbs` |
| Data attributes | `data-sq-field` | `data-se` |
| Editor processing | Basic inline editing | `processEditor()` utility |
| Edit targets | No | `squizEditTargets` object |
| Fallback handling | Standard | Enhanced for edit mode |
| Complexity | Simple | Advanced |


## Development Workflow

1. **Copy this directory** to create a new component
2. **Rename files** to match your component name
3. **Update manifest.json** with your component details
4. **Choose your approach**:
   - **For simple components**: Use `main.js` pattern (basic approach)
   - **For most components**: Use `main-se.js` pattern (enhanced approach - primary for this repo)
5. **Modify templates** to match your design requirements
6. **Add fallback patterns** for all input parameters
7. **Test both standard and inline editing modes**
8. **Update preview data** with realistic content

## Best Practices

- **Use the enhanced approach** (`main-se.js`) as the primary pattern for this repository
- **Use the basic approach** (`main.js`) for simple components that don't need advanced editing features
- Always provide fallback values for all inputs
- Use Stanford's design system classes consistently
- Support both light and dark modes
- Include proper accessibility attributes
- Test with various content scenarios
- Document any component-specific requirements 