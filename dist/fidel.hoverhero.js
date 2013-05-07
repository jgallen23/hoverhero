/*!
 * hoverhero - Hero Module similar to the Apple App Store
 * v0.0.3
 * https://github.com/jgallen23/hoverhero
 * copyright Greg Allen 2013
 * MIT License
*/
(function($) {
  $.declare('hoverHero', {
    elements: {
      '.sidebar': 'sidebar',
      '.main': 'main'
    },

    events: {
      'mouseenter .sidebar li': 'onSidebarHover',
      'mouseleave': 'showItem'
    },

    init: function() {
      this.defaultVisible = true;
    },

    onSidebarHover: function(e) {
      var el = $(e.currentTarget);
      var index = this.sidebar.find('li').index(el);
      this.showItem(index);
    },

    showItem: function(index) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      var self = this;
      this.timeout = setTimeout(function() {
        var itemHide = self.main.children('li:visible');
        var itemShow;

        if (typeof index !== 'number') {
          if (self.defaultVisible) {
            return;
          }
          itemHide.not('.default');
          itemShow = self.main.find('.default');
          self.defaultVisible = true;
        } else {
          itemShow = self.main.children('li:eq('+(index+1)+')');
          self.defaultVisible = false;
        }

        if (itemHide.length !== 0) {
          itemHide.fadeOut();
          self.el.trigger('heroHide', itemHide);
        }

        itemShow.fadeIn();
        self.el.trigger('heroShow', itemShow);
      }, 200);
    }

  });
})(jQuery);
