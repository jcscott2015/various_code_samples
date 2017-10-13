(function () {
	'use strict';

	angular
		.module('app.dynamicViews')
		.service('actionItemService', actionItemService);

	actionItemService.$inject = [];

	/* @ngInject */
	/**
	 * @desc Service that selects the required Action Item directive.
	 */
	function actionItemService() {
		this.getViewDirectiveByType = actionItemService;

		////////////////

		function actionItemService(viewType) {
			//code
		}
	}
})();

