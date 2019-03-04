'use strict';
var indigenousCollectionSection = (function() {
    var lang = $('html').attr('lang');

    var filters = function(){
        filters.initFilmLanguageSelectPicker = function(page, options){
            var $languageSelectPicker = $('#languageSelectPicker');

            $languageSelectPicker.val(window[page].film_lang);

            $languageSelectPicker.selectpicker({mobile: Utils.isMobile.any()}).change(function () {
                window[page].film_lang = $(this).val();
                window[page].resetPage();
                window[page].loadPage();
                filters.changeLanguageNote(options);
            });


            $languageSelectPicker.selectpicker('refresh');
            filters.changeLanguageNote(options);
        }


        filters.changeLanguageNote = function(options){
            var $languageActive=$("#languageActive");
            if ($languageActive.length > 0){
                if ($('select[name="language"] option:selected').val() === "en"){
                $languageActive.text(options.traductions.noteLanguageEn);
                }else if ($('select[name="language"] option:selected').val() === "fr"){
                    $languageActive.text(options.traductions.noteLanguageFr);
                }else{
                    $languageActive.text(options.traductions.noteLanguageAll);
                }
            }
        }


        filters.initAlphabeticalMenu = function(initial_first_letter, page){
            $("a[data-letter='" + initial_first_letter + "']").parent().addClass('selected');
            var $letterLink = $(".filter_letter");
            $letterLink.click(function(){
                $("#alphabetical_filter .filter").removeClass("selected");
                $(this).parent().addClass('selected');
                window[page].first_letter = $(this).attr('data-letter');
                window[page].resetPage();
                window[page].loadPage();
                return false;
            });
        }

        return filters;
    }

    function loadTemplate(templateName, json, options){
        var loadedDeffered = $.Deferred();
        $.when(loadJson(json)).then(function(dataArray) {
            Handlebars.partials = Handlebars.templates;
            var template = Handlebars.templates[templateName];
            var context = dataArray;
            context.options = options;
            context.lang = lang;
            var htmlTemplate = template(context);
            loadedDeffered.resolve(htmlTemplate, context);
        });
        return loadedDeffered;
    }

    function loadJson(json){
        var loadedDeffered = $.Deferred();
        $.ajax(json).done(function(dataArray) {
            loadedDeffered.resolve(dataArray);
        })
        .fail(function() {

        });
        return loadedDeffered;
    }

    return {
        loadTemplate: loadTemplate,
        filters: filters(),
        lang: lang
    };
})();