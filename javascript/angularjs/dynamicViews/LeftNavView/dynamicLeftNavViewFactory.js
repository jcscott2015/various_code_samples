(function() {
    'use strict';

    angular
        .module('app.dynamicViews')
        .factory('dynamicLeftNavViewFactory', dynamicLeftNavViewFactory);

    /* @ngInject */
    dynamicLeftNavViewFactory.$inject = [];

    /**
     * @desc Returns navigation resources from the backend.
     * @return {{getNavItemView: getNavItemView}}
     */
    function dynamicLeftNavViewFactory() {
        return {
            getNavItemView: getNavItemView
        };

        ////////////////

        /**
         * @desc Returns a navigation item view link from the backend. The view will be selected based on the "type" in this resource. The content for that view comes from links from the "selfLink".
         * @param navItem
         * @return viewResource
         */
        function getNavItemView(navItem) {
            /*
             * ie: Get content from http://localhost:8081/api/contents/104/builds/edit/traits/plexes/view,
             * then add that link ("selfLink") to the viewResource. viewResource already has a view "type".
             */
            return navItem.$get('view').then(function(viewResource) {
                return viewResource;
            });
        }
    }
})();