(function() {
    'use strict';

    angular
        .module('app.dynamicViews')
        .directive('agDynamicLeftNavView', agDynamicLeftNavView);

    /* @ngInject */
    agDynamicLeftNavView.$inject = [];

    /**
     * @desc Builds the LeftNavView navigation and shows selected dynamic views and content.
     * @return directive object
     */
    function agDynamicLeftNavView() {
        return {
            scope: {},
            bindToController: {
                view: '='
            },
            controller: AgDynamicLeftNavViewCtrl,
            controllerAs: 'vm',
            restrict: 'E',
            templateUrl: 'app/dynamicViews/LeftNavView/agDynamicLeftNavView.tpl.html'
        };
    }

    /* @ngInject */
    AgDynamicLeftNavViewCtrl.$inject = ['$scope', '$translatePartialLoader', '$translate'];

    /**
     * @desc Controller for agDynamicLeftNavView directive. This controller needs the view object from the parent controller.
     * @param $scope
     * @param agDynamicLeftNavViewService
     * @param agDynamicViewService
     * @param $translatePartialLoader
     * @param $translate
     * @constructor
     */
    function AgDynamicLeftNavViewCtrl($scope, $translatePartialLoader, $translate) {
        var vm = this;
        /* VM code here. */
    }
})();