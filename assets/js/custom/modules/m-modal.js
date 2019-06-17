$('document').ready(function(){
    $("[data-modal='true']").on("click tap", function(ev) {
        ev.preventDefault();

        $("html").removeClass("forceScrollY").addClass("is-modal-open");
        var modalId = ($(this).attr('href')==="") ? $(this).attr('data-target') : $(this).attr('href');
        $(modalId).css({
            transition: "opacity 0.5s"
        });
        setTimeout(function() {
            $(modalId).css({
                opacity: 1,
                visibility: "visible",
                display: "block"
            });
        }, 1);
        
        return false;
    });

    $("[data-closeModal='true']").on("click tap", function(ev) {
        ev.preventDefault();

        $("html").removeClass("is-modal-open");
        var $monModal = $(this).closest(".m-modal");
        var modalId = "#" + $monModal.attr("id");
        $(modalId).css({
            opacity: 0
        });
        setTimeout(function() {
            $(modalId).css({
                visibility: "hidden",
                display: "none"
            });
        }, 500);

        //si iframe, reset la source pour éviter que le son joue
        var $monFrame = $monModal.find('iframe');
        var srcActuelle = $monFrame.attr("src");
        $monFrame.attr("src",srcActuelle);

        return false;
    });
});