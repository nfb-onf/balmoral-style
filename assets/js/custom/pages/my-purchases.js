var my_purchases_page = (function () {
    var causeRepaintsOn = $(".vwResize");

    function init(){
        $(window).on("resize",function(){
            Utils.resizeVW(causeRepaintsOn);
        }).trigger('resize');

        purchaseClickOrHover();
        $('.icon-dto-disk-link').click(function(){
            var $this=$(this);
            var $overlay=$this.closest('.vignette').find('.overlayResolution');
            $this.toggleClass('active');
            if ($this.attr('overlay-open')==='true'){
                TweenMax.to($overlay, 0.3, {autoAlpha:0});
                $this.attr('overlay-open','false');
            }else{
                TweenMax.to($overlay, 0.3, {autoAlpha:1});
                $this.attr('overlay-open','true');
            }

            return false;
        });

        filterResults();

        showProductType(get_product_in_hash());
        $('#filterSelect').val(document.location.hash);
        $('#filterSelect').selectpicker('refresh');

        if ("onhashchange" in window) {
            $(window).bind('hashchange', function(e) {
                showProductType(get_product_in_hash());
            });
        }

        $(window).on('resize', addClear);
        $(".overlayResolution").one("mouseenter", loadMetaData);
    }

    function loadMetaData(){
        $(this).find(".download-url").each(function(i, a){
            var link = $(a);
            function handle(data) {
                link.attr("href", data.url);
                link.html("<strong>"+link.data("description")+"</strong> ("+data.filesize+")");
            }
            $.getJSON(link.data("endpoint"), handle);
        });
    }

    function purchaseClickOrHover(){
        //si on est sur mobile
        if ($('html').hasClass('touch')){
            $('.containerImg').click(function(){
                TweenMax.to($(this).find('.overlayResolution'), 0.3, {autoAlpha:1});
                return false;
            });

            $('.containerImg a').click(function(){
                event.stopPropagation();
            });

            $('body').click(function(e){
                if (e.target!==$('.containerImg')){
                    TweenMax.to($('.overlayResolution:visible'), 0.3, {autoAlpha:0});
                }
            });
        }
        //si on est sur desktop
        else{
            $('.containerImg').hover(function(){
                TweenMax.to($(this).find('.overlayResolution'), 0.3, {autoAlpha:1});
                return false;
            },function(){
                TweenMax.to($(this).find('.overlayResolution:visible'), 0.3, {autoAlpha:0});
            });
        }
    }

    function filterResults(){
        //dropdown stylisé
        $('#filterSelect').selectpicker({mobile: Utils.isMobile.any()}).on('change', function(){
            var selected = $('#filterSelect').val();
            window.location = selected;
        });
    }

    function showProductType (product) {
        if (product === "all") {
            $(".vignette").show();
        }
        else {
            $(".vignette").hide();
            $("."+product).show();
        }
        addClear();
    }

    function get_product_in_hash() {
        var product = String(document.location.hash).replace('#', '');
        return (product === "") ? "all" : product;
    }

    function addClear(){
        var nbParRangee=2;
        if (window.matchMedia("(min-width: 1440px)").matches) {
            var nbParRangee=6;
        }
        else if (window.matchMedia("(min-width: 990px)").matches) {
            var nbParRangee=4;
        }
        else if (window.matchMedia("(min-width: 768px)").matches) {
            var nbParRangee=3;
        }

        $('.vignette:visible').each(function(i){
            if (i%nbParRangee == 0){
            $(this).addClass('clear');
            } else {
            $(this).removeClass('clear');
            }
        });
    }


    return {
        init: init
    };
})();
