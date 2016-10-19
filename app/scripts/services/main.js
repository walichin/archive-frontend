'use strict';

var photoAdmService = angular.module('photoAdmService', []);

photoAdmService.factory('photoAdmData', ['$http', 'ENV', function ($http, ENV) {

	console.log('photoAdmData:' + ENV);
	var urlServer = ENV.backend;
	console.log('urlServer:' + urlServer);
    
    var urlCardSearch = urlServer+'/photo-adm/index.php/card/search'; 
    var urlCardView = urlServer+'/photo-adm/index.php/card/view'; 
    var urlPhotoSearch = urlServer+'/photo-adm/index.php/photo/search'; 
    var urlPhotoUnLink = urlServer+'/photo-adm/index.php/card/unlink'; 
    var urlPhotoLink = urlServer+'/photo-adm/index.php/card/link'; 
    var urlSaveSearch = urlServer+'/photo-adm/index.php/card/save'; 
    var urlReferenceData = urlServer+'/photo-adm/index.php/reference/all'; 
    var urlSavePhoto = urlServer+'/photo-adm/index.php/photo/save_card_photo'; 
    var urlnewComment = urlServer+'/photo-adm/index.php/card/new_comment'; 
    var urldeleteComment = urlServer+'/photo-adm/index.php/card/delete_comment'; 

    var photoAdmData = {};

    photoAdmData.cards = {}; // to keep state
    photoAdmData.currentPage = 1;
    photoAdmData.totalPages = 1;
    photoAdmData.totalCount = 0;
    photoAdmData.itemsPerPage = 10;
    photoAdmData.currentCardRecord = null;

    photoAdmData.getReferenceData = function () {

		return $http.get(urlReferenceData, {
	
		}).success(function(data) {
			return data;
		}).error(function(data) {
			return data;
		});
    };

    photoAdmData.getCard = function ($cardId) {

		return $http.get(urlCardView + '/' + $cardId, {
	
		}).success(function(data) {
			return data;
		}).error(function(data) {
			photoAdmData.cards = {};
			return data;
		});
    };

    photoAdmData.getCards = function ($params) {

		return $http.get(urlCardSearch, { 
			params : {
				"aditional_data" : $params.aditional_data,
				"title_search" : $params.title_search,
				"description_search" : $params.description_search,
				"offset" : (($params.currentPage  - 1)* $params.itemsPerPage),
				"limit" : $params.itemsPerPage				
			}
		}).success(function(data) {
			
			photoAdmData.cards = data.items; // setting this to keep state
			photoAdmData.params = $params; // keeping state of search params 
			
			if ($params.aditional_data === "true") {
				
				var card_list_index = {};
				var card_id_prev_next = {};
				var length = data.extra_data.length;
				
				//data.extra_data solo tiene 3 columnas (card_id, previous_card_id, next_card_id)
				if (length > 0) {
					for (var i=0; i<length; i++) {
						card_id_prev_next = {};
						card_id_prev_next.previous_card_id = data.extra_data[i].previous_card_id;
						card_id_prev_next.next_card_id = data.extra_data[i].next_card_id;
						card_list_index[data.extra_data[i].card_id] = card_id_prev_next;
						
//						console.log('data.extra_data loop:' +
//								' i:' + i +
//								' i < (length - 1):' + (length - 1) +
//								' card_id:' + data.extra_data[i].card_id +
//								' previous_card_id:' + card_id_prev_next.previous_card_id +
//								' next_card_id:' + card_id_prev_next.next_card_id);
					}
				}
				
				photoAdmData.card_list_index = card_list_index;
			}
			
			return data;
			
		}).error(function(data) {
			
			photoAdmData.cards = {};
			return data;
			
		});
    };

    /*** receives $direction : +1 or -1 ***/
    photoAdmData.loadPageCards = function ($direction) {

    	var $params = photoAdmData.params;
    	$params.currentPage = $params.currentPage + $direction;

		return $http.get(urlCardSearch, { 
			params : {
				"title_search" : $params.title_search,
				"description_search" : $params.description_search,
				"offset" : (($params.currentPage  - 1)* $params.itemsPerPage),
				"limit" : $params.itemsPerPage				
			}
		}).success(function(data) {
			photoAdmData.cards = data.items; // setting this to keep state
			photoAdmData.params = $params;
	
			if ($direction === 1) {
				photoAdmData.currentCardRecord = data.items[0];
			} else  {
				photoAdmData.currentCardRecord = data.items[9];
			}
			return data;
		}).error(function(data) {
			photoAdmData.cards = {};
			return data;
		});
    };

    photoAdmData.updateCard = function ($params) {

    	console.log('updateCard:' +  $params);
    	
		return $http.post(urlSaveSearch, 
			JSON.stringify($params)
		).success(function(data) {
			//photoAdmData.cards = data.items;
			return data;
		}).error(function(data) {
			//photoAdmData.cards = {};
			return data;
		});
    };

    photoAdmData.updatePhoto = function ($params) {

    	console.log('updatePhoto:' +  $params);
    	
		return $http.post(urlSavePhoto, 
			JSON.stringify($params)
		).success(function(data) {
			//photoAdmData.cards = data.items;
			return data;
		}).error(function(data) {
			//photoAdmData.cards = {};
			return data;
		});
    };
    
    photoAdmData.insertComment = function (card_id, comment, create_user) {

		var $params = {
			card_id: card_id,
			comment: comment,
			create_user: create_user
			};

		console.log('archivo:' +  $params);
	
		return $http({
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj) {
					//username=jalejos&password=clave
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				}
				return str.join("&");
				},
			url: urlnewComment,
			data: $params
		}).success(function(data) {
			//photoAdmData.cards = data.items;
			return data;
		}).error(function(data) {
			//photoAdmData.cards = {};
			return data;
		});
    };

    photoAdmData.deleteComment = function (card_comment_id) {

		var $params = {
			card_comment_id: card_comment_id
			};

		console.log('archivo:' +  $params);
		
		return $http({
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj) {
					//username=jalejos&password=clave
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				}
				return str.join("&");
				},
			url: urldeleteComment,
			data: $params
		}).success(function(data) {
			//photoAdmData.cards = data.items;
			return data;
		}).error(function(data) {
			//photoAdmData.cards = {};
			return data;
		});
    };
    
    photoAdmData.getPhotos = function ($params) {

		return $http.get(urlPhotoSearch, { 
			params : {
				"data" : $params.textToSearch				
			}
		}).success(function(data) {
			return data;
		}).error(function(data) {
			return data;
		});
    };

    photoAdmData.unlinkPhoto = function ($params) {

		return $http.get(urlPhotoUnLink, { 
			params : {
				"cardId" : $params.cardId,
				"listImageId" : JSON.stringify($params.ImageIdJson)
			}
		}).success(function(data) {
			return data;
		}).error(function(data) {
			return data;
		});
    };    

    photoAdmData.linkPhoto = function ($params) {

    	//console.log('JSON.stringify',JSON.stringify($params.ImageIdJson));
    	//console.log('angular.toJson',angular.toJson($params.ImageIdJson));
    	//console.log('Test','{"0":"100001","1":"100002","2":"100003","3":"100004"}');
        
    	return $http.get(urlPhotoLink, { 
			params : {
				"cardId" : $params.cardId,
				//"listImageId" : '{"0":"100001","1":"100002","2":"100003","3":"100004"}',
				"cardNumber" : $params.cardNumber,
				"listImageId" : JSON.stringify($params.ImageIdJson)
			}
    	}).success(function(data) {
			return data;
		}).error(function(data) {
			return data;
		});

    }; 

    return photoAdmData;

}]);
