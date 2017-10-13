/**
 * Example Jasmine Test File for agActionsList.directive.js
 */
(function() {
	'use strict';

	describe('directive: ag-dynamic-actions-list', function() {
		var element, isolatedEl, scope, $compile, $interval;

		beforeEach(function() {
			module('app.dynamicViews');

			inject(function(_$compile_, _$rootScope_, _$interval_) {
				$compile = _$compile_;
				$interval = _$interval_;
				scope = _$rootScope_.$new();
			});
		});

		function getCompiledElement(el) {
			var ngEl = angular.element(el);
			var compiledElement = $compile(ngEl)(scope);
			scope.$digest();
			return compiledElement;
		}

		function someTest(param) {
			/*
			Test code here.
			 */
			return something;
		}

		describe('directive: ag-dynamic-actions-list does something', function() {
			beforeEach(function() {
				element = getCompiledElement('<ag-dynamic-actions-list></ag-dynamic-actions-list>');
				isolatedEl = element.isolateScope();
			});

			describe('with some test', function() {
				it("should do something", function() {
					expect(isolatedEl.state).toBeUndefined();
					expect(isolatedEl.starttime).toBeUndefined();
					expect(element.text()).toBe(now);
				});
			});
		});

		// Add as many describes as needed.
	});
}());