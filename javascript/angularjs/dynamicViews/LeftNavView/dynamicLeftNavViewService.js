(function() {
    'use strict';

    angular
        .module('app.dynamicViews')
        .service('dynamicLeftNavViewService', dynamicLeftNavViewService);

    /* @ngInject */
    dynamicLeftNavViewService.$inject = [];

    /**
     * @desc Service to store the LeftNavView resource and get new resources for it from the REST service.
     */
    function dynamicLeftNavViewService() {
        this.initializeNavigation = initializeNavigation;
        this.getNavList = getNavList;
        this.setNavList = setNavList;
        this.viewNavItem = viewNavItem;

        ////////////////

        /**
         * @desc As the resource is an unresolved promise when the directive controller gets it, the resource has to be stored in this service.
         * @param resource
         */
        function setNavList(resource) {
            dynamicLeftNavViewService.navList = resource;
        }

        /**
         * @desc Recalls the navList resource stored in this service.
         * @return navList resource
         */
        function getNavList() {
            return dynamicLeftNavViewService.navList;
        }

        /**
         * @desc Initializes the active states of the navigation items.
         * @param navigationList
         */
        function initializeNavigation(navigationList) {
            var navList = navigationList || dynamicLeftNavViewService.navList;
            if (navList.length > 0) {
                if (!navList.activeNavItem) {
                    var activeNavItem = _.find(navList, 'active', true);
                    _.forEach(navList, function(navItem) {
                        if (typeof activeNavItem === 'undefined') {
                            navItem.activeNavItem = navList[0];
                            navItem.active = navItem === navList[0];
                            if (navItem.active === true) viewNavItem(navItem);
                        } else {
                            navItem.activeNavItem = activeNavItem;
                            navItem.active = navItem === activeNavItem;
                            if (navItem.active === true) viewNavItem(navItem);
                        }
                    });
                }
            }
        }

        /**
         * @desc Sets the selected navigation item to active and displays its dynamic view.
         * @param navItem - Resource: Selected Navigation Item
         */
        function viewNavItem(navItem) {
            if (navItem) {
                dynamicLeftNavViewService.navList.loadingNav = true;

                _.forEach(dynamicLeftNavViewService.navList, function(item) {
                    item.active = false;
                    item.activeNavItem = navItem;
                });

                navItem.active = true;

                if (navItem.$links && navItem.$links('view')) {
                    getViewResource(navItem);
                    dynamicLeftNavViewService.navList.loadingNav = false;
                }
            }
        }

        /**
         * @desc Gets selected item's view link and view type and adds it to agDynamicNavListService.navList.
         * @param navItem - Resource: Selected Navigation Item
         */
        function getViewResource(navItem) {
            if (navItem.$links && navItem.$links('view')) {
                agDynamicNavFactory.getNavItemView(navItem).then(function(resource) {
                    /*
                     * Expected object (example):
                     * {selfLink: "http://localhost:8081/api/contents/104/builds/edit/traits/plexes/view",
                     * type: "LeftNavView"}
                     */
                    dynamicLeftNavViewService.navList.view = resource;
                }).catch(function(error) {
                    // All links should be view links.
                    dynamicLeftNavViewService.navList.view = null;
                    console.error(error.data);
                });
            }
        }
    }
})();