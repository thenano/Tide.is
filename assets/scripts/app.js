$(function () {
	function showTide(position) {
    $.ajax({
      url: 'https://tide-api.herokuapp.com/' + 
        position.coords.latitude.toFixed(2) + 'N/' + 
        position.coords.longitude.toFixed(2) + 'E'
    }).done(function(result) {
      $("#loading").hide();
      $("#content").show();

      $('#time').html(moment().format('HH:mm - DD MMM YYYY'));

      if (result.tides.length) {
        var tides = "";
        result.tides.forEach(function (tide) {
          tides += tide.type.substring(0, 1).toUpperCase() + tide.type.substring(1) + '\t' + moment(tide.time, 'h:mm a').format('HH\\hmm') + '\t' + tide.height.replace('+', '') + 'm\n';
        });
      } else {
        var tides = "Sorry, your location is not near a known tide station";
      }
      $('#tide').html(tides);
      
      if (result.station) {
        $('#stationWrapper').show();
        $('#station').html(result.station.location + ' - ' + result.station.distance + ' away');
      }
    });
  }

  function showError(error) {
    $("#loading").hide();
    $("#content").show();
      
    switch(error.code) {
      case error.PERMISSION_DENIED:
        $('#tide').html('User denied the request for Geolocation.');
        break;
      case error.POSITION_UNAVAILABLE:
        $('#tide').html('Location information is unavailable.');
        break;
      case error.TIMEOUT:
        $('#tide').html('The request to get user location timed out.');
        break;
      case error.UNKNOWN_ERROR:
        $('#tide').html('An unknown error occurred.');
        break;
    }
  }

  navigator.geolocation.getCurrentPosition(showTide, showError);
});