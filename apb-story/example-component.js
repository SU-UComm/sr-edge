/**
 * Complete Example Component - Demonstrates all Page Builder concepts
 * This component showcases proper inline editing implementation with the new ctx.editor approach
 */

import { html } from '../../utils/html';
// Note: No longer need to import isEditor utility!

export default {
    async main(args, info) {
        // 1. Extract and validate inputs with meaningful defaults
        const { content = {}, config = {} } = args || {};
        
        // Content fields (typically inline editable)
        const {
            title = '',
            description = '',
            features = [],
            image = null,
            link = null
        } = content;
        
        // Configuration fields (typically quick options)
        const {
            theme = 'light',
            showImage = true,
            maxFeatures = 6,
            alignment = 'center'
        } = config;

        // 2. Detect edit mode using the new ctx.editor property
        const editMode = info?.ctx?.editor;

        // 3. Helper functions for different content types
        const renderFeatures = () => {
            // Always show placeholder in edit mode for empty arrays
            if (features.length === 0 && editMode) {
                return html`
                    <div class="features-placeholder" data-sq-field="content.features">
                        <p class="placeholder-text">Click to add features</p>
                    </div>
                `;
            }
            
            // Limit features based on config
            const limitedFeatures = features.slice(0, maxFeatures);
            
            return limitedFeatures.map((feature, index) => html`
                <div class="feature" data-sq-field="content.features[${index}]">
                    <h3 data-sq-field="content.features[${index}].title">
                        ${feature.title || (editMode ? 'Add feature title' : '')}
                    </h3>
                    <p data-sq-field="content.features[${index}].description">
                        ${feature.description || (editMode ? 'Add feature description' : '')}
                    </p>
                </div>
            `).join('');
        };

        const renderImage = () => {
            if (editMode) {
                return html`
                    <div class="image-container" data-sq-field="content.image">
                        ${image?.imageVariations?.original?.url 
                            ? html`
                                <img 
                                    src="${image.imageVariations.original.url}" 
                                    alt="${image.alt || ''}"
                                    class="component-image"
                                />
                                ${image.caption ? html`<p class="image-caption">${image.caption}</p>` : ''}
                            `
                            : html`<div class="image-placeholder">Click to add image</div>`
                        }
                    </div>
                `;
            } else {
                // Frontend mode - only show if image exists
                return image?.imageVariations?.original?.url ? html`
                    <div class="image-container">
                        <img 
                            src="${image.imageVariations.original.url}" 
                            alt="${image.alt || ''}"
                            class="component-image"
                        />
                        ${image.caption ? html`<p class="image-caption">${image.caption}</p>` : ''}
                    </div>
                ` : '';
            }
        };

        const renderLink = () => {
            if (editMode) {
                return html`
                    <div class="link-container" data-sq-field="content.link">
                        ${link?.url 
                            ? html`
                                <a href="${link.url}" ${link.target ? `target="${link.target}"` : ''} class="component-link">
                                    ${link.text || 'Learn More'}
                                </a>
                            `
                            : html`<div class="link-placeholder">Click to add link</div>`
                        }
                    </div>
                `;
            } else {
                // Frontend mode - only show if link exists
                return link?.url ? html`
                    <div class="link-container">
                        <a href="${link.url}" ${link.target ? `target="${link.target}"` : ''} class="component-link">
                            ${link.text || 'Learn More'}
                        </a>
                    </div>
                ` : '';
            }
        };

        // 4. Main component rendering
        const componentClasses = `component theme-${theme} align-${alignment}`;
        const componentId = `component-${Date.now()}`;

        if (editMode) {
            // Edit mode: Always show elements with data-sq-field attributes
            return html`
                <section class="${componentClasses}" id="${componentId}">
                    <div class="component-content">
                        <h1 data-sq-field="content.title" class="component-title">
                            ${title || 'Add your title here'}
                        </h1>
                        
                        <div data-sq-field="content.description" class="component-description">
                            ${description || '<p>Add your description here</p>'}
                        </div>
                        
                        ${showImage ? renderImage() : ''}
                        
                        <div class="features-grid">
                            ${renderFeatures()}
                        </div>
                        
                        ${renderLink()}
                    </div>
                </section>
            `;
        } else {
            // Frontend mode: Conditional rendering, clean output
            return html`
                <section class="${componentClasses}" id="${componentId}">
                    <div class="component-content">
                        ${title ? html`<h1 class="component-title">${title}</h1>` : ''}
                        
                        ${description ? html`<div class="component-description">${description}</div>` : ''}
                        
                        ${showImage ? renderImage() : ''}
                        
                        ${features.length > 0 ? html`
                            <div class="features-grid">
                                ${renderFeatures()}
                            </div>
                        ` : ''}
                        
                        ${renderLink()}
                    </div>
                </section>
            `;
        }
    }
};

/*
Corresponding manifest.json structure:

{
    "properties": {
        "content": {
            "type": "object",
            "title": "Content Fields",
            "properties": {
                "title": {
                    "type": "string",
                    "title": "Title",
                    "default": "Amazing Component",
                    "ui:metadata": { "inlineEditable": true }
                },
                "description": {
                    "type": "FormattedText",
                    "title": "Description",
                    "default": [{"type": "tag", "tag": "p", "children": [{"type": "text", "value": "Component description"}]}],
                    "ui:metadata": { "inlineEditable": true }
                },
                "features": {
                    "type": "array",
                    "title": "Features",
                    "items": {
                        "type": "object",
                        "properties": {
                            "title": {
                                "type": "string",
                                "title": "Feature Title",
                                "ui:metadata": { "inlineEditable": true }
                            },
                            "description": {
                                "type": "string",
                                "title": "Feature Description",
                                "ui:metadata": { "inlineEditable": true }
                            }
                        }
                    }
                },
                "image": {
                    "type": "SquizImage",
                    "title": "Component Image",
                    "ui:metadata": { "inlineEditable": true }
                },
                "link": {
                    "type": "SquizLink",
                    "title": "Call to Action Link",
                    "ui:metadata": { "inlineEditable": true }
                }
            }
        },
        "config": {
            "type": "object",
            "title": "Configuration",
            "ui:metadata": { "collapsedByDefault": true },
            "properties": {
                "theme": {
                    "type": "string",
                    "title": "Color Theme",
                    "enum": ["light", "dark", "brand"],
                    "default": "light",
                    "ui:metadata": { "quickOption": true }
                },
                "showImage": {
                    "type": "boolean",
                    "title": "Show Image",
                    "default": true,
                    "ui:metadata": { "quickOption": true }
                },
                "maxFeatures": {
                    "type": "integer",
                    "title": "Maximum Features",
                    "minimum": 1,
                    "maximum": 10,
                    "default": 6
                },
                "alignment": {
                    "type": "string",
                    "title": "Content Alignment",
                    "enum": ["left", "center", "right"],
                    "default": "center",
                    "ui:metadata": { "quickOption": true }
                }
            }
        }
    }
}
*/ 