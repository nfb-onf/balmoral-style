'use strict';
var indigenousCollectionDirectors = (function() {
    var options = {};
    var $pageLoader = $("#pageLoader");
    var $containerHandlebar = $('#containerHandlebar');
    var alphabeticalMenuLoaded = false;
    //public filters
    var first_letter = "";
    //private filters
    var lang = $('html').attr('lang');
    var film_lang = lang;
    var nation = "";
    var list_by_first_letter = "";

    function init(options) {
        indigenousCollectionDirectors.options = options;

        $.when(initPageFilters()).then(function() {
            loadPage();
        });
    }

    function resetPage(){
        if (alphabeticalMenuLoaded === false){
            $containerHandlebar.html("");
        } else {
            $containerHandlebar.find("#directorsContent").html("");
        }
        $pageLoader.removeClass('hidden');
    }

    function initPageFilters(){
        var loadedDeffered = $.Deferred();
        var initFiltersValue = function(){
            //public filters
            indigenousCollectionDirectors.first_letter = (Utils.getQuerystringParameterByName("first_letter")) ? Utils.getQuerystringParameterByName("first_letter").toLowerCase() : "a";

            //private filters
            nation_slug = Utils.getQuerystringParameterByName("nation_slug") || "all_nations";
            initNationSelectPicker();
        }

        initNationSelectPicker = function(){
            var $nationPicker = $('#nationPicker');

            url = indigenousCollectionDirectors.options.api_prefix + "nations/?platform=nfb&tag=indigenous-films&per_page=999&lang=" + indigenousCollectionSection.lang + "&film_lang=" + indigenousCollectionDirectors.film_lang;

            $.ajax(url).done(function(dataArray) {

                $.each(dataArray.data, function(index, value) {
                    $nationPicker.append($('<option>', {
                        value: value.slug,
                        text: value.name
                    }));
                })

                $nationPicker.selectpicker({mobile: Utils.isMobile.any()}).change(function () {
                    nation_slug = $(this).find("option:selected").val();
                    selected_nation_name = $(this).find("option:selected").html();
                    showOrHideAlphabetical(nation_slug);
                    alphabeticalMenuLoaded = false;
                    resetPage();
                    loadPage();
                });

                $nationPicker.find('option[value^="' + nation_slug + '"]').prop('selected', true);
                $('.selectpicker').selectpicker('refresh');
                selected_nation_name = $nationPicker.find("option:selected").html();
                loadedDeffered.resolve();
            });
        }

        initFiltersValue();
        return loadedDeffered;
    }

    function showOrHideAlphabetical(nation_slug) {
        var $alphabeticalMenu = $("#alphabeticalMenu");
        var $letterTitle = $("#letterTitle");
        if (nation_slug === "all_nations"){
            $alphabeticalMenu.removeClass("hidden");
            $letterTitle.removeClass("hidden");
        } else {
            $alphabeticalMenu.addClass("hidden");
            $letterTitle.addClass("hidden");
        }
    }


    function loadPage(){
        var filterString = "&nation_slug=" + nation_slug;
        if (nation_slug === "all_nations"){
            filterString += "&first_letter=" + indigenousCollectionDirectors.first_letter;
        }
        filterString += "&film_lang=" + indigenousCollectionDirectors.film_lang;

        history.replaceState({}, '', '?' + filterString);
        indigenousCollectionDirectors.options.first_letter = indigenousCollectionDirectors.first_letter;
        indigenousCollectionDirectors.options.alphabeticalMenuLoaded = alphabeticalMenuLoaded;
        indigenousCollectionDirectors.options.nation_slug = nation_slug;
        indigenousCollectionDirectors.options.selected_nation_name = selected_nation_name;
        filterString = filterString.replace("nation_slug=all_nations", "nation_slug=");
        $.when(setListByFirstLetter(nation_slug)).then(function(list_by_first_letter_data){
            indigenousCollectionDirectors.options.list_by_first_letter = list_by_first_letter_data;
            $.when(indigenousCollectionSection.loadTemplate(
                "director_list.html",
                indigenousCollectionDirectors.options.api_prefix + "directors?&platform=nfb&tag=indigenous-films&per_page=999&page=1&lang=" + indigenousCollectionSection.lang + filterString,
                indigenousCollectionDirectors.options
            )).then(function(htmlTemplate){
                $pageLoader.addClass('hidden');
                if (alphabeticalMenuLoaded === false){
                    $containerHandlebar.append(htmlTemplate);
                    $("#alphabeticalMenu").removeClass('hidden');
                    indigenousCollectionSection.filters.initAlphabeticalMenu(indigenousCollectionDirectors.first_letter, "indigenousCollectionDirectors");
                    alphabeticalMenuLoaded = true;
                } else{
                    $containerHandlebar.find("#directorsContent").append(htmlTemplate);
                }

                showOrHideAlphabetical(nation_slug);
            });
        });
    }

    function setListByFirstLetter(nation_slug){
        if (!indigenousCollectionDirectors.list_by_first_letter){
            var deffered = $.Deferred();
            url = indigenousCollectionDirectors.options.api_prefix + "directors/?&platform=nfb&tag=indigenous-films&per_page=999&nation_slug=&lang=" + indigenousCollectionSection.lang + "&film_lang=" + indigenousCollectionDirectors.film_lang;
            $.ajax(url).done(function(dataArray) {

                deffered.resolve(dataArray.meta.list_by_first_letter);
            });
        } else {
            deffered.resolve(indigenousCollectionDirectors.list_by_first_letter);
        }

        return deffered;
    }

    return {
        init: init,
        resetPage: resetPage,
        loadPage: loadPage,
        film_lang: film_lang,
        first_letter: first_letter
    };
})();
