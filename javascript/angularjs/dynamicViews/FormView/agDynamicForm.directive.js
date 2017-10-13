(function() {
    'use strict';

    angular
        .module('app.dynamicViews')
        .directive('agDynamicForm', agDynamicForm);

    /* @ngInject */
    function agDynamicForm() {
        return {
            scope: {},
            bindToController: {
                navList: '='
            },
            controller: AgDynamicFormCtrl,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: 'app/dynamicViews/FormView/agDynamicForm.tpl.html'
        };

        function link(scope, element, attrs) {

        }
    }

    AgDynamicFormCtrl.$inject = ['$translatePartialLoader', '$translate'];

    /* @ngInject */
    function AgDynamicFormCtrl($translatePartialLoader, $translate) {
        var vm = this;

        $translatePartialLoader.addPart('navs');
        $translate.refresh();
    }

})();