# Squiz DXP Component Development Guide

## Introduction

This comprehensive guide covers the development of components for Squiz's DXP Component Service at Edge and Visual Page Builder. It combines technical documentation with practical development guidelines to provide a complete reference for building high-quality, editable components.

The Component Service (CS) is a core part of the Squiz DXP that allows developers to build decoupled front-end components which are rendered server-side. Components make it easy for content editors to edit structured content that implements a design system or drives richer, more complex experiences.

## Getting Started

For repository setup steps, see https://gitlab.squiz.net/services/boilerplates/kernel

### Creating New Components

To create a new component, start in the `dxp/component-service` directory and create a new folder with the name of your component. Refer to existing components for examples.

## Component File Structure

Each component **MUST** include a `manifest.json` file which describes the whole component and a JS file called `main.js` which implements the component.

**ALMOST ALWAYS** additional files are created to smooth out the development process:

### Required Files

- **`manifest.json`** - A critical file linking all others, specifying dependencies, defining preview data sources, and setting up input configurations in the CMS
- **`main.js`** - Defines the component's structure, including classes and functions for state and appearance changes
- **`preview.html`** - A wrapper for the component, should **ALWAYS** contain only: `[component://output]`

### Standard Additional Files

- **`example.data.json`** - Contains example data passed to the component, displayed in previews and DXP
- **`README.md`** - Component description with tips and property examples
- **Frontend JS file** - **MUST** be stored in `[component-name]/js/frontend.js`
- **Frontend CSS/SCSS** - **MUST** be stored in `[component-name]/css/[component-name].scss`

### Optional Files

- **`main.test.js`** - Tests for the component written in Vitest
- **`frontend.test.js`** - Tests for custom scripts

### Example File Structure

```
dxp/
├── component-service/
│   ├── accordion/
│   │   ├── css/
│   │   │   ├── accordion.scss
│   │   ├── js/
│   │   │   ├── frontend.js
│   │   ├── example.data.json
│   │   ├── main.js
│   │   ├── main.test.js
│   │   ├── manifest.json
│   │   ├── preview.html
│   │   ├── README.md
```

All additional scripts and styles will automatically be included in `src/styles/main.scss` and `src/scripts/main.js`. These files are used to build the final output in the `/dist` directory, which you can connect through GitBridge.

## Development Tools

### Linters & Formatters
The project uses Prettier, ESLint, and Stylelint. Review the `package.json` to find commands to run these before pushing changes.

### Tests
The project includes tests written in Vitest. They cover all main.js files and additional scripts related to the components.

To run the tests locally, use:
```bash
npm run test
```

### Aliases
Within the `/src` folder and styles, you can use aliases defined in vite.config.js. Avoid deep relative paths by using aliases like `@images/logo.svg`.

### Utils
Utility functions for components are stored in `dxp/component-service/utils`:

- `xss.js` - Prevents XSS attacks by sanitizing inputs
- `html.js` - Tags template literals for syntax highlighting, readability, and structured HTML generation
- `editor.js` - Contains the `isEditor` utility for edit mode detection

## Manifest.json Configuration

The `manifest.json` file is a [JSON Schema](https://json-schema.org/) file containing metadata that describes how to execute the component.

### Required Root Properties

```json
{
  "$schema": "http://localhost:3000/schemas/v1.json",
  "name": "component-name",
  "namespace": "edge-dxp-comp-lib",
  "description": "Component description",
  "displayName": "Human Readable Name",
  "version": "1.0.0",
  "type": "edge",
  "mainFunction": "main",
  "icon": {
    "id": "announcement",
    "color": {
      "type": "enum",
      "value": "gray"
    }
  },
  "functions": [...],
  "staticFiles": {
    "locationRoot": "./"
  },
  "previews": {...}
}
```

### Key Field Descriptions

- **`$schema`** - **ALWAYS** use `http://localhost:3000/schemas/v1.json` unless stated otherwise
- **`version`** - Must be changed each time the component is deployed. Use [Semantic Versioning](https://semver.org/)
- **`name`** - Component names should always be in lower case, without spaces (use dashes instead)
- **`namespace`** - **ALWAYS** use `edge-dxp-comp-lib` unless stated otherwise
- **`icon`** - Definition for the icon used by the component
  - `id` - Based on the [Material UI Two Tone icon set](https://mui.com/material-ui/material-icons/)
  - `color.type` - Can be "hex" or "enum"
  - `color.value` - Either a hexadecimal color code or one of "gray", "blue", "green", "orange", "red", "purple", "teal", "yellow", "pink"
- **`type`** - **ALWAYS** set to "edge"
- **`mainFunction`** - **MUST** be "main" and reference a function in the functions array

### Functions Array Structure

```json
"functions": [
  {
    "name": "main",
    "entry": "main.js",
    "input": {
      "type": "object",
      "required": [],
      "properties": {
        "content": {...},
        "config": {...}
      }
    },
    "output": {
      "responseType": "html"
    }
  }
]
```

### Input Schema Organization

Organize inputs into logical groups for better user experience:

#### 1. Content Fields (Inline Editable)

```json
"content": {
  "type": "object",
  "title": "Content Fields",
  "description": "Content fields that are typically inline editable",
  "required": [],
  "properties": {
    "title": {
      "type": "string",
      "title": "Title",
      "description": "Main title - inline editable string",
      "default": "Default Title",
      "ui:metadata": {
        "inlineEditable": true
      }
    },
    "description": {
      "type": "FormattedText",
      "title": "Description",
      "description": "Rich text description - inline editable FormattedText",
      "default": [
        {
          "type": "tag",
          "tag": "p",
          "children": [
            {
              "type": "text",
              "value": "Default description text"
            }
          ]
        }
      ],
      "ui:metadata": {
        "inlineEditable": true
      }
    },
    "image": {
      "type": "SquizImage",
      "title": "Image",
      "description": "Component image - inline editable SquizImage",
      "ui:metadata": {
        "inlineEditable": true
      }
    },
    "link": {
      "type": "SquizLink",
      "title": "Link",
      "description": "Component link - inline editable SquizLink",
      "ui:metadata": {
        "inlineEditable": true
      }
    }
  }
}
```

#### 2. Configuration Fields (Quick Options)

```json
"config": {
  "type": "object",
  "title": "Configuration Options",
  "description": "Configuration fields that are typically quick options",
  "required": [],
  "ui:metadata": {
    "collapsedByDefault": true
  },
  "properties": {
    "theme": {
      "type": "string",
      "title": "Color Theme",
      "description": "Component color theme - enum quick option",
      "enum": ["white", "fog", "chocolate"],
      "default": "white",
      "ui:metadata": {
        "quickOption": true
      }
    },
    "alignment": {
      "type": "string",
      "title": "Content Alignment",
      "description": "Text alignment - enum with quick option",
      "enum": ["left", "center", "right"],
      "default": "center",
      "ui:metadata": {
        "quickOption": true
      }
    },
    "showElement": {
      "type": "boolean",
      "title": "Show Element",
      "description": "Toggle element visibility - boolean quick option",
      "default": true,
      "ui:metadata": {
        "quickOption": true
      }
    }
  }
}
```

### Preview Configuration

```json
"previews": {
  "default": {
    "functionData": {
      "main": {
        "inputData": {
          "type": "file",
          "path": "example.data.json"
        },
        "wrapper": {
          "path": "preview.html"
        }
      }
    }
  }
}
```

## Input Field Types

### String Fields

```json
"fieldName": {
  "type": "string",
  "title": "Field Title",
  "description": "Field description",
  "default": "Default value",
  "ui:metadata": {
    "inlineEditable": true
  }
}
```

#### String Constraints

- **Length constraints**: Use `minLength` and `maxLength`
- **Pattern matching**: Use `pattern` with regular expressions
- **Format constraints**: Use `format` with values like "email", "uri", "date"
- **Multi-line**: Use `"format": "multi-line"` for textarea input
- **Matrix Asset URI**: Use `"format": "matrix-asset-uri"` for asset selection
- **Enumerated values**: Use `enum` array for dropdown options

### FormattedText Fields

The FormattedText type provides rich text editing capabilities with minimal inline styling.

```json
"richTextField": {
  "type": "FormattedText",
  "title": "Rich Text",
  "description": "Rich text field",
  "default": [
    {
      "type": "tag",
      "tag": "p",
      "children": [
        {
          "type": "text",
          "value": "Default text content"
        }
      ]
    }
  ],
  "ui:metadata": {
    "inlineEditable": true
  }
}
```

**Important**: FormattedText has different formats:
- **In manifest.json**: Use AST array format with tag/children structure
- **In example.data.json**: Use HTML string format
- **In component rendering**: Render directly as received

### SquizImage Fields

```json
"imageField": {
  "type": "SquizImage",
  "title": "Image",
  "description": "Image field",
  "ui:metadata": {
    "inlineEditable": true
  }
}
```

#### SquizImage Object Structure

```javascript
{
  name: "My Image",
  alt: "The alt if the image doesn't load",
  caption: "This above is a loaded image",
  imageVariations: {
    original: {
      url: "http://example.com/image.jpg",
      width: 100,
      height: 100,
      byteSize: 1000,
      mimeType: "image/jpeg",
      aspectRatio: "1:1",
      sha1Hash: "1234567890abcdef1234567890abcdef12345678"
    }
  }
}
```

### SquizLink Fields

```json
"linkField": {
  "type": "SquizLink",
  "title": "Link",
  "description": "Link field",
  "ui:metadata": {
    "inlineEditable": true
  }
}
```

#### SquizLink Object Structure

```javascript
{
  text: "My Link",
  url: "https://some.link/foo",
  target: "_blank"
}
```

### Boolean Fields

```json
"booleanField": {
  "type": "boolean",
  "title": "Toggle Option",
  "description": "Boolean toggle",
  "default": true,
  "ui:metadata": {
    "quickOption": true
  }
}
```

### Integer and Number Fields

```json
"integerField": {
  "type": "integer",
  "title": "Count",
  "minimum": 0,
  "maximum": 100,
  "default": 5
}
```

Constraints available:
- `minimum` and `maximum` (inclusive)
- `exclusiveMinimum` and `exclusiveMaximum`
- `multipleOf` for divisibility requirements
- `enum` for specific allowed values

### Array Fields

```json
"arrayField": {
  "type": "array",
  "title": "List Items",
  "description": "Array of items",
  "items": {
    "type": "object",
    "required": [],
    "properties": {
      "title": {
        "type": "string",
        "title": "Item Title",
        "ui:metadata": {
          "inlineEditable": true
        }
      },
      "description": {
        "type": "string",
        "title": "Item Description",
        "ui:metadata": {
          "inlineEditable": true
        }
      }
    }
  },
  "default": [
    {
      "title": "Default Item",
      "description": "Default description"
    }
  ]
}
```

#### Array Constraints

- `minItems` and `maxItems` for length constraints
- `uniqueItems: true` to ensure all items are unique
- Fixed-length arrays using array syntax for `items`

### Object Fields

```json
"objectField": {
  "type": "object",
  "title": "Configuration",
  "properties": {
    "setting1": { "type": "string" },
    "setting2": { "type": "boolean" }
  },
  "required": []
}
```

## Conditional fields

There are 2 ways to make conditions in the manifest file

#### Boolean field as a conditional control

The Boolean type can be useful for controlling conditional editing fields within the editing interface.

For example, you may only show an additional String input field for a component when a Boolean input field is set to `true`.

This is achieved using the JSON Schema Composition and JSON Schema Conditionals keywords.

```json
"input": {
    "type": "object",
    "properties": {
        "conditionalControlField": {
            "default": false,
            "title": "Show/hide",
            "type": "boolean"
        }
    },
    "allOf": [
        {
            "if": {
                "properties": {
                    "conditionalControlField": {
                        "const": false
                    }
                },
                "required": []
            },
            "then": {
                "properties": {},
                "required": []
            }
        },
        {
            "if": {
                "properties": {
                    "conditionalControlField": {
                        "const": true
                    }
                },
                "required": []
            },
            "then": {
                "properties": {
                    "conditionalResultField": {
                        "title": "Hidden until shown",
                        "type": "string"
                    },
                },
                "required": ["conditionalResultField"]
            }
        }
    ],
    "required":[]
},
```

The `if` and `then` objects **MUST** all have a `required` property set.

### Enum field as a conditional control

```json
"blocks": {
  "type": "array",
  "title": "Blocks",
  "minItems": 1,
  "maxItems": 5,
  "items": {
    "type": "object",
    "title": "Block",
    "required": ["blockType", "colorType"],
    "properties": {
      "blockType": {
        "type": "string",
        "title": "Block Type",
        "description": "Choose the type of block to display",
        "enum": ["testimonial", "rating"],
        "default": "rating"
      },
    },
    "dependencies": {
      "blockType": {
        "oneOf": [
          {
            "properties": {
              "blockType": {"const": "testimonial"},
              "quote": {
                "type": "string",
                "title": "Quote",
                "description": "Quote from the author"
              },
              "headshot": {
                "type": "SquizImage",
                "title": "Headshot",
                "description": "Author Headshot"
              },
            },
            "required": ["quote", "headshot"]
          },
          {
            "properties": {
              "blockType": {"const": "rating"},
              "logo": {
                "type": "SquizImage",
                "title": "Logo",
                "description": "Company Logo"
              },
              "stars": {
                "type": "string",
                "title": "Rating",
                "enum": ["none", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"],
                "default": "none",
                "description": "Rating value"
              },
            },
            "required": ["logo"]
          }
        ]
      }
    }
  }
}
```

This will result in different fields being displayed based on the value of `blockType` property


## UI Metadata Options

### quickOption

Enables editing simple values directly from the component capsule in the preview column.

**Supported types**: boolean, string (with enumerated values)

```json
"ui:metadata": {
  "quickOption": true
}
```

### inlineEditable

Enables inline editing in the preview column for content fields.

**Supported types**: number, integer, string, FormattedText, SquizImage, SquizLink

```json
"ui:metadata": {
  "inlineEditable": true
}
```

### collapsedByDefault

Collapses input groups by default in the page outline column.

```json
"ui:metadata": {
  "collapsedByDefault": true
}
```

## Environment Variables

For components that need environment variables (API endpoints, configuration values, etc.):

```json
"environment": [
  { "name": "BRAND_PRIMARY_COLOR", "required": true },
  { "name": "NON_MANDATORY_VAR", "required": false }
]
```

Usage in `main.js`:

```javascript
export default {
  async main({ title, link, cards }, info) {
    // Get environment variables
    const { BRAND_PRIMARY_COLOR, NON_MANDATORY_VAR = "" } = info.env;
    
    // ... rest of the code
  }
}
```

## Component Implementation (main.js)

### Basic Structure

```javascript
export default {
  async main(args, info) {
    const { ctx } = info;
    // Component code
    return `HTML output`;
  }
}
```

### Edit Mode vs Front-End Mode

Components must handle two distinct rendering modes:

#### Edit Mode Detection

Always use the `isEditor` utility for proper edit mode detection:

```javascript
import { isEditor } from '../../utils/editor';

export default {
  async main(args, info) {
    const { ctx } = info;
    
    // Detect edit mode using context check
    const editMode = isEditor(ctx?.url);
    
    // Rest of component logic...
  }
};
```

#### Edit Mode Requirements

**Purpose**: CMS editing interface with inline editing capabilities

1. **Include `data-sq-field` attributes** for all editable content
2. **Always show placeholders** for empty content, even if front-end version hides it
3. **Visual editing indicators** - make editable areas clearly identifiable
4. **Array index syntax**: Use bracket notation: `item[${index}].value`

#### Front-End Mode Requirements

**Purpose**: Clean production output for end users

1. **Clean HTML output** without `data-sq-field` attributes (optional)
2. **Conditional rendering** - hide empty content sections if no data exists
3. **Optimized markup** - minimal DOM structure for performance

### Recommended Component Structure

```javascript
import { html } from '../../utils/html';
import { isEditor } from '../../utils/editor';

export default {
  async main(args, info) {
    const { ctx } = info;
    
    // 1. Extract and validate inputs with defaults
    const {
      title = 'Default Title',
      items = [],
    } = args || {};

    // 2. Detect edit mode using context
    const editMode = isEditor(ctx?.url);

    // 3. Process quickOption configurations
    let config = getDefaultConfig();

    // 4. Handle edit mode vs front-end mode logic
    if (editMode) {
      return renderEditMode(title, items, config);
    } else {
      return renderFrontEnd(title, items, config);
    }
  }
};
```

### Data-sq-field Attributes

**Critical Rule**: All inline editable components must include `data-sq-field` attributes that correspond to the field paths defined in your `manifest.json`.

#### Field Path Mapping

The `data-sq-field` attribute value must match the exact path structure:

```javascript
// manifest.json structure maps to data-sq-field values
data-sq-field="content.title"        // Maps to args.content.title
data-sq-field="content.description"  // Maps to args.content.description
data-sq-field="config.theme"         // Maps to args.config.theme
```

#### Implementation Options

**Option A - Unified Markup** (Recommended for simple components):
```javascript
// Same markup for both edit and frontend modes
html`<h1 data-sq-field="content.title">${title}</h1>`
```

**Option B - Separate Edit Mode Markup** (When clients don't want edit attributes on frontend):
```javascript
// Separate markup for edit vs frontend
${editMode 
  ? html`<h1 data-sq-field="content.title">${title}</h1>`
  : html`<h1>${title}</h1>`
}
```

### Critical Implementation Rules

#### 1. Editable Elements Must Always Be Present in Edit Mode

**❌ Incorrect Implementation**:
```javascript
// Element disappears if no title
${title ? html`<h1 data-sq-field="content.title">${title}</h1>` : ''}
```

**✅ Correct Implementation**:
```javascript
// Element always present in edit mode
${editMode 
  ? html`<h1 data-sq-field="content.title">${title || 'Add your title here'}</h1>`
  : title ? html`<h1>${title}</h1>` : ''
}
```

#### 2. Array Rendering with .map()

**CRITICAL RULE**: Always use `.join('')` when using `.map()` to render arrays in HTML templates.

**❌ Incorrect - Outputs commas**:
```javascript
${items.map(item => html`<div>${item.title}</div>`)}
// Output: <div>Item 1</div>,<div>Item 2</div>,<div>Item 3</div>
```

**✅ Correct - Clean HTML output**:
```javascript
${items.map(item => html`<div>${item.title}</div>`).join('')}
// Output: <div>Item 1</div><div>Item 2</div><div>Item 3</div>
```

#### 3. Array Indexing in data-sq-field

Use bracket notation for array indexing:

```javascript
// ✅ Correct array indexing syntax
${features.map((feature, index) => html`
  <div class="feature" data-sq-field="content.features[${index}]">
    <h3 data-sq-field="content.features[${index}].title">${feature.title}</h3>
    <p data-sq-field="content.features[${index}].description">${feature.description}</p>
  </div>
`).join('')}
```

### Complex Field Type Handling

#### SquizImage Rendering

```javascript
${editMode 
  ? html`<div data-sq-field="content.image">
      ${image?.imageVariations?.original?.url 
        ? html`<img src="${image.imageVariations.original.url}" alt="${image.alt || ''}" />`
        : html`<div class="image-placeholder">Click to add image</div>`
      }
    </div>`
  : image?.imageVariations?.original?.url 
    ? html`<img src="${image.imageVariations.original.url}" alt="${image.alt || ''}" />`
    : ''
}
```

#### SquizLink Rendering

```javascript
${editMode
  ? html`<div data-sq-field="content.link">
      ${link?.url 
        ? html`<a href="${link.url}">${link.text || 'Learn More'}</a>`
        : html`<div class="link-placeholder">Click to add link</div>`
      }
    </div>`
  : link?.url 
    ? html`<a href="${link.url}">${link.text || 'Learn More'}</a>`
    : ''
}
```

#### FormattedText Rendering

```javascript
// FormattedText is rendered directly as it comes from the data
${editMode 
  ? html`<div data-sq-field="content.description">${description || '<p>Click to add description</p>'}</div>`
  : description ? html`${description}` : ''
}
```

### Data Fetching

Edge components require all HTTP requests to use the Fetch API.

```javascript
async function getData(ids, BASE_DOMAIN, BASE_PATH) {
  try {
    const query = `${BASE_DOMAIN}${BASE_PATH}/cards?ids=${ids}`;
    const response = await fetch(query);
    const data = await response.json();
    return data;
  } catch {
    console.log('Data could not be found');
    return undefined;
  }
}

export default {
  async main({ prop1, prop2, prop3 }, info) {
    const { BASE_DOMAIN, BASE_PATH } = info.env;
    const data = await getData(prop1, BASE_DOMAIN, BASE_PATH);
    
    // ... rest of the code
  }
}
```

## Data Handling Best Practices

### 1. Meaningful Defaults

```javascript
// Always provide sensible fallbacks
const title = args.title || 'Default Title';
const items = args.items || [];
const config = {
  showHeader: args.showHeader ?? true,
  maxItems: args.maxItems || 10,
  ...args.config
};
```

### 2. Graceful Fallbacks

```javascript
// Handle missing or malformed data
const safeItems = Array.isArray(args.items) ? args.items : [];
const validColor = args.color && /^#[0-9A-F]{6}$/i.test(args.color) ? args.color : '#000000';
```

### 3. QuickOption Usage

Use `quickOption` for configuration that affects:
- **Layout changes** (grid vs list view, column count)
- **Visual appearance** (color schemes, typography)
- **Behavior modifications** (auto-play, sorting options)

```javascript
// Example quickOption implementation
if (args.quickOption === 'dark-theme') {
  colorScheme = 'dark';
  textColor = '#ffffff';
  bgColor = '#000000';
}
```

## Advanced Patterns

### Multi-Section Component Structure

```javascript
// Separate render functions for each section
const renderHeader = (isEdit = false) => { /* header logic */ };
const renderHeroImage = (isEdit = false) => { /* hero logic */ };
const renderHighlights = (isEdit = false) => { /* highlights logic */ };
const renderCTA = (isEdit = false) => { /* CTA logic */ };

// Compose sections in main output
const editOutput = html`
  <section class="${sectionClasses}" ${dataAttributes} id="${componentId}">
    ${renderHeader(true)}
    ${renderHeroImage(true)}
    ${renderHighlights(true)}
    ${renderCTA(true)}
  </section>
`;
```

## Testing Guidelines

When developing components, always test:

1. **Both modes**: Edit mode and front-end mode rendering
2. **Empty states**: No data provided, empty arrays, null values
3. **Edge cases**: Malformed data, unexpected types
4. **QuickOption variations**: All supported quickOption values
5. **Frontend Mode**: Verify clean output without edit attributes
6. **Edit Mode**: Ensure all fields are editable and properly mapped
7. **Error Handling**: Verify elements remain editable even with invalid data

### Component Checklist

By the end of development, your component should meet these criteria:

- ✅ Color/theme fields are available in Quick options menu
- ✅ Content fields (title, description, images) are inline editable
- ✅ Component renders correctly in both edit and front-end modes
- ✅ Empty states are handled gracefully
- ✅ All data-sq-field attributes map correctly to manifest.json structure
- ✅ Meaningful defaults are provided for all fields

## Key Principles for AI Development

1. **Always implement edit mode detection** using the `isEditor` utility
2. **Follow the component structure patterns** outlined in this document
3. **Ensure data-sq-field attributes** match the manifest.json structure exactly
4. **Provide meaningful defaults** and graceful fallbacks for all data inputs
5. **Test both edit and front-end modes** to ensure consistent behavior
6. **Use the correct array indexing syntax** in data-sq-field attributes: `[${index}]`
7. **Always show placeholders** for empty content in edit mode
8. **Reference the patterns and examples** in this document rather than creating new approaches

This document serves as the authoritative guide for component development patterns and should be followed consistently across all components in the system.