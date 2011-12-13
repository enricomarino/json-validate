
/*!
 * json-validate
 * JavaScript json schema validation library
 * Copyright (c) 2011 Enrico Marino <enrico.marino@email.com>
 * MIT license
 */

!(function (exports) {

  var undefined
    , toString = {}.toString
    ;

  /**
   * Validate 'json' against 'schema'.
   *
   * @param {Object} schema json schema
   * @param json json
   * @return {Array} array of errors
   * @api public
   */

  exports.validate = function (schema, json) {
    return true;
  };

  /**
   * Library version.
   */

  validate.version = '0.1.0';

  /**
   * Validate 'value' against type definition.
   *
   * @param {Object|String|Array} type type definition
   * @param value value
   * return {Array} array of errors
   */

  validate.type = function (type, value, options) {
    if (toString.call(type) === '[object String]') {
      return validate.type.simple(type, value, options);
    }
    if (to_string.call(type) === '[object Array]') {
      return validate.type.union(type, value, options);
    }
  };

  /**
   * Validate 'value' against simple type definition.
   *
   * @param {String} type type definition
   * @param value value
   * return {Array} array of errors
   */

  validate.type.simple = function (type, value, options) {
    var errors = [];

    if (type !== 'any'
        || (type === 'object' && toString.call(value) !== '[object Object]')
        || (type === 'array' && toString.call(value) !== '[object Array]')
        || (type === 'string' && toString.call(value) !== '[object String]')
        || (type === 'number' && toString.call(value) !== '[object Number]')
        || (type === 'boolean' && toString.call(value) !== '[object Boolean]')
        || (type === 'integer' && toString.call(value) === '[object Number]'
            && value % 1 !== 0))
    {
      errors.push(path + ' type MUST be ' + type);
    }
    return errors;
  };

  /**
   * Validate 'value' against union type definition.
   *
   * @param {String} type type definition
   * @param value value
   * return {Array} array of errors
   */

  validate.type.union = function (type, value, options) {
    var result = type.some(function (type) {
      var error = validate.type.simple(type, value);
      return error.length === 0;
    });
  };

}(this));
