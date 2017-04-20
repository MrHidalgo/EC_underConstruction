var gulp        =   require('gulp')
    , plumber   =   require('gulp-plumber')
    , data      =   require('gulp-data')
    , jade      =   require('gulp-jade')
    , fs        =   require('fs')
    , glob      =   require('glob')
    , path      =   require('path')
    , foreach   =   require('gulp-foreach')
    , changed   =   require('gulp-changed-aster');


/* ERROR HANDLER */
var onErrorHandler      =   require('./gulp-onError.js');


/* JSON Templates */
function getJsonData(file, cb) {

    var srcFiles = './src/_data/**.json';

    glob(srcFiles, {}, function(err, files) {

        var data = {};

        if (files.length) {
            files.forEach(function(fPath){

                var baseName = path.basename(fPath, '.json');

                data[baseName] = JSON.parse(fs.readFileSync(fPath));
            });
        }

        cb(undefined, data);
    });
};


/* OPTION */
var plumberOption = {
    errorHandler: onErrorHandler
};
var changedOption = {
    hasChanged: changed.compareSha1Digest
};
var jadeOption = {
    pretty : true
};


exports.jadeMainTask = function (taskName) {

    var srcFiles    = './src/jade/**.jade',
        distFolder  = './dist/';

    return gulp.task(taskName, function() {

        gulp.src(srcFiles)
            .pipe(
                plumber(plumberOption)
            )
            .pipe(
                changed(distFolder, changedOption)
            )
            .pipe(
                data(getJsonData)
            )
            .pipe(
                jade(jadeOption)
            )
            .pipe(
                gulp.dest(distFolder)
            );
    })
};