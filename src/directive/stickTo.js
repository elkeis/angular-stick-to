angular.module('ng-stick-to').directive('ngStickTo', [
  'StickyElementRegistry',
  'ElementFactory',
  '$window',
  'updateElement',
  function(StickyElementRegistry, ElementFactory, $window, updateElement) {
    return function(scope, el, attrs) {
      var options = {
        primaryLimit: attrs.ngStickTo,
        secondaryLimit: attrs.limit,
        element: el
      };

      var stickyElement = ElementFactory.createStickyElement(options);
      if (attrs.name) {
        StickyElementRegistry[attrs.name] = stickyElement;
        scope.$on('$destroy', function() {
          StickyElementRegistry[attrs.name] = undefined;
        });
      }

      angular.element($window).bind('scroll', function() {
        updateElement(stickyElement);
      });
    };
  }
]);
