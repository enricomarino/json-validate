// json-validate.js
// JavaScript fast json schema validation library
//
// Copyright 2011 Enrico Marino
// MIT license

!function (name, definition) {
    if (typeof module != 'undefined') module.exports = definition
    else if (typeof define == 'function' && define.amd) define(name, definition)
    else this[name] = definition
}('json', function (context, undefined) {

    var to_string = {}.toString;
 
    function validate (schema, value, options) {
        options = options || {};

// 5.29.  $schema
//    This attribute defines a URI of a JSON Schema that is the schema of
//    the current schema.  When this attribute is defined, a validator
//    SHOULD use the schema referenced by the value's URI (if known and
//    available) when resolving Hyper Schema (Section 6) links
//    (Section 6.1).

//    A validator MAY use this attribute's value to determine which version
//    of JSON Schema the current schema is written in, and provide the
//    appropriate validation features and behavior.  Therefore, it is
//    RECOMMENDED that all schema authors include this attribute in their
//    schemas to prevent conflicts with future JSON Schema specification
//    changes.
        schema = schema || value.$schema;
        if (!schema) {
            return 'schema is missing';
        }

        var path = options.path || '#',
            type = schema.type,
            properties = schema.properties,
            patternProps = schema.patternProperties,
            additionalProperties = schema.additionalProperties,
            items = schema.items,
            additionalItems = schema.additionalItems,
            dependencies = schema.dependencies,
            required = required,
            minimum = schema.minimum,
            maximum = schema.maximum,
            exclusiveMinimum = schema.exclusiveMinimum,
            exclusiveMaximum = schema.exclusiveMaximum,
            minItems = schema.minItems,
            maxItems = schema.maxItems,
            uniqueItems = schema.uniqueItems,
            pattern = schema.pattern,
            minLength = schema.minLength,
            maxLength = schema.maxLength,
            enums = schema.enums,
            divisibleBy = schema.divisibleBy,
            defaults = schema['default'],
            disallow = schema.disallow,
            extend = schema['extends'],
            result,
            formats = {};

// 5.23.  format
//    This property defines the type of data, content type, or microformat
//    to be expected in the instance property values.  A format attribute
//    MAY be one of the values listed below, and if so, SHOULD adhere to
//    the semantics describing for the format.  A format SHOULD only be
//    used to give meaning to primitive types (string, integer, number, or
//    boolean).  Validators MAY (but are not required to) validate that the
//    instance values conform to a format.  The following formats are
//    predefined:

//    date-time  This SHOULD be a date in ISO 8601 format of YYYY-MM-
//        DDThh:mm:ssZ in UTC time.  This is the recommended form of date/
//        timestamp.
        formats['date-time'] = ''; // TODO

//    date  This SHOULD be a date in the format of YYYY-MM-DD.  It is
//        recommended that you use the "date-time" format instead of "date"
//        unless you need to transfer only the date part.
        formats['date'] = ''; // TODO

//    time  This SHOULD be a time in the format of hh:mm:ss.  It is
//        recommended that you use the "date-time" format instead of "time"
//        unless you need to transfer only the time part.
        formats['time'] = ''; // TODO

//    utc-millisec  This SHOULD be the difference, measured in
//        milliseconds, between the specified time and midnight, 00:00 of
//        January 1, 1970 UTC.  The value SHOULD be a number (integer or
//        float).
        formats['utc-millisec'] = ''; // TODO

//    regex  A regular expression, following the regular expression
//        specification from ECMA 262/Perl 5.
        formats['regex'] = ''; // TODO

//    color  This is a CSS color (like "#FF0000" or "red"), based on CSS
//        2.1 [W3C.CR-CSS21-20070719].
        formats['color'] = ''; // TODO

//    style  This is a CSS style definition (like "color: red; background-
//        color:#FFF"), based on CSS 2.1 [W3C.CR-CSS21-20070719].
        formats['style'] = ''; // TODO

//    phone  This SHOULD be a phone number (format MAY follow E.123).
        formats['phone'] = ''; // TODO

//    uri  This value SHOULD be a URI..
        formats['uri'] = ''; // TODO

//    email  This SHOULD be an email address.
        formats['email'] = ''; // TODO

//    ip-address  This SHOULD be an ip version 4 address.
        formats['ip-address'] = ''; // TODO

//    ipv6  This SHOULD be an ip version 6 address.
        formats['ipv6'] = ''; // TODO

//    host-name  This SHOULD be a host-name.
        formats['host-name'] = ''; // TODO

//    Additional custom formats MAY be created.  These custom formats MAY
//    be expressed as an URI, and this URI MAY reference a schema of that
//    format.

// 5.26.  extends
//    The value of this property MUST be another schema which will provide
//    a base schema which the current schema will inherit from.  The
//    inheritance rules are such that any instance that is valid according
//    to the current schema MUST be valid according to the referenced
//    schema.  This MAY also be an array, in which case, the instance MUST
//    be valid for all the schemas in the array.  A schema that extends
//    another schema MAY define additional attributes, constrain existing
//    attributes, or add other constraints.

//    Conceptually, the behavior of extends can be seen as validating an
//    instance against all constraints in the extending schema as well as
//    the extended schema(s).  More optimized implementations that merge
//    schemas are possible, but are not required.  An example of using
//    "extends":

//    {
//      "description":"An adult",
//      "properties":{"age":{"minimum": 21}},
//      "extends":"person"
//    }

//    {
//      "description":"Extended schema",
//      "properties":{"deprecated":{"type": "boolean"}},
//      "extends":"http://json-schema.org/draft-03/schema"
//    }
        if (extend !== undefined && value !== undefined) {
            if (to_string.call(extend) === '[object Object]') {
                result = validate(extend, value, {path: path});
            }
            else if (to_string.call(extend) === '[object Array]') {
                result = extend.some(function (schema) {
                    !validate(schema, value, {path: path});
                });
            }
            if (result !== true) {
                return result;
            }
        }

//5.1.  type
//    This attribute defines what the primitive type or the schema of the
//    instance MUST be in order to validate.  
        if (type !== undefined && value !== undefined) {

//    This attribute can take one of two forms:

//        Simple Types  A string indicating a primitive or simple type.
            if (to_string.call(type) === '[object String]') {

//            The following are acceptable string values:

//            string  Value MUST be a string.
                if (type === 'string'
                        && to_string.call(value) !== '[object String]') {
                    return path + ' value MUST be a string';
                }
//            number  Value MUST be a number, floating point numbers are
//                allowed.
                else if (type === 'number' 
                        && to_string.call(value) !== '[object Number]') {
                    return path + ' value MUST be a number';
                }
//            integer  Value MUST be an integer, no floating point numbers are
//                allowed.  This is a subset of the number type.
                else if (type === 'integer'
                        && to_string.call(value) !== '[object Number]'
                        && value % 1 !== 0) {
                    return path + ' value MUST be an integer';
                }
//            boolean  Value MUST be a boolean.
                else if (type === 'boolean'
                        && to_string.call(value) !== '[object Boolean]') {
                    return path + ' value MUST be a boolean';
                }
//            object  Value MUST be an object.
                else if (type === 'object'
                        && to_string.call(value) !== '[object Object]') {
                    return path + ' value MUST be an object';
                }
//            array  Value MUST be an array.
                else if (type === 'array'
                        && to_string.call(value) !== '[object Array]') {
                    return path + ' value MUST be an array';
                }
//            null  Value MUST be null.  Note this is mainly for purpose of
//                being able use union types to define nullability.  If this type
//                is not included in a union, null values are not allowed (the
//                primitives listed above do not allow nulls on their own).
                else if (type === 'null' && !options.union) {
                    return path + ' type is not included in a union, '
                        + 'null values are not allowed';
                }
//            any  Value MAY be of any type including null.
//            If the property is not defined or is not in this list, then any
//            type of value is acceptable.  Other type values MAY be used for
//            custom purposes, but minimal validators of the specification
//            implementation can allow any instance value on unknown type
//            values.
            }
//        Union Types  An array of two or more simple type definitions.  Each
//            item in the array MUST be a simple type definition or a schema.
//            The instance value is valid if it is of the same type as one of
//            the simple type definitions, or valid by one of the schemas, in
//            the array.
            else if (to_string.call(type) === '[object Array]') {
                result = type.some(function (type) {
                    return validate(type, value, { union: true, path: path });
                });
                if (!result) {
                    return path + ' value is not valid';
                }
            }
        }

//5.2.  properties
//    This attribute is an object with property definitions that define the
//    valid values of instance object property values. When the instance
//    value is an object, the property values of the instance object MUST
//    conform to the property definitions in this object.  In this object,
//    each property definition's value MUST be a schema, and the property's
//    name MUST be the name of the instance property that it defines.  The
//    instance property value MUST be valid according to the schema from
//    the property definition.  Properties are considered unordered, the
//    order of the instance properties MAY be in any order.
        if (properties !== undefined && value !== undefined
                && to_string.call(value) === '[object Object]') {
            result = Object.keys(properties).some(function (property) {
                return validate(properties[property], value[property], {
                    path: path + '/' + property});
            });
            if (!result) {
                return path + ' is not valid';
            }
        }

//5.3.  patternProperties
//    This attribute is an object that defines the schema for a set of
//    property names of an object instance.  The name of each property of
//    this attribute's object is a regular expression pattern in the ECMA
//    262/Perl 5 format, while the value is a schema.  If the pattern
//    matches the name of a property on the instance object, the value of
//    the instance's property MUST be valid against the pattern name's
//    schema value.
        if (patternProps !== undefined && value !== undefined
                && to_string.call(value) === '[object Object]') {
            result = Object.keys(patternProps).some(function (pattern) {
                Object.keys(value).some(function (key) {
                    return key.match(pattern)
                        && !validate(patternProps[pattern], value[key],
                            {path: path + '/' + key});
                });
            });
            if (result) {
                return path + ' is not valid';
            }
        }

//5.4.  additionalProperties
//    This attribute defines a schema for all properties that are not
//    explicitly defined in an object type definition.  If specified, the
//    value MUST be a schema or a boolean.  If false is provided, no
//    additional properties are allowed beyond the properties defined in
//    the schema.  The default value is an empty schema which allows any
//    value for additional properties.
        if (additionalProperties !== undefined && value !== undefined
                && to_string.call(value) === '[object Object]') {
            
            if (additionalProperties === false) {
                if (Object.keys(value).some(function (key) {
                        return !(key in properties);
                    })
                ) {
                    return 'no additional properties are allowed ' 
                        + 'beyond the properties defined in the schema';
                }
            }
            if (to_string.call(additionalProperties) === '[object Object]') {
                if (Object.keys(value).some(function (key) {
                        return !(key in properties)
                            && validate(additionalProperties, value[key], 
                                {path: path + '/' + key});
                    })
                ) {
                    return path + ' is not valid';
                }    
            }
        }

//5.5.  items
//    This attribute defines the allowed items in an instance array, and
//    MUST be a schema or an array of schemas.  The default value is an
//    empty schema which allows any value for items in the instance array.
        if (items !== undefined && value !== undefined
            && to_string.call(value) === '[object Array]') {

//    When this attribute value is a schema and the instance value is an
//    array, then all the items in the array MUST be valid according to the
//    schema.
            if (to_string.call(items) === '[object Object]') {
                if (value.some(function (item, i) {
                    return !validate(items, item, {path: path + '/' + i});
                })) {
                    return 'all the items in the array ' + path 
                        + ' MUST be valid accordind to the schema ' + item; 
                }
            }

//    When this attribute value is an array of schemas and the instance
//    value is an array, each position in the instance array MUST conform
//    to the schema in the corresponding position for this array.  This
//    called tuple typing.  When tuple typing is used, additional items are
//    allowed, disallowed, or constrained by the "additionalItems"
//    (Section 5.6) attribute using the same rules as
//    "additionalProperties" (Section 5.4) for objects.

//5.6.  additionalItems
//    This provides a definition for additional items in an array instance
//    when tuple definitions of the items is provided.  This can be false
//    to indicate additional items in the array are not allowed, or it can
//    be a schema that defines the schema of the additional items.
            if (to_string.call(items) === '[object Array]') {

                if ((additionalItems === undefined 
                    || additionalItems === false)
                    && value.some(function (item, i) {
                        return !validate(items[i], value, 
                            {path: path + '/' + i});
                    })
                ) {
                    return 'each position in the instance array ' + path 
                        + ' MUST conform to the schema in the corresponding' 
                        + ' podition for array of schemas ' + items;
                }

                if (additionalItems !== undefined
                    && to_string.call(additionalItems) === '[object Object]'
                    && value.some(function (value, i) {
                        return (!validate(items[i], value, 
                                {path: path + '/' + i}))
                            || (!validate(additionalItems, value,
                                {path: path + '/' + i}));
                    })
                ) {
                    return 'each position in the instance array ' + path 
                        + ' MUST conform to the schema in the corresponding' 
                        + ' podition for array of schemas ' + items;
                }
            }
        }

// 5.7.  required
//    This attribute indicates if the instance must have a value, and not
//    be undefined.  This is false by default, making the instance
//    optional.
        if (required !== undefined && value === undefined) {
            return path + ' is required and MUST have a value';
        }

// 5.8.  dependencies
//    This attribute is an object that defines the requirements of a
//    property on an instance object.  If an object instance has a property
//    with the same name as a property in this attribute's object, then the
//    instance must be valid against the attribute's property value
//    (hereafter referred to as the "dependency value").
        if (dependencies !== undefined && value !== undefined
            && to_string.call(value) === '[object Object]'
            && Object.keys(dependencies).some(function (key) {

//    The dependency value can take one of two forms:
                var dependency = dependencies[key];

//    Simple Dependency  If the dependency value is a string, then the
//        instance object MUST have a property with the same name as the
//        dependency value.  If the dependency value is an array of strings,
//        then the instance object MUST have a property with the same name
//        as each string in the dependency value's array.
                if (to_string.call(dependency) === '[object String]') {
                    if (!(dependency in value)) {
                        return path + ' MUST have a property ' + dependency;
                    }
                }
                if (to_string.call(dependency) === '[object Array]') {
                    if (!dependency.some(function (dependency) {
                        return !(dependency in value);
                    })) {
                        return path + ' MUST have a property with the'
                            + ' same name as each string in ' + dependency;
                    }
                }

//    Schema Dependency  If the dependency value is a schema, then the
//        instance object MUST be valid against the schema.
                if (to_string.call(dependency) === '[object Object]') {
                    return !validate(dependency, value[key]);
                }
            })
        ) {
            return path + ' MUST be valid according to depenencies ' 
                + dependencies;
        }

//5.9.  minimum
//    This attribute defines the minimum value of the instance property
//    when the type of the instance value is a number.
        if (minimum !== undefined
                && to_string.call(value) === '[object Number]'
                && value <= minimum) {
            return path + ' MUST be greater or equal than ' + minimum;
        }

// 5.10.  maximum
//    This attribute defines the maximum value of the instance property
//    when the type of the instance value is a number.
        if (maximum !== undefined
                && to_string.call(value) === '[object Number]'
                && value >= maximum) {
            return path + ' MUST be less or equal than ' + minimum;
        }

//5.11.  exclusiveMinimum
//    This attribute indicates if the value of the instance (if the
//    instance is a number) can not equal the number defined by the
//    "minimum" attribute.  This is false by default, meaning the instance
//    value can be greater then or equal to the minimum value.
        if (exclusiveMinimum !== undefined
                && to_string.call(value) === '[object Number]'
                && value < exclusiveMinimum) {
            return path + ' MUST be greater than ' + exclusiveMinimum;
        }

// 5.12.  exclusiveMaximum
//    This attribute indicates if the value of the instance (if the
//    instance is a number) can not equal the number defined by the
//    "maximum" attribute.  This is false by default, meaning the instance
//    value can be less then or equal to the maximum value.
        if (exclusiveMaximum !== undefined
                && to_string.call(value) === '[object Number]'
                && value > exclusiveMaximum) {
            return path + ' MUST be less than ' + exclusiveMaximum;
        }

// 5.13.  minItems
//    This attribute defines the minimum number of values in an array when
//    the array is the instance value.
        if (minItems !== undefined
                && to_string.call(value) === '[object Array]'
                && value.length < minItems) {
            return path + ' MUST have more than ' + minItems + ' items';
        }

// 5.14.  maxItems
//    This attribute defines the maximum number of values in an array when
//    the array is the instance value.
        if (maxItems !== undefined
                && to_string.call(value) === '[object Array]'
                && value.length > maxItems) {
            return path + ' MUST have less than ' + maxItems + ' items';
        }

// 5.15.  uniqueItems
//    This attribute indicates that all items in an array instance MUST be
//    unique (contains no two identical values).

//    Two instance are consider equal if they are both of the same type
//    and:

//       are null; or

//       are booleans/numbers/strings and have the same value; or

//       are arrays, contains the same number of items, and each item in
//       the array is equal to the corresponding item in the other array;
//       or

//       are objects, contains the same property names, and each property
//       in the object is equal to the corresponding property in the other
//       object.
        if (uniqueItems !== undefined && uniqueItems === true
                && to_string.call(value) === '[object Array]') {
            
            result = value.some(function (x, i) {
                return value.slice(i+1).some(function (y, j) {
                    return x === j;
                });
            });
            
            if (result) {
                return path + ' is not valid';
            }
        }

// 5.16.  pattern
//    When the instance value is a string, this provides a regular
//    expression that a string instance MUST match in order to be valid.
//    Regular expressions SHOULD follow the regular expression
//    specification from ECMA 262/Perl 5
        if (pattern !== undefined 
                && to_string.call(value) === '[object String]'
                && !value.match(pattern)) {
            return path + ' MUST match the regular expression ' + pattern;
        }

// 5.17.  minLength
//    When the instance value is a string, this defines the minimum length
//    of the string.
        if (minLength !== undefined 
                && to_string.call(value) === '[object String]'
                && value.length < minLength) {
            return path + ' length MUST be greater than ' + minLength;
        }

// 5.18.  maxLength
//    When the instance value is a string, this defines the maximum length
//    of the string.
        if (maxLength !== undefined 
                && to_string.call(value) === '[object String]'
                && value.length > maxLength) {
            return path + ' length MUST be less than ' + maxLength;
        }

// 5.19.  enum
//    This provides an enumeration of all possible values that are valid
//    for the instance property.  This MUST be an array, and each item in
//    the array represents a possible value for the instance value.  If
//    this attribute is defined, the instance value MUST be one of the
//    values in the array in order for the schema to be valid.  Comparison
//    of enum values uses the same algorithm as defined in "uniqueItems"
//    (Section 5.15).
        if (enums !== undefined && value !== undefined) {
            result = enums.some(function (item) { return value === item; });
            if (!result) {
                return path + ' MUST be one of the value in ' + enums;
            }
        }

//5.20.  default
//    This attribute defines the default value of the instance when the
//    instance is undefined.
        if (defaults !== undefined && value === undefined) {
            // I know! It will not work...
            value = defaults;
        }

// 5.21.  title
//    This attribute is a string that provides a short description of the
//    instance property.

// 5.22.  description
//    This attribute is a string that provides a full description of the of
//    purpose the instance property.

// 5.24.  divisibleBy
//    This attribute defines what value the number instance must be
//    divisible by with no remainder (the result of the division must be an
//    integer.)  The value of this attribute SHOULD NOT be 0.
        if (divisibleBy !== undefined
                && to_string.call(value) === '[object String]'
                && value % divisibleBy !== 0) {
            return path + ' MUST be divisible by ' + divisibleBy;
        }

// 5.25.  disallow
//    This attribute takes the same values as the "type" attribute, however
//    if the instance matches the type or if this value is an array and the
//    instance matches any type or schema in the array, then this instance
//    is not valid.
        if (disallow !== undefined && value !== undefined) {
            if (to_string.call(type) === '[object String]') {
                if (type === 'string'
                        && to_string.call(value) === '[object String]') {
                    return path + ' value MUST NOT be a string';
                }
                else if (type === 'number' 
                        && to_string.call(value) === '[object Number]') {
                    return path + ' value MUST NOT be a number';
                }
                else if (type === 'integer'
                        && to_string.call(value) === '[object Number]'
                        && value % 1 === 0) {
                    return path + ' value MUST NOT be an integer';
                }
                else if (type === 'boolean'
                        && to_string.call(value) === '[object Boolean]') {
                    return path + ' value MUST NOT be a boolean';
                }
                else if (type === 'object'
                        && to_string.call(value) === '[object Object]') {
                    return path + ' value MUST NOT be an object';
                }
                else if (type === 'array'
                        && to_string.call(value) === '[object Array]') {
                    return path + ' value MUST NOT be an array';
                }
                else if (type === 'null' && !options.union) {
                    return path + ' type is not included in a union, '
                        + 'null values are not allowed';
                }
            }
            else if (to_string.call(type) === '[object Array]') {
                result = type.some(function (type) {
                    return validate(type, value, { union: true, path: path });
                });
                if (result) {
                    return path + ' value is not valid';
                }
            }
        }

        return true;
    }

    return {
        validate: validate
    };

}(this));