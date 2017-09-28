/* 
 * Origin LPG business locator 
 * 
 * @requires jQuery
 *
 */
var dummyLocations = [

    {
        "Type": "Vitalgas",
        "LocationTitle": "Caltex Tempora",
        "Address1": "109 Hoskins St",
        "Suburb": "Temora",
        "Postcode": 2666,
        "Latitude": -34.44,
        "Longitude": 147.53,
        "ZoomLevel": 5,
        "PhoneNumber": "02 6977 1265",
        "Archived": 0,
        "CreationDate": "1/4/14 16:16",
        "CountryCode": "AU",
        "StateRegion": "NSW",
        "StateRegionFull": "New South Wales"
    },

    {
        "type": "VitalGas",
        "LocationTitle": "Ti Tree Roadhouse",
        "Address1": "Stuart Highway",
        "Suburb": "Ti Tree",
        "Postcode": "872",
        "Latitude": -21.38,
        "Longitude": 133.93,
        "ZoomLevel": "5",
        "PhoneNumber": "08 8956 9741",
        "Achieved": "0",
        "CreationDate": "AU",
        "StateRegion": "NT",
        "StateRegionFull": "Northern Territory"
    },

    {
        "Type": "Vitalgas",
        "LocationTitle": "Walgett Retail Services",
        "Address1": "21 Fox St",
        "Suburb": "Walgett",
        "Postcode": 2832,
        "Latitude": -30.02,
        "Longitude": 148.12,
        "ZoomLevel": 5,
        "PhoneNumber": "02 6828 1296",
        "Archived": 0,
        "CreationDate": "1/4/14 16:16",
        "CountryCode": "AU",
        "StateRegion": "NSW",
        "StateRegionFull": "New South Wales"
    },

    {
        "Type": "Vitalgas",
        "LocationTitle": "A J Petroleum",
        "Address1": "77 Benalla Rd",
        "Suburb": "Shepparton",
        "Postcode": 3630,
        "Latitude": -36.38,
        "Longitude": 145.42,
        "ZoomLevel": 5,
        "PhoneNumber": "03 58219977",
        "Archived": 0,
        "CreationDate": "1/4/14 16:16",
        "CountryCode": "AU",
        "StateRegion": "VIC",
        "StateRegionFull": "Victoria"
    }

];

function ModuleNotFoundError( moduleName ) {

    this.message = 'Require module: ' + moduleName + '.';
    this.name = 'ModuleNotFound';
}


/* START: businessLocator module */

if ( window.businessLocator === undefined ) {

    window.businessLocator = {};
}


( function ( my, $ ) {

    /* 
     * UI module container 
     * 
     * ui - module ------ dom - submodule
     *               |
     *                --- map - submodule
     *               |
     *                --- build - method
     *
     */
    var ui = {};


    /* 
     * UI DOM submodule
     *
     */
    ui.dom = ( function () {

        var $businessLocatorDiv = $( '#business-locator' );

        function $buildSearchSection() { 

            var $searchSectionDiv = $( '<div>', { 'id': 'search-section' } );

            var suburbTextInputId = 'search-by-suburb';
            var $suburbLabel = $( '<label>', { 'for': suburbTextInputId, 'text': 'Suburb' } );
            var $suburbTextInput = $( '<input>', { 'id': suburbTextInputId, 
                                                   'name': suburbTextInputId, 
                                                   'type': 'text' } );

            var stateSelectId = 'search-by-state';
            var $stateLabel = $( '<label>', { 'for': stateSelectId, 'text': 'State' } );
            var $stateSelect = $( '<select>', { 'id': stateSelectId, 'name': stateSelectId } );
            var stateLiterals = [ 'VIC', 'NSW', 'WA', 'SA', 'QLD', 'TAS', 'NT', 'ACT' ];

            var postcodeId = 'search-by-postcode';
            var $postcodeLabel = $( '<label>', { 'for': postcodeId, 'text': 'Postcode' } );
            var $postcodeTextInput = $( '<input>', { 'id': postcodeId, 
                                                     'type': 'text', 
                                                     'name': postcodeId } );

            var searchButtonId = 'search-business';
            var $searchButton = $( '<button>', { 'id': searchButtonId, 
                                                 'name': searchButtonId, 
                                                 'text': 'Search' } );

            $.each( stateLiterals, function ( index, stateAbbr ) {

                var $stateOption = $( '<option>', { 'value': stateAbbr.toLowerCase(), 'text': stateAbbr } );
                $stateSelect.append( $stateOption );

            } );

            return $searchSectionDiv.append( $suburbLabel, 
                                             $suburbTextInput, 
                                             $stateLabel,
                                             $stateSelect,
                                             $postcodeLabel,
                                             $postcodeTextInput, 
                                             $searchButton );
        }

        return {

            $container: $businessLocatorDiv,
            $buildSearchSection: $buildSearchSection
        };

    } )();


    /* 
     * UI Map submodule - Google Maps APIs related
     *
     */
    ui.map = ( function () {

        var mapDiv = document.createElement( 'div' );

        mapDiv.setAttribute( 'id', 'map' );

        var uluru = { lat: -25.363, lng: 131.044 };


        function generateMap( mapCenter) {
            
            var mapOptions = {

                zoom: 4,
                center: mapCenter
            };

            var map = new google.maps.Map( mapDiv, mapOptions );

            map.addListener( 'bounds_changed', function () {

                map.setCenter( uluru );

            } );

            return map;

        }


        function populateMarkers( map, locations ) {

            var markerPath = 'marker-oe.png';        
            var infoWindow = null;

            $.each( locations, function( index, businessLocation ) {

                var latLng = new google.maps.LatLng( {

                    lat: businessLocation[ 'Latitude' ],
                    lng: businessLocation[ 'Longitude' ]
                } );

                var marker = new google.maps.Marker( {

                    position: latLng,
                    map: map,
                    icon: markerPath

                } );

                marker.addListener( 'click', function () {

                    if ( infoWindow !== null ) {

                        infoWindow.close();
                    }

                    infoWindow = new google.maps.InfoWindow( {

                        content: businessLocation[ 'LocationTitle' ]
                    } );

                    infoWindow.open( map, marker );
                } );

            } );
        }

        function init() {

            var map = generateMap( uluru );
            populateMarkers( map, dummyLocations );

        }

        return {

            container: mapDiv,
            init: init
        };

    } )();


    /* 
     *  Build DOM elements into document
     *
     */
    ui.init = function () {

        var uiDom = ui.dom;
        var uiMap = ui.map;

        uiMap.init();
        uiDom.$container.append( uiDom.$buildSearchSection(), uiMap.container );
    };


    /*
     * Compute module container
     *
     */
    var compute = ( function () {

        /*
         * Calculate distance between two coordinates
         *
         */ 
        function calculateDistance( geoCoords1, geoCoords2 ) {

            var latLng1 = new google.maps.LatLng( geoCoords1 );
            var latLng2 = new google.maps.LatLng( geoCoords2 );

            var distance = google.maps.geometry.spherical.computeDistanceBetween( latLng1, latLng2 );

            return distance;
        };


        /*
         *
         *
         * @todo Handle failed requests
         */
        function getCoords( address, onSuccess ) {

            var geocoder = new google.maps.Geocoder();

            geocoder.geocode( {

                address: address,

                componentRestrictions: {

                    country: 'AU'

                }

            }, function( results, status ) { 

                if ( status === 'OK' ) {

                    onSuccess( results );
                }
                else {

                    console.error( 'Geocoder request failed.' );
                }

            } );

        }

        /*
         * Main in compute module
         *
         */
        function init( ) {

            function handleSuccess( results ) {

                console.log( 1, results, status );

            }

            // Test
            getCoords( 'Melbourne', handleSuccess );

        }


        return {

            calculateDistance: calculateDistance,
            getCoords: getCoords,
            init: init

        };

    } )();


    /*
     * Main
     *
     */
    my.ui = ui;
    my.compute = compute;

    my.init = function () {

        ui.init();
        compute.init();
    };

    return my;

} )( window.businessLocator, jQuery );


