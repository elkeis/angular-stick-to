
var body = {
    append: function (items) {
        var body = angular.element(window.document.body);
        for (var i = 0; i < items.length; i++) {
            body.append(items[i]);
        }
    },

    clear: function () {
        angular.element(window.document.body).find('div').remove();
    },
};

describe('ng-stick-to', function() {
    beforeEach(function() {
        module('ng-stick-to');
    });

    [0, 5, 10].forEach(function (topLimit) {
        describe('When compiled with top limit '+topLimit+' "div[stick-to="'+topLimit+'"]"', function() {

            var scope, element, pageContent, $content;
            beforeEach(inject(function ($rootScope, $compile){
                pageContent = [
                    'div[style="height: 200px"]',
                    'div[stick-to="'+topLimit+'"]',
                    'div[style="height: 2000px"]'
                ];

                $content = affix('div.page>' + pageContent.join('+'));
                scope = $rootScope.$new();
                element = $compile(angular.element($content.find(pageContent[1])))(scope);
            }));

            function scrollAndCheckFixation(valueFn) {
                var $window, initialWidth;
                beforeEach(inject(function (_$window_) {
                    $window = _$window_;
                    $window.scroll(0, valueFn());
                    initialWidth = element.css('width');
                    angular.element($window).triggerHandler('scroll');
                }));


                it('should make it fixed', function() {
                    expect(element.css('position')).toEqual('fixed');
                });

                it('should set up top property to attr value', function() {
                    expect(element.css('top')).toEqual(topLimit+'px');
                });

                it('should copy width to fixed element', function() {
                    expect(element.css('width')).toEqual(initialWidth);
                });

                it('should paste its invisible copy with initial parameters before itself', function() {
                    expect($content.find('.fake').length).toEqual(1);
                });

                afterEach(function () {
                    $window.scrollTo(0,0);
                });
            }

            describe('When scroll window more than top limit of the element', function() {
                scrollAndCheckFixation(function () {
                    return element[0].getBoundingClientRect().top - topLimit + 1;
                });
            });

            describe('When scroll till the top limit ', function() {
                scrollAndCheckFixation(function () {
                    return element[0].getBoundingClientRect().top - topLimit;
                });
            });
        });
    });


});
