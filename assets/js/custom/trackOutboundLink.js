//Track outbound link in Google Analytics When the link as a target blank and the domain name is not onf.ca/nfb.ca and onf-nfb.gc.ca
var trackOutboundLink = (function() {
    function init(){
	$("a[target='_blank']").click(function(e){
			e.preventDefault();
			track($(this).attr('href'));
			return false;
		});
    }

    function track(url){
	var domains=["onf.ca/", "nfb.ca/", "onf-nfb.gc.ca/"];
		if(url.indexOf(domains[0])==-1 && url.indexOf(domains[1])==-1 && url.indexOf(domains[2])==-1){
		_gaq.push(['_trackEvent', 'Outbound', 'Click', url]);
		}
	    window.open(url);
    }

    return {
        init: init
    };
})();

$('document').ready(function() {
    trackOutboundLink.init();
});
