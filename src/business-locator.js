/* 
 * Origin LPG business locator
 * Requires IE9+
 * 
 * @requires jQuery
 *
 */

/* START: businessLocator module */

if ( window.businessLocator === undefined ) {

    window.businessLocator = {};
}

/*
 * Module ------- ui ( module ) ------- component( module )
 *           |                     |
 *           |                      --- dom ( module )
 *           |                     |
 *           |                      --- map ( module )
 *           |                     |
 *           |                      --- init ( method )
 *           |
 *           |
 *            --- compute ( module )
 *
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

    ui.locations = [];

    ui.component = {};

    /*
     * Pagination component, can be an independent UI component
     * 
     * @requires jQuery
     */
    ui.component.pagination = ( function ( $ ) {

        function $createPagination( options ) {

            var settings = $.extend( {

                numOfItemsInTotal: 0,

                numOfItemsPerPage: 10,

                numOfPagesInPageGroup: 11,

                disabledClassName: 'disabled',

                activeClassName: 'active',

                pageNumberClassName: 'page-number',

                onNumberClick: function() {}

            }, options );

            var currentPage = 1;
            var currentPageGroup = 1;
            var numOfPagesInTotal = Math.ceil( settings.numOfItemsInTotal / settings.numOfItemsPerPage );
            var numOfPageGroupsInTotal = Math.ceil( numOfPagesInTotal / settings.numOfPagesInPageGroup );

            var $containerUl = null;
            var $prevLi = null;
            var $nextLi = null;
            var $prevNLi = null;
            var $nextNLi = null;

            var $firstPageNumberLi = null;
            var $pageNumberLi = null;
            var pageNumberLis = [];

            var propName = 'pageNumber';

            init( currentPage );

            function init( pageGroupNumber ) {

                var pageNumer = ( pageGroupNumber - 1 ) * settings.numOfPagesInPageGroup + 1;

                renderPagination( pageGroupNumber );
                settings.onNumberClick( pageNumer )

                setActive( $firstPageNumberLi );
                setDisabled();
            }


            function reRenderPagination( pageGroupNumber, activePageNumber ) {

                var $containerParent = $containerUl.parent();

                renderPagination( pageGroupNumber, activePageNumber );
                $containerParent.append( $containerUl );
            }


            /*
             *
             * @param { number } - activePageNumber is from 1 to settings.numOfPagesInPageGroup
             */
            function renderPagination( pageGroupNumber, activePageNumber ) {

                if ( $containerUl !== null && $containerUl.length >= 1 ) {

                    $containerUl.remove();
                }

                var activePageNumber = activePageNumber === undefined ? 1 : activePageNumber;

                currentPage = ( pageGroupNumber - 1 ) * settings.numOfPagesInPageGroup + activePageNumber;

                $containerUl = $( '<ul>', { 'class': 'pagination' } );

                $prevLi = $( '<li>', { 'class': 'prev', 'html': '&lt;' } );
                $nextLi = $( '<li>', { 'class': 'next', 'html': '&gt;' } );
                $prevNLi = $( '<li>', { 'class': 'prev-n', 'html': '&lt;&lt;' } );
                $nextNLi = $( '<li>', { 'class': 'next-n', 'html': '&gt;&gt;' } );

                $containerUl.append( $prevNLi, $prevLi );
                renderPageGroup( pageGroupNumber, $containerUl );
                $containerUl.append( $nextLi, $nextNLi );

                $containerUl.on( 'click', function ( event ) {

                    if ( event.target === event.currentTarget ) {

                        return;
                    }

                    var $target = $( event.target );

                    handleClick( $target );

                } );
            }


            function renderPageGroup( pageGroupNumber, $container ) {

                if ( pageGroupNumber < 1 || pageGroupNumber > numOfPageGroupsInTotal ) {

                    return;
                }

                var $pageNumberLi = null;
                var pageNumber = 0;
                var pageGroupIndex = pageGroupNumber - 1;

                for ( var i = 1; i <= settings.numOfPagesInPageGroup; i ++ ) {

                    pageNumber = pageGroupIndex * settings.numOfPagesInPageGroup + i;

                    if ( pageNumber > numOfPagesInTotal ) {

                        return;
                    }

                    $pageNumberLi = $( '<li>', { 'class': settings.pageNumberClassName, 'text': pageNumber } )
                    $pageNumberLi.data( propName, pageNumber );

                    $container.append( $pageNumberLi );
                    pageNumberLis.push( $pageNumberLi );
                }

            }


            function handleClick( $element ) {

                if ( $element.hasClass( settings.pageNumberClassName ) === true ) {

                    currentPage = $element.data( propName );

                    console.log( 'c', currentPage );

                }
                else if( $element.is( $prevLi ) ) {

                    if ( currentPage <= 1 ) {

                        return;
                    }

                    currentPage --;

                    if ( currentPage <= ( currentPageGroup - 1 ) * settings.numOfPagesInPageGroup ) {

                        currentPageGroup --;
                        reRenderPagination( currentPageGroup, settings.numOfPagesInPageGroup );
                    }

                }
                else if ( $element.is( $nextLi ) ) {

                    if ( currentPage >= numOfPagesInTotal ) {

                        return ;
                    }

                    currentPage ++;

                    if ( currentPage > currentPageGroup * settings.numOfPagesInPageGroup ) {

                        currentPageGroup ++;
                        reRenderPagination( currentPageGroup );
                    }
                }
                else if ( $element.is( $prevNLi ) ){

                    if ( currentPageGroup <= 1 ) {

                        return;
                    }

                    currentPageGroup --;

                    reRenderPagination( currentPageGroup );

                }
                else if ( $element.is( $nextNLi ) ) {

                    if ( currentPageGroup >= numOfPageGroupsInTotal ) {

                        return ;
                    }

                    currentPageGroup ++;

                    reRenderPagination( currentPageGroup );

                }


                settings.onNumberClick( currentPage );
                setDisabled();
                setActive();
            }


            function setActive() {

                pageNumberLis.forEach( function( $pageNumberLi ) {

                    if ( $pageNumberLi.data( propName ) === currentPage ) {

                        $pageNumberLi.addClass( settings.activeClassName );
                    }
                    else {

                        $pageNumberLi.removeClass( settings.activeClassName );
                    }

                } );
            }

            function setDisabled() {

                setDisabledBase( currentPage, numOfPagesInTotal, $prevLi, $nextLi );
                setDisabledBase( currentPageGroup, numOfPageGroupsInTotal, $prevNLi, $nextNLi );
            }


            function setDisabledBase( currentPageOrPageGroup,
                                      numOfPagesOrPageGoupsInTotal,
                                      $prevLiOrNLi,
                                      $nextLiOrNLi ) {

                if ( currentPageOrPageGroup === 1 && numOfPagesOrPageGoupsInTotal === 1 ) {

                    $prevLiOrNLi.addClass( settings.disabledClassName );
                    $nextLiOrNLi.addClass( settings.disabledClassName );

                }
                else if ( currentPageOrPageGroup === 1 ) {

                    $prevLiOrNLi.addClass( settings.disabledClassName );
                    $nextLiOrNLi.removeClass( settings.disabledClassName );
                }
                else if ( currentPageOrPageGroup === numOfPagesOrPageGoupsInTotal ) {

                    $nextLiOrNLi.addClass( settings.disabledClassName );
                    $prevLiOrNLi.removeClass( settings.disabledClassName );
                }
                else {

                    $prevLiOrNLi.removeClass( settings.disabledClassName );
                    $nextLiOrNLi.removeClass( settings.disabledClassName );
                }

            }

            return $containerUl;
        }

        return {

            $createPagination: $createPagination
        };

    } )( jQuery );

    
    /* 
     * UI DOM submodule
     *
     */
    ui.dom = ( function () {

        var suburbTextInputId = 'search-by-suburb';
        var stateSelectId = 'search-by-state';
        var postcodeId = 'search-by-postcode';
        var searchButtonId = 'search-business';
        var stateLiterals = [ 'VIC', 'NSW', 'WA', 'SA', 'QLD', 'TAS', 'NT', 'ACT' ];

        var $container = null;
        var $searchResultsDiv = null;
        var map = null;

        function init( $element, googleMap ) {

            $container = $element;
            map = googleMap;
        }


        function $getContainer() {

            return $container;
        }


        function getMap() {

            return map;
        }


        function $buildSearchSection() { 

            var $containerDiv = $( '<div>', { 'id': 'search-section' } );
            var $searchForm = $( '<form>', { 'id': 'search-form' } );

            var $suburbLabel = $( '<label>', { 'for': suburbTextInputId, 'text': 'Suburb' } );
            var $suburbTextInput = $( '<input>', { 'id': suburbTextInputId, 
                                                   'name': suburbTextInputId, 
                                                   'type': 'text' } );

            var $stateLabel = $( '<label>', { 'for': stateSelectId, 'text': 'State' } );
            var $stateSelect = $( '<select>', { 'id': stateSelectId, 'name': stateSelectId } );
            var $selectStateOption = $( '<option>', { 'value': '', 'text': 'Select State' } );


            var $postcodeLabel = $( '<label>', { 'for': postcodeId, 'text': 'Postcode' } );
            var $postcodeTextInput = $( '<input>', { 'id': postcodeId, 
                                                     'type': 'text', 
                                                     'name': postcodeId } );

            var $searchButton = $( '<button>', { 'id': searchButtonId, 
                                                 'name': searchButtonId, 
                                                 'text': 'Search' } );


            $stateSelect.append( $selectStateOption );
            stateLiterals.forEach( function ( stateAbbr ) {

                var $stateOption = $( '<option>', { 'value': stateAbbr, 'text': stateAbbr } );
                $stateSelect.append( $stateOption );

            } );

            $searchForm.on( 'submit', function ( event ) {

                event.preventDefault();

                var searchContent = getSearchContent( $( this ) );
                console.log( 1, searchContent );
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

                numOfItemsPerPage: 10

            }, options );

            var $containerDiv = $( '<div>' );
            var $list = null;

            var onNumberClick = function ( pageNumber ) {

                if ( $list !== null ) {

                    $list.remove();
                }

                var start = ( pageNumber - 1 ) * settings.numOfItemsPerPage;
                var end = pageNumber * settings.numOfItemsPerPage;
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

                numOfItemsInTotal: settings.items.length,

                numOfItemsPerPage: settings.numOfItemsPerPage,

                onNumberClick: onNumberClick

            };

            var $pager = ui.component.pagination.$createPagination( paginationOptions );

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

                var $span = null;
                var spanClassName = '';
                var spanContent = null;
                var returnValue = null;

                if ( typeof prop === 'string' ) {

                    spanClassName = prop;
                    spanContent = object[ prop ];

                    var $span = $( '<span>', { 

                        'class': spanClassName,

                        'html': spanContent

                    } );
                }

                // Only for JSON like object
                else if ( typeof prop === 'object' ) {

                    for ( var key in prop ) {

                        spanClassName= key;
                        spanContent = prop[ key ];

                        $span = $( '<span>', { 'class': spanClassName } ); 

                        if ( typeof spanContent === 'string' ) {

                            $span.html( spanContent );
                        }
                    }
                }
                else if ( typeof prop === 'function' ) {

                    $span = $( '<span>', { 'class': spanClassName } ); 

                    returnValue = prop( object );

                    if ( returnValue instanceof jQuery ) {

                        $span.append( returnValue );

                    }
                }

                $li.append( $span );

            } );

            return $li;
        }


        function $createLocationDetailsImage( item ) {

            var $img = $( '<img>', {

                'class': 'location-details-image',
                'alt': '', 
                'src': 'LocationDetails.png' 
            } );

            $img.on( 'click', function ( event ) { 

                var latLng = {

                    lat: item.Latitude,
                    lng: item.Longitude
                };

                var map = getMap();

                ui.map.zoomIn( map, latLng );

            } );

            return $img;
        }


        function handleGeocodingReponse( response ) {

            var locationInfo = response[ 0 ];
            var address = locationInfo.formatted_address;

            var geoLocation = locationInfo.geometry.location
            var latLng = {

                lat: geoLocation.lat(), 
                lng: geoLocation.lng() 
            };

            compute.sortByDistance( latLng, ui.locations );

            var options = {

                items: ui.locations,

                listItemFields: [ 'LocationTitle', 'Address1', $createLocationDetailsImage ],

                listHeaderContent: { 'LocationTitle': 'Title', 'Address1': 'Address' }
            }

            var $newSearchResultsDiv = $buildListWithPagination( options );

            if ( $searchResultsDiv === null ) {

                $container.append( $newSearchResultsDiv );
            }
            else {

                $searchResultsDiv.replaceWith( $newSearchResultsDiv );
            }
            
            $searchResultsDiv = $newSearchResultsDiv;

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

            init: init,
            $getContainer: $getContainer,
            $buildList: $buildList,
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

        var map = null;
        var markerPath = 'marker-oe.png';
        var uluru = { lat: -25.363, lng: 131.044 };

        var mapDiv = document.createElement( 'div' );
        mapDiv.setAttribute( 'id', 'map' );

        function init( locations ) {

            var googleMap = generateMap( uluru );
            
            map = googleMap;

            populateMarkers( map, locations );

        }

        function getMap() {

            return map;
        }


        function zoomIn( map, latLng ) {

            map.setCenter( latLng );
            map.setZoom( 12 );
        }


        function generateMap( mapCenter) {
            
            var mapOptions = {

                zoom: 4,
                center: mapCenter
            };

            var googleMap = new google.maps.Map( mapDiv, mapOptions );

            return googleMap;
        }

        function createInfoWindow( businessLocation ) {

            var infoWindow = new google.maps.InfoWindow( {

                content: businessLocation[ 'LocationTitle' ]

            } );

            return infoWindow;

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

                    infoWindow = createInfoWindow( businessLocation );
                    infoWindow.open( map, marker );
                } );

            } );
        }

        return {

            init: init,
            createInfoWindow: createInfoWindow,
            getMap: getMap,
            container: mapDiv,
            zoomIn: zoomIn

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
        uiDom.init( $businessLocatorDiv, uiMap.getMap() );

        this.locations = locations;        
        $businessLocatorDiv.append( uiDom.$buildSearchSection(), uiMap.container );
    };


    /*
     * Compute module container
     *
     */
    var compute = ( function () {

        /*
         * Compute module init method
         *
         */
        function init() {


        }

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
        
        ui.init( 'business-locator', businessLocator.locations );
        
    };

    return module;

} )( window.businessLocator, jQuery );

