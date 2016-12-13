'use strict';

describe('myApp.jsComplexity Service', function() {

  beforeEach(module('myApp'));
  
  beforeEach(module('myApp.version'));

  describe('jsComplexity Service', function(){

    it('should exist', inject(function(jsComplexity) {
      expect(jsComplexity).toBeDefined();
      expect(jsComplexity.evaluate).toBeDefined();
    }));
  
    /* REGEX METHODOLOGY */
    it('should evaluate a single if correctly', inject(function(jsComplexity) {
       expect(jsComplexity.evaluate('function check(a){ if(a){return a;}}')).toEqual(2);
    }));
  
    it('should evaluate an if, else correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ if(a){return a;}else{return 0;}}')).toEqual(2);
    }));
  
    it('should evaluate an if, else if, else correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ if(a=1){return a;}else if(a=0){return 2;}else{return 0;}}')).toEqual(3);
    }));

    it('should evaluate an if, else if (2), else correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ if(a=1){return a;}else if(a=-1){return 1;}else if(a=0){return 2;}else{return 0;}}')).toEqual(4);
    }));

    it('should ignore conditions in strings', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ if(a=1){return "if";}else{return "else";}}')).toEqual(2);
    }));

    it('should ignore variables containing if or else', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ var testif = true, elsetest = false; return testif; }}')).toEqual(1);
    }));

    it('should evaluate a single case switch correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ switch(a) { case 0: return 0;} }}')).toEqual(2);
    }));

    it('should evaluate a multi case switch correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ switch(a) { case 0: return 0; case 1: return 1; default: break; } return null; }}')).toEqual(3);
    }));

    it('should evaluate a multi case fall-through switch correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ switch(a) { case 0: case 1: return 1; default: return null; } }}')).toEqual(3);
    }));

    it('should evaluate a two sequential switch/case(x2) correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ switch(a) { case 0: return 0; case 1: return 1; default: return null; switch(a) { case 0: case 1: return 1; default: return null; } }}')).toEqual(5);
    }));

    it('should evaluate a for loop correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ for (var i = 0; i < a; i++){ a+=i; } return a; }')).toEqual(2);
    }));

    it('should evaluate a do loop correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ var i = 0; do { a+=i; i++; } while (a < i); return a; }')).toEqual(2);
    }));

    it('should evaluate a while loop correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ var i = 0; while (a > i) { a-=i; i++; } return a; }')).toEqual(2);
    }));

    it('should evaluate a for and while loop correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ var i = 0; for (var i = 0; i < a; i++){ a+=i; } while (a > i) { a-=i; i++; } return a; }')).toEqual(3);
    }));

    it('should evaluate ternary operator correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ return (a > 1) ? true : false; }')).toEqual(2);
    }));

    it('should evaluate multiple ternary operators correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ a = (a > 1) ? true : false; return (a) ? 1 : 0; }')).toEqual(3);
    }));

    /* ESPRIMA METHODOLOGY */
    it('should evaluate a single if correctly', inject(function(jsComplexity) {
       expect(jsComplexity.evaluate('function check(a){ if(a){return a;}}', true)).toEqual(2);
    }));
  
    it('should evaluate an if, else correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ if(a){return a;}else{return 0;}}', true)).toEqual(2);
    }));
  
    it('should evaluate an if, else if, else correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ if(a=1){return a;}else if(a=0){return 2;}else{return 0;}}', true)).toEqual(3);
    }));

    it('should evaluate an if, else if (2), else correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ if(a=1){return a;}else if(a=-1){return 1;}else if(a=0){return 2;}else{return 0;}}', true)).toEqual(4);
    }));

    it('should ignore conditions in strings', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ if(a=1){return "if";}else{return "else";}}', true)).toEqual(2);
    }));

    it('should ignore variables containing if or else', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ var testif = true, elsetest = false; return testif; }', true)).toEqual(1);
    }));

    it('should evaluate a single case switch correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ switch(a) { case 0: return 0;} }', true)).toEqual(2);
    }));

    it('should evaluate a multi case switch correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ switch(a) { case 0: return 0; case 1: return 1; default: break; } return null; }', true)).toEqual(3);
    }));

    it('should evaluate a multi case fall-through switch correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ switch(a) { case 0: case 1: return 1; default: return null; } }', true)).toEqual(3);
    }));

    it('should evaluate a two sequential switch/case(x2) correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ switch(a) { case 0: return 0; case 1: return 1; default: return null; } switch(a) { case 0: case 1: return 1; default: return null; } }', true)).toEqual(5);
    }));

    it('should evaluate a for loop correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ for (var i = 0; i < a; i++){ a+=i; } return a; }', true)).toEqual(2);
    }));

    it('should evaluate a do loop correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ var i = 0; do { a+=i; i++; } while (a < i); return a; }', true)).toEqual(2);
    }));

    it('should evaluate a while loop correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ var i = 0; while (a > i) { a-=i; i++; } return a; }', true)).toEqual(2);
    }));

    it('should evaluate a for and while loop correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ var i = 0; for (var i = 0; i < a; i++){ a+=i; } while (a > i) { a-=i; i++; } return a; }', true)).toEqual(3);
    }));

    it('should evaluate ternary operator correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ return (a > 1) ? true : false; }', true)).toEqual(2);
    }));

    it('should evaluate multiple ternary operators correctly', inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ a = (a > 1) ? true : false; return (a) ? 1 : 0; }', true)).toEqual(3);
    }));
  });
});
  