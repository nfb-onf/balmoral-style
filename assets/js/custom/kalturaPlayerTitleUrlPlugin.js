/*
*
* Replaces default plain title with clickable URL
*
*/

mw.kalturaPluginWrapper(function() {
  mw.PluginManager.add('TitleUrlPlugin', mw.KBaseComponent.extend({
    setup: function() {

      this.bind('playerReady', function(event) {
        var kdp = event.target;
        var title = kdp.evaluate('{mediaProxy.entry.name}');
        var url = kdp.evaluate('{share.socialShareURL}');
        var label = $('div.titleLabel');
        label.html("<a href='"+url+"' target='_top'>"+title+"</a>");
      });

    },
  }));
});
