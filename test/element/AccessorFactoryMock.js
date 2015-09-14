var mock = (function(component) {
  /**
   * create accessor factory mock
   *
   * @return {Object}         mock
   */
  component.createAccessorFactoryMock = function() {
    return {
      createPrimaryLimitAccessor: jasmine
        .createSpy('createPrimaryLimitAccessor'),
      createSecondaryLimitAccessor: jasmine
      .createSpy('createSecondaryLimitAccessor')
    };
  };

  return component;
}(mock || {}));
