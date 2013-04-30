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

    showDefault: function() {
      this.main.find('li:visible').not('.default').fadeOut();
      this.main.find('.default').fadeIn();
    },

    showItem: function(index) {
      this.main.find('li:visible').fadeOut();
      this.main.find('li:eq('+(index+1)+')').fadeIn();
    }

  });
})(jQuery);
