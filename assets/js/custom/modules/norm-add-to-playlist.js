var norm_add_to_playlist = (function () {

    function init() {
        $(document).on('click', '.watchLater', function(event) {
            event.preventDefault();
            var $thumbnail = $(this).closest('.vignette');
            var clickOrigin, movieTitle;
            if ($thumbnail.length > 0) {
                clickOrigin = 'thumbnail';
                movieTitle = $thumbnail.find('.titre').text().trim();
            }
            else {
                clickOrigin = 'film-page';
                movieTitle = $('#titleHeader').text().trim();
            }
            $(".watchLater").modalFormSubmitJSON({
                href: "/partial/playlist/film/add/" + $(this).data("source-id"),
                clickOrigin: clickOrigin,
                movieTitle: movieTitle
            });
        });

        $("body").on('click','#createNewPlaylist',function(){
            $("#createNewPlaylist").hide();
            $("#newplaylist").removeClass( "hidden" );
            $('#isnewlist').val('True');
            $('#form_add_film_to_playlist').data('formValidation')
              .enableFieldValidators('pl', false)
              .enableFieldValidators('newplaylist', true);

            //Réinitialise le dropdown des sélections déjà créer
            $('select[name=pl]').val(0);
            $('#pl_list').selectpicker('refresh');
        });

        $.fn.modalFormSubmitJSON = function(args, callback) {
            var onclosed = function(){};
            var serialized = {};
            var lang = $('html').attr('lang');

            if (args.onClosed != 'undefined'){ onclosed = args.onClosed}

            if (args.form != ''){serialized = $("#"+args.form).serialize();}

            if (args.send_type == "post"){
                var theURL = $("#"+args.form).attr("action");
                $.post(theURL, serialized, function(data){
                    $.colorbox({open : true, html : data.html, fixed:true, onClosed:onclosed}, callback);
                }, "json");
            } else {
                $.getJSON(args.href, serialized, function(data){
                    if (args.target_div != undefined){ //if a target is set, put html there.
                        $(args.target_div).html(data.html);
                    }
                    else { //if a target is not set, put html in modal
                        $.colorbox({open : true, html : data.html, fixed:true, width: 360, onComplete:function(){

                            $('#pl_list').selectpicker({mobile: Utils.isMobile.any()}).change(function () {
                                var selected = $(this).find("option:selected").val();
                                //ferme les nouvelles sélections
                                if (selected!=""){
                                  $('#isnewlist').val('False');
                                  $("#createNewPlaylist").show();
                                  $("#newplaylist").val('').addClass( "hidden" );
                                  $('#form_add_film_to_playlist').data('formValidation')
                                    .enableFieldValidators('pl', true)
                                    .enableFieldValidators('newplaylist', false);
                                }
                            });

                            var localValidation=['en_US'];
                            if (lang == 'fr'){
                                localValidation=['fr_FR'];
                            }
                            var $serveurErrorInContext=$('.server-error-in-context');
                            $(".validationPlaylist").formValidation({
                                feedbackIcons: {
                                    valid: 'glyphicon glyphicon-ok',
                                    invalid: 'glyphicon glyphicon-remove',
                                    validating: 'glyphicon glyphicon-refresh'
                                },
                                fields: {
                                  pl: {
                                    validators: {
                                      notEmpty: {
                                        enabled: true,
                                        // TODO(ARS): Temporary hotfix before testing due to rebase issues.
                                        message: typeof addToPlaylistValidationMessages === "undefined" ?
                                                    "" : addToPlaylistValidationMessages['selectPlaylist'],
                                      }
                                    }
                                  },
                                  newplaylist: {
                                    validators: {
                                      notEmpty: {
                                        enabled: !$('#newplaylist').hasClass('hidden')
                                      }
                                    }
                                  }
                                },
                                locale: localValidation,
                                submitButtons: 'button[type="submit"]',
                                excluded:[':disabled'],
                                verbose: false,
                            }).on('err.validator.fv', function() {
                                $serveurErrorInContext.remove();
                                $.fn.colorbox.resize({});
                            }).on('success.validator.fv', function(e, data) {
                                $serveurErrorInContext.remove();
                            }).on('success.form.fv', function(e) {
                                // Prevent form submission
                                e.preventDefault();
                                //si c'est un chapitre
                                if($(".validationPlaylist").attr('data-type')=="chapters"){
                                    if ( $('#isnewlist').val()=="True" ) {
                                        playlist = new PlayListAjax($('#newplaylist').val(), chapterLang);
                                        playlist.create(function(data){
                                            chapters.save(data.slug, modalCallback, modalCallback)
                                        });
                                    }
                                    else if ($('#pl_list').val() != "") {
                                        chapters.save($('#pl_list').val(), modalCallback, modalCallback);
                                    }
                                }
                                //si c'est un film
                                else{
                                    $.fn.modalFormSubmitJSON({href:playlistUrl, form: 'form_add_film_to_playlist', send_type:'post'});
                                }

                                if (args.movieTitle && args.clickOrigin) {
                                    // Track analytics event
                                    var userType = userHasCampusAccess ? 'campus' : 'regular';
                                    var label = 'add ' + args.movieTitle + ' ' + args.clickOrigin + ' ' + userType;
                                    _gaq.push(['_trackEvent', 'UI-UX', 'add-to-playlist', label]);
                                }
                            });

                        }}, callback);
                    }
                });
            }
        };
    }

    //affiche le message de succès de l'ajout de chapitre
    var modalCallback = function(data){
        var html_msg = getHtmlResponseFromResponse(data.responseText);
        $.colorbox({ open: true,  html : html_msg, width:380 });
    };




    // Reveal public pointers to
    // private functions and properties
    return {
        init: init,
    };
})();

$('document').ready(norm_add_to_playlist.init);
