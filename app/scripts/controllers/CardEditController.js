'use strict';

/**
 * @ngdoc function
 * @name photoAdmApp.controller:CardEditCtrl
 * @description
 * # CardEditCtrl
 * Controller of the photoAdmApp
 */

angular.module('photoAdmAppControllers').controller('CardEditCtrl', function($scope, $routeParams, $http, $location, photoAdmData)  {

  $scope.alerts = [];
  $scope.cardIsSaved = false;
  $scope.photoTypes = {};

  // TO-DO apply caching here
  photoAdmData.getReferenceData().success(function(response){
    $scope.photoTypes = response.photoTypes;
    $scope.statuses = response.statuses;
    $scope.primaryTopics  = response.primaryTopics;
    $scope.secondaryTopics  = response.secondaryTopics;
    $scope.activeTypes  = response.activeTypes;
    $scope.decades  = response.decades;
    $scope.negativeTypes  = response.negativeTypes;
    $scope.categories  = response.categories;
    $scope.formats  = response.formats;    
    $scope.processes  = response.processes;   
    $scope.observations  = response.observations;    
    $scope.cardPositions = response.cardPositions;
  });

  photoAdmData.getCard($routeParams.cardId)
  .success(function(data) {
    console.log('calling search: data:' + data.item);
    $scope.currentCard = data.item;
    $scope.addAlert('info','Card loaded successfully in edit mode.');
  });

  $scope.go = function(path) {
    $location.path(path);
  };

  $scope.addAlert = function($type, $msg) {
    $scope.alerts = [];
    $scope.alerts.push({type: $type, msg: $msg});
  };

  $scope.cancelEditCard = function() {    
    $scope.go('/cards/' + $scope.currentCard.card_id);
  };

  $scope.doneEditCard = function() {
    $scope.go('/cards/' + $scope.currentCard.card_id);
  };

  $scope.saveCard = function() {
    console.log('calling saveCard');
    var $params = {};
    $params = $scope.currentCard;
    var $call = photoAdmData.updateCard($params);
    $call.success(function(data) {
      $scope.addAlert('success','Card saved successfully.');
      $scope.cardIsSaved = true;
      data = data;      
    });
  };

});

