/* 
 * Origin LPG business locator
 * Requires IE9 or above
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

/*
 * Module ------- ui ( module ) ------- dom ( module )
 *           |                     |
 *           |                      --- map ( module )
 *           |                     |
 *           |                      --- init ( method )
 *           |
 *           |
 *            --- compute ( module )
 *
 * @summary UI module is on the top of Compute module
 *          
 */

( function ( module, $ ) {

    /* 
     * UI module container 
     * 
     */
    var ui = {};

    /* 
     * UI DOM submodule
     *
     */
    ui.locations = [];

    ui.dom = ( function () {

        var suburbTextInputId = 'search-by-suburb';
        var stateSelectId = 'search-by-state';
        var postcodeId = 'search-by-postcode';

        function $buildSearchSection() { 

            var $containerDiv = $( '<div>', { 'id': 'search-section' } );
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

            return $containerDiv.append( $searchForm );
        }


        function $buildListWithPagination( options ) {

            var settings = $.extend( {

                items: [],

                listItemClassName: 'list-item',

                listHeaderClassName: 'list-header',

                listItemFields: [],

                listHeaderContent: {},

                numberPerPage: 5

            }, options );

            var $containerDiv = $( '<div>' );
            var $list = null;

            var onUpdate = function ( pageNumber ) {

                if ( $list !== null ) {

                    $list.remove();
                }

                var start = ( pageNumber - 1 ) * settings.numberPerPage;
                var end = pageNumber * settings.numberPerPage;
                var items = settings.items.slice( start, end );

                var listOptions = {

                    items: items,

                    listItemFields: settings.listItemFields,

                    listHeaderContent: settings.listHeaderContent,

                };

                $list = $buildList( listOptions );
                $containerDiv.prepend( $list );

            }

            var paginationOptions = {

                numberInTotal: settings.items.length,

                numberPerPage: settings.numberPerPage,

                onUpdate: onUpdate

            };

            var $pager = $buildPagination( paginationOptions );

            onUpdate( 1 );

            return $containerDiv.append( $pager );

        }


        function $buildListHeader( options ) {

            var settings = $.extend( {

                className: 'list-header',

                fields: [],

                content: {}

            }, options );

            var $listHeaderLi = $( '<li>', { 'class': settings.className } );

            settings.fields.forEach( function ( fieldName ) {

                var $span = $( '<span>', {

                    'class': fieldName,

                    'text': settings.content[ fieldName ]

                } );

                $listHeaderLi.append( $span );

            } );

            return $listHeaderLi;

        }

        function $buildList( options ) {

            var settings = $.extend( {

                items: [],

                listItemClassName: 'list-item',

                listItemFields: [],

                listHeaderContent: {}

            }, options );

            var $containerUl = $( '<ul>', { 'class': 'list' } );

            var $listHeaderLi = $buildListHeader( {

                fields: settings.listItemFields, 

                content: settings.listHeaderContent 
                
            } );

            $containerUl.append( $listHeaderLi );

            settings.items.forEach( function ( item ) {

                $listItem = $buildListItem( settings.listItemFields, item );

                $containerUl.append( $listItem.addClass( settings.listItemClassName ) );

            } );

            return $containerUl;
            
        }


        function $buildListItem( props, object ) {

            var $li = $( '<li>' );

            props.forEach( function ( prop ) {

                var $span = $( '<span>', { 

                    'class': prop,

                    'text': object[ prop ]

                } );

                $li.append( $span );

            } );

            return $li;
        }


        function $buildPagination( options ) {

            var settings = $.extend( {

                numberInTotal: 0,

                numberPerPage: 5,

                disabledClassName: 'disabled',

                onUpdate: function() {}

            }, options );

            var currentPage = 1;
            var totalPages = Math.ceil( settings.numberInTotal / settings.numberPerPage );

            var $containerUl = $( '<ul>', { 'class': 'pagination' } );

            var $prevLi = $( '<li>', { 'class': 'prev', 'html': '&lt;' } );
            var $nextLi = $( '<li>', { 'class': 'next', 'html': '&gt;' } );
            var $prevNLi = $( '<li>', { 'class': 'prev-n', 'html': '&lt;&lt;' } );
            var $nextNLi = $( '<li>', { 'class': 'next-n', 'html': '&gt;&gt;' } );
            var $pageLi;

            $containerUl.append( $prevLi, $prevNLi);

            var propName = 'pageNumber';

            for ( var i = 1; i <= totalPages; i ++ ) {

                $pageLi = $( '<li>', { 'class': 'page', 'text': i } ).data( propName, i );

                $containerUl.append( $pageLi );
            }

            $containerUl.on( 'click', function ( event ) { 

                var $target = $( event.target );

                console.log( 1, $target );

                var pageNumber = $target.data( propName );

                currentPage = pageNumber;

                setDisabled();

                settings.onUpdate( pageNumber );

            } );

            function setDisabled() {

                if ( currentPage === 1 ) {

                    $prevLi.addClass( settings.disabledClassName );
                    $nextLi.removeClass( settings.disabledClassName );

                }
                else if ( currentPage === totalPages ) {

                    $nextLi.addClass( settings.disabledClassName );
                    $prevLi.removeClass( settings.disabledClassName );
                }
                else {

                    $prevLi.removeClass( settings.disabledClassName );
                    $nextLi.removeClass( settings.disabledClassName );
                }

            }

            setDisabled();

            return $containerUl.append( $nextNLi, $nextLi );

        }


        function handleGeocodingReponse( response ) {

            var locationInfo = response[ 0 ];
            var address = locationInfo.formatted_address;

            var geoLocation = locationInfo.geometry.location
            var latLng = {

                lat: geoLocation.lat(), 
                lng: geoLocation.lng() 
            } ;

            compute.sortByDistance( latLng, ui.locations );
            $buildSearchResultsSection( ui.locations );

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

            $buildList: $buildList,
            $buildPagination: $buildPagination,
            $buildListWithPagination: $buildListWithPagination,
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
        var uluru = { lat: -25.363, lng: 131.044 };

        var mapDiv = document.createElement( 'div' );
        mapDiv.setAttribute( 'id', 'map' );


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

        this.locations = locations;        
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
         * Compute module init method
         *
         */
        function init() {


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
    module.ui = ui;
    module.compute = compute;

    module.init = function () {
        
        ui.init( 'business-locator', dummyLocations );
        compute.init();
    };

    return module;

} )( window.businessLocator, jQuery );


