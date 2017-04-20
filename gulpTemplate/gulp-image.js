var gulp        =   require('gulp')
    , plumber   =   require('gulp-plumber')
    , imagemin  =   require('gulp-tinypng');


/* ERROR HANDLER */
var onErrorHandler      =   require('./gulp-onError.js');


/* OPTION */
var plumberOption = {
    errorHandler: onErrorHandler
};
var tinyPngAPI = 'w2hECd9nCvKWfBj49LZrOPa6Ws7ws8uE';


exports.mainImageTask = function (taskName) {

    var srcFile     = "./src/image/*",
        distFolder    = "./dist/image";

    return gulp.task(taskName, function() {
        gulp.src(srcFile)
            .pipe(
                plumber(plumberOption)
            )
            .pipe(
                imagemin(tinyPngAPI)
            )
            .pipe(
                gulp.dest(distFolder)
            );
    });
};
