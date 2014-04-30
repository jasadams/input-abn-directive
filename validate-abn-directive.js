angular.module('validate-abn-directive',[])
  .directive('validateAbn', function() {
    'use strict';
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {

        var weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

        // watch the scope array that contains the list of invalid values for changes

        // Call the "checkValue" called whenever the value in the element changes
        ctrl.$parsers.unshift(checkValue);

        scope.$watch(function() {
          return ctrl.$modelValue;
        }, function(newValue) {
          checkValue(newValue);
        }, true);

        // This is the function that does the validation
        function checkValue(viewValue) {

          // Only check if the viewValue is defined
          if (typeof viewValue !== 'undefined') {
            // If the input is not required, and the user hasn't entered a value, then don't mark as invalid
            if (viewValue.length === 0 && typeof attrs.required === 'undefined') {
              ctrl.$setValidity('validAbn', true);
              return viewValue;
            }

            // strip anything other than digits
            var abn = viewValue.replace(/[^0-9]+/g, '');

            // abn is always 11 digits long
            if (abn.length === 11) {

              // apply ato check method
              var sum=0;
              var digit = null;
              for (var i=0; i<weights.length; i++) {
                digit = parseInt(abn.substring(i,i+1) - (i ? 0 : 1),10);
                sum += weights[i] * digit;
              }
              if (sum%89 === 0) {
                ctrl.$setValidity('validAbn', true);
                return abn;
              }
            }
            ctrl.$setValidity('validAbn', false);
            return abn;
          }
        }
      }
    };
  }
);
