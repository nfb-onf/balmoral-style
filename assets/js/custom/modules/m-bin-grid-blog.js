var m_bin_grid_blog = (function () {
    
    function init(){
        $(window).bind('resizeEnd', function() {
            hideCroppedBlogLinks();
        });

        
    }

    function hideCroppedBlogLinks(){
        $('.m-bin-grid .blog').each(function(){
            var $blogContainer=$(this);
            var $txtContent=$('.txtContent',$(this));
            var $txtContentLink=$txtContent.find('a');
            var nbOfLink=$txtContentLink.length;
            var indexLink=nbOfLink-1;
            var topValue=$txtContent.css('top').replace("px", "");
            var paddingValue=topValue*2;
            $txtContentLink.show();
            while (($txtContent.height()+paddingValue)>$blogContainer.height()){
                $('a:eq('+indexLink+')',$txtContent).hide();
                indexLink--;
            }
        });
    }

    // Reveal public pointers to
    // private functions and properties
    return {
        init: init,
    };
})();

$('document').ready(function(){
    if ($('.m-bin-grid .blog').length>0){
      m_bin_grid_blog.init();  
    }
});