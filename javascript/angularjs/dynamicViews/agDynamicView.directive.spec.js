/**
 * Example Jasmine Test File for agDynamicView.directive.js
 */
(function() {
    'use strict';

    describe('directive: ag-dynamic-view', function() {
        var element, isolatedEl, scope, $compile;

        beforeEach(function() {
            module('app.dynamicViews');

            inject(function(_$compile_, _$rootScope_) {
                $compile = _$compile_;
                scope = _$rootScope_.$new();
            });
        });

        function getCompiledElement(el) {
            var ngEl = angular.element(el);
            var compiledElement = $compile(ngEl)(scope);
            scope.$digest();
            return compiledElement;
        }

        describe('directive: ag-dynamic-view should be compiled', function() {
            beforeEach(function() {
                scope.view = {
                    type: 'LeftNavView'
                };
                element = getCompiledElement('<ag-dynamic-view view="vm.view"></ag-dynamic-view>');
                isolatedEl = element.isolateScope();
                isolatedEl.$apply(); // trigger scope.$watch
            });

            describe('ag-dynamic-view should append another directive', function() {
                it("should be '<ag-dynamic-left-nav-view view=\"vm.view\"></ag-dynamic-left-nav-view>'", function() {
                    var viewElement = element.find('ag-dynamic-left-nav-view');
                    expect(viewElement).toBeDefined();
                });
            });
        });

        // Add as many describes as needed.
    });
}());