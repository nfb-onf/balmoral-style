// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

var Utils = {
	/* ////////////////////////////////////////
	//
	// Detection
	//
	/////////////////////////////////////// */
	//Permet de détecter le browser
	whichBrowser: function(){
		var agt = navigator.userAgent.toLowerCase();
    if (agt.indexOf("opera") != -1) return 'Opera';
    if (agt.indexOf("staroffice") != -1) return 'Star Office';
    if (agt.indexOf("webtv") != -1) return 'WebTV';
    if (agt.indexOf("beonex") != -1) return 'Beonex';
    if (agt.indexOf("chimera") != -1) return 'Chimera';
    if (agt.indexOf("netpositive") != -1) return 'NetPositive';
    if (agt.indexOf("phoenix") != -1) return 'Phoenix';
    if (agt.indexOf("firefox") != -1) return 'Firefox';
    if (agt.indexOf("chrome") != -1) return 'Chrome';
    if (agt.indexOf("safari") != -1) return 'Safari';
    if (agt.indexOf("skipstone") != -1) return 'SkipStone';
    if (agt.indexOf("msie") != -1) return 'Internet Explorer';
    if (agt.indexOf("trident") != -1) return 'Internet Explorer';
    if (agt.indexOf("netscape") != -1) return 'Netscape';
    if (agt.indexOf("mozilla/5.0") != -1) return 'Mozilla';
    if (agt.indexOf('\/') != -1) {
      if (agt.substr(0, agt.indexOf('\/')) != 'mozilla') {
        return navigator.userAgent.substr(0, agt.indexOf('\/'));
      } else return 'Netscape';
    } else if (agt.indexOf(' ') != -1) return navigator.userAgent.substr(0, agt.indexOf(' '));
    else return navigator.userAgent;
	},

	//Permet de détecter le OS mobile
	isMobile : {
		Android: function () {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function () {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function () {
			return navigator.userAgent.match(/iPhone|iPod|iPad/i);
		},
		iPhone: function(){
	      return navigator.userAgent.match(/iPhone/i);
	    },
	    iPod: function(){
	      return navigator.userAgent.match(/iPod/i);
	    },
	    iPad: function(){
	      return navigator.userAgent.match(/iPad/i);
	    },
		Opera: function () {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function () {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function () {
			return (Utils.isMobile.Android() || Utils.isMobile.BlackBerry() || Utils.isMobile.iOS() || Utils.isMobile.Opera() || Utils.isMobile.Windows());
		}
	},

	//Détermine notre OS
	whichOS : function () {
		var ua = navigator.userAgent.toLowerCase();
		var nP = navigator.platform;
		if (/Mac/.test(nP)) {
			return 'MacOS';
		}
		if (/windows nt 5.0/.test(ua)) {
			return 'Win2K';
		} else if (/windows nt 5.1/.test(ua)) {
			return 'WinXP';
		} else if (/windows nt 6.0/.test(ua)) {
			return 'WinVista';
		} else if (/windows nt 6.1/.test(ua)) {
			return 'Win7';
		} else if (/windows nt 6.2/.test(ua)) {
			return 'Win8';
		}
	},

	/* ////////////////////////////////////////
	//
	// Scroll
	//
	/////////////////////////////////////// */
	//Permet d'aller chercher la valeur de la position du scroll
	getScrollPage: function($element){
		var scrollPage = 0;
		if ($element===$(window)){
			if (Utils.isMobile.any()) {
				scrollPage = $element.scrollTop();
			}
			else {
				if (Utils.whichBrowser() === 'Safari' || Utils.whichBrowser() === 'Chrome') {
					scrollPage = $('body').scrollTop();
				} else {
					scrollPage = $('html,body').scrollTop();
				}
			}
		}else{
			scrollPage = $element.scrollTop();
		}

		return scrollPage;
	},

	//Permet de faire scroller la page à la position d'un element
	scrollToId: function($element, speed,easing,callback){
		var nbPixel = $element.offset().top-$("#l-leftNav-collapsed").height();
		if (window.matchMedia("(min-width: 990px)").matches) {
			nbPixel = $element.offset().top;
		}


		$("html, body").animate({ scrollTop: nbPixel }, speed, easing,function(){
			if (callback){
				callback();
			}
		});
	},


	/* ////////////////////////////////////////
	//
	// Position and resize
	//
	/////////////////////////////////////// */
	//Permet de centrer une image en hauteur dans son container
	centerHeightInContainer: function ($element, $container, outerHeight) {
		var r = $.Deferred();
		var top=($container.height() - $element.outerHeight(outerHeight)) / 2;
		if (top>0){
			$element.css('top', ( top + 'px'));
		}else{
			$element.css('top', ( '0px'));
		}

		r.resolve();
		return r;
	},

	//Permet de faire fiter une image dans son container
	fitImageInContainer: function($containerImage, $wrapper, bgMainRatio) {
		var r = $.Deferred();
		var wrapperRatio = $wrapper.width() / $wrapper.height();
		if (bgMainRatio < wrapperRatio) {
			$containerImage.css('width', $wrapper.width());
			$containerImage.css('height', $containerImage.width() / bgMainRatio);
		} else {
			$containerImage.css('height', $wrapper.height());
			$containerImage.css('width', $containerImage.height() * bgMainRatio);
		}
		$containerImage.css('left', (Math.round($wrapper.width() - $containerImage.width()) / 2));
		$containerImage.css('top', (Math.round($wrapper.height() - $containerImage.height()) / 2));
		r.resolve();
		return r;
	},



	/* ////////////////////////////////////////
	//
	// ARRAY
	//
	/////////////////////////////////////// */
	//Retourne un tableau de chiffre au hasard allant du minimum au maximum
	getRandomArrayOfNumber: function(min,max){
		var A= [];
		while(max>= min){
			A.push(max--);
		}
		A.sort(function(){
			return 0.5- Math.random();
		});
		return A;
	},


	shuffleArray: function(o){
		for(var j, x, i = o.length; i;
			j = parseInt(Math.random() * i),
			x = o[--i], o[i] = o[j], o[j] = x){
		}
		return o;

	},


	/* ////////////////////////////////////////
	//
	// VALIDATION
	//
	/////////////////////////////////////// */
	IsEmail: function(email) {
		var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		return regex.test(email);
	},

	biggestHeightForAllElement: function($element,outerHeight){
		var maxHeight=0;
		$element.each(function(){

			if (outerHeight==true){
				var heightElement=$(this).attr('style','').outerHeight();
			}else{
				var heightElement=$(this).attr('style','').height();
			}

			if (heightElement>maxHeight){
				maxHeight=heightElement;
			}
		});

		$element.css('height',maxHeight+'px');
	},


	//permet de rafraichir la valeur de la typo qui se resize
	resizeVW: function(causeRepaintsOn){
        if ($("body").attr('data-animatedNav') !== "true") {
            causeRepaintsOn.css("z-index", 1);
        }
    },

    getQuerystringParameterByName: function(name, url) {
	    if (!url) url = window.location.href;
	    name = name.replace(/[\[\]]/g, "\\$&");
	    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

};
