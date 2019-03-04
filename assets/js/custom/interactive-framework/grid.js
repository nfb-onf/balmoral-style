'use strict';
var interactiveFrameworkGrid = (function () {
    function init(){
        initHover();
        initFilterSearchBar();
        $(window).on("resize",function(){
            checkIfOverflows();
        }).trigger('resize');
        initSearch();
    }

    function openGridPage(){
        if (Utils.isMobile.iOS()) {
            var postToIframeVar = {
                'action': 'scrollToAnchor',
                'nbPixels': 0
            };
            top.postMessage(postToIframeVar, '*');
        } else {
            Utils.scrollToId($('body'), 1000, "easeInOutQuint");
        }
        framework.loadTemplate(
            "grid.html",
            framework.json_root_url + "list.json"
        );
    }

    function initHover(){
        $('.titreDotDotDot').dotdotdot({
            watch: 'window'
        });

        var tl = "";
        $('ul.projectList a').hoverIntent(function(){
            var $title = $(this).find('.title'),
            $overlay = $(this).find('.overlay'),
            $barType = $(this).find('.barType'),
            $bar = $(this).find('.barType > .bar'),
            $types = $(this).find('.barType > span.types'),
            $descriptionContainer = $(this).find('.descriptionContainer'),
            elementHeightAndPaddingBottom = $(this).height() + parseInt($(this).css('padding-bottom')),
            elementOuterHeight = $(this).outerHeight(),
            barPosition = elementOuterHeight - 73;
            tl = new TimelineLite({});

            tl.fromTo($title, 0.2,  { opacity:1}, { opacity: 0});
            tl.to($overlay, 0.4, {ease: Power2.easeInOut, height: elementHeightAndPaddingBottom, backgroundColor: '#e5e6e7'});
            tl.to($barType, 0.4, {ease: Power2.easeInOut, bottom: barPosition}, "-=0.3");
            tl.to([$types,$descriptionContainer], 0.2, {opacity:1});
            tl.to($bar, 0.5, {ease: Power2.easeInOut, width: '100%'});
            tl.play();
        },function(){
            tl.reverse();
        });
    }

    function initFilterSearchBar(){
        $('.discoverLabel').click(function(){
            $('.discoverLabel').removeClass('selected');
            $(this).addClass('selected');
        });

        $("filtersMobileLink").click(function(){
            $('body, html').css('overflow-y','hidden');
        });

        $("#filtersOverlay .closeOverlay").click(function(){
            $('body, html').css('overflow-y','');
        });

        $(".filterLabel").click(function(e){
            var $sectionFilter = $(this).closest('.filterBar');
            var $openFilterLink = $("#" + $sectionFilter.attr('id').replace('Bar','Link'));
            var $allFilter = $sectionFilter.find('.filterAllLabel');
            var $filtersMobileLink = $("#filtersMobileLink");

            //unselect all filters and the categories (Project Type/Topics) and selects "ALL"
            $('.filterLabel').not(this).removeClass('selected');
            $('.filterAllLabel').addClass('selected');
            $("#projectTypeLink, #topicsLink").removeClass('selected');

            $(this).toggleClass('selected');

            //if no filter selected, reselect "ALL" and unselect the category
            if ($sectionFilter.find('.filterLabel.selected').length === 0){
                $allFilter.addClass('selected');
                $openFilterLink.removeClass('selected');
                $filtersMobileLink.removeClass('selected');
            }
            //unselect "ALL" and select the category
            else{
                $allFilter.removeClass('selected');
                $openFilterLink.addClass('selected');
                $filtersMobileLink.addClass('selected');
            }

            filterProjects();
            closeFilterOverlayIfMobile();

            e.preventDefault();
        });

        var closeFilterOverlayIfMobile = function(){
            if (window.matchMedia("(max-width: 767px)").matches) {
                $("#filtersOverlay .closeOverlay").click();
            }
        }

        $(".filterAllLabel").click(function(){
            var $sectionFilter = $(this).closest('.filterBar');
            var $openFilterLink = $("#" + $sectionFilter.attr('id').replace('Bar','Link'));
            var $filterLabel = $sectionFilter.find('.filterLabel');
            $filterLabel.removeClass('selected');
            $openFilterLink.removeClass('selected');
            $("#filtersMobileLink").removeClass('selected');
            $(this).addClass('selected');
            filterProjects();
            closeFilterOverlayIfMobile();
            return false;
        });



        $(".rightArrow").click(function(){
            var $rightArrow = $(this);
            var $filterContainer = $(this).closest('.absolute');
            var $container = $filterContainer.find('.overflowLabel');
            var $leftArrow = $filterContainer.find('.leftArrow');
            var $content = $container.find('> div');
            $container.animate({scrollLeft: "+=" + 100}, function(){
                decideIfDisplayLeftArrow($container, $leftArrow);
                decideIfDisplayRightArrow($container, $content, $rightArrow);
            });
            return false;
        });

        $(".leftArrow").click(function(){
            var $leftArrow = $(this);
            var $filterContainer = $(this).closest('.absolute');
            var $container = $filterContainer.find('.overflowLabel');
            var $rightArrow = $filterContainer.find('.rightArrow');
            var $content = $container.find('> div');
            $container.animate({scrollLeft: "-="+100}, function(){
                decideIfDisplayRightArrow($container, $content, $rightArrow);
                decideIfDisplayLeftArrow($container, $leftArrow);
            });

            return false;
        });
    }

    function filterProjects(){
        var filterString = "";
        var filterPrefix = "";
        var $projectLi = $(".projectList li");
        $(".filterLabel.selected").each(function(index){
            filterPrefix = $(this).attr('data-prefix');
            filterString = "." + filterPrefix + "-" + $(this).attr('data-value');
        });
        if (filterString !== ""){
            $projectLi.hide();
            $projectLi.filter(filterString).show();
            tracking.sendTrackingEvent("grid_filter_" + filterString, framework.frameworkOptions.currentProjectId);
        } else {
            $projectLi.show();
        }
    }

    function decideIfDisplayRightArrow($container, $content, $rightArrow){
        if ($container.scrollLeft() + $container.width() >= Math.floor($content[0].getBoundingClientRect().width) ){
            $rightArrow.addClass('invisible');
        } else {
            $rightArrow.removeClass('invisible');
        }
    }

    function decideIfDisplayLeftArrow($container, $leftArrow){
        if ($container.scrollLeft() <= 0 ){
            $leftArrow.addClass('invisible');
        } else {
            $leftArrow.removeClass('invisible');
        }
    }

    function checkIfOverflows(){
        $('.absolute .overflowLabel').each(function(){
            var $container = $(this);
            var $filterContainer = $container.closest('.absolute');
            var $content = $container.find('> div');
            var $rightArrow = $filterContainer.find(".rightArrow");
            var $leftArrow = $filterContainer.find(".leftArrow");
            if ($content.width() > $container.width()){
                $rightArrow.removeClass('hidden');
                $leftArrow.removeClass('hidden').addClass('invisible');
                decideIfDisplayRightArrow($container, $content, $rightArrow);
                decideIfDisplayLeftArrow($container, $leftArrow);
            } else {
                $rightArrow.addClass('hidden');
                $leftArrow.addClass('hidden');
                decideIfDisplayRightArrow($container, $content, $rightArrow);
                decideIfDisplayLeftArrow($container, $leftArrow);
            }
        });
    }

    function initSearch(){
        var $searchField = $("#searchField");

        $("#searchField").keyup(function() {
            var query = $(this).val();
            if (query !== ""){
                var tempCopy = {};

                // deepcopy gridJSON, so that we can manipulate it
                $.extend(true, tempCopy, framework.gridJSON.projects);

                var tempArray = $.map(tempCopy, function(value, index) {
                    var local = { title: {en: "", fr: "" }, summary: { en: "", fr: "" }};
                    $.extend(true, local, value);
                    return local;
                });

                var pattern = new RegExp("\\b"+ query,"gi");
                var results = $.grep(tempArray, function(elem) {
                    return (pattern.test(elem.title.en)
                    || pattern.test(elem.title.fr)
                    || pattern.test(elem.summary.en)
                    || pattern.test(elem.summary.fr));
                });

                var resultsHtml = $.map(results, function(project){
                    var cardHtml = $('<div>').append($("#projectCard-" + project.id).clone()).html();

                    return cardHtml;
                }).join("");

                if (!resultsHtml){
                    resultsHtml = "<li><p>" + $('#resultsList').attr('data-noResults') + "</p></li>"
                }

                $("#resultsList").html(resultsHtml);
                tracking.sendTrackingEvent("search_" + query, framework.frameworkOptions.currentProjectId);

                initHover();

                $("#allProjectsList").addClass('hidden');
                $("#resultsList li").show();
                $("#resultsList").removeClass('hidden');
            } else {
                $("#allProjectsList").removeClass('hidden');
                $("#resultsList").addClass('hidden');
            }
        });

        $("#closeSearch").click(function(e){
            $searchField.val('');
            $("#allProjectsList").removeClass('hidden');
            $("#resultsList").addClass('hidden');
            e.preventDefault();
        });
    }

    return {
        init: init,
        openGridPage: openGridPage
    };
})();