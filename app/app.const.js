(function (angular) {

    "use strict";

    var config = {
        blobUrl: "https://portfoliofiles.blob.core.windows.net/photos/",
      
        videoExtensions: "webm m4v 3gp nsv ts ty strm rm rmvb m3u ifo mov qt divx xvid bivx vob nrg img iso pva wmv asf asx ogm m2v avi bin dat dvr-ms mpg mpeg mp4 mkv avc vp3 svq3 nuv viv dv fli flv wpl",

    };

    var yearTrainings = [1, 2, 3, 4, 5];

    var viewTypes = {
        RuqMorrisonsPouch: 0,
        ViewType1: 1
    };

    var genders = {
        male: 0,
        female: 1
    };

    angular
        .module("Eportfolio")
        .constant("config", config)
        .constant("genders", genders)
        .constant("viewTypes", viewTypes)
     .constant("yearTrainings", yearTrainings);

})(angular);