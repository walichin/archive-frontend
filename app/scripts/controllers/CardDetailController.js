'use strict';

/**
 * @ngdoc function
 * @name photoAdmApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the photoAdmApp
 */

angular.module('photoAdmAppControllers').controller('CardDetailCtrl', function($window, $scope, $rootScope, $routeParams, $http, $location, photoAdmData) {

	$scope.showFindPhoto = false;
	$scope.selected = {};
	$scope.selectedAdd = {};
	$scope.alerts = [];
	$scope.accordionContext = {};
	$scope.accordionContext.newComment = '';
  
	$scope.currentCardRecord = photoAdmData.currentCardRecord; // this has to be set before calling controller ??

	console.log ('CardDetailCtrl controller called. $routeParams.cardId:' + $routeParams.cardId);
	//console.log ('currentCardRecord id:' + $scope.currentCardRecord.card_id);
	//console.log ('previousCardRecord id:' + $scope.currentCardRecord.previous_card_id);
	//console.log ('nextCardRecord id:' + $scope.currentCardRecord.next_card_id);
	
	/*** photoAdmData knows about search params, pagination, result grid -> next/previous data ***/
	
	/** below call loads Card information. Should be moved to Service layer - Jens **/
	
	//var $call = photoAdmData.getCard($scope.currentCardRecord.card_id);
	photoAdmData.getCard($routeParams.cardId)
	.success(function(data) {
		console.log('calling search: data:' + data.item);
		if (data.item.active === 'Y') { data.item.active = 'True'; }
		if (data.item.active === 'N') { data.item.active = 'False'; }
		if (data.item.card_status === 'PEND') { data.item.card_status = 'Pending'; }
		if (data.item.card_status === 'VERF') { data.item.card_status = 'Verified'; }    
		$scope.currentCard = data.item;
		$scope.accordionContext.comments = data.item.comments;
		$scope.addAlert('info','Card loaded successfully.');    
	});

  $scope.addAlert = function($type, $msg) {
    $scope.alerts = [];
    $scope.alerts.push({type: $type, msg: $msg});
  };

  $scope.editCard = function() {
    $scope.go('/edit-card/' + $scope.currentCard.card_id);
  }; 

  $scope.openPreviousCard = function() {
    
    console.log ('openPreviousCard called: current_id:' +
    		$scope.currentCard.card_id +
    		' previous_card_id:' +
    		photoAdmData.card_list_index[$scope.currentCard.card_id].previous_card_id);
    
	if (photoAdmData.card_list_index[$scope.currentCard.card_id].previous_card_id === undefined) {
		$scope.addAlert('info','You reached the first record.');
	} else {
		$scope.go('/cards/' + photoAdmData.card_list_index[$scope.currentCard.card_id].previous_card_id);
	}
	
	// This should derive/calculate previous record based on result grid
    // one query to get previous id card 
    // it should check on card index to see if grid should be reloaded to previous/next page
    // we will disable this for now. 10/08

    //console.log ('openPreviousCard called: currentIndex:' + photoAdmData.currentIndex);
    //console.log ('openPreviousCard called: itemsPerPage:' + photoAdmData.itemsPerPage);
    //console.log ('openPreviousCard called: currentPage:' + photoAdmData.currentPage);
    //console.log ('openPreviousCard called: totalPages:' + photoAdmData.totalPages);
  };

  $scope.openNextCard = function() {
	  
    console.log ('openNextCard called: current_id:' +
    		$scope.currentCard.card_id +
    		' next_card_id:' +
    		photoAdmData.card_list_index[$scope.currentCard.card_id].next_card_id);

	if (photoAdmData.card_list_index[$scope.currentCard.card_id].next_card_id === undefined) {
		$scope.addAlert('info','You reached the last record.');
	} else {
		$scope.go('/cards/' + photoAdmData.card_list_index[$scope.currentCard.card_id].next_card_id);
	}
		  
	// This should derive/calculate next record based on result grid
    // one query to get next id card 
    // it should check on card index to see if grid should be reloaded to previous/next page
    // we will disable this for now. 10/08

    //console.log ('openNextCard called: currentIndex:' + photoAdmData.currentIndex);
    //console.log ('openNextCard called: itemsPerPage:' + photoAdmData.itemsPerPage);
    //console.log ('openNextCard called: currentPage:' + photoAdmData.currentPage);
    //console.log ('openNextCard called: totalPages:' + photoAdmData.totalPages);
  };

  $scope.go = function($path) {
    $location.path($path);
  };

  $scope.gox = function($path) {
    console.log('gox: called');
    console.log('gox:'+ $path);
    $location.path($path);
  };

  $scope.unlinkPhoto = function() {
		
	var $params = {};
	var $call;
	var $ImageIdJson = {};
	var y=0;
	
	if ($scope.currentCard.photos.length > 0) {
		for (var i=0; i<$scope.currentCard.photos.length; i++) {
	    	if ($scope.currentCard.photos[i].sel_for_unlink) {
	    		$ImageIdJson[y] = $scope.currentCard.photos[i].image_id;
	    		y++;
	    	}
		}
	}
	
	if (y > 0) {
		
		$params.cardId = $scope.currentCard.card_id;
		$params.ImageIdJson = $ImageIdJson;
		
		console.log('$params:',$params);
		$call = photoAdmData.unlinkPhoto($params);
		
		$call.success(function(data) {
			
			console.log('data:',data);
			if (data.success) {
				$scope.showFindPhoto = false;
				$scope.currentCard.photos = data.photos;
				$scope.addAlert('success','Photo(s) un-linked successfully.');
			}
		});
	}
  };  
  
  $scope.linkPhoto = function() {
	
	var $params = {};
	var $call;
	//var $listImageId = [];
	var $ImageIdJson = {};
	var y=0;
	
	if ($scope.photos.length > 0) {
		for (var i=0; i<$scope.photos.length; i++) {
	    	if ($scope.photos[i].is_selected) {
	    		//$listImageId.push($scope.photos[i].image_id);
	    		$ImageIdJson[y] = $scope.photos[i].image_id;
	    		y++;
	    	}
		}
	}
	
	if (y > 0) {
		
		$params.cardId = $scope.currentCard.card_id;
		$params.cardNumber = $scope.currentCard.card_number;
		$params.ImageIdJson = $ImageIdJson;
		
		console.log('$params:',$params);
		$call = photoAdmData.linkPhoto($params);
		
		$call.success(function(data) {
			
			console.log('data:',data);
			if (data.success) {
				$scope.showFindPhoto = false;
				$scope.currentCard.photos = data.photos;
				$scope.addAlert('success','Photo(s) linked successfully.');
			}
		});
	}
	
  };

  $scope.showLinkPhoto = function() {

    $scope.selectedAdd = {};
    $scope.showFindPhoto = !$scope.showFindPhoto;
    // $scope.new_comment // commenting this because it seems incomplete
    if ($scope.showFindPhoto === true) {
      var $params = {};
      $scope.filterText = $scope.currentCard.card_number;
      $params.textToSearch = $scope.filterText;
      console.log('bringing photos');
      var $call = photoAdmData.getPhotos($params);
      $call.success(function(data) {
        console.log('calling search: data:' + data.items);
        $scope.photos = data.items;
        $scope.totalCount = data.totalCount;
      });
    }

  };

  $scope.filterPhotoGrid = function() {

    if ($scope.showFindPhoto === true) {
      var $params = {};
      $params.textToSearch = $scope.filterText;
      console.log('bringing photos');
      var $call = photoAdmData.getPhotos($params);
      $call.success(function(data) {
        console.log('calling search: data:' + data.items);
        $scope.photos = data.items;
        $scope.totalCount = data.totalCount;
      });
    }

  };

  $scope.addComment = function() {

	console.log('calling addComment');
	
	var card_id = $scope.currentCard.card_id;
	var newComment = $scope.accordionContext.newComment;
	var create_user = $rootScope.globals.currentUser.username;
	
	var $call = photoAdmData.insertComment(card_id, newComment, create_user);
	
	$call.success(function(data) {
	  //$scope.addAlert('success','Comment created successfully.');
	  $scope.currentCard = data.item;
	  $scope.accordionContext.comments = data.item.comments;
	  $scope.accordionContext.newComment = '';
	  $scope.commentIsSaved = true;
	});
  };

  $scope.deleteComment = function(row_comment) {

	console.log('calling deleteComment');
	
	var card_comment_id = row_comment.card_comment_id;
	
	var $call = photoAdmData.deleteComment(card_comment_id);
	
	$call.success(function(data) {
	  //$scope.addAlert('success','Comment deleted successfully.');
	  $scope.currentCard = data.item;
	  $scope.accordionContext.comments = data.item.comments;
	  $scope.commentIsSaved = true;
	});
  };

  $scope.updatePhoto = function(row_photo) {
	    
	console.log('calling updatePhoto');
	
	var $params = {};
	$params = row_photo;
	var $call = photoAdmData.updatePhoto($params);
	
	$call.success(function(data) {
	  //$scope.addAlert('success','Image saved successfully.');
	  $scope.currentCard.photos = data.item;
	  $scope.photoIsSaved = true;
	});
  };  
	  
});
