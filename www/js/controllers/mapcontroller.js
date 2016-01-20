angular.module('starter.controllers').controller('MapCtrl', function($scope,$cordovaGeolocation,$state,$stateParams, Stations) {
  var vm = this;
  vm.stations = Stations.queryAll();

  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){


    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    vm.map =  new google.maps.Map(document.getElementById("map"), mapOptions);

    google.maps.event.addListenerOnce(vm.map, 'idle', function() {

      vm.stations.slice(10).forEach(function(station){
        var location = new google.maps.LatLng(station.latitude, station.longitude);

        var marker = new google.maps.Marker({
          map: vm.map,
          animation: google.maps.Animation.DROP,
          position: location
        });


        var infoWindow = new google.maps.InfoWindow({
          content: station.name +"("+station.lines+")"
        });

        google.maps.event.addListener(marker, 'click', function(){
          $state.go('tab.map.station', {stationId: station.id, role:$stateParams.role})
        })

      })

    })

  }, function(error){
    console.log("Could not get location");
  });
})