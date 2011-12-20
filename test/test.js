var undefined
  , validate = require('../lib/json-validate').validate
  , should = require('should')
  ;

describe('validate', function () {

  var schema
    , value
    , errors
    ;

  describe('type', function () {

    describe('simple type any', function () {

      it('value string', function () {
        schema = {'type': 'any'};
        value = 'whatever';
        errors = validate(schema, value);
        errors.should.be.empty;
      });

    });

    describe('simple type array', function () {

      it('value array', function () {
        schema = {'type': 'array'};
        value = [1, 2, 3];
        errors = validate(schema, value);
        errors.should.be.empty;
      });

      it('value not array', function () {
        schema = {'type': 'array'};
        value = '[1, 2, 3]';
        errors = validate(schema, value);
        errors.should.not.be.empty;
      });

    });

    describe('simple number', function () {

      it('value number', function () {
        schema = {'type': 'number'};
        value = 42;
        errors = validate(schema, value);
        errors.should.be.empty;
      });

      it('value not number', function () {
        schema = {'type': 'number'};
        value = '42';
        errors = validate(schema, value);
        errors.should.not.be.empty;
      });

    });

    describe('simple string', function () {

      it('value string', function () {
        schema = {'type': 'string'};
        value = 'hello world';
        errors = validate(schema, value);
        errors.should.be.empty;
      });

      it('value not string', function () {
        schema = {'type': 'string'};
        value = ['hello', 'world'];
        errors = validate(schema, value);
        errors.should.not.be.empty;
      });

    });

    describe('simple integer', function () {

      it('value integer', function () {
        schema = {'type': 'integer'};
        value = 42;
        errors = validate(schema, value);
        errors.should.be.empty;
      });

      it('value not integer', function () {
        schema = {'type': 'integer'};
        value = 1.4142135;
        errors = validate(schema, value);
        errors.should.not.be.empty;
      });

      it('value not integer', function () {
        schema = {'type': 'integer'};
        value = 'hello world';
        errors = validate(schema, value);
        errors.should.not.be.empty;
      });

    });

    describe('simple boolean', function () {

      it('value boolean', function () {
        schema = {'type': 'boolean'};
        value = false;
        errors = validate(schema, value);
        errors.should.be.empty;
      });

      it('value not integer', function () {
        schema = {'type': 'boolean'};
        value = 1;
        errors = validate(schema, value);
        errors.should.not.be.empty;
      });

    });

    describe('union type', function () {

      it('value type in with any', function () {
        schema = {'type': ['any', 'string']};
        value = 'hello world';
        errors = validate(schema, value);
        errors.should.be.empty;
      });

      it('value type not in union with any', function () {
        schema = {'type': ['any', 'integer']};
        value = 'hello world';
        errors = validate(schema, value);
        errors.should.be.empty;
      });

      it('value type in union with null', function () {
        schema = {'type': ['null', 'integer']};
        value = 42;
        errors = validate(schema, value);
        errors.should.be.empty;
      });

      it('value type not in union with null', function () {
        schema = {'type': ['null', 'string']};
        value = 42;
        errors = validate(schema, value);
        errors.should.not.be.empty;
      });

      it('value type in union with schema', function () {
        schema = {'type': [{'type': 'integer'}, 'array']};
        value = 42;
        errors = validate(schema, value);
        errors.should.be.empty;
      });

      it('value type not in union with schema', function () {
        schema = {'type': [{'type': 'integer'}, 'array']};
        value = 'hello world';
        errors = validate(schema, value);
        errors.should.not.be.empty;
      });

    });

  });

  describe('object', function () {

    describe('properties', function () {

      it('value has properties', function () {
        schema = {
          'type': 'object',
          'properties': {
            'p1': { 'type': 'string' },
            'p2': { 'type': 'number' }
          }
        };
        value = {
          p1: 'π',
          p2: 3.141592
        };
        errors = validate(schema, value);
        errors.should.be.empty;
      });

    });

    describe('pattern properties', function () {

      it('value has property that match', function () {
        schema = {
          'type': 'object',
          'patternProperties': {
            '/\d\d?\.\d\d?\.\d\d?\./': {
              'type': 'string'
            }
          }
        };
        value = {
          '0.0.1': 'alpha',
          'beta': 'gamma'
        };
        errors = validate(schema, value);
        errors.should.be.empty;
      });

      it('value has property that does not match', function () {
        schema = {
          'type': 'object',
          'patternProperties': {
            '/\d\d?\.\d\d?\.\d\d?\./': {
              'type': 'string'
            }
          }
        };
        value = {
          'π': 3.141592,
        };
        errors = validate(schema, value);
        errors.should.be.empty;
      });

    });


  });

});