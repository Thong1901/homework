"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.ExpressPlus = void 0;
var node_http_1 = require("node:http");
var node_url_1 = require("node:url");
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
exports.ExpressPlus = ExpressPlus;
exports.default = ExpressPlus;
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
