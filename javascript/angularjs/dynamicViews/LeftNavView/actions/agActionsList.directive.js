(function() {
    'use strict';

    angular
        .module('app.dynamicViews')
        .directive('agActionsList', agActionsList);

    /* @ngInject */
    agActionsList.$inject = [];

    /**
     * @desc Returns actions list element
     * @return {{bindToController: {viewResource: string}, controller: AgActionsListCtrl, controllerAs: string, restrict: string, scope: {}, templateUrl: string}}
     */
    function agActionsList() {
        return {
            bindToController: {
                viewResource: '=view'
            },
            controller: AgActionsListCtrl,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {},
            templateUrl: 'app/dynamicViews/LeftNavView/actions/agActionsList.tpl.html'
        };
    }

    /* @ngInject */
    AgActionsListCtrl.$inject = ['$scope', 'actionsService', '$translatePartialLoader', '$translate'];

    /**
     * @desc Controller for agActionsList directive. This controller is not dependent on the parent controller.
     * @param $scope
     * @param actionsService
     * @param $translatePartialLoader
     * @param $translate
     * @constructor
     */
    function AgActionsListCtrl($scope, actionsService, $translatePartialLoader, $translate) {
        var vm = this;

        /**
         * We'll have to wait for the navList resource before we can use it. When we have it,
         * let's hand it off to the agActionsService to manage. Since the service will be
         * managing vm.viewLink, there'll be no updates to this $scope. Do business logic
         * in the agActionsService.
         */
        $scope.$watch('vm.viewResource', function() {
            if (typeof vm.viewResource !== 'undefined') {
                actionsService.setActionsView(vm.viewResource);
                if (actionsService.getActionsView() != null) {
                    actionsService.getActionsNav().then(function(nav) {
                        vm.nav = nav;
                    });
                }
            }

            vm.viewNavItem = actionsService.viewNavItem;
        });

        /**
         * We can probably have the service do the translation, too.
         */
        $translatePartialLoader.addPart('navs');
        $translate.refresh();
    }
})();