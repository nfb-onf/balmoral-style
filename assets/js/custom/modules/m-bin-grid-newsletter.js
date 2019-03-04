var m_bin_grid_newsletter = (function () {

	function init(){
		subscribeToNewsletterViaAjax();
	}

	function subscribeToNewsletterViaAjax(){
		var localValidation=['en_US'];
		var newsletter="bulletin_nfb";
		var apiURL="/api/v2/json/newsletter/subscribe/";
		if ($('html').attr('lang')==="fr"){
			localValidation=['fr_FR'];
			newsletter="bulletin_onf";
		}
		$(".bootstrapValidation").formValidation({
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			locale: localValidation,
			live: 'enabled',
			submitButtons: 'button[type="submit"]',
			excluded:[':disabled'],
			verbose: false,
			fields: {
				email:{
					validators: {
						notEmpty: {},
						email: {}
					}
				}
			},
			trigger: "blur"
		}).on('success.form.fv', function(e) {
			e.preventDefault();
			var apiKey='4fcf6f89-84a2-5d12-b5d8-b286ea4251a7';
			var email=$("#email").val();
			var source = window || document;

			var data={
				api_key: apiKey,
				email: email,
				list_of_newsletter: newsletter,
				referrer: source.location.href }

			$.post(apiURL, data, function( data ) {
				Analytics.push(_gaq
					,{'type':'event'
					,'category':'Newsletter'
					,'action':'Subscribe - Newsletter subscription'
					,'label': source.location.pathname+newsletter});
				experiments.goal('hp-newsletter-registration');
				$("#abonnementNewsletter").addClass("hidden");
				$("#abonneNewsletter").removeClass("hidden");
			});
		});
	}

	// Reveal public pointers to
	// private functions and properties
	return {
		init: init,
	};
})();

$('document').ready(function(){
	if ($('.m-bin-grid .newsletter').length>0){
		m_bin_grid_newsletter.init();
	}
});
