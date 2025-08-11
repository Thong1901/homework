"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_http_1 = require("node:http");
var node_url_1 = require("node:url");
// MathUtils class implementation
var MathUtils = /** @class */ (function () {
    function MathUtils() {
        this.routes = {};
        this.routes = {
            'GET': {},
            'POST': {},
            'PUT': {},
            'DELETE': {},
            'PATCH': {}
        };
        this.registerOperations();
    }
    MathUtils.prototype.registerOperations = function () {
        this.get('/sum', this.sum.bind(this));
        this.post('/sum', this.sum.bind(this));
        this.put('/sum', this.sum.bind(this));
        this.delete('/sum', this.sum.bind(this));
        this.patch('/sum', this.sum.bind(this));
        this.get('/sub', this.sub.bind(this));
        this.post('/sub', this.sub.bind(this));
        this.put('/sub', this.sub.bind(this));
        this.delete('/sub', this.sub.bind(this));
        this.patch('/sub', this.sub.bind(this));
        this.get('/mul', this.mul.bind(this));
        this.post('/mul', this.mul.bind(this));
        this.put('/mul', this.mul.bind(this));
        this.delete('/mul', this.mul.bind(this));
        this.patch('/mul', this.mul.bind(this));
        this.get('/div', this.div.bind(this));
        this.post('/div', this.div.bind(this));
        this.put('/div', this.div.bind(this));
        this.delete('/div', this.div.bind(this));
        this.patch('/div', this.div.bind(this));
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
// Create singleton instance of MathUtils
// ExpressPlus class implementation
var ExpressPlus = /** @class */ (function () {
    function ExpressPlus() {
        this.routes = {};
    }
    ExpressPlus.prototype.addRoute = function (method, path, handler) {
        this.routes[method] = this.routes[method] || {};
        this.routes[method][path] = handler;
    };
    ExpressPlus.prototype.get = function (path, handler) {
        this.addRoute('GET', path, handler);
    };
    ExpressPlus.prototype.post = function (path, handler) {
        this.addRoute('POST', path, handler);
    };
    ExpressPlus.prototype.put = function (path, handler) {
        this.addRoute('PUT', path, handler);
    };
    ExpressPlus.prototype.delete = function (path, handler) {
        this.addRoute('DELETE', path, handler);
    };
    ExpressPlus.prototype.patch = function (path, handler) {
        this.addRoute('PATCH', path, handler);
    };
    ExpressPlus.prototype.matchRoute = function (method, path) {
        var methodRoutes = this.routes[method];
        if (!methodRoutes)
            return {};
        var _loop_1 = function (routePath) {
            var paramsNames = [];
            var regexPath = routePath.replace(/:([^\/]+)/g, function (_, key) {
                paramsNames.push(key);
                return '([^/]+)';
            });
            var regex = new RegExp("^".concat(regexPath, "$"));
            var match = path.match(regex);
            if (match) {
                var params_1 = {};
                paramsNames.forEach(function (name, index) {
                    params_1[name] = match[index + 1];
                });
                return { value: { handler: methodRoutes[routePath], params: params_1 } };
            }
        };
        for (var routePath in methodRoutes) {
            var state_1 = _loop_1(routePath);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return {};
    };
    ExpressPlus.prototype.listen = function (port, callback) {
        var _this = this;
        var server = (0, node_http_1.createServer)(function (req, res) {
            var method = req.method || 'GET';
            var url = (0, node_url_1.parse)(req.url || '', true);
            var path = url.pathname || '';
            var _a = _this.matchRoute(method, path), handler = _a.handler, params = _a.params;
            if (handler) {
                req.params = params;
                handler(req, res);
            }
            else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            }
        });
        server.listen(port, callback);
    };
    return ExpressPlus;
}());
var app = new ExpressPlus();
app.get('/users', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ user: [] }));
});
app.post('/users', function (req, res) {
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User created' }));
});
app.put('/users/:id', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User updated' }));
});
app.patch('/users/:id', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User patched' }));
});
app.delete('/users/:id', function (req, res) {
    res.writeHead(204);
    res.end();
});
var mathUtils = new MathUtils();
exports.default = { ExpressPlus: ExpressPlus, mathUtils: mathUtils };
