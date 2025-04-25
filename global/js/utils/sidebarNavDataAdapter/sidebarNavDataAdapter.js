/**
 * Adapter class to orchestrate the transformation of data
 * from various endpoints, using a provided sidebar nav service.
 */
export class sidebarNavDataAdapter {
    /**
     * Creates an instance of sidebarNavDataAdapter.
     *
     * @param {Object} sidebarNavService - A service object that provides the `getSidebarNavParentData` and `getSidebarNavMenuData` methods.
     */
    constructor(sidebarNavService) {
        this.sidebarNavService = sidebarNavService;
        this.getSidebarNavParentData = sidebarNavService?.getSidebarNavParentData;
        this.getSidebarNavMenuData = sidebarNavService?.getSidebarNavMenuData;
    }

    /**
     * Sets or replaces the sidebar nav service and rebinds its `getSidebarNavParentData` and `getSidebarNavMenuData` methods.
     *
     * @param {Object} sidebarNavService - The new sidebar nav service instance.
     * @param {Function} sidebarNavService.getSidebarNavParentData - Method to fetch parent data by asset ID.
     * @param {Function} sidebarNavService.getSidebarNavMenuData - Method to fetch menu data by asset ID.
     */
    setSidebarNavService(sidebarNavService) {
        this.sidebarNavService = sidebarNavService;
        this.getSidebarNavParentData = sidebarNavService.getSidebarNavParentData.bind(sidebarNavService);
        this.getSidebarNavMenuData = sidebarNavService.getSidebarNavMenuData.bind(sidebarNavService);
    }
}

export default sidebarNavDataAdapter;