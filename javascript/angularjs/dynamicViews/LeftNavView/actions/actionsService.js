(function () {
	'use strict';

	angular
		.module('app.dynamicViews')
		.service('actionsService', actionsService);

	/* @ngInject */
	actionsService.$inject = ['actionsFactory'];

	/**
	 * @desc Service that selects the required Action Item directive.
	 * @param actionsFactory
	 */
	function actionsService(actionsFactory) {
		this.getActionsView = getActionsView;
		this.getActionsNav = getActionsNav;
		this.setActionsView = setActionsView;
		this.viewNavItem = viewNavItem;

		////////////////

		/**
		 * @desc As the viewResource is an unresolved promise when the directive controller gets it, the resource has to be stored in this service.
		 * @param viewResource
		 */
		function setActionsView(viewResource) {
			actionsService.actionsView = viewResource;
		}

		/**
		 * @desc Recalls the actions viewResource stored in this service.
		 * @return viewResource
		 */
		function getActionsView() {
			return actionsService.actionsView;
		}

		// /**
		//  * @desc Initializes the active states of the action items.
		//  * @param navigationList
		//  */
		// function initializeNavigation(navigationList) {
		// 	var navList = navigationList || actionsService.actionsView;
		// 	if (navList.length > 0) {
		// 		if (!navList.activeNavItem) {
		// 			var activeNavItem = _.find(navList, 'active', true);
		// 			_.forEach(navList, function (navItem) {
		// 				if (typeof activeNavItem === 'undefined') {
		// 					navItem.activeNavItem = navList[0];
		// 					navItem.active = navItem === navList[0];
		// 					if (navItem.active === true) viewNavItem(navItem);
		// 				} else {
		// 					navItem.activeNavItem = activeNavItem;
		// 					navItem.active = navItem === activeNavItem;
		// 					if (navItem.active === true) viewNavItem(navItem);
		// 				}
		// 			});
		// 		}
		// 	}
		// }

		/**
		 * @desc Get actions nav from resource
		 */
		function getActionsNav() {
			var view = actionsService.actionsView;
			return actionsFactory.getActionsNav(view).then(function (actionsResource) {
				return actionsResource;
			});
		}

		/**
		 * @desc Sets the selected navigation item to active and displays its dynamic view.
		 * @param navItem - Resource: Selected Navigation Item
		 */
		function viewNavItem(navItem) {
			if (navItem) {
				// actionsService.actionsView.loadingNav = true;
				// _.forEach(actionsService.actionsView.nav, function (item) {
				// 	item.active = false;
				// 	item.activeNavItem = navItem;
				// });
				//
				// navItem.active = true;
				//
				if (navItem.$links && navItem.$links('view')) {
					getViewResource(navItem);
					actionsService.actionsView.loadingNav = false;
				}
			}
		}

		/**
		 * @desc Gets selected item's view link and view type and adds it to actionsService.actionsView.
		 * @param navItem - Resource: Selected Navigation Item
		 */
		function getViewResource(navItem) {
			if (navItem.$links && navItem.$links('view')) {
				actionsFactory.getActionView(navItem).then(function (resource) {
					/*
					 * Expected object (example):
					 * {selfLink: "http://localhost:8081/api/contents/104/builds/edit/traits/plexes/view",
					 * type: "LeftNavView"}
					 */
					actionsService.actionsView.view = resource;
				}).catch(function (error) {
					// All links should be view links.
					actionsService.actionsView.view = null;
					console.error(error.data);
				});
			}
		}
	}
})();

