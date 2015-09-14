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
