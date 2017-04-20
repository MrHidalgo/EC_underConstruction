var gulp        =   require('gulp')
    , plumber   =   require('gulp-plumber')
    , rename    =   require('gulp-rename')
    , uglify    =   require('gulp-uglify')
    , fixmyjs   =   require("gulp-fixmyjs")
    , changed   =   require('gulp-changed-aster');


/* ERROR HANDLER */
var onErrorHandler      =   require('./gulp-onError.js');


/* OPTION */
var plumberOption = {
    errorHandler: onErrorHandler
};
var changedOption = {
    hasChanged: changed.compareSha1Digest
};
var fixmyjsOption = {
    legacy : true
};
var uglifyOption = {
    compress: true
};
var renameOption = {
    suffix : '.min'
};



exports.mainScriptTask = function (taskName) {

    var srcFiles    = './src/js/**.js',
        distFolder  = './dist/script/';

    return gulp.task(taskName, function () {

        gulp.src(srcFiles)
            .pipe(
                plumber(plumberOption)
            )
            // .pipe(
            //     changed(distFolder, changedOption)
            // )
            .pipe(
                fixmyjs(fixmyjsOption)
            )
            .pipe(
                gulp.dest(distFolder)
            )
            .pipe(
                uglify(uglifyOption)
            )
            .pipe(
                rename(renameOption)
            )
            .pipe(
                gulp.dest(distFolder)
            );
    });
};
