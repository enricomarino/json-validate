
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

  var validate = exports.validate = function (schema, value) {
    var errors = []
        , options = {path: '#'}
      , temp
      ;

    temp = validate.type(schema, value, options);
    errors.concat(temp);

    return errors;
  };

  /**
   * Library version.
   */

  validate.version = '0.1.0';

  /**
   * Validate 'value' against type definition.
   *
   * @param {Object} schema schema
   * @param value value
   * @param {Object} options options
   * @param {String} options.path path of value to validate
   * @return {Array} array of errors
   * @api private
   */

  validate.type = function (schema, value, options) {
    var errors = []
      , type = schema.type
      , type_class
      ;

    if (type === undefined) {
      return errors;
    }

    type_class = toString.call(type);

    if (type_class === '[object String]') {
      return validate.type.simple(type, value, options);
    }
    if (type_class === '[object Array]') {
      return validate.type.union(type, value, options);
    }

    return errors;
  };

  /**
   * Validate 'value' against simple type definition.
   *
   * @param {String} type type definition
   * @param value value
   * @param {Object} options options
   * @param {String} options.path path of value to validate
   * @return {Array} array of errors
   * @api private
   */

  validate.type.simple = function (type, value, options) {
    var errors = []
      , path = options.path
      , value_class = toString.call(value)
      ;

    if (type === 'any') {
      return errors;
    }

    if ((type === 'object' && value_class !== '[object Object]')
        || (type === 'array' && value_class !== '[object Array]')
        || (type === 'string' && value_class !== '[object String]')
        || (type === 'number' && value_class !== '[object Number]')
        || (type === 'boolean' && value_class !== '[object Boolean]')
        || (type === 'integer' && value_class === '[object Number]'
            && value % 1 !== 0))
    {
      errors.push('type of value ' + path + ' should be ' + type);
    }

    return errors;
  };

  /**
   * Validate 'value' against union type definition.
   *
   * @param {String} type type definition
   * @param value value
   * @param {Object} options options
   * @param {String} options.path path of value to validate
   * @return {Array} array of errors
   * @api private
   */

  validate.type.union = function (types, value, options) {
    var errors = []
      , path = options.path
      , valid
      , len = types.length
      , i
      , temp
      ;

    for (i = 0; i < len; i += 1) {
      temp = validate.type.simple(type, value, options);
      errors.concat(temp);
      if (temp.length === 0) {
        return [];
      }
    }

    return errors;
  };

  /**
   * Validate 'value' against union type definition.
   *
   * @param {String} type type definition
   * @param value value
   * @param {Object} options options
   * @param {String} options.path path of value to validate
   * @return {Array} array of errors
   * @api private
   */

  validate.object = function (schema, value, options) {
    var errors = []
      , temp
      ;

    temp = validate.object.properties(schema, value, options);
    errors.concat(temp);

    temp = validate.object.properties.pattern(schema, value, options);
    errros.concat(temp);

    temp = validate.object.properties.additional(schema, value, options);
    errors.concat(temp);

    return errors;
  };

  /**
   * Validate value against properties definition.
   *
   * @param {Object} schema schema
   * @param {Object} value value
   * @param {Object} options options
   * @param {String} options.path path of value to validate
   * @return {Array} array of errors
   * @api private
   */

  validate.object.properties = function (schema, value, options) {
    var errors = []
      , path = options.path
      , properties = schema.properties
      , key
      , temp
      ;

    if (properties === undefined) {
      return errors;
    }

    for (key in properties) {
      temp = validate(properties[key], value[key], options);
      errors.concat(temp);
    }

    return errors;
  };

  /**
   * Validate value against pattern properties definition.
   *
   * @param {Object} schema schema
   * @param {Object} value value
   * @param {Object} options options
   * @param {String} options.path path of value to validate
   * @return {Array} array of errors
   * @api private
   */

  validate.object.properties.pattern = function (schema, value, options) {
    var errors = []
      , properties = schema.patternProperties
      , pattern
      , key
      , temp
      , current_path
      ;

    if (properties === undefined) {
      return errors;
    }

    for (pattern in properties) {
      for (key in value) {
        if (key.match(pattern)) {
          current_path = path + '/' + key;
          temp = validate(properties[pattern], value[key], {
            path: current_path
          });
          errors.concat(temp);
        }
      }
    }

    return errors;
  };

  /**
   * Validate value against additional properties definition.
   *
   * @param {Object} schema schema
   * @param {Object} value value
   * @param {Object} options options
   * @param {String} options.path path of value to validate
   * @return {Array} array of errors
   * @api private
   */

  validate.object.properties.additional = function (schema, value, options) {
    var errors = []
      , path = options.path
      , properties = schema.properties
      , additionals = schema.additionalProperties
      , key
      , temp
      , current_path
      ;

    if (additionals === undefined) {
      return errors;
    }

    if (additionals === false) {
      for (key in value) {
        if (!(key in properties)) {
          errors.push(path + ' has an additional properties');
        }
      }
      return errors;
    }

    for (key in additionals) {
      if (key in value) {
        current_path = path + '/' + key;
        temp = validate(additionals[key], value[key], {path: current_path});
        errors.concat(temp);
      }
    }

    return errors;
  };

}(this));
