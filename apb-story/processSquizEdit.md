# Squiz Editor Integration Guide

## Overview
This guide shows how to modify components to support inline editing in Squiz Editor using the `processSquizEdit` utility function.

**Why This Method?** This approach is necessary because of shared global utilities that render reusable content (like cards, buttons, or other common elements). These utilities need different `data-sq-field` values depending on which component is using them, but they share the same template structure. The `processSquizEdit` method allows us to map generic `data-se` attributes in templates to specific `data-sq-field` values for each component's data structure.

For example, a shared card utility might use `data-se="cardTitle"` in its template, but Component A needs `data-sq-field="heroCards[0].title"` while Component B needs `data-sq-field="testimonials[0].heading"`. This mapping system solves that challenge elegantly.

## Key Changes Made to Acknowledgement Component

### 1. Import the Utility Function
```javascript
import { processSquizEdit } from '../../global/js/utils/isEditor';
```
**Note:** Only import `processSquizEdit` - `isEditor` is no longer needed.

### 2. Detect Edit Mode
```javascript
// Must fallback to false, use true to mock the editor
const squizEdit = false || info?.ctx?.editor || false;
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
        "ct": {
            "field": "content"
        },
        "couldbeArray": {
            "field": "card",
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

## Configuration Examples

### Simple Field Mapping
```javascript
"ct": {
    "field": "content"
}
```
**Template:** `<div data-se="ct">{{{content}}}</div>`
**Result:** `data-sq-field="content"`

### Array with Property
```javascript
"couldbeArray": {
    "field": "card",
    "array": true,
    "property": "title"
}
```
**Result:** `data-sq-field="card[0].title"`, `card[1].title`, etc.

## processSquizEdit Function Details

The `processSquizEdit` utility function handles the transformation of `data-se` attributes to `data-sq-field` attributes:

### Function Behavior
- **Appends** `data-sq-field` attributes alongside existing `data-se` attributes
- **Handles arrays** with automatic indexing using square brackets `[0]`, `[1]`, etc.
- **Supports properties** on array items like `card[0].title`
- **Uses regex** to handle complex HTML with flexible formatting

### Array Processing
For array configurations, the function:
1. Finds all elements with the same `data-se` attribute
2. Assigns incremental indexes starting from `[0]`
3. Optionally appends property names if specified

**Example:**
```html
<!-- Before -->
<div data-se="cardTitle">Title 1</div>
<div data-se="cardTitle">Title 2</div>

<!-- After -->
<div data-se="cardTitle" data-sq-field="card[0].title">Title 1</div>
<div data-se="cardTitle" data-sq-field="card[1].title">Title 2</div>
```

## Implementation Checklist
- [ ] Import only `processSquizEdit` utility
- [ ] Change destructured variables from `