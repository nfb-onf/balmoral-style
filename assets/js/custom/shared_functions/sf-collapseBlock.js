//Permet de collapser des div comme les crédits de films
var sf_collapseBlock = (function () {
    function init() {
        $("body").on("click",".collapseBlock",function() {

            var $title = $(this);
            var $allTitleInBlock = $title.closest('.collapseBlockContainer').find('.collapseBlock');
            var $containerCollapse = $title.next();
            if ($title.attr('data-block')){
                $containerCollapse = $("#"+$title.attr('data-block'));
            }
            var isMasonry = $containerCollapse.attr('data-isMasonry');
            if (!$allTitleInBlock.hasClass('is-animated')) {
                $allTitleInBlock.addClass('is-animated');
                if (!$title.hasClass('is-collapseBlock-open')) {
                    $title.addClass('is-collapseBlock-open');
                    if ($title.closest('.collapseBlockContainer').length > 0){
                        $title.closest('.collapseBlockContainer').find('.collapseBlock').addClass('is-collapseBlock-open');
                    }

                    if (isMasonry) {
                        $containerCollapse.removeClass('is-masonry').hide();
                    }
                    $containerCollapse.slideDown(function() {
                        $allTitleInBlock.removeClass('is-animated');
                    });
                } else {
                    $title.removeClass('is-collapseBlock-open');
                    if ($title.closest('.collapseBlockContainer').length > 0){
                        $title.closest('.collapseBlockContainer').find('.is-collapseBlock-open').removeClass('is-collapseBlock-open');
                    }
                    $containerCollapse.slideUp(function() {
                        if (isMasonry) {
                            $containerCollapse.addClass('is-masonry').show();
                        }
                        $allTitleInBlock.removeClass('is-animated');
                    });
                }
            }
            return false;
        });
    }



    // Reveal public pointers to1
    // private functions and properties
    return {
        init: init
    };
})();

$('document').ready(function(){
    sf_collapseBlock.init();
});