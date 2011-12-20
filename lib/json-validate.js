
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
      ;

    errors = errors.concat(validate.type(schema, value, options));

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
    var type = schema.type || 'any';

    if ('[object String]' === toString.call(type)) {
      return validate.type.simple(schema, value, options);
    }
    if ('[object Array]' === toString.call(type)) {
      return validate.type.union(schema, value, options);
    }

    return [];
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

  validate.type.simple = function (schema, value, options) {
    var type = schema.type;

    if (type === 'null') {
      return validate.null(schema, value, options);
    }
    if (type === 'object') {
      return validate.object(schema, value, options);
    }
    if (type === 'array') {
      return validate.array(schema, value, options);
    }
    if (type === 'string') {
      return validate.string(schema, value, options);
    }
    if (type === 'number') {
      return validate.number(schema, value, options);
    }
    if (type === 'integer') {
      return validate.integer(schema, value, options);
    }
    if (type === 'boolean') {
      return validate.boolean(schema, value, options);
    }

    return [];
  };

  /**
   * Validate 'value' against a union type definition.
   *
   * @param {Array} types union type definition
   * @param value value
   * @param {Object} options options
   * @param {String} options.path path of value to validate
   * @return {Array} array of errors
   * @api private
   */

  validate.type.union = function (schema, value, options) {
    var types = schema.type
      , valid
      ;

    valid = types.some(function (type) {
      var errors = validate.type.union.item(type, value, options);
      return errors.length === 0;
    });

    if (!valid) {
      return [options.path + ' type is not valid'];
    }

    return [];
  };

  /**
   * Validate 'value' against an item of a union type definition.
   *
   * @param {String|Object} type type definition
   * @param value value
   * @param {Object} options options
   * @param {String} options.path path of value to validate
   * @return {Array} array of errors
   * @api private
   */

  validate.type.union.item = function (type, value, options) {
    var schema;

    if (toString.call(type) === '[object String]') {
      schema = { type: type };
      return validate.type.simple(schema, value, options);
    }
    if (toString.call(type) === '[object Object]') {
      schema = type;
      return validate(schema, value, options);
    }
  };

  /**
   * Validate 'value' against null definition.
   *
   * @param {Object} schema schema
   * @param value value
   * @param {Object} options options
   * @param {String} options.path path of value to validate
   * @return {Array} array of errors
   * @api private
   */

  validate.null = function (schema, value, options) {
    var errors = [];

    if (value !== null) {
      errors.push(options.path + ' value should be null');
      return errors;
    }

    return errors;
  };

  /**
   * Validate 'value' against object definition.
   *
   * @param {String} type type definition
   * @param value value
   * @param {Object} options options
   * @param {String} options.path path of value to validate
   * @return {Array} array of errors
   * @api private
   */

  validate.object = function (schema, value, options) {
    var errors = [];

    if (toString.call(value) !== '[object Object]') {
      return [options.path + ' type should be object'];
    }

    errors = errors
      .concat(validate.object.properties(schema, value, options))
      .concat(validate.object.properties.pattern(schema, value, options))
      .concat(validate.object.properties.additional(schema, value, options));

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
      , properties = schema.properties || {}
      ;

    Object.keys(properties).forEach(function (key) {
      var schema = properties[key]
        , item = value[key]
        , opts = {path: options.path + '/' + key}
        ;
      errors = errors.concat(validate(schema, item, opts));
    });

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
      , properties = schema.patternProperties || {}
      ;

    Object.keys(properties).forEach(function (pattern) {
      var regexp = new RegExp(pattern);
      Object.keys(value).forEach(function (key) {
        var schema = properties[pattern]
          , item = value[key]
          , opts = {path: options.path + '/' + key}
          ;

        if (regexp.test(key)) {
          errors = errors.concat(validate(schema, item, opts));
        }
      });
    });

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
      , properties = schema.properties || {}
      , additionals = schema.additionalProperties || {}
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

    for (key in value) {
      if (!(key in properties)) {
        current_path = path + '/' + key;
        temp = validate(additionals, value[key], {path: current_path});
        errors = errors.concat(temp);
      }
    }

    return errors;
  };

  /**
   * Validate 'value' against array definition.
   *
   * @param {Object} schema schema
   * @param value value
   * @param {Object} options options
   * @param {String} options.path path of value to validate
   * @return {Array} array of errors
   * @api private
   */

  validate.array = function (schema, value, options) {
    var errors = [];

    if (toString.call(value) !== '[object Array]') {
      errors.push(options.path + ' type should be array')
      return errors;
    }

    errors = errors
      .concat(validate.array.items(schema, value, options));

    return errors;
  };

  /**
   * Validate 'value' against array items definition.
   *
   * @param {Object} schema schema
   * @param value value
   * @param {Object} options options
   * @param {String} options.path path of value to validate
   * @return {Array} array of errors
   * @api private
   */

  validate.array.items = function (schema, value, options) {
    var errors = []
      , items = schema.items || {}
      ;

    if (toString.call(items) === '[object Object]') {
      if (Object.keys(items).length > 0) {
        return validate.array.items.schema(schema, value, options);
      }
    }
    if (toString.call(items) === '[object Array]') {
      return validate.array.items.schemas(schema, value, options);
    }

    return errors;
  };

  /**
   * Validate 'value' against array items schema definition.
   *
   * @param {Object} schema schema
   * @param value value
   * @param {Object} options options
   * @param {String} options.path path of value to validate
   * @return {Array} array of errors
   * @api private
   */

  validate.array.items.schema = function (schema, value, options) {
    var errors = []
      , items = schema.items
      ;

    value.forEach(function (item, i) {
      console.log(item, i, options);
      var schema = items
        , value = item
        , opts = {path: options.path + '/' + i}
        ;
      errors = errors.concat(validate(schema, value, opts));
    });

    return errors;
  };

  /**
   * Validate 'value' against array items schema definition.
   *
   * @param {Object} schema schema
   * @param value value
   * @param {Object} options options
   * @param {String} options.path path of value to validate
   * @return {Array} array of errors
   * @api private
   */

  validate.array.items.schemas = function (schema, value, options) {
    var errors = [];

    return errors;
  };

  /**
   * Validate 'value' against string definition.
   *
   * @param {Object} schema schema
   * @param value value
   * @param {Object} options options
   * @param {String} options.path path of value to validate
   * @return {Array} array of errors
   * @api private
   */

  validate.string = function (schema, value, options) {
    var errors = [];

    if (toString.call(value) !== '[object String]') {
      errors.push(options.path + ' type should be string')
      return errors;
    }

    return errors;
  };

  /**
   * Validate 'value' against number definition.
   *
   * @param {Object} schema schema
   * @param value value
   * @param {Object} options options
   * @param {String} options.path path of value to validate
   * @return {Array} array of errors
   * @api private
   */

  validate.number = function (schema, value, options) {
    var errors = [];

    if (toString.call(value) !== '[object Number]') {
      errors.push(options.path + ' type should be number');
      return errors;
    }

    return errors;
  };

  /**
   * Validate 'value' against integer definition.
   *
   * @param {Object} schema schema
   * @param value value
   * @param {Object} options options
   * @param {String} options.path path of value to validate
   * @return {Array} array of errors
   * @api private
   */

  validate.integer = function (schema, value, options) {
    var errors = [];

    if (!(toString.call(value) === '[object Number]' && value % 1 === 0)) {
      errors.push(options.path + ' type should be integer');
      return errors;
    }

    return errors;
  };

  /**
   * Validate 'value' against boolean definition.
   *
   * @param {Object} schema schema
   * @param value value
   * @param {Object} options options
   * @param {String} options.path path of value to validate
   * @return {Array} array of errors
   * @api private
   */

  validate.boolean = function (schema, value, options) {
    var errors = [];

    if (toString.call(value) !== '[object Boolean]') {
      errors.push(options.path + ' type should be boolean');
      return errors;
    }

    return errors;
  };

}(this));
