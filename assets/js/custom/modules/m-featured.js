var m_featured = (function () {
    var $imgBackground=$("#l-background > img");
    var $bgBanner=$(".m-featured #bgBanner");

    function init() {
        if ($('a[data-linkFeatured="true"]').length>0){
            rollOverJacket();
        }
        var imgVignette = imagesLoaded($(".m-featured #mFeaturePrincipalImg"));
        imgVignette.on('always', function() {
            resizeBackground();
        });
    }

    function rollOverJacket(){
       $('a[data-linkFeatured="true"]').mouseover(function(){
            $(this).closest('.m-featured').addClass('is-hoverPlay');
       });

       $('a[data-linkFeatured="true"]').mouseleave(function(){
            $(this).closest('.m-featured').removeClass('is-hoverPlay');
       });
    }

    function resizeBackground(){
        var throttleTimeoutBandeau;
        $(window).on("resize",function(){
            if (!throttleTimeoutBandeau) {
                throttleTimeoutBandeau = setTimeout(function(){
                    var offsetFilmContent=$(".m-featured .l-blocBlanc").offset().top - $("#l-mainPageContent").offset().top - 40;
                    $("#l-background").css('height',offsetFilmContent+'px');
                    throttleTimeoutBandeau = null;
                    if ($imgBackground.length>0){
                    Utils.fitImageInContainer($imgBackground, $("#l-background"), 704/396);
                    $("#l-background").removeClass('opacity0');
                    }
                    throttleTimeoutBandeau = null;
                },50);
            }
        }).trigger('resize');
    }


    // Reveal public pointers to
    // private functions and properties
    return {
        init: init,
    };
})();

$('document').ready(function(){
    if ($('.m-featured').length>0){
      m_featured.init();
    }
});