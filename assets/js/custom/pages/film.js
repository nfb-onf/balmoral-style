var myApp = angular.module('FilmApp', [], function($interpolateProvider) {
    $interpolateProvider.startSymbol('((');
    $interpolateProvider.endSymbol('))');
});

myApp.controller("SizeCtrl", ["$scope", function($scope) { // ng-controller="SizeCtrl"
    $scope.width = 560;
    $scope.height = 315 ;
    $scope.ResetEmbed = function () {
        $scope.width =516;
    }
    $scope.$watch(function() {

        $scope.height = Math.ceil($scope.width*0.5625) ;
    });
}]);

var film = (function () {
    var $lBackground=$("#l-background");
    var $imgBackground=$("#l-background > img");

    function init(options) {
        $(window).on('load',function(){
            $('html').addClass('no-mix-blend-mode');
            if('CSS' in window && 'supports' in window.CSS) {
                var support = window.CSS.supports('mix-blend-mode','soft-light');
                    support = support?'mix-blend-mode':'no-mix-blend-mode';
                    $('html').addClass(support);
            }

            if ($('html').hasClass('mix-blend-mode')){
                $imgBackground.addClass('screenImg');
                resizeElements();
            }else{
                var blendUrl=$lBackground.attr("data-blend-url");
                var blendColor=getHexaFormText($lBackground.attr("data-blend-color"));
                $.getScript( blendUrl, function( data, textStatus, jqxhr ) {
                    createCanvas('imgFilm',blendColor,$lBackground);
                    resizeElements();
                });
            }
        });
        closeEmbedBlock();
        hideComments();
        validateComments();
        goToComments();
        indigenousCollectionLink(options);
    }

    //pour internet explorer seulement
    function getHexaFormText(textColor){
        var color = "#FFD100"; //jaune par défaut
        switch (textColor) {
            case "blue":
                color = "#0085CA";
                break;
            case "green":
                color = "#C4D600";
                break;
            case "purple":
                color = "#87319A";
                break;
            case "turquoise":
                color = "#00BFB3";
                break;
            case "orange":
                color = "#FF5C39";
                break;
            case "pink":
                color = "#F6416C";
                break;
            case "red":
                color = "#E03C31";
                break;
        }
        return color;
    }

    function createCanvas(imgID,color,$container){
          //avec preload.js pour ie10 a cause du cross browser
          imgLink=$("#"+imgID).attr('src');
          $.getScript(preloadJsLink, function( data, textStatus, jqxhr ) {
            var preload = new createjs.LoadQueue();
            preload.addEventListener("fileload", handleFileComplete);
            preload.loadFile(imgLink);
            function handleFileComplete(event) {
                event.result.crossOrigin='anonymus';
                var overCanvas  = convertImageToCanvas(event.result);
                over = overCanvas.getContext('2d');
                var underCanvas =  createFillCanvas(color,event.result);
                under = underCanvas.getContext('2d');
                over.blendOnto(under,'screen');
                $container.append(underCanvas);
            }
          });
    }


    function convertImageToCanvas(image) {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext("2d").drawImage(image, 0, 0);

        return canvas;
    }

    function createFillCanvas(color,img){
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return canvas;
    }


    function resizeElements(){
        $(window).on("resize",function(){
            var hauteurNav=$("#l-leftNav-collapsed").height();
            var $ribbon=$(".m-ribbon");
            var hauteurRibbon=($ribbon.is(":visible")) ? $(".m-ribbon").height() : 0;
            if (window.matchMedia("(min-width: 990px)").matches) {
                hauteurNav=0;
            }
            var offsetFilmContent=$("#filmContent").offset().top - 40 - hauteurNav - hauteurRibbon;
            $("#l-background").css('height',offsetFilmContent+'px');
            Utils.fitImageInContainer($imgBackground, $("#l-background"), 704/396);
            Utils.fitImageInContainer($lBackground.find('canvas'),$lBackground,16/9);

            $("#l-background").removeClass('opacity0');

            //positionne le bg du titre the file
            var imgTheFileLoaded=imagesLoaded($("#theFileTitle"));
            imgTheFileLoaded.on( 'always', function(){
                setTimeout(function(){
                    Utils.fitImageInContainer($("#bgFileTilte"), $("#bgFileTilte").parent(), 704/396);
                },100);
            });
        }).trigger('resize');
    }

    function closeEmbedBlock(){
        $("#closeEmbedBlock").on('click',function(){
            $('.embed-icon').trigger('click');
            return false;
        });
    }

    function validateComments(){
        var localValidation=['en_US'];
        if ($('html').attr('lang')==="fr"){
            localValidation=['fr_FR'];
        }
        var $serveurErrorInContext=$('.server-error-in-context');
        if ($("#comment-form").length>0){
            $("#comment-form").formValidation({
                err: {
                  container: '#commentError'
                },
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                locale: localValidation,
                live: 'enabled',
                submitButtons: 'button[type="submit"]',
                excluded: [':disabled'],
                verbose: false,
                trigger: "change",
                fields: {
                    comment:{
                        validators: {
                            notEmpty: {}
                        }
                    },
                    displayName:{
                        validators: {
                            notEmpty: {}
                        }
                    }
                }
            }).on('success.validator.fv', function() {
                $serveurErrorInContext.remove();
            }).on('err.validator.fv', function() {
                $serveurErrorInContext.remove();
            });
        }
    }

    function focusTextarea(){
        $("#id_comment").focus();
    }

    function hideComments() {
      // hides all but the first two comments
      var hidden = $(".commentsList li").slice(2).addClass("hidden");
      if (hidden.length > 0) { $("#showCommentsButton").removeClass("hidden").click(showComments); }
    }

    function showComments() {
      $(".commentsList li").removeClass("hidden");
      $("#showCommentsButton").addClass("hidden");
    }

    function goToComments(){
        if (document.location.hash==="#filmCommentsScroll"){
            $("#connectedState .bubble").click();
            $("#player-iframe").on("load", function () {
                Utils.scrollToId($("#filmComments"), 1000, "easeInOutQuint");
            });
        }
    }

    function indigenousCollectionLink (options) {
        var publicApiEndpoint = options.PUBLIC_API_ENDPOINT;
        var filmId = options.film_id;
        if (publicApiEndpoint && filmId) {
            $.get(
                publicApiEndpoint + "films/" + filmId + "?tag=indigenous-films&platform=nfb&lang=en",
                function (response) {
                $("#indigenousCinemaLink").removeClass("hidden");
            });
        }
    };

    return {
        init: init,
        focusTextarea: focusTextarea
    };

})();
