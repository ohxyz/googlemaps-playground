/* Main script
 * 
 * 1. Filter out Vitagas and Quickswap
 * 2. Definition of init
 */


businessLocator.init = function () {

    var vitalgasLocations = [];
    var quickswapLocations = [];

    this.locations.forEach( function ( businessLocation ) {

        if ( businessLocation.Type === 'Both' ) {

            vitalgasLocations.push( businessLocation );
            quickswapLocations.push( businessLocation );
        }

        if ( businessLocation.Type === 'Vitalgas' ) {

            vitalgasLocations.push( businessLocation );
        }
        else if ( businessLocation.Type === 'Quickswap' ) {

            quickswapLocations.push( businessLocation );
        }

    } );

    var link = window.location.pathname;
    var locations = [];
    var scriptElement = null;
    var containerElement = null;
    var containerName = 'business-locator';

    if ( link.indexOf( 'bbq-gas') >=0 ) {

        locations = quickswapLocations;
    }
    else if ( link.indexOf( 'autogas' ) >=0 ) {

        locations = vitalgasLocations;
    }
    else {

        locations = businessLocator.locations;
    }

    containerElement = document.getElementById( containerName );


    // Element not found by ID
    if ( containerElement === null ) {

        containerElement = document.getElementsByClassName( containerName )[ 0 ];
    }

    // Element not found by class name
    if ( containerElement === undefined ) {

        containerElement = document.createElement( 'div' );
        containerElement.setAttribute( 'id', containerName );
        
        this.currentScript.parentNode.insertBefore( containerElement, this.currentScript.nextSibling );
    }

    try { 
    
        this.ui.init( containerElement, locations );
    }
    catch( error ) {

        if ( error instanceof this.BusinessLocationsEmptyError ) {

            console.error( '[WARN]', 'Business locations are empty.' );

        }
    }
};

