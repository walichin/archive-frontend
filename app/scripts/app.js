'use strict';

angular
  .module('photoAdmApp', [ 
  	'ngRoute',
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'ngTouch',
    'photoAdmAppControllers',
    'photoAdmService',
    'ui.bootstrap',
    'config'
  ])

.config(['$routeProvider', function($routeProvider) {

    $routeProvider.
        when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'            
        }).
        when('/cards', {
          templateUrl: 'views/card-list.html',
          controller: 'CardListCtrl'
        }).
        when('/cards/:cardId', {
          templateUrl: 'views/card-detail.html',
          controller: 'CardListCtrl'
        }).      
        when('/edit-card/:cardId', {
          templateUrl: 'views/card-edit.html',
          controller: 'CardEditCtrl'
        }).            
        when('/photos', {
          templateUrl: 'views/photo-list.html',
          controller: 'PhotoListCtrl'
        }).  
        when('/images', {
          templateUrl: 'views/image-list.html',
          controller: 'ImageListCtrl'
        }).  
        when('/albums', {
          templateUrl: 'views/album-list.html',
          controller: 'AlbumListCtrl'
        }).
        when('/home', {
          templateUrl: 'views/home.html'
        }).        
        otherwise({
          redirectTo: '/home'
        });

}])

.run(['$rootScope', '$location', '$cookieStore', '$http', function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) { // jshint ignore:line
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
}])

.filter('dateToISO', function() {
  return function(input) {
    input = new Date(input).toISOString();
    return input;
  };
});
