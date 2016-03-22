angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('QRScannerCtrl', function($scope, $cordovaBarcodeScanner, $http, $ionicPopup) {
  console.log('controller being load')

  $scope.getcalled = false;
  $scope.serviceCameback = false;
  $scope.serviceerror = false;
  $scope.scanData = 'No Data Yet';

  $scope.scan = function() {

    $cordovaBarcodeScanner
      .scan().then(function(barcodeData) {
        if (!barcodeData.cancelled) {
          //if it pass the URL regex validation

          if ($scope.urlPattern.test(barcodeData.text)) {
            $scope.getcalled = true;
            //base on split
            var originalUrl = barcodeData.text;
            var temp = originalUrl.split('/')
            var apiUrl = 'https://testtingpark.herokuapp.com/tingpark/api/qr/'
            for (var i = 4; i < temp.length; i++) {
              apiUrl += temp[i] + '/'
            }

            //base on findyourcar substring
            //var apiUrl = 'https://testtingpark.herokuapp.com/tingpark/api/qr'+originalUrl.substring(originalUrl.indexOf('findyourcar/')+11)

            $scope.retrieveParkingData(apiUrl);
          } else {
            $scope.scanData = 'Regex failed';
          }
        } else {
          $scope.scanData = 'Camera Cancelled';
        }
      }, function(error) {
        // An error occurred
        $scope.scanData = error;
      })
  };

  $scope.retrieveParkingData = function(url) {
    $http({
      url: url,
      method: 'GET',
    }).then(function(response) {
      $scope.serviceCameback = true;
      $scope.scanData = response.data;
    }, function(error) {
      $scope.serviceerror = true;
      $scope.scanData = error;
      $scope.showAlert();
    });

  }

  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Invalid QR',
      template: 'The QR code you provided is not valid'
    });

    alertPopup.then(function(res) {
      console.log('closed');
    });
  };


  $scope.urlPattern = new RegExp('^(https?:\/\/)') //validate parking spot

})

.factory('Map', function(){

  var map;
  var infoWindow;
  var markers =[];
  var directionsDisplay;

  return {
    map: map,
    markers : markers,
    infoWindow: infoWindow,
  };
});
