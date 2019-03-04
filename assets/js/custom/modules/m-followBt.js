var m_followBt = (function () {

    function init() {
        btFollow();
    }

    function btFollow() {
        $('.m-followBt').click(function() {
            var $btFollowCourant = $(this);
            $btFollowCourant.toggleClass('is-following');
            $btFollowCourant.removeClass('is-unfollow-hover');
            if ($btFollowCourant.hasClass('is-following')){
                var callbackFollow=$btFollowCourant.attr('data-follow-callback');
                var paramFollow=$btFollowCourant.attr('data-follow-param');
                if (window[callbackFollow] && paramFollow){
                    window[callbackFollow](paramFollow);
                }else if (window[callbackFollow]){
                    window[callbackFollow]();
                }
            }else{
                var callbackUnfollow=$btFollowCourant.attr('data-unfollow-callback');
                var paramUnfollow=$btFollowCourant.attr('data-unfollow-param');
                if (window[callbackUnfollow] && paramUnfollow){
                    window[callbackUnfollow](paramUnfollow);
                }else if (window[callbackUnfollow]){
                    window[callbackUnfollow]();
                }
            }

            if ($('body').hasClass("user-profile-page")) {
                $btFollowCourant.parent().toggleClass('is-followingContainer');
            }
            return false;
        });

        // The following methods are used to display "unfollow"
        // when a user clicks the button, mouses out, or goes back
        // to the button.
        $('html').on("mouseenter", '.m-followBt.is-following', function() {
            $(this).addClass('is-unfollow-hover');
        });


        $('html').on("mouseleave", '.m-followBt', function() {
            $(this).removeClass('is-unfollow-hover');
        });
    }

    // Reveal public pointers to
    // private functions and properties
    return {
        init: init
    };
})();

$('document').ready(function(){
    if ($('.m-followBt').length>0){
      m_followBt.init();
    }
});

// Support for IE and Webkit
var source = window || document;
function subscribe_to_nwl(input_name) {
    $('#nwl_subscription_form input[name='+input_name+']').attr('checked', true);
    $.post(url_newsletter, $("#nwl_subscription_form").serialize(), function(data) {
        Analytics.push(_gaq, {
            'type':'event',
            'category':'Newsletter',
            'action':'Subscribe - Newsletter subscription',
            'label':source.location.pathname+input_name});
          return false;
    }, 'json');
}

function unsubscribe_from_nwl(input_name) {
    $('#nwl_subscription_form input[name='+input_name+']').attr('checked', false);
    $.post(url_newsletter, $("#nwl_subscription_form").serialize(), function(data) {
        Analytics.push(_gaq, {
            'type':'event',
            'category':'Newsletter',
            'action':'Unsubscribe - Newsletter subscription',
            'label':source.location.pathname+input_name});
        return false;
    }, 'json');
}