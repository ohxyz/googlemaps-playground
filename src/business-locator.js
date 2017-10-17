/* Origin LPG business locator
 * Requires IE9+
 * 
 * @requires jQuery
 * @author Busheng Xi <busheng.xi@originenergy.com.au>
 *
 */

/* START: businessLocator module */
window.businessLocator = window.businessLocator === undefined
                       ? {}
                       : window.businessLocator;

/* Module ---+--- ui ( module ) ---+--- component( module )
 *           |                     |
 *           |                     +--- dom ( module )
 *           |                     |
 *           |                     +--- map ( module )
 *           |
 *           +--- util (module )
 *           |
 *           +--- compute ( module )
 *
 *
 *            ui.dom <- ui.component
 *              |
 *            ui.map
 *              |
 *            compute
 *
 *
 * @summary - UI module is on the top of Compute module
 *
 *            DOM ready => Load Google APIs script => Load search form and map 
 *          
 */

( function ( module, $ ) {

    var conf = {

        googleApiKey: 'AIzaSyAKsr_E9y7YQPuN2dwL48GxLB72iEkYxKY',

        locationDetailsImage: '/content/dam/projects/lpg/location-details.png',

        mapMarkerImage: '/content/dam/projects/lpg/marker.png'

    };

    var currentScript = document.currentScript;

    var isGoolgeScriptLoaded = false;


    /* Load Google Maps API script into HTML page.
     *
     */
    function loadGoogleApis() {

        var callbackName = 'businessLocator.init';
        var src = 'https://maps.googleapis.com/maps/api/js?key=' 
            + conf.googleApiKey 
            + '&libraries=geometry&callback='
            + callbackName;

        $.getScript( src )
            .done( function () {

                isGoolgeScriptLoaded = true;

            } )
            .fail( function ( jqxhr, settings, exception ) {

                console.error( '[ERROR]', 'Failed to load Google Maps APIs.' );

            } );

    }

    function isGoolgeApisReady() {

        return isGoolgeScriptLoaded;
    }


    function BusinessLocationsEmptyError () {

        this.name = 'BusinessLocationsEmptyError';
        this.message = '[WARN] ' + 'Business locations are empty.';
    }


    /* Util module
     *
     */
    var util = {

        hyphenateCamels: function ( word ) {

            // https://gist.github.com/youssman/745578062609e8acac9f
            return word.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
        },

        getFullAddress: function ( businessLocation, seperator ) {

            var sep = seperator === undefined ? ' ' : seperator;

            return [ businessLocation.Address1, businessLocation.Suburb, businessLocation.Postcode ].join( sep );
        }

    };


    /* UI module container 
     * 
     */
    var ui = {};

    ui.resources = {

        images: {

            locationDetails: conf.locationDetailsImage,
            mapMarker: conf.mapMarkerImage
        }
    }

    /*
     * Each item in this array, is a `businessLocation` object
     * `businessLocation` is used as the name of arguments in various functions.
     *
     */
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

                numOfPagesInPageGroup: 10,

                disabledClassName: 'disabled',

                activeClassName: 'active',

                pageNumberClassName: 'page-number',

                onPageNumberClick: function() {}

            }, options );

            var currentPage = 1;
            var currentPageGroup = 1;
            var numOfPagesInTotal = Math.ceil( settings.numOfItemsInTotal / settings.numOfItemsPerPage );
            var numOfPageGroupsInTotal = Math.ceil( numOfPagesInTotal / settings.numOfPagesInPageGroup );

            var $containerDiv = null;
            var $prevSpan = null;
            var $nextSpan = null;
            var $prevGroupSpan = null;
            var $nextGroupSpan = null;

            var $firstPageNumberLi = null;
            var pageNumberLis = [];

            var propName = 'pageNumber';

            init( currentPage );

            function init( pageGroupNumber ) {

                var pageNumer = ( pageGroupNumber - 1 ) * settings.numOfPagesInPageGroup + 1;

                renderPagination( pageGroupNumber );
                settings.onPageNumberClick( pageNumer )

                setActive( $firstPageNumberLi );
                setDisabled();
            }


            function reRenderPagination( pageGroupNumber, activePageNumber ) {

                var $containerParent = $containerDiv.parent();

                renderPagination( pageGroupNumber, activePageNumber );
                $containerParent.append( $containerDiv );
            }


            /*
             *
             * @param { number } - activePageNumber is from 1 to settings.numOfPagesInPageGroup
             */
            function renderPagination( pageGroupNumber, activePageNumber ) {

                if ( $containerDiv !== null && $containerDiv.length >= 1 ) {

                    $containerDiv.remove();
                }

                var activePageNumber = activePageNumber === undefined ? 1 : activePageNumber;

                currentPage = ( pageGroupNumber - 1 ) * settings.numOfPagesInPageGroup + activePageNumber;

                $containerDiv = $( '<div>', { 'class': 'pagination' } );

                $prevSpan = $( '<span>', { 'class': 'prev', 'html': '&lt;' } );
                $nextSpan = $( '<span>', { 'class': 'next', 'html': '&gt;' } );
                $prevGroupSpan = $( '<span>', { 'class': 'prev-n', 'html': '&lt;&lt;' } );
                $nextGroupSpan = $( '<span>', { 'class': 'next-n', 'html': '&gt;&gt;' } );

                $containerDiv.append( $prevGroupSpan, $prevSpan );
                renderPageGroup( pageGroupNumber, $containerDiv );
                $containerDiv.append( $nextSpan, $nextGroupSpan );

                $containerDiv.on( 'click', function ( event ) {

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

                    $pageNumberLi = $( '<span>', { 'class': settings.pageNumberClassName, 'text': pageNumber } )
                    $pageNumberLi.data( propName, pageNumber );

                    $container.append( $pageNumberLi );
                    pageNumberLis.push( $pageNumberLi );
                }

            }


            function handleClick( $element ) {

                if ( $element.hasClass( settings.pageNumberClassName ) === true ) {

                    currentPage = $element.data( propName );

                }
                else if( $element.is( $prevSpan ) ) {

                    if ( currentPage <= 1 ) {

                        return;
                    }

                    currentPage --;

                    if ( currentPage <= ( currentPageGroup - 1 ) * settings.numOfPagesInPageGroup ) {

                        currentPageGroup --;
                        reRenderPagination( currentPageGroup, settings.numOfPagesInPageGroup );
                    }

                }
                else if ( $element.is( $nextSpan ) ) {

                    if ( currentPage >= numOfPagesInTotal ) {

                        return ;
                    }

                    currentPage ++;

                    if ( currentPage > currentPageGroup * settings.numOfPagesInPageGroup ) {

                        currentPageGroup ++;
                        reRenderPagination( currentPageGroup );
                    }
                }
                else if ( $element.is( $prevGroupSpan ) ){

                    if ( currentPageGroup <= 1 ) {

                        return;
                    }

                    currentPageGroup --;

                    reRenderPagination( currentPageGroup );

                }
                else if ( $element.is( $nextGroupSpan ) ) {

                    if ( currentPageGroup >= numOfPageGroupsInTotal ) {

                        return ;
                    }

                    currentPageGroup ++;

                    reRenderPagination( currentPageGroup );

                }

                settings.onPageNumberClick( currentPage );
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

                setDisabledBase( currentPage, numOfPagesInTotal, $prevSpan, $nextSpan );
                setDisabledBase( currentPageGroup, numOfPageGroupsInTotal, $prevGroupSpan, $nextGroupSpan );
            }


            function setDisabledBase( currentPageOrPageGroup,
                                      numOfPagesOrPageGoupsInTotal,
                                      $prevSpanOrGroupSpan,
                                      $nextSpanOrGroupSpan ) {

                if ( currentPageOrPageGroup === 1 && numOfPagesOrPageGoupsInTotal === 1 ) {

                    $prevSpanOrGroupSpan.addClass( settings.disabledClassName );
                    $nextSpanOrGroupSpan.addClass( settings.disabledClassName );
                }
                else if ( currentPageOrPageGroup === 1 ) {

                    $prevSpanOrGroupSpan.addClass( settings.disabledClassName );
                    $nextSpanOrGroupSpan.removeClass( settings.disabledClassName );
                }
                else if ( currentPageOrPageGroup === numOfPagesOrPageGoupsInTotal ) {

                    $nextSpanOrGroupSpan.addClass( settings.disabledClassName );
                    $prevSpanOrGroupSpan.removeClass( settings.disabledClassName );
                }
                else {

                    $prevSpanOrGroupSpan.removeClass( settings.disabledClassName );
                    $nextSpanOrGroupSpan.removeClass( settings.disabledClassName );
                }

            }

            return $containerDiv;
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
            var $formRow1 = $( '<div>', { 'class': 'form-row' } );
            var $formRow2 = $formRow1.clone();
            var $formRow3 = $formRow1.clone();

            var $suburbLabel = $( '<label>', {

                'id': suburbTextInputId + '-label',
                'for': suburbTextInputId, 
                'text': 'Suburb' 
            } );

            var $suburbTextInput = $( '<input>', {

                'id': suburbTextInputId, 
                'name': suburbTextInputId, 
                'type': 'text' 
            } );

            var $stateLabel = $( '<label>', { 

                'id': stateSelectId + '-label',
                'for': stateSelectId, 
                'text': 'State'
            } );

            var $stateSelect = $( '<select>', { 

                'id': stateSelectId, 
                'name': stateSelectId
            } );

            var $selectStateOption = $( '<option>', { 

                'value': '', 
                'text': 'Select State' 
            } );

            var $postcodeLabel = $( '<label>', { 

                'id': postcodeId + '-label',
                'for': postcodeId, 
                'text': 'Postcode' 
            } );

            var $postcodeTextInput = $( '<input>', {

                'id': postcodeId, 
                'type': 'text', 
                'name': postcodeId
            } );

            var $searchButton = $( '<button>', { 

                'id': searchButtonId, 
                'name': searchButtonId, 
                'text': 'Search' 
            } );

            var $errorMessageDiv = $( '<div>', { 'class': 'error-message' } );

            $stateSelect.append( $selectStateOption );
            stateLiterals.forEach( function ( stateAbbr ) {

                var $stateOption = $( '<option>', { 'value': stateAbbr, 'text': stateAbbr } );
                $stateSelect.append( $stateOption );

            } );

            $searchForm.on( 'submit', function ( event ) {

                event.preventDefault();

                var suburb = $suburbTextInput.val().trim();
                var state = $stateSelect.val();
                var postcode = $postcodeTextInput.val().trim();

                if ( suburb === '' && state === '' && postcode === '' ) {
                    
                    $errorMessageDiv.text( 'Please fill at least one field.' )
                                    .insertBefore( $searchButton );
                    return;
                }
                else if ( postcode !== '' && /^[0-9]{4}$/.test( postcode ) === false ) {

                    $errorMessageDiv.text( 'Postcode must be 4 digits.' )
                                    .insertBefore( $searchButton );

                    return;
                }
                else {

                    $errorMessageDiv.remove();
                }

                var searchContent = getSearchContent( $( this ) );
                var coords = compute.getCoords( searchContent, handleGeocodingReponse );
                
            } );

            $searchForm.append( $formRow1.append( $suburbLabel, $suburbTextInput ),
                                $formRow2.append( $stateLabel, $stateSelect, $postcodeLabel, $postcodeTextInput ),
                                $formRow3.append( $errorMessageDiv, $searchButton ) );

            return $containerDiv.append( $searchForm );
        }


        function $buildSearchResultsList( options ) {

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

            var onPageNumberClick = function ( pageNumber ) {

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

            var numOfPagesInTotal = Math.ceil( settings.items.length / settings.numOfItemsPerPage );
            
            var $searchSummary = $createSearchSummary( settings.items.length, numOfPagesInTotal );

            var paginationOptions = {

                numOfItemsInTotal: settings.items.length,

                numOfItemsPerPage: settings.numOfItemsPerPage,

                onPageNumberClick: onPageNumberClick

            };

            var $pager = ui.component.pagination.$createPagination( paginationOptions );

            return $containerDiv.append( $searchSummary, $pager );

        }


        function $buildListHeader( options ) {

            var settings = $.extend( {

                className: 'list-header',

                content: []

            }, options );

            var $listHeaderLi = $( '<li>', { 'class': settings.className } );

            settings.content.forEach( function ( one, index ) {

                var $span = $( '<span>', {

                    'class': one,

                    'text': one

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

                listHeaderContent: []

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


        function $buildListItem( props, item ) {

            var $li = $( '<li>' );

            props.forEach( function ( prop ) {

                var $span = null;
                var spanClassName = '';
                var spanContent = null;
                var returnValue = null;

                if ( typeof prop === 'string' ) {

                    spanClassName = prop;
                    spanContent = item[ prop ];

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

                    $span = $( '<span>', { 'class': util.hyphenateCamels( prop.name ) } ); 

                    returnValue = prop( item );

                    if ( returnValue instanceof jQuery ) {

                        $span.append( returnValue );

                    }
                    else if ( typeof returnValue === 'string' ) {

                        $span.html( returnValue );
                    }
                }

                $li.append( $span );

            } );

            return $li;
        }

        function $createSearchSummary( numOfItemsInTotal, numOfPagesInTotal ) {

            var numOfItemsInTotal = isNaN( numOfItemsInTotal ) === true ? 0 : numOfItemsInTotal;
            var numOfPagesInTotal = isNaN( numOfPagesInTotal ) === true ? 0 : numOfPagesInTotal;

            var $searchSummaryDiv = $( '<div>', { 'id': 'search-summary' } );
            var content = 'Search returned ' + numOfItemsInTotal + ' records(s) ' + numOfPagesInTotal + ' page(s)';

            return $searchSummaryDiv.html( content );
        }


        function $createAddressDetails( businessLocation ) {

            var address = util.getFullAddress( businessLocation, ', ' );
            var phone = businessLocation[ 'PhoneNumber' ];

            var $containerDiv = $( '<div>', { 'class': 'address-details' } );
            var $addressDiv = $( '<div>', { 'class': 'full-address', 'text': address } );

            var $phoneDiv = null;
            var $phoneNumberSpan = null;
            var $phoneTitleSpan = null;

            if ( phone !== '' ) {

                $phoneTitleSpan = $( '<span>', { 'class': 'phone-title', 'text': 'Phone: ' } );
                $phoneNumberSpan = $( '<span>', { 'class': 'phone-number', 'text': phone } );
                $phoneDiv = $( '<div>', { 'class': 'phone-details' } );

                $phoneDiv.append( $phoneTitleSpan, $phoneNumberSpan );
            }
           
            return $containerDiv.append( $addressDiv, $phoneDiv );            

        }

        function $createLocationNameLink( businessLocation ) {

            var $a = $( '<a>', { 'class': 'location-name', 'href': '', 'text': businessLocation.LocationTitle });

            $a.on( 'click', function ( event ) { 

                event.preventDefault();
                ui.map.locateLocation( businessLocation );
            } );

            return $a;
        }


        function $createLocationDetailsImage( businessLocation ) {

            var $img = $( '<img>', {

                'class': 'location-details-image',
                'alt': '', 
                'src': ui.resources.images.locationDetails
            } );

            $img.on( 'click', function() {

                ui.map.locateLocation( businessLocation );

            } );

            return $img;
        }


        function handleGeocodingReponse( response ) {

            if ( ui.locations.length === 0 ) {

                throw new BusinessLocationsEmptyError();
            }

            var locationInfoFromSearch = response[ 0 ];
            var address = locationInfoFromSearch.formatted_address;

            var geoLocation = locationInfoFromSearch.geometry.location;
            var latLng = {

                lat: geoLocation.lat(), 
                lng: geoLocation.lng() 
            };

            compute.sortByDistance( latLng, ui.locations );

            var closestLocation = ui.locations[ 0 ];

            ui.map.populateMarkers( map, ui.locations );
            ui.map.locateLocation( closestLocation );

            // Create DOM element class names. Function names are class names.
            var LocationDetails = function ( arg ) { return $createAddressDetails( arg ); };
            var LocationDetailsImage = function( arg) { return $createLocationDetailsImage( arg ); };
            var LocationTitle = function ( arg ) { return $createLocationNameLink( arg ); };

            var $searchResultsList = $buildSearchResultsList( {

                items: ui.locations,

                numOfItemsPerPage: 6,

                listItemFields: [ LocationTitle, LocationDetails, LocationDetailsImage ],

                listHeaderContent: [ 'Name', 'Address' ]

            } );

            var $newSearchResultsDiv = $( '<div>', { 'id': 'search-results-section' } )
            $newSearchResultsDiv.append( $searchResultsList );

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
            $buildSearchResultsList: $buildSearchResultsList,
            $buildSearchSection: $buildSearchSection,
            getSearchContent: getSearchContent
        };

    } )();


    /* UI Map submodule - Google Maps APIs related
     *
     */
    ui.map = ( function () {

        var map = null;
        var infoWindow = null;
        var uluru = { lat: -25.363, lng: 131.044 };
        var markers = [];
        var areMarkersAllPupulated = false;

        var mapDiv = document.createElement( 'div' );
        mapDiv.setAttribute( 'id', 'map' );

        function init() {

            var googleMap = generateMap( uluru );
            
            map = googleMap;

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

            var $locationTitleDiv = $( '<div>', {

                'class': 'location-title', 
                'text': businessLocation[ 'LocationTitle' ] 
            } );

            var $locationAddressDiv = $( '<div>', { 

                'class': 'location-address',
                'text': util.getFullAddress( businessLocation )

            } );

            var phoneLiteral = businessLocation[ 'PhoneNumber'] === '' 
                             ? ''
                             : 'T: ' + businessLocation[ 'PhoneNumber'];

            var $phoneDiv = $( '<div>', {

                'class': 'location-phone-number',
                'text': phoneLiteral

            } );

            var $containerDiv = $( '<div>', { 'class': 'info-window-content' } )
            $containerDiv.append( $locationTitleDiv, $locationAddressDiv, $phoneDiv );

            var contentString = $containerDiv.get( 0 ).outerHTML;

            var infoWindow = new google.maps.InfoWindow( {

                content: contentString

            } );

            return infoWindow;

        }

        function openInfoWindow( map, marker, businessLocation ) {

            if ( infoWindow !== null ) {

                infoWindow.close();
            }

            infoWindow = createInfoWindow( businessLocation );
            infoWindow.open( map, marker );
        }

        /* Create a marker with infoWindow and zoomed in.
         *
         * @param { boolean } - withInfoWindow
         * 
         */
        function createMarker( map, businessLocation, withInfoWindow ) {

            var latLng = new google.maps.LatLng( {

                lat: businessLocation[ 'Latitude' ],
                lng: businessLocation[ 'Longitude' ]

            } );

            var marker = new google.maps.Marker( {

                position: latLng,
                map: map,
                icon: ui.resources.images.mapMarker

            } );

            if ( withInfoWindow === true ) {

                openInfoWindow( map, marker, businessLocation );
            }

            return marker;

        }


        function populateMarkers( map, locations ) {

            if ( areMarkersAllPupulated === true ) {

                return;
            }

            var firstMarker = null;
            var firstLocation = null;
     
            locations.forEach( function( businessLocation, index ) {

                var marker = createMarker( map, businessLocation, false );
                
                if ( index === 0 ) {

                    firstLocation = businessLocation;
                    firstMarker = marker;
                }

                marker.addListener( 'click', function () {

                    openInfoWindow( map, marker, businessLocation );

                } );

                markers.push( marker );

            } );

            areMarkersAllPupulated = true;

        }


        function getMarker( latLng ) {

            var markerPosition = null;
            var marker = null;

            for ( var i = 0; i < markers.length; i ++ ) {

                marker = markers[ i ]
                markerPosition = marker.getPosition();

                console.log( 2, markerPosition.lat(), markerPosition.lng() );

                if ( markerPosition.lat().toFixed( 2 ) === parseFloat( latLng.lat, 10 ).toFixed( 2 )
                        && markerPosition.lng().toFixed( 2 ) === parseFloat( latLng.lng, 10 ).toFixed( 2 ) ) {


                    return marker;
                }
            }

        }


        function locateLocation( businessLocation ) {

            var latLng = {

                lat: businessLocation.Latitude,
                lng: businessLocation.Longitude
            };

            var map = getMap();

            zoomIn( map, latLng);

            var marker = getMarker( latLng );
            openInfoWindow( map, marker, businessLocation );   
        }

        return {

            init: init,
            populateMarkers: populateMarkers,
            createInfoWindow: createInfoWindow,
            createMarker: createMarker,
            getMap: getMap,
            locateLocation: locateLocation,
            container: mapDiv,
            zoomIn: zoomIn

        };

    } )();


    /* Build DOM elements into document
     *
     *  @param { string } elementId
     */
    ui.init = function ( elementOrId, locations ) {

        var $businessLocatorDiv = null;

        if ( typeof elementOrId === 'object' ) {

            $businessLocatorDiv = $( elementOrId );
        }
        else if ( typeof elementOrId === 'string' ) {

            $businessLocatorDiv = $( '#' + elementOrId );
        }

        var uiDom = ui.dom;
        var uiMap = ui.map;

        uiMap.init( );
        uiDom.init( $businessLocatorDiv, uiMap.getMap() );

        if ( locations === undefined || locations.length === 0 ) {

            throw new BusinessLocationsEmptyError();
            
            this.locations = [];
        }
        else {

            this.locations = locations;     
        }

        $businessLocatorDiv.append( uiDom.$buildSearchSection(), uiMap.container );
    };

    /* Compute module container
     *
     */
    var compute = ( function () {

        /*
         * Calculate distance between two coordinates
         * 
         * @param geoCoords1 - eg. { lat: -37.807977, lng: 144.969106 }
         * @return - Direct distance, NOT walking, driving or fly distances.
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

                    console.error( '[ERROR]', 'Geocoder request failed.' );
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

        };

    } )();

    /* Main */
    $( document ).ready( function () {

        loadGoogleApis();

    } );

    module.isGoolgeApisReady = isGoolgeApisReady;
    module.util = util;
    module.ui = ui;
    module.compute = compute;
    module.BusinessLocationsEmptyError = BusinessLocationsEmptyError;
    module.currentScript = currentScript;

    return module;

} )( window.businessLocator, jQuery );

