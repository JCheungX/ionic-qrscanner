angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  // $scope.loginData = {};

  // // Create the login modal that we will use later
  // $ionicModal.fromTemplateUrl('templates/login.html', {
  //   scope: $scope
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // });

  // // Triggered in the login modal to close it
  // $scope.closeLogin = function() {
  //   $scope.modal.hide();
  // };

  // // Open the login modal
  // $scope.login = function() {
  //   $scope.modal.show();
  // };

  // // Perform the login action when the user submits the login form
  // $scope.doLogin = function() {
  //   console.log('Doing login', $scope.loginData);

  //   // Simulate a login delay. Remove this and replace with your login
  //   // code if using a login system
  //   $timeout(function() {
  //     $scope.closeLogin();
  //   }, 1000);
  // };
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

});
