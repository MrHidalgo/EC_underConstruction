/* PLUGINS */
var gulp                =   require('gulp')
    , plumber           =   require('gulp-plumber')
    , prefixer          =   require('gulp-autoprefixer')
    , scss              =   require('gulp-sass')
    , stripCssComments  =   require('gulp-strip-css-comments')
    , sourcemaps        =   require('gulp-sourcemaps')
    , notify            =   require('gulp-notify')
    , cssmin            =   require('gulp-cssmin')
    , rename            =   require('gulp-rename')
    , changed           =   require('gulp-changed-aster');


/* ERROR HANDLER */
var onErrorHandler      =   require('./gulp-onError.js');


/* OPTION */
var plumberOption = {
    errorHandler: onErrorHandler
};
var changedOption = {
    hasChanged: changed.compareSha1Digest
};
var sassOptions = {
    errLogToConsole : true,
    outputStyle     : 'expanded',
    sourceComments  : true
};
var autoPrefixOptions = {
    browsers: [
        'last 10 versions',
        '> 1%',
        'ie >= 9',
        'Firefox ESR',
        'Chrome >= 31',
        'Firefox >= 28',
        'Edge >= 12',
        'Explorer >= 9',
        'iOS >= 7.1',
        'Safari >= 6.1',
        'Android >= 2.1',
        'Opera >= 12.1'
    ],
    cascade: true
};
var sourceMapsOption = {
    loadMaps: true,
    largeFile: true
};
var cssMinOption = {
    showLog : true,
    compatibility : 'ie7',
    keepSpecialComments : 1
};
var renameOption = {
    suffix : '.min'
};

/* outputStyle : [expanded, compact, nested, compressed] */
exports.styleMainTask = function(taskName) {

    var srcFiles    = './src/scss/**.scss',
        distFolder  = './dist/style/';

    return gulp.task(taskName, function() {

        gulp.src(srcFiles)
            .pipe(
                plumber(plumberOption)
            )
            .pipe(
                changed(distFolder, changedOption)
            )
            .pipe(
                sourcemaps.init(sourceMapsOption)
            )
			.pipe(
			    scss(sassOptions).on('error', scss.logError)
            )
			.pipe(
			    prefixer(autoPrefixOptions)
            )
            .pipe(
                sourcemaps.write('./maps')
            )
            .pipe(
                stripCssComments()
            )
            .pipe(
                gulp.dest(distFolder)
            )
            .pipe(
                cssmin(cssMinOption)
            )
            .pipe(
                rename(renameOption)
            )
            .pipe(
                gulp.dest(distFolder)
            );
	});
};

