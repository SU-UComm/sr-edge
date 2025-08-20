import SearchController from './SearchController';
import ControllerSubscriber from './ControllerSubscriber';

(() => {
   
    function SearchControllerInit() {
        const controllers = document.querySelectorAll(`[data-component="search-controller"]`);
        if (controllers.length) {
            const searchController = new SearchController(Array.from(controllers));
            const controllerSubscriber = new ControllerSubscriber();
        }
    }
    function ControllerSubscriberInit() {
        const controllers = document.querySelectorAll(`[data-component="search-controller"]`);
        if (controllers.length) {
            const controllerSubscriber = new ControllerSubscriber();
        }
    }

    // initialize the component when the DOM content is fully loaded
    document.addEventListener('DOMContentLoaded', SearchControllerInit);
    // initialize the component when the live preview is updated in page builder
    document.addEventListener('livePreviewUpdated', ControllerSubscriberInit);
   
})();
