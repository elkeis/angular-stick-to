describe('Post digest', function() {

  beforeEach(function() {
    module('ng-stick-to');
  });

  var PostDigest;
  beforeEach(inject(
        function(_postDigest_) {
          PostDigest = _postDigest_;
        }
    ));

  describe('When executed with some call back', function() {
    var callback;
    var removeFn;
    beforeEach(function() {
      callback = jasmine.createSpy('callback');
      removeFn = PostDigest(callback);
    });

    it('should not call it without digest', function() {
      expect(callback).not.toHaveBeenCalled();
    });

    describe('When digest is fired', function() {
      beforeEach(inject(function($rootScope) {
        $rootScope.$apply();
      }));

      it('should not call the callback', function() {
        expect(callback).not.toHaveBeenCalled();
      });

      describe('When digest is ended', function() {
        beforeEach(inject(function($timeout) {
          $timeout.flush();
        }));

        it('should call the handler', function() {
          expect(callback).toHaveBeenCalled();
        });

        it('should call the handler once', function() {
          expect(callback.calls.count()).toEqual(1);
        });

        describe('When fire anothe digest', function() {
          beforeEach(inject(function($rootScope) {
            callback.calls.reset();
            $rootScope.$apply();
          }));

          it('should not call the callback', function() {
            expect(callback).not.toHaveBeenCalled();
          });

          describe('When digest is ended', function() {
            beforeEach(inject(function($timeout) {
              $timeout.flush();
            }));

            it('should call the handler', function() {
              expect(callback).toHaveBeenCalled();
            });

            it('should call the handler once', function() {
              expect(callback.calls.count()).toEqual(1);
            });
          });
        });

      });

      describe('When remove function executed during digest', function() {
        beforeEach(function() {
          removeFn();
        });

        describe('When digest is ended', function() {
          beforeEach(inject(function($timeout) {
            $timeout.flush();
          }));

          it('should not call callback', function() {
            expect(callback).not.toHaveBeenCalled();
          });
        });

      });
    });

    describe('When remove fn is called', function() {
      beforeEach(function() {
        removeFn();
      });

      describe('When digest is fired,', function() {
        var $timeout;
        beforeEach(inject(function($rootScope, _$timeout_) {
          $timeout = _$timeout_;
          $rootScope.$apply();
        }));

        it('should not shedule task', function() {
          $timeout.verifyNoPendingTasks();
        });

        it('should not call the callback ', function() {
          expect(callback).not.toHaveBeenCalled();
        });
      });

    });
  });

});
