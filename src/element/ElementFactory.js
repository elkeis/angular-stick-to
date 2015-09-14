angular.module('ng-stick-to').service('ElementFactory', [
  'AccessorFactory',
  function(AccessorFactory) {
    /**
     * Sticky Element
     *
     * @constructor
     * @param {JqLite} element
     */
    function SimpleElement(element) {
      this.jqElement = element;
      this.element = element[0];
    }

    SimpleElement.prototype = {
      getTop: function() {
        return this.element.getBoundingClientRect().top;
      },
      getBottom: function() {
        return this.element.getBoundingClientRect().bottom;
      }
    };

    /**
     * Sticky Ellement
     *
     * @constructor
     * @param {Object} options
     */
    function StickyElement(options) {
      SimpleElement.call(this, options.element);

      this.getPrimaryLimit = AccessorFactory
        .createPrimaryLimitAccessor(options.primaryLimit);

      this.getSecondaryLimit = AccessorFactory
        .createSecondaryLimitAccessor(options.secondaryLimit);

      this._syntheticOffset = 0;

      this.state = null;
    }

    StickyElement.prototype = Object.create(SimpleElement.prototype, {
      setSyntheticOffset: {
        value: function(offset) {
          var translateY = 'translateY(' + offset + 'px)';
          this.jqElement.css({
            '-ms-transform': translateY, /* IE 9 */
            '-webkit-transform': translateY, /* Safari */
            'transform': translateY
          });
          this._syntheticOffset = offset;
        }
      },
      getSyntheticOffset: {
        value: function() {
          return this._syntheticOffset;
        }
      },
      getPristineTop: {
        value: function() {
          return this.getTop() - this.getSyntheticOffset();
        }
      },
      getPristineBottom: {
        value: function() {
          return this.getBottom() - this.getSyntheticOffset();
        }
      }
    });
    StickyElement.prototype.constructor = StickyElement;

    this.createSimpleElement = function(element) {

      return new SimpleElement(element);

    };

    this.createStickyElement = function(options) {
      return new StickyElement(options);
    };
  }
]);
