/**
 * @name scrollWindowNavigationFixedLarge()
 * @function
 */
function scrollWindowNavigationFixedLarge() {
    var countScroll = $(window).scrollTop(),
        navigationBlock = $(".header"),
        body = $("body");

    if (countScroll > 150) {
        body.addClass("fixed");
        navigationBlock.addClass("slideInDown");
    } else {
        body.removeClass("fixed");
        navigationBlock.removeClass("slideInDown");
    }
}

/**
 *
 * @param name
 * @param value
 * @param expires
 * @param path
 * @param domain
 * @param secure
 */
function setCookieStore(name, value, expires, path, domain, secure) {
    document.cookie = name + "=" + escape(value) +
        ( (expires)  ? "; expires="  + expires   : "" ) +
        ( (path)     ? "; path="     + path      : "" ) +
        ( (domain)   ? "; domain="   + domain    : "" ) +
        ( (secure)   ? "; secure"                : "" );
}

/**
 *
 * @param cookieName
 * @returns {null}
 */
function getCookieStore(cookieName) {
    var results = document.cookie.match( '(^|;) ?' + cookieName + '=([^;]*)(;|$)' );

    if (results) {
        return (unescape(results[2]));
    } else {
        return null;
    }
}

/**
 *
 */
$(window).on("load resize ready scroll", function(){
    if($(window).width() > '1024') {
        // scrollWindowNavigationFixedLarge();
    } else {
        // $("body").removeClass("fixed");
        //$(".header").removeClass("slideInDown");
    }
});

/**
 *
 */
$(document).ready(function() {

    var getCookieValue  = getCookieStore("BG");

    if (getCookieValue === null || getCookieValue === undefined) {
        var randomNum = Math.floor(Math.random() * (0 - 17)) + 18;

        setCookieStore("BG", randomNum);

        $("body").addClass("bg-" + randomNum);
    } else if (getCookieValue.length > 0){
        $("body").addClass("bg-" + getCookieValue);
    } else {
        $("body").addClass("bg-0");
    }


    /* BODY CLICK */
    $('body').on('click', function (e) {
        var className = ".language, .profile, .profile__drop";

        if (!$(e.target).closest(className).length) {
            $(".language__drop, .profile__drop").hide();
        }

        // console.log($(e.target));

        if($(e.target).hasClass("navigation active")) {
            menuContainer.removeClass("active");
            $("html, body").removeClass("open-menu");
        }
    });


    /**
     * Disable jump in iPhone|iPad|iPod devices
     *
     * @method
     */
    if(navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        $(document).on('blur', 'input, textarea', function () {
            setTimeout(function () {
                window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
            }, 0);
        });
    }
});

/**
 * Function check drag event for elements; and disabled this events
 *
 * @name ondragstart
 * @function
 * @returns {boolean}
 */
window.ondragstart = function() {return false;};