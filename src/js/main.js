function dateDiff(date2) {
    var date1 = new Date(),
        date2 = new Date(date2);

    var seconds = date2.getSeconds() - date1.getSeconds();
    if (seconds < 0) {
        seconds += 60;
        date2.setMinutes(date2.getMinutes() - 1);
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    $(".circle__block_seconds .circle__block-num").text(seconds);
    $(".circle__block_seconds .circle__block-text").text();

    var minutes = date2.getMinutes() - date1.getMinutes();
    if (minutes < 0) {
        minutes += 60;
        date2.setHours(date2.getHours() - 1);
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    var months_text = "month",
        days_text = "days",
        hours_text = "hours",
        minutes_text = "minutes";

    $(".circle__block_minutes .circle__block-num").text(minutes);
    $(".circle__block_minutes .circle__block-text").text(minutes_text);

    var hours = date2.getHours() - date1.getHours();
    if (hours < 0) {
        hours += 24;
        date2.setDate(date2.getDate() - 1);
    }
    if (hours < 10) {
        hours = "0" + hours;
    }
    $(".circle__block_hours .circle__block-num").text(hours);
    $(".circle__block_hours .circle__block-text").text(hours_text);

    var days = date2.getDate() - date1.getDate();
    if (days < 0) {
        days += new Date(date2.getFullYear(), date2.getMonth() - 1, 0).getDate() + 1;
        date2.setMonth(date2.getMonth() - 1);
    }
    if (days < 10) {
        days = "0" + days;
    }
    $(".circle__block_days .circle__block-num").text(days);
    $(".circle__block_days .circle__block-text").text(days_text);

    var months = date2.getMonth() - date1.getMonth();
    if (months < 0) {
        months += 12;
        date2.setFullYear(date2.getFullYear() - 1);
    }
    if (months < 10) {
        months = "0" + months;
    }
    $(".circle__block_months .circle__block-num").text(months);
    $(".circle__block_months .circle__block-text").text(months_text);


    // var years = date2.getFullYear() - date1.getFullYear();
    // return [ years, months, days, hours, minutes, seconds ];
}


function getfrominputs() {
    if (document.getElementById("start_date") != null) {
        var string = document.getElementById("start_date").value;

        dateDiff(string);

        setInterval(function () {
            dateDiff(string);
        }, 1000);
    }
}

$(document).ready(function () {
    // TIMER
    getfrominputs();

    // SLIDER
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination'
        , paginationClickable: false
        , preloadImages: false
        , lazyLoading: true
        , centeredSlides: true
        // , autoplay: 4500
        , autoplayDisableOnInteraction: false
        , effect: 'fade'
    });
});