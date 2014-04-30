# input-abn-directive

[AngularJS](http://angularjs.org/) input directive for creating an "abn" input type. The field will validate and format
the value as an ABN (Australian Business Number)

## How to use it

You must include the input-abn-directive dependency on your angular module:

    var app = angular.module("demoapp", ["input-abn-directive"]);

After that, you simply set the type of the input to "abn"

    <input type="abn" name="inputAbn" ng-model="modelAbn">

You can then check whether the input value failed the abn test by checking the "abn" property of $error object.
 e.g.

    ng-class="{invalid-abn: myForm.inputAbn.$error.abn}"
