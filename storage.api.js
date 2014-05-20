!(function($) {

	// "use strict";
    
	var storage = new function() {

        var _storage = window.localStorage;
        
        var _is = new function() {
            var _to_string = function(obj) { return Object.prototype.toString.call(obj); };
            this.b = this.bool  = function(b) { return _to_string(b) === '[object Boolean]'; };
            this.n = this.num   = function(n) { return _to_string(n) === '[object Number]'; };
            this.s = this.str   = function(s) { return _to_string(s) === '[object String]'; };
            this.a = this.arr   = function(a) { return _to_string(a) === '[object Array]'; };
            this.o = this.obj   = function(o) { return _to_string(o) === '[object Object]'; };
            this.d = this.date  = function(d) { return _to_string(d) === '[object Date]'; };
            this.r = this.reg   = function(r) { return _to_string(r) === '[object RegExp]'; };
            this.e = this.err   = function(e) { return _to_string(e) === '[object Error]'; };
            this.u = this.undef = function(u) { return _to_string(u) === '[object Undefined]'; };
            this.f = this.func  = function(f) { return _to_string(f) === '[object Function]'; };
            this.set = function(data, key) { try { return key in data; } catch(e) { return false; } };
            this.empty = function(data, key) { return this.set(data, key) ? !data[key] : true; };
        };

        var _json = new function() {
            this.decode = function(data) {
                if (_is.s(data)) return data;
                try { return JSON.stringify(data); } catch(e) { return data; }
            };
            this.encode = function(data) {
                if (!data) return data;
                try { return JSON.parse(data); } catch(e) { return data; }
            };
        };

        var _get = function() {
            var keys = Array.prototype.slice.call(arguments).join('.').split('.'),
                key = keys.shift(),
                result = _json.encode(_is.set(_storage, key) ? _storage[key] : '');
            return (function(obj, keys) {
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    if (!obj || !_is.set(obj, key)) { obj = undefined; break; }
                    obj = obj[key];
                }
                return obj;
            })(result, keys);
        };

        var _get_arr = function() {
            var result = _get.apply(this, arguments);
            return _is.arr(result) ? result : [];
        };

        var _get_obj = function() {
            var result = _get.apply(this, arguments);
            return _is.obj(result) ? result : {};
        };
        
        var _set = function() {
            var args = Array.prototype.slice.call(arguments);
            if (!args.length) throw new Error('Arguments are empty');

            var value = _json.decode(args.pop()), keys, key, result;
            if (args.length) {
                keys = args.join('.').split('.');
            } else {
                keys = value.split('.');
                value = '';
            }
            key = keys.shift();
            if (keys.length) {
                result = _get_obj(key);
                (function(obj, keys, value) {
                    var keys_length = keys.length - 1,
                        keys_last = keys[keys_length];
                    for (var i = 0; i < keys_length; i++) {
                        var key = keys[i];
                        if (!_is.set(obj, key)) obj[key] = {};
                        if (_is.str(obj[key])) obj[key] = {};
                        obj = obj[key];
                    }
                    obj[keys_last] = value;
                    return value;
                })(result, keys, value);
                value = _json.decode(result);
            }
            if (_is.undef(value)) value = '';
            _storage[key] = value;
            return value;
        };

		this.get = _get;
        this.get_arr = this.getArr = _get_arr;
        this.get_obj = this.getObj = _get_obj;

        this.set = _set;
	};

	$.storage = storage;

})(window);
