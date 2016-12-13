'use strict';

angular.module('myApp')
.controller('mainViewCtrl', ['$scope', 'jsComplexity', '$sce',
 function($scope, jsComplexity, $sce) {

  $scope.reset = function() {
    $scope.jsCode = [ "// Expected Complexity: 3\n",
                      "function a(x) {\n",
                      "    if (true) {\n",
                      "        return 'if'; // 1st path\n",
                      "    } else if (false) {\n",
                      "        return x+1; // 2nd path\n",
                      "    } else {\n",
                      "        return 4; // 3rd path\n",
                      "    }\n",
                      "}"].join('');
    $scope.checkJSCode($scope.jsCode);
  };

  $scope.checkJSCode = function (code)
  {
  	let parser = document.getElementById('opt-esprima').checked,
  			detail = document.getElementById('opt-details').checked;
    $scope.checkResult = jsComplexity.evaluate(code, parser);
    if (detail){
    	let context = jsComplexity.details,
    			report = '';
    	for (let key in context){
    		if (context[key]){
    			report += key+' statements found: '+context[key]+'<br>'; }
    	}
    	$scope.detailedReport = $sce.trustAsHtml(report);
    }
  };

  $scope.reset();
}]);