var left_nav = (function() {
    var $generalContainer = $("#l-generalContainer");
    var $leftNav = $("#l-leftNav");

    function init() {
        //nav
        if ($("#l-leftNav").length>0){
           openCloseNav();
           scrollNav();
        }
    }

    ////////////////////////////////////////////////
    //NAV
    ////////////////////////////////////////////////
    //Permet d'ouvrir et de fermer la nav de côté
    function openCloseNav() {
        $(".toggle-nav-visibility").click(function() {
            toggleNav();
            storeNavState();
            if (typeof _gaq !== 'undefined'){
                trackNavState();
            }

            return false;
        });
    }


    //ferme ou ouvre la nav
    function toggleNav() {
        $("#l-generalContainer").addClass('is-activated').toggleClass("is-nav-open");
        $("body").attr('data-animatedNav', 'true');
        setTimeout(function() {
            $("body").attr('data-animatedNav', 'false');
        }, 600);
    }

    function storeNavState() {
        if(typeof(Storage) !== "undefined") {
            if ($("#l-generalContainer").hasClass("is-nav-open")) {
                localStorage.setItem("nav-open", true);
            }
            else {
                localStorage.setItem("nav-open", false);
            }
        }
    }

    function trackNavState() {
        var label = $("#l-generalContainer").hasClass('is-nav-open') ? 'open' : 'close';
        _gaq.push(['_trackEvent', 'UI-UX', 'side-nav', label, screen.width]);
    }

    //Permet de scroller la nav si elle est trop haute pour notre écran
    function scrollNav() {
        var $scrollNavDiv = $("#l-leftNav").find('> div');
        $scrollNavDiv.jScrollPane();
        var apiScroll = $scrollNavDiv.data('jsp');
        var throttleTimeout;
        $(window).on("resize", function() {
            if (!throttleTimeout) {
                throttleTimeout = setTimeout(function() {
                    apiScroll.reinitialise();
                    throttleTimeout = null;
                    resizeBandeTitre();
                }, 50);
                throttleTimeout = setTimeout(function() {
                    apiScroll.reinitialise();
                    throttleTimeout = null;
                    resizeBandeTitre();
                }, 1000);
            }
        });
        var lastHeight = $scrollNavDiv.height();
        var throttleTimeoutScroll;
        $(window).on("scroll", function() {
            if (!throttleTimeoutScroll && lastHeight !== $scrollNavDiv.height()) {
                throttleTimeoutScroll = setTimeout(function() {
                    apiScroll.reinitialise();
                    lastHeight = $scrollNavDiv.height();
                    throttleTimeoutScroll = null;
                }, 50);
            }
        });
    }

    //ajuste la taille de la bande de titre
    function resizeBandeTitre() {
        var $imgLogo=$('#l-leftNav .l-logoOnf');
        var imgLogo = imagesLoaded($imgLogo);
        imgLogo.on('always', function() {

            var heightLogo = '';
            var outerheightLogo = '';
            if (window.matchMedia("(min-width: 990px)").matches) {
                outerheightLogo = $('#l-leftNav .l-logoOnf').outerHeight(true) + 'px';
                heightLogo = $('#l-leftNav .l-logoOnf').height() + 'px';
            }
        //    $(".bandeOuterHeightLogo").css('height', outerheightLogo);
            $(".m-breadcrumb-bar li,#spacerTop,.m-breadcrumb-bar li h1.alignBottom").css('height', heightLogo);
            if ($(".bandeTop").length >= 1) {
                $(".bandeTop h1").show();
            }
            //pour la page de settings
            $("#changeAvatar").css('width', heightLogo);
        });
    }


    // Reveal public pointers to
    // private functions and properties
    return {
        init: init,
    };
})();

$('document').ready(function() {
    left_nav.init();
});
