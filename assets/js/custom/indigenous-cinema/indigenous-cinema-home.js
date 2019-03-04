'use strict';
var indigenousCollectionHome = (function() {
    var options = {};
    var currentPage = 1;
    var $pageLoader = $("#pageLoader");
    var $containerHandlebar = $('#containerHandlebar');
    var $minLabel=$("#production_year_panel .ui-slider-min-label");
    var $maxLabel=$("#production_year_panel .ui-slider-max-label");
    var $productionYearSlider = $("#production_year_slider");
    var $sortByPicker = $('#sortByPicker');
    var alphabeticalMenuLoaded = false;
    var ajaxCallRunning = 0;
    //public filters
    var film_lang = "";
    var first_letter = "";
    var minYear = "";
    var maxYear = "";

    //private filters
    var sort = "";
    var year = "";

    function init(options) {
        indigenousCollectionHome.options = options;
        initPageFilters();
        loadPage();
        initLoadMore();
    }

    function resetPage(){
        currentPage = 1;
        $containerHandlebar.html("");
        $pageLoader.removeClass('hidden');
    }

    var initPageFilters = function(){

        initPageFilters.initFiltersValue = function(){
            //public filters
            indigenousCollectionHome.film_lang = Utils.getQuerystringParameterByName("film_lang") || indigenousCollectionSection.lang;
            indigenousCollectionHome.first_letter = Utils.getQuerystringParameterByName("first_letter") || "a";

            //private filters
            sort = Utils.getQuerystringParameterByName("sort") || "year:desc,title";
            year = Utils.getQuerystringParameterByName("year") || "1917.." + (new Date()).getFullYear();

            initPageFilters.initSortSelectPicker();
            initPageFilters.initSlider();
            indigenousCollectionSection.filters.initFilmLanguageSelectPicker("indigenousCollectionHome", indigenousCollectionHome.options);
        }

        initPageFilters.initSortSelectPicker = function(){
            $sortByPicker.val(sort);

            $sortByPicker.selectpicker({mobile: Utils.isMobile.any()}).change(function () {
                sort = $(this).find("option:selected").val();
                showOrHideAlphabetical(sort);
                resetPage();
                loadPage();
            });

            $('.selectpicker').selectpicker('refresh');
        }

        initPageFilters.updateMinMaxSlider = function(minYear, maxYear){
            $productionYearSlider.slider("option", "min", minYear);
            $productionYearSlider.slider("option", "max", maxYear);
            $productionYearSlider.slider("value", $("#production_year_slider").slider("value"));
        }

        initPageFilters.initSlider = function(){

            var yearSplit = year.split("..");
            minYear = 1917;
            maxYear = (new Date()).getFullYear();
            $minLabel.text(minYear);
            $maxLabel.text(maxYear);
            var valueMinYear = yearSplit[0];
            var valueMaxYear = yearSplit[1];

            $productionYearSlider.slider({
                range: true,
                min: minYear,
                max: maxYear,
                values: [valueMinYear, valueMaxYear],
                slide: function(event, ui) {
                    var $this = $(this);
                    $minLabel.text(ui.values[0]);
                    $maxLabel.text(ui.values[1]);
                },
                change: function(event, ui){
                    var min = ui.values[0];
                    var max = ui.values[1];
                    $minLabel.text(ui.values[0]);
                    $maxLabel.text(ui.values[1]);
                }
            });

            $productionYearSlider.on( "slidestop", function( event, ui ) {
                var min = ui.values[0];
                var max = ui.values[1];
                $minLabel.text(ui.values[0]);
                $maxLabel.text(ui.values[1]);
                year = min + ".." + max;
                resetPage();
                loadPage();
            } );
        }

        initPageFilters.initClear = function(){
            $('#filter_form_clear').click(function(){
                history.replaceState({}, '', window.location.pathname);
                $sortByPicker.selectpicker('destroy').off('change');
                $('#languageSelectPicker').selectpicker('destroy').off('change');
                $productionYearSlider.off('change').off('slidestop').slider( "destroy" );
                initPageFilters.initFiltersValue();
                resetPage();
                loadPage();
            });
        }

        initPageFilters.initFiltersValue();
        initPageFilters.initClear();
        return initPageFilters;
    }

    function showOrHideAlphabetical(sort) {
        var $alphabeticalMenu = $("#alphabeticalMenu");
        var $letterTitle = $("#letterTitle");
        if (sort === "title"){
            $alphabeticalMenu.removeClass("hidden");
            $letterTitle.removeClass("hidden");
        } else {
            $alphabeticalMenu.addClass("hidden");
            $letterTitle.addClass("hidden");
        }
    }

    function setFilterString(){
        var filterString = "&film_lang=" + indigenousCollectionHome.film_lang + "&sort=" + sort + "&year=" + year;
        if (sort === "title"){
            filterString += "&first_letter=" + indigenousCollectionHome.first_letter;
        }
        history.replaceState({}, '', '?' + filterString);
        filterString = filterString.replace("film_lang=all_languages", "film_lang=");
        return filterString;
    }

    function loadPage(){
        var filterString = setFilterString();
        indigenousCollectionHome.options.first_letter = indigenousCollectionHome.first_letter;
        indigenousCollectionHome.options.sort = sort;
        indigenousCollectionHome.options.alphabeticalMenuLoaded = alphabeticalMenuLoaded;

        ajaxCallRunning++;
        $.when(indigenousCollectionSection.loadTemplate(
            "vignette.html",
            indigenousCollectionHome.options.api_prefix + "films?&platform=nfb&tag=indigenous-films&per_page=30&lang=" + indigenousCollectionSection.lang + "&page=" + currentPage + filterString,
            indigenousCollectionHome.options
        )).then(function(htmlTemplate, context){
            ajaxCallRunning--;
            if (ajaxCallRunning ===0){
                $("#plus_card").remove();
                $pageLoader.addClass('hidden');
                if (currentPage === 1){
                    $containerHandlebar.append(htmlTemplate);
                } else{
                    $containerHandlebar.find('ul#movieList').append(htmlTemplate);
                }

                showOrHideAlphabetical(sort);

                if (minYear !== context.meta.year_range.min || maxYear !== context.meta.year_range.max){
                    minYear = context.meta.year_range.min;
                    maxYear = context.meta.year_range.max;
                    initPageFilters.updateMinMaxSlider(minYear, maxYear);
                }

                indigenousCollectionSection.filters.initAlphabeticalMenu(indigenousCollectionHome.first_letter, "indigenousCollectionHome");
            }
        });
    }

    function initLoadMore(){
        $("#containerHandlebar").on("click", ".plusLink", function(){
            $(this).parent().addClass('loading');
            currentPage++;
            loadPage();
            return false;
        });
    }

    return {
        init: init,
        resetPage: resetPage,
        loadPage: loadPage,
        film_lang: film_lang,
        first_letter: first_letter
    };
})();
