//Permet de collapser des div comme les crédits de films
var sf_showOrHideElement = (function () {
    function init() {
        $('body').on("click","[data-showElement]",function(e) {
            var showElement = $(this).attr('data-showElement');
            var $showElement = $(showElement);
            $showElement.removeClass('hidden');
            if ($(this).attr('data-showElement-callback')){
                var callback=$(this).attr('data-showElement-callback');
                if (callback){
                   eval(callback + '();');
                }
            }
            e.preventDefault();
        });

        $('body').on("click","[data-hideElement]",function(e) {
            var hideElement = $(this).attr('data-hideElement');
            var $hideElement;
            if (hideElement === "+this") {
                $hideElement = $(this);
            } else {
                $hideElement = $(hideElement);
            }
            $hideElement.addClass('hidden');
            if ($(this).attr('data-hideElement-callback')){
                var callback=$(this).attr('data-hideElement-callback');
                if (callback){
                   eval(callback + '();');
                }
            }
            e.preventDefault();
        });
    }



    // Reveal public pointers to1
    // private functions and properties
    return {
        init: init
    };
})();

$('document').ready(function(){
    sf_showOrHideElement.init();
});