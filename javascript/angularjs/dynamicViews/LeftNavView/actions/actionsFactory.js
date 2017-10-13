(function () {
	'use strict';

	angular
		.module('app.dynamicViews')
		.factory('actionsFactory', actionsFactory);

	/* @ngInject */
	actionsFactory.$inject = [];

	/**
	 * @desc Returns actions resources from the resource.
	 * @return {{getActionsNav: getActionsNav}}
	 */
	function actionsFactory() {
		return {
			getActionsNav: getActionsNav,
			getActionView: getActionView
		};

		////////////////

		/**
		 * @desc Get nav list from resource
		 * @param view
		 */
		function getActionsNav(view) {
			return view.$get('nav').then(function (nav) {
				view.nav = nav;
				// Keep the placeholder message since the nav object is discarded for a concatenated array of the actions and items below
				view.placeholder = view.nav.placeholder;
				return getActionsList(view).then(function (view) {
					return view;
				});
			});
		}

		/**
		 * @desc Get actions list from resource.nav
		 * @param view
		 */
		function getActionsList(view) {
			return view.nav.$get('actions').then(function (actions) {
				view.actions = actions;
				return view;
			});
		}

		/**
		 * @desc Returns a action item view link from the resource. The view will be selected based on the "type" in this resource. The content for that view comes from links from the "selfLink".
		 * @param actionItem
		 * @return viewResource
		 */
		function getActionView(actionItem) {
			/*
			 * ie: Get content from http://localhost:8081/api/contents/104/builds/edit/traits/plexes/view,
			 * then add that link ("selfLink") to the viewResource. viewResource already has a view "type".
			 */
			return actionItem.$get('view').then(function (viewResource) {
				return viewResource;
			});
		}
	}
})();

