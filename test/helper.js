var helper = (function(module) {

  function extendWithOptions(obj, options) {
    var result = Object.create(obj);
    for (var option in options) {
      if (options.hasOwnProperty(option)) {
        result[option] = options[option];
      }
    }
    return result;
  }
  /**
   * Create mock of angular Jqlite element.
   *
   * @param  {Object} options opject with top, bottom, height and width properties
   * @return {Array}  Array with htmlElementMock
   */
  module.createElementMock = function(options) {

    var rect = {
      top: 0,
      bottom: 0,
      height: 0,
      width: 0,
    };

    if (options) {
      rect = extendWithOptions(rect, options);
    }

    var htmlElementMock = {
      getBoundingClientRect: jasmine.createSpy('getBoundingClientRect')
        .and.returnValue(rect)
    };

    var result = [htmlElementMock];

    result.rect = {
      /**
       * You can set top position of your mock element via this api
       *
       * @param  {Number} val New top value
       */
      setTop: function(val) {
        rect.top = val;
      },
      /**
       * The same as top but for bottom
       *
       * @param  {Number} val [description]
       */
      setBottom: function(val) {
        rect.bottom = val;
      }

    };

    result.css = jasmine.createSpy('jqLite.css method');

    return result;
  };

  /**
   * creates state resolver input object
   *
   * @param  {Object} options : element, currentState, topLimit, bottomLimit
   * @return {Object} object with the same properties as in options but couple of them are functions
   * which returns specified values
   */
  module.createStateResolverInput = function(options) {
    return {
      element: options.element,
      currentState: options.currentState,
      topLimit: function() {return options.currentState;},
      bottomLimit: function() {return options.bottomLimit;}
    };
  };

  return module;

}(helper || {}));
