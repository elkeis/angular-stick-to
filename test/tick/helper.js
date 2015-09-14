var helper = (function(module) {
  module.createCase1Element = function() {
    return mock.createStickyElement({
      primaryLimit: 51,
      top: 102,
      bottom: 154,
      secondaryLimit: 213
    });
  };

  module.createCase2Element = function() {
    return mock.createStickyElement({
      top: 51,
      primaryLimit: 102,
      bottom: 154,
      secondaryLimit: 213
    });
  };

  module.createCase3Element = function() {
    return mock.createStickyElement({
      primaryLimit: 51,
      top: 102,
      secondaryLimit: 154,
      bottom: 213,
    });
  };

  module.createCase4Element = function() {
    return mock.createStickyElement({
      top: 73,
      primaryLimit: 102,
      secondaryLimit: 154,
      bottom: 213,
    });
  };

  module.createCase5Element = function() {
    return mock.createStickyElement({
      top: 35,
      primaryLimit: 100,
      bottom: 150,
      secondaryLimit: 200
    });
  };

  module.checkAlreadyInTheSameState = function(getElement, getState) {
    var element;
    var state;
    beforeEach(function() {
      element = getElement();
      state = getState();
    });
    describe('when element already in the same state', function() {
      it('should return false', function() {
        element.state = state;
        expect(state.canBeApplied(element)).toBeFalsy();
      });
    });
  };

  return module;
}(helper || {}));
