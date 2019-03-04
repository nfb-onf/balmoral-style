mw.kalturaPluginWrapper(function() {
  mw.PluginManager.add('CCPlugin', mw.KBaseComponent.extend({

    setup: function() {
      var _this = this;

      this.bind('playerReady', function() {
        // This binding is necessary to ensure the css making the button visible
        // is applied after Kaltura has finished applying its own css.
        var flashvars = _this.getPlayer().getFlashvars();

        $('html').attr({'lang': flashvars.localizationCode});
        $('div[data-plugin-name="CCPlugin"]').addClass('ccInvisible');
      });

      this.bind('selectClosedCaptions', function(e, selection) {
        if (selection != "Off") {
          $('.btn.icon-cc').addClass('actif');
        }
      });

      this.bind('closedCaptionsHidden', function() {
        $('.btn.icon-cc').removeClass('actif');
      });

      this.bind('captionsMenuReady', function() {
        var anchor = $("a[title='Off'][role='menuitemcheckbox']");
        var off_label = _this.getConfig("off_label");
        anchor.text(off_label);
        anchor.attr({"title": off_label});

        var flashvars = _this.getPlayer().getFlashvars();

        if (flashvars.localizationCode == "fr") {
          anchor = $("a[title='French'][role='menuitemcheckbox']");
          if (anchor.length == 1) {
            anchor.text("Français");
            anchor.attr({"title": "Français"});
          } else {
            anchor = $("a[title='English'][role='menuitemcheckbox']");
            anchor.text("Anglais");
            anchor.attr({"title": "Anglais"});
          }
        }

      });
    }

  }));
});
