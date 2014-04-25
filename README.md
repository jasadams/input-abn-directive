# validate-abn-directive

[AngularJS](http://angularjs.org/) directive for checking whether the value in an input field is a valid ABN
(Australian Business Number).

## How to use it

You must include the validate-abn-directive dependency on your angular module:

    var app = angular.module("demoapp", ["validate-abn-directive"]);

After that, you simply add the "validate-abn" attribute in the input you would like to validate

    <input name="abn" ng-model="abn" validate-abn>

You can then check whether the value failed this particular test by checking the "validAbn" property of $error object.
 e.g.

    ng-class="{invalid-abn: myForm.abn.$error.validAbn}"
