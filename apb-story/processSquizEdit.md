# Squiz Editor Integration Guide

## Overview
This guide shows how to modify components to support inline editing in Squiz Editor using the `processSquizEdit` utility function.

**Why This Method?** This approach is necessary because of shared global utilities that render reusable content (like cards, buttons, or other common elements). These utilities need different `data-sq-field` values depending on which component is using them, but they share the same template structure. The `processSquizEdit` method allows us to map generic `data-se` attributes in templates to specific `data-sq-field` values for each component's data structure.

For example, a shared card utility might use `data-se="description"` in its template, but Component A needs `data-sq-field="heroCards[0].description"` while Component B needs `data-sq-field="contentConfiguration.featuredDescription"`. This mapping system solves that challenge elegantly.

## Core Principles

### 1. Minimal Changes - Preserve Front-End Behavior
**CRITICAL:** Keep changes as minimal as possible and **never modify front-end output variables or values**. The goal is to enable inline editing without affecting existing front-end functionality.

**✅ DO:**
- Only add edit mode detection and early return logic
- Provide mock data in edit mode when APIs fail
- Use existing `data-se` attributes from shared partials
- Wrap API calls in try-catch blocks for graceful fallbacks

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

### 2. Static `data-se` Attributes in Templates
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

### 3. Mapping in Component's main.js
The component's `main.js` file maps static `data-se` attributes to actual data fields:

```javascript
squizEditTargets = {
    "title": { "field": "headingConfiguration.title" },
    "description": { "field": "contentConfiguration.featuredDescription" }
};
```

### 4. Generic Names in Shared Partials
Shared partials should use generic, reusable `data-se` attribute names:

```handlebars
<!-- shared partial: card-vertical.hbs -->
<h3 data-se="title">{{title}}</h3>
<div data-se="description">{{{description}}}</div>
```

Different components can map these generic names to their specific data structures.

## Fallback Values and Standards

When implementing edit mode fallbacks, it's crucial to provide sensible defaults for all variables that could cause rendering failures. Here are the standardized fallback values to use:

### Matrix Asset URLs
For any matrix-asset URLs, use these standardized fallback IDs:

```javascript
// Links
linkUrl = linkUrl || "matrix-asset://StanfordNews/29389";  // Standard fallback for links

// Images
image = image || "matrix-asset://StanfordNews/130444";     // Standard fallback for images
```

### Content Fallbacks
For text-based content, use these standardized fallbacks:

```javascript
// Titles and Headings
title = title || 'Add your title';
heading = heading || 'Section Heading';

// Descriptions and Content
description = description || 'Add your description here';
content = content || '<p>Add your content here</p>';

// Button and Link Text
buttonText = buttonText || 'Learn more';
linkText = linkText || 'Read more';
ctaText = ctaText || 'View all';
```

### Array Fallbacks
For array-based content, provide at least one default item:

```javascript
// Cards or List Items
items = items?.length ? items : [
    {
        title: 'Default Item Title',
        description: 'Default item description',
        image: 'matrix-asset://StanfordNews/130444',
        linkUrl: 'matrix-asset://StanfordNews/29389'
    }
];

// Buttons
buttons = buttons?.length ? buttons : [
    {
        buttonText: 'Default Button',
        linkUrl: 'matrix-asset://StanfordNews/29389'
    }
];
```

### Best Practices for Fallbacks

1. **Always Check for Matrix Assets**: Any variable that expects a matrix-asset URL must have a fallback using the standard IDs.

2. **Content Length**: Fallback text should be long enough to demonstrate the space but short enough to be manageable:
   - Titles: 2-5 words
   - Descriptions: 1-2 sentences
   - Button text: 1-3 words

3. **HTML Content**: When providing fallback HTML content:
   - Use semantic HTML tags
   - Include basic formatting
   - Keep it simple and clean

4. **Array Content**: When providing fallback arrays:
   - Include at least one item
   - Ensure all required properties are present
   - Use standard fallback values for nested properties

5. **Validation**: Always validate the presence of required fields before providing fallbacks:
   ```javascript
   if (squizEdit) {
       // Check for required fields
       if (!title || !description) {
           title = title || 'Default Title';
           description = description || 'Default description';
       }
   }
   ```

### Example Implementation

```javascript
if (squizEdit) {
    // Matrix asset fallbacks
    image = image || 'matrix-asset://StanfordNews/130444';
    linkUrl = linkUrl || 'matrix-asset://StanfordNews/29389';
    
    // Content fallbacks
    title = title || 'Campaign Title';
    description = description || 'Campaign description text goes here.';
    linkText = linkText || 'Learn more';
    
    // Array fallbacks
    cards = cards?.length ? cards : [
        {
            title: 'Featured Card',
            description: 'Card description text',
            image: 'matrix-asset://StanfordNews/130444',
            linkUrl: 'matrix-asset://StanfordNews/29389'
        }
    ];
}
```

## Implementation Steps

### 1. Import the Utility Function
```javascript
import { processSquizEdit } from '../../global/js/utils/isEditor';
```
**Note:** Only import `processSquizEdit` - `isEditor` is no longer needed.

### 2. Detect Edit Mode
```javascript
const squizEdit = info?.ctx?.editor || false;
```

### 3. Make Variables Mutable
```javascript
// CHANGE: change const to let for mutability
let { title, content } = args || {};
```

### 4. Configure Edit Targets (Edit Mode Only)
```javascript
let squizEditTargets = null;
if (squizEdit) {
    // Add default values for empty fields
    content = content || '<p>Add content</p>';
    
    // Map template data-se attributes to component fields
    squizEditTargets = {
        "title": { "field": "title" },
        "content": { "field": "content" }
    };
}
```

### 5. Early Return Pattern
```javascript
// Prepare component data
const componentData = { title, content, width: "narrow" };

// Return original front-end code when not in edit mode
if (!squizEdit) return template(componentData);

// Process for edit mode
return processSquizEdit(template(componentData), squizEditTargets);
```

## Configuration Formats

The `processSquizEdit` function supports three mapping formats:

### Format 1: Simple Field Mapping
Maps a single `data-se` attribute to a single component field.

```javascript
"title": {
    "field": "headingConfiguration.title"
}
```

**Template:** `<h2 data-se="title">{{title}}</h2>`  
**Result:** `data-sq-field="headingConfiguration.title"`

### Format 2: Array with Auto-Indexing
Maps multiple elements with the same `data-se` attribute to an array with automatic indexing.

```javascript
"button": {
    "field": "buttons",
    "array": true,
    "property": "buttonText"
}
```

**Template:** `<span data-se="button">{{buttonText}}</span>` (repeated in loop)  
**Result:** `buttons[0].buttonText`, `buttons[1].buttonText`, etc.

### Format 3: Custom Field Mapping
Maps multiple elements with the same `data-se` attribute to different field paths.

```javascript
"button": [
    { "field": "colTwo.buttonConfiguration.buttonText" },
    { "field": "colThree.buttonConfiguration.buttonText" }
]
```

**Result:** First button → `colTwo.buttonConfiguration.buttonText`, Second button → `colThree.buttonConfiguration.buttonText`

## Practical Examples

### Basic Component
```javascript
import { processSquizEdit } from '../../global/js/utils/isEditor';
import template from './component.hbs';

export default {
    async main(args, info) {
        let { title, description } = args || {};
        
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            title = title || 'Add your title';
            description = description || 'Add description';
            
            squizEditTargets = {
                "title": { "field": "title" },
                "description": { "field": "description" }
            };
        }
        
        const componentData = { title, description };
        
        if (!squizEdit) return template(componentData);
        
        return processSquizEdit(template(componentData), squizEditTargets);
    }
};
```

### Array Handling
```javascript
if (squizEdit) {
    // Provide default array if empty
    buttons = buttons && buttons.length > 0 ? buttons : [
        { buttonText: 'Button 1', externalUrl: '#' },
        { buttonText: 'Button 2', externalUrl: '#' }
    ];
    
    // Ensure each button has default text
    buttons = buttons.map(button => ({
        ...button,
        buttonText: button.buttonText || 'Click here'
    }));
    
    // Configure array mapping
    squizEditTargets = {
        "button": {
            "field": "buttons",
            "array": true,
            "property": "buttonText"
        }
    };
}
```

### Complex Component with Multiple Partials
```javascript
if (squizEdit) {
    // Set defaults for different sections
    headingConfiguration.title = headingConfiguration.title || 'Featured Content';
    headingConfiguration.ctaText = headingConfiguration.ctaText || 'View all';
    eventsConfiguration.heading = eventsConfiguration.heading || 'Upcoming events';
    
    // Map different data-se attributes to their respective fields
    squizEditTargets = {
        "headingTitle": { "field": "headingConfiguration.title" },
        "headingCtaText": { "field": "headingConfiguration.ctaText" },
        "eventsHeading": { "field": "eventsConfiguration.heading" },
        "description": { "field": "contentConfiguration.featuredDescription" }
    };
}
```

## When to Use Each Format

**Format 1 (Simple):** Single element with unique `data-se` attribute  
**Format 2 (Array Auto-Index):** Multiple similar elements in homogeneous collections  
**Format 3 (Custom Mapping):** Multiple elements with same `data-se` but different field paths

## Best Practices

### Template Requirements
- Use static `data-se` attributes in templates
- Never pass dynamic `data-se` values through partials
- Keep shared partials generic with reusable attribute names

### Component Implementation
- Use early return pattern for performance
- Always provide defaults for empty fields in edit mode
- Wrap validation in `!squizEdit` checks when necessary
- Test both edit and front-end modes

### Error Handling
```javascript
// Minimal API error handling for edit mode
try {
    data = await adapter.getCards();
} catch (er) {
    if (squizEdit) {
        data = [/* minimal mock data */];
    }
    // Let natural error handling occur in front-end mode
}
```

## Implementation Checklist

- [ ] Import `processSquizEdit` utility
- [ ] Change destructured variables from `const` to `let`
- [ ] Detect edit mode using `info?.ctx?.editor`
- [ ] Configure `squizEditTargets` inside edit mode check
- [ ] Add default values for empty fields
- [ ] Use early return for front-end mode
- [ ] Process output with `processSquizEdit` for edit mode
- [ ] Use static `data-se` attributes in templates
- [ ] Test both edit and front-end modes

## Common Patterns

### Basic Structure
```javascript
export default {
    async main(args, info) {
        let { field1, field2 } = args || {};
        
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            field1 = field1 || 'Default content';
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

### Array Pattern
```javascript
squizEditTargets = {
    "itemTitle": {
        "field": "items",
        "array": true,
        "property": "title"
    }
};
```

This generates: `items[0].title`, `items[1].title`, etc.