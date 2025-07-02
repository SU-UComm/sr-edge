# Enhanced Dev Server - Page Routing System

This dev server now uses a centralized page routing system that makes it easy to add new pages without duplicating code.

## How It Works

The system consists of three main components:

1. **`pages-config.js`** - Central configuration file that defines all routes
2. **`utils/page-handler.js`** - Handles the common logic for rendering pages
3. **`utils/route-register.js`** - Automatically registers all routes from the configuration

## Adding New Pages

To add a new page, follow these simple steps:

### 1. Create the Page File

Create a new file in the `pages/` directory (e.g., `pages/contact.js`):

```javascript
export default async function Contact() {
    return `
    <!doctype html>
    <html lang="en" class="">
    <head>
        <title>Contact - Stanford Report</title>
        <!-- ... rest of your HTML ... -->
    </head>
    <body>
        <!-- Your page content -->
    </body>
    </html>`;
}
```

### 2. Add to Configuration

Add an entry to `pages-config.js`:

```javascript
export const pagesConfig = {
  // ... existing pages ...
  
  '/contact': {
    module: './pages/contact.js'
  }
};
```

### 3. Optional: Add Aliases

You can also add route aliases:

```javascript
'/contact': {
  module: './pages/contact.js',
  aliases: ['/get-in-touch', '/reach-us']
}
```

This will make the contact page accessible at `/contact`, `/get-in-touch`, and `/reach-us`.

## Current Pages

- `/` and `/home` - Home page (`pages/home.js`)
- `/page-preview` - Page preview (`pages/page-preview.js`)
- `/about` - About page (`pages/about.js`)

## Features

- **Automatic Component Transformation**: All pages automatically get component syntax transformation applied
- **Error Handling**: Built-in error handling for missing pages or rendering errors
- **404 Fallback**: Custom 404 page for undefined routes
- **Route Aliases**: Support for multiple URLs pointing to the same page
- **Centralized Configuration**: All routes defined in one place

## Benefits

- **No Code Duplication**: Common rendering logic is centralized
- **Easy Maintenance**: Adding/removing pages only requires config changes
- **Consistent Behavior**: All pages get the same error handling and transformation
- **Scalable**: Easy to add dozens of pages without cluttering server.js 