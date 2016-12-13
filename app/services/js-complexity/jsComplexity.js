'use strict';

angular.module('myApp')
.service('jsComplexity', function(){
  function countIfs(jsCode){
  	let complexity = jsCode.match(/(\bif\b)|(\belse if\b)|(\?)/gi);
    return (complexity) ? complexity.length : 0;
  }
  function countSwitchs(jsCode){
  	let complexity = jsCode.match(/(\bcase\b)/gi);
    return (complexity) ? complexity.length : 0; 
  }
  function countLoops(jsCode){
  	let complexity = jsCode.match(/(\bfor\b)|(\bwhile\b)/gi);
    return (complexity) ? complexity.length : 0; 
  }
  function setData(context, key, val){
  	context[key] = (context[key]) ? context[key] + val : val;
  	return context;
  }
  function esprimaComplexity(obj, whitelist, data){
  	/* specifically for esprima objects */
  	if (Array.isArray(obj)){
  		for (let i = 0; i < obj.length; i++){
  			esprimaComplexity(obj[i], whitelist, data); }
  	}
  	if (obj.type && whitelist.indexOf(obj.type) !== -1){
  		/* if switch, find number of cases */
  		if (obj.type === 'SwitchStatement'){
  			let cases = (!obj.cases[obj.cases.length-1].test) ? obj.cases.length - 1 : obj.cases.length;
  			data = setData(data, 'CaseStatement', cases); } 
  		else {
  			data = setData(data, obj.type, 1); }
  		/* left node / eval false */
  		if (obj.alternate){
  			esprimaComplexity(obj.alternate, whitelist, data); }
  		/* right node / eval true */
  		if (obj.consequent){
  			esprimaComplexity(obj.consequent, whitelist, data); }
  	} else if (obj.type && (obj.type === 'ExpressionStatement' && obj.expression.right && obj.expression.right.type === 'ConditionalExpression') || (obj.type === 'ReturnStatement' && obj.argument.type === 'ConditionalExpression')){
  		/* look for ternary operators */
  		data = setData(data, 'TernaryStatement', 1); }
  	if (obj.body){
  		esprimaComplexity(obj.body, whitelist, data); }
  	return data;
  }
  this.evaluate = function(jsCode, parser = false){
  	let complexity = 1;
  	this.details = {};
  	if (parser){
  		/* utilize esprima methodology */
  		let rawDetails = {},
  				parsed = esprima.parse(jsCode);
  		rawDetails = esprimaComplexity(parsed.body, ['IfStatement', 'SwitchStatement', 'ForStatement', 'DoWhileStatement', 'WhileStatement'], {});
  		for (let key in rawDetails){
  			this.details[key.replace('Statement','')] = rawDetails[key];
  		}
  	}
  	else {
  		/* utilize regex methodology */
	  	let sanitized = jsCode.replace(/'.*?'|".*?"/g,'...');
	  	this.details.If = countIfs(sanitized);
	  	this.details.Case = countSwitchs(sanitized);
	  	this.details.Loop = countLoops(sanitized);
  	}
  	if (Object.keys(this.details).length > 0){
  		complexity += Object.values(this.details).reduce((a,b)=> a + b); }
    return complexity;
  };
});