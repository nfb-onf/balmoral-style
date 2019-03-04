
//Template : BRANDING : Account confirmation ribbon script
//!warning! Ces fonctions sont des duplications de registration_reminder_js.html qui sont toujours utilise dans board-base.html

$(document).ready(function() {
  $(".send-email-confirm-again").click(function(){
    var message = interpolate(gettext('A new confirmation message was sent to %s.'), [user_email])

    var data = {};
    if(activation_email_next != null){
        data['activation_email_next'] = activation_email_next;
    }
    if(email_trigger != null){
        data['email_trigger'] = email_trigger;
    }
    data['client_id'] = client_id

    var jqxhr = $.post(registration_reminder_send_again_url, data, function() {
      $(".email-confirm-reminder").replaceWith('<div class="l-bigContainer m-ribbon success withChoice email-confirm-reminder" id="ribbonConfirmAccount"> <div class="l-contentContainer"> <div class="l-largeur90p"> <p class="message">' + message + '</p>  </div> </div> </div> ');
    }).fail(function() {
        $(".email-confirm-reminder").replaceWith('<div class="l-bigContainer m-ribbon warning withChoice email-confirm-reminder" id="ribbonConfirmAccount"> <div class="l-contentContainer"> <div class="l-largeur90p"> <p class="message">' + gettext('An error has occurred while sending the confirmation message. Please contact NFB support.') + '</p>  </div> </div> </div> ');
    }).always(function() {
        setTimeout(function () {
          $(".email-confirm-reminder").fadeOut(500);
        }, 5000);
    });
  });

  $(".email-confirm-not-now").click(function(){
      $(".email-confirm-reminder").fadeOut(500);
      $.post(registration_reminder_remind_me_later_url, {remind_me_later: true});
  });

 $("#remind-warning").click(function(){
      $(".email-confirm-reminder").show();
      $.post(registration_reminder_remind_me_later_url, {});
  });

});

