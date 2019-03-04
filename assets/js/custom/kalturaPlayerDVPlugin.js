mw.kalturaPluginWrapper(function() {
  mw.PluginManager.add('DVPlugin', mw.KBaseComponent.extend({

    toggleActiveDV: false,
    alternateEntryId: "",
    currentTime: 0,
    toggledDV: false,

    setup: function() {
      var _this = this;

      this.alternateEntryId = this.getConfig('alternateEntryId');

      this.bind('playerReady', function() {
        // This binding is necessary to ensure the css making the button visible
        // is applied after Kaltura has finished applying its own css.

        if (_this.getConfig('showDV')) {
          _this.getComponent().css('display', 'inline-block');
        }
      }, true);

      this.bind('onChangeMediaDone', function() {
        if (_this.toggledDV) { // used to somewhat restrict onChangeMediaDone to DV triggering
          var player = _this.getPlayer();
          player.seekPending = true;
          player.seekPendingTime = _this.currentTime;
          player.sendNotification("doSeek", _this.currentTime);
          _this.toggledDV = false;
        }
      });
    },

    getComponent: function() {
      var _this = this;

      if (!this.$el) {
        this.$button = $('<button/>')
          .addClass('btn icon-dv')
          .attr({'data-show-tooltip': "true", title: _this.getConfig('video_description_string') })
          .click(function() {
            _this.toggleDV();
          });

        this.$el = $('<div/>').addClass('dropup pull-right');
        this.$el.append(this.$button);
      }
      return this.$el;
    },

    toggleDV: function() {
      this.toggleActiveDV = !this.toggleActiveDV;
      this.toggledDV = true;

      var player = this.getPlayer();
      player.addPlayerSpinner();
      player.hideSpinnerOncePlaying();

      var playingEntryId = player.kentryid;
      this.currentTime = player.currentTime;

      player.sendNotification("doStop");

      player.sendNotification(
        "changeMedia",
        {"entryId": this.alternateEntryId}
      );

      this.alternateEntryId = playingEntryId;

      if (this.toggleActiveDV) {
        this.$button.addClass('actif');
      } else {
        this.$button.removeClass('actif');
      }
    }

  }));
});
