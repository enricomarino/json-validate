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
        
        var type = schema.type,
            length_max = schema.maxLength,
            length_min = schema.minLength,
            pattern = schema.pattern,
            enums = schema.enum,
            length = json.length,
            equals = function (value) { return json === values}
        
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
        console.log('number', schema, json);

        var decimal = schema.maxDecimal,
            json_string = json.toString();

        if (to_string.call(json) !== '[object Number]') {
            return false;
        }
        if (to_string.call(schema.type) === '[object String]' 
            && schema.type !== 'number' && schema.type !== 'any') {
            return false;        
        }
        if (to_string.call(schema.type) === '[object Array]' 
            && schema.type.indexOf('number') === -1) {
            return false;
        }
        if (schema.minimum !== undefined && json < schema.minimum) {
            return false;
        }
        if (schema.maximum !== undefined && json > schema.maximum) {
            return false;
        }
        if (schema.maxDecimal !== undefined 
            && json_string.match(new RegExp('\\.[0-9]{' + (decimal + 1) + ',}'))) {
            return false;
        }
        if (schema.enum !== undefined) {
            return schema.enum.some(function (value) {
                return json === value;
            });
        }
        return true;
    }

    function integer (schema, json) {
        console.log('integer', schema, json);

        if (to_string.call(json) !== '[object Number]') {
            return false;
        }
        if (json % 1 !== 0) {
            return false;
        }
        if (to_string.call(schema.type) === '[object String]' 
            && schema.type !== 'integer'
            && schema.type !== 'any') {
            return false;
        }
        if (to_string.call(schema.type) === '[object Array]' 
            && schema.type.indexOf('integer') === -1) {
            return false;
        }
        if (schema.minimum !== undefined 
            && json < schema.minimum) {
            return false;
        }
        if (schema.maximum !== undefined 
            && json > schema.maximum) {
            return false;
        }
        if (schema.enum !== undefined) {
            return schema.enum.some(function (value) {
                return json === value;
            });
        }
        return true;
    }

    function array (schema, json) {
        console.log('array', schema, json);

        if (to_string.call(json) !== '[object Array]') {
            return false;
        }
        if (to_string.call(schema.type) === '[object String]'
            && schema.typeschema.type !== 'array'
            && schema.type !== 'any') {
            return false;
        }
        if (to_string.call(schema.type) === '[object Array]' 
            && schema.type.indexOf('array') === -1) {
            return false;
        }
        if (schema.minItems !== undefined 
            && json.length < schema.minItems) {
            return false;
        }
        if (schema.maxItems !== undefined
            && value.length > schema.maxItems){
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
        console.log('bool', schema, json);

        if (to_string.call(json) !== '[object Boolean]') {
            return false;
        }
        if (to_string.call(schema.type) === '[object Array]' 
            && schema.type !== 'boolean'
            && scehma.type !== 'any') {
                
        }
        if (to_string.call(schema.type) === '[object Array]' 
            && schema.type.indexOf('boolean') === -1) {
            return false;
        }
        return true;
    }

    function date (schema, json) {
        console.log('date', schema, json);
        
        if (to_string.call(json) !== '[object Date]') {
            return false;
        }
        if (to_string.call(schema.type) === '[object String]' 
            && schema.type !== 'date'
            && schema.type !== 'any') {
            return false;
        }
        if (to_string.call(schema.type) === '[object Array]' 
            && schema.type.indexOf('date') === -1) {
            return false;
        }
        return true;
    }

    function nil (schema, json) {
        console.log('nil', schema, json);
       
        if (to_string.call(json) !== '[object Null]') {
            return false;
        }
        if (to_string.call(schema.type) === '[object String]' 
            && schema.type !== 'null'
            && schema.type !== 'any') {
            return false;
        }
        if (to_string.call(schema.type) === '[object Array]' 
            && schema.type.indexOf('null') === -1) {
            return false;
        }
        return true;
    }

    function undef (schema, json) {
        console.log('undef', schema, json);
        
        if (to_string.call(json) !== '[object Undefined]') {
            return false;
        }
        if (schema.type !== 'any') {
            return false;
        }
        return true;
    }

    function object (schema, json) {
        console.log('object', schema, json);

        var properties = schema.properties;

        if (to_string.call(json) !== '[object Object]') {
            return false;
        }
        if (to_string.call(schema.type) === '[object String]' 
            && schema.type !== 'object'
            && schema.type !== 'any') {
            return false; 
        }
        if (to_string.call(schema.type) === '[object Array]' 
            && schema.type.indexOf('object') === -1) {
            return false;
        }        
        if (Object.keys(properties)
                .filter(function (property) {
                    return properties[property].required;
                })
                .some(function (property) {
                    return !json.hasOwnProperty(property);
                })
                .length) {
            return false
        }
        if (Object.keys(properties)
                .some(function (property) {
                    return !validate(schema[property], json[property]);
                })) {
            return false;            
        }

        return true;
    }

    function validate (schema, json) {
        console.log('validate', schema, json);

        if (to_string.call(json) === '[object String]') {
            return string(schema, json);
        }
        if (to_string.call(json) === '[object Number]') {
            return number(schema, json);
        }
        if (to_string.call(json) === '[object Number]' && json % 1 === 0) {
            return integer(schema, json);
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