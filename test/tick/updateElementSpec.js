describe('update element Function', function() {
  var updateElement;
  beforeEach(function() {
    module('ng-stick-to');
    inject(function(_updateElement_) {
      updateElement = _updateElement_;
    });
  });

  describe('when called with element in Case1', function() {
    var element;
    beforeEach(function() {
      element = mock.createStickyElement({
        primaryLimit: 50,
        top: 100,
        bottom: 110,
        secondaryLimit: 150
      });
    });

    [0, 5, 65].forEach(function(offset) {
      describe(`when has offset ${offset}`, function() {
        beforeEach(function() {
          element.setSyntheticOffset(offset);
          element.setSyntheticOffset.calls.reset();
        });
        it('should set 0 offset', function() {
          updateElement(element);
          expect(element.setSyntheticOffset).toHaveBeenCalledWith(0);
        });
      });
    });
  });

  describe('when called with element in Case2', function() {
    var element;
    var expectedOffset;
    beforeEach(function() {
      element = mock.createStickyElement({
        top: 50,
        primaryLimit: 60,
        bottom: 70,
        secondaryLimit: 100
      });
      expectedOffset = element._primaryLimit - element._top;
    });

    [0, 5, 15, 65, 125].forEach(function(offset) {
      describe(`when has offset ${offset}`, function() {
        beforeEach(function() {
          element.setSyntheticOffset(offset);
          element.setSyntheticOffset.calls.reset();
        });
        it('should add expectedOffset to make element sticked to topLimit',
        function() {
          updateElement(element);
          expect(element.setSyntheticOffset)
            .toHaveBeenCalledWith(expectedOffset);
        });
      });
    });
  });

  describe('when called with element in Case3', function() {
    var element;
    beforeEach(function() {
      element = mock.createStickyElement({
        primaryLimit: 50,
        top: 65,
        secondaryLimit: 70,
        bottom: 81,
      });
    });

    [0, 5, 15, 65, 125].forEach(function(offset) {
      describe(`when has offset ${offset}`, function() {
        beforeEach(function() {
          element.setSyntheticOffset(offset);
          element.setSyntheticOffset.calls.reset();
        });
        it('should set 0 offset', function() {
          updateElement(element);
          expect(element.setSyntheticOffset)
            .toHaveBeenCalledWith(0);
        });
      });
    });

  });

  describe('when called with element in Case4', function() {
    var element;
    var expectedOffset;
    beforeEach(function() {
      element = mock.createStickyElement({
        top: 50,
        primaryLimit: 60,
        secondaryLimit: 65,
        bottom: 80,
      });
      expectedOffset = element._secondaryLimit - element._bottom;
    });
    [0, 3, 5, 15, 65, 125].forEach(function(offset) {
      describe(`when has offset ${offset}`, function() {
        beforeEach(function() {
          element.setSyntheticOffset(offset);
          element.setSyntheticOffset.calls.reset();
        });
        it('should stick element to secondaryLimit', function() {
          updateElement(element);
          expect(element.setSyntheticOffset)
            .toHaveBeenCalledWith(expectedOffset);
        });
      });
    });
  });

  describe('when called with element in Case5', function() {
    var element;
    var expectedOffset;
    beforeEach(function() {
      element = mock.createStickyElement({
        top: 50,
        primaryLimit: 70,
        bottom: 71,
        secondaryLimit: 75
      });
      expectedOffset  = element._secondaryLimit - element._bottom;
    });

    [0, 3, 5, 15, 65, 125].forEach(function(offset) {
      describe(`when has offset ${offset}`, function() {
        beforeEach(function() {
          element.setSyntheticOffset(offset);
          element.setSyntheticOffset.calls.reset();
        });
        it('should be sticked to bottom Limit', function() {
          updateElement(element);
          expect(element.setSyntheticOffset)
          .toHaveBeenCalledWith(expectedOffset);
        });
      });
    });
  });
});
