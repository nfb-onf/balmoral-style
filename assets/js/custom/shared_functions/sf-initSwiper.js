var sf_initSwiper = (function () {
  function init() {
    var sliders = [];
    $('.swiper-container').each(function(index, element){
      $(this).addClass('s'+index);
      var slider = new Swiper('.s'+index,  {
        speed: 800,
        simulateTouch: false,
        pagination: {
          el: $('.s'+index).parent().find('.swiper-pagination'),
          type: 'fraction',
        },
        navigation: {
          nextEl: $('.s'+index).parent().find('.swiper-button-next'),
          prevEl: $('.s'+index).parent().find('.swiper-button-prev'),
        }
      });
      slider.on('slideNextTransitionEnd', function () {
        var $this = $(this.$el[0]);
        var $currentIframe;
        var $previousSlideIframe = $this.find('.swiper-slide-prev iframe');
        if (window.matchMedia("(min-width: 768px)").matches) {
          $this.find('.swiper-slide-prev,.swiper-slide-next').addClass('invisible');
        }
        $previousSlideIframe.attr('src', $previousSlideIframe.attr('src'));
      });
      slider.on('slidePrevTransitionEnd', function () {
        var $this = $(this.$el[0]);
        var $currentIframe;
        if (window.matchMedia("(min-width: 768px)").matches) {
          $this.find('.swiper-slide-prev,.swiper-slide-next').addClass('invisible');
        }
        var $previousSlideIframe = $this.find('.swiper-slide-next iframe');
        $previousSlideIframe.attr('src', $previousSlideIframe.attr('src'));
      });
      slider.on('slideChangeTransitionStart', function () {
        var $this = $(this.$el[0]);
        $this.find('.swiper-slide').removeClass('invisible');
        $this.find('.swiper-slide-prev .carousel-caption, .swiper-slide-next .carousel-caption').removeClass('visibleOpacity');
      });
      slider.on('slideChangeTransitionEnd', function () {
        var $this = $(this.$el[0]);
        $this.find('.swiper-slide-active .carousel-caption').addClass('visibleBlock');
        setTimeout(function(){ $this.find('.swiper-slide-active .carousel-caption').addClass('visibleOpacity'); }, 10);
        $this.find('.swiper-slide-prev .carousel-caption, .swiper-slide-next .carousel-caption').removeClass('visibleBlock');
      });
      sliders.push(slider);
    });

    var swipeIframe = function(){
      $('.swiper-container iframe').each(function(i, v){
        var ifr = $(v);
        var wr = $("<div id='wr"+new Date().getTime()+i+"' class='iframeCover'></div>");
        ifr.before(wr);
      });

      $('body').on('click', '.swiper-slide-active .iframeCover', function(event){
        var $myCover = $(this);
        $myCover.attr('style', 'pointer-events: none');
        setTimeout(function(){
            $myCover.attr('style', 'pointer-events: all');
        }, 3500);
      });
    }

    if ($('html').hasClass('touch')){
      swipeIframe();
    }
  }

  // Reveal public pointers to
  // private functions and properties
  return {
      init: init
  };
})();

$('document').ready(function(){
  sf_initSwiper.init();
});