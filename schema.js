// json-schema.js
// JavaScript fast json schema validation library
//
// Copyright 2011 Enrico Marino
// MIT license

!function (name, definition) {
    if (typeof module != 'undefined') module.exports = definition
    else if (typeof define == 'function' && define.amd) define(name, definition)
    else this[name] = definition
}('schema', function (context, undefined) {

    var to_string = {}.toString,
        owns = {}.hasOwnProperty,
        extend = function (d, s) { for (var p in s) (owns.call(s, p) && (d[p] = s[p])); };

    function string (schema, json) {
        
        if (to_string.call(json) !== '[object String]') {
            return false;
        }

        var type = schema.type,
            length_max = schema.maxLength,
            length_min = schema.minLength,
            pattern = schema.pattern,
            enums = schema.enum,
            length = json.length,
            equals = function (value) { return json === values; };
        
        if (to_string.call(type) === '[object String]' 
            && type !== 'string' && type !== 'any') {
            return false;
        }
        if (to_string.call(type) === '[object Array]' 
            && type.indexOf('string') === -1) {
            return false;
        }
        if (length_max !== undefined && length > length_max) {
            return false;
        }
        if (length_min !== undefined && length < length_min) {
            return false;
        } 
        if (pattern !== undefined && !json.match(pattern)) {
            return false;
        }
        if (enums !== undefined && !enums.some(equals)) {
            return false;
        }
        return true;
    }

    function number (schema, json) {
        
        if (to_string.call(json) !== '[object Number]') {
            return false;
        }
        
        var type = schema.type,
            minimum = schama.minimum,
            maximum = schema.maximum,
            decimal = schema.maxDecimal,
            enums = schema.enums,
            equals = function (value) { return json === values; },
            regex;

        if (to_string.call(type) === '[object String]' 
            && type !== 'number' && type !== 'integer' && type !== 'any') {
            return false;        
        }
        if (type === 'integer' && json % 1 !== 0) {
            return false;
        }
        if (to_string.call(type) === '[object Array]' 
            && type.indexOf('number') === -1) {
            return false;
        }
        if (minimum !== undefined && json < minimum) {
            return false;
        }
        if (maximum !== undefined && json > maximum) {
            return false;
        }
        if (decimal !== undefined
            && (regex = new RegExp('\\.[0-9]{' + (decimal + 1) + ',}'))
            && (json.toString().match(regex))) {
            return false;
        }
        if (enums !== undefined && !enums.some(equals)) {
            return false;    
        }
        return true;
    }

    function array (schema, json) {

        if (to_string.call(json) !== '[object Array]') {
            return false;
        }

        var type = schema.type,
            lenght_min = schema.minItems,
            lenght_max = schema.maxItems,
            items = schema.items,
            length = json.length;

        if (to_string.call(type) === '[object String]'
            && type !== 'array' && type !== 'any') {
            return false;
        }
        if (to_string.call(type) === '[object Array]' 
            && type.indexOf('array') === -1) {
            return false;
        }
        if (length_min !== undefined && length < length_min) {
            return false;
        }
        if (lenght_max !== undefined && length > schema.maxItems){
            return false;
        }
        if (schema.items !== undefined) {
            return !json.some(function (value) {
                return !validate(value, schema.items);
            });
        }
        return true;
    }

    function bool (schema, json) {

        if (to_string.call(json) !== '[object Boolean]') {
            return false;
        }
        
        var type = schema.type;

        if (to_string.call(type) === '[object Array]' 
            && type !== 'boolean' && type !== 'any') {
            return false;
        }
        if (to_string.call(type) === '[object Array]' 
            && type.indexOf('boolean') === -1) {
            return false;
        }
        return true;
    }

    function date (schema, json) {
        
        if (to_string.call(json) !== '[object Date]') {
            return false;
        }
        
        var type = schema.type;

        if (to_string.call(type) === '[object String]' 
            && type !== 'date' && type !== 'any') {
            return false;
        }
        if (to_string.call(type) === '[object Array]' 
            && type.indexOf('date') === -1) {
            return false;
        }
        return true;
    }

    function nil (schema, json) {
        
        if (to_string.call(json) !== '[object Null]') {
            return false;
        }
        
        var type = schema.type;

        if (to_string.call(type) === '[object String]' 
            && type !== 'null' && type !== 'any') {
            return false;
        }
        if (to_string.call(type) === '[object Array]' 
            && type.indexOf('null') === -1) {
            return false;
        }
        return true;
    }

    function undef (schema, json) {
        
        if (to_string.call(json) !== '[object Undefined]') {
            return false;
        }
        
        var type = schema.type;

        if (type !== 'any') {
            return false;
        }
        return true;
    }

    function object (schema, json) {

        if (to_string.call(json) !== '[object Object]') {
            return false;
        }
        
        var type = schema.type,
            properties = schema.properties,
            keys = Object.keys;

        if (to_string.call(type) === '[object String]' 
            && type !== 'object' && type !== 'any') {
            return false; 
        }
        if (to_string.call(type) === '[object Array]' 
            && type.indexOf('object') === -1) {
            return false;
        }        
        if (keys(properties)
                .filter(function (property) {
                    return properties[property].required;
                })
                .some(function (property) {
                    return !json.hasOwnProperty(property);
                })) {
            return false
        }
        if (keys(properties)
                .some(function (property) {
                    return !validate(schema[property], json[property]);
                })) {
            return false;            
        }

        return true;
    }

    function validate (schema, json) {

        if (to_string.call(json) === '[object String]') {
            return string(schema, json);
        }
        if (to_string.call(json) === '[object Number]') {
            return number(schema, json);
        }
        if (to_string.call(json) === '[object Array]') {
            return array(schema, json);
        }
        if (to_string.call(json) === '[object Boolean]') {
            return bool(schema, json);
        }
        if (to_string.call(json) === '[object Date]') {
            return date(schema, json);
        }
        if (to_string.call(json) === '[object Null]') {
            return nil(schema, json);
        }
        if (to_string.call(json) === '[object Undefined]') {
            return undef(schema, json);
        }
        if (to_string.call(json) === '[object Object]') {
            return object(schema, json);
        }

        return true;
    }

    extend(validate, {
        string: string,
        number: number,
        integer: integer,
        array: array,
        bool: bool,
        date: date,
        nil: nil,
        undef: undef,
        object: object
    });

    return {
        validate: validate
    };

}(this));