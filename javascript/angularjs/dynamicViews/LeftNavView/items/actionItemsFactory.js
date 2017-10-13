(function () {
	'use strict';

	angular
		.module('app.dynamicViews')
		.factory('actionItemsFactory', actionItemsFactory);

	/* @ngInject */
	actionItemsFactory.$inject = [];

	/**
	 * @desc Returns items resources from the resource.
	 * @return {{getItemsLeftNav: getItemsLeftNav}}
	 */
	function actionItemsFactory() {
		return {
			getItemsNav: getItemsNav,
			getItemsView: getItemsView
		};

		////////////////

		/**
		 * @desc Get nav list from resource
		 * @param view
		 */
		function getItemsNav(view) {
			return view.$get('nav').then(function (nav) {
				view.nav = nav;
				// Keep the placeholder message since the nav object is discarded for a concatenated array of the actions and items below
				view.placeholder = view.nav.placeholder;
				return getItemsList(view).then(function (view) {
					return view
				});
			});
		}

		/**
		 * @desc Get items list from resource.nav
		 * @param view
		 */
		function getItemsList(view) {
			view.nav.$get('items').then(function (items) {
				return items;
			});
		}

		/**
		 * @desc Returns a item view link from the resource. The view will be selected based on the "type" in this resource. The content for that view comes from links from the "selfLink".
		 * @param item
		 * @return viewResource
		 */
		function getItemsView(item) {
			/*
			 * ie: Get content from http://localhost:8081/api/contents/104/builds/edit/traits/plexes/view,
			 * then add that link ("selfLink") to the viewResource. viewResource already has a view "type".
			 */
			return item.$get('view').then(function (viewResource) {
				return viewResource;
			});
		}
	}
})();

