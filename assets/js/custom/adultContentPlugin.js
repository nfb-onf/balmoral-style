mw.kalturaPluginWrapper(function() {
    mw.PluginManager.add( 'adultContent-plugin', mw.KBaseScreen.extend({
        defaultConfig: {
            parent: "controlBarContainer"
        },
        setup: function(){
            var _this = this;
            this.bind('playerReady', function() {
                var warning_msg = _this.getConfig( 'warning_msg' );
                $('.controlBarContainer').prepend('<div class="ratingMsg"><i class="icon-warning rating-warning"></i> ' + warning_msg + '</div>');
            });
        }
    }));
});