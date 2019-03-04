var explore_all_films = (function () {
    function init() {
        initTooltip();
        initFilters();
        initLetterNav();
    }

    function initTooltip(){
        //tooltip du safesearch
        $('.is-tooltipLink').tooltip({ html: true });
    }

    function initFilters(){
        //dropdown stylisé
        $('.selectpicker').selectpicker({mobile: Utils.isMobile.any()}).on('change', function(){
            var filterSelectedText = $(this)
                .find("option:selected")
                .map(function(){return this.text})
                .toArray()
                .join(', ');
            var filterTitle = $(this).attr("title");
            _gaq.push(['_trackEvent', 'UI-UX', 'Filtre',  'Explore By - '+ filterTitle + ' - ' + filterSelectedText]);
            applyAjaxFiltersOnChange($("#filter_form"), post_url);
            changeLanguageNote();
        });
        // set paginator and page_plus object dom binding for manipulation
        paginator.data_binding = $("#next_page_plus");
        page_plus.html_binding = $("#plus_card");
        page_plus.loading_binding = $("#plus_card .loading");
        page_plus.link_binding = $("#more_films_link");
        page_plus.data_to_submit =  $("#filter_form");

        result_message.binding = function(){ return $("#id_error_result_message"); };
        result_count.data_binding = function (){ return $("#id_count_result"); };
        cards_container.binding = function (){ return $("ul#id_explore_thumbs_container > li");};
        cards_container.class_identifier = ".vignette";

        // keyboard
        filter_keyboard.dataBinding = function (){ return $("#alpha_filters_container");};
        filter_keyboard.formBinding = function() { return $("#filter_form"); };

        cards_container.class_identifier = ".vignette";

        showPlusCardIfPaginatorHasNext(isPlusCard);

        //renvoi les infos si on sélectionne un input (safe search)
        $("#filter_form input").change(function(){
            var selectedCheckbox = $(this).is(":checked");
            applyAjaxFiltersOnChange($("#filter_form"), post_url);
            _gaq.push(['_trackEvent', 'UI-UX', 'Filtre',  'Explore By - '+ $(this).attr('title')+ ' - ' + selectedCheckbox]);
            return true;
        });
    }

    //navigation par lettre
    function initLetterNav(){
       $('#l-rightContentSide').on('click', '.filter_letter', function (){
            $('.filter_letter').parent().removeClass('selected');
            $(this).parent().addClass('selected');
            filter_keyboard.alphaKeyboardClick(this, post_url);
            $("#selectedLetter").text($(this).text());
            return false;
        });
    }

    return {
        init: init
    };
})();
