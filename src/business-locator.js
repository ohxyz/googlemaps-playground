/* Outlet locator */

var locations = [

    {
        "type": "VitalGas",
        "LocationTitle:": "Ti Tree Roadhouse",
        "Address1": "Stuart Highway",
        "Suburb": "Ti Tree",
        "Postcode": "872",
        "Latitude": "-21.38",
        "Longtitude": "133.93",
        "ZoomLevel": "5",
        "PhoneNumber": "08 8956 9741",
        "Achieved": "0",
        "CreationDate": "AU",
        "StateRegion": "NT",
        "StateRegionFull": "Northern Territory"
    },

    {
        "LocationTitle": "Avbar Pty Ltd - North Melbourne",
        "Address1": "Cnr Abbotsford & Flemington Rds",
        "Latitude": "-37.7934059",
        "Longtitude": "144.9471224"
    }

];


var geoCoords1 = { lat: -21.38, lng: 133.93 };
var geoCoords2 = { lat: -37.7934059, lng: 144.9471224 };


function initMap() {

    var map = new google.maps.Map( document.getElementById('map'), {
      
        zoom: 5,
        center: geoCoords1
    });

    var marker0 = new google.maps.Marker( {

        position: geoCoords1,
        map: map,
        icon: "marker-oe.png"
    } );

    var marker1 = new google.maps.Marker( {

        position: geoCoords2,
        map: map,
        icon: "marker-oe.png"
    } );


    function calculateDistance( geoCoords1, geoCoords2 ) {

        var latLng1 = new google.maps.LatLng( geoCoords1 );
        var latLng2 = new google.maps.LatLng( geoCoords2 );

        var distance = google.maps.geometry.spherical.computeDistanceBetween( latLng1, latLng2 );

        return distance;
    }

    var dist = calculateDistance( geoCoords1, geoCoords2 );
    console.log( 'x', dist );
}

