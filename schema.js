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

    var to_string = {}.toString;

    function string (schema, json) {
        
        if (to_string.call(json) !== '[object String]') {
            return false;
        }
        if (schema.type !== 'string'
            && schema.type !== 'any'
            && to_string.call(schema.type) === '[object Array]' 
            && schema.type.indexOf('string') === -1) {
            return false;
        }
        if (typeof schema.maxLength !== 'undefined'
            && json.length > schema.maxLength) {
            return false;
        }
        if (typeof schema.minLength !== 'undefined' 
            && json.length < schema.minLength) {
            return false;
        } 
        if (schema.pattern && !json.match(schema.pattern)) {
            return false;
        }
        if (schema.enum) {
            return schema.enum.some(function (value) {
                return json === value;
            });
        }
        return true;
    }

    function number (schema, json) {

        if (to_string.call(json) !== '[object Number]') {
            return false;
        }
        if (schema.type !== 'number'
            && schema.type !== 'any'
            && to_string.call(schema.type) === '[object Array]' 
            && schema.type.indexOf('number') === -1) {
            return false;
        }
        if (typeof schema.minimum !== 'undefined'
            && json < schema.minimum) {
            return false;
        }
        if (typeof schema.maximum !== 'undefined' 
            && json > schema.maximum) {
            return false;
        }
        if (typeof schema.maxDecimal !== 'undefined' 
            && json.toString().match(new RegExp("\\.[0-9]{" + (schema.maxDecimal + 1) + ",}"))) {
            return false;
        }
        if (typeof schema.enum !== 'undefined') {
            return schema.enum.some(function (value) {
                return json === value;
            });
        }
        return true;
    }

    function integer (schema, json) {

        if (to_string.call(json) !== '[object Number]') {
            return false;
        }
        if (json % 1 !== 0) {
            return false;
        }
        if (schema.type !== 'integer'
            && schema.type !== 'any'
            && to_string.call(schema.type) === '[object Array]' 
            && schema.type.indexOf('integer') === -1) {
            return false;
        }
        if (typeof schema.minimum !== 'undefined' 
            && json < schema.minimum) {
            return false;
        }
        if (typeof schema.maximum !== 'undefined' 
            && json > schema.maximum) {
            return false;
        }
        if (schema.enum) {
            return schema.enum.some(function (value) {
                return json === value;
            });
        }
        return true;
    }

    function array (schema, json) {

        if (to_string.call(json) !== '[object Array]') {
            return false;
        }
        if (schema.type !== 'array'
            && schema.type !== 'any'
            && to_string.call(schema.type) === '[object Array]' 
            && schema.type.indexOf('array') === -1) {
            return false;
        }
        if (typeof schema.minItems !== 'undefined' 
            && json.length < schema.minItems) {
            return false;
        }
        if (typeof schema.maxItems !== 'undefined'
            && value.length > schema.maxItems){
            return false;
        }
        if (schema.items) {
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
        if (schema.type !== 'boolean'
            && scehma.type !== 'any'
            && to_string.call(schema.type) === '[object Array]' 
            && schema.type.indexOf('boolean') === -1) {
            return false;
        }
        return true;
    }

    function date (schema, json) {
        
        if (to_string.call(json) !== '[object Date]') {
            return false;
        }
        if (schema.type !== 'date'
            && schema.type !== 'any'
            && to_string.call(schema.type) === '[object Array]' 
            && schema.type.indexOf('date') === -1) {
            return false;
        }
        return true;
    }

    function nil (schema, json) {
        
        if (to_string.call(json) !== '[object Null]') {
            return false;
        }
        if (schema.type !== 'null'
            && schema.type !== 'any'
            && to_string.call(schema.type) === '[object Array]' 
            && schema.type.indexOf('null') === -1) {
            return false;
        }
        return true;
    }

    function undef (schema, json) {
        
        if (to_string.call(json) !== '[object Undefined]') {
            return false;
        }
        if (schema.type !== 'any') {
            return false;
        }
        return true;
    }

    function object (schema, json) {
        
        var properties = schema.properties;

        if (to_string.call(json) !== '[object Object]') {
            return false;
        }
        if (schema.type !== 'object'
            && schema.type !== 'any'
            && to_string.call(schema.type) === '[object Array]' 
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

        var type = schema.type;

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

    return {
        validate: validate,
        string: string,
        number: number,
        integer: integer,
        array: array,
        bool: bool,
        date: date,
        nil: nil,
        undef: undef,
        object: object
    };

}(this));