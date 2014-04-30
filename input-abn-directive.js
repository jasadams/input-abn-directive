angular.module('input-abn-directive',[])
  .directive('input', function() {
    'use strict';
    return {
      restrict: 'E',
      require: '?ngModel',
      link: function(scope, elm, attrs, ngModel) {

        // if the input is not type abn return immediately
        if (attrs.type !== 'abn') {
          return;
        }

        function formatABN(abn, adding) {
          var gapIndex = [2, 5, 8];
          var returnVal = abn;
          var i = gapIndex.length;
          while(i--) {
            var index = gapIndex[i];
            if (abn.length > index) {
              returnVal = returnVal.slice(0,index) + ' ' + returnVal.slice(index);
            }
            if (abn.length === index && adding) {
              returnVal += ' ';
            }
          }
          return returnVal;
        }
        var prevLength = 0;
        var modelValue = null;
        var weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

        // watch the scope array that contains the list of invalid values for changes

        // Call the "checkValue" called whenever the value in the element changes
        if (ngModel) {
          ngModel.$parsers.unshift(checkValue);
          scope.$watch(function() {
            return ngModel.$modelValue;
          }, function(newValue) {
            // If we have already validated and formated because of user input, don't do it again
            if (newValue !== modelValue) {
              checkValue(newValue);
            }
          }, true);
        }

        // This is the function that does the validation
        function checkValue(viewValue) {

          // Only check if the viewValue is defined
          if (typeof viewValue !== 'undefined') {

            // strip anything other than digits
            var abn = viewValue.replace(/[^0-9]+/g, '');

            // Trim any extra digits after 11
            if (abn.length > 11) {
              abn = abn.substring(0,11);
            }

            // if the abn length is zero, then we will set the input to blank and mark the field as valid
            // The required attribute should be used if the field is required
            if (abn.length === 0) {
              ngModel.$setValidity('abn', true);
              ngModel.$viewValue = '';
              ngModel.$render();
              return abn;
            }

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
                if (ngModel) {
                  ngModel.$setValidity('abn', true);

                  // We have a valid ABN, no need to add trailing space so set adding to false
                  ngModel.$viewValue = formatABN(abn,false);
                  // Not using $setViewValue so we don't clobber the model value and dirty the form
                  // without any kind of user interaction.
                  ngModel.$render();
                }
                modelValue = abn;
                return abn;
              }
            }
            if (ngModel) {
              // Work out whether we are adding or removing character to implement the correct formatting of the viewValue
              var adding = Boolean(abn.length > prevLength);
              prevLength = abn.length;

              // Set the view value and validity
              ngModel.$setValidity('abn', false);
              ngModel.$viewValue = formatABN(abn,adding);
              // Not using $setViewValue so we don't clobber the model value and dirty the form
              // without any kind of user interaction.
              ngModel.$render();
            }
            modelValue = abn;
            return abn;
          }
        }
      }
    };
  }
);
