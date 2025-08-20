export default class SearchController {
    constructor(controllers) {
        this.controllers = controllers;

        // dynamic
        this.controllerData = {};
        this.current = null;
        this.loading = false;

        // init
        if (this.controllers.length) {
            this.#init();
        }
    }

    #init() {
        this.controllers.forEach((node) => {
            const {config, endpoint, controller} = node.dataset;
            // console.log("controller", controller);
            this.controllerData[controller] = {
                config: JSON.parse(decodeURIComponent(config)),
                endpoint,
                component: node,
                searchInput: node.querySelector("[data-role='search-controller-query']"),
                close: [node.querySelector("[data-role='search-controller-close']"), node],
                opened: false,
                toggle: this.#toggle,
                results: this.#resultsNode(),
                query: '',
                data: [],
            };
        });

        document.addEventListener('controller:open', this.#onControllerOpen.bind(this));
        document.addEventListener('controller:result', this.#setResult.bind(this));
    }
    
    #setResult = (e) => {
        const { data, search, parent } = e.detail;
    
        const assetIdField = parent.querySelector(`[data-sq-controller="${ search.dataset.controllerSubscribeId }"]`);

        if(assetIdField) {
            assetIdField.textContent = data?.listMetadata?.id[0] || '';

            setTimeout(() => {
                assetIdField.dispatchEvent(new Event("input", { bubbles: true }));
            }, 100);
        }
    }

    /**
     * this method is scoped to the named controller data object
     * eg: this.controllerData[name].toggle()
     *
     * @param {boolean} [open]
     * toggles the state of the current controller modal
     * to close the modal, pass false or nothing at all
     *
     * @returns {void}
     */
    #toggle(open) {
        if (!open) {
            this.component.classList.remove('search-controller--active');
            this.opened = open;
            this.data = [];
            this.query = '';
            this.results.remove();
            this.results.innerHTML = '';
            this.searchInput.value = '';

            return;
        }

        this.component.classList.add('search-controller--active');
        this.opened = open;
    }

    /**
     * checks if the controller data exists and if so
     * sets it to the current property and closes all existing
     * open modals
     *
     * @param {string} name
     * the name of the controller to open
     *
     * @returns {void}
     */
    #getController(name) {
        if (!this.controllerData[name]) return;

        Object.keys(this.controllerData).forEach((key) => {
            this.controllerData[key].toggle();
        });
        
        this.current = this.controllerData[name];

        this.current.close.forEach((close) => close.addEventListener('click', this.#onControllerClose.bind(this)));

        this.current.searchInput.addEventListener('input', this.#onControllerSearch.bind(this));

        this.current.toggle(true);
    }

    /**
     * routes the search to the appropriate endpoint
     *
     * @returns {void}
     */
    #routeSearch() {
        const {endpoint} = this.current;

        if (endpoint.match(/funnelback/i)) this.#funnelbackSearch();
    }

    /**
     * builds the results container node
     *
     * @returns {HTMLElement}
     */
    #resultsNode() {
        const results = document.createElement('div');

        results.classList.add('search-controller__results');

        return results;
    }



    /**
     * builds the result items
     *
     * @param {string} type
     * the type of search data to render
     *
     * @returns {void}
     */
    #results(type) {
        const {data, results, searchInput, query} = this.current;

        if (!query.length) {
            results.remove();

            return;
        }

        searchInput.after(results);

        results.innerHTML = '';

        if (!data.length) {
            results.innerHTML = '<p>No results found</p>';

            return;
        }

        if (type === 'funnelback') {
            data.forEach((item) => {
                const result = document.createElement('article');

                result.setAttribute('role', 'button');
                result.classList.add('search-controller__result');
                result.dataset.id = item.listMetadata.id;
                const topicName = item?.listMetadata?.taxonomyContentMainTopicText?.[0] || null;
                result.innerHTML = `
                        ${
                            item.listMetadata.image
                                ? `
                                <div class="search-controller__result-image">
                                    <img src="${item.listMetadata.image}" alt="Search result image">
                                </div>
                            `
                                : ''
                        }

                    <div class="search-controller__result-content">
                        <h2>${item.title} ${topicName ? `<small> - ${topicName}</small>` : ''}</h2>

                        ${item.summary ? `<p>${item.summary.substring(0, 100)}${item.summary.length > 100 ? '...' : ''}</p>` : ''}
                    </div>
                `;

                result.addEventListener('click', this.#onResultClick.bind(this, item));

                results.appendChild(result);
            });
        }
    }

    /**
     * performs funnelback search
     *
     * @returns {void}
     */
    async #funnelbackSearch() {
        const {searchEndpoint, profile, collection, query} = this.current.config;
        const url = `${searchEndpoint}?profile=${profile}&collection=${collection}&query=${this.current.query}`;

        if (this.loading) return;

        if (!this.current.query) {
            this.current.data = [];
            this.#results();
        }

        this.loading = true;
        this.current.lastQuery = this.current.query;

        try {
            const response = await fetch(url);
            const data = await response.json();

            this.current.data = data.response.resultPacket.results;
        } catch (err) {
            // console.error(err);
        } finally {
            this.loading = false;

            // re-run the search if the query has changed
            if (this.current.lastQuery !== this.current.query) {
                this.#funnelbackSearch();
            }

            this.#results('funnelback');
        }
    }

    // -- events

    /**
     * opens the controller modal only if
     * the controller name is provided
     *
     * @param {Event} e
     * the event object
     *
     * @returns {void}
     */
    #onControllerOpen = (e) => {
        const {name, target} = e.detail;

        this.searchButton = target;
        this.#getController(name);
    };

    /**
     * closes the controller modal
     *
     * @param {Event} e
     * the event object
     *
     * @returns {void}
     */
    #onControllerClose = (e) => {
        e.stopPropagation();

        if (e.target.dataset.role !== 'search-controller-close') return;

        this.current.toggle(false);
    };

    /**
     * fires when the search input is changed
     *
     * @param {Event} e
     * the event object
     *
     * @returns {void}
     */
    #onControllerSearch = (e) => {
        this.current.query = e.target.value;

        if (!this.current.query.length) {
            this.#routeSearch();
        }

        if (this.current.query.length >= 3) {
            this.#routeSearch();
        }
    };
    
    #onResultClick = (data) => {
        
        const resultClicked = new CustomEvent('controller:result', {
            detail: {
                data,
                search: this.searchButton,
                parent: this.searchButton.closest('[data-sq-component]'),
            },
        });

        this.current.toggle(false);
        document.dispatchEvent(resultClicked);
    };
}
