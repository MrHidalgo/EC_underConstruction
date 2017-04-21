function dateDiff(dateValue) {
    var date1       = new Date(),
        date2       = new Date(dateValue);

    var elemMonth   = $("#date__month"),
        elemDay     = $("#date__day"),
        elemHours   = $("#date__hours"),
        elemMinutes = $("#date__minutes"),
        elemSeconds = $("#date__seconds");

    var seconds = date2.getSeconds() - date1.getSeconds();
    if (seconds < 0) {
        seconds += 60;
        date2.setMinutes(date2.getMinutes() - 1);
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    elemSeconds.text(seconds);

    var minutes = date2.getMinutes() - date1.getMinutes();
    if (minutes < 0) {
        minutes += 60;
        date2.setHours(date2.getHours() - 1);
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    elemMinutes.text(minutes);

    var hours = date2.getHours() - date1.getHours();
    if (hours < 0) {
        hours += 24;
        date2.setDate(date2.getDate() - 1);
    }
    if (hours < 10) {
        hours = "0" + hours;
    }
    elemHours.text(hours);

    var days = date2.getDate() - date1.getDate();
    if (days < 0) {
        days += new Date(date2.getFullYear(), date2.getMonth() - 1, 0).getDate() + 1;
        date2.setMonth(date2.getMonth() - 1);
    }
    if (days < 10) {
        days = "0" + days;
    }
    elemDay.text(days);

    var months = date2.getMonth() - date1.getMonth();
    if (months < 0) {
        months += 12;
        date2.setFullYear(date2.getFullYear() - 1);
    }
    if (months < 10) {
        months = "0" + months;
    }
    elemMonth.text(months);
}


function getFromInputs() {
    var dataInput   = $("#start_date"),
        string      = $(dataInput).val();

    if (dataInput.length > 0) {
        dateDiff(string);

        setInterval(function () {
            dateDiff(string);
        }, 1000);
    }
}

$(window).on("load ready resize scroll", function() {
    var winWidth        = $(window).width();

    var circleWrap      = $(".circle__block"),
        circleWrapLen   = circleWrap.length,
        windowPadding   = 30;

    if(winWidth < "768") {
        // 5 margin left/right
        var res = Math.ceil((winWidth - windowPadding) / circleWrapLen) - 5;

        circleWrap.attr("style", "width:" + res + "px;height:" + res + "px;");
    } else {
        circleWrap.attr("style", "");
    }
});

$(document).ready(function () {
    // TIMER
    getFromInputs();

    // VIDEO SUPPORT
    var vid             = $("video"),
        videoBool       = document.createElement('video').canPlayType;

    if(vid.length === 0 || !videoBool) {
        vid.remove();
        $(".video").addClass("not_load");
    }
});