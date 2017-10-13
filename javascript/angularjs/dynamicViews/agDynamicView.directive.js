(function() {
    'use strict';

    angular
        .module('app.dynamicViews')
        .directive('agDynamicView', agDynamicView);

    /* @ngInject */
    agDynamicView.$inject = ['$compile'];

    /**
     * @desc This directive is just a conduit. It appends itself with the requested dynamic view directive and links the view resource to its scope.
     * @param $compile
     * @return {link: link, restrict: string, scope: {view: object}}
     */
    function agDynamicView($compile) {
        return {
            link: link,
            restrict: 'E',
            scope: {
                view: '='
            }
        };

        /**
         * @desc Uses agDynamicViewService to select dynamic view directive, compiles new directive element, replaces this directive, and the dynamic view is rendered.
         * @param scope
         *
         * @param element
         */
        function link(scope, element) {
            var childScope;

            scope.$watch('view', function(value) {
                // Destroy childScope to avoid scope.$watch recursion.
                if (childScope != null) {
                    childScope.$destroy();
                    childScope = null;
                }
                if (typeof scope.view !== 'undefined') {
                    if ((scope.view != null) && (typeof scope.view.type !== 'undefined')) {
                        // Create a new scope to maintain isolated scope for the compiled dynamic view directive.
                        childScope = scope.$new();
                        var directive = 'ag-dynamic-' + _.kebabCase(scope.view.type);
                        /*
                         * What's interesting here in the link function, just adding view as an attribute
                         * string to the element string magically links the scope.view resource from the
                         * parent directive to the dynamic directive when compiled. Doing the same action
                         * within this directive's controller, view isn't linked to the parent scope.
                         */
                        var dir = '<' + directive + ' view="view"></' + directive + '>';
                        var newEl = $compile(dir)(childScope);
                        element.empty().append(newEl);
                    } else {
                        // Delete view directive.
                        element.empty();
                    }
                }
            });
        }
    }
})();