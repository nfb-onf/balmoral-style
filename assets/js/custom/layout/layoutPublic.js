var public_layout = (function() {
    var $html = $("html");
    var $generalContainer = $("#l-generalContainer");
    var $leftNav = $("#l-leftNav");



    function init() {
        //resize
        resizeWindow();

        //utilities
        scrollToAnchor();
        greyTooltip();
        watchLater();
        rollOverJaquette();
        shareBar();
        masonry();
        fitImageInContainer();
        openPopUp();
        initTabs();
        initLanguageSwitch();

        //carousel + THUMBNAILS
        initcarouselAndThumbnails();

        validateGeneralInfos();


        //call les bonnes fonctions relatives Ã  une page
        var nomTemplate = $('body').attr('id');
        if (nomTemplate !== '' && window[nomTemplate] && typeof(window[nomTemplate].init) === 'function') {
            window[nomTemplate].init();
        }

        //classe mobile ou desktop
        if (Utils.isMobile.any()) {
            $html.addClass('is-mobile');
        } else {
            $html.addClass('is-desktop');
        }

        //classe navigateur
        $html.addClass(Utils.whichBrowser());
    }


    ////////////////////////////////////////////////
    //RESIZE
    ////////////////////////////////////////////////
    function resizeWindow() {
        $(window).on("resize", function() {
            $("#l-generalContainer").removeClass("is-activated");
            resizecarousel();
            resizeThumbnails();
            resizeInfiniteCarousel();
            $('#l-mainPageContent').addClass('is-loaded');

            //permet de triggerer un event quand le resize est terminé
            //Utiliser entre autre pour afficher le bon nombre de lien dans le widget de blog
            if(this.resizeTO) clearTimeout(this.resizeTO);
            this.resizeTO = setTimeout(function() {
                $(this).trigger('resizeEnd');
            }, 500);
        }).trigger('resize');
    }



    //fait en sorte que les vignettes sont des carrés
    function resizecarousel() {
        var $vignettes = $('.containercarousel .vignette, .containercarousel .vignetteIntro, .containercarousel .vignetteSeeAll');
        var $vignetteSeeAll = $('.containercarousel .vignetteSeeAll, .containercarousel .vignetteIntro');
        var imgVignette = imagesLoaded($vignetteSeeAll);
        imgVignette.on('always', function() {
            $vignettes.css('height', '');
            $vignetteSeeAll.each(function() {
                var vignettesHeight = $(this).closest('.containercarousel').find('.vignette:visible:last-child').outerHeight() + 'px';
                $(this).css('height', vignettesHeight);
            });
        });
    }

    function resizeThumbnails() {
        //largeur de la colonne de droite des vignettes payante
        var $containerThumbnails = $('.thumbnailsList,.bookmarksList');
        var $payantThumbailsList = $containerThumbnails.find('.payant');
        var $imgpayantThumbailsList = $('.containerScreenshot img:first-child', $payantThumbailsList);
        var imgPayantLoaded = imagesLoaded($imgpayantThumbailsList.eq(0));
        imgPayantLoaded.on('always', function() {
            var largeurVignette = $payantThumbailsList.eq(0).width();
            var hauteurVignette = $payantThumbailsList.eq(0).height();
            var hauteurVignetteAvecPadding = $payantThumbailsList.eq(0).outerHeight() - 22;
            /*On ajoute la largeur pour firefox qui a un a trop large si on ne l'ajoute pas. Donc le play au hover se retrouve mal aligné*/
            var largeurVignetteAvecPadding = hauteurVignetteAvecPadding * 800 / 1200;
            $imgpayantThumbailsList.css({'height':hauteurVignetteAvecPadding + 'px','width':largeurVignetteAvecPadding + 'px'});
            $('.containerScreenshot', $payantThumbailsList).css('visibility', 'visible');
            var largeurImg = $imgpayantThumbailsList.eq(0).width();
            var largeurInfosDroite = largeurVignette - largeurImg;
            $containerThumbnails.find(' .payant .infosDroite').css({
                'width': largeurInfosDroite + 'px'
            });
            $containerThumbnails.find('.thumbnailsList .payant .infosDroiteTop').css({
                'height': hauteurVignette + 'px'
            });

            //pour les bookmarks
            if ($('html').attr('first-load-done') !== "true") {
                masonry();
                $('html').attr('first-load-done', "true");
            }
        });
    }

    function resizeInfiniteCarousel(){
        $('.carousel-inner').each(function(){
            var $monCarousel=$(this);
            if ($monCarousel.closest('.interactive-carousel').length==0){
                var size="xs";
                if (window.matchMedia("(min-width: 768px)").matches) {
                    size="sm";
                }
                if (window.matchMedia("(min-width: 990px)").matches) {
                    size="md";
                }
                if (window.matchMedia("(min-width: 1200px)").matches) {
                    size="lg";
                }
                if (window.matchMedia("(min-width: 1440px)").matches) {
                    size="xl";
                }
                if (size!==$monCarousel.attr('data-current-size')){
                    $monCarousel.attr('data-current-size',size);

                    var activeIndex=$('.active',$monCarousel).index()+1;
                    var nbActiveLi=$('.active li',$monCarousel).length;
                    var firstLiActive=((activeIndex-1)*nbActiveLi);
                    $('ul.item li',$monCarousel).unwrap();
                    var $lis = $("> li",$monCarousel);
                    var classLi=$lis.attr('class');
                    if (classLi){
                        var numberByRow=getNumberOfItemByRow(size,classLi,$monCarousel);
                        for(var i = 0; i < $lis.length; i+=numberByRow) {
                          $lis.slice(i, i+numberByRow).wrapAll("<ul class='item'></ul>");
                        }
                        $('li:eq('+firstLiActive+')',$monCarousel).parent().addClass('active');
                        showOrHideControls($monCarousel.parent());
                    }else{
                        $monCarousel.hide();
                    }
                }
            }
        });
    }


    ////////////////////////////////////////////////
    //UTILITIES
    ////////////////////////////////////////////////

    //scroll à une ancre
    function scrollToAnchor() {
        $("body").on("click", 'a[data-scrollToAnchor="true"]', function(){
            var anchorLink = $(this).attr('href');
            Utils.scrollToId($(anchorLink), 1000, "easeInOutQuint");
            return false;
        });
    }

    function greyTooltip(){
        var $watchLaterTooltipContainer = $("#greyTooltipContainer");
        var $watchLater = $('.watchLater');
        var $greyTooltipContainer = $('.is-greyTooltip');

        $greyTooltipContainer.tooltip({
            placement: 'top',
            container: '#greyTooltipContainer'
        });

        //tooltip
        $watchLater.each(function() {
            var $monLien = $(this);
            if ($monLien.closest($(".m-options-right")).length===0){
                if ($monLien.hasClass('is-checked')) {
                $monLien.attr('data-original-title', $watchLaterTooltipContainer.attr('data-text-added'));
                } else {
                    $monLien.attr('data-original-title', $watchLaterTooltipContainer.attr('data-text-watch'));
                }
            }
        });
    }

    function watchLater() {
        var $watchLaterTooltipContainer = $("#greyTooltipContainer");
        var $watchLater = $('.watchLater');

        //clic du watch later
        /*$watchLater.click(function() {
            var $monLien = $(this);
            $(this).toggleClass('is-checked');
            var $watchLaterTooltip = $watchLaterTooltipContainer.find('.tooltip');
            $watchLaterTooltip.addClass('no-transition');

            $(this).tooltip('hide');
            if ($(this).hasClass('is-checked')) {
                $watchLaterTooltipContainer.addClass('is-checked');
                if ($(this).closest($(".m-featured")).length>0 ) {
                    $watchLaterTooltipContainer.addClass('featured-tooltip');
                }
                $monLien.attr('data-original-title', $watchLaterTooltipContainer.attr('data-text-added'));
            } else {
                if ($(this).closest($(".m-featured")).length>0 ) {
                    $watchLaterTooltipContainer.removeClass('featured-tooltip');
                }
                $watchLaterTooltipContainer.removeClass('is-checked');
                $monLien.attr('data-original-title', $watchLaterTooltipContainer.attr('data-text-watch'));
            }
            $(this).tooltip('show');
            $watchLaterTooltip.removeClass('no-transition');

            return false;
        });*/

        //permet de mettre une couleur bleu au tooltip si le film est déjà dans la playlist
        $watchLater.hover(function() {
            if ($(this).hasClass('is-checked')) {
                $watchLaterTooltipContainer.addClass('is-checked');
            } else {
                $watchLaterTooltipContainer.removeClass('is-checked');
            }
            //jaune si on est dans un feature
            if ($(this).closest($(".m-featured")).length>0 ) {
                $watchLaterTooltipContainer.addClass('featured-tooltip');
            }else{
                $watchLaterTooltipContainer.removeClass('featured-tooltip');
            }
        });

        //hover
        $('html').on("mouseenter", ".watchLater", function() {
            //ajoute un id pour firefox qui ne fonctionne pas avec une classe
            $('.aiguille', $(this)).attr('id', 'aiguille1MouseEnter');
            $('.aiguille2', $(this)).attr('id', 'aiguille2MouseEnter');

            TweenMax.to("#aiguille1MouseEnter", 0.5, {
                rotation: "360_cw",
                transformOrigin: "50% 87.5%"
            });
            TweenMax.to("#aiguille2MouseEnter", 0.5, {
                rotation: "30_cw",
                transformOrigin: "13.5% 50%"
            });
        });

        $('html').on("mouseleave", ".watchLater", function() {
            var $aiguille1 = $('.aiguille', $(this));
            var $aiguille2 = $('.aiguille2', $(this));
            TweenMax.to("#aiguille1MouseEnter", 0.5, {
                rotation: "0_ccw"
            });
            TweenMax.to("#aiguille2MouseEnter", 0.5, {
                rotation: "0_ccw"
            });
            $aiguille1.attr('id', '');
            $aiguille2.attr('id', '');
        });
    }

    function rollOverJaquette() {
        //roll-over sur les jaquettes

        $('html').on("mouseover",'.containerPochette,.containerScreenshot,.titre,.priceTag', function(){
            var $container = $(this).closest('.vignette,article');
            $container.addClass('is-hoverPlay');
            TweenLite.to($container.find('.containerScreenshot img'), 0.3, {
                autoAlpha: 0.25
            });
        });
        $('html').on("mouseleave",'.containerPochette,.containerScreenshot,.titre,.priceTag', function(){
            var $container = $(this).closest('.vignette,article');
            $container.removeClass('is-hoverPlay');
            setTimeout(function() {
                if (!$container.hasClass('is-hoverPlay')) {
                    TweenLite.to($container.find('.containerScreenshot img'), 0.3, {
                        autoAlpha: 1
                    });
                }
            }, 5);
        });
    }

    function shareBar() {
        if (Utils.isMobile.any()) {
            $('.m-shareBar .shareLink').click(function() {
                $(this).parent().addClass('is-active');
                return false;
            });
        } else {
            $('.m-shareBar .shareLink').hover(function() {
                $(this).parent().addClass('is-active');
            });
            $('.m-shareBar').hover(function(e) {
                if ($(e.target).is('.shareLink')) {
                    $(this).addClass('is-active');
                }
            }, function() {
                $(this).removeClass('is-active');
            });
        }
    }

    function masonry() {
        $('.masonryContainer').each(function() {
            var $containerMasonry = $(this);
            $containerMasonry.masonry({
                resize: true,
                transitionDuration: 0,
                itemSelector: '.masonry-block',
                gutter: 0
            });
        });
    }

    function fitImageInContainer(){
        $(window).on("resize",function(){
            $('img[data-fit-image-in-container]').each(function(){
                var $image=$(this);
                var ratioW=$image.attr('data-fit-image-in-container-ratio-w');
                var ratioH=$image.attr('data-fit-image-in-container-ratio-h');
                var $parent=$("#"+$image.attr('data-fit-image-in-container'));

                Utils.fitImageInContainer($image, $parent, ratioW/ratioH);
            });
        }).trigger('resize');
    }

    function openPopUp(){
        $("[data-popUp='true']").on("click",function(){
            var width= 558;
            var height=558;
            var scrollbars=true;
            var link=$(this).attr('href');
            var popup = window.open(link, "name", "height=" + height + ", width=" + width + ", scrollbars=" + scrollbars);
            if (window.focus) {
                popup.focus();
            }
            return false;
        });
    }



    function initTabs(){
        $('.m-tabs > ul li a').click(function(){
            var $bandeTabs=$(this).closest('.m-tabs');
            $bandeTabs.find('> ul li').removeClass('active');
            $(this).parent().addClass('active');
            var currentTab = $(this).attr('href');
            $('> div',$bandeTabs).hide();
            $(currentTab).show();
            $(".titreDotDotDot",$bandeTabs).trigger("update");
            return false;
        });

        $('.m-tabs > ul li a').each(function(){
            if ($(this).attr('href') === window.location.hash){
                $(this).click();
            }
        });
    }

    ////////////////////////////////////////////////
    //carousel + THUMBNAILS
    ////////////////////////////////////////////////
    function initcarouselAndThumbnails() {
        /////////////////carousel//////////////////////
        //navigation prev+next
        $('.is-limite .nextcarousel').click(function() {
            var $mycarouselRow = $(this).closest('.containercarousel');
            $mycarouselRow.addClass('is-ended');
            trackCarouselScroll($mycarouselRow, 'next', 2);
            return false;
        });

        $('.is-limite .prevcarousel').click(function() {
            var $mycarouselRow = $(this).closest('.containercarousel');
            $mycarouselRow.removeClass('is-ended');
            trackCarouselScroll($mycarouselRow, 'prev', 1);
            return false;
        });

        /////////////////THUMBNAILS//////////////////////
        //... multiligne sur les thumbnails de film payant
        $('.titreDotDotDot').dotdotdot({
            watch: 'window'
        });

        //carousel infini
        $('.carousel').carousel({
            interval: false,
            wrap: false
        });

        var slide = false;

        $('.carousel').bind('slide.bs.carousel', function (event) {
            var $this = $(this);
            var $target = $(event.relatedTarget);
            slide = true;
            $this.addClass('noTransition');
            fetchNextCarouselElements($this, $target);
            var direction= "next";
            if (event.direction==="right"){
                direction= "prev";
            }
            var pageNumber = $target.prevAll().length + 1;
            trackCarouselScroll($this, direction, pageNumber);
        });

        $('.carousel').bind('slid.bs.carousel', function (event) {
            var $this = $(this);
            slide = false;
            setTimeout(function () {
                if (slide===false){
                  $this.removeClass('noTransition');
                }

            },500);
            showOrHideControls($this);
        });

        $('.carousel').each(function () {
            var $carousel = $(this);
            var carouselName = $carousel.attr('data-carouselname') || $carousel.attr('data-channelname');
            $carousel.on('click', 'a[href^="/film/"]', function (event) {
                var tracker = (typeof _gat === 'object') && _gat._getTrackerByName();
                if (tracker) {
                    event.preventDefault();
                    var url = $(this).attr('href');
                    var filmSlug = url.slice(6);
                    var label = (carouselName ? carouselName + ' ' : '') + 'click ' + filmSlug;
                    tracker._trackEvent('UI-UX', 'carousel', label);
                    window.location = url;
                }
                else {
                    window.location = url;
                }
            });
        });

    }

    function trackCarouselScroll($carousel, direction, pageNumber) {
        var carouselName = $carousel.attr('data-carouselname') || $carousel.attr('data-channelname');
        var label = (carouselName ? carouselName + ' ' : '') + 'scroll ' + direction + ' ' + pageNumber;
        _gaq.push(['_trackEvent', 'UI-UX', 'carousel', label, screen.width]);
    }

    var channelsFetchingElements = {};
    function fetchNextCarouselElements($carousel, $nextCardGroup) {
        var channelName = $carousel.attr('data-channelname');
        if (!channelName) {
          return;
        }
        var maxItems = parseInt($carousel.attr('data-max-items'));
        var cardCount = $carousel.find('ul.item > li').length;
        var cardsPerGroup = $carousel.find('ul.item').first().find('li').length;
        var futureCardsCount = $nextCardGroup.nextAll().andSelf().find('li').length;
        if (futureCardsCount < 8 && !channelsFetchingElements[channelName]) {
            channelsFetchingElements[channelName] = true;
            $.get('/remote/carousel_slice/' + channelName + '/', {offset: cardCount, limit: 8, maxItems: maxItems})
                .always(function () {
                    channelsFetchingElements[channelName] = false;
                })
                .done(function (data) {
                    receiveNextCarouselElements($carousel, data);
                });
        }
    }

    function receiveNextCarouselElements($carousel, data) {
        var $newCards = $(data).filter('li');
        var newCardsCount = $newCards.length;
        if (newCardsCount > 0) {
            var cardsPerGroup = $carousel.find('ul.item').first().find('li').length;
            var $lastGroup = $carousel.find('ul.item').last();
            var cardsInLastGroup = $lastGroup.find('li').length;
            var cardsForLastGroup = cardsPerGroup - cardsInLastGroup;
            $lastGroup.append($newCards.slice(0, cardsPerGroup - cardsInLastGroup));
            for (var i = cardsPerGroup - cardsInLastGroup; i < newCardsCount; i += cardsPerGroup) {
                var $newGroup = $('<ul class="item"></ul>');
                $newGroup.append($newCards.slice(i, i + cardsPerGroup));
                $newGroup.insertAfter($lastGroup);
                $('.titreDotDotDot').dotdotdot({
                    watch: 'window'
                });
                resizecarousel();
                $lastGroup = $newGroup;
            }
        }
        showOrHideControls($carousel);
    }

    function showOrHideControls($this){
        var channelName = $this.attr('data-channelname');
        var fetching = channelsFetchingElements[channelName];
        var $prev = $this.find('.prevcarousel');
        var $next = $this.find('.nextcarousel');
        if (fetching || !$('.carousel-inner .item:last', $this).hasClass('active')) {
            $next.show();
        }
        else {
            $next.hide();
        }
        if (!$('.carousel-inner .item:first',$this).hasClass('active')) {
            $prev.show();
        }
        else {
            $prev.hide();
        }
    }

    function getNumberOfItemByRow(windowSize,classLi,$monCarousel){
        var sizeArray=['xl','lg','md','sm','xs'];
        var startAt=sizeArray.indexOf(windowSize);
        var currentClassSize='xs';
        var numberByRow=1;
        for(var i = startAt; i < sizeArray.length; i++) {
            if ($('[class*=col-'+sizeArray[i]+']',$monCarousel).length>0){
                currentClassSize=sizeArray[i];
                break;
            }
        }

        var positionClass=classLi.indexOf('col-'+currentClassSize+'-');
        if (positionClass!==-1){
            var grilleCourante=classLi.substring(positionClass+7,positionClass+9);
            numberByRow=12/grilleCourante;
        }
        return numberByRow;
    }

    ////////////////////////////////////////////
    //validation des formulaires standard
    ///////////////////////////////////////////
    function validateGeneralInfos() {
        var localValidation=['en_US'];
        if ($('html').attr('lang')=="fr"){
            localValidation=['fr_FR'];
        }
        var $serveurErrorInContext=$('.server-error-in-context');
        if ($("form[data-validate='true']").length>0){
            $("form[data-validate='true']").formValidation({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                locale: localValidation,
                live: 'enabled',
                submitButtons: 'button[type="submit"]',
                excluded: [':disabled'],
                verbose: false,
                trigger: "blur"
            }).on('success.validator.fv', function() {
                $serveurErrorInContext.remove();
            }).on('err.validator.fv', function() {
                $serveurErrorInContext.remove();
            });
        }


        //ajout de l'icone x quand il y a des erreurs serveur
        $('.server-error-in-context').parent().find('i').addClass('glyphicon glyphicon-remove server-error-in-context').show();
    }


    // Reveal public pointers to
    // private functions and properties
    return {
        init: init,
        greyTooltip : greyTooltip
    };

    ////////////////////////////////////////////
    // LANGUAGE SWITCH
    ///////////////////////////////////////////
    function initLanguageSwitch() {
        if (typeof(_gaq) !== 'undefined'){
            _gaq.push(function() {
                $('#language-switch').click(function() {
                    var tracker = _gat._getTrackerByName();
                    var languageSwitch = document.getElementById('language-switch');
                    var currentLanguage = $('html').attr('lang');
                    var label = currentLanguage == 'fr' ? 'French to English' : 'English to French';
                    tracker._trackEvent('UI-UX', 'language-switch', label);
                    tracker._link(this.href);
                });
            });
        }
    }

})();

$('document').ready(function() {
    public_layout.init();
});

//Update dot dot dot une fois la fonte loadé
document.onreadystatechange = function() {
    if (document.readyState === 'complete'){
        $(".titreDotDotDot").trigger("update");
    }
};