/* Gulp tasks
 *
 */

const gulp = require( 'gulp' );
const gulpConcat = require( 'gulp-concat' );
const gulpUglify = require( 'gulp-uglify' );
const gulpCleanCss = require( 'gulp-clean-css' );
const gulpRename = require( 'gulp-rename' );


let renameOptions = {

    prefix: 'lpg-',
    suffix: '.min'

};

gulp.task( 'concat-js', () => { 

    let files = [

        './src/business-locator-locations.js',
        './src/business-locator.js',
        './src/main.js'
    ];

    let dest = './pre-dist/';

    gulp.src( files )
        .pipe( gulpConcat( 'business-locator.js' ) )
        .pipe( gulpUglify() )
        .pipe( gulpRename( renameOptions ) )
        .pipe( gulp.dest( dest ) );

} );

gulp.task( 'minify-css', () => { 

    let cssFile = './src/*.css';
    let dest = './pre-dist/';


    gulp.src( cssFile )
        .pipe( gulpCleanCss() )
        .pipe( gulpRename( renameOptions ) )
        .pipe( gulp.dest( dest ) );

} );


let tasks = [

    'concat-js',
    'minify-css'

];

gulp.task( 'default', () => { 

    gulp.start( tasks );

} );
