angular.module('ng-stick-to', [])
.directive('stickTo', [
    'stickToLinkFn',
    function(Link){
    return {
        restrict: 'A',
        link: Link
    };
}])
.factory('stickToLinkFn', ['$window', function ($window){
    return function Link(scope, el, attrs, ctrl){
        var initialWidth = el[0].offsetWidth;
        var clone = el[0].cloneNode(false);
        angular.element(clone).addClass('fake');
        angular.element($window).bind('scroll', function () {
            if(el[0].getBoundingClientRect().top <= parseInt(attrs.stickTo)) {
                el.css({
                    position: 'fixed',
                    top: parseInt(attrs.stickTo),
                    width: initialWidth
                });
                el.after(clone);
            }
        });
    };
}]);
