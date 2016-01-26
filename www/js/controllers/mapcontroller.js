angular.module('starter.controllers').controller('MapCtrl', function($scope,$cordovaGeolocation,$state, stationService, kardmaExchangeService, SwiperSwipeeRoleService) {
  var vm = this;
  vm.role = SwiperSwipeeRoleService.getCurrentRole();

  stationService.getAll().then(function(stationsFromService) {
    vm.stations = stationsFromService;
  })

  kardmaExchangeService.getAll().then(function(exchangesFromService) {
    kardmaExchangeService.setAllExchanges(exchangesFromService);
    vm.allPendingExchanges = kardmaExchangeService.getAllPendingExchanges();
    //need to make sure that this is resolved before moving on to next steps!!
  });

  console.log(vm.allPendingExchanges);



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
        var pinColor = "FE7569";

        //loop thru all exchanges.  If there's a pending exchange at station that is awaiting current role, change pin color
        // for (var i = 0; i < vm.allPendingExchanges.length; i++) {
        //   var roleNeeded = vm.allPendingExchanges[i].swiper_id == null ? "swiper" : "swipee";

        //   if (vm.allPendingExchanges[i].station_id == station.id && roleNeeded == vm.role) {
        //     var pinColor = "FFFF00";
        //     return;
        //   }
        // }

        var location = new google.maps.LatLng(station.latitude, station.longitude);

        var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
          new google.maps.Size(21, 34),
          new google.maps.Point(0,0),
          new google.maps.Point(10, 34));

        var marker = new google.maps.Marker({
          map: vm.map,
          animation: google.maps.Animation.DROP,
          position: location,
          icon: pinImage
        });

        var infoWindow = new google.maps.InfoWindow({
          content: station.name +"("+station.lines+")"
        });

        google.maps.event.addListener(marker, 'click', function(){
          $state.go('tab.map.station', {stationId: station.id})
        })

      })

    })

  }, function(error){
    console.log("Could not get location");
  });
})