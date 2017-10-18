mocha.setup( 'bdd' );

var expect = chai.expect;

var runTests = function ( ) {

    console.log( 'Tests start ' );

    describe( 'Util module', function () {

        describe( 'Method: camelToHyphen', function () { 

            it( 'should convert capital letters to hyphens', function () { 

                var result = businessLocator.util.hyphenateCamels( 'MyUtilTest' );

                expect( result ).to.equal( 'my-util-test');

            } );

        } );


        describe( 'Method: makeAssetPath', function () { 

            it( 'should return full path of a file', function () { 

                var result = businessLocator.util.makeAssetPath( '/hello/world.js', '1.png' );

                expect( result ).to.equal( '/hello/1.png' );

            } );

            it( 'should return original file path', function () { 

                var result = businessLocator.util.makeAssetPath( '/hello/world.js', 'path/1.png' );

                expect( result ).to.equal( 'path/1.png' );

            } );

        } );

    } );


    describe( 'UI module', function () {

        var $form = $( '#search-form' );
        var $suburb = $( '#search-by-suburb' );
        var $state = $( '#search-by-state' );
        var $postcode = $( '#search-by-postcode' );

        describe( 'Method: getSearchContent', function () {

            it( 'should get concated search content', function () {

                $suburb.val( '   no name ' );
                $postcode.val( ' 8888 ' );
                
                var content = businessLocator.ui.dom.getSearchContent( $form );
                expect( content ).to.equal( 'no name  8888' );

            } );

            it( 'should be NSW', function () { 

                $state.find( 'option:eq(2)' ).prop( 'selected', true );

                var content = businessLocator.ui.dom.getSearchContent( $form );
                expect( content ).to.equal( 'NSW' );

            } );

            it( 'should be suburb and state only', function () { 

                $suburb.val( '   Suburb name ' );
                $state.find( 'option:eq(3)' ).prop( 'selected', true );

                var content = businessLocator.ui.dom.getSearchContent( $form );
                expect( content ).to.equal( 'Suburb name WA' );

            } );

            it( 'should be state and postcode only', function () { 

                $postcode.val( '9999' );
                $state.find( 'option:eq(3)' ).prop( 'selected', true );

                var content = businessLocator.ui.dom.getSearchContent( $form );
                expect( content ).to.equal( 'WA 9999' );
                
            } );

        } );

        // Tear down
        afterEach( function () { 

            $suburb.val( '' );
            $state.find( 'option:eq(0)' ).prop( 'selected', true );
            $postcode.val( '' );

        } );

    } );


    describe( 'Compute module', function () { 

        // Somewhere in Melbouren CBD
        var melbourne = { lat: -37.807867, lng: 144.969106 };

        // Somewhere in Sydney CBD
        var sydney = { lat: -33.860625, lng: 151.204862 };


        // How to measure distance: https://support.google.com/maps/answer/1628031?co=GENIE.Platform%3DDesktop&hl=en&oco=1
        describe( 'Method: calulateDistance', function () {

            it( 'should be about 713km from Melbourne to Sydney', function () { 

                var result = businessLocator.compute.calculateDistance( melbourne, sydney );
                expect( result ).to.be.within( 712000, 714000 );

            } );

            it( 'should be about 713km from Sydney to Melbourne', function () { 
                
                var result = businessLocator.compute.calculateDistance( sydney, melbourne );
                expect( result ).to.be.within( 712000, 714000 );

            } );

        } );

        describe( 'Method: sortByDistance', function () {

            businessLocator.compute.sortByDistance( melbourne, dummyLocations );

            it( 'should be "A J ... "', function () { 
                
                expect( dummyLocations[ 0 ][ 'LocationTitle' ] ).to.contain( 'A J' );

            } );
     
            it ( 'should be "Walgett..."', function () { 

                expect( dummyLocations[ 2 ][ 'LocationTitle' ] ).to.contain( 'Walgett' );

            } );
        } );

    } );


    mocha.run();

};


var timerId = setInterval( function () {

    if ( businessLocator.isGoolgeApisReady() === true ) {

        runTests();
        clearInterval( timerId );
    }

}, 1000 );

