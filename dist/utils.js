"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathUtils = void 0;
var MathUtils = /** @class */ (function () {
    function MathUtils() {
        this.routes = {};
        // Initialize empty routes for each method
        this.routes = {
            'GET': {},
            'POST': {},
            'PUT': {},
            'DELETE': {},
            'PATCH': {}
        };
        // Register default operations
        this.registerOperations();
    }
    MathUtils.prototype.registerOperations = function () {
        // Register sum operations
        this.get('/sum', this.sum.bind(this));
        this.post('/sum', this.sum.bind(this));
        this.put('/sum', this.sum.bind(this));
        this.delete('/sum', this.sum.bind(this));
        this.patch('/sum', this.sum.bind(this));
        // Register subtraction operations
        this.get('/sub', this.sub.bind(this));
        this.post('/sub', this.sub.bind(this));
        this.put('/sub', this.sub.bind(this));
        this.delete('/sub', this.sub.bind(this));
        this.patch('/sub', this.sub.bind(this));
        // Register multiplication operations
        this.get('/mul', this.mul.bind(this));
        this.post('/mul', this.mul.bind(this));
        this.put('/mul', this.mul.bind(this));
        this.delete('/mul', this.mul.bind(this));
        this.patch('/mul', this.mul.bind(this));
        // Register division operations
        this.get('/div', this.div.bind(this));
        this.post('/div', this.div.bind(this));
        this.put('/div', this.div.bind(this));
        this.delete('/div', this.div.bind(this));
        this.patch('/div', this.div.bind(this));
        // Register modulo operations
        this.get('/mod', this.mod.bind(this));
        this.post('/mod', this.mod.bind(this));
        this.put('/mod', this.mod.bind(this));
        this.delete('/mod', this.mod.bind(this));
        this.patch('/mod', this.mod.bind(this));
    };
    MathUtils.prototype.sum = function () {
        var numbers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            numbers[_i] = arguments[_i];
        }
        if (numbers.length === 0)
            return 0;
        return numbers.reduce(function (acc, num) { return acc + num; }, 0);
    };
    MathUtils.prototype.sub = function (first) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        if (rest.length === 0)
            return first;
        return rest.reduce(function (acc, num) { return acc - num; }, first);
    };
    MathUtils.prototype.mul = function (number) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        if (rest.length === 0)
            return number;
        return rest.reduce(function (acc, num) { return acc * num; }, number);
    };
    MathUtils.prototype.div = function (first) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        if (rest.length === 0)
            return first;
        // Check for division by zero
        if (rest.some(function (num) { return num === 0; })) {
            throw new Error("Division by zero is not allowed");
        }
        return rest.reduce(function (acc, num) { return acc / num; }, first);
    };
    MathUtils.prototype.mod = function (first) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        if (rest.length === 0)
            return first;
        return rest.reduce(function (acc, num) { return acc % num; }, first);
    };
    MathUtils.prototype.addRoute = function (method, path, handler) {
        this.routes[method][path] = handler;
    };
    MathUtils.prototype.get = function (path) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (args.length === 1 && typeof args[0] === 'function') {
            this.addRoute('GET', path, args[0]);
            return;
        }
        return (_a = this.routes['GET'])[path].apply(_a, args);
    };
    MathUtils.prototype.post = function (path) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (args.length === 1 && typeof args[0] === 'function') {
            this.addRoute('POST', path, args[0]);
            return;
        }
        return (_a = this.routes['POST'])[path].apply(_a, args);
    };
    MathUtils.prototype.put = function (path) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (args.length === 1 && typeof args[0] === 'function') {
            this.addRoute('PUT', path, args[0]);
            return;
        }
        return (_a = this.routes['PUT'])[path].apply(_a, args);
    };
    MathUtils.prototype.delete = function (path) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (args.length === 1 && typeof args[0] === 'function') {
            this.addRoute('DELETE', path, args[0]);
            return;
        }
        return (_a = this.routes['DELETE'])[path].apply(_a, args);
    };
    MathUtils.prototype.patch = function (path) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (args.length === 1 && typeof args[0] === 'function') {
            this.addRoute('PATCH', path, args[0]);
            return;
        }
        return (_a = this.routes['PATCH'])[path].apply(_a, args);
    };
    return MathUtils;
}());
exports.MathUtils = MathUtils;
// Create a singleton instance
var mathUtils = new MathUtils();
// Export both the class and singleton instance
exports.default = mathUtils;
