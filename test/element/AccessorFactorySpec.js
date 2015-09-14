describe('Accessor service', function() {
  var AccessorFactory;
  var createSimpleElement;
  beforeEach(function() {
    createSimpleElement = mock.createSimpleElementMock;
    module('ng-stick-to', function($provide) {
      $provide.value('StickyElementRegistry', {});
      $provide.value('LimitElementRegistry', {});
    });
    inject(function(_AccessorFactory_) {
      AccessorFactory = _AccessorFactory_;
    });
  });

  ['PrimaryLimit', 'SecondaryLimit'].forEach(function(item) {
    it(`should has "create${item}Accessor()" method`, function() {
      expect(AccessorFactory[`create${item}Accessor`])
        .toEqual(jasmine.any(Function));
    });
  });

  describe('createPrimaryLimitAccessor function', function() {
    describe('When called with some sticky element name (test-1)', function() {
      describe('When it exists', function() {
        var elementName;
        var result;
        var stickyElement;
        beforeEach(inject(function(StickyElementRegistry) {
          elementName = 'test-1';
          stickyElement = createSimpleElement({
            top: 0,
            bottom: 5
          });
          StickyElementRegistry[elementName] = stickyElement;
          result = AccessorFactory.createPrimaryLimitAccessor(elementName);
        }));
        checkResultFunctionCall(
          function() { return result; },
          5,
          'the bottom line of element "test-1"');

        describe('When it\'s position was changed' , function() {
          beforeEach(function() {
            stickyElement._bottom = 15;
          });
          checkResultFunctionCall(
            function() { return result; },
            15,
            'the new bottom line of element "test-1"');
        });
      });

      describe('when it doesn\'t exists', function() {
        var result;
        beforeEach(function() {
          result = AccessorFactory.createPrimaryLimitAccessor('test-2');
        });
        checkResultFunctionCall(function() { return result; }, 0);
      });
    });

    describe('When called with some parseble integer value', function() {
      var result1;
      var result2;
      beforeEach(function() {
        result1 = AccessorFactory.createPrimaryLimitAccessor('10px');
        result2 = AccessorFactory.createPrimaryLimitAccessor('100 pixels');
      });
      checkResultFunctionCall(
        function() {return result1;},
        10,
        'parsed value of "10px"');
      checkResultFunctionCall(
        function() {return result2;},
        100,
        'parsed value of "100px"');
    });

    describe('When called with undefined value', function() {
      var result;
      beforeEach(function() {
        result = AccessorFactory.createPrimaryLimitAccessor();
      });

      checkResultFunctionCall(
        function() { return result; },
        0
      );
    });
  });

  describe('createSecondaryLimitAccessor function', function() {
    describe('when called with some registered Limit name (limit-1)',
    function() {
      var result;
      var limitName;
      beforeEach(inject(function(LimitElementRegistry) {
        limitName = 'limit-1';
        LimitElementRegistry['limit-1'] = createSimpleElement({
          top: 100,
          bottom: 1000
        });
        result = AccessorFactory.createSecondaryLimitAccessor(limitName);
      }));

      checkResultFunctionCall(function() {
        return result;
      }, 100, 'top offset of the limit element');
    });

    describe('When called limit name that does not exist', function() {
      var result;
      var limitName;
      beforeEach(function() {
        limitName = 'limit-1';
        result = AccessorFactory.createSecondaryLimitAccessor(limitName);
      });
      checkResultFunctionCall(function() {
        return result;
      }, Infinity);

      describe('When limit was registered suddenly', function() {
        beforeEach(inject(function(LimitElementRegistry) {
          LimitElementRegistry[limitName] = createSimpleElement({
            top: 400,
            bottom: 700
          });
        }));

        checkResultFunctionCall(function() {
          return result;
        }, 400, 'top offset of the limit element');
      });
    });

    describe('When called with undefined value', function() {
      var result;
      beforeEach(function() {
        result = AccessorFactory.createSecondaryLimitAccessor();
      });

      checkResultFunctionCall(function() { return result; }, Infinity);
    });
  });

  function checkResultFunctionCall(resultFnGetter,
    expectedAnswer, desc) {

    describe('When result function is called', function() {
      it(`should return ${expectedAnswer}` + (desc ? ` — ${desc}` : '') ,
      function() {
        expect(resultFnGetter()()).toEqual(expectedAnswer);
      });
    });
  }
});
