/* 
 * Origin LPG business locator
 * Requires IE9 and above
 * 
 * @requires jQuery
 *
 */

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
     * ui - module ------- dom - submodule
     *                |
     *                 --- map - submodule
     *                |
     *                 --- init - method
     *
     */
    var ui = {};


    /* 
     * UI DOM submodule
     *
     */
    ui.dom = ( function () {

        var suburbTextInputId = 'search-by-suburb';
        var stateSelectId = 'search-by-state';
        var postcodeId = 'search-by-postcode';

        function $buildSearchSection() { 

            var $searchSectionDiv = $( '<div>', { 'id': 'search-section' } );
            var $searchForm = $( '<form>', { 'id': 'search-form' } );

            var $suburbLabel = $( '<label>', { 'for': suburbTextInputId, 'text': 'Suburb' } );
            var $suburbTextInput = $( '<input>', { 'id': suburbTextInputId, 
                                                   'name': suburbTextInputId, 
                                                   'type': 'text' } );

            var $stateLabel = $( '<label>', { 'for': stateSelectId, 'text': 'State' } );
            var $stateSelect = $( '<select>', { 'id': stateSelectId, 'name': stateSelectId } );
            var stateLiterals = [ 'VIC', 'NSW', 'WA', 'SA', 'QLD', 'TAS', 'NT', 'ACT' ];


            var $postcodeLabel = $( '<label>', { 'for': postcodeId, 'text': 'Postcode' } );
            var $postcodeTextInput = $( '<input>', { 'id': postcodeId, 
                                                     'type': 'text', 
                                                     'name': postcodeId } );

            var searchButtonId = 'search-business';
            var $searchButton = $( '<button>', { 'id': searchButtonId, 
                                                 'name': searchButtonId, 
                                                 'text': 'Search' } );

            stateLiterals.forEach( function ( stateAbbr ) {

                var $stateOption = $( '<option>', { 'value': stateAbbr, 'text': stateAbbr } );
                $stateSelect.append( $stateOption );

            } );

            $searchForm.on( 'submit', function ( event ) {

                event.preventDefault();

                var searchContent = getSearchContent( $( this ) );
                var coords = compute.getCoords( searchContent, handleGeocodingReponse );
                
            } );

            $searchForm.append( $suburbLabel, 
                                $suburbTextInput, 
                                $stateLabel,
                                $stateSelect,
                                $postcodeLabel,
                                $postcodeTextInput, 
                                $searchButton );

            return $searchSectionDiv.append( $searchForm );
        }

        function handleGeocodingReponse( response ) {

            var geoLocation = response[ 0 ];
            var address = geoLocation.formatted_address;
            var latLng = geoLocation.geometry.location;

            console.log( 9, geoLocation.formatted_address );
        }


        function getSearchContent( $form ) {

            var formNamesValues = $form.serializeArray();

            var suburbContent = '';
            var stateContent = '';
            var postcodeContent = '';

            formNamesValues.forEach( function( nameValue ) {

                if ( nameValue.name === suburbTextInputId ) {

                    suburbContent = nameValue.value.trim();
                }
                else if ( nameValue.name === stateSelectId ) {

                    stateContent = nameValue.value.trim();
                }
                else if ( nameValue.name === postcodeId ) {

                    postcodeContent = nameValue.value.trim();
                }

            } );

            return ( suburbContent + ' ' + stateContent + ' ' + postcodeContent ).trim();

        }


        return {

            $buildSearchSection: $buildSearchSection,
            getSearchContent: getSearchContent
        };

    } )();


    /* 
     * UI Map submodule - Google Maps APIs related
     *
     */
    ui.map = ( function () {

        var markerPath = 'marker-oe.png';   
        var mapDiv = document.createElement( 'div' );

        mapDiv.setAttribute( 'id', 'map' );

        var uluru = { lat: -25.363, lng: 131.044 };

        function generateMap( mapCenter) {
            
            var mapOptions = {

                zoom: 4,
                center: mapCenter
            };

            var map = new google.maps.Map( mapDiv, mapOptions );

            return map;

        }


        function populateMarkers( map, locations ) {
     
            var infoWindow = null;

            locations.forEach( function( businessLocation ) {

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


        function init( locations ) {

            var map = generateMap( uluru );
            populateMarkers( map, locations );

        }

        return {

            container: mapDiv,
            init: init
        };

    } )();


    /* 
     *  Build DOM elements into document
     *
     *  @param { string } elementId
     */
    ui.init = function ( elementId, locations ) {

        var uiDom = ui.dom;
        var uiMap = ui.map;

        var $businessLocatorDiv = $( '#' + elementId );
        uiMap.init( locations );
        
        $businessLocatorDiv.append( uiDom.$buildSearchSection(), uiMap.container );
    };


    /*
     * Compute module container
     *
     */
    var compute = ( function () {

        /*
         * Calculate distance between two coordinates
         * 
         * @param geoCoords1 - eg. { lat: -37.807977, lng: 144.969106 }
         * @return - Direct distance NOT walking, driving or fly distances.
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
         * 
         *
         * @param { Object } coords - eg. { lat: 12, lng: 34 }
         */
        function sortByDistance( coords, locations ) {

            locations.sort( function( location1, location2 ) { 

                var latLng1 = { lat: location1[ 'Latitude'], lng: location1[ 'Longitude'] };
                var latLng2 = { lat: location2[ 'Latitude'], lng: location2[ 'Longitude'] };

                var distance1 = calculateDistance( coords, latLng1  );
                var distance2 = calculateDistance( coords, latLng2  );

                return distance1 - distance2;

            } );

        }

        /*
         * Main in compute module
         *
         */
        function init() {

            function handleSuccess( results ) {

                // console.log( 1, results, status );

            }

            // Test
            // getCoords( 'Melbourne', handleSuccess );

        }

        return {

            calculateDistance: calculateDistance,
            sortByDistance: sortByDistance,
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

        ui.init( 'business-locator', dummyLocations );
        compute.init();
    };

    return my;

} )( window.businessLocator, jQuery );


