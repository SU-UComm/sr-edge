
export default {
    async main(componentInput, componentUtilities) {

        const componentContext = componentUtilities?.ctx || null;
        const squizEdit = componentContext?.editor || false;

        const { endpoint, name, config } = componentInput;

        if(!squizEdit) {
            return '';
        }

        return `
            <section
                data-component="search-controller"
                class="search-controller"
                data-role="search-controller-close"
                data-endpoint="${endpoint}"
                data-controller="${name}"
                data-config="${encodeURIComponent(JSON.stringify(config))}"
            >
                <div class="search-controller__body">
                    <div class="search-controller__header">
                        <button class="search-controller__close-btn" data-role="search-controller-close" aria-label="Close search dialog">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                    </div>

                    <div class="search-controller__main">
                        <form class="search-controller__form" role="search" aria-label="Find stories">
                            <label for="search-controller-query" class="search-controller__label" hidden>
                                Search for stories
                            </label>
                            <input
                                type="search"
                                id="search-controller-query"
                                class="search-controller__search-query"
                                placeholder="Find stories..."
                                data-role="search-controller-query"
                                autocomplete="off"
                                aria-label="Find stories"
                            />
                        </form>
                    </div>
                </div>
            </section>
        `;
    },
};
