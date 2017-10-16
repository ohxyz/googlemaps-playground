/* Gulp tasks
 *
 */

const gulp = require( 'gulp' );
const gulpConcat = require( 'gulp-concat' );
const gulpUglify = require( 'gulp-uglify' );


gulp.task( 'concat-js', () => { 

    let files = [

        './src/business-locator-locations.js',
        './src/business-locator.js',
        './src/main.js'
    ];

    let dest = './pre-dist/';

    gulp.src( files )
        .pipe( gulpConcat( 'lpg-business-locator.js' ) )
        .pipe( gulp.dest( dest ) );

} );


let tasks = [

    'concat-js'

];

gulp.task( 'default', () => { 

    gulp.start( tasks );

} );
