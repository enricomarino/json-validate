schema = (function (context, undefined) {
    
    var to_string = {}.toString;

    function validate (json, schema) {

        var type = schema.type;

        if (type === 'string') {
            if (to_string.call(json) !== '[object String']) {
                return false;
            }
            if (schema.maxLength && json.length > schema.maxLength) {
                return false;
            }
            if (schema.minLength && json.length < schema.minLength) {
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

        if (type === 'number') {
            if (to_string.call(json) !== '[object Number]') {
                return false;
            }
            if (schema.minimum && json < schema.minimum) {
                return false;
            }
            if (schema.maximum && json > schema.maximum) {
                return false;
            }
            if (schema.maxDecimal && json.toString().match(new RegExp("\\.[0-9]{" + (schema.maxDecimal + 1) + ",}"))) {
                return false;
            }
            if (schema.enum) {
                return schema.enum.some(function (value) {
                    return json === value;
                });
            }
            return true;
        }

        if (type === 'integer') {
            if (to_string.call(json) !== '[object Number]' && json % 1 !== 0) {
                return false;
            }
            if (schema.minimum && json < schema.minimum) {
                return false;
            }
            if (schema.maximum && json > schema.maximum) {
                return false;
            }
            if (schema.enum) {
                return schema.enum.some(function (value) {
                    return json === value;
                });
            }
            return true;
        }

        if (type === 'array') {
            if (to_string.call(json) !== '[object Array]') {
                return false;
            }
            if (schema.minItems && json.length < schema.minItems) {
                return false;
            }
            if (schema.maxItems && value.length > schema.maxItems){
                return false;
            }
            if (schema.items) {
                return !json.some(function (value) {
                    return !validate(value, schema.items);
                });
            }
            return true;
        }

        if (type === 'object') {
            if (to_string.call(json) !== '[object Object]') {
                return false;
            }
            // TODO
            return true;
        }

        if (type === 'boolean') {
            if (to_string.call(json) !== '[object Boolean]') {
                return false;
            }
            return true;
        }

        if (type === 'date') {
            if (to_string.call(json) !== '[object Date]') {
                return false;
            }
            return true;
        }

        if (type === 'null') {
            if (to_string.call(json) !== '[object Null]') {
                return false;
            }
            return true;
        }

        if (type === 'any') {
            if (to_string.call(json) === '[object Undefined]') {
                return false;
            }
            return true;
        }

        return true;
    }

    return {
        validate: validate
    };

}(this));