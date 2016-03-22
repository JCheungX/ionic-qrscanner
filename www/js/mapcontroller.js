angular.module('map.controller',[])

.factory('Initializer', function($window, $q) {
  // maps loader deferred object
  var mapsDefer = $q.defer();
  console.log('initialized Gmap')
  // Google's url for async maps initialization accepting callback function
  var asyncUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAmI2fzx6riKLbgeFlIBvbaXrttPrZrqVI&libraries=places&callback=';

  // async loader
  var asyncLoad = function(asyncUrl, callbackName) {
    var script = document.createElement('script');
    //script.type = 'text/javascript';
    script.src = asyncUrl + callbackName;
    document.body.appendChild(script);
  };

  // callback function - resolving promise after maps successfully loaded
  $window.googleMapsInitialized = function() {
    mapsDefer.resolve();
    console.log('done loading Google Map');
  };

  // loading google maps
  asyncLoad(asyncUrl, 'googleMapsInitialized');

  return {
    // usage: Initializer.mapsInitialized.then(callback)
    mapsInitialized: mapsDefer.promise
  };
})

.controller('MapController', function($scope, Map, Initializer, $compile) {
  console.log('setup')
  $scope.currnetcenter =  { lat: 37.764115, lng: -122.435280 };
  /**
   * Promise to wait for Google API to initialize
   */
  Initializer.mapsInitialized
    .then(function() {
      //setup map to center of SF.
      Map.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.764115, lng: -122.435280 },
        zoom: 12
      });

      //Create Singleton InfoWindow
      Map.infoWindow = new google.maps.InfoWindow();

      //Load all Item form DB
      $scope.setMarker();

    });

  /**
   * @param {object} item object
   * @param {integer} timeout to delay the bin drop time animation
   */
  $scope.setMarker = function() {

      //create a new instance of a google maps marker, will be created for each item in our db
      var marker = new google.maps.Marker({
        position: $scope.currnetcenter ,
        map: Map.map,
        title: 'Test'
      });

      //push marker to Map Factory marker array for removing purpose.
      Map.markers.push(marker);

      //creates a listener that will attach this instance's data to the global info window and open it
      google.maps.event.addListener(marker, 'click', function(marker) {
        //turn our mongo-stored stringified date into a JS date obj that is then formatted
        if (Map.infoWindow.anchor !== this){
          //create an angular element info window
          var content = '<div><div> Test Data</div><br>';
            content += '<img src=https://upload.wikimedia.org/wikipedia/commons/8/8f/Qr-2.png />';
          content += '<br><button id="testbutton" type="button" >delete</button><div>';
          var ele = angular.element(content);

          //compile to add the info window to the current scope
          $compile(ele)($scope);

          Map.infoWindow.setContent(ele[0]);
          Map.infoWindow.open(Map.map, this);
        }
       else{
          Map.infoWindow.close();
        }
      });
  };

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
