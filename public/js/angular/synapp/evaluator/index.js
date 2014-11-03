/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

	angular.module('synapp.evaluator', ['synapp.services', 'synapp.cloudinary'])

		.filter('getCurrentlyEvaluatedFilter', require('./filters/get-currently-evaluated'))

		.directive('synappEvaluator', require('./directives/evaluator'));
	
})();
