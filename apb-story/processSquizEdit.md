# Squiz Editor Integration Guide

## Overview
This guide shows how to modify components to support inline editing in Squiz Editor using the `processSquizEdit` utility function.

**Why This Method?** This approach is necessary because of shared global utilities that render reusable content (like cards, buttons, or other common elements). These utilities need different `data-sq-field` values depending on which component is using them, but they share the same template structure. The `processSquizEdit` method allows us to map generic `data-se` attributes in templates to specific `data-sq-field` values for each component's data structure.

For example, a shared card utility might use `data-se="description"` in its template, but Component A needs `data-sq-field="heroCards[0].description"` while Component B needs `data-sq-field="contentConfiguration.featuredDescription"`. This mapping system solves that challenge elegantly.

## Key Principles

### 1. **Minimal Changes Only - Preserve Front-End Behavior**
**CRITICAL:** Keep changes as minimal as possible and **never modify front-end output variables or values**. The goal is to enable inline editing without affecting existing front-end functionality.

**✅ DO:**
- Only add edit mode detection and early return logic
- Provide mock data in edit mode when APIs fail
- Wrap API calls in try-catch blocks for graceful fallbacks
- Use existing `data-se` attributes from shared partials
- Let existing error handling and validation remain unchanged

**❌ DON'T:**
- Modify existing front-end logic, validation, or error handling
- Change how variables are processed or transformed
- Add extensive default values or mock data for front-end mode
- Wrap existing validation logic in `!squizEdit` checks unless absolutely necessary
- Modify the structure or content of `componentData` for front-end mode

**Example - Minimal API Error Handling:**
```javascript
// Wrap API calls with minimal try-catch for edit mode fallbacks
try {
    data = await adapter.getCards();
} catch (er) {
    if (squizEdit) {
        data = [/* minimal mock data for edit mode */];
    }
    // Let natural error handling occur in front-end mode
}
```

### 2. **Static `data-se` Attributes in Templates**
Templates should use **static** `data-se` attribute values, not dynamic ones passed through partials:

**✅ CORRECT - Static attributes:**
```handlebars
<h2 data-se="title">{{title}}</h2>
<div data-se="description">{{{description}}}</div>
```

**❌ INCORRECT - Dynamic attributes:**
```handlebars
<h2{{#if titleDataSe}} data-se="{{titleDataSe}}"{{/if}}>{{title}}</h2>
<div{{#if descriptionDataSe}} data-se="{{descriptionDataSe}}"{{/if}}>{{{description}}}</div>
```

### 3. **Mapping in Component's main.js**
The component's `main.js` file maps static `data-se` attributes to actual data fields:

```javascript
squizEditTargets = {
    "title": { "field": "headingConfiguration.title" },
    "description": { "field": "contentConfiguration.featuredDescription" }
};
```

### 4. **Shared Partials Use Generic Names**
Shared partials should use generic, reusable `data-se` attribute names:

```handlebars
<!-- shared partial: card-vertical.hbs -->
<h3 data-se="title">{{title}}</h3>
<div data-se="description">{{{description}}}</div>
```

Different components can map these generic names to their specific data structures.

## Key Changes Made to Acknowledgement Component

### 1. Import the Utility Function
```javascript
import { processSquizEdit } from '../../global/js/utils/isEditor';
```
**Note:** Only import `processSquizEdit` - `isEditor` is no longer needed.

### 2. Detect Edit Mode
```javascript
        // Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
```

### 3. Make Variables Mutable
```javascript
// CHANGE: change const to let so we can modify later for squizEdit default values
let { title, content } = args || {};
```

### 4. Configure Edit Targets (Only in Edit Mode)
```javascript
let squizEditTargets = null;
if (squizEdit) {
    // Add default values if content is not provided
    content = content || '<p>Add content</p>';
    
    // Map template data-se attributes to component fields
    squizEditTargets = {
        "title": {
            "field": "title"
        },
        "content": {
            "field": "content"
        },
        "cardTitle": {
            "field": "cards",
            "array": true,
            "property": "title"
        }
    };
}
```

### 5. Simplified Return Logic
```javascript
// Prepare component data for template rendering
const componentData = {
    title,
    content,
    width: "narrow"
};

// Return original front end code when squizEdit is false, without modification
if (!squizEdit) return acknowledgement(componentData);

// Process the output to be editable in Squiz Editor
return processSquizEdit(acknowledgement(componentData), squizEditTargets);
```

## Practical Example: Button Component Implementation

Here's how the button component was updated to use the `processSquizEdit` approach:

### Updated main.js
```javascript
import { basicAssetUri, isRealExternalLink } from '../../global/js/utils';
import { processSquizEdit } from '../../global/js/utils/isEditor';
import button from './button.hbs';

export default {
    async main(args, info) {
        const fnsCtx = info?.fns || info?.ctx || {};
        
        // CHANGE: change const to let for mutability
        let { buttonText = "Button text", internalUrl, externalUrl, isNewWindow } = args || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values
            buttonText = buttonText || 'Click here';
            
            // Configure edit targets
            squizEditTargets = {
                "button": {
                    "field": "buttonText"
                }
            };
        }

        // Function validation (unchanged)
        // ... validation code ...

        // NEW: Wrap validation in !squizEdit check
        if (!squizEdit) {
            // ... existing validation logic ...
        }

        // URL processing (unchanged)
        let linkData = null;
        if (internalUrl) {
            linkData = await basicAssetUri(info.fns, internalUrl);
        }
        const buttonUrl = linkData?.url || externalUrl;

        // NEW: Skip URL validation in edit mode
        if (!squizEdit && buttonUrl === '') {
            // ... error handling ...
        }

        const componentData = {
            buttonText,
            isNewWindow,
            buttonUrl: buttonUrl || '#', // Fallback for edit mode
            isRealExternalLink: !linkData?.url && externalUrl ? isRealExternalLink(externalUrl) : false,
        };

        // NEW: Early return pattern
        if (!squizEdit) return button(componentData);

        // NEW: Process for edit mode
        return processSquizEdit(button(componentData), squizEditTargets);
    },
};
```

### Updated Template (link-button.hbs)
```handlebars
{{#if buttonUrl}}
<a href="{{buttonUrl}}" class="{{linkButtonClasses variant size customClasses }}">
    <span data-se="button">{{buttonText}}</span>
    <!-- icons and other content -->
</a>
{{/if}}
```

**Key Changes:**
- Uses static `data-se="button"` attribute (not dynamic)
- Moved from `<a>` tag to `<span>` wrapper around `{{buttonText}}`
- This allows precise targeting of just the button text for inline editing
- Icons and other elements remain non-editable

## Practical Example: Button-Row Component Implementation (Array Handling)

Here's how the button-row component was updated to handle arrays with the `processSquizEdit` approach:

### Updated main.js
```javascript
import { basicAssetUri, isRealExternalLink } from '../../global/js/utils';
import { processSquizEdit } from '../../global/js/utils/isEditor';
import buttonRow from './button-row.hbs';

export default {
    async main(args, info) {
        const fnsCtx = info?.fns || info?.ctx || {};
        
        // CHANGE: change const to let for mutability
        let { buttons } = args || {};
        
        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values if buttons array is not provided or empty
            buttons = buttons && buttons.length > 0 ? buttons : [
                { buttonText: 'Button 1', externalUrl: '#' },
                { buttonText: 'Button 2', externalUrl: '#' }
            ];
            
            // Ensure each button has default buttonText
            buttons = buttons.map(button => ({
                ...button,
                buttonText: button.buttonText || 'Click here'
            }));
            
            // Configure edit targets for array
            squizEditTargets = {
                "button": {
                    "field": "buttons",
                    "array": true,
                    "property": "buttonText"
                }
            };
        }

        // Function validation (unchanged)
        // ... validation code ...

        // NEW: Wrap validation in !squizEdit check
        if (!squizEdit) {
            // Validate buttons array
            if (!Array.isArray(buttons) || buttons.length === 0) {
                throw new Error('The "buttons" field must be a non-empty array.');
            }
        }

        // Process buttons asynchronously
        const data = await Promise.all(
            buttons.map(async (button) => {
                const { buttonText = "Button text", internalUrl, externalUrl, isNewWindow } = button;
                let linkData = null;
                
                if (internalUrl) {
                    linkData = await basicAssetUri(info.fns, internalUrl);
                }
                
                const buttonUrl = linkData?.url || externalUrl;
                
                // NEW: Skip URL validation in edit mode
                if (!squizEdit && buttonUrl === '') {
                    return '';
                }

                return {
                    buttonText,
                    isNewWindow,
                    buttonUrl: buttonUrl || '#', // Fallback for edit mode
                    isRealExternalLink: !linkData?.url && externalUrl ? isRealExternalLink(externalUrl) : false,
                };
            }),
        );

        const componentData = { buttons: data };
        
        // NEW: Early return pattern
        if (!squizEdit) return buttonRow(componentData);

        // NEW: Process for edit mode with array handling
        return processSquizEdit(buttonRow(componentData), squizEditTargets);
    },
};
```

### Template Structure (button-row.hbs)
```handlebars
<section data-component="button-row">
    <div class="{{containerClasses}}">
        <div class="su-flex su-flex-wrap su-justify-center su-gap-x-18 md:su-gap-x-27 su-gap-y-12 su-mx-auto su-w-fit">
            {{#each buttons}}
                {{> link-button buttonText=buttonText isNewWindow=isNewWindow buttonUrl=buttonUrl isRealExternalLink=isRealExternalLink ctaType="link" }}
            {{/each}}
        </div>
    </div>
</section>
```

**Key Array Handling Features:**
- **Default array creation**: Provides sample buttons when none exist in edit mode
- **Individual button defaults**: Ensures each button has default `buttonText`
- **Array configuration**: Uses `"array": true` and `"property": "buttonText"` in `squizEditTargets`
- **Automatic indexing**: `processSquizEdit` generates `buttons[0].buttonText`, `buttons[1].buttonText`, etc.
- **Shared template reuse**: Uses the same `link-button` partial with static `data-se="button"` attributes

## Example 4: Combined-Content-Grid Component (Complex Shared Partials)

This example demonstrates handling complex components that use multiple shared partials with inline editing:

### Updated main.js
```javascript
import { processSquizEdit } from '../../global/js/utils/isEditor';
import combinedContentGridTemplate from './combined-content-grid.hbs';

export default {
    async main(args, info) {
        // CHANGE: change const to let for mutability
        let { headingConfiguration, eventsConfiguration, announcementsConfiguration } = args || {};
        let { source, featuredDescription } = args?.contentConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Provide default configurations
            headingConfiguration = headingConfiguration || {};
            eventsConfiguration = eventsConfiguration || {};
            announcementsConfiguration = announcementsConfiguration || {};
            
            // Add default values for inline editable fields
            headingConfiguration.title = headingConfiguration.title || 'Featured Content';
            headingConfiguration.ctaText = headingConfiguration.ctaText || 'View all';
            eventsConfiguration.heading = eventsConfiguration.heading || 'Upcoming events';
            announcementsConfiguration.heading = announcementsConfiguration.heading || 'Announcements';
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "headingTitle": { "field": "headingConfiguration.title" },
                "headingCtaText": { "field": "headingConfiguration.ctaText" },
                "eventsHeading": { "field": "eventsConfiguration.heading" },
                "announcementsHeading": { "field": "announcementsConfiguration.heading" }
            };
            
            // Add featured description target if using Select mode
            if (source === 'Select') {
                featuredDescription = featuredDescription || 'Featured content description goes here.';
                squizEditTargets["description"] = {
                    "field": "contentConfiguration.featuredDescription"
                };
            }
        }

        // ... rest of component logic ...

        // NEW: Early return pattern
        if (!squizEdit) return combinedContentGridTemplate(componentData);

        // NEW: Process for edit mode
        return processSquizEdit(combinedContentGridTemplate(componentData), squizEditTargets);
    }
};
```

### Shared Partials with Static Attributes

**linked-heading.hbs** (shared partial):
```handlebars
{{#if title}}
    <div class="su-component-line-heading">
        <h2 data-se="headingTitle">{{title}}</h2>
        {{#if ctaLink}}
            <a href="{{ctaLink}}">
                <span data-se="headingCtaText">{{ctaText}}</span>
            </a>
        {{/if}}
    </div>
{{/if}}
```

**sidebar-heading.hbs** (shared partial):
```handlebars
{{#if title}}
    <h3 class="su-component-sidebar-heading">
        <span data-se="eventsHeading">{{title}}</span>
    </h3>
{{/if}}
```

**card-vertical.hbs** (shared partial):
```handlebars
<article class="su-component-card">
    <h3 data-se="title">{{title}}</h3>
    <div data-se="description">{{{description}}}</div>
</article>
```

### Component Template Usage

**combined-content-grid.hbs**:
```handlebars
<section data-component="combined-content-grid">
    <div class="{{containerClasses}}">
        {{> linked-heading title=headingData.title ctaLink=headingData.ctaLink ctaText=headingData.ctaText}}
        
        <div class="su-component-featured-grid">
            {{> sidebar-list title=eventData.title}}
            {{> sidebar-list title=announcementData.title}}
            {{> featured-grid items=cardData}}
        </div>
    </div>
</section>
```

**Key Benefits of This Approach:**
- **No dynamic attributes**: All `data-se` attributes are static in templates
- **Reusable partials**: Shared partials work with any component
- **Centralized mapping**: All field mapping happens in component's `main.js`
- **Backward compatibility**: Existing templates continue to work unchanged

## Shared Partials Best Practices

### 1. **Use Generic, Static `data-se` Names**
```handlebars
<!-- ✅ GOOD: Generic, reusable names -->
<h2 data-se="title">{{title}}</h2>
<div data-se="description">{{{description}}}</div>
<span data-se="ctaText">{{ctaText}}</span>

<!-- ❌ BAD: Component-specific names -->
<h2 data-se="heroTitle">{{title}}</h2>
<div data-se="cardDescription">{{{description}}}</div>
```

### 2. **Don't Pass Dynamic `data-se` Attributes**
```handlebars
<!-- ✅ GOOD: Static attributes -->
{{> card-vertical title=item.title description=item.description}}

<!-- ❌ BAD: Dynamic attributes -->
{{> card-vertical title=item.title description=item.description titleDataSe="cardTitle" descriptionDataSe="cardDesc"}}
```

### 3. **Map in Component's squizEditTargets**
```javascript
// Different components can map the same generic data-se to different fields
// Component A:
squizEditTargets = {
    "title": { "field": "heroConfiguration.mainTitle" },
    "description": { "field": "heroConfiguration.subtitle" }
};

// Component B:
squizEditTargets = {
    "title": { "field": "cardData[0].heading" },
    "description": { "field": "cardData[0].content" }
};
```

## Key Implementation Principles

### 1. **Early Return for Front-End**
- Return unmodified template output when not in edit mode
- Keeps front-end performance optimal

### 2. **Remove Overly Stringent Validation**
- Wrap existing validation in `!squizEdit` checks where appropriate
- Editor handles validation differently than front-end

### 3. **Provide Sensible Defaults**
- Add placeholder content for empty fields in edit mode
- Ensures editors always have something to click on

### 4. **Clean Configuration Structure**
- `squizEditTargets` maps template `data-se` attributes to component fields
- Supports both simple fields and complex array structures

### 5. **Static Template Attributes**
- Use static `data-se` attribute values in all templates
- Never pass dynamic `data-se` values through partials
- Keep shared partials generic and reusable

## Configuration Examples

### Simple Field Mapping
```javascript
"title": {
    "field": "headingConfiguration.title"
}
```
**Template:** `<h2 data-se="title">{{title}}</h2>`
**Result:** `data-sq-field="headingConfiguration.title"`

### Array with Property
```javascript
"button": {
    "field": "buttons",
    "array": true,
    "property": "buttonText"
}
```
**Template:** `<span data-se="button">{{buttonText}}</span>` (repeated in loop)
**Result:** `data-sq-field="buttons[0].buttonText"`, `buttons[1].buttonText`, etc.

### Nested Object Field
```javascript
"description": {
    "field": "contentConfiguration.featuredDescription"
}
```
**Template:** `<div data-se="description">{{{description}}}</div>`
**Result:** `data-sq-field="contentConfiguration.featuredDescription"`

### Mixed Format Example (Real-World Component)
```javascript
// multicolumn-info-section component
squizEditTargets = {
    // Format 1: Simple field mapping
    "title": {
        "field": "colOne.title"
    },
    "infoText": {
        "field": "colTwo.infoText"
    },
    
    // Format 3: Custom field mapping for shared partials
    "button": [
        { "field": "colTwo.buttonConfiguration.buttonText" },
        { "field": "colThree.buttonConfiguration.buttonText" }
    ],
    
    // Format 1: Nested object fields
    "infoBoxTitle": {
        "field": "colThree.title"
    },
    "infoBoxContent": {
        "field": "colThree.content"
    },
    "captionCredit": {
        "field": "colThree.imageConfiguration.caption"
    }
};
```

**This generates:**
- Title: `data-sq-field="colOne.title"`
- Info text: `data-sq-field="colTwo.infoText"`
- First button: `data-sq-field="colTwo.buttonConfiguration.buttonText"`
- Second button: `data-sq-field="colThree.buttonConfiguration.buttonText"`
- Info box title: `data-sq-field="colThree.title"`
- Info box content: `data-sq-field="colThree.content"`
- Caption credit: `data-sq-field="colThree.imageConfiguration.caption"`

## processSquizEdit Function Details

The `processSquizEdit` utility function handles the transformation of `data-se` attributes to `data-sq-field` attributes and supports three different mapping formats:

### Three Supported Formats

#### Format 1: Simple Field Mapping
Maps a single `data-se` attribute to a single component field.

```javascript
"title": {
    "field": "headingConfiguration.title"
}
```

**Template:** `<h2 data-se="title">{{title}}</h2>`
**Result:** `<h2 data-se="title" data-sq-field="headingConfiguration.title">{{title}}</h2>`

#### Format 2: Array with Auto-Indexing
Maps multiple elements with the same `data-se` attribute to an array with automatic indexing using square brackets.

```javascript
"button": {
    "field": "buttons",
    "array": true,
    "property": "buttonText"
}
```

**Template:** `<span data-se="button">{{buttonText}}</span>` (repeated in loop)
**Result:** 
- `<span data-se="button" data-sq-field="buttons[0].buttonText">Button 1</span>`
- `<span data-se="button" data-sq-field="buttons[1].buttonText">Button 2</span>`

#### Format 3: Array with Custom Field Mapping (NEW)
Maps multiple elements with the same `data-se` attribute to completely different field paths in document order.

```javascript
"button": [
    { "field": "colTwo.buttonConfiguration.buttonText" },
    { "field": "colThree.buttonConfiguration.buttonText" }
]
```

**Template:** Multiple elements with same `data-se="button"` attribute
**Result:**
- First button: `<a data-se="button" data-sq-field="colTwo.buttonConfiguration.buttonText">First Button</a>`
- Second button: `<a data-se="button" data-sq-field="colThree.buttonConfiguration.buttonText">Second Button</a>`

### Function Behavior
- **Appends** `data-sq-field` attributes alongside existing `data-se` attributes
- **Handles arrays** with automatic indexing using square brackets `[0]`, `[1]`, etc. (Format 2)
- **Supports custom field mapping** for multiple elements with same `data-se` attribute (Format 3)
- **Supports properties** on array items like `card[0].title` (Format 2)
- **Uses regex** to handle complex HTML with flexible formatting
- **Document order processing** for Format 3 - maps elements in the order they appear in HTML

### Array Processing

#### Format 2 (Auto-Indexing)
For array configurations with `"array": true`, the function:
1. Finds all elements with the same `data-se` attribute
2. Assigns incremental indexes starting from `[0]`
3. Optionally appends property names if specified

**Example:**
```html
<!-- Before -->
<div data-se="button">Button 1</div>
<div data-se="button">Button 2</div>

<!-- After -->
<div data-se="button" data-sq-field="buttons[0].buttonText">Button 1</div>
<div data-se="button" data-sq-field="buttons[1].buttonText">Button 2</div>
```

#### Format 3 (Custom Field Mapping)
For array configurations with custom field mapping, the function:
1. Finds all elements with the same `data-se` attribute in document order
2. Maps each element to the corresponding field in the array
3. Uses fallback to last mapping if more elements exist than mappings

**Example:**
```html
<!-- Before -->
<a data-se="button">Column Two Button</a>
<div class="info-box">
    <a data-se="button">Column Three Button</a>
</div>

<!-- After -->
<a data-se="button" data-sq-field="colTwo.buttonConfiguration.buttonText">Column Two Button</a>
<div class="info-box">
    <a data-se="button" data-sq-field="colThree.buttonConfiguration.buttonText">Column Three Button</a>
</div>
```

### When to Use Each Format

#### Use Format 1 (Simple Field Mapping) when:
- You have a single element with a unique `data-se` attribute
- The field maps directly to a component property
- No array processing is needed

#### Use Format 2 (Array with Auto-Indexing) when:
- You have multiple similar elements (like cards, buttons in a list)
- All elements map to the same array structure
- You want automatic indexing (`[0]`, `[1]`, etc.)
- Elements represent items in a homogeneous collection

#### Use Format 3 (Array with Custom Field Mapping) when:
- You have multiple elements with the same `data-se` attribute
- Each element maps to a completely different field path
- Elements are in different contexts or components
- You need precise control over field mapping
- Shared partials are used in multiple contexts with different data structures

## Implementation Checklist
- [ ] Import only `processSquizEdit` utility
- [ ] Change destructured variables from `const` to `let`
- [ ] Detect edit mode using `info?.ctx?.editor`
- [ ] Configure `squizEditTargets` inside edit mode check
- [ ] Add default values for empty fields
- [ ] Use early return for front-end mode
- [ ] Process output with `processSquizEdit` for edit mode
- [ ] Remove/wrap validation that conflicts with edit mode
- [ ] Use static `data-se` attributes in templates
- [ ] Don't pass dynamic `data-se` values through partials
- [ ] Test both edit and front-end modes

## Template Requirements
Your Handlebars template must include static `data-se` attributes:

```handlebars
<h2 data-se="title">{{title}}</h2>
<div data-se="content">{{{content}}}</div>

{{#each cards}}
    <div data-se="cardItem">
        <h3 data-se="cardTitle">{{title}}</h3>
        <p data-se="cardDescription">{{description}}</p>
    </div>
{{/each}}
```

## Best Practices
1. **Keep front-end code unchanged** - use early return pattern
2. **Only process edit markup when needed** - improves performance
3. **Use static `data-se` names** that are generic and reusable
4. **Never pass dynamic `data-se` attributes** through partials
5. **Always provide defaults** for required content in edit mode
6. **Test with mock editor mode** by setting `squizEdit = true`
7. **Keep shared partials generic** - let components handle the mapping
8. **Simplify error handling in edit mode** - use mock data without console errors or error returns

## Common Patterns

### Basic Component Structure
```javascript
export default {
    async main(args, info) {
        let { field1, field2 } = args || {};
        
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add defaults
            field1 = field1 || 'Default content';
            
            // Configure targets with static data-se names
            squizEditTargets = {
                "title": { "field": "field1" },
                "description": { "field": "field2" }
            };
        }
        
        const componentData = { field1, field2 };
        
        if (!squizEdit) return template(componentData);
        
        return processSquizEdit(template(componentData), squizEditTargets);
    }
};
```

### Array Handling
```javascript
squizEditTargets = {
    "itemTitle": {
        "field": "items",
        "array": true,
        "property": "title"
    },
    "itemContent": {
        "field": "items", 
        "array": true,
        "property": "content"
    }
};
```

This generates:
- `items[0].title`, `items[1].title`, etc.
- `items[0].content`, `items[1].content`, etc.
```

## Example 5: Content-Carousel Component (FormattedText Array)

This example demonstrates handling a component with both a simple title field and an array of FormattedText content for inline editing:

### Updated main.js
```javascript
import xss from "xss";
import contentCarousel from './content-carousel.hbs';
import { uuid } from "../../global/js/utils";
import { processSquizEdit } from '../../global/js/utils/isEditor';

export default {
    async main(args, info) {
        // CHANGE: change const to let for mutability
        let { title, slides } = args || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values if not provided
            title = title || 'Content Carousel';
            slides = slides && slides.length > 0 ? slides : [
                { content: '<p>First slide content goes here.</p>' },
                { content: '<p>Second slide content goes here.</p>' }
            ];
            
            // Ensure each slide has default content
            slides = slides.map(slide => ({
                ...slide,
                content: slide.content || '<p>Add your content here.</p>'
            }));
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "title": {
                    "field": "title"
                },
                "content": {
                    "field": "slides",
                    "array": true,
                    "property": "content"
                }
            };
        }

        // NEW: Wrap validation in !squizEdit check
        if (!squizEdit) {
            // Validate required fields and ensure correct data types
            try {
                if (title && typeof title !== 'string') {
                    throw new Error(
                        `The "title" field must be a string. Received: ${JSON.stringify(title)}`
                    );
                }
                if (!Array.isArray(slides) || slides.length < 1) {
                    throw new Error(
                        `The "slides" array must have at least one item. Received length: ${slides.length}`
                    );
                }
            } catch (err) {
                console.error('Error occurred in the Content Carousel component:', err);
                return `<!-- Error occurred in the Content Carousel component: ${err.message} -->`;
            }
        }

        // Prepare data for slides (XSS sanitization)
        slides.map(item => {
            item.content = xss(item.content);
            return item;
        });

        // Prepare component data for template rendering
        const componentData = {
            id: uuid(),
            title,
            slides,
            width: "narrow"
        };

        // NEW: Early return pattern
        if (!squizEdit) return contentCarousel(componentData);

        // NEW: Process for edit mode
        return processSquizEdit(contentCarousel(componentData), squizEditTargets);
    }
};
```

### Updated Template (content-carousel.hbs)
```handlebars
<section data-component='content-carousel' data-unique-id='{{id}}'>
    <div class='{{containerClasses width=width}}'>
        <div class='su-bg-fog-light dark:su-bg-black su-p-20 md:su-pt-36 md:su-px-36 md:su-pb-26'>
            <div class='su-relative su-mb-38 su-overflow-hidden'>
                {{~#if title~}}
                <h3 data-se="title">{{title}}</h3>
                {{~/if~}}
                <span class='su-w-full su-bg-black-40 dark:su-bg-black-70 su-h-1 su-absolute su-bottom-4'></span>
            </div>
            {{#> carousel-content uniqueID=id}}
                {{#each slides}}
                <div class="swiper-slide">
                    <div class="su-wysiwyg-content" data-se="content">
                        {{{content}}}
                    </div>
                </div>
                {{/each}}
            {{/ carousel-content}}
        </div>
    </div>
</section>
```

**Key Features Demonstrated:**
- **Simple field mapping**: `"title"` maps to `"title"` field
- **Array with FormattedText**: `"content"` maps to `"slides"` array with `"content"` property
- **Default array creation**: Provides sample slides when none exist in edit mode
- **Individual slide defaults**: Ensures each slide has default content
- **XSS sanitization**: Maintains security while supporting rich text editing
- **Carousel integration**: Works with existing Swiper.js carousel functionality

**Generated `data-sq-field` attributes:**
- Title: `data-sq-field="title"`
- Slide content: `data-sq-field="slides[0].content"`, `slides[1].content`, etc.

This pattern is ideal for components that need both simple text fields and rich content arrays for inline editing.

## Configuration Examples
```

## Example 6: CTA-Cards-Block Component (Array with Mixed Field Types)

This example demonstrates handling a component with an array of cards, each containing multiple inline editable fields of different types (string and FormattedText):

### Updated main.js
```javascript
import { basicAssetUri, isRealExternalLink } from "../../global/js/utils";
import ctaCardsBlockTemplate from './cta-cards-block.hbs';
import { processSquizEdit } from '../../global/js/utils/isEditor';

export default {
  async main(args, info) {
        // CHANGE: change const to let for mutability
        let { cards } = args || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add the targets for the squizEdit DOM augmentation
            squizEditTargets = {
                "eyebrow": {
                    "field": "cards",
                    "array": true,
                    "property": "eyebrow"
                },
                "title": {
                    "field": "cards",
                    "array": true,
                    "property": "title"
                },
                "description": {
                    "field": "cards",
                    "array": true,
                    "property": "description"
                }
            };
            
            // NEW: Provide default values for edit mode
            cards = cards && cards.length > 0 ? cards : [
                {
                    eyebrow: 'Sample Eyebrow',
                    title: 'Sample CTA Card Title',
                    description: '<p>This is a sample description for the CTA card.</p>',
                    linkDetails: {
                        externalUrl: 'https://example.com',
                        isNewWindow: false
                    }
                },
                {
                    eyebrow: 'Another Eyebrow',
                    title: 'Second CTA Card Title',
                    description: '<p>This is another sample description.</p>',
                    linkDetails: {
                        externalUrl: 'https://example.com',
                        isNewWindow: false
                    }
                }
            ];
        }

        // ... existing validation and processing logic wrapped in !squizEdit checks

        // NEW: Early return pattern for edit mode
        if (squizEdit) {
            return processSquizEdit(ctaCardsBlockTemplate(componentData), squizEditTargets, args);
        }

        return ctaCardsBlockTemplate(componentData);
    }
}
```

### Updated card-cta.hbs (Shared Partial)
```handlebars
<article aria-label="{{title}}" class="...">
    {{~#if eyebrow~}}
        <span aria-hidden="true" class="..." data-se="eyebrow">
          {{eyebrow}}
        </span>
    {{~/if~}}
    <h3 class="...">
        {{~#if link~}}
          <a href="{{link}}" class="...">
            {{~#if eyebrow~}}<span class="su-sr-only">{{eyebrow}}: </span>{{~/if~}}
            <span data-se="title">{{title}}</span>
            {{~#if isRealExternalLink~}}
                <span class="su-sr-only">(link is external)</span>
            {{~/if~}}
          </a>
        {{~else~}}
            {{~#if eyebrow~}}<span class="su-sr-only">{{eyebrow}}: </span>{{~/if~}}
            <span data-se="title">{{title}}</span>
        {{~/if~}}
      </h3>
    {{~#if description~}}
        <div class="su-grow">
            <div data-test="cta-card-content" class="..." data-se="description">
                {{{description}}}
            </div>
        </div>
    {{~/if~}}
    <!-- ... rest of template -->
</article>
```

### Key Features Demonstrated:
- **Array-based inline editing**: Multiple cards with auto-indexing
- **Mixed field types**: String fields (eyebrow, title) and FormattedText (description)
- **Shared partial updates**: Static `data-se` attributes in reusable card-cta partial
- **Conditional rendering**: Proper handling of optional fields (eyebrow, description)
- **Link handling**: Maintains existing link functionality while adding inline editing

This pattern works well for components that display multiple similar items (cards, buttons, etc.) where each item has several inline editable fields.

---

## Shared Partials Best Practices
```

## Example 7: Events-Section Component (API-Based with Error Handling)

This example demonstrates handling a component that fetches data from an external API, with proper error handling and mock data provision in edit mode:

### Updated main.js
```javascript
import eventSectionTemplate from './event-section.hbs';
import { cardDataAdapter, eventCardService, linkedHeadingService, isRealExternalLink, uuid } from "../../global/js/utils";
import { EventStartEndDate } from '../../global/js/helpers';
import { processSquizEdit } from '../../global/js/utils/isEditor';

export default {
    async main(args, info) {
        // Extracting environment function from provided info
        const fnsCtx = info?.fns || info?.ctx || {};

        // CHANGE: change const to let for mutability
        let { headingConfiguration, contentConfiguration, displayConfiguration } = args || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Provide default configurations
            headingConfiguration = headingConfiguration || {};
            contentConfiguration = contentConfiguration || {};
            displayConfiguration = displayConfiguration || {};
            
            // Add default values for inline editable fields
            headingConfiguration.title = headingConfiguration.title || 'Upcoming events';
            headingConfiguration.ctaText = headingConfiguration.ctaText || 'View all';
            headingConfiguration.ctaManualUrl = headingConfiguration.ctaManualUrl || 'https://events.stanford.edu';
            
            // Add default values for required fields
            contentConfiguration.eventsUrl = contentConfiguration.eventsUrl || 'https://events.stanford.edu/api/2/events?days=365&sponsored=true';
            displayConfiguration.numberOfEvents = displayConfiguration.numberOfEvents || 6;
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "headingTitle": { "field": "headingConfiguration.title" },
                "headingCtaText": { "field": "headingConfiguration.ctaText" }
            };
        }

        // Extract configuration data
        const { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow } = headingConfiguration || {};
        const { eventsUrl } = contentConfiguration || {};
        const { numberOfEvents } = displayConfiguration || {};

        // Environment validation (unchanged)
        // ... validation code ...

        // Field validation - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            // ... existing validation logic ...
        }

        // API data fetching with edit mode error handling
        const adapter = new cardDataAdapter();
        let data = [];
        const service = new eventCardService({ api: eventsUrl });
        adapter.setCardService(service);
        
        try {
            data = await adapter.getCards();
        } catch (er) {
            console.error('Error occurred in the Events section component: Failed to fetch event data. ', er);
            // NEW: In edit mode, provide mock data instead of returning error
            if (squizEdit) {
                data = [
                    {
                        title: 'Sample Event 1',
                        description: 'This is a sample event description.',
                        liveUrl: 'https://example.com',
                        imageUrl: 'https://picsum.photos/400/400',
                        imageAlt: 'Sample event image',
                        taxonomy: 'Events',
                        taxonomyUrl: 'https://example.com',
                        type: 'Event',
                        date: new Date().toISOString(),
                        endDate: new Date(Date.now() + 3600000).toISOString()
                    },
                    {
                        title: 'Sample Event 2',
                        description: 'This is another sample event description.',
                        liveUrl: 'https://example.com',
                        imageUrl: 'https://picsum.photos/400/400',
                        imageAlt: 'Another sample event image',
                        taxonomy: 'Events',
                        taxonomyUrl: 'https://example.com',
                        type: 'Event',
                        date: new Date().toISOString(),
                        endDate: new Date(Date.now() + 3600000).toISOString()
                    }
                ];
            } else {
                return `<!-- Error occurred in the Events section component: Failed to fetch event data. ${er.message} -->`;
            }
        }

        // Process heading data
        const headingData = await linkedHeadingService(fnsCtx, headingConfiguration);

        // Process card data
        let cardData = [];
        if (data !== null && data !== undefined) {
            cardData = data.map((card) => {
                card.isRealExternalLink = isRealExternalLink(card.liveUrl);
                card.eventStartEndDate = EventStartEndDate({start: card.date, end: card.endDate});
                card.uniqueID = uuid();
                card.imageAlt = card.videoUrl ? `Open video ${card.imageAlt} in a modal` : card.imageAlt;
                card.iconType = card.type?.toLowerCase();
                return card;
            }).slice(0, numberOfEvents);
        }

        // Data validation - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            // ... existing validation logic ...
        }

        // Prepare component data
        const componentData = {
            title: headingData.title,
            ctaText: headingData.ctaText,
            ctaLink: headingData.ctaLink,
            ctaNewWindow: headingData.ctaNewWindow,
            isAlwaysLight: false,
            width: "large",
            cardSize: "small",
            data: cardData,
        };

        // NEW: Early return pattern for edit mode
        if (squizEdit) {
            return processSquizEdit(eventSectionTemplate(componentData), squizEditTargets, args);
        }

        return eventSectionTemplate(componentData);
    }
};
```

### Template Structure (event-section.hbs)
```handlebars
<section data-component="events-section">
    <div class="{{containerClasses width=width}}">
        {{> linked-heading title=title isAlwaysLight=isAlwaysLight ctaLink=ctaLink ctaNewWindow=ctaNewWindow ctaText=ctaText}}
        {{#> horizontal-card-grid orientation="horizontal"}}
            {{#each data}} 
            <div class='su-relative su-grow'>
                {{> card-horizontal cardSize=../cardSize title=title description=description liveUrl=liveUrl imageUrl=imageUrl imageAlt=imageAlt taxonomy=taxonomy taxonomyUrl=taxonomyUrl type=type date=date endDate=endDate videoUrl=videoUrl uniqueID=uniqueID iconType=iconType}}
            </div>
            {{/each}}
        {{/ horizontal-card-grid}}
    </div>
</section>
```

### Key Features Demonstrated:
- **API-based component**: Fetches data from external events API
- **Error handling in edit mode**: Provides mock data when API fails in editor
- **Shared partial reuse**: Uses existing `linked-heading` partial with static `data-se` attributes
- **Configuration-based structure**: Handles nested configuration objects
- **Service integration**: Works with existing `eventCardService` and `linkedHeadingService`
- **Data processing**: Maintains existing card data transformation logic

**Generated `data-sq-field` attributes:**
- Section title: `data-sq-field="headingConfiguration.title"`
- CTA text: `data-sq-field="headingConfiguration.ctaText"`

This pattern is ideal for components that:
- Fetch data from external APIs
- Need graceful error handling in edit mode
- Use complex configuration structures
- Rely on shared services and utilities
- Display dynamic content that may not be available during editing

The mock data ensures editors always have content to work with, even when the external API is unavailable or returns errors.

## Configuration Examples
```

## Example 8: Featured-Content Component (API-Based with Conditional Targets)

This example demonstrates handling a component that fetches data from multiple APIs (Funnelback search or Matrix assets), with conditional inline editing targets based on component mode and comprehensive error handling:

### Updated main.js
```javascript
import featureContentTemplate from './featured-content.hbs';
import { cardDataAdapter, funnelbackCardService, linkedHeadingService, matrixCardService, uuid } from "../../global/js/utils";
import { Card, Modal, EmbedVideo } from "../../global/js/helpers";
import { processSquizEdit } from '../../global/js/utils/isEditor';

export default {
    async main(args, info) {
        // Extracting environment variables from provided info
        const { FB_JSON_URL, API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};
        const fnsCtx = info?.fns || info?.ctx || {};

        // CHANGE: change const to let for mutability
        let { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow } = args?.headingConfiguration || {};
        let { source, searchQuery, featuredDescription, cards } = args?.contentConfiguration || {};
        let { alignment, displayThumbnails, displayDescriptions } = args?.displayConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Provide default configurations
            title = title || 'Featured Content';
            ctaText = ctaText || 'View all';
            ctaUrl = ctaUrl || '';
            ctaManualUrl = ctaManualUrl || 'https://example.com';
            ctaNewWindow = ctaNewWindow !== undefined ? ctaNewWindow : false;
            
            // Provide default content configuration
            source = source || 'Search';
            searchQuery = searchQuery || '?collection=sug~sp-stanford-report-search&profile=stanford-report-push-search&log=false&query=!null&sort=date&meta_isTeaser_not=true';
            
            // Provide default display configuration
            alignment = alignment || 'left';
            displayThumbnails = displayThumbnails !== undefined ? displayThumbnails : true;
            displayDescriptions = displayDescriptions !== undefined ? displayDescriptions : true;
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "headingTitle": { "field": "headingConfiguration.title" },
                "headingCtaText": { "field": "headingConfiguration.ctaText" }
            };
            
            // Add featured description target if using Select mode
            if (source === 'Select') {
                featuredDescription = featuredDescription || 'This is a sample featured description that can be edited inline.';
                cards = cards && cards.length >= 3 ? cards : [
                    { cardAsset: 'matrix-asset://api-identifier/166535' },
                    { cardAsset: 'matrix-asset://api-identifier/162707' },
                    { cardAsset: 'matrix-asset://api-identifier/162759' }
                ];
                squizEditTargets["description"] = {
                    "field": "contentConfiguration.featuredDescription"
                };
            }
        }
        
        // Environment and field validation wrapped in !squizEdit checks
        if (!squizEdit) {
            // ... existing validation logic ...
        }

        // API data fetching with edit mode error handling
        const adapter = new cardDataAdapter();
        let data = null;

        if (source.toLowerCase() === "search") {
            const query = searchQuery;
            const service = new funnelbackCardService({ FB_JSON_URL, query });
            adapter.setCardService(service);
            
            try {
                data = await adapter.getCards();
            } catch (er) {
                console.error('Error occurred in the Feature content component: Failed to fetch search data. ', er);
                // NEW: In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    data = [
                        {
                            title: 'Sample Featured Article',
                            description: 'This is a sample featured article description that can be edited inline.',
                            liveUrl: 'https://example.com',
                            imageUrl: 'https://picsum.photos/600/400',
                            imageAlt: 'Sample featured image',
                            taxonomy: 'Research',
                            taxonomyUrl: 'https://example.com',
                            type: 'Article'
                        },
                        // ... additional mock cards
                    ];
                } else {
                    return `<!-- Error occurred in the Feature content component: Failed to fetch search data. ${er.message} -->`;
                }
            }
        } else {
            const service = new matrixCardService({ BASE_DOMAIN, API_IDENTIFIER });
            adapter.setCardService(service);
            
            try {
                data = await adapter.getCards(cards);
            } catch (er) {
                console.error('Error occurred in the Feature content component: Failed to fetch card data. ', er);
                // NEW: In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    data = [
                        {
                            title: 'Sample Featured Content',
                            description: 'This is a sample featured content description that can be edited inline.',
                            liveUrl: 'https://example.com',
                            imageUrl: 'https://picsum.photos/600/400',
                            imageAlt: 'Sample featured image',
                            taxonomy: 'Featured',
                            taxonomyUrl: 'https://example.com',
                            type: 'Article'
                        },
                        // ... additional mock cards
                    ];
                } else {
                    return `<!-- Error occurred in the Feature content component: Failed to fetch card data. ${er.message} -->`;
                }
            }
        }

        // Process heading and card data
        const headingData = await linkedHeadingService(fnsCtx, { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow });
        
        data.map((card) => {
            card.uniqueId = uuid();
            return card
        })

        const featuredCardData = data && data[0];
        if (featuredDescription && featuredDescription !== "") {
            featuredCardData.description = featuredDescription;
        }

        const cardData = data && [data[1], data[2]];
        
        // Data validation wrapped in !squizEdit check
        if (!squizEdit) {
            // ... existing validation logic ...
        }

        // Generate card components and prepare template data
        const cardsToRender = cardData.map((card, idx) => `
            ${idx === 0 ? `<div class="su-relative su-w-full">`: `<div class="su-relative su-w-full before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black before:su-h-px before:su-left-0 before:su-top-[-40px] md:before:su-top-[-36px] lg:before:su-top-[-38px]">`}
                {{Card({data: card, cardSize: "small", displayThumbnail: displayThumbnails, displayDescription: displayDescriptions, headingLvl: title ? 3 : 2, uniqueId: card.uniqueId })}
                </div>
            `).join('');

        const componentData = {
            alignment,
            headingTitle: headingData?.title,
            headingIsAlwaysLight: false,
            headingCtaLink: headingData?.ctaLink,
            headingCtaNewWindow: headingData?.ctaNewWindow,
            headingCtaText: headingData?.ctaText,
            featureCard: Card({ data: featuredCardData, cardSize:"featured", headingLvl: title ? 3 : 2, uniqueId: featuredCardData.uniqueId }),
            cards: cardsToRender,
            cardModal: cardModal.join(''),
            width: "large"
        };

        // NEW: Early return pattern for edit mode
        if (squizEdit) {
            return processSquizEdit(featureContentTemplate(componentData), squizEditTargets, args);
        }

        return featureContentTemplate(componentData);
    }
};
```

### Template Structure (featured-content.hbs)
```handlebars
<section data-component="featured-content">
    <div class="{{containerClasses width=width}}">
        {{> linked-heading title=headingTitle isAlwaysLight=headingIsAlwaysLight ctaLink=headingCtaLink ctaNewWindow=headingCtaNewWindow ctaText=headingCtaText }}
        <div class="su-w-full su-component-featured-grid">
            <div class="su-flex su-flex-wrap su-gap-[68px] md:su-gap-72 md:su-flex-nowrap lg:su-gap-[160px]">
                <div class="md:su-basis-[58.333%] lg:su-basis-[64.5%] su-grow {{cardsGrowClasses alignment}}">
                    {{{featureCard}}}
                </div>
                <div class="su-relative su-flex su-flex-wrap su-grow before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black su-gap-80 md:su-gap-72 lg:su-gap-[76px] before:md:su-w-px before:su-h-px before:md:su-h-full md:su-items-start md:su-content-start {{cardsAlignmentClasses alignment}}">
                    {{{cards}}}
                </div>
            </div>
        </div>
    </div>
    {{{cardModal}}}
</section>
```

### Key Features Demonstrated:
- **Multiple API sources**: Handles both Funnelback search and Matrix asset APIs
- **Conditional inline editing**: Featured description only available in Select mode
- **Shared partial integration**: Uses `linked-heading` partial with static `data-se` attributes
- **Card helper integration**: Uses existing Card helper with `data-se="description"` support
- **Comprehensive error handling**: Provides mock data when APIs fail in edit mode
- **Complex data processing**: Maintains existing card data transformation and modal generation
- **Mode-based configuration**: Different default values based on Search vs Select mode

**Generated `data-sq-field` attributes:**
- Section title: `data-sq-field="headingConfiguration.title"`
- CTA text: `data-sq-field="headingConfiguration.ctaText"`
- Featured description (Select mode only): `data-sq-field="contentConfiguration.featuredDescription"`

This pattern is ideal for components that:
- Fetch data from multiple external APIs
- Have conditional inline editing based on component configuration
- Use complex shared helpers and services
- Need graceful degradation when external services fail
- Display dynamic content with fallback mock data for editing

The conditional target configuration ensures that the featured description is only inline editable when the component is in Select mode, where users can actually override the description. In Search mode, the description comes from the API and cannot be overridden.

## Configuration Examples
```

## Example 9: Fullscreen-Image-Quote Component (Nested Object Fields)

This example demonstrates handling a component with both simple fields and multiple nested fields from a single object (ctaDetails):

### Updated main.js
```javascript
import { basicAssetUri, isRealExternalLink, uuid } from "../../global/js/utils";
import fullscreenImageQuoteTemplate from './fullscreen-image.hbs';
import { processSquizEdit } from '../../global/js/utils/isEditor';

export default {
    async main(args, info) {
        const fnsCtx = info?.fns || info?.ctx || {};

        // CHANGE: change const to let for mutability
        let { image, imageVPosition, mobileImage, quote, quoteVAlign, quoteHAlign, removeTopSpacing, ctaDetails } = args || {};
        let { ctaPreText, ctaText, ctaSubtext, externalUrl, internalUrl, isNewWindow } = ctaDetails || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Provide default values for inline editable fields
            quote = quote || '"This is a sample quote that can be edited inline."';
            
            // Ensure ctaDetails object exists
            ctaDetails = ctaDetails || {};
            ctaPreText = ctaPreText || 'Meet';
            ctaText = ctaText || 'Sample Person';
            ctaSubtext = ctaSubtext || "'21, international student";
            
            // Provide default values for other required fields
            image = image || 'matrix-asset://api-identifier/sample-image';
            imageVPosition = imageVPosition || 'center';
            quoteVAlign = quoteVAlign || 'center';
            quoteHAlign = quoteHAlign || 'left';
            removeTopSpacing = removeTopSpacing !== undefined ? removeTopSpacing : false;
            externalUrl = externalUrl || 'https://example.com';
            isNewWindow = isNewWindow !== undefined ? isNewWindow : false;
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "quote": { "field": "quote" },
                "ctaPreText": { "field": "ctaDetails.ctaPreText" },
                "ctaText": { "field": "ctaDetails.ctaText" },
                "ctaSubtext": { "field": "ctaDetails.ctaSubtext" }
            };
        }

        // Environment and field validation wrapped in !squizEdit checks
        if (!squizEdit) {
            // ... existing validation logic ...
        }

        // API calls with edit mode error handling
        let imageData = null;
        let mobileImageData = null;
        let linkUrl = null;
        
        if (image) {
            try {
                imageData = await basicAssetUri(fnsCtx, image);
            } catch (er) {
                console.error('Error occurred in the Fullscreen Image Quote component: Failed to fetch image data. ', er);
                // NEW: In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    imageData = {
                        url: 'https://picsum.photos/1200/800',
                        attributes: {
                            alt: 'Sample background image',
                            width: 1200,
                            height: 800
                        }
                    };
                } else {
                    return `<!-- Error occurred in the Fullscreen Image Quote component: Failed to fetch image data. ${er.message} -->`;
                }
            }
        }

        // Similar error handling for mobileImage and internalUrl...

        const componentData = {
            quote,
            quoteHAlign,
            quoteVAlign: convertedQuoteVAlign,
            imageVPosition,
            removeTopSpacing,
            ctaPreText,
            ctaText,
            ctaSubtext,
            link: externalUrl || linkUrl?.url,
            iconUniqueID: uuid(),
            isNewWindow,
            isRealExternal,
            imageData: imageData,
            mobileImageData: mobileImageData,
        };

        // NEW: Early return pattern for edit mode
        if (squizEdit) {
            return processSquizEdit(fullscreenImageQuoteTemplate(componentData), squizEditTargets, args);
        }

        return fullscreenImageQuoteTemplate(componentData);
    }
};
```

### Updated Template (fullscreen-image.hbs)
```handlebars
<section data-component="fullscreen-image-quote">
    <div class="su-aspect-w-1 su-aspect-h-2 sm:su-aspect-w-3 sm:su-aspect-h-4 lg:su-aspect-h-2 2xl:su-aspect-w-2 2xl:su-aspect-h-1 su-bg-black-true su-text-white {{#if removeTopSpacing}}su--mt-50 md:su--mt-56 2xl:su--mt-58{{/if}}">
        <div class="su-absolute su-z-20 su-h-full su-inset-0 su-flex su-items-end su-p-20 {{#if quoteVAlign}}lg:su-items-{{quoteVAlign}}{{/if}}">
            <blockquote class="su-py-17 sm:su-py-[6.8rem] xl:su-py-100 2xl:su-py-140 su-cc lg:su-max-w-[50%] {{getStringByCondition value=quoteHAlign expectedValue="right" trueResult="su-ml-0 su-mr-auto lg:su-mr-0 lg:su-ml-auto lg:su-pl-0" falseResult="su-ml-0 su-mr-auto lg:su-pr-0"}}">
                {{~#if quote~}}
                <p class="su-font-serif su-text-22 md:su-text-[3.3rem] lg:su-text-24 xl:su-text-[2.8rem] 2xl:su-text-[3.3rem] su-leading-display su-max-w-[55rem] xl:su-max-w-600 su-mb-0 su-whitespace-pre-line" data-se="quote">
                    {{quote}}
                </p>
                {{~/if~}}
                {{~#if ctaText~}}
                <div class="su-rs-mt-1 su-max-w-[55rem] xl:su-max-w-600">
                    <span class="su-inline su-text-22 md:su-text-[2.9rem] lg:su-text-24 2xl:su-text-[2.9rem] su-font-bold su-leading-display su-mr-02em" data-se="ctaPreText">
                        {{ctaPreText}}
                    </span>
                    <a href="{{link}}" 
                       {{#if isNewWindow}}target="_blank"{{/if}} 
                       {{#if isRealExternal}}rel="noopener nofollow"{{/if}}
                       class="su-group su-inline su-text-22 md:su-text-[2.9rem] lg:su-text-24 2xl:su-text-[2.9rem] su-font-bold su-leading-display su-text-white dark:su-text-white su-underline su-decoration-dark-mode-red su-underline-offset-4 su-decoration-[3px] hocus:su-decoration-white hocus:su-text-white dark:hocus:su-text-white su-transition-all">
                        <span data-se="ctaText">{{ctaText}}</span>
                        <!-- icons and other content -->
                    </a>
                    {{~#if ctaSubtext~}}
                    <div class="su-card-paragraph su-leading-display su-mt-9" data-se="ctaSubtext">
                        {{ctaSubtext}}
                    </div>
                    {{~/if~}}
                </div>
                {{~/if~}}
            </blockquote>
        </div>
        <!-- background images -->
    </div>
</section>
```

### Key Features Demonstrated:
- **Nested object fields**: Multiple fields from `ctaDetails` object mapped to individual inline editing targets
- **Mixed field types**: Simple string field (`quote`) and nested object fields (`ctaDetails.*`)
- **Asset URI handling**: Proper error handling for image and link assets with mock data fallbacks
- **Conditional rendering**: Proper handling of optional CTA elements
- **Complex layout**: Full-screen background image with overlay text and CTA elements

**Generated `data-sq-field` attributes:**
- Quote: `data-sq-field="quote"`
- CTA pre-text: `data-sq-field="ctaDetails.ctaPreText"`
- CTA text: `data-sq-field="ctaDetails.ctaText"`
- CTA subtext: `data-sq-field="ctaDetails.ctaSubtext"`

This pattern is ideal for components that:
- Have nested configuration objects with multiple inline editable fields
- Combine simple fields with complex nested structures
- Use background images and overlay content
- Need graceful error handling for asset loading
- Display rich text content with associated call-to-action elements

The nested field mapping allows editors to modify individual parts of the CTA section while keeping the overall structure intact.

## Configuration Examples
```

## Example 10: Interactive Photo Card Component

The `interactive-photo-card` component demonstrates inline editing for an interactive flip card with multiple field types including FormattedText content on the back side.

### Inline Editable Fields:
1. `title` - Card title (string)
2. `eyebrow` - Superheading above title (string, optional)
3. `content` - Rich text content on flip side (FormattedText)

### Template Changes (interactive-photo-card.hbs):
```handlebars
<section data-component="interactive-photo-card">
    <div class="su-cc">
        <article class="su-relative su-grid xl:su-grid-cols-2 su-gap-20 [perspective:100rem] su-transition-transform">
            <div class="su-flex su-relative [transform-style:preserve-3d] su-duration-1000 {{contentAlignmentClass}}" data-card-inner="true">
                <!-- Front side of card -->
                <div class="su-group/front su-relative su-bg-white su-backface-hidden su-rounded-[8px] su-shadow-lg su-min-w-full" aria-hidden="false" data-card-inner-content="true">
                    <div class="su-flex su-flex-col su-h-full su-rs-px-5 su-rs-pt-6 su-rs-pb-4">
                        {{#if eyebrow}}
                        <div class="su-type-1 su-text-black-60 su-font-semibold su-rs-mb-1" data-se="eyebrow">
                            {{eyebrow}}
                        </div>
                        {{/if}}
                        <h2 class="su-grow su-type-4 su-font-bold su-font-sans su-text-black dark:su-text-black su-rs-mb-0" data-se="title">
                            {{title}}
                        </h2>
                        <button type="button" tabIndex="" aria-label="See additional information" class="su-block su-ml-auto su-mr-0 su-bg-black su-text-white group-hover/front:su-bg-digital-red focus:su-bg-digital-red su-rounded-full su-p-10 su-stretched-link su-transition-all su-opacity-100 group-aria-hidden/front:su-opacity-0">
                            {{> svg-icons icon="plus" classes=iconPlusClasses}}
                        </button>
                    </div>
                </div>
                <!-- Back side of card -->
                <div class="su-group/back su-relative su-flex su-flex-col su-h-full su-min-w-full su-rounded-[8px] su-rs-px-5 su-rs-pt-6 su-rs-pb-4 su-bg-digital-red-dark su-text-white [transform:rotateY(180deg)_translate(100%,0)] su-backface-hidden su-transition-transform su-shadow-lg" aria-hidden="true" data-card-inner-content="true">
                    <div class="su-big-paragraph su-grow" data-se="content">
                        {{{content}}}
                        <button type="button" tabIndex="-1" aria-label="Dismiss content" class="su-block su-ml-auto su-mr-0 su-border-3 su-border-white su-rounded-full su-text-white focus:su-bg-black group-hover/back:su-bg-black su-p-7 lg:su-p-14 su-stretched-link su-transition-colors">
                            {{> svg-icons icon="arrows rotate" classes=iconArrowClasses}}
                        </button>
                    </div>
                </div>
            </div>
            <div class="su-rounded-[8px] su-overflow-hidden su-shadow-lg {{imageAlignmentClass}}">
                <img src={{imageUrl}} alt="" class="su-object-cover su-size-full" />
            </div>
        </article>
    </div>
</section>
```

### Main.js Implementation:
```javascript
import interactivePhotoCard from './interactive-photo-card.hbs';
import { basicAssetUri } from "../../global/js/utils";
import { processSquizEdit } from '../../global/js/utils/isEditor';

export default {
    async main( args, info ) {
        const fnsCtx = info?.fns || info?.ctx || {};

        // CHANGE: change const to let for mutability
        let { title, eyebrow, content, image, imageAlignment } = args || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Provide default values for inline editable fields
            title = title || 'Interactive Card Title';
            eyebrow = eyebrow || 'Sample Eyebrow';
            content = content || '<p>This is sample content that appears on the flip side of the interactive card. It demonstrates the inline editing functionality for FormattedText fields.</p>';
            
            // Provide default image for edit mode
            image = image || 'matrix-asset://api-identifier/sample-image';
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "title": { "field": "title" },
                "eyebrow": { "field": "eyebrow" },
                "content": { "field": "content" }
            };
        }

        // Validate required functions - CHANGE: wrap in !squizEdit check
        try {
            if (!squizEdit && (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined')) {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Interactive photo card component: ', er);
            return `<!-- Error occurred in the Interactive photo card component: ${er.message} -->`;
        }

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
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
        }

        // Getting image data with error handling
        let imageData = null;
        try {
            imageData = await basicAssetUri(info.fns, image);
        } catch (er) {
            console.error('Error occurred in the Interactive photo card component: Failed to fetch image data. ', er);
            // NEW: In edit mode, provide mock data instead of returning error
            if (squizEdit) {
                imageData = {
                    url: 'https://picsum.photos/600/400',
                    attributes: {
                        alt: 'Sample interactive card image',
                        width: 600,
                        height: 400
                    }
                };
            } else {
                return `<!-- Error occurred in the Interactive photo card component: Failed to fetch image data. ${er.message} -->`;
            }
        }

        // Prepare component data for template rendering
        const componentData = {
            title,
            eyebrow,
            content,
            imageUrl: imageData?.url,
            contentAlignmentClass: imageAlignment === 'left' ? 'xl:su-order-2' : '',
            imageAlignmentClass: imageAlignment === 'left' ? 'xl:su-order-first' : '',
            iconPlusClasses: "su-size-30 md:su-size-50 su-fill-none group-hover/front:su-scale-110 group-focus-within/front:su-scale-110 su-transition-transform",
            iconArrowClasses: "su-size-30 lg:su-size-36 su-fill-none group-hover/back:su-rotate-45 su-transition-transform"
        };

        // NEW: Early return pattern for edit mode
        if (squizEdit) {
            return processSquizEdit(interactivePhotoCard(componentData), squizEditTargets, args);
        }

        return interactivePhotoCard(componentData);
    },
};
```

### Key Features Demonstrated:
- **Mixed Field Types**: String fields (title, eyebrow) and FormattedText field (content)
- **Optional Fields**: Eyebrow field is optional and conditionally rendered
- **Interactive Elements**: Maintains flip card functionality with CSS transforms
- **Image Integration**: Handles image asset loading with error fallback
- **Layout Options**: Supports left/right image alignment via quick options
- **Accessibility**: ARIA labels and tab indexing maintained
- **Visual Effects**: Shadow, border radius, and color transitions intact

**Generated `data-sq-field` attributes:**
- Card title: `data-sq-field="title"`
- Card eyebrow: `data-sq-field="eyebrow"` (when present)
- Card content: `data-sq-field="content"` (FormattedText on flip side)

### Interactive Features Preserved:
- **Flip Animation**: CSS 3D transforms for card flipping remain functional
- **Button Interactions**: Plus and arrow buttons maintain hover/focus states
- **Responsive Layout**: Grid layout and responsive classes preserved
- **Accessibility**: ARIA labels and tab indexing maintained
- **Visual Effects**: Shadow, border radius, and color transitions intact

This pattern is ideal for components that:
- Combine simple text fields with rich FormattedText content
- Have complex interactive UI elements (animations, transforms)
- Include optional fields that may not always be present
- Need to maintain existing CSS animations and JavaScript functionality
- Handle image assets with error fallback scenarios

The implementation preserves all interactive functionality while enabling inline editing of the core content fields, making it easy for editors to update card content without disrupting the user experience.

## Configuration Examples
```

## Example 11: Media-Carousel Component (API-Based Array with Shared Partials)

The `media-carousel` component demonstrates inline editing for an array of media cards fetched from an external API, with proper error handling and shared partial updates.

### Inline Editable Fields:
1. `title` - Card title (string) - in cards array
2. `author` - Card author (string) - in cards array  
3. `teaserText` - Card description (string, multi-line) - in cards array

### Updated main.js
```javascript
import mediaCarouselTemplate from './media-carousel.hbs';
import {cardDataAdapter, matrixMediaCardService, isRealExternalLink, uuid } from "../../global/js/utils";
import { SidebarHeading } from "../../global/js/helpers";
import { processSquizEdit } from '../../global/js/utils/isEditor';

export default {
    async main(args, info) {
        // Extracting environment variables and functions from provided info
        const { API_IDENTIFIER } = info?.env || info?.set?.environment || {};
        const fnsCtx = info?.fns || info?.ctx || {};
        
        // CHANGE: change const to let for mutability
        let { cards } = args || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values if cards array is not provided or empty
            cards = cards && cards.length > 0 ? cards : [
                {
                    cardType: 'Book',
                    title: 'Sample Media Title 1',
                    author: 'Sample Author 1',
                    teaserText: 'This is sample teaser text for the first media card.',
                    image: 'matrix-asset://api-identifier/sample-image-1',
                    linkUrl: 'https://example.com'
                },
                {
                    cardType: 'Podcast',
                    title: 'Sample Media Title 2',
                    author: 'Sample Author 2',
                    teaserText: 'This is sample teaser text for the second media card.',
                    image: 'matrix-asset://api-identifier/sample-image-2',
                    linkUrl: 'https://example.com'
                }
            ];
            
            // Ensure each card has default values
            cards = cards.map(card => ({
                ...card,
                title: card.title || 'Sample Media Title',
                author: card.author || 'Sample Author',
                teaserText: card.teaserText || 'Sample teaser text for this media item.'
            }));
            
            // Configure edit targets for array - maps static data-se attributes to component fields
            squizEditTargets = {
                "title": {
                    "field": "cards",
                    "array": true,
                    "property": "title"
                },
                "author": {
                    "field": "cards",
                    "array": true,
                    "property": "author"
                },
                "teaserText": {
                    "field": "cards",
                    "array": true,
                    "property": "teaserText"
                }
            };
        }

        // Validate required environment variables - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            // ... existing validation logic ...
        }

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            // ... existing validation logic ...
        }

        const adapter = new cardDataAdapter();
        let data = null;

        // Compose and fetch the FB search results
        const service = new matrixMediaCardService({ ctx: fnsCtx, API_IDENTIFIER });
        adapter.setCardService(service);

        // Get the cards data with error handling
        try {
            data = await adapter.getCards(cards);
        } catch (er) {
            console.error('Error occurred in the Media carousel component: Failed to fetch card data. ', er);
            // NEW: In edit mode, provide mock data instead of returning error
            if (squizEdit) {
                data = cards.map((card, index) => ({
                    type: card.cardType || 'Book',
                    title: card.title,
                    author: card.author,
                    description: card.teaserText,
                    imageUrl: 'https://picsum.photos/400/600',
                    imageAlt: `Sample media image ${index + 1}`,
                    liveUrl: card.linkUrl || 'https://example.com',
                    taxonomy: card.cardType === 'Podcast' ? 'Featured audio' : 'Featured reading'
                }));
            } else {
                return `<!-- Error occurred in the Media carousel component: Failed to fetch card data. ${er.message} -->`;
            }
        }

        // ... rest of processing logic ...

        // Prepare component data for template rendering
        const componentData = {
            id: uuid(),
            slides: data,
            width: "large"
        };

        // NEW: Early return pattern for edit mode
        if (!squizEdit) return mediaCarouselTemplate(componentData);

        // NEW: Process for edit mode
        return processSquizEdit(mediaCarouselTemplate(componentData), squizEditTargets);
    }
};
```

### Updated card-media.hbs (Shared Partial)
```handlebars
<article aria-label="{{title}}" data-test="media-card" class="...">
    {{#if imageUrl}}
    <div class="...">
        <img class="..." src="{{imageUrl}}" alt="{{imageAlt}}" />
    </div>
    {{/if}}
    <div class="su-media-card-text ...">
        {{#if taxonomy}}
        <div class="...">
            {{{sidebarHeading}}}
        </div>
        {{/if}}
        {{#if title}}
        <h3 class="...">
            {{#if liveUrl}}
            <a href="{{liveUrl}}" class="...">
                <span data-se="title">{{title}}</span>
                {{#if isRealExternalLink}} 
                <!-- external link icon -->
                {{/if}}                  
            </a>
            {{else}}
            <span class="..." data-se="title">{{title}}</span>
            {{/if}}
        </h3>
        {{/if}}
        {{#if author}}
        <div data-test="mediacard-author" class="..." data-se="author">{{author}}</div>
        {{/if}}
        {{#if type}}
        <div class="...">
            <!-- type icon and text -->
        </div>
        {{/if}}
        {{#if description}} 
        <div data-test="mediacard-description" class="..." data-se="teaserText">
            {{description}}
        </div>
        {{/if}}
    </div>
</article>
```

### Key Features Demonstrated:
- **Array-based inline editing**: Multiple media cards with auto-indexing
- **Mixed API data sources**: Uses matrix-asset-uri for images and external APIs for card data
- **Shared partial updates**: Added static `data-se` attributes to reusable card-media partial
- **Comprehensive error handling**: Provides mock data when Matrix API fails in edit mode
- **Complex data transformation**: Maintains existing card processing and type icon logic
- **Carousel integration**: Works with existing Swiper.js carousel functionality

**Generated `data-sq-field` attributes:**
- Card titles: `data-sq-field="cards[0].title"`, `cards[1].title`, etc.
- Card authors: `data-sq-field="cards[0].author"`, `cards[1].author`, etc.
- Card descriptions: `data-sq-field="cards[0].teaserText"`, `cards[1].teaserText`, etc.

This pattern is ideal for components that:
- Display arrays of content cards from external APIs
- Use shared partials that need to work with multiple components
- Require robust error handling for API failures
- Include complex data processing and transformation
- Need to maintain existing carousel/slider functionality
- Handle both simple string fields and multi-line text content

The implementation preserves all carousel functionality while enabling inline editing of the core content fields, with graceful fallback to mock data when APIs are unavailable during editing.

## Configuration Examples
```

## Example 12: Media-Feature Component (Nested Object Fields with Media Content)

The `media-feature` component demonstrates inline editing for nested object fields in a media-focused component with proper validation and mock data for edit mode.

### Inline Editable Fields:
1. `title` - Media title (string) - in contentConfiguration object
2. `teaserText` - Media description (string, multi-line) - in contentConfiguration object

### Updated main.js
```javascript
import { basicAssetUri } from "../../global/js/utils";
import { SidebarHeading } from "../../global/js/helpers";
import mediaFeatureTemplate from './media-feature.hbs';
import { processSquizEdit } from '../../global/js/utils/isEditor';

export default {
    async main(args, info) {
        // Extracting functions from provided info
        const fnsCtx = info?.fns || info?.ctx || {};
                
        // CHANGE: change const to let for mutability
        let { backgroundImage, image, title, teaserText, mediaType, linkUrl } = args?.contentConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values for inline editable fields
            title = title || 'Featured Media Title';
            teaserText = teaserText || 'This is a sample description for the featured media content that can be edited inline.';
            
            // Set up inline editing targets for nested object fields
            squizEditTargets = {
                "title": {
                    "field": "contentConfiguration.title"
                },
                "teaserText": {
                    "field": "contentConfiguration.teaserText"
                }
            };
        }

        // Early return for edit mode with wrapped validation
        if (!squizEdit) {
            // Validate required functions
            try {
                if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                    throw new Error(
                        `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Media feature component: ', er);
                return `<!-- Error occurred in the Media feature component: ${er.message} -->`;
            }
            // Additional validation checks...
        }

        let bgImageData = null;
        let imageData = null;

        // Asset loading with simplified error handling for edit mode
        if (backgroundImage) {
            try {
                bgImageData = await basicAssetUri(fnsCtx, backgroundImage);
            } catch (er) {
                // In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    bgImageData = { url: 'https://via.placeholder.com/1200x600', attributes: { alt: 'Background image' } };
                }
            }
        }

        if (image) {
            try {
                imageData = await basicAssetUri(fnsCtx, image);
            } catch (er) {
                // In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    imageData = { url: 'https://via.placeholder.com/300x300', attributes: { alt: 'Featured media image' } };
                }
            }
        }

        // Process media type logic...
        let iconName, iconTestId, heading;
        
        if (mediaType === "Book") {
            iconName = "book-open-cover";
            iconTestId = "svg-book-open-cover";
        } else if (mediaType === "Podcast") {
            iconName = "microphone";
            iconTestId = "svg-microphone";
        } else if (mediaType === "Magazine") {
            iconName = "book-open";
            iconTestId = "svg-book-open";
        }

        switch (mediaType) {
            case "Podcast":
                heading = SidebarHeading({ icon: "Featured audio", title: "Featured audio" });
                break;
            case "Magazine":
                heading = SidebarHeading({ icon: "Featured reading", title: "Featured reading" });
                break;
            default:
                heading = SidebarHeading({ icon: "Featured reading", title: "Featured book" });
        }

        // Prepare component data for template rendering
        const componentData = {
            bgImageData,
            imageData,
            title,
            teaserText,
            mediaType,
            linkUrl,
            isPodcast: mediaType === "Podcast",
            heading,
            width: 'full',
            paddingX: false,
            iconName,
            iconTestId,
        };

        // NEW: Early return pattern for front-end
        if (!squizEdit) return mediaFeatureTemplate(componentData);

        // NEW: Process for edit mode
        return processSquizEdit(mediaFeatureTemplate(componentData), squizEditTargets);
    }
};
```

### Updated media-feature.hbs
The template requires wrapping the inline editable fields with `data-se` attributes using the nested object paths:

```handlebars
<h3 class="su-text-[35px] su-font-bold su-leading-tight su-mb-15 md:su-mb-19 md:su-text-[40px] lg:su-text-[43px]">
    <a href="{{linkUrl}}" class="su-media-feature-title-link su-stretched-link">
        <span data-se="title">{{title}}</span>
        <!-- External link icon -->
    </a>
</h3>

<p class="su-text-18 su-w-full su-m-0 su-leading-[125%] su-text-black su-font-normal md:su-text-19 lg:su-text-21" data-se="teaserText">
    {{teaserText}}
</p>
```

### Key Patterns:
1. **Nested Object Targeting**: Use dot notation for nested object fields (`contentConfiguration.title`)
2. **Graceful Asset Loading**: Try to load real images first, fallback to placeholders only on API failure in edit mode
3. **Simplified Error Handling**: Provide mock data when API calls fail in edit mode without console errors or error returns
4. **Proper Field Defaults**: Provide meaningful sample content for missing fields
5. **Validation Wrapping**: Skip validation entirely in edit mode for better performance

## Example 13: Multicolumn-Info-Section Component (Format 3: Custom Field Mapping)

This example demonstrates the new **Format 3: Array with Custom Field Mapping** for handling multiple elements with the same `data-se` attribute that need to map to completely different field paths.

### The Challenge
The multicolumn-info-section component uses the `link-button` partial in two different contexts:
1. **Column Two**: Direct usage for main content button
2. **Column Three**: Via `info-box` partial for callout button

Both buttons use the same `data-se="button"` attribute from the shared `link-button` partial, but need to map to different data fields.

### Updated main.js
```javascript
import { processSquizEdit } from '../../global/js/utils/isEditor';
import multicolumnInfoSectionTemplate from './multicolumn-info-section.hbs';

export default {
    async main(args, info) {
        // ... component setup ...

        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Format 3: Array with Custom Field Mapping
            squizEditTargets = {
                "title": {
                    "field": "colOne.title"
                },
                "infoText": {
                    "field": "colTwo.infoText"
                },
                // NEW: Format 3 - Multiple buttons with same data-se mapped to different fields
                "button": [
                    { "field": "colTwo.buttonConfiguration.buttonText" },
                    { "field": "colThree.buttonConfiguration.buttonText" }
                ],
                "infoBoxTitle": {
                    "field": "colThree.title"
                },
                "infoBoxContent": {
                    "field": "colThree.content"
                },
                "captionCredit": {
                    "field": "colThree.imageConfiguration.caption"
                }
            };
        }

        // ... component processing ...

        if (!squizEdit) return multicolumnInfoSectionTemplate(componentData);
        return processSquizEdit(multicolumnInfoSectionTemplate(componentData), squizEditTargets);
    }
};
```

### Template Structure
```handlebars
<div data-component="multicolumn-info-section">
    <h2 data-se="title">{{title}}</h2>
    <div data-se="infoText">{{{infoText}}}</div>
    
    <!-- First button context: Direct usage -->
    {{#if buttonData}}
        {{> link-button buttonText=buttonData.buttonText buttonUrl=buttonData.buttonUrl}}
    {{/if}}
    
    <!-- Second button context: Via info-box partial -->
    {{#if infoBoxData}}
        {{> info-box 
            title=infoBoxData.title 
            content=infoBoxData.content 
            buttonText=infoBoxData.buttonText 
            buttonUrl=infoBoxData.buttonUrl}}
    {{/if}}
</div>
```

### Shared Partials (Unchanged)
**link-button.hbs** (shared partial):
```handlebars
{{#if buttonUrl}}
<a href="{{buttonUrl}}" class="{{linkButtonClasses}}">
    <span data-se="button">{{buttonText}}</span>
</a>
{{/if}}
```

**info-box.hbs** (shared partial):
```handlebars
<div class="info-box">
    <h3 data-se="infoBoxTitle">{{title}}</h3>
    <div data-se="infoBoxContent">{{{content}}}</div>
    {{#if buttonText}}
        {{> link-button buttonText=buttonText buttonUrl=buttonUrl}}
    {{/if}}
</div>
```

### How Format 3 Works
1. **Document Order Processing**: `processSquizEdit` scans the HTML and finds both `data-se="button"` elements in document order
2. **Sequential Mapping**: 
   - **First button** (in column two) → `colTwo.buttonConfiguration.buttonText`
   - **Second button** (in info-box) → `colThree.buttonConfiguration.buttonText`
3. **Result**: Each button gets its own unique `data-sq-field` attribute

### Generated Output
```html
<div data-component="multicolumn-info-section">
    <h2 data-se="title" data-sq-field="colOne.title">Research</h2>
    <div data-se="infoText" data-sq-field="colTwo.infoText">Content here...</div>
    
    <!-- First button gets first mapping -->
    <a href="#" data-se="button" data-sq-field="colTwo.buttonConfiguration.buttonText">
        <span>Column Two Button</span>
    </a>
    
    <div class="info-box">
        <h3 data-se="infoBoxTitle" data-sq-field="colThree.title">Info Title</h3>
        <div data-se="infoBoxContent" data-sq-field="colThree.content">Info content...</div>
        
        <!-- Second button gets second mapping -->
        <a href="#" data-se="button" data-sq-field="colThree.buttonConfiguration.buttonText">
            <span>Info Box Button</span>
        </a>
    </div>
</div>
```

### Key Benefits of Format 3
- **No Template Changes**: Existing shared partials remain unchanged
- **Reusable Partials**: `link-button` partial keeps its generic `data-se="button"`
- **Flexible Mapping**: Same `data-se` attribute maps to completely different data structures
- **Document Order**: Predictable mapping based on HTML structure
- **Backward Compatible**: All existing implementations continue to work

### When to Use Format 3
- Multiple elements with the same `data-se` attribute in different contexts
- Shared partials used in multiple places with different data structures
- Need precise control over field mapping for each occurrence
- Elements represent different types of content (not homogeneous arrays)

This pattern is particularly useful for components that use shared partials (like buttons, cards, headings) in multiple contexts where each usage needs to map to different data fields.

## Example 14: Policy-Brief Component (Nested Object Fields - Simple Pattern)

The `policy-brief` component demonstrates inline editing for nested object fields in a straightforward content card component with proper validation wrapping and asset error handling.

### Inline Editable Fields:
1. `title` - Policy brief title (string) - in contentConfiguration object
2. `summary` - Policy brief summary (string, multi-line) - in contentConfiguration object  
3. `linkText` - Link text (string) - in contentConfiguration object

### Updated main.js
```javascript
import { basicAssetUri } from '../../global/js/utils';
import { processSquizEdit } from '../../global/js/utils/isEditor';
import policyBriefTemplate from './policy-brief.hbs';

export default {
    async main(args, info) {
        const fnsCtx = info?.fns || info?.ctx || {};

        // CHANGE: change const to let for mutability
        let { image, type, title, summary, linkUrl, linkText } = args?.contentConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values for inline editable fields
            title = title || 'Policy Brief Title';
            summary = summary || 'This is a sample summary for the policy brief that can be edited inline.';
            linkText = linkText || 'Read the full brief';
            
            // Provide default values for other required fields
            type = type || 'Policy Brief';
            image = image || 'matrix-asset://api-identifier/63353';
            linkUrl = linkUrl || 'https://example.com';
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "title": { "field": "contentConfiguration.title" },
                "summary": { "field": "contentConfiguration.summary" },
                "linkText": { "field": "contentConfiguration.linkText" }
            };
        }

        // Validate required functions - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                    throw new Error(
                        `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Policy brief component: ', er);
                return `<!-- Error occurred in the Policy brief component: ${er.message} -->`;
            }
        }

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            // ... existing validation logic wrapped in !squizEdit check ...
        }

        let assetData = null;

        // Getting image data with error handling
        if (image) {
            try {
                assetData = await basicAssetUri(fnsCtx, image);
            } catch (er) {
                console.error('Error occurred in the Policy brief component: Failed to fetch image data. ', er);
                // NEW: In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    assetData = {
                        url: 'https://picsum.photos/400/600',
                        attributes: {
                            alt: 'Sample policy brief image',
                            width: 400,
                            height: 600
                        }
                    };
                }
            }
        }

        // Prepare component data for template rendering
        const componentData = {
            imageUrl: assetData,
            type,
            title,
            summary,
            linkUrl,
            linkText,
            width: "wide",
            paddingX: false
        };

        // NEW: Early return pattern
        if (!squizEdit) return policyBriefTemplate(componentData);

        // NEW: Process for edit mode
        return processSquizEdit(policyBriefTemplate(componentData), squizEditTargets);
    }
};
```

### Updated Template (policy-brief.hbs)
```handlebars
<section data-component="policy-brief">
    <div class="{{containerClasses width=width paddingX=paddingX}}">
        <div class="su-relative su-flex su-flex-col su-gap-20 su-py-30 su-px-20 su-bg-fog-light md:su-mx-50 md:su-flex-row md:su-gap-18 lg:su-gap-48 md:su-p-36 lg:su-py-61 lg:su-px-65 dark:su-bg-transparent dark:before:su-bg-black dark:before:su-opacity-[0.5] dark:before:su-content-[''] dark:before:su-absolute dark:before:su-w-full dark:before:su-h-full dark:before:su-top-0 dark:before:su-left-0 dark:before:su-z-1">
            <div class="su-relative su-w-full su-h-[233px] md:su-h-auto md:su-min-w-[257px] lg:su-h-[378.331px] lg:su-flex-1 su-z-2">
                {{#if imageUrl.url}}
                <img src="{{imageUrl.url}}" class="su-absolute su-size-full su-object-cover" alt="" />
                {{/if}}
            </div>
            <div class="lg:su-flex-1 su-relative su-z-2">
                <div class="su-flex su-gap-6 su-items-center su-text-18 su-font-semibold su-pb-20 md:su-pb-27">
                    {{#if type}}
                    {{#ifEquals type "Policy Brief"}}
                        <span class="dark:su-hidden">{{> svg-icons icon="policy brief" theme="light"}}</span>
                        <span class="su-hidden dark:su-block">{{> svg-icons icon="policy brief" theme="dark"}}</span>
                    {{else}}
                        <span class="dark:su-hidden">{{> svg-icons icon="case study" theme="light"}}</span>
                        <span class="su-hidden dark:su-block">{{> svg-icons icon="case study" theme="dark"}}</span>
                    {{/ifEquals}}
                        <span>{{type}}</span>
                    {{/if}}
                </div>
                {{#if title}}
                    <h2 class="su-text-[33px] su-font-bold su-leading-[125%] su-font-serif su-pb-19 su-m-0" data-se="title">{{title}}</h2>
                {{/if}}
                {{#if summary}}
                    <p class="su-text-19 su-font-normal su-leading-[125%] su-pb-20 md:su-pb-27 su-m-0" data-se="summary">{{summary}}</p>
                {{/if}}
                {{#if linkUrl}}
                    <a href="{{linkUrl}}" class="su-flex su-gap-2 su-group su-text-19 su-font-semibold su-leading-[125%] su-text-digital-red su-no-underline dark:su-text-dark-mode-red hocus:su-underline">
                        <span data-se="linkText">{{linkText}}</span>
                        <span class="su-transition group-hocus:su--translate-y-01em group-hocus:su-translate-x-01em [&>svg]:su-translate-y-1">
                            {{> svg-icons icon="external arrow"}}
                        </span>
                    </a>
                {{/if}}
            </div>
        </div>
    </div>
</section>
```

### Key Features Demonstrated:
- **Nested Object Fields**: All inline editable fields are within `contentConfiguration` object
- **Mixed Field Types**: String fields (title, linkText) and multi-line string field (summary)
- **Asset Error Handling**: Graceful fallback to mock image data when asset loading fails in edit mode
- **Validation Wrapping**: All existing validation logic wrapped in `!squizEdit` checks
- **Link Text Wrapping**: Added `<span>` wrapper around link text to enable precise inline editing
- **Conditional Rendering**: Proper handling of optional fields with existing conditional logic

**Generated `data-sq-field` attributes:**
- Policy brief title: `data-sq-field="contentConfiguration.title"`
- Policy brief summary: `data-sq-field="contentConfiguration.summary"`
- Link text: `data-sq-field="contentConfiguration.linkText"`

### Key Patterns:
1. **Nested Object Targeting**: Use dot notation for nested object fields (`contentConfiguration.title`)
2. **Link Text Precision**: Wrap link text in `<span>` to avoid making icons and other elements editable
3. **Asset Error Handling**: Provide mock image data when asset loading fails in edit mode
4. **Validation Wrapping**: Skip all validation in edit mode for better performance
5. **Meaningful Defaults**: Provide sample content that makes sense for the component type

This pattern is ideal for components that:
- Have nested configuration objects with multiple inline editable fields
- Include asset loading that may fail during editing
- Need precise control over which parts of links are editable
- Have extensive validation that should be bypassed in edit mode
- Display content cards with title, description, and call-to-action elements

The implementation maintains all existing functionality while enabling inline editing of the core content fields, with graceful fallback behavior when external dependencies are unavailable.

## Example 15: Pull-Quote Component (Shared Partials with Nested Object Fields)

The `pull-quote` component demonstrates inline editing for nested object fields using shared partials, with proper validation wrapping and asset error handling.

### Inline Editable Fields:
1. `quote` - Pull quote text (string, multi-line) - in displayConfiguration object
2. `name` - Quotee name (string) - in displayConfiguration object  
3. `title` - Quotee title/role (string) - in displayConfiguration object

### Updated main.js
```javascript
import { basicAssetUri } from "../../global/js/utils";
import { processSquizEdit } from '../../global/js/utils/isEditor';
import pullQuote from './pull-quote.hbs';

export default {
    async main(args, info) {
        const { API_IDENTIFIER } = info?.env || info?.set?.environment || {};
        const fnsCtx = info?.fns || info?.ctx || {};
        
        // CHANGE: change const to let for mutability
        let { asset, quote, name, title, width } = (args && args.displayConfiguration) || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values for inline editable fields
            quote = quote || 'This is a sample pull quote that can be edited inline to highlight important content.';
            name = name || 'Sample Name';
            title = title || 'Sample Title';
            
            // Provide default values for other required fields
            width = width || 'Narrow';
            asset = asset || 'matrix-asset://api-identifier/164977';
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "featuredQuote": { "field": "displayConfiguration.quote" },
                "name": { "field": "displayConfiguration.name" },
                "title": { "field": "displayConfiguration.title" }
            };
        }

        // Validate required functions - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                    throw new Error(
                        `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                    );
                }
                if (typeof API_IDENTIFIER !== 'string' || API_IDENTIFIER === '') {
                    throw new Error(
                        `The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(API_IDENTIFIER)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Pull quote component: ', er);
                return `<!-- Error occurred in the Pull quote component: ${er.message} -->`;
            }
        }

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            // ... existing validation logic wrapped in !squizEdit check ...
        }

        // Process asset if provided with error handling
        let assetData = null;
        if (asset) {
            try {
                assetData = await basicAssetUri(fnsCtx, asset);
            } catch (er) {
                console.error('Error occurred in the Pull quote component: Failed to fetch asset data. ', er);
                // NEW: In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    assetData = {
                        url: 'https://picsum.photos/200/200',
                        attributes: {
                            alt: 'Sample avatar image',
                            width: 200,
                            height: 200
                        }
                    };
                }
            }
        }

        // Prepare template data
        const componentData = {
            avatarURL: assetData?.url ? assetData.url : "",
            quote,
            name,
            title,
            width: width.toLocaleLowerCase()
        };

        // NEW: Early return pattern
        if (!squizEdit) return pullQuote(componentData);

        // NEW: Process for edit mode
        return processSquizEdit(pullQuote(componentData), squizEditTargets);
    }
};
```

### Component Template (pull-quote.hbs)
```handlebars
<section data-component="pullquote">
    <div class="{{containerClasses width=width}}">
        {{> pull-quote avatarURL=avatarURL avatarAlt="" avatarSize="large" quote=quote name=name title=title}}
    </div>
</section>
```

### Updated Shared Partial (global/hbs/partials/pull-quote/pull-quote.hbs)
```handlebars
<div class="su-component-pullquote su-mx-auto su-relative su-mt-0 su-flex su-flex-wrap su-gap-27 su-justify-center su-pr-0 su-py-0">
    {{#if avatarURL}}{{> avatar avatarURL=avatarURL avatarAlt=avatarAlt size=avatarSize}}{{/if}}
    <blockquote class="su-w-full su-pl-39 dark:su-text-white dark:before:su-text-white su-font-serif su-text-black {{getStringByCondition value=avatarSize expectedValue="large" trueResult="lg:su-pl-[5.2rem]" falseResult="lg:su-pl-0"}}">
        <div class="su-font-semibold su-font-serif-0 su-text-[2.4rem] md:su-text-[3.6rem] su-leading md:su-leading-[130.245%] [&>*:last-child]:su-mb-0 [&>*:last-child]:after:su-content-['"'] su-relative before:su-text-[73px] before:su-leading-[109.5px] lg:before:su-leading-[139.5px] lg:before:su-text-[93px] before:su-font-semibold before:su--mt-25 lg:before:su--mt-38 before:su-content-['"'] before:su-text-serif before:su-text-black dark:su-text-white before:su-absolute before:su-right-full lg:before:su-right-full before:su-mr-6 lg:before:su-mr-13 dark:before:su-text-white su-leading-[33.6px] md:su-leading-[46.89px]" data-se="featuredQuote">
            {{quote}}"
        </div>
        {{#if name}}
            <cite class="su-mt-15 md:su-mt-26 lg:su-mt-29 su-font-sans su-text-21 su-leading-[25.2px] su-flex su-flex-col">
                <span class="su-font-bold su-block su-leading-[25.2px]" data-se="name">
                {{name}}
                </span>
                {{#if title}}
                <span class="su-block su-leading-[25.2px]" data-se="title">{{title}}</span>
                {{/if}}
            </cite>
        {{/if}}
    </blockquote>
</div>
```

### Key Features Demonstrated:
- **Shared Partial Updates**: Modified global shared partial to add static `data-se` attributes
- **Existing Attribute Reuse**: Leveraged existing `data-se="featuredQuote"` attribute for quote field
- **Nested Object Fields**: All inline editable fields are within `displayConfiguration` object
- **Mixed Field Types**: Multi-line string field (quote) and regular string fields (name, title)
- **Asset Error Handling**: Graceful fallback to mock avatar image when asset loading fails in edit mode
- **Environment Variable Validation**: Proper handling of required API_IDENTIFIER environment variable
- **Conditional Rendering**: Proper handling of optional fields (name, title) with existing conditional logic

**Generated `data-sq-field` attributes:**
- Pull quote text: `data-sq-field="displayConfiguration.quote"`
- Quotee name: `data-sq-field="displayConfiguration.name"`
- Quotee title: `data-sq-field="displayConfiguration.title"`

### Key Patterns:
1. **Shared Partial Modification**: Updated global partial to add static `data-se` attributes for reusability
2. **Existing Attribute Leverage**: Used existing `data-se="featuredQuote"` without changes
3. **Nested Object Targeting**: Use dot notation for nested object fields (`displayConfiguration.*`)
4. **Environment Variable Handling**: Proper validation of required environment variables in edit mode
5. **Avatar Asset Handling**: Provide mock avatar image when asset loading fails in edit mode

This pattern is ideal for components that:
- Use shared partials that need to work across multiple components
- Have nested configuration objects with multiple inline editable fields
- Include optional avatar/image assets that may fail to load during editing
- Require environment variables for proper operation
- Display quoted content with attribution (name and title)

The implementation maintains all existing functionality while enabling inline editing of the core content fields. The shared partial updates ensure that any other components using the same partial will also benefit from the inline editing capabilities.

## Example 16: Related-Story Component (API-Based with Description Override)

The `related-story` component demonstrates inline editing for API-based components with description override functionality, featuring comprehensive error handling and mock data fallbacks.

### Inline Editable Fields:
1. `descriptionOverride` - Description override text (string, multi-line) - in contentConfiguration object

### Updated main.js
```javascript
import relatedStory from './related-story.hbs';
import { cardDataAdapter, matrixCardService } from '../../global/js/utils';
import { processSquizEdit } from '../../global/js/utils/isEditor';

export default {
    async main(args, info) {
        const fnsCtx = info?.fns || info?.ctx || {};
        const { API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};

        // CHANGE: change const to let for mutability
        let { story, descriptionOverride } = args && args?.contentConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values for inline editable fields
            descriptionOverride = descriptionOverride || 'This is a sample description override that can be edited inline to customize the related story description.';
            
            // Provide default values for other required fields
            story = story || 'matrix-asset://api-identifier/163459';
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "description": { "field": "contentConfiguration.descriptionOverride" }
            };
        }

        // Validate required functions and environment - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                    throw new Error(
                        `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                    );
                }
                if (typeof API_IDENTIFIER !== 'string' || API_IDENTIFIER === '') {
                    throw new Error(
                        `The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(API_IDENTIFIER)} was received.`
                    );
                }
                if (typeof BASE_DOMAIN !== 'string' || BASE_DOMAIN === '') {
                    throw new Error(
                        `The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(BASE_DOMAIN)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Related story component: ', er);
                return `<!-- Error occurred in the Related story component: ${er.message} -->`;
            }
        }

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            // ... existing validation logic wrapped in !squizEdit check ...
        }

        // Initialize card adapter and service
        const adapter = new cardDataAdapter();
        let data = null;

        const service = new matrixCardService({ BASE_DOMAIN, API_IDENTIFIER });
        adapter.setCardService(service);

        // Fetch story data with error handling
        try {
            data = await adapter.getCards([{ cardAsset: story }]);
        } catch (er) {
            console.error('Error occurred in the Related story component: Failed to fetch story data. ', er);
            // NEW: In edit mode, provide mock data instead of returning error
            if (squizEdit) {
                data = [{
                    title: 'Sample Related Story Title',
                    description: 'This is a sample description from the API that would normally be fetched.',
                    liveUrl: 'https://example.com',
                    imageUrl: 'https://picsum.photos/200/200',
                    imageAlt: 'Sample related story image'
                }];
            } else {
                return `<!-- Error occurred in the Related story component: Failed to fetch story data. ${er.message} -->`;
            }
        }

        // Validate fetched data - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            // ... existing validation logic wrapped in !squizEdit check ...
        }
        
        let { title, description, liveUrl, imageUrl, imageAlt } = data[0]

        // Prepare template data
        const componentData = {
            width: "narrow",
            liveUrl,
            imageUrl,
            imageAlt,
            title,
            description: descriptionOverride ? descriptionOverride : description || "",
        };

        // NEW: Early return pattern
        if (!squizEdit) return relatedStory(componentData);

        // NEW: Process for edit mode
        return processSquizEdit(relatedStory(componentData), squizEditTargets);
    }
};
```

### Updated Template (related-story.hbs)
```handlebars
<section data-component="related-story">
    <div class="{{containerClasses width=width}}">
        <section class="story__related-story su-col-span-full sm:su-col-span-10 sm:su-col-start-2 lg:su-col-span-6 lg:su-col-start-4 su-mx-auto">
            {{> sidebar-heading title="Related story" icon="bullseye pointer" headingSize="h3" color="black" }}
            <a class="su-text-black hocus:su-text-black su-no-underline su-group" href={{liveUrl}}>
                <div class="su-flex su-gap-20 sm:su-gap-40 su-mt-30 lg:su-mt-36 lg:su-mt-38">
                    <img class="su-object-cover su-h-auto su-max-h-[103px] su-max-w-[103px] md:su-max-h-[168px] md:su-max-w-[168px] lg:su-max-h-[185px] lg:su-max-w-[185px] su-object-center" src="{{imageUrl}}" alt="{{imageAlt}}"/>
                    <div>
                        <h4 class="su-transition group-hocus:su-underline group-hocus:su-text-digital-red dark:group-hocus:su-text-dark-mode-red su-text-20 dark:su-text-white sm:su-text-24 su-font-serif !su-font-bold su-leading-display su-mb-9">
                            {{title}}
                        </h4>
                        <div class="su-wysiwyg-content su-text-16 sm:su-text-18 su-leading-[125%] !su-m-0 su-font-normal dark:su-text-white" data-se="description">
                            {{{description}}}
                        </div>
                    </div>
                </div>
            </a>
        </section>
    </div>
</section>
```

### Key Features Demonstrated:
- **API-Based Component**: Fetches story data from Matrix API using cardDataAdapter and matrixCardService
- **Description Override Logic**: Uses `descriptionOverride` if provided, otherwise falls back to API description
- **Comprehensive Error Handling**: Provides mock data when API calls fail in edit mode
- **Multiple Environment Variables**: Requires both API_IDENTIFIER and BASE_DOMAIN environment variables
- **Nested Object Fields**: Inline editable field is within `contentConfiguration` object
- **Rich Content Support**: Description field supports multi-line text with WYSIWYG content

**Generated `data-sq-field` attributes:**
- Description override: `data-sq-field="contentConfiguration.descriptionOverride"`

### Key Patterns:
1. **API Error Handling**: Comprehensive try-catch around API calls with mock data fallback in edit mode
2. **Description Override Logic**: Conditional logic to use override or API description maintained in edit mode
3. **Multiple Environment Variables**: Proper validation of required API_IDENTIFIER and BASE_DOMAIN
4. **Card Service Integration**: Uses existing cardDataAdapter and matrixCardService utilities
5. **Rich Content Field**: Description field supports HTML content with WYSIWYG styling

This pattern is ideal for components that:
- Fetch content from external APIs (Matrix, Funnelback, etc.)
- Allow content overrides for specific fields
- Require multiple environment variables for API access
- Display rich content that may include HTML formatting
- Need graceful degradation when external services are unavailable
- Use existing card service utilities for data fetching

The implementation maintains all existing API integration while enabling inline editing of the description override field. The mock data ensures editors always have content to work with, even when the Matrix API is unavailable during editing.

### Special Considerations:
- **Override Logic**: The component logic for choosing between `descriptionOverride` and API `description` is preserved
- **API Dependencies**: Component requires both API_IDENTIFIER and BASE_DOMAIN environment variables
- **Rich Content**: Description field supports HTML content, making it suitable for formatted text
- **Card Service Pattern**: Demonstrates the standard pattern for using cardDataAdapter with matrixCardService

// ... existing code ...

## Example 17: Single-CTA-Block Component (Mixed Field Types with Shared Partials)

The `single-cta-block` component demonstrates inline editing for a component with mixed field types (string, FormattedText, and nested object fields) that uses shared partials for CTA functionality.

### Inline Editable Fields:
1. `eyebrow` - Superheading above title (string, optional)
2. `title` - Main heading (string)
3. `description` - Body content (FormattedText)
4. `ctaText` - CTA button text (string) - in ctaConfiguration object

### Updated main.js
```javascript
import { basicAssetUri, isRealExternalLink, uuid } from "../../global/js/utils";
import { processSquizEdit } from '../../global/js/utils/isEditor';
import singleCtaBlock from './single-cta-block.hbs';

export default {
    async main(args, info) {
        const fnsCtx = info?.fns || info?.ctx || {};
        
        // CHANGE: change const to let for mutability
        let { size, title, eyebrow, description, image, isCard, marginTop, marginBottom } = args || {};
        let { ctaText, ctaType, externalUrl, internalUrl, email, isNewWindow } = (args && args.ctaConfiguration) || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values for inline editable fields
            eyebrow = eyebrow || 'Sample Eyebrow';
            title = title || 'Single CTA Block Title';
            description = description || '<p>This is sample description content for the single CTA block that can be edited inline.</p>';
            ctaText = ctaText || 'Click here';
            
            // Provide default values for other required fields
            size = size || 'normal';
            ctaType = ctaType || 'link';
            externalUrl = externalUrl || 'https://example.com';
            isNewWindow = isNewWindow !== undefined ? isNewWindow : false;
            isCard = isCard !== undefined ? isCard : false;
            marginTop = marginTop || '8';
            marginBottom = marginBottom || '8';
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "eyebrow": { "field": "eyebrow" },
                "title": { "field": "title" },
                "description": { "field": "description" },
                "ctaText": { "field": "ctaConfiguration.ctaText" }
            };
        }

        // NEW: Wrap validation in !squizEdit check
        if (!squizEdit) {
            // ... existing validation logic wrapped in !squizEdit check ...
        }

        // Asset loading with error handling
        let imageData = null;
        if (image) {
            try {
                imageData = await basicAssetUri(fnsCtx, image);
            } catch (er) {
                // NEW: In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    imageData = {
                        url: 'https://picsum.photos/400/300',
                        attributes: {
                            alt: 'Sample CTA block image',
                            width: 400,
                            height: 300
                        }
                    };
                }
            }
        }

        // Link resolution with error handling
        let linkData = null;
        if (internalUrl) {
            try {
                linkData = await basicAssetUri(info.fns, internalUrl);
            } catch (er) {
                // NEW: In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    linkData = { url: 'https://example.com' };
                }
            }
        }

        const buttonUrl = linkData?.url || externalUrl;

        const componentData = {
            size,
            title,
            eyebrow,
            isCard,
            marginTop,
            marginBottom,
            description,
            email,
            isNewWindow,
            ctaText,
            ctaType: ctaType,
            isRealExternalLink: ctaType === "link" && !linkData?.url && externalUrl ?
                isRealExternalLink(externalUrl) : false,
            buttonUrl: ctaType === "email" ? `mailto:${email}` : buttonUrl || '#',
            imageUrl: imageData?.url,
            imageAlt: imageData?.attributes?.alt || "",
            containerSize: size === "campaign" ? "cc" : "large",
            linkButtonClasses: size === "campaign" ? "su-mx-auto su-rs-mt-4" : "su-mx-auto su-rs-mt-2",
            iconUniqueID: uuid()
        };

        // NEW: Early return pattern
        if (!squizEdit) return singleCtaBlock(componentData);

        // NEW: Process for edit mode
        return processSquizEdit(singleCtaBlock(componentData), squizEditTargets);
    }
};
```

### Updated Template (single-cta-block.hbs)
```handlebars
<section data-component="single-cta-block">
    <div class="{{containerClasses width=containerSize paddingX=false marginTop=marginTop marginBottom=marginBottom}}">
        <div class="su-flex su-flex-col-reverse xl:su-flex-row-reverse su-items-center su-justify-center su-gap-34 xl:su-gap-60 su-rounded-[8px] su-break-words su-text-black dark:su-text-white{{#if isCard}} su-rs-py-8 su-rs-px-4 su-border dark:su-border-2 su-border-black-30/30 dark:su-border-black su-shadow dark:su-shadow-black/80 su-bg-white dark:su-bg-black-true {{getStringByCondition value=size expectedValue="campaign" trueResult="su-rs-py-8" falseResult="su-rs-py-4"}}{{/if}}">
            <div class="su-flex su-flex-col">
                {{#if eyebrow}}
                    <span aria-hidden="true" class="..." data-se="eyebrow">
                        {{eyebrow}}
                    </span>
                {{/if}}
                {{#if title}}
                    <div class="...">
                        <h2 class="...">
                            {{#if eyebrow}}
                                <span class="su-sr-only">{{eyebrow}}: </span>
                            {{/if}}
                            <span data-se="title">{{title}}</span>
                        </h2>
                    </div>
                {{/if}}
                <div data-test="single-text-block-content" class="..." data-se="description">
                    {{{description}}}
                </div>
                {{#if ctaText}}
                    {{> link-button buttonText=ctaText ...}}
                {{/if}}
            </div>
            {{#if imageUrl}}
                <img src="{{imageUrl}}" alt="{{imageAlt}}" class="..."/>
            {{/if}}
        </div>
    </div>
</section>
```

### Key Features Demonstrated:
- **Mixed Field Types**: String fields (eyebrow, title), FormattedText field (description), and nested object field (ctaConfiguration.ctaText)
- **Optional Fields**: Eyebrow field is optional and conditionally rendered
- **Shared Partial Integration**: Uses existing `link-button` partial with `data-se="button"` attribute for CTA text
- **Asset Error Handling**: Graceful fallback to mock image data when asset loading fails in edit mode
- **Link Resolution**: Handles both internal and external links with error fallback
- **Complex Layout**: Supports campaign vs normal sizing with responsive layout
- **Conditional Styling**: Card mode and various margin/padding options

**Generated `data-sq-field` attributes:**
- Eyebrow: `data-sq-field="eyebrow"` (when present)
- Title: `data-sq-field="title"`
- Description: `data-sq-field="description"` (FormattedText)
- CTA text: `data-sq-field="ctaConfiguration.ctaText"` (via shared partial)

### Key Patterns:
1. **Optional Field Handling**: Eyebrow field is optional and properly handled with conditional rendering
2. **Title Wrapping**: Added `<span>` wrapper around title text to avoid making screen reader text editable
3. **Shared Partial Reuse**: Leveraged existing `link-button` partial with `data-se="button"` attribute
4. **Nested Object Field**: CTA text maps to `ctaConfiguration.ctaText` using dot notation
5. **Asset Error Handling**: Provide mock image and link data when asset loading fails in edit mode
6. **URL Fallback**: Added `|| '#'` fallback for buttonUrl to prevent broken links in edit mode

This pattern is ideal for components that:
- Have mixed field types including optional fields
- Use shared partials for common functionality (buttons, links)
- Include optional image assets that may fail to load during editing
- Support multiple layout modes and styling options
- Need graceful error handling for asset resolution
- Display rich content with call-to-action elements

The implementation maintains all existing functionality while enabling inline editing of the core content fields. The shared partial integration ensures that CTA text editing works seamlessly without requiring changes to the shared `link-button` partial.

## Configuration Examples
```

## Example 18: CTA-Cards-Block Component (Mixed Field Types with Shared Partials)

This example demonstrates handling a component with an array of cards, each containing multiple inline editable fields of different types (string, FormattedText, and nested object fields):

### Updated main.js
```javascript
import { basicAssetUri, isRealExternalLink } from "../../global/js/utils";
import ctaCardsBlockTemplate from './cta-cards-block.hbs';
import { processSquizEdit } from '../../global/js/utils/isEditor';

export default {
  async main(args, info) {
        // CHANGE: change const to let for mutability
        let { cards } = args || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add the targets for the squizEdit DOM augmentation
            squizEditTargets = {
                "eyebrow": {
                    "field": "cards",
                    "array": true,
                    "property": "eyebrow"
                },
                "title": {
                    "field": "cards",
                    "array": true,
                    "property": "title"
                },
                "description": {
                    "field": "cards",
                    "array": true,
                    "property": "description"
                }
            };
            
            // NEW: Provide default values for edit mode
            cards = cards && cards.length > 0 ? cards : [
                {
                    eyebrow: 'Sample Eyebrow',
                    title: 'Sample CTA Card Title',
                    description: '<p>This is a sample description for the CTA card.</p>',
                    linkDetails: {
                        externalUrl: 'https://example.com',
                        isNewWindow: false
                    }
                },
                {
                    eyebrow: 'Another Eyebrow',
                    title: 'Second CTA Card Title',
                    description: '<p>This is another sample description.</p>',
                    linkDetails: {
                        externalUrl: 'https://example.com',
                        isNewWindow: false
                    }
                }
            ];
        }

        // ... existing validation and processing logic wrapped in !squizEdit checks

        // NEW: Early return pattern for edit mode
        if (squizEdit) {
            return processSquizEdit(ctaCardsBlockTemplate(componentData), squizEditTargets, args);
        }

        return ctaCardsBlockTemplate(componentData);
    }
}
```

### Updated card-cta.hbs (Shared Partial)
```handlebars
<article aria-label="{{title}}" class="...">
    {{~#if eyebrow~}}
        <span aria-hidden="true" class="..." data-se="eyebrow">
          {{eyebrow}}
        </span>
    {{~/if~}}
    <h3 class="...">
        {{~#if link~}}
          <a href="{{link}}" class="...">
            {{~#if eyebrow~}}<span class="su-sr-only">{{eyebrow}}: </span>{{~/if~}}
            <span data-se="title">{{title}}</span>
            {{~#if isRealExternalLink~}}
                <span class="su-sr-only">(link is external)</span>
            {{~/if~}}
          </a>
        {{~else~}}
            {{~#if eyebrow~}}<span class="su-sr-only">{{eyebrow}}: </span>{{~/if~}}
            <span data-se="title">{{title}}</span>
        {{~/if~}}
      </h3>
    {{~#if description~}}
        <div class="su-grow">
            <div data-test="cta-card-content" class="..." data-se="description">
                {{{description}}}
            </div>
        </div>
    {{~/if~}}
    <!-- ... rest of template -->
</article>
```

### Key Features Demonstrated:
- **Array-based inline editing**: Multiple cards with auto-indexing
- **Mixed field types**: String fields (eyebrow, title) and FormattedText (description)
- **Shared partial updates**: Static `data-se` attributes in reusable card-cta partial
- **Conditional rendering**: Proper handling of optional fields (eyebrow, description)
- **Link handling**: Maintains existing link functionality while adding inline editing

This pattern works well for components that display multiple similar items (cards, buttons, etc.) where each item has several inline editable fields.

---

## Shared Partials Best Practices
```

## Example 19: Events-Section Component (API-Based with Error Handling)

This example demonstrates handling a component that fetches data from an external API, with proper error handling and mock data provision in edit mode:

### Updated main.js
```javascript
import eventSectionTemplate from './event-section.hbs';
import { cardDataAdapter, eventCardService, linkedHeadingService, isRealExternalLink, uuid } from "../../global/js/utils";
import { EventStartEndDate } from '../../global/js/helpers';
import { processSquizEdit } from '../../global/js/utils/isEditor';

export default {
    async main(args, info) {
        // Extracting environment function from provided info
        const fnsCtx = info?.fns || info?.ctx || {};

        // CHANGE: change const to let for mutability
        let { headingConfiguration, contentConfiguration, displayConfiguration } = args || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Provide default configurations
            headingConfiguration = headingConfiguration || {};
            contentConfiguration = contentConfiguration || {};
            displayConfiguration = displayConfiguration || {};
            
            // Add default values for inline editable fields
            headingConfiguration.title = headingConfiguration.title || 'Upcoming events';
            headingConfiguration.ctaText = headingConfiguration.ctaText || 'View all';
            headingConfiguration.ctaManualUrl = headingConfiguration.ctaManualUrl || 'https://events.stanford.edu';
            
            // Add default values for required fields
            contentConfiguration.eventsUrl = contentConfiguration.eventsUrl || 'https://events.stanford.edu/api/2/events?days=365&sponsored=true';
            displayConfiguration.numberOfEvents = displayConfiguration.numberOfEvents || 6;
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "headingTitle": { "field": "headingConfiguration.title" },
                "headingCtaText": { "field": "headingConfiguration.ctaText" }
            };
        }

        // Extract configuration data
        const { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow } = headingConfiguration || {};
        const { eventsUrl } = contentConfiguration || {};
        const { numberOfEvents } = displayConfiguration || {};

        // Environment validation (unchanged)
        // ... validation code ...

        // Field validation - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            // ... existing validation logic ...
        }

        // API data fetching with edit mode error handling
        const adapter = new cardDataAdapter();
        let data = [];
        const service = new eventCardService({ api: eventsUrl });
        adapter.setCardService(service);
        
        try {
            data = await adapter.getCards();
        } catch (er) {
            console.error('Error occurred in the Events section component: Failed to fetch event data. ', er);
            // NEW: In edit mode, provide mock data instead of returning error
            if (squizEdit) {
                data = [
                    {
                        title: 'Sample Event 1',
                        description: 'This is a sample event description.',
                        liveUrl: 'https://example.com',
                        imageUrl: 'https://picsum.photos/400/400',
                        imageAlt: 'Sample event image',
                        taxonomy: 'Events',
                        taxonomyUrl: 'https://example.com',
                        type: 'Event',
                        date: new Date().toISOString(),
                        endDate: new Date(Date.now() + 3600000).toISOString()
                    },
                    {
                        title: 'Sample Event 2',
                        description: 'This is another sample event description.',
                        liveUrl: 'https://example.com',
                        imageUrl: 'https://picsum.photos/400/400',
                        imageAlt: 'Another sample event image',
                        taxonomy: 'Events',
                        taxonomyUrl: 'https://example.com',
                        type: 'Event',
                        date: new Date().toISOString(),
                        endDate: new Date(Date.now() + 3600000).toISOString()
                    }
                ];
            } else {
                return `<!-- Error occurred in the Events section component: Failed to fetch event data. ${er.message} -->`;
            }
        }

        // Process heading data
        const headingData = await linkedHeadingService(fnsCtx, headingConfiguration);

        // Process card data
        let cardData = [];
        if (data !== null && data !== undefined) {
            cardData = data.map((card) => {
                card.isRealExternalLink = isRealExternalLink(card.liveUrl);
                card.eventStartEndDate = EventStartEndDate({start: card.date, end: card.endDate});
                card.uniqueID = uuid();
                card.imageAlt = card.videoUrl ? `Open video ${card.imageAlt} in a modal` : card.imageAlt;
                card.iconType = card.type?.toLowerCase();
                return card;
            }).slice(0, numberOfEvents);
        }

        // Data validation - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            // ... existing validation logic ...
        }

        // Prepare component data
        const componentData = {
            title: headingData.title,
            ctaText: headingData.ctaText,
            ctaLink: headingData.ctaLink,
            ctaNewWindow: headingData.ctaNewWindow,
            isAlwaysLight: false,
            width: "large",
            cardSize: "small",
            data: cardData,
        };

        // NEW: Early return pattern for edit mode
        if (squizEdit) {
            return processSquizEdit(eventSectionTemplate(componentData), squizEditTargets, args);
        }

        return eventSectionTemplate(componentData);
    }
};
```

### Template Structure (event-section.hbs)
```handlebars
<section data-component="events-section">
    <div class="{{containerClasses width=width}}">
        {{> linked-heading title=title isAlwaysLight=isAlwaysLight ctaLink=ctaLink ctaNewWindow=ctaNewWindow ctaText=ctaText}}
        {{#> horizontal-card-grid orientation="horizontal"}}
            {{#each data}} 
            <div class='su-relative su-grow'>
                {{> card-horizontal cardSize=../cardSize title=title description=description liveUrl=liveUrl imageUrl=imageUrl imageAlt=imageAlt taxonomy=taxonomy taxonomyUrl=taxonomyUrl type=type date=date endDate=endDate videoUrl=videoUrl uniqueID=uniqueID iconType=iconType}}
            </div>
            {{/each}}
        {{/ horizontal-card-grid}}
    </div>
</section>
```

### Key Features Demonstrated:
- **API-based component**: Fetches data from external events API
- **Error handling in edit mode**: Provides mock data when API fails in editor
- **Shared partial reuse**: Uses existing `linked-heading` partial with static `data-se` attributes
- **Configuration-based structure**: Handles nested configuration objects
- **Service integration**: Works with existing `eventCardService` and `linkedHeadingService`
- **Data processing**: Maintains existing card data transformation logic

**Generated `data-sq-field` attributes:**
- Section title: `data-sq-field="headingConfiguration.title"`
- CTA text: `data-sq-field="headingConfiguration.ctaText"`

This pattern is ideal for components that:
- Fetch data from external APIs
- Need graceful error handling in edit mode
- Use complex configuration structures
- Rely on shared services and utilities
- Display dynamic content that may not be available during editing

The mock data ensures editors always have content to work with, even when the external API is unavailable or returns errors.

## Configuration Examples
```

## Example 20: Featured-Content Component (API-Based with Conditional Targets)

This example demonstrates handling a component that fetches data from multiple APIs (Funnelback search or Matrix assets), with conditional inline editing targets based on component mode and comprehensive error handling:

### Updated main.js
```javascript
import featureContentTemplate from './featured-content.hbs';
import { cardDataAdapter, funnelbackCardService, linkedHeadingService, matrixCardService, uuid } from "../../global/js/utils";
import { Card, Modal, EmbedVideo } from "../../global/js/helpers";
import { processSquizEdit } from '../../global/js/utils/isEditor';

export default {
    async main(args, info) {
        // Extracting environment variables from provided info
        const { FB_JSON_URL, API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};
        const fnsCtx = info?.fns || info?.ctx || {};

        // CHANGE: change const to let for mutability
        let { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow } = args?.headingConfiguration || {};
        let { source, searchQuery, featuredDescription, cards } = args?.contentConfiguration || {};
        let { alignment, displayThumbnails, displayDescriptions } = args?.displayConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Provide default configurations
            title = title || 'Featured Content';
            ctaText = ctaText || 'View all';
            ctaUrl = ctaUrl || '';
            ctaManualUrl = ctaManualUrl || 'https://example.com';
            ctaNewWindow = ctaNewWindow !== undefined ? ctaNewWindow : false;
            
            // Provide default content configuration
            source = source || 'Search';
            searchQuery = searchQuery || '?collection=sug~sp-stanford-report-search&profile=stanford-report-push-search&log=false&query=!null&sort=date&meta_isTeaser_not=true';
            
            // Provide default display configuration
            alignment = alignment || 'left';
            displayThumbnails = displayThumbnails !== undefined ? displayThumbnails : true;
            displayDescriptions = displayDescriptions !== undefined ? displayDescriptions : true;
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "headingTitle": { "field": "headingConfiguration.title" },
                "headingCtaText": { "field": "headingConfiguration.ctaText" }
            };
            
            // Add featured description target if using Select mode
            if (source === 'Select') {
                featuredDescription = featuredDescription || 'This is a sample featured description that can be edited inline.';
                cards = cards && cards.length >= 3 ? cards : [
                    { cardAsset: 'matrix-asset://api-identifier/166535' },
                    { cardAsset: 'matrix-asset://api-identifier/162707' },
                    { cardAsset: 'matrix-asset://api-identifier/162759' }
                ];
                squizEditTargets["description"] = {
                    "field": "contentConfiguration.featuredDescription"
                };
            }
        }
        
        // Environment and field validation wrapped in !squizEdit checks
        if (!squizEdit) {
            // ... existing validation logic ...
        }

        // API data fetching with edit mode error handling
        const adapter = new cardDataAdapter();
        let data = null;

        if (source.toLowerCase() === "search") {
            const query = searchQuery;
            const service = new funnelbackCardService({ FB_JSON_URL, query });
            adapter.setCardService(service);
            
            try {
                data = await adapter.getCards();
            } catch (er) {
                console.error('Error occurred in the Feature content component: Failed to fetch search data. ', er);
                // NEW: In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    data = [
                        {
                            title: 'Sample Featured Article',
                            description: 'This is a sample featured article description that can be edited inline.',
                            liveUrl: 'https://example.com',
                            imageUrl: 'https://picsum.photos/600/400',
                            imageAlt: 'Sample featured image',
                            taxonomy: 'Research',
                            taxonomyUrl: 'https://example.com',
                            type: 'Article'
                        },
                        // ... additional mock cards
                    ];
                } else {
                    return `<!-- Error occurred in the Feature content component: Failed to fetch search data. ${er.message} -->`;
                }
            }
        } else {
            const service = new matrixCardService({ BASE_DOMAIN, API_IDENTIFIER });
            adapter.setCardService(service);
            
            try {
                data = await adapter.getCards(cards);
            } catch (er) {
                console.error('Error occurred in the Feature content component: Failed to fetch card data. ', er);
                // NEW: In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    data = [
                        {
                            title: 'Sample Featured Content',
                            description: 'This is a sample featured content description that can be edited inline.',
                            liveUrl: 'https://example.com',
                            imageUrl: 'https://picsum.photos/600/400',
                            imageAlt: 'Sample featured image',
                            taxonomy: 'Featured',
                            taxonomyUrl: 'https://example.com',
                            type: 'Article'
                        },
                        // ... additional mock cards
                    ];
                } else {
                    return `<!-- Error occurred in the Feature content component: Failed to fetch card data. ${er.message} -->`;
                }
            }
        }

        // Process heading and card data
        const headingData = await linkedHeadingService(fnsCtx, { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow });
        
        data.map((card) => {
            card.uniqueId = uuid();
            return card
        })

        const featuredCardData = data && data[0];
        if (featuredDescription && featuredDescription !== "") {
            featuredCardData.description = featuredDescription;
        }

        const cardData = data && [data[1], data[2]];
        
        // Data validation wrapped in !squizEdit check
        if (!squizEdit) {
            // ... existing validation logic ...
        }

        // Generate card components and prepare template data
        const cardsToRender = cardData.map((card, idx) => `
            ${idx === 0 ? `<div class="su-relative su-w-full">`: `<div class="su-relative su-w-full before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black before:su-h-px before:su-left-0 before:su-top-[-40px] md:before:su-top-[-36px] lg:before:su-top-[-38px]">`}
                {{Card({data: card, cardSize: "small", displayThumbnail: displayThumbnails, displayDescription: displayDescriptions, headingLvl: title ? 3 : 2, uniqueId: card.uniqueId })}
                </div>
            `).join('');

        const componentData = {
            alignment,
            headingTitle: headingData?.title,
            headingIsAlwaysLight: false,
            headingCtaLink: headingData?.ctaLink,
            headingCtaNewWindow: headingData?.ctaNewWindow,
            headingCtaText: headingData?.ctaText,
            featureCard: Card({ data: featuredCardData, cardSize:"featured", headingLvl: title ? 3 : 2, uniqueId: featuredCardData.uniqueId }),
            cards: cardsToRender,
            cardModal: cardModal.join(''),
            width: "large"
        };

        // NEW: Early return pattern for edit mode
        if (squizEdit) {
            return processSquizEdit(featureContentTemplate(componentData), squizEditTargets, args);
        }

        return featureContentTemplate(componentData);
    }
};
```

### Template Structure (featured-content.hbs)
```handlebars
<section data-component="featured-content">
    <div class="{{containerClasses width=width}}">
        {{> linked-heading title=headingTitle isAlwaysLight=headingIsAlwaysLight ctaLink=headingCtaLink ctaNewWindow=headingCtaNewWindow ctaText=headingCtaText }}
        <div class="su-w-full su-component-featured-grid">
            <div class="su-flex su-flex-wrap su-gap-[68px] md:su-gap-72 md:su-flex-nowrap lg:su-gap-[160px]">
                <div class="md:su-basis-[58.333%] lg:su-basis-[64.5%] su-grow {{cardsGrowClasses alignment}}">
                    {{{featureCard}}}
                </div>
                <div class="su-relative su-flex su-flex-wrap su-grow before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black su-gap-80 md:su-gap-72 lg:su-gap-[76px] before:md:su-w-px before:su-h-px before:md:su-h-full md:su-items-start md:su-content-start {{cardsAlignmentClasses alignment}}">
                    {{{cards}}}
                </div>
            </div>
        </div>
    </div>
    {{{cardModal}}}
</section>
```

### Key Features Demonstrated:
- **Multiple API sources**: Handles both Funnelback search and Matrix asset APIs
- **Conditional inline editing**: Featured description only available in Select mode
- **Shared partial integration**: Uses `linked-heading` partial with static `data-se` attributes
- **Card helper integration**: Uses existing Card helper with `data-se="description"` support
- **Comprehensive error handling**: Provides mock data when APIs fail in edit mode
- **Complex data processing**: Maintains existing card data transformation and modal generation
- **Mode-based configuration**: Different default values based on Search vs Select mode

**Generated `data-sq-field` attributes:**
- Section title: `data-sq-field="headingConfiguration.title"`
- CTA text: `data-sq-field="headingConfiguration.ctaText"`
- Featured description (Select mode only): `data-sq-field="contentConfiguration.featuredDescription"`

This pattern is ideal for components that:
- Fetch data from multiple external APIs
- Have conditional inline editing based on component configuration
- Use complex shared helpers and services
- Need graceful degradation when external services fail
- Display dynamic content with fallback mock data for editing

The conditional target configuration ensures that the featured description is only inline editable when the component is in Select mode, where users can actually override the description. In Search mode, the description comes from the API and cannot be overridden.

## Configuration Examples
```

## Example 21: Fullscreen-Image-Quote Component (Nested Object Fields)

This example demonstrates handling a component with both simple fields and multiple nested fields from a single object (ctaDetails):

### Updated main.js
```javascript
import { basicAssetUri, isRealExternalLink, uuid } from "../../global/js/utils";
import fullscreenImageQuoteTemplate from './fullscreen-image.hbs';
import { processSquizEdit } from '../../global/js/utils/isEditor';

export default {
    async main(args, info) {
        const fnsCtx = info?.fns || info?.ctx || {};

        // CHANGE: change const to let for mutability
        let { image, imageVPosition, mobileImage, quote, quoteVAlign, quoteHAlign, removeTopSpacing, ctaDetails } = args || {};
        let { ctaPreText, ctaText, ctaSubtext, externalUrl, internalUrl, isNewWindow } = ctaDetails || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Provide default values for inline editable fields
            quote = quote || '"This is a sample quote that can be edited inline."';
            
            // Ensure ctaDetails object exists
            ctaDetails = ctaDetails || {};
            ctaPreText = ctaPreText || 'Meet';
            ctaText = ctaText || 'Sample Person';
            ctaSubtext = ctaSubtext || "'21, international student";
            
            // Provide default values for other required fields
            image = image || 'matrix-asset://api-identifier/sample-image';
            imageVPosition = imageVPosition || 'center';
            quoteVAlign = quoteVAlign || 'center';
            quoteHAlign = quoteHAlign || 'left';
            removeTopSpacing = removeTopSpacing !== undefined ? removeTopSpacing : false;
            externalUrl = externalUrl || 'https://example.com';
            isNewWindow = isNewWindow !== undefined ? isNewWindow : false;
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "quote": { "field": "quote" },
                "ctaPreText": { "field": "ctaDetails.ctaPreText" },
                "ctaText": { "field": "ctaDetails.ctaText" },
                "ctaSubtext": { "field": "ctaDetails.ctaSubtext" }
            };
        }

        // Environment and field validation wrapped in !squizEdit checks
        if (!squizEdit) {
            // ... existing validation logic ...
        }

        // API calls with edit mode error handling
        let imageData = null;
        let mobileImageData = null;
        let linkUrl = null;
        
        if (image) {
            try {
                imageData = await basicAssetUri(fnsCtx, image);
            } catch (er) {
                console.error('Error occurred in the Fullscreen Image Quote component: Failed to fetch image data. ', er);
                // NEW: In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    imageData = {
                        url: 'https://picsum.photos/1200/800',
                        attributes: {
                            alt: 'Sample background image',
                            width: 1200,
                            height: 800
                        }
                    };
                } else {
                    return `<!-- Error occurred in the Fullscreen Image Quote component: Failed to fetch image data. ${er.message} -->`;
                }
            }
        }

        // Similar error handling for mobileImage and internalUrl...

        const componentData = {
            quote,
            quoteHAlign,
            quoteVAlign: convertedQuoteVAlign,
            imageVPosition,
            removeTopSpacing,
            ctaPreText,
            ctaText,
            ctaSubtext,
            link: externalUrl || linkUrl?.url,
            iconUniqueID: uuid(),
            isNewWindow,
            isRealExternal,
            imageData: imageData,
            mobileImageData: mobileImageData,
        };

        // NEW: Early return pattern for edit mode
        if (squizEdit) {
            return processSquizEdit(fullscreenImageQuoteTemplate(componentData), squizEditTargets, args);
        }

        return fullscreenImageQuoteTemplate(componentData);
    }
};
```

### Updated Template (fullscreen-image.hbs)
```handlebars
<section data-component="fullscreen-image-quote">
    <div class="su-aspect-w-1 su-aspect-h-2 sm:su-aspect-w-3 sm:su-aspect-h-4 lg:su-aspect-h-2 2xl:su-aspect-w-2 2xl:su-aspect-h-1 su-bg-black-true su-text-white {{#if removeTopSpacing}}su--mt-50 md:su--mt-56 2xl:su--mt-58{{/if}}">
        <div class="su-absolute su-z-20 su-h-full su-inset-0 su-flex su-items-end su-p-20 {{#if quoteVAlign}}lg:su-items-{{quoteVAlign}}{{/if}}">
            <blockquote class="su-py-17 sm:su-py-[6.8rem] xl:su-py-100 2xl:su-py-140 su-cc lg:su-max-w-[50%] {{getStringByCondition value=quoteHAlign expectedValue="right" trueResult="su-ml-0 su-mr-auto lg:su-mr-0 lg:su-ml-auto lg:su-pl-0" falseResult="su-ml-0 su-mr-auto lg:su-pr-0"}}">
                {{~#if quote~}}
                <p class="su-font-serif su-text-22 md:su-text-[3.3rem] lg:su-text-24 xl:su-text-[2.8rem] 2xl:su-text-[3.3rem] su-leading-display su-max-w-[55rem] xl:su-max-w-600 su-mb-0 su-whitespace-pre-line" data-se="quote">
                    {{quote}}
                </p>
                {{~/if~}}
                {{~#if ctaText~}}
                <div class="su-rs-mt-1 su-max-w-[55rem] xl:su-max-w-600">
                    <span class="su-inline su-text-22 md:su-text-[2.9rem] lg:su-text-24 2xl:su-text-[2.9rem] su-font-bold su-leading-display su-mr-02em" data-se="ctaPreText">
                        {{ctaPreText}}
                    </span>
                    <a href="{{link}}" 
                       {{#if isNewWindow}}target="_blank"{{/if}} 
                       {{#if isRealExternal}}rel="noopener nofollow"{{/if}}
                       class="su-group su-inline su-text-22 md:su-text-[2.9rem] lg:su-text-24 2xl:su-text-[2.9rem] su-font-bold su-leading-display su-text-white dark:su-text-white su-underline su-decoration-dark-mode-red su-underline-offset-4 su-decoration-[3px] hocus:su-decoration-white hocus:su-text-white dark:hocus:su-text-white su-transition-all">
                        <span data-se="ctaText">{{ctaText}}</span>
                        <!-- icons and other content -->
                    </a>
                    {{~#if ctaSubtext~}}
                    <div class="su-card-paragraph su-leading-display su-mt-9" data-se="ctaSubtext">
                        {{ctaSubtext}}
                    </div>
                    {{~/if~}}
                </div>
                {{~/if~}}
            </blockquote>
        </div>
        <!-- background images -->
    </div>
</section>
```

### Key Features Demonstrated:
- **Nested object fields**: Multiple fields from `ctaDetails` object mapped to individual inline editing targets
- **Mixed field types**: Simple string field (`quote`) and nested object fields (`ctaDetails.*`)
- **Asset URI handling**: Proper error handling for image and link assets with mock data fallbacks
- **Conditional rendering**: Proper handling of optional CTA elements
- **Complex layout**: Full-screen background image with overlay text and CTA elements

**Generated `data-sq-field` attributes:**
- Quote: `data-sq-field="quote"`
- CTA pre-text: `data-sq-field="ctaDetails.ctaPreText"`
- CTA text: `data-sq-field="ctaDetails.ctaText"`
- CTA subtext: `data-sq-field="ctaDetails.ctaSubtext"`

This pattern is ideal for components that:
- Have nested configuration objects with multiple inline editable fields
- Combine simple fields with complex nested structures
- Use background images and overlay content
- Need graceful error handling for asset loading
- Display rich text content with associated call-to-action elements

The nested field mapping allows editors to modify individual parts of the CTA section while keeping the overall structure intact.

## Configuration Examples
```

## Example 22: Interactive Photo Card Component

The `interactive-photo-card` component demonstrates inline editing for an interactive flip card with multiple field types including FormattedText content on the back side.

### Inline Editable Fields:
1. `title` - Card title (string)
2. `eyebrow` - Superheading above title (string, optional)
3. `content` - Rich text content on flip side (FormattedText)

### Template Changes (interactive-photo-card.hbs):
```handlebars
<section data-component="interactive-photo-card">
    <div class="su-cc">
        <article class="su-relative su-grid xl:su-grid-cols-2 su-gap-20 [perspective:100rem] su-transition-transform">
            <div class="su-flex su-relative [transform-style:preserve-3d] su-duration-1000 {{contentAlignmentClass}}" data-card-inner="true">
                <!-- Front side of card -->
                <div class="su-group/front su-relative su-bg-white su-backface-hidden su-rounded-[8px] su-shadow-lg su-min-w-full" aria-hidden="false" data-card-inner-content="true">
                    <div class="su-flex su-flex-col su-h-full su-rs-px-5 su-rs-pt-6 su-rs-pb-4">
                        {{#if eyebrow}}
                        <div class="su-type-1 su-text-black-60 su-font-semibold su-rs-mb-1" data-se="eyebrow">
                            {{eyebrow}}
                        </div>
                        {{/if}}
                        <h2 class="su-grow su-type-4 su-font-bold su-font-sans su-text-black dark:su-text-black su-rs-mb-0" data-se="title">
                            {{title}}
                        </h2>
                        <button type="button" tabIndex="" aria-label="See additional information" class="su-block su-ml-auto su-mr-0 su-bg-black su-text-white group-hover/front:su-bg-digital-red focus:su-bg-digital-red su-rounded-full su-p-10 su-stretched-link su-transition-all su-opacity-100 group-aria-hidden/front:su-opacity-0">
                            {{> svg-icons icon="plus" classes=iconPlusClasses}}
                        </button>
                    </div>
                </div>
                <!-- Back side of card -->
                <div class="su-group/back su-relative su-flex su-flex-col su-h-full su-min-w-full su-rounded-[8px] su-rs-px-5 su-rs-pt-6 su-rs-pb-4 su-bg-digital-red-dark su-text-white [transform:rotateY(180deg)_translate(100%,0)] su-backface-hidden su-transition-transform su-shadow-lg" aria-hidden="true" data-card-inner-content="true">
                    <div class="su-big-paragraph su-grow" data-se="content">
                        {{{content}}}
                        <button type="button" tabIndex="-1" aria-label="Dismiss content" class="su-block su-ml-auto su-mr-0 su-border-3 su-border-white su-rounded-full su-text-white focus:su-bg-black group-hover/back:su-bg-black su-p-7 lg:su-p-14 su-stretched-link su-transition-colors">
                            {{> svg-icons icon="arrows rotate" classes=iconArrowClasses}}
                        </button>
                    </div>
                </div>
            </div>
            <div class="su-rounded-[8px] su-overflow-hidden su-shadow-lg {{imageAlignmentClass}}">
                <img src={{imageUrl}} alt="" class="su-object-cover su-size-full" />
            </div>
        </article>
    </div>
</section>
```

### Main.js Implementation:
```javascript
import interactivePhotoCard from './interactive-photo-card.hbs';
import { basicAssetUri } from "../../global/js/utils";
import { processSquizEdit } from '../../global/js/utils/isEditor';

export default {
    async main( args, info ) {
        const fnsCtx = info?.fns || info?.ctx || {};

        // CHANGE: change const to let for mutability
        let { title, eyebrow, content, image, imageAlignment } = args || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Provide default values for inline editable fields
            title = title || 'Interactive Card Title';
            eyebrow = eyebrow || 'Sample Eyebrow';
            content = content || '<p>This is sample content that appears on the flip side of the interactive card. It demonstrates the inline editing functionality for FormattedText fields.</p>';
            
            // Provide default image for edit mode
            image = image || 'matrix-asset://api-identifier/sample-image';
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "title": { "field": "title" },
                "eyebrow": { "field": "eyebrow" },
                "content": { "field": "content" }
            };
        }

        // Validate required functions - CHANGE: wrap in !squizEdit check
        try {
            if (!squizEdit && (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined')) {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Interactive photo card component: ', er);
            return `<!-- Error occurred in the Interactive photo card component: ${er.message} -->`;
        }

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
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
        }

        // Getting image data with error handling
        let imageData = null;
        try {
            imageData = await basicAssetUri(info.fns, image);
        } catch (er) {
            console.error('Error occurred in the Interactive photo card component: Failed to fetch image data. ', er);
            // NEW: In edit mode, provide mock data instead of returning error
            if (squizEdit) {
                imageData = {
                    url: 'https://picsum.photos/600/400',
                    attributes: {
                        alt: 'Sample interactive card image',
                        width: 600,
                        height: 400
                    }
                };
            } else {
                return `<!-- Error occurred in the Interactive photo card component: Failed to fetch image data. ${er.message} -->`;
            }
        }

        // Prepare component data for template rendering
        const componentData = {
            title,
            eyebrow,
            content,
            imageUrl: imageData?.url,
            contentAlignmentClass: imageAlignment === 'left' ? 'xl:su-order-2' : '',
            imageAlignmentClass: imageAlignment === 'left' ? 'xl:su-order-first' : '',
            iconPlusClasses: "su-size-30 md:su-size-50 su-fill-none group-hover/front:su-scale-110 group-focus-within/front:su-scale-110 su-transition-transform",
            iconArrowClasses: "su-size-30 lg:su-size-36 su-fill-none group-hover/back:su-rotate-45 su-transition-transform"
        };

        // NEW: Early return pattern for edit mode
        if (squizEdit) {
            return processSquizEdit(interactivePhotoCard(componentData), squizEditTargets, args);
        }

        return interactivePhotoCard(componentData);
    },
};
```

### Key Features Demonstrated:
- **Mixed Field Types**: String fields (title, eyebrow) and FormattedText field (content)
- **Optional Fields**: Eyebrow field is optional and conditionally rendered
- **Interactive Elements**: Maintains flip card functionality with CSS transforms
- **Image Integration**: Handles image asset loading with error fallback
- **Layout Options**: Supports left/right image alignment via quick options
- **Accessibility**: ARIA labels and tab indexing maintained
- **Visual Effects**: Shadow, border radius, and color transitions intact

**Generated `data-sq-field` attributes:**
- Card title: `data-sq-field="title"`
- Card eyebrow: `data-sq-field="eyebrow"` (when present)
- Card content: `data-sq-field="content"` (FormattedText on flip side)

### Interactive Features Preserved:
- **Flip Animation**: CSS 3D transforms for card flipping remain functional
- **Button Interactions**: Plus and arrow buttons maintain hover/focus states
- **Responsive Layout**: Grid layout and responsive classes preserved
- **Accessibility**: ARIA labels and tab indexing maintained
- **Visual Effects**: Shadow, border radius, and color transitions intact

This pattern is ideal for components that:
- Combine simple text fields with rich FormattedText content
- Have complex interactive UI elements (animations, transforms)
- Include optional fields that may not always be present
- Need to maintain existing CSS animations and JavaScript functionality
- Handle image assets with error fallback scenarios

The implementation preserves all interactive functionality while enabling inline editing of the core content fields, making it easy for editors to update card content without disrupting the user experience.

## Configuration Examples
```

## Example 23: Media-Carousel Component (API-Based Array with Shared Partials)

The `media-carousel` component demonstrates inline editing for an array of media cards fetched from an external API, with proper error handling and shared partial updates.

### Inline Editable Fields:
1. `title` - Card title (string) - in cards array
2. `author` - Card author (string) - in cards array  
3. `teaserText` - Card description (string, multi-line) - in cards array

### Updated main.js
```javascript
import mediaCarouselTemplate from './media-carousel.hbs';
import {cardDataAdapter, matrixMediaCardService, isRealExternalLink, uuid } from "../../global/js/utils";
import { SidebarHeading } from "../../global/js/helpers";
import { processSquizEdit } from '../../global/js/utils/isEditor';

export default {
    async main(args, info) {
        // Extracting environment variables and functions from provided info
        const { API_IDENTIFIER } = info?.env || info?.set?.environment || {};
        const fnsCtx = info?.fns || info?.ctx || {};
        
        // CHANGE: change const to let for mutability
        let { cards } = args || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values if cards array is not provided or empty
            cards = cards && cards.length > 0 ? cards : [
                {
                    cardType: 'Book',
                    title: 'Sample Media Title 1',
                    author: 'Sample Author 1',
                    teaserText: 'This is sample teaser text for the first media card.',
                    image: 'matrix-asset://api-identifier/sample-image-1',
                    linkUrl: 'https://example.com'
                },
                {
                    cardType: 'Podcast',
                    title: 'Sample Media Title 2',
                    author: 'Sample Author 2',
                    teaserText: 'This is sample teaser text for the second media card.',
                    image: 'matrix-asset://api-identifier/sample-image-2',
                    linkUrl: 'https://example.com'
                }
            ];
            
            // Ensure each card has default values
            cards = cards.map(card => ({
                ...card,
                title: card.title || 'Sample Media Title',
                author: card.author || 'Sample Author',
                teaserText: card.teaserText || 'Sample teaser text for this media item.'
            }));
            
            // Configure edit targets for array - maps static data-se attributes to component fields
            squizEditTargets = {
                "title": {
                    "field": "cards",
                    "array": true,
                    "property": "title"
                },
                "author": {
                    "field": "cards",
                    "array": true,
                    "property": "author"
                },
                "teaserText": {
                    "field": "cards",
                    "array": true,
                    "property": "teaserText"
                }
            };
        }

        // Validate required environment variables - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            // ... existing validation logic ...
        }

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            // ... existing validation logic ...
        }

        const adapter = new cardDataAdapter();
        let data = null;

        // Compose and fetch the FB search results
        const service = new matrixMediaCardService({ ctx: fnsCtx, API_IDENTIFIER });
        adapter.setCardService(service);

        // Get the cards data with error handling
        try {
            data = await adapter.getCards(cards);
        } catch (er) {
            console.error('Error occurred in the Media carousel component: Failed to fetch card data. ', er);
            // NEW: In edit mode, provide mock data instead of returning error
            if (squizEdit) {
                data = cards.map((card, index) => ({
                    type: card.cardType || 'Book',
                    title: card.title,
                    author: card.author,
                    description: card.teaserText,
                    imageUrl: 'https://picsum.photos/400/600',
                    imageAlt: `Sample media image ${index + 1}`,
                    liveUrl: card.linkUrl || 'https://example.com',
                    taxonomy: card.cardType === 'Podcast' ? 'Featured audio' : 'Featured reading'
                }));
            } else {
                return `<!-- Error occurred in the Media carousel component: Failed to fetch card data. ${er.message} -->`;
            }
        }

        // ... rest of processing logic ...

        // Prepare component data for template rendering
        const componentData = {
            id: uuid(),
            slides: data,
            width: "large"
        };

        // NEW: Early return pattern for edit mode
        if (!squizEdit) return mediaCarouselTemplate(componentData);

        // NEW: Process for edit mode
        return processSquizEdit(mediaCarouselTemplate(componentData), squizEditTargets);
    }
};
```

### Updated card-media.hbs (Shared Partial)
```handlebars
<article aria-label="{{title}}" data-test="media-card" class="...">
    {{#if imageUrl}}
    <div class="...">
        <img class="..." src="{{imageUrl}}" alt="{{imageAlt}}" />
    </div>
    {{/if}}
    <div class="su-media-card-text ...">
        {{#if taxonomy}}
        <div class="...">
            {{{sidebarHeading}}}
        </div>
        {{/if}}
        {{#if title}}
        <h3 class="...">
            {{#if liveUrl}}
            <a href="{{liveUrl}}" class="...">
                <span data-se="title">{{title}}</span>
                {{#if isRealExternalLink}} 
                <!-- external link icon -->
                {{/if}}                  
            </a>
            {{else}}
            <span class="..." data-se="title">{{title}}</span>
            {{/if}}
        </h3>
        {{/if}}
        {{#if author}}
        <div data-test="mediacard-author" class="..." data-se="author">{{author}}</div>
        {{/if}}
        {{#if type}}
        <div class="...">
            <!-- type icon and text -->
        </div>
        {{/if}}
        {{#if description}} 
        <div data-test="mediacard-description" class="..." data-se="teaserText">
            {{description}}
        </div>
        {{/if}}
    </div>
</article>
```

### Key Features Demonstrated:
- **Array-based inline editing**: Multiple media cards with auto-indexing
- **Mixed API data sources**: Uses matrix-asset-uri for images and external APIs for card data
- **Shared partial updates**: Added static `data-se` attributes to reusable card-media partial
- **Comprehensive error handling**: Provides mock data when Matrix API fails in edit mode
- **Complex data transformation**: Maintains existing card processing and type icon logic
- **Carousel integration**: Works with existing Swiper.js carousel functionality

**Generated `data-sq-field` attributes:**
- Card titles: `data-sq-field="cards[0].title"`, `cards[1].title`, etc.
- Card authors: `data-sq-field="cards[0].author"`, `cards[1].author`, etc.
- Card descriptions: `data-sq-field="cards[0].teaserText"`, `cards[1].teaserText`, etc.

This pattern is ideal for components that:
- Display arrays of content cards from external APIs
- Use shared partials that need to work with multiple components
- Require robust error handling for API failures
- Include complex data processing and transformation
- Need to maintain existing carousel/slider functionality
- Handle both simple string fields and multi-line text content

The implementation preserves all carousel functionality while enabling inline editing of the core content fields, with graceful fallback to mock data when APIs are unavailable during editing.

## Configuration Examples
```

## Example 24: Media-Feature Component (Nested Object Fields with Media Content)

The `media-feature` component demonstrates inline editing for nested object fields in a media-focused component with proper validation and mock data for edit mode.

### Inline Editable Fields:
1. `title` - Media title (string) - in contentConfiguration object
2. `teaserText` - Media description (string, multi-line) - in contentConfiguration object

### Updated main.js
```javascript
import { basicAssetUri } from "../../global/js/utils";
import { SidebarHeading } from "../../global/js/helpers";
import mediaFeatureTemplate from './media-feature.hbs';
import { processSquizEdit } from '../../global/js/utils/isEditor';

export default {
    async main(args, info) {
        // Extracting functions from provided info
        const fnsCtx = info?.fns || info?.ctx || {};
                
        // CHANGE: change const to let for mutability
        let { backgroundImage, image, title, teaserText, mediaType, linkUrl } = args?.contentConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values for inline editable fields
            title = title || 'Featured Media Title';
            teaserText = teaserText || 'This is a sample description for the featured media content that can be edited inline.';
            
            // Set up inline editing targets for nested object fields
            squizEditTargets = {
                "title": {
                    "field": "contentConfiguration.title"
                },
                "teaserText": {
                    "field": "contentConfiguration.teaserText"
                }
            };
        }

        // Early return for edit mode with wrapped validation
        if (!squizEdit) {
            // Validate required functions
            try {
                if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                    throw new Error(
                        `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Media feature component: ', er);
                return `<!-- Error occurred in the Media feature component: ${er.message} -->`;
            }
            // Additional validation checks...
        }

        let bgImageData = null;
        let imageData = null;

        // Asset loading with simplified error handling for edit mode
        if (backgroundImage) {
            try {
                bgImageData = await basicAssetUri(fnsCtx, backgroundImage);
            } catch (er) {
                // In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    bgImageData = { url: 'https://via.placeholder.com/1200x600', attributes: { alt: 'Background image' } };
                }
            }
        }

        if (image) {
            try {
                imageData = await basicAssetUri(fnsCtx, image);
            } catch (er) {
                // In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    imageData = { url: 'https://via.placeholder.com/300x300', attributes: { alt: 'Featured media image' } };
                }
            }
        }

        // Process media type logic...
        let iconName, iconTestId, heading;
        
        if (mediaType === "Book") {
            iconName = "book-open-cover";
            iconTestId = "svg-book-open-cover";
        } else if (mediaType === "Podcast") {
            iconName = "microphone";
            iconTestId = "svg-microphone";
        } else if (mediaType === "Magazine") {
            iconName = "book-open";
            iconTestId = "svg-book-open";
        }

        switch (mediaType) {
            case "Podcast":
                heading = SidebarHeading({ icon: "Featured audio", title: "Featured audio" });
                break;
            case "Magazine":
                heading = SidebarHeading({ icon: "Featured reading", title: "Featured reading" });
                break;
            default:
                heading = SidebarHeading({ icon: "Featured reading", title: "Featured book" });
        }

        // Prepare component data for template rendering
        const componentData = {
            bgImageData,
            imageData,
            title,
            teaserText,
            mediaType,
            linkUrl,
            isPodcast: mediaType === "Podcast",
            heading,
            width: 'full',
            paddingX: false,
            iconName,
            iconTestId,
        };

        // NEW: Early return pattern for front-end
        if (!squizEdit) return mediaFeatureTemplate(componentData);

        // NEW: Process for edit mode
        return processSquizEdit(mediaFeatureTemplate(componentData), squizEditTargets);
    }
};
```

### Updated media-feature.hbs
The template requires wrapping the inline editable fields with `data-se` attributes using the nested object paths:

```handlebars
<h3 class="su-text-[35px] su-font-bold su-leading-tight su-mb-15 md:su-mb-19 md:su-text-[40px] lg:su-text-[43px]">
    <a href="{{linkUrl}}" class="su-media-feature-title-link su-stretched-link">
        <span data-se="title">{{title}}</span>
        <!-- External link icon -->
    </a>
</h3>

<p class="su-text-18 su-w-full su-m-0 su-leading-[125%] su-text-black su-font-normal md:su-text-19 lg:su-text-21" data-se="teaserText">
    {{teaserText}}
</p>
```

### Key Patterns:
1. **Nested Object Targeting**: Use dot notation for nested object fields (`contentConfiguration.title`)
2. **Graceful Asset Loading**: Try to load real images first, fallback to placeholders only on API failure in edit mode
3. **Simplified Error Handling**: Provide mock data when API calls fail in edit mode without console errors or error returns
4. **Proper Field Defaults**: Provide meaningful sample content for missing fields
5. **Validation Wrapping**: Skip validation entirely in edit mode for better performance

## Example 25: Multicolumn-Info-Section Component (Format 3: Custom Field Mapping)

This example demonstrates the new **Format 3: Array with Custom Field Mapping** for handling multiple elements with the same `data-se` attribute that need to map to completely different field paths.

### The Challenge
The multicolumn-info-section component uses the `link-button` partial in two different contexts:
1. **Column Two**: Direct usage for main content button
2. **Column Three**: Via `info-box` partial for callout button

Both buttons use the same `data-se="button"` attribute from the shared `link-button` partial, but need to map to different data fields.

### Updated main.js
```javascript
import { processSquizEdit } from '../../global/js/utils/isEditor';
import multicolumnInfoSectionTemplate from './multicolumn-info-section.hbs';

export default {
    async main(args, info) {
        // ... component setup ...

        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Format 3: Array with Custom Field Mapping
            squizEditTargets = {
                "title": {
                    "field": "colOne.title"
                },
                "infoText": {
                    "field": "colTwo.infoText"
                },
                // NEW: Format 3 - Multiple buttons with same data-se mapped to different fields
                "button": [
                    { "field": "colTwo.buttonConfiguration.buttonText" },
                    { "field": "colThree.buttonConfiguration.buttonText" }
                ],
                "infoBoxTitle": {
                    "field": "colThree.title"
                },
                "infoBoxContent": {
                    "field": "colThree.content"
                },
                "captionCredit": {
                    "field": "colThree.imageConfiguration.caption"
                }
            };
        }

        // ... component processing ...

        if (!squizEdit) return multicolumnInfoSectionTemplate(componentData);
        return processSquizEdit(multicolumnInfoSectionTemplate(componentData), squizEditTargets);
    }
};
```

### Template Structure
```handlebars
<div data-component="multicolumn-info-section">
    <h2 data-se="title">{{title}}</h2>
    <div data-se="infoText">{{{infoText}}}</div>
    
    <!-- First button context: Direct usage -->
    {{#if buttonData}}
        {{> link-button buttonText=buttonData.buttonText buttonUrl=buttonData.buttonUrl}}
    {{/if}}
    
    <!-- Second button context: Via info-box partial -->
    {{#if infoBoxData}}
        {{> info-box 
            title=infoBoxData.title 
            content=infoBoxData.content 
            buttonText=infoBoxData.buttonText 
            buttonUrl=infoBoxData.buttonUrl}}
    {{/if}}
</div>
```

### Shared Partials (Unchanged)
**link-button.hbs** (shared partial):
```handlebars
{{#if buttonUrl}}
<a href="{{buttonUrl}}" class="{{linkButtonClasses}}">
    <span data-se="button">{{buttonText}}</span>
</a>
{{/if}}
```

**info-box.hbs** (shared partial):
```handlebars
<div class="info-box">
    <h3 data-se="infoBoxTitle">{{title}}</h3>
    <div data-se="infoBoxContent">{{{content}}}</div>
    {{#if buttonText}}
        {{> link-button buttonText=buttonText buttonUrl=buttonUrl}}
    {{/if}}
</div>
```

### How Format 3 Works
1. **Document Order Processing**: `processSquizEdit` scans the HTML and finds both `data-se="button"` elements in document order
2. **Sequential Mapping**: 
   - **First button** (in column two) → `colTwo.buttonConfiguration.buttonText`
   - **Second button** (in info-box) → `colThree.buttonConfiguration.buttonText`
3. **Result**: Each button gets its own unique `data-sq-field` attribute

### Generated Output
```html
<div data-component="multicolumn-info-section">
    <h2 data-se="title" data-sq-field="colOne.title">Research</h2>
    <div data-se="infoText" data-sq-field="colTwo.infoText">Content here...</div>
    
    <!-- First button gets first mapping -->
    <a href="#" data-se="button" data-sq-field="colTwo.buttonConfiguration.buttonText">
        <span>Column Two Button</span>
    </a>
    
    <div class="info-box">
        <h3 data-se="infoBoxTitle" data-sq-field="colThree.title">Info Title</h3>
        <div data-se="infoBoxContent" data-sq-field="colThree.content">Info content...</div>
        
        <!-- Second button gets second mapping -->
        <a href="#" data-se="button" data-sq-field="colThree.buttonConfiguration.buttonText">
            <span>Info Box Button</span>
        </a>
    </div>
</div>
```

### Key Benefits of Format 3
- **No Template Changes**: Existing shared partials remain unchanged
- **Reusable Partials**: `link-button` partial keeps its generic `data-se="button"`
- **Flexible Mapping**: Same `data-se` attribute maps to completely different data structures
- **Document Order**: Predictable mapping based on HTML structure
- **Backward Compatible**: All existing implementations continue to work

### When to Use Format 3
- Multiple elements with the same `data-se` attribute in different contexts
- Shared partials used in multiple places with different data structures
- Need precise control over field mapping for each occurrence
- Elements represent different types of content (not homogeneous arrays)

This pattern is particularly useful for components that use shared partials (like buttons, cards, headings) in multiple contexts where each usage needs to map to different data fields.

## Example 26: Policy-Brief Component (Nested Object Fields - Simple Pattern)

The `policy-brief` component demonstrates inline editing for nested object fields in a straightforward content card component with proper validation wrapping and asset error handling.

### Inline Editable Fields:
1. `title` - Policy brief title (string) - in contentConfiguration object
2. `summary` - Policy brief summary (string, multi-line) - in contentConfiguration object  
3. `linkText` - Link text (string) - in contentConfiguration object

### Updated main.js
```javascript
import { basicAssetUri } from '../../global/js/utils';
import { processSquizEdit } from '../../global/js/utils/isEditor';
import policyBriefTemplate from './policy-brief.hbs';

export default {
    async main(args, info) {
        const fnsCtx = info?.fns || info?.ctx || {};

        // CHANGE: change const to let for mutability
        let { image, type, title, summary, linkUrl, linkText } = args?.contentConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values for inline editable fields
            title = title || 'Policy Brief Title';
            summary = summary || 'This is a sample summary for the policy brief that can be edited inline.';
            linkText = linkText || 'Read the full brief';
            
            // Provide default values for other required fields
            type = type || 'Policy Brief';
            image = image || 'matrix-asset://api-identifier/63353';
            linkUrl = linkUrl || 'https://example.com';
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "title": { "field": "contentConfiguration.title" },
                "summary": { "field": "contentConfiguration.summary" },
                "linkText": { "field": "contentConfiguration.linkText" }
            };
        }

        // Validate required functions - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                    throw new Error(
                        `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Policy brief component: ', er);
                return `<!-- Error occurred in the Policy brief component: ${er.message} -->`;
            }
        }

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            // ... existing validation logic wrapped in !squizEdit check ...
        }

        let assetData = null;

        // Getting image data with error handling
        if (image) {
            try {
                assetData = await basicAssetUri(fnsCtx, image);
            } catch (er) {
                console.error('Error occurred in the Policy brief component: Failed to fetch image data. ', er);
                // NEW: In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    assetData = {
                        url: 'https://picsum.photos/400/600',
                        attributes: {
                            alt: 'Sample policy brief image',
                            width: 400,
                            height: 600
                        }
                    };
                }
            }
        }

        // Prepare component data for template rendering
        const componentData = {
            imageUrl: assetData,
            type,
            title,
            summary,
            linkUrl,
            linkText,
            width: "wide",
            paddingX: false
        };

        // NEW: Early return pattern
        if (!squizEdit) return policyBriefTemplate(componentData);

        // NEW: Process for edit mode
        return processSquizEdit(policyBriefTemplate(componentData), squizEditTargets);
    }
};
```

### Updated Template (policy-brief.hbs)
```handlebars
<section data-component="policy-brief">
    <div class="{{containerClasses width=width paddingX=paddingX}}">
        <div class="su-relative su-flex su-flex-col su-gap-20 su-py-30 su-px-20 su-bg-fog-light md:su-mx-50 md:su-flex-row md:su-gap-18 lg:su-gap-48 md:su-p-36 lg:su-py-61 lg:su-px-65 dark:su-bg-transparent dark:before:su-bg-black dark:before:su-opacity-[0.5] dark:before:su-content-[''] dark:before:su-absolute dark:before:su-w-full dark:before:su-h-full dark:before:su-top-0 dark:before:su-left-0 dark:before:su-z-1">
            <div class="su-relative su-w-full su-h-[233px] md:su-h-auto md:su-min-w-[257px] lg:su-h-[378.331px] lg:su-flex-1 su-z-2">
                {{#if imageUrl.url}}
                <img src="{{imageUrl.url}}" class="su-absolute su-size-full su-object-cover" alt="" />
                {{/if}}
            </div>
            <div class="lg:su-flex-1 su-relative su-z-2">
                <div class="su-flex su-gap-6 su-items-center su-text-18 su-font-semibold su-pb-20 md:su-pb-27">
                    {{#if type}}
                    {{#ifEquals type "Policy Brief"}}
                        <span class="dark:su-hidden">{{> svg-icons icon="policy brief" theme="light"}}</span>
                        <span class="su-hidden dark:su-block">{{> svg-icons icon="policy brief" theme="dark"}}</span>
                    {{else}}
                        <span class="dark:su-hidden">{{> svg-icons icon="case study" theme="light"}}</span>
                        <span class="su-hidden dark:su-block">{{> svg-icons icon="case study" theme="dark"}}</span>
                    {{/ifEquals}}
                        <span>{{type}}</span>
                    {{/if}}
                </div>
                {{#if title}}
                    <h2 class="su-text-[33px] su-font-bold su-leading-[125%] su-font-serif su-pb-19 su-m-0" data-se="title">{{title}}</h2>
                {{/if}}
                {{#if summary}}
                    <p class="su-text-19 su-font-normal su-leading-[125%] su-pb-20 md:su-pb-27 su-m-0" data-se="summary">{{summary}}</p>
                {{/if}}
                {{#if linkUrl}}
                    <a href="{{linkUrl}}" class="su-flex su-gap-2 su-group su-text-19 su-font-semibold su-leading-[125%] su-text-digital-red su-no-underline dark:su-text-dark-mode-red hocus:su-underline">
                        <span data-se="linkText">{{linkText}}</span>
                        <span class="su-transition group-hocus:su--translate-y-01em group-hocus:su-translate-x-01em [&>svg]:su-translate-y-1">
                            {{> svg-icons icon="external arrow"}}
                        </span>
                    </a>
                {{/if}}
            </div>
        </div>
    </div>
</section>
```

### Key Features Demonstrated:
- **Nested Object Fields**: All inline editable fields are within `contentConfiguration` object
- **Mixed Field Types**: String fields (title, linkText) and multi-line string field (summary)
- **Asset Error Handling**: Graceful fallback to mock image data when asset loading fails in edit mode
- **Validation Wrapping**: All existing validation logic wrapped in `!squizEdit` checks
- **Link Text Wrapping**: Added `<span>` wrapper around link text to enable precise inline editing
- **Conditional Rendering**: Proper handling of optional fields with existing conditional logic

**Generated `data-sq-field` attributes:**
- Policy brief title: `data-sq-field="contentConfiguration.title"`
- Policy brief summary: `data-sq-field="contentConfiguration.summary"`
- Link text: `data-sq-field="contentConfiguration.linkText"`

### Key Patterns:
1. **Nested Object Targeting**: Use dot notation for nested object fields (`contentConfiguration.title`)
2. **Link Text Precision**: Wrap link text in `<span>` to avoid making icons and other elements editable
3. **Asset Error Handling**: Provide mock image data when asset loading fails in edit mode
4. **Validation Wrapping**: Skip all validation in edit mode for better performance
5. **Meaningful Defaults**: Provide sample content that makes sense for the component type

This pattern is ideal for components that:
- Have nested configuration objects with multiple inline editable fields
- Include asset loading that may fail during editing
- Need precise control over which parts of links are editable
- Have extensive validation that should be bypassed in edit mode
- Display content cards with title, description, and call-to-action elements

The implementation maintains all existing functionality while enabling inline editing of the core content fields, with graceful fallback behavior when external dependencies are unavailable.

## Example 27: Pull-Quote Component (Shared Partials with Nested Object Fields)

The `pull-quote` component demonstrates inline editing for nested object fields using shared partials, with proper validation wrapping and asset error handling.

### Inline Editable Fields:
1. `quote` - Pull quote text (string, multi-line) - in displayConfiguration object
2. `name` - Quotee name (string) - in displayConfiguration object  
3. `title` - Quotee title/role (string) - in displayConfiguration object

### Updated main.js
```javascript
import { basicAssetUri } from "../../global/js/utils";
import { processSquizEdit } from '../../global/js/utils/isEditor';
import pullQuote from './pull-quote.hbs';

export default {
    async main(args, info) {
        const { API_IDENTIFIER } = info?.env || info?.set?.environment || {};
        const fnsCtx = info?.fns || info?.ctx || {};
        
        // CHANGE: change const to let for mutability
        let { asset, quote, name, title, width } = (args && args.displayConfiguration) || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values for inline editable fields
            quote = quote || 'This is a sample pull quote that can be edited inline to highlight important content.';
            name = name || 'Sample Name';
            title = title || 'Sample Title';
            
            // Provide default values for other required fields
            width = width || 'Narrow';
            asset = asset || 'matrix-asset://api-identifier/164977';
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "featuredQuote": { "field": "displayConfiguration.quote" },
                "name": { "field": "displayConfiguration.name" },
                "title": { "field": "displayConfiguration.title" }
            };
        }

        // Validate required functions - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                    throw new Error(
                        `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                    );
                }
                if (typeof API_IDENTIFIER !== 'string' || API_IDENTIFIER === '') {
                    throw new Error(
                        `The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(API_IDENTIFIER)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Pull quote component: ', er);
                return `<!-- Error occurred in the Pull quote component: ${er.message} -->`;
            }
        }

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            // ... existing validation logic wrapped in !squizEdit check ...
        }

        // Process asset if provided with error handling
        let assetData = null;
        if (asset) {
            try {
                assetData = await basicAssetUri(fnsCtx, asset);
            } catch (er) {
                console.error('Error occurred in the Pull quote component: Failed to fetch asset data. ', er);
                // NEW: In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    assetData = {
                        url: 'https://picsum.photos/200/200',
                        attributes: {
                            alt: 'Sample avatar image',
                            width: 200,
                            height: 200
                        }
                    };
                }
            }
        }

        // Prepare template data
        const componentData = {
            avatarURL: assetData?.url ? assetData.url : "",
            quote,
            name,
            title,
            width: width.toLocaleLowerCase()
        };

        // NEW: Early return pattern
        if (!squizEdit) return pullQuote(componentData);

        // NEW: Process for edit mode
        return processSquizEdit(pullQuote(componentData), squizEditTargets);
    }
};
```

### Component Template (pull-quote.hbs)
```handlebars
<section data-component="pullquote">
    <div class="{{containerClasses width=width}}">
        {{> pull-quote avatarURL=avatarURL avatarAlt="" avatarSize="large" quote=quote name=name title=title}}
    </div>
</section>
```

### Updated Shared Partial (global/hbs/partials/pull-quote/pull-quote.hbs)
```handlebars
<div class="su-component-pullquote su-mx-auto su-relative su-mt-0 su-flex su-flex-wrap su-gap-27 su-justify-center su-pr-0 su-py-0">
    {{#if avatarURL}}{{> avatar avatarURL=avatarURL avatarAlt=avatarAlt size=avatarSize}}{{/if}}
    <blockquote class="su-w-full su-pl-39 dark:su-text-white dark:before:su-text-white su-font-serif su-text-black {{getStringByCondition value=avatarSize expectedValue="large" trueResult="lg:su-pl-[5.2rem]" falseResult="lg:su-pl-0"}}">
        <div class="su-font-semibold su-font-serif-0 su-text-[2.4rem] md:su-text-[3.6rem] su-leading md:su-leading-[130.245%] [&>*:last-child]:su-mb-0 [&>*:last-child]:after:su-content-['"'] su-relative before:su-text-[73px] before:su-leading-[109.5px] lg:before:su-leading-[139.5px] lg:before:su-text-[93px] before:su-font-semibold before:su--mt-25 lg:before:su--mt-38 before:su-content-['"'] before:su-text-serif before:su-text-black dark:su-text-white before:su-absolute before:su-right-full lg:before:su-right-full before:su-mr-6 lg:before:su-mr-13 dark:before:su-text-white su-leading-[33.6px] md:su-leading-[46.89px]" data-se="featuredQuote">
            {{quote}}"
        </div>
        {{#if name}}
            <cite class="su-mt-15 md:su-mt-26 lg:su-mt-29 su-font-sans su-text-21 su-leading-[25.2px] su-flex su-flex-col">
                <span class="su-font-bold su-block su-leading-[25.2px]" data-se="name">
                {{name}}
                </span>
                {{#if title}}
                <span class="su-block su-leading-[25.2px]" data-se="title">{{title}}</span>
                {{/if}}
            </cite>
        {{/if}}
    </blockquote>
</div>
```

### Key Features Demonstrated:
- **Shared Partial Updates**: Modified global shared partial to add static `data-se` attributes
- **Existing Attribute Reuse**: Leveraged existing `data-se="featuredQuote"` attribute for quote field
- **Nested Object Fields**: All inline editable fields are within `displayConfiguration` object
- **Mixed Field Types**: Multi-line string field (quote) and regular string fields (name, title)
- **Asset Error Handling**: Graceful fallback to mock avatar image when asset loading fails in edit mode
- **Environment Variable Validation**: Proper handling of required API_IDENTIFIER environment variable
- **Conditional Rendering**: Proper handling of optional fields (name, title) with existing conditional logic

**Generated `data-sq-field` attributes:**
- Pull quote text: `data-sq-field="displayConfiguration.quote"`
- Quotee name: `data-sq-field="displayConfiguration.name"`
- Quotee title: `data-sq-field="displayConfiguration.title"`

### Key Patterns:
1. **Shared Partial Modification**: Updated global partial to add static `data-se` attributes for reusability
2. **Existing Attribute Leverage**: Used existing `data-se="featuredQuote"` without changes
3. **Nested Object Targeting**: Use dot notation for nested object fields (`displayConfiguration.*`)
4. **Environment Variable Handling**: Proper validation of required environment variables in edit mode
5. **Avatar Asset Handling**: Provide mock avatar image when asset loading fails in edit mode

This pattern is ideal for components that:
- Use shared partials that need to work across multiple components
- Have nested configuration objects with multiple inline editable fields
- Include optional avatar/image assets that may fail to load during editing
- Require environment variables for proper operation
- Display quoted content with attribution (name and title)

The implementation maintains all existing functionality while enabling inline editing of the core content fields. The shared partial updates ensure that any other components using the same partial will also benefit from the inline editing capabilities.

## Example 28: Related-Story Component (API-Based with Description Override)

The `related-story` component demonstrates inline editing for API-based components with description override functionality, featuring comprehensive error handling and mock data fallbacks.

### Inline Editable Fields:
1. `descriptionOverride` - Description override text (string, multi-line) - in contentConfiguration object

### Updated main.js
```javascript
import relatedStory from './related-story.hbs';
import { cardDataAdapter, matrixCardService } from '../../global/js/utils';
import { processSquizEdit } from '../../global/js/utils/isEditor';

export default {
    async main(args, info) {
        const fnsCtx = info?.fns || info?.ctx || {};
        const { API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};

        // CHANGE: change const to let for mutability
        let { story, descriptionOverride } = args && args?.contentConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values for inline editable fields
            descriptionOverride = descriptionOverride || 'This is a sample description override that can be edited inline to customize the related story description.';
            
            // Provide default values for other required fields
            story = story || 'matrix-asset://api-identifier/163459';
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "description": { "field": "contentConfiguration.descriptionOverride" }
            };
        }

        // Validate required functions and environment - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                    throw new Error(
                        `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                    );
                }
                if (typeof API_IDENTIFIER !== 'string' || API_IDENTIFIER === '') {
                    throw new Error(
                        `The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(API_IDENTIFIER)} was received.`
                    );
                }
                if (typeof BASE_DOMAIN !== 'string' || BASE_DOMAIN === '') {
                    throw new Error(
                        `The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(BASE_DOMAIN)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Related story component: ', er);
                return `<!-- Error occurred in the Related story component: ${er.message} -->`;
            }
        }

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            // ... existing validation logic wrapped in !squizEdit check ...
        }

        // Initialize card adapter and service
        const adapter = new cardDataAdapter();
        let data = null;

        const service = new matrixCardService({ BASE_DOMAIN, API_IDENTIFIER });
        adapter.setCardService(service);

        // Fetch story data with error handling
        try {
            data = await adapter.getCards([{ cardAsset: story }]);
        } catch (er) {
            console.error('Error occurred in the Related story component: Failed to fetch story data. ', er);
            // NEW: In edit mode, provide mock data instead of returning error
            if (squizEdit) {
                data = [{
                    title: 'Sample Related Story Title',
                    description: 'This is a sample description from the API that would normally be fetched.',
                    liveUrl: 'https://example.com',
                    imageUrl: 'https://picsum.photos/200/200',
                    imageAlt: 'Sample related story image'
                }];
            } else {
                return `<!-- Error occurred in the Related story component: Failed to fetch story data. ${er.message} -->`;
            }
        }

        // Validate fetched data - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            // ... existing validation logic wrapped in !squizEdit check ...
        }
        
        let { title, description, liveUrl, imageUrl, imageAlt } = data[0]

        // Prepare template data
        const componentData = {
            width: "narrow",
            liveUrl,
            imageUrl,
            imageAlt,
            title,
            description: descriptionOverride ? descriptionOverride : description || "",
        };

        // NEW: Early return pattern
        if (!squizEdit) return relatedStory(componentData);

        // NEW: Process for edit mode
        return processSquizEdit(relatedStory(componentData), squizEditTargets);
    }
};
```

### Updated Template (related-story.hbs)
```handlebars
<section data-component="related-story">
    <div class="{{containerClasses width=width}}">
        <section class="story__related-story su-col-span-full sm:su-col-span-10 sm:su-col-start-2 lg:su-col-span-6 lg:su-col-start-4 su-mx-auto">
            {{> sidebar-heading title="Related story" icon="bullseye pointer" headingSize="h3" color="black" }}
            <a class="su-text-black hocus:su-text-black su-no-underline su-group" href={{liveUrl}}>
                <div class="su-flex su-gap-20 sm:su-gap-40 su-mt-30 lg:su-mt-36 lg:su-mt-38">
                    <img class="su-object-cover su-h-auto su-max-h-[103px] su-max-w-[103px] md:su-max-h-[168px] md:su-max-w-[168px] lg:su-max-h-[185px] lg:su-max-w-[185px] su-object-center" src="{{imageUrl}}" alt="{{imageAlt}}"/>
                    <div>
                        <h4 class="su-transition group-hocus:su-underline group-hocus:su-text-digital-red dark:group-hocus:su-text-dark-mode-red su-text-20 dark:su-text-white sm:su-text-24 su-font-serif !su-font-bold su-leading-display su-mb-9">
                            {{title}}
                        </h4>
                        <div class="su-wysiwyg-content su-text-16 sm:su-text-18 su-leading-[125%] !su-m-0 su-font-normal dark:su-text-white" data-se="description">
                            {{{description}}}
                        </div>
                    </div>
                </div>
            </a>
        </section>
    </div>
</section>
```

### Key Features Demonstrated:
- **API-Based Component**: Fetches story data from Matrix API using cardDataAdapter and matrixCardService
- **Description Override Logic**: Uses `descriptionOverride` if provided, otherwise falls back to API description
- **Comprehensive Error Handling**: Provides mock data when API calls fail in edit mode
- **Multiple Environment Variables**: Requires both API_IDENTIFIER and BASE_DOMAIN environment variables
- **Nested Object Fields**: Inline editable field is within `contentConfiguration` object
- **Rich Content Support**: Description field supports multi-line text with WYSIWYG content

**Generated `data-sq-field` attributes:**
- Description override: `data-sq-field="contentConfiguration.descriptionOverride"`

### Key Patterns:
1. **API Error Handling**: Comprehensive try-catch around API calls with mock data fallback in edit mode
2. **Description Override Logic**: Conditional logic to use override or API description maintained in edit mode
3. **Multiple Environment Variables**: Proper validation of required API_IDENTIFIER and BASE_DOMAIN
4. **Card Service Integration**: Uses existing cardDataAdapter and matrixCardService utilities
5. **Rich Content Field**: Description field supports HTML content with WYSIWYG styling

This pattern is ideal for components that:
- Fetch content from external APIs (Matrix, Funnelback, etc.)
- Allow content overrides for specific fields
- Require multiple environment variables for API access
- Display rich content that may include HTML formatting
- Need graceful degradation when external services are unavailable
- Use existing card service utilities for data fetching

The implementation maintains all existing API integration while enabling inline editing of the description override field. The mock data ensures editors always have content to work with, even when the Matrix API is unavailable during editing.

### Special Considerations:
- **Override Logic**: The component logic for choosing between `descriptionOverride` and API `description` is preserved
- **API Dependencies**: Component requires both API_IDENTIFIER and BASE_DOMAIN environment variables
- **Rich Content**: Description field supports HTML content, making it suitable for formatted text
- **Card Service Pattern**: Demonstrates the standard pattern for using cardDataAdapter with matrixCardService

// ... existing code ...

## Example 18: Single-Featured-Content Component (Shared Partials with API Content Override)

The `single-featured-content` component demonstrates inline editing for a component that uses shared partials with existing `data-se` attributes and fetches API-based content with description override functionality.

### Inline Editable Fields:
1. `headingConfiguration.title` - Section heading (string)
2. `headingConfiguration.ctaText` - CTA link text (string)
3. `contentConfiguration.description` - Description override (FormattedText)

### Key Features:
- Uses `linked-heading` partial (already has `data-se="headingTitle"` and `data-se="headingCtaText"`)
- Uses `Card` helper with card partials (already has `data-se="description"`)
- API-based content fetching with description override logic
- Complex validation for environment variables and field types

### Updated main.js
```javascript
import { cardDataAdapter, matrixCardService, linkedHeadingService } from "../../global/js/utils";
import { processSquizEdit } from '../../global/js/utils/isEditor';
import { Card } from "../../global/js/helpers";
import singleFeaturedTemplate from "./single-featured-content.hbs";

export default {
    async main(args, info) {
        const fnsCtx = info?.fns || info?.ctx || {};
        const { API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};

        // CHANGE: change const to let for mutability
        let { title, ctaText, ctaUrl, ctaManualUrl, ctaNewWindow } = args?.headingConfiguration || {};
        let { source, description } = args?.contentConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values for inline editable fields
            title = title || 'Featured Content';
            ctaText = ctaText || 'View all';
            description = description || '<p>This is a sample description override that can be edited inline to customize the featured content description.</p>';
            
            // Provide default values for other required fields
            source = source || 'matrix-asset://api-identifier/162618';
            ctaUrl = ctaUrl || '';
            ctaManualUrl = ctaManualUrl || 'https://example.com';
            ctaNewWindow = ctaNewWindow !== undefined ? ctaNewWindow : false;
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "headingTitle": { "field": "headingConfiguration.title" },
                "headingCtaText": { "field": "headingConfiguration.ctaText" },
                "description": { "field": "contentConfiguration.description" }
            };
        }

        // NEW: Wrap validation in !squizEdit check
        if (!squizEdit) {
            // Validate required environment variables
            try {
                if (typeof API_IDENTIFIER !== 'string' || API_IDENTIFIER === '') {
                    throw new Error(
                        `The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(API_IDENTIFIER)} was received.`
                    );
                }
                if (typeof BASE_DOMAIN !== 'string' || BASE_DOMAIN === '') {
                    throw new Error(
                        `The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(BASE_DOMAIN)} was received.`
                    );
                }
                if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                    throw new Error(
                        `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Single featured content component: ', er);
                return `<!-- Error occurred in the Single featured content component: ${er.message} -->`;
            }

            // Validate required fields and ensure correct data types
            try {
                if (typeof source !== 'string' || source.trim() === '') {
                    throw new Error(
                        `The "source" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(source)} was received.`
                    );
                }
                // Additional validation for other fields...
            } catch (er) {
                console.error('Error occurred in the Single featured content component: ', er);
                return `<!-- Error occurred in the Single featured content component: ${er.message} -->`;
            }
        }

        const adapter = new cardDataAdapter();
        let data = null;
        const service = new matrixCardService({ BASE_DOMAIN, API_IDENTIFIER });
        adapter.setCardService(service);

        // Get the cards data with error handling
        try {
            data = await adapter.getCards([{ cardAsset: source }]);
        } catch (er) {
            console.error('Error occurred in the Single featured content: Failed to fetch feature data. ', er);
            // NEW: In edit mode, provide mock data instead of returning error
            if (squizEdit) {
                data = [{
                    title: 'Sample Featured Content Title',
                    description: 'This is a sample description from the API that would normally be fetched.',
                    liveUrl: 'https://example.com',
                    imageUrl: 'https://picsum.photos/600/400',
                    imageAlt: 'Sample featured content image',
                    taxonomy: 'Featured',
                    taxonomyUrl: 'https://example.com',
                    type: 'Article'
                }];
            } else {
                return `<!-- Error occurred in the Single featured content: Failed to fetch feature data. ${er.message} -->`;
            }
        }

        const cardData = data && data.map((item) => {
            const itemData = {...item} 
            
            // Preserve existing description override logic
            if(description && description !== "" && description.replace(/<[^>]+>/g, "").trim().length > 0) {
                itemData.description = description;
            }

            return itemData;
        })[0]

        // Resolve the URI for the section heading link
        const headingData = await linkedHeadingService(
            fnsCtx,
            { title, ctaText, ctaUrl, ctaManualUrl, ctaNewWindow }
        );

        // NEW: Wrap validation in !squizEdit check
        if (!squizEdit) {
            // Validate fetched card data
            try {
                if (typeof data !== 'object' || data.length < 1) {
                    throw new Error(
                        `The "data" cannot be undefined or null. The ${JSON.stringify(data)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Single featured content component: ', er);
                return `<!-- Error occurred in the Single featured content component: ${er.message} -->`;
            }
        }

        // Prepare component data for template rendering
        const componentData = {
            title: headingData.title,
            ctaText: headingData.ctaText,
            ctaLink: headingData.ctaLink,
            ctaNewWindow: headingData.ctaNewWindow,
            isAlwaysLight: false,
            width: "large",
            card: Card({ data: cardData, cardSize: "featured" }),
            data: JSON.stringify(cardData)
        };

        // NEW: Early return pattern
        if (!squizEdit) return singleFeaturedTemplate(componentData);

        // NEW: Process for edit mode
        return processSquizEdit(singleFeaturedTemplate(componentData), squizEditTargets);
    }
};
```

### Template (No Changes Required)
The template uses shared partials that already have the necessary `data-se` attributes:
- `linked-heading` partial: `data-se="headingTitle"` and `data-se="headingCtaText"`
- Card partials (via Card helper): `data-se="description"`

```handlebars
<section data-component='single-featured-content'>
    <div class="{{containerClasses width=width}}">
        {{> linked-heading title=title isAlwaysLight=isAlwaysLight ctaLink=ctaLink ctaNewWindow=ctaNewWindow ctaText=ctaText}}
        <div class='su-single-featured-content md:su-px-[6.4rem] lg:su-px-[122.5px]'>
            {{{card}}}
        </div>
    </div>
</section>
```

### Key Implementation Notes:
1. **Shared Partials**: No template changes needed - existing `data-se` attributes in shared partials work automatically
2. **Description Override Logic**: Preserved existing logic that checks if description override exists and replaces API description
3. **Complex Validation**: Wrapped extensive environment variable and field validation in `!squizEdit` checks
4. **API Error Handling**: Provides comprehensive mock data when API calls fail in edit mode
5. **Nested Object Fields**: Uses dot notation for `headingConfiguration.title`, `headingConfiguration.ctaText`, and `contentConfiguration.description`

### squizEditTargets Configuration:
```javascript
squizEditTargets = {
    "headingTitle": { "field": "headingConfiguration.title" },
    "headingCtaText": { "field": "headingConfiguration.ctaText" },
    "description": { "field": "contentConfiguration.description" }
};
```

This example demonstrates how components that rely heavily on shared partials can be converted with minimal changes, leveraging existing `data-se` attributes while maintaining complex business logic like description overrides and API error handling.

---