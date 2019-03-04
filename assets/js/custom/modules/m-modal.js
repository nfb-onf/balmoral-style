var m_modal = (function () {
    function init() {
        openModal();
        closeModal();
    }

    function openModal() {
        $("body").on("click","[data-modal='true']",function(){
            var modalId = ($(this).attr('href')==="") ? $(this).attr('data-target') : $(this).attr('href');
            TweenMax.to($(modalId), 0.5, {
                autoAlpha: 1,
                display: 'block',
                onComplete: function() {
                    if (!Utils.isMobile.any()) {
                        $('html').removeClass('forceScrollY').addClass('is-modal-open');
                    }
                }
            });
            return false;
        });
    }


    function closeModal() {
        $("body").on("click","[data-closeModal='true']",function(){
            var $monModal = $(this).closest('.m-modal');
            $('html').removeClass('is-modal-open');

            //si iframe, reset la source pour éviter que le son joue
            var $monModal = $(this).closest('.m-modal');
            var $monFrame = $monModal.find('iframe');
            var srcActuelle=$monFrame.attr("src");
            $monFrame.attr("src",srcActuelle);

            TweenMax.to($monModal, 0.5, {
                autoAlpha: 0,
                display: 'none',
                onComplete: function() {

                }
            });
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
    m_modal.init();
});