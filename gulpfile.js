/* Gulp tasks
 *
 */

const gulp = require( 'gulp' );
const gulpConcat = require( 'gulp-concat' );
const gulpUglify = require( 'gulp-uglify' );
const gulpCleanCss = require( 'gulp-clean-css' );
const gulpRename = require( 'gulp-rename' );




gulp.task( 'concat-js', () => { 

    let files = [

        './src/business-locator-locations.js',
        './src/business-locator.js',
        './src/main.js'
    ];

    let dest = './pre-dist/';

    gulp.src( files )
        .pipe( gulpConcat( 'lpg-business-locator.js' ) )
        .pipe( gulp.dest( dest ) )
        .pipe( gulpUglify() )
        .pipe( gulpRename( { suffix: '.min' } ) )
        .pipe( gulp.dest( dest ) );

} );

gulp.task( 'minify-css', () => { 

    let cssFile = './src/*.css';
    let dest = './pre-dist/';

    gulp.src( cssFile )
        .pipe( gulpRename( { prefix: 'lpg-' } ) )
        .pipe( gulp.dest( dest ) )
        .pipe( gulpCleanCss() )
        .pipe( gulpRename( { suffix: '.min' } ) )
        .pipe( gulp.dest( dest ) );

} );


let tasks = [

    'concat-js',
    'minify-css'

];

gulp.task( 'default', () => { 

    gulp.start( tasks );

} );
