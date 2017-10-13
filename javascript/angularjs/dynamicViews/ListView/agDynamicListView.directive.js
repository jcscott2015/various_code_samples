(function () {
	'use strict';

	angular
		.module('app.dynamicViews')
		.directive('agDynamicListView', agDynamicListView);

	//agDynamicListView.$inject = ['dependency'];

	/* @ngInject */
	function agDynamicListView() {
		return {
			scope: {},
			bindToController: {
				navList: '='
			},
			controller: agDynamicListViewCtrl,
			controllerAs: 'vm',
			link: link,
			restrict: 'E',
			templateUrl: 'app/dynamicViews/ListView/agDynamicListView.tpl.html'
		};

		function link(scope, element, attrs) {

		}
	}

	agDynamicListViewCtrl.$inject = ['$translatePartialLoader', '$translate'];

	/* @ngInject */
	function agDynamicListViewCtrl($translatePartialLoader, $translate) {
		var vm = this;

		$translatePartialLoader.addPart('navs');
		$translate.refresh();
	}

})();

