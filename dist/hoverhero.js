/*!
 * hoverhero - Hero Module similar to the Apple App Store
 * v0.0.3
 * https://github.com/jgallen23/hoverhero
 * copyright Greg Allen 2013
 * MIT License
*/
/*!
 * fidel - a ui view controller
 * v2.2.1
 * https://github.com/jgallen23/fidel
 * copyright JGA 2013
 * MIT License
*/

(function(w, $) {

var _id = 0;
var Fidel = function(obj) {
  this.obj = obj;
};

Fidel.prototype.__init = function(options) {
  $.extend(this, this.obj);
  this.id = _id++;
  this.obj.defaults = this.obj.defaults || {};
  $.extend(this, this.obj.defaults, options);
  $('body').trigger('FidelPreInit', this);
  this.setElement(this.el || $('<div/>'));
  if (this.init) {
    this.init();
  }
  $('body').trigger('FidelPostInit', this);
};
Fidel.prototype.eventSplitter = /^(\w+)\s*(.*)$/;

Fidel.prototype.setElement = function(el) {
  this.el = el;
  this.getElements();
  this.delegateEvents();
  this.dataElements();
  this.delegateActions();
};

Fidel.prototype.find = function(selector) {
  return this.el.find(selector);
};

Fidel.prototype.proxy = function(func) {
  return $.proxy(func, this);
};

Fidel.prototype.getElements = function() {
  if (!this.elements)
    return;

  for (var selector in this.elements) {
    var elemName = this.elements[selector];
    this[elemName] = this.find(selector);
  }
};

Fidel.prototype.dataElements = function() {
  var self = this;
  this.find('[data-element]').each(function(index, item) {
    var el = $(item);
    var name = el.data('element');
    self[name] = el;
  });
};

Fidel.prototype.delegateEvents = function() {
  var self = this;
  if (!this.events)
    return;
  for (var key in this.events) {
    var methodName = this.events[key];
    var match = key.match(this.eventSplitter);
    var eventName = match[1], selector = match[2];

    var method = this.proxy(this[methodName]);

    if (selector === '') {
      this.el.on(eventName, method);
    } else {
      if (this[selector] && typeof this[selector] != 'function') {
        this[selector].on(eventName, method);
      } else {
        this.el.on(eventName, selector, method);
      }
    }
  }
};

Fidel.prototype.delegateActions = function() {
  var self = this;
  self.el.on('click', '[data-action]', function(e) {
    var el = $(this);
    var action = el.attr('data-action');
    if (self[action]) {
      self[action](e, el);
    }
  });
};

Fidel.prototype.on = function(eventName, cb) {
  this.el.on(eventName+'.fidel'+this.id, cb);
};

Fidel.prototype.one = function(eventName, cb) {
  this.el.one(eventName+'.fidel'+this.id, cb);
};

Fidel.prototype.emit = function(eventName, data, namespaced) {
  var ns = (namespaced) ? '.fidel'+this.id : '';
  this.el.trigger(eventName+ns, data);
};

Fidel.prototype.hide = function() {
  if (this.views) {
    for (var key in this.views) {
      this.views[key].hide();
    }
  }
  this.el.hide();
};
Fidel.prototype.show = function() {
  if (this.views) {
    for (var key in this.views) {
      this.views[key].show();
    }
  }
  this.el.show();
};

Fidel.prototype.destroy = function() {
  this.el.empty();
  this.emit('destroy');
  this.el.unbind('.fidel'+this.id);
};

Fidel.declare = function(obj) {
  var FidelModule = function(el, options) {
    this.__init(el, options);
  };
  FidelModule.prototype = new Fidel(obj);
  return FidelModule;
};

//for plugins
Fidel.onPreInit = function(fn) {
  $('body').on('FidelPreInit', function(e, obj) {
    fn.call(obj);
  });
};
Fidel.onPostInit = function(fn) {
  $('body').on('FidelPostInit', function(e, obj) {
    fn.call(obj);
  });
};

(function($) {
  $.declare = function(name, obj) {

    $.fn[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      var options = args.shift();
      var methodValue;
      var els;

      els = this.each(function() {
        var $this = $(this);

        var data = $this.data(name);

        if (!data) {
          var View = Fidel.declare(obj);
          var opts = $.extend({}, options, { el: $this });
          data = new View(opts);
          $this.data(name, data); 
        }
        if (typeof options === 'string') {
          methodValue = data[options].apply(data, args);
        }
      });

      return methodValue || els;
    };

    $.fn[name].defaults = obj.defaults || {};

  };

  $.Fidel = Fidel;
})(jQuery);

w.Fidel = Fidel;
})(window, window.jQuery || window.Zepto);

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
