
var vitalgasLocations = [];
var quickswapLocations = [];

window.businessLocator.locations.forEach( function ( businessLocation ) {

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


businessLocator.init = function () {

    var link = window.location.pathname;
    var locations = [];

    if ( link.indexOf( 'bbq-gas') !== -1 ) {

        locations = quickswapLocations;
    }
    else if ( link.indexOf( 'autogas' ) !== -1 ) {

        locations = quickswapLocations;
    }

    try { 
    
        this.ui.init( 'business-locator', locations );
    }
    catch( error ) {

        if ( error instanceof this.BusinessLocationsEmptyError ) {

            console.error( '[WARN]', 'Business locations are empty.' );

        }
    }
};