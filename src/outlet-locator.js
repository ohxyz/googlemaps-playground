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

function initMap() {
    
    var location0 = { lat: -21.38, lng: 133.93 };
    var location1 = { lat: -37.7934059, lng: 144.9471224 };

    var map = new google.maps.Map( document.getElementById('map'), {
      
        zoom: 5,
        center: location0
    });

    var marker0 = new google.maps.Marker( {

        position: location0,
        map: map,
        icon: "marker-oe.png"
    } );

    var marker1 = new google.maps.Marker( {

        position: location1,
        map: map,
        icon: "marker-oe.png"
    } );

}