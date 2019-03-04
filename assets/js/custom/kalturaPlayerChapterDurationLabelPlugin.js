// Adapted from
// https://github.com/kaltura/mwEmbed/blob/v2.45.1/modules/KalturaSupport/components/durationLabel.js
//
// This plugin powers the player's total chapter duration label.


mw.kalturaPluginWrapper(function() {
    mw.PluginManager.add('ChapterDurationLabelPlugin', mw.KBaseComponent.extend({

        defaultConfig: {
            parent: "controlsContainer",
            order: 31,
            displayImportance: 'medium',
            prefix: ' / '
        },

        contentDuration: 0,

        isSafeEnviornment: function(){
            return !this.embedPlayer.isMobileSkin();
        },

        setup: function(){
            var _this = this;
            this.contentDuration = this.getConfig("segmentEnd") - this.getConfig("segmentStart");

            this.bind( 'durationChange', function(event, duration){
                _this.updateUI( Math.floor(_this.contentDuration) );
            });

            // Support duration for Ads
            this.bind( 'AdSupport_AdUpdateDuration', function(e, duration){
                _this.updateUI( duration );
            });
            this.bind( 'AdSupport_EndAdPlayback', function(){
                _this.updateUI( _this.contentDuration );
            });
            this.bind('playerReady', function () {
                _this.getComponent().css('display', 'inline-block');
            });
        },

        updateUI: function( duration ){
            var formatTime = mw.seconds2npt( parseFloat( duration ) )
            var duration = this.getConfig('prefix') !== undefined ? this.getConfig('prefix') + formatTime : formatTime;
            this.getComponent().text( duration );
        },

        getComponent: function() {
            if( !this.$el ) {
                var duration = this.getConfig('prefix') !== undefined ? this.getConfig('prefix') + '0:00' : '0:00';
                this.$el = $( '<div />' )
                            .addClass ( "timers" + this.getCssClass() )
                            .text( duration );
            }
            return this.$el;
        },

        show: function() {
            this.getComponent().css('display','inline').removeData( 'forceHide' );
        }

    }));
});
