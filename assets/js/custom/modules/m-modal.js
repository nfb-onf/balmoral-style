$("document").ready(function(){
    var modalId = "";

    $(window).on("click tap", function(ev) {
        var attr = ev.target.attributes;

        if (attr["data-modal"] && attr["data-modal"].value === "true") {
            ev.preventDefault();

            $("html").removeClass("forceScrollY").addClass("is-modal-open");
            var href = attr.href ? attr.href.value : null;
            var dataTarget = attr["data-target"] ? attr["data-target"].value : null;
            modalId = href || dataTarget;

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
        }

        if (
            (attr["data-closeModal"] && attr["data-closeModal"].value === "true")
            || (attr["data-closemodal"] && attr["data-closemodal"].value === "true")
        ) {
            ev.preventDefault();

            $("html").removeClass("is-modal-open");
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
            var $monFrame = $(modalId).find('iframe');
            var srcActuelle = $monFrame.attr("src");
            $monFrame.attr("src",srcActuelle);

            return false;
        }
    });
});