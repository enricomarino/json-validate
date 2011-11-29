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
            disallow = schema.disallow,
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
        if (to_string.call(disallow) === '[object String]'
            && disallow === 'string') {
            return false        
        }
        if (to_string.call(disallow) === '[object Array]'
            && disallow.indexOf('string') !== -1) {
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
            disallow = schema.disallow,
            minimum = schema.minimum,
            maximum = schema.maximum,
            decimal = schema.maxDecimal,
            exclusive_minimum = schema.exclusiveMinimum,
            exclusive_maximum = schema.exclusiveMaximum,
            enums = schema.enums,
            dividend = schema.divisibleBy,
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
        if (to_string.call(disallow) === '[object String]' 
            && type === 'number') {
            return false; 
        }
        if (to_string.call(disallow) === '[object Array]' 
            && disallow.indexOf('number') !== -1) {
            return false;
        }
        if (minimum !== undefined) {
            return exclusive_minimum ? json < minimum : json <= minimum;
        }
        if (maximum !== undefined) {
            return exclusive_maximum ? json > maximum : json >= maximum;
        }
        if (decimal !== undefined
            && (regex = new RegExp('\\.[0-9]{' + (decimal + 1) + ',}'))
            && (json.toString().match(regex))) {
            return false;
        }
        if (dividend !== undefined && json % dividend !== 0) {
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
            disallow = schema.disallow,
            length_min = schema.minItems,
            length_max = schema.maxItems,
            items = schema.items,
            unique = schema.uniqueItems,
            length = json.length,
            i,
            j;

        if (to_string.call(type) === '[object String]'
            && type !== 'array' && type !== 'any') {
            return false;
        }
        if (to_string.call(type) === '[object Array]' 
            && type.indexOf('array') === -1) {
            return false;
        }
        if (to_string.call(disallow) === '[object String]'
            && disallow === 'array') {
            return false;
        }
        if (to_string.call(disallow) === '[object Array]' 
            && disallow.indexOf('array') !== -1) {
            return false;
        }
        if (length_min !== undefined && length < length_min) {
            return false;
        }
        if (length_max !== undefined && length > length_max){
            return false;
        }
        if (items !== undefined) {
            return !json.some(function (value) {
                return !validate(value, items);
            });
        }
        if (unique !== undefined && unique === true) {
            for (i = 0; i < length; i += 1) {
                for (j = i + 1; j < length; j += 1) {
                    if (i in json) {
                        if (json[i] === json[j]) {
                            return false
                        }
                    }
                }
            }
        }
        return true;
    }

    function bool (schema, json) {

        if (to_string.call(json) !== '[object Boolean]') {
            return false;
        }
        
        var type = schema.type,
            disallow = schema.disallow;

        if (to_string.call(type) === '[object Array]' 
            && type !== 'boolean' && type !== 'any') {
            return false;
        }
        if (to_string.call(type) === '[object Array]' 
            && type.indexOf('boolean') === -1) {
            return false;
        }
        if (to_string.call(disallow) === '[object String]'
            && disallow === 'boolean') {
            return false;
        }
        if (to_string.call(disallow) === '[object Array]' 
            && disallow.indexOf('boolean') !== -1) {
            return false;
        }
        return true;
    }

    function date (schema, json) {
        
        if (to_string.call(json) !== '[object Date]') {
            return false;
        }
        
        var type = schema.type,
            disallow = schema.disallow;

        if (to_string.call(type) === '[object String]' 
            && type !== 'date' && type !== 'any') {
            return false;
        }
        if (to_string.call(type) === '[object Array]' 
            && type.indexOf('date') === -1) {
            return false;
        }
        if (to_string.call(disallow) === '[object String]'
            && disallow === 'date') {
            return false;
        }
        if (to_string.call(disallow) === '[object Array]' 
            && disallow.indexOf('date') !== -1) {
            return false;
        }
        return true;
    }

    function nil (schema, json) {
        
        if (to_string.call(json) !== '[object Null]') {
            return false;
        }
        
        var type = schema.type,
            disallow = schema.disallow;

        if (to_string.call(type) === '[object String]' 
            && type !== 'null' && type !== 'any') {
            return false;
        }
        if (to_string.call(type) === '[object Array]' 
            && type.indexOf('null') === -1) {
            return false;
        }
        if (to_string.call(disallow) === '[object String]'
            && disallow === 'null') {
            return false;
        }
        if (to_string.call(disallow) === '[object Array]' 
            && disallow.indexOf('null') !== -1) {
            return false;
        }
        return true;
    }

    function undef (schema, json) {
        
        if (to_string.call(json) !== '[object Undefined]') {
            return false;
        }
        
        var type = schema.type,
            disallow = schema.disallow;

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
            disallow = schema.disallow,
            properties = schema.properties;

        if (to_string.call(type) === '[object String]' 
            && type !== 'object' && type !== 'any') {
            return false; 
        }
        if (to_string.call(type) === '[object Array]' 
            && type.indexOf('object') === -1) {
            return false;
        }      
        if (to_string.call(disallow) === '[object String]'
            && disallow === 'object') {
            return false;
        }
        if (to_string.call(disallow) === '[object Array]' 
            && disallow.indexOf('object') !== -1) {
            return false;
        }  
        if (properties !== undefined
            && Object.keys(properties)
                .filter(function (property) {
                    return properties[property].required;
                })
                .some(function (property) {
                    return !json.hasOwnProperty(property);
                })) {
            return false
        }
        if (properties !== undefined
            && Object.keys(properties)
                .some(function (property) {
                    return !validate(properties[property], json[property]);
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