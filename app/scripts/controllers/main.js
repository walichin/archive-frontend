'use strict';

var photoAdmAppControllers = angular.module('photoAdmAppControllers', ['photoAdmService', 'ui.bootstrap','config']);

photoAdmAppControllers.controller('LoginController',
    ['$scope', '$rootScope', '$location', 'AuthenticationService', 'ENV', function ($scope, $rootScope, $location, AuthenticationService, ENV) {
        
        AuthenticationService.ClearCredentials();

        $scope.login = function () {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function (response) {
                if (response.code === 0) {
                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                    $location.path('/');
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
        };
    }]
);

photoAdmAppControllers.controller('MenuController',
	['$scope', '$rootScope', '$location', 'AuthenticationService', function ($scope, $rootScope, $location, AuthenticationService) {
        
	// reset login status
	$scope.isAuth = function() {
		//console.log('isAuth');
		return $rootScope.globals.currentUser;
		};
	    
	$scope.logout = function() {
		//console.log('logout');
		AuthenticationService.ClearCredentials();
		$location.path('/login');
		};

	$scope.showUserName = function() {
		//console.log('calling showUserName function');
		if ($rootScope.globals.currentUser) {
			return 'Usuario: '+$rootScope.globals.currentUser.username;
			}
		return ''; //'Guest';
		}; 

	}]
);

photoAdmAppControllers.controller('PhotoListCtrl', function() {

});

photoAdmAppControllers.controller('ImageListCtrl', function() {

});

photoAdmAppControllers.controller('AlbumListCtrl', function() {

});
