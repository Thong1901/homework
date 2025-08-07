"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_http_1 = require("node:http");
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
    ExpressPlus.prototype.listen = function (port, callback) {
        var _this = this;
        var server = (0, node_http_1.createServer)(function (req, res) {
            var _a;
            var method = req.method || 'GET';
            var path = req.url || '';
            var routeHandler = (_a = _this.routes[method]) === null || _a === void 0 ? void 0 : _a[path];
            if (routeHandler) {
                routeHandler(req, res);
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
app.listen(3000, function () {
    console.log('Server is running on http://localhost:3000');
});
exports.default = ExpressPlus;
