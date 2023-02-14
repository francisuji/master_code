// MyCode File Javascript
$Google_Key="AIzaSyA-8CTDisLXo_SLzKRQMv7ds4porl_cq9Q";
//OpenWeatherMaps Key
$key ="8c8a482f0c519bcc56bf79715ea71154";
$service_url = "https://api.openweathermap.org/data/2.5/find?";

var currentStation;
var stations;

$( document ).on( "click", "#refresh", function(event) {
    //Prevent Event
    event.preventDefault();
    
    showLoading();
    //Get Current Location from Google API
    $.post("https://www.googleapis.com/geolocation/v1/geolocate?key="+$Google_Key, 
        function(success) {
            PopulateList(success.location.lat,success.location.lng);
        }); 
});

function PopulateList($lat, $lon) {
    url = $service_url+'appid='+$key+'&lat='+$lat+'&lon='+$lon+"&cnt=20&units=metric";
    $.getJSON(url,
            function(data) {
                console.log(url);
                console.log(data);
                stations = data.list;
                //Remove previous stations 
                $('#stations_list li').remove();
                //Add new stations to the list
                $.each(stations, function (index, station) {
                    $('#stations_list').append('<li><a id="to_details" href="#">'+station.name+'<span id="'+index+'" class="ui-li-count">'+station.main.temp+'º</span></a></li>');
                });
                //Refresh the list content
                $('#stations_list').listview('refresh');
                $.mobile.loading( "hide" );
            });
} 

//Prepare Navigation

$( document ).on( "pagebeforeshow", "#home", function() {
    $( document ).on( "click", "#to_details", function(e) {
        //Prevent Event
        e.preventDefault();
        e.stopImmediatePropagation();
        
        currentStation = stations[e.target.children[0].id];
        
        $.mobile.changePage("#details");
    });
    
});

$( document ).on( "pagebeforeshow", "#details", function(e) {
    
    //Prevent Event
    e.preventDefault();
    console.log(currentStation);
    $('#stationName').text(currentStation.name);
    $('#stationIcon').attr('src','https://openweathermap.org/img/w/'+currentStation.weather[0].icon+'.png');
    $('#stationName').text(currentStation.name);
    $('#stationDescription').text(currentStation.weather[0].description);
    $('#stationTemp').text('Temperature: '+currentStation.main.temp+' º');
    $('#stationHumidity').text('Humidity: '+currentStation.main.humidity+' %');
    $('#stationPressure').text('Pressure: '+currentStation.main.pressure+' hpa');

    
});

// LOADING ICON
function showLoading() {
    $.mobile.loading( "show", {
      text: "Loading...",
      textVisible: true,
      theme: "c",
      html: ""
    });
    
}