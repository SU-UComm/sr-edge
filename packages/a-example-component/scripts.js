const EXAMPLE_COMPONENT = '.example-component';

function cmpInit() {
    // initialize the component
    const exampleComponent = document.querySelector(EXAMPLE_COMPONENT);
    if (!exampleComponent) return;

    // do something with the component
    // ...
}
// initialize the component when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', cmpInit);
// initialize the component when the live preview is updated in page builder
document.addEventListener('livePreviewUpdated', cmpInit);