'use strict';

/**
 * @ngdoc function
 * @name photoAdmApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the photoAdmApp
 */

angular.module('photoAdmAppControllers').controller('CardListCtrl', function($scope, $http, $location, photoAdmData) {

  // loads what is currently stored in Service layer, keeping state
  $scope.itemsPerPage = photoAdmData.itemsPerPage; // constant
  $scope.cards = photoAdmData.cards; 
  $scope.currentPage = photoAdmData.currentPage;
  $scope.totalCount = photoAdmData.totalCount;

  console.log('CardListCtrl called()');
  console.log('CardListCtrl photoAdmData.currentPage:' + photoAdmData.currentPage); // keeping state
  console.log('CardListCtrl photoAdmData.itemsPerPage:' + photoAdmData.itemsPerPage); // keeping state
  console.log('CardListCtrl photoAdmData.totalCount:' + photoAdmData.totalCount); // keeping state
  console.log('CardListCtrl photoAdmData.totalPages:' + photoAdmData.totalPages); // keeping state

  $scope.search = function() {
	  
    console.log('calling search');
    
    var $params = {};
    $params.currentPage = $scope.currentPage;
    $params.itemsPerPage = $scope.itemsPerPage;
    
    $params.title_search = $scope.title_search;
    $params.description_search = $scope.description_search;
    $params.aditional_data = 'true';
    
    var $call = photoAdmData.getCards($params);
    $call.success(function(data) {
      
      //console.log('calling search: data:' + data.items);
      $scope.cards = data.items;
      $scope.totalCount = data.totalCount;
      photoAdmData.currentPage = $scope.currentPage;
      photoAdmData.itemsPerPage = $scope.itemsPerPage;
      photoAdmData.totalCount = $scope.totalCount;
      
      console.log('calling search: totalPages:' + $scope.totalPages);
      console.log('calling search: totalCount:' + $scope.totalCount);
    });
    
  };

  $scope.pageChanged = function() {
    
	console.log('totalCount to ' + $scope.totalCount);
    console.log('totalPages to ' + $scope.totalPages);
    console.log('pageChanged to ' + $scope.currentPage);
    
    var $params = photoAdmData.params;
    $params.aditional_data = 'false';
    $params.currentPage = $scope.currentPage;
    
    console.log('pageChanged: params: ', $params);
    
    var $call = photoAdmData.getCards($params);
    $call.success(function(data) {
    	
      //console.log('calling pageChanged: data:' + data.items);
      $scope.cards = data.items;
      $scope.totalCount = data.totalCount;
      photoAdmData.currentPage = $scope.currentPage;
      photoAdmData.itemsPerPage = $scope.itemsPerPage;
      photoAdmData.totalCount = $scope.totalCount;
      photoAdmData.totalPages = $scope.totalPages;
    });
  };

  $scope.openCard = function($card, $index) {
    console.log('openCard to $index:' + $index);
    console.log('openCard to $card:' + $card);
    console.log('openCard to $card_id:' + $card.card_id);
    photoAdmData.currentCardRecord = $card; // putting card object in service. keep state
    photoAdmData.currentIndex = $index;
    photoAdmData.totalPages = $scope.totalPages;
    $scope.go('/cards/' + $card.card_id);
  };  

  $scope.go = function($path) {
    $location.path($path);
  };

});