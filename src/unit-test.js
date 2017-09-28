mocha.setup( 'bdd' );
chai.should();

describe( 'Array', function() {

    describe( '#indexOf()', function() {

        it( 'should return -1 when the value is not present', function() {

            [ 1, 2, 3 ].indexOf( 5 ).should.equal( -1 );
            [ 1, 2, 3 ].indexOf( 0 ).should.equal( -1 );

        } );

    } );

} );


describe( 'Compute module', function () { 

    describe( 'Get coordinates of address input', function () {

        it( 'should be Melbouren', function () { 



        } );

    } );

} );

mocha.run();