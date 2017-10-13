(function() {
    'use strict';

    angular
        .module('app.dynamicViews')
        .directive('agItemsList', agItemsList);

    /* @ngInject */
    agItemsList.$inject = [];

    function agItemsList() {
        return {
            bindToController: true,
            controller: AgItemsListCtrl,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            scope: {},
            templateUrl: 'app/dynamicViews/LeftNavView/items/agItemsList.tpl.html'
        };

        function link(scope, element, attrs) {

        }
    }

    /* @ngInject */
    AgItemsListCtrl.$inject = [];

    function AgItemsListCtrl() {

    }
})();