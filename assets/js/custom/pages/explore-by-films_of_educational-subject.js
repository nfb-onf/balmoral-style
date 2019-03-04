var explore_by_films_of_education_subject = (function () {
    function init() {
        initFilters();
    }

    function initFilters(){
        //dropdown stylisé
        $('.selectpicker').selectpicker({mobile: Utils.isMobile.any()}).on('change', function(){
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
        filter_keyboard.dataBinding = function(){ return $("#alpha_filters_container");};
        filter_keyboard.formBinding = function() { return $("#filter_form"); };

        cards_container.class_identifier = ".vignette";
    }

    return {
        init: init
    };
})();

