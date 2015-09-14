/* jshint maxstatements:15*/
angular.module('angular-stick-to').directive('angularStickTo', [
  'StickyElementRegistry',
  'ElementFactory',
  '$window',
  'updateElement',
  'postDigest',
  function(StickyElementRegistry, ElementFactory,
    $window, updateElement, postDigest) {
    return function(scope, el, attrs) {
      var options = {
        primaryLimit: attrs.angularStickTo,
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
