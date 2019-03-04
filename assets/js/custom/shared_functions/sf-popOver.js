//Permet de collapser des div comme les crédits de films
var sf_popOver = (function () {
    function init() {
        $('.is-popoverLink').each(function(){
            var $monElement=$(this);
            var container=$monElement.attr('data-container');
            var trigger=$monElement.attr('data-trigger');
            if (!trigger){
                trigger="hover click";
            }
            if (container){
               $monElement.popover({ html: true, trigger: trigger, container: container});
            }else{
                $monElement.popover({ html: true, trigger: trigger});
            }
        });

        $(window).on('resize',function(){
            $('.is-popoverLink').popover('hide');
        });
    }



    // Reveal public pointers to1
    // private functions and properties
    return {
        init: init
    };
})();

$('document').ready(function(){
    sf_popOver.init();
});