var mock = (function(component) {

  component.ElementFactoryMock = {

  };

  /**
   * create mock of simple element;
   *
   * @param  {Object} options object
   *   options.top {Number} - top edge position of the element
   *   options.bottom {Number} - bottom edge position of the element
   * @return {Object} mock
   */
  component.createSimpleElementMock = function(options) {
    var elementMock = jasmine.createSpyObj('StickyElement', [
      'getTop',
      'getBottom'
    ]);
    elementMock._top = options.top || 0;
    elementMock._bottom = options.bottom || 0;
    elementMock.getTop.and.callFake(function() {
      return elementMock._top;
    });
    elementMock.getBottom.and.callFake(function() {
      return elementMock._bottom;
    });

    return elementMock;
  };
  /**
   * create mock of the StickyElement
   *
   * @param  {Object} options obj with options
   *   options.top {Number} - top edge position of the element
   *   options.bottom {Number} - bottom edge position of the element
   *   options.primaryLimit {Number} - primaryLimit value for the element
   *   options.secondaryLimit {Number} - secondary Limit value for the element
   *   options.syntheticOffset {Number} - offset ;
   *   options.pristineTop {Number} - pristine value of the top (without offset);
   * @return {Object}         [description]
   */
  component.createStickyElement = function(options) {
    var element = component.createSimpleElementMock(options);
    element._primaryLimit = options.primaryLimit;
    element._secondaryLimit = options.secondaryLimit;
    element.state = options.state || null;
    element._syntheticOffset = options.syntheticOffset || 0;
    element._pristineTop = options.pristineTop ||
      (element._top - element._syntheticOffset);
    element._pristineBottom = options.pristineBottom ||
      (element._bottom - element._syntheticOffset);

    element.getPrimaryLimit = jasmine.createSpy('getPrimaryLimit')
    .and.callFake(function() {
      return element._primaryLimit;
    });
    element.getSecondaryLimit = jasmine.createSpy('getSecondaryLimit')
    .and.callFake(function() {
      return element._secondaryLimit;
    });

    element.setSyntheticOffset = jasmine.createSpy('setSyntheticOffset')
    .and.callFake(function(offset) {
      element._syntheticOffset = offset;
      element._top += offset;
      element._bottom += offset;
    });
    element.getSyntheticOffset = jasmine.createSpy('getSyntheticOffset')
    .and.callFake(function() {
      return element._syntheticOffset;
    });
    element.getPristineTop = jasmine.createSpy('getPristineTop')
      .and.callFake(function() {
        return element._pristineTop;
      });
    element.getPristineBottom = jasmine.createSpy('getPristineBottom')
      .and.callFake(function() {
        return element._pristineBottom;
      });

    return element;
  };

  return component;

}(mock || {}));
