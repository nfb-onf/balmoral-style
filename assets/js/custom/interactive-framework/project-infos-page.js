'use strict';
var project_infos_page = (function () {
    function init(){
        sf_popOver.init();
        positionTopBanner();
        initNewsletter();
        initCollapseUpCustom();
        sf_initSwiper.init();
        if (Utils.isMobile.any() && $(".downloadMobileCTA").length >= 1){
            reorderMobileCTA();
        }
    }

    function positionTopBanner(){
        $(window).on("resize", function(){
            Utils.fitImageInContainer($('#mi-topbanner .l-boxRatio video'), $('#mi-topbanner .relative'), 16/9);
            if (window.matchMedia("(min-width: 768px)").matches) {
                Utils.fitImageInContainer($('#mi-topbanner .l-boxRatio img'), $('#mi-topbanner .relative'), 16/9);
            }else{
                Utils.fitImageInContainer($('#mi-topbanner .l-boxRatio img'), $('#mi-topbanner .relative'), 640/820);
            }
        }).trigger('resize');
        if (Utils.isMobile.any()){
            $('#mi-topbanner .l-boxRatio picture').removeClass('hidden');
        } else {
            $('#mi-topbanner .l-boxRatio video').removeClass('hidden');
        }
    }

    function initNewsletter(){
        var $emailField = $('#mi-newsletter input[name=newsletterSubscriptionEmail]');
        var $submitButton = $("#submitEmailNewsletter");

        $submitButton.click(function(){
            var email = $emailField.val();
            if (/(.+)@(.+){2,}\.(.+){2,}/.test(email)) {
                var apiURL = "https://www.onf.ca/api/v2/json/newsletter/subscribe/";
                var newsletter = $('#mi-newsletter #newsletterList').val();
                var source = window || document;
                var data = {
                    api_key: '4fcf6f89-84a2-5d12-b5d8-b286ea4251a7',
                    email: email,
                    list_of_newsletter: newsletter,
                    referrer: source.location.href
                }
                $.post(apiURL, data, function(data) {
                    $('#mi-newsletter .step1').addClass('hidden');
                    $('#mi-newsletter .step2').removeClass('hidden');
                    //tracking.sendTrackingEvent("subscribe_newsletter");
                }).fail(function(response) {
                    console.log("subscribeNewsLetter : Error");
                });
            } else {
                $emailField.closest('#mi-newsletter .newsletterForm').addClass('invalidEmail');
            }
        });

        $emailField.keypress(function (event) {
            if (event.which == 13) {
                $submitButton.click();
            }
        });
    }

    function reorderMobileCTA(){
        var $mobileCTAContainer = $(".downloadMobileCTA");
        var $storeOfCurrentDevice;
        $mobileCTAContainer.each(function(){
            var $container = $(this);
            if (Utils.isMobile.iOS()){
            $storeOfCurrentDevice = $container.find("#CTA-Apple").detach();
            } else if (Utils.isMobile.Android()){
                $storeOfCurrentDevice = $container.find("#CTA-Google-Play").detach();
            } else if (Utils.isMobile.Windows()){
                $storeOfCurrentDevice = $container.find("#CTA-Windows").detach();
            }

            if ($storeOfCurrentDevice){
                $container.prepend($storeOfCurrentDevice);
            }
        });

    }

    function activateScrollProgress(){
        var getMax = function(substractedValue){
            return $(document).height() - $(window).height() - substractedValue;
        }

        var getValue = function(){
            return $(window).scrollTop();
        }

        var getWidth = function(scrolledValue){
            width = (scrolledValue/maxWithoutFooter) * 100;
            width = width + '%';
            return width;
        }

        var trackedPercent = {
            p25: false,
            p50: false,
            p75: false,
            p100: false
        }

        var setWidth = function(){
            var scrolledValue = getValue();
            var percentageWidth = getWidth(scrolledValue);
            var addedMargin = 0;
            var $fixedBackTop = $('#fixedBackTop');
            progressBar.css({ width: percentageWidth });

            if (scrolledValue > maxWithoutFooter){
                addedMargin = scrolledValue - maxWithoutFooter;
                $fixedBackTop.css('margin-bottom', addedMargin+'px');
            } else {
                $fixedBackTop.css('margin-bottom', '0px');
            }

            if (parseInt(percentageWidth) > 50){
                $('a', $fixedBackTop).addClass('reveal-css-opacity-loaded');
            } else {
                $('a', $fixedBackTop).removeClass('reveal-css-opacity-loaded');
            }

                //tracking.sendTrackingEvent("scroll_100%");
            if (parseInt(percentageWidth) >= 100 && !trackedPercent.p100){
                trackedPercent.p100 = true;
            } else if (parseInt(percentageWidth) >= 75 && !trackedPercent.p75){
                //tracking.sendTrackingEvent("scroll_75%" );
                trackedPercent.p75 = true;
            } else if (parseInt(percentageWidth) >= 50 && !trackedPercent.p50){
                //tracking.sendTrackingEvent("scroll_50%");
                trackedPercent.p50 = true;
            } else if (parseInt(percentageWidth) >= 25 && !trackedPercent.p25){
                //tracking.sendTrackingEvent("scroll_25%");
                trackedPercent.p25 = true;
            }
        }

        var getSeparatorPosition = function($element){
            var value = $element.offset().top - $(window).height();
            var position = (value / maxWithoutFooter) * 100;
            position = position + '%';
            return position;
        }

        var progressBar = $('.progress-bar'),
            maxWithoutFooter = getMax($('#l-footerLayout').outerHeight()),
            maxTotal = getMax(0),
            value, width;



        var createSectionSeparator = function(){
            $('section').not(".m-questions-comments").each(function(){
                var sectionType = $(this).attr("id");
                $('.progress-bar').append('<div id="' + sectionType + '-separator" class="separator">')
            });
        }

        var positionSeparator = function(){
            $('.progress-bar .separator').each(function(){
                var $currentSeparator = $(this);
                var sectionId = $currentSeparator.attr('id').replace('-separator','');
                var position = getSeparatorPosition($("#"+sectionId));
                $currentSeparator.css('left', position);
            });
        }

        createSectionSeparator();
        positionSeparator();

        $(document).on('scroll', function(){
            if ($("#interactive-project-details").length > 0){
                setWidth();
            }
        });

        $(window).on('resize', function(){
            // Need to reset the Max attr
            if ($("#interactive-project-details").length > 0){
                setTimeout(function(){
                    maxWithoutFooter = getMax($('#l-footerLayout').outerHeight());
                    maxTotal = getMax(0);
                    setWidth();
                    positionSeparator();
                }, 200);
            }
        });
    }

    function initCollapseUpCustom(){
        $(".is-collapseBlock-custom").click(function(){
            var $title = $(this);
            var $containerCollapse = $("#"+$title.attr('data-block'));


            var anchorLink = "#" + $title.closest('section').attr('id');
            $containerCollapse.slideUp(400, function(){
                if ($title.closest('.collapseBlockContainer').length > 0){
                    $title.closest('.collapseBlockContainer').find('.is-collapseBlock-open').removeClass('is-collapseBlock-open');
                }
            });

            if ($containerCollapse.height() > $(window).height() || $containerCollapse.height() > window.screen.height){
                if (framework.inIframe() === true){
                    overlay.scrollToAnchorInIframe(anchorLink, 400, 0);
                } else{
                    Utils.scrollToId($(anchorLink), 400, "easeInOutQuint");
                }
            }
            return false;
        });
    }

    function animateScroll(){
        var $elements = $('.reveal-y, .reveal-x-left, .reveal-x-right, .reveal-opacity'),
            lastScrollY     = 0,
            ticking         = false;

        var onScroll = function() {
            lastScrollY = window.scrollY;
            requestTick();
        }

        var requestTick = function() {
            if(!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }

        var update = function() {
            var newScroll = window.scrollY;
            $elements.not('.loaded').each(function() {
                var $object = $(this);
                var $delay = 0;
                var transformCommand;
                var offsetHeight = 0;
                var objectHeight = $object.height();
                if ($object.hasClass('reveal-y')){
                    transformCommand = 'translateY(0px)';
                }
                else if ($object.hasClass('reveal-x-left') || $object.hasClass('reveal-x-right')){
                    transformCommand = 'translateX(0px)';
                }

                if ($object.attr('data-delay')){
                    $delay = $object.attr('data-delay');
                }

                if ($object.attr('data-offset-height')){
                    offsetHeight = objectHeight * $object.attr('data-offset-height');
                }

                //Detect if the element is inview
                if(newScroll + $(window).height() > ($object.offset().top + offsetHeight)){
                    if (transformCommand){
                        TweenMax.to($object, .5, { css: { opacity: 1, transform: transformCommand }, ease: Power2.easeOut, delay: $delay });
                    } else {
                        TweenMax.to($object, .5, { css: { opacity: 1 }, ease: Power2.easeOut, delay: $delay });
                    }
                    $object.addClass('loaded');
                }
            });

            // allow further rAFs to be called
            ticking = false;
        }

        // only listen for scroll events
        window.addEventListener('scroll', onScroll, false);
    }


    return {
        init: init,
        activateScrollProgress: activateScrollProgress
    };
})();
