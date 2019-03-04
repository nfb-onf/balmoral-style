'use strict';
var indigenousCollectionSubjects = (function() {
    var options = {};
    var $pageLoader = $("#pageLoader");
    var $containerHandlebar = $('#containerHandlebar');
    var subject_level = "";
    var switchLanguage = (indigenousCollectionSection.lang === "fr") ? "en" : "fr";
    var switchLanguageProperties = {
        "subject": null,
        "sub_subject": null
    };

    //public filters
    var film_lang = indigenousCollectionSection.lang;

    function init(options) {
        indigenousCollectionSubjects.options = options;
        subject_level = indigenousCollectionSubjects.options.subject_level;
        if (subject_level === 2) {
            initFiltersValue();
        }
        loadPage();
    }

    function resetPage(){
        $containerHandlebar.html("");
        $pageLoader.removeClass('hidden');
    }

    function initFiltersValue(){
        //public filters
        indigenousCollectionSubjects.film_lang = Utils.getQuerystringParameterByName("film_lang") || indigenousCollectionSection.lang;
        indigenousCollectionSection.filters.initFilmLanguageSelectPicker("indigenousCollectionSubjects");
    }

    function loadPage(){
        var url;
        var subject = indigenousCollectionSubjects.options.subject;
        var sub_subject = indigenousCollectionSubjects.options.sub_subject;
        var filterString = "&film_lang=" + indigenousCollectionSubjects.film_lang;
        history.replaceState({}, '', '?' + filterString);
        filterString = filterString.replace("film_lang=all_languages", "film_lang=");
        var urlLevel1 = indigenousCollectionSubjects.options.api_prefix + "subjects/" + subject + "?platform=nfb&category_type=indigenous&per_page=999&tag=indigenous-films&lang=" + indigenousCollectionSection.lang + filterString;

        if (subject_level === 0) {
            url = indigenousCollectionSubjects.options.api_prefix + "subjects/?platform=nfb&tag=indigenous-films&category_type=indigenous&film_lang=en&per_page=999&lang=" + indigenousCollectionSection.lang + filterString;
            loadPageAjax(url);
        }
        else if (subject_level === 1) {
            url = urlLevel1;
            loadPageAjax(url);
        }
        else if (subject_level === 2) {
            $.ajax(urlLevel1).done(function(dataArray) {
                var currentLanguage = indigenousCollectionSection.lang;
                var dataChildren = dataArray.data.children;

                switchLanguageProperties["subject"] = getPropertyByLang(dataArray.data.slug, switchLanguage);

                indigenousCollectionSubjects.options.categoryName = getPropertyByLang(dataArray.data.name, currentLanguage);
                indigenousCollectionSubjects.options.sub_subject_count = dataChildren.length;

                for (var i = 0; i < dataChildren.length; i++) {
                    if (getPropertyByLang(dataChildren[i].slug, currentLanguage) === sub_subject){
                        indigenousCollectionSubjects.options.sub_subject_title = getPropertyByLang(dataChildren[i].name, currentLanguage);
                        indigenousCollectionSubjects.options.film_count = dataChildren[i].film_count;
                        switchLanguageProperties["sub_subject"] = getPropertyByLang(dataChildren[i].slug, switchLanguage);
                    }
                }

                url = indigenousCollectionSubjects.options.api_prefix + "films/?platform=nfb&per_page=999&tag=indigenous-films&sort=title&subject_slug=" + sub_subject + "&lang=" + currentLanguage + filterString;
                loadPageAjax(url);
                //$("#language-switch");
                $('meta[name="description"]').attr("content", indigenousCollectionSubjects.options.traductions.metaDescriptionLevel2 + " " + indigenousCollectionSubjects.options.sub_subject_title);
            });
        }
    }

    function setSwitchLanguageURL () {
        var subjectLevel = indigenousCollectionSubjects.options.subject_level;
        var parser = document.getElementById("language-switch");
        var pathParts = parser.pathname.split("/").slice(1);
        var finalPath;

        // Final path portions
        var collection = pathParts[0];
        var section = pathParts[1];
        var resource;
        var subResource;
        var newParts;

        if (pathParts.length >= 2) {
            resource = pathParts[2];

            if (pathParts.length === 3) {
                subResource = pathParts[3]
            }
        }

        if (subjectLevel === 1 || subjectLevel === 2) {
            resource = switchLanguageProperties["subject"];

            if (subjectLevel === 1) {
                newParts = [collection, section, resource];
            }
            else if (subjectLevel === 2) {
                subResource = switchLanguageProperties["sub_subject"];
                newParts = [collection, section, resource, subResource];
            }
        }
        else {
            newParts = [collection, section];
        }

        finalPath = "/".concat(newParts.join("/"))
        parser.pathname = finalPath;
    }

    function getPropertyByLang (property, language) {
        return property[language];
    }

    function loadPageAjax(url){
        $.when(
            indigenousCollectionSection.loadTemplate("subject_list.html", url, indigenousCollectionSubjects.options)
        ).then(
            function(htmlTemplate, context){
                $pageLoader.addClass('hidden');
                var subjectLevel = indigenousCollectionSubjects.options.subject_level;
                if (subjectLevel === 1){
                    $('title').html(indigenousCollectionSubjects.options.traductions.titleLevel1 + " " + context.data.name + " - " + indigenousCollectionSubjects.options.traductions.endTitle);
                    $('meta[name="description"]').attr("content", indigenousCollectionSubjects.options.traductions.metaDescriptionLevel1 + " " + context.data.name);
                    switchLanguageProperties["subject"] = getPropertyByLang(context.data.slug, switchLanguage);
                }
                else if (subjectLevel === 2){
                    $('title').html(indigenousCollectionSubjects.options.traductions.titleLevel2 + " " + context.options.sub_subject_title + " - " + indigenousCollectionSubjects.options.traductions.endTitle);
                    $('meta[name="description"]').attr("content", indigenousCollectionSubjects.options.traductions.metaDescriptionLevel2 + " " + context.options.sub_subject_title);
                }
                setSwitchLanguageURL();
                $containerHandlebar.append(htmlTemplate);
            }
        );
    }

    return {
        init: init,
        resetPage: resetPage,
        loadPage: loadPage,
        film_lang: film_lang
    };
})();
