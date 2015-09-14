angular.module('ng-stick-to', []);
angular.module('ng-stick-to').directive('ngStickTo', [
  'StickyElementRegistry',
  'ElementFactory',
  '$window',
  'updateElement',
  'postDigest',
  function(StickyElementRegistry, ElementFactory,
    $window, updateElement, postDigest) {
    return function(scope, el, attrs) {
      var options = {
        primaryLimit: attrs.ngStickTo,
        secondaryLimit: attrs.limit,
        element: el
      };

      var breakpoint = isNaN(parseInt(attrs.breakpoint)) ?
        0 : parseInt(attrs.breakpoint);

      var stickyElement = ElementFactory.createStickyElement(options);
      if (attrs.name) {
        StickyElementRegistry[attrs.name] = stickyElement;
        scope.$on('$destroy', function() {
          StickyElementRegistry[attrs.name] = undefined;
        });
      }

      function updateHandler() {
        updateElement(stickyElement);
      }

      var windowElement = angular.element($window);

      function subscribe() {
        windowElement.bind('scroll', updateHandler);
        windowElement.bind('resize', updateHandler);
        var off = postDigest(updateHandler);

        return function() {
          windowElement.unbind('scroll', updateHandler);
          windowElement.unbind('resize', updateHandler);
          off();
        };
      }

      function isDisabled() {
        var windowWidth = $window.innerWidth ||
          $window.document.documentElement.clientWidth ||
          $window.document.body.clientWidth;
        return windowWidth <= breakpoint;
      }

      var unsubscribe;
      if (!isDisabled()) {
        unsubscribe = subscribe();
      }

      scope.$on('$destroy', function() {
        if (unsubscribe) {
          unsubscribe();
        }
      });

      windowElement.bind('resize', function() {
        if (isDisabled()) {
          if (unsubscribe) {
            unsubscribe();
            unsubscribe = undefined;
            stickyElement.setSyntheticOffset(0);
          }
        } else {
          if (!unsubscribe) {
            unsubscribe = subscribe();
          }
        }
      });

    };
  }
]);
angular.module('ng-stick-to').directive('ngStickToLimit', [
  'LimitElementRegistry',
  'ElementFactory',
  function(LimitElementRegistry, ElementFactory) {
    return function(scope, el, attrs) {
      var simpleElement = ElementFactory.createSimpleElement(el);
      if (attrs.ngStickToLimit) {
        LimitElementRegistry[attrs.ngStickToLimit] = simpleElement;
        scope.$on('$destroy', function() {
          LimitElementRegistry[attrs.ngStickToLimit] = undefined;
        });
      }
    };
  }
]);
angular.module('ng-stick-to').service('AccessorFactory', [
  'StickyElementRegistry',
  'LimitElementRegistry',
  function(StickyElementRegistry, LimitElementRegistry) {
    this.createPrimaryLimitAccessor = function(value) {
      var intValue = getIntOrZero(value);
      return function() {
        var limitElement = StickyElementRegistry[value];
        if (limitElement) {
          return limitElement.getBottom();
        } else {
          return intValue;
        }
      };
    };

    this.createSecondaryLimitAccessor = function(limitName) {
      return function() {
        var limit = LimitElementRegistry[limitName];
        if (limit) {
          return limit.getTop();
        } else {
          return Infinity;
        }
      };
    };

    function getIntOrZero(value) {
      var int = parseInt(value);
      return isNaN(int) ? 0 : int;
    }
  }
]);
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
          var translateY = 'translate(0px,' + offset + 'px)';
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
angular.module('ng-stick-to').value('LimitElementRegistry', {});
angular.module('ng-stick-to').value('StickyElementRegistry', {});
angular.module('ng-stick-to').factory('postDigest', [
  '$rootScope',
  '$timeout',
  function($rootScope, $timeout) {

    return function postDigest(callback) {
      var sheduled = false;
      var removed = false;
      var remove = $rootScope.$watch(function() {
        if (!sheduled) {
          sheduled = true;
          $timeout(function() {
            if (!removed) {
              callback();
              sheduled = false;
            }
          },0, false);
        }
      });
      return function() {
        removed = true;
        remove();
      };
    };
  }
]);
angular.module('ng-stick-to').factory('updateElement', [
  function() {
    return function updateElement(element) {
      var primaryLimitOverflow =
        element.getPrimaryLimit() - element.getPristineTop();
      if (primaryLimitOverflow > 0) {
        var secondaryLimitOverflow =
          element.getPristineBottom() - element.getSecondaryLimit();
        if (secondaryLimitOverflow > 0) {
          element.setSyntheticOffset(-secondaryLimitOverflow);
        } else {
          var secondaryLimitGap = -secondaryLimitOverflow;
          if (secondaryLimitGap < primaryLimitOverflow) {
            element.setSyntheticOffset(secondaryLimitGap);
          } else {
            element.setSyntheticOffset(primaryLimitOverflow);
          }
        }
      } else {
        element.setSyntheticOffset(0);
      }
    };
  }
]);
