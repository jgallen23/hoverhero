/*!
 * hoverhero - Hero Module similar to the Apple App Store
 * v0.0.1
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
      'mouseleave': 'showDefault'
    },

    onSidebarHover: function(e) {
      var el = $(e.currentTarget);
      var index = this.sidebar.find('li').index(el);
      this.showItem(index);
    },

    showDefault: function(callback) {
      if (typeof callback !== 'function') {
        callback = function() {};
      }
      this.main.find('li:visible').not('.default').fadeOut();
      this.main.find('.default').fadeIn();
    },

    showItem: function(index) {
      this.main.find('li:visible').fadeOut();
      this.main.find('li:eq('+(index+1)+')').fadeIn();
    }

  });
})(jQuery);
