var gulp            =   require('gulp')
    , plumber       =   require('gulp-plumber')
    , spritesmith   =   require('gulp.spritesmith')
    , imagemin      =   require('gulp-imagemin')
    , pngComp       =   require('imagemin-pngquant')
    , changed       =   require('gulp-changed-aster')
    , imagemin      =   require('gulp-tinypng');


/* ERROR HANDLER */
var onErrorHandler      =   require('./gulp-onError.js');


/* OPTION */
var plumberOption = {
    errorHandler: onErrorHandler
};


exports.imageSprites = function (taskName) {

    gulp.task(taskName, function() {

        var src, spImgPath, retinaspImgPath, destImg, destCss;


        src             = './src/icons/*.png';
        spImgPath       = '../image/sprite.png';
        retinaspImgPath = '../image/sprite@2x.png';
        destImg         = './dist/image/';
        destCss         = './src/scss/_variable/';


        var spriteData = gulp.src(src)
            .pipe(
                plumber(plumberOption)
            )
            .pipe(spritesmith(
                {
                    imgName         : 'sprite.png',
                    imgPath         : spImgPath,
                    retinaImgPath   : retinaspImgPath,
                    cssName         : '_sprite.scss',
                    retinaSrcFilter :
                        [
                            './src/icons/*@2x.png'
                        ],
                    retinaImgName   : 'sprite@2x.png',
                    algorithm       : 'binary-tree',
                    padding         : 5,
                    cssVarMap       : function(sprite) {
                        sprite.name = 'sp-' + sprite.name;
                    }
                }
            ));

            spriteData.img.pipe(
                gulp.dest(destImg)
            );

            spriteData.css.pipe(
                gulp.dest(destCss)
            );
    });
};
