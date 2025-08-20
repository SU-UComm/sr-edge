export default class ControllerSubscriber {
    constructor() {
        this.subscriptions = Array.from(document.querySelectorAll(`[data-controller-subscribe]`));

        if (this.subscriptions.length) {
            this.#init();
        }
    }

    /**
     * initializes the controller subscriber
     *
     * @returns {void}
     */
    #init() {
        this.subscriptions.forEach((node) => {
            // Check if a search toggle button already exists for this node
            let searchToggle = node.querySelector('button[data-controller-subscribe]');
            const {controllerSubscribe} = node.dataset;

            if (!searchToggle) {
                searchToggle = document.createElement('button');
                searchToggle.textContent = 'Change';

                // Copy all data attributes from node to button
                Object.keys(node.dataset).forEach((key) => {
                    searchToggle.dataset[key] = node.dataset[key];
                });

                node.appendChild(searchToggle);
            } else {
                // Update button text and data attributes in case they changed
                searchToggle.textContent = 'Change';
                Object.keys(node.dataset).forEach((key) => {
                    searchToggle.dataset[key] = node.dataset[key];
                });
            }

            // Remove any previous click event listeners by cloning the node
            const newSearchToggle = searchToggle.cloneNode(true);
            newSearchToggle.addEventListener('click', this.#openControllerEvent.bind(this, controllerSubscribe));
            if (searchToggle !== newSearchToggle) {
                node.replaceChild(newSearchToggle, searchToggle);
            }
        });
    }

    // -- events
    /**
     *
     * @param {*} name
     */
    #openControllerEvent = (name, e) => {
        const controllerOpen = new CustomEvent('controller:open', {
            detail: {
                name,
                target: e.target,
            },
        });
        
        document.dispatchEvent(controllerOpen);
    };
}
