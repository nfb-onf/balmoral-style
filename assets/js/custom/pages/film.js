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

/** Display product buttons under the video player in the player page */

var productButtons = (function ($) {
  /**
   * Small note: resolve is used in place of rejection to create a soft-fail Promise.all
   *             without this, the buttons will fail to show up, because at least one
   *             promise will have been rejected, and we don't want that.
   */
  var BUTTONS_PATH = "/remote/transaction/purchase-button/";
  var GEOLOCATION_PATH = "/remote/access_rights/geolocation/";

  var request_rights = function (id_registre, language, product_type, market) {
    if (!id_registre || !language) {
      console.log("There is missing information in the request. The request must have an id_registre and language.");
      return;
    }

    var query = "?product_type=" + product_type + "&market=" + market + "&language=" + language;

    return new Promise(function(resolve, reject) {
      $.ajax(GEOLOCATION_PATH + id_registre + query)
        .done(function (response) {
          if (!response.segda_available) {
            resolve({error: 'Download and Rental currently unavailable.'})
          }
          resolve(response);
        })
        .fail(function (error) { resolve({error: error})});
    });
  }

  var showRentalButton = function (id_registre, language) {
    return new Promise(function (resolve, reject) {
      request_rights(id_registre, language, "rental", "home")
        .then(function (rights) {
          if (rights.access_available) {
            var querystring = "?id_registre=" + id_registre;
            querystring += "&product_type=rental";
            querystring += "&access_available=" + rights.access_available;

            $.ajax(BUTTONS_PATH + querystring)
              .done(function (response) {
                resolve(response);
              })
              .fail(function (err) {
                console.log('error fetching rental buttons')
                console.log(err);
              });
          } else {
            console.log('no access available')
            resolve({});
          }
        })
        .catch(function (error) {
          resolve({error: error});
        });
    });
  }

  var showDownloadButton = function (id_registre, language) {
    return new Promise(function (resolve, reject) {
      // Wait for all the checks on the download markets
      Promise.all([
        request_rights(id_registre, language, "download", "home"),
        request_rights(id_registre, language, "download", "education")
      ])
      .then(function (rights) {
        // if at least one download market is available, allow button to show
        if (rights.some(r => r.access_available == true)) {
          var querystring = "?id_registre=" + id_registre;
          querystring += "&product_type=download";
          querystring += "&access_available_home=" + rights[0].access_available;
          querystring += "&access_available_institutional=" + rights[1].access_available;

          $.ajax(BUTTONS_PATH + querystring)
            .done(function (response) {
              resolve(response);
            })
            .fail(function (err) {
              console.log('error fetching download buttons')
              console.log(err);
            });
        } else {
          resolve({});
        }
      }).catch(function (error) {
        resolve({error: error});
      });
    });
  }

  return {
    init: function (id_registre, language, downloads = false, rental = false) {
      var calls = [];

      if (rental) calls.push(showRentalButton(id_registre, language))
      if (downloads) calls.push(showDownloadButton(id_registre, language))

      Promise.all(calls).then(function (buttons) {
        $(".nbBt2 .loading").remove();
        if (buttons.error) {
          $(".nbBt2").prepend("<div>" + error.error.message + "</div>");
        } else {
          if (buttons.length > 1) {
            $(".nbBt2").prepend(buttons[1].html);
            $(".nbBt2").prepend(buttons[0].html);
          } else {
            $(".nbBt2").prepend(buttons[0].html);
          }
          // Make sure tooltips are reinitialized
          sf_popOver.init();
        }
      });
    }
  };
}($));
