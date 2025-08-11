"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_http_1 = require("node:http");
var node_url_1 = require("node:url");
var MathExpress = /** @class */ (function () {
    function MathExpress() {
        this.routes = {};
        this.operations = new Map();
        this.history = [];
        this.initializeRoutes();
        this.registerMathRoutes();
    }
    MathExpress.prototype.initializeRoutes = function () {
        this.routes = {
            'GET': {},
            'POST': {},
            'PUT': {},
            'DELETE': {},
            'PATCH': {}
        };
    };
    MathExpress.prototype.addRoute = function (method, path, handler) {
        this.routes[method] = this.routes[method] || {};
        this.routes[method][path] = handler;
    };
    // HTTP Methods
    MathExpress.prototype.get = function (path, handler) {
        this.addRoute('GET', path, handler);
    };
    MathExpress.prototype.post = function (path, handler) {
        this.addRoute('POST', path, handler);
    };
    MathExpress.prototype.put = function (path, handler) {
        this.addRoute('PUT', path, handler);
    };
    MathExpress.prototype.delete = function (path, handler) {
        this.addRoute('DELETE', path, handler);
    };
    MathExpress.prototype.patch = function (path, handler) {
        this.addRoute('PATCH', path, handler);
    };
    // Route matching with parameters
    MathExpress.prototype.matchRoute = function (method, path) {
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
    // Math operations
    MathExpress.prototype.calculateSum = function (numbers) {
        return numbers.reduce(function (acc, num) { return acc + num; }, 0);
    };
    MathExpress.prototype.calculateSubtract = function (numbers) {
        if (numbers.length === 0)
            return 0;
        return numbers.slice(1).reduce(function (acc, num) { return acc - num; }, numbers[0]);
    };
    MathExpress.prototype.calculateMultiply = function (numbers) {
        return numbers.reduce(function (acc, num) { return acc * num; }, 1);
    };
    MathExpress.prototype.calculateDivide = function (numbers) {
        if (numbers.length === 0)
            return 0;
        if (numbers.slice(1).some(function (num) { return num === 0; })) {
            throw new Error("Division by zero is not allowed");
        }
        return numbers.slice(1).reduce(function (acc, num) { return acc / num; }, numbers[0]);
    };
    MathExpress.prototype.calculateModulo = function (numbers) {
        if (numbers.length < 2)
            throw new Error("Modulo requires at least 2 numbers");
        if (numbers[1] === 0)
            throw new Error("Modulo by zero is not allowed");
        return numbers[0] % numbers[1];
    };
    MathExpress.prototype.executeOperation = function (operation, numbers) {
        switch (operation) {
            case 'sum':
                return this.calculateSum(numbers);
            case 'subtract':
                return this.calculateSubtract(numbers);
            case 'multiply':
                return this.calculateMultiply(numbers);
            case 'divide':
                return this.calculateDivide(numbers);
            case 'modulo':
                return this.calculateModulo(numbers);
            default:
                throw new Error("Unknown operation: ".concat(operation));
        }
    };
    MathExpress.prototype.generateId = function () {
        return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    };
    MathExpress.prototype.sendResponse = function (res, statusCode, data) {
        res.writeHead(statusCode, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end(JSON.stringify(data));
    };
    MathExpress.prototype.parseBody = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var body = '';
                        req.on('data', function (chunk) {
                            body += chunk.toString();
                        });
                        req.on('end', function () {
                            try {
                                resolve(body ? JSON.parse(body) : {});
                            }
                            catch (error) {
                                reject(new Error('Invalid JSON'));
                            }
                        });
                        req.on('error', reject);
                    })];
            });
        });
    };
    // Register math-specific routes
    MathExpress.prototype.registerMathRoutes = function () {
        var _this = this;
        // GET - Calculate without saving
        this.get('/api/math/calculate/:operation', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var operation, numbersParam, numbers, result, response;
            var _a, _b;
            return __generator(this, function (_c) {
                try {
                    operation = ((_a = req.params) === null || _a === void 0 ? void 0 : _a.operation) || '';
                    numbersParam = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.numbers) || '';
                    numbers = numbersParam.split(',').map(function (n) { return parseFloat(n); }).filter(function (n) { return !isNaN(n); });
                    if (numbers.length === 0) {
                        throw new Error('No valid numbers provided');
                    }
                    result = this.executeOperation(operation, numbers);
                    response = {
                        success: true,
                        result: result,
                        operation: operation,
                        input: numbers,
                        timestamp: new Date()
                    };
                    this.sendResponse(res, 200, response);
                }
                catch (error) {
                    this.sendResponse(res, 400, {
                        success: false,
                        error: error instanceof Error ? error.message : 'Unknown error',
                        timestamp: new Date()
                    });
                }
                return [2 /*return*/];
            });
        }); });
        // POST - Create and save operation
        this.post('/api/math/operations', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var body, operation, numbers, result, id, mathOp, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.parseBody(req)];
                    case 1:
                        body = _a.sent();
                        operation = body.operation, numbers = body.numbers;
                        if (!operation || !Array.isArray(numbers)) {
                            throw new Error('Invalid operation or numbers');
                        }
                        result = this.executeOperation(operation, numbers);
                        id = this.generateId();
                        mathOp = {
                            id: id,
                            operation: operation,
                            numbers: numbers,
                            result: result,
                            timestamp: new Date()
                        };
                        this.operations.set(id, mathOp);
                        this.history.push(mathOp);
                        response = {
                            success: true,
                            result: result,
                            operation: operation,
                            input: numbers,
                            timestamp: new Date(),
                            id: id
                        };
                        this.sendResponse(res, 201, response);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        this.sendResponse(res, 400, {
                            success: false,
                            error: error_1 instanceof Error ? error_1.message : 'Unknown error',
                            timestamp: new Date()
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // GET - Retrieve operation by ID
        this.get('/api/math/operations/:id', function (req, res) {
            var _a;
            try {
                var id = ((_a = req.params) === null || _a === void 0 ? void 0 : _a.id) || '';
                var operation = _this.operations.get(id);
                if (!operation) {
                    _this.sendResponse(res, 404, {
                        success: false,
                        error: 'Operation not found',
                        timestamp: new Date()
                    });
                    return;
                }
                _this.sendResponse(res, 200, __assign({ success: true }, operation));
            }
            catch (error) {
                _this.sendResponse(res, 500, {
                    success: false,
                    error: 'Internal server error',
                    timestamp: new Date()
                });
            }
        });
        // PUT - Update entire operation
        this.put('/api/math/operations/:id', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var id_1, body, operation, numbers, result, mathOp, historyIndex, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        id_1 = ((_a = req.params) === null || _a === void 0 ? void 0 : _a.id) || '';
                        return [4 /*yield*/, this.parseBody(req)];
                    case 1:
                        body = _b.sent();
                        operation = body.operation, numbers = body.numbers;
                        if (!this.operations.has(id_1)) {
                            this.sendResponse(res, 404, {
                                success: false,
                                error: 'Operation not found',
                                timestamp: new Date()
                            });
                            return [2 /*return*/];
                        }
                        result = this.executeOperation(operation, numbers);
                        mathOp = {
                            id: id_1,
                            operation: operation,
                            numbers: numbers,
                            result: result,
                            timestamp: new Date()
                        };
                        this.operations.set(id_1, mathOp);
                        historyIndex = this.history.findIndex(function (op) { return op.id === id_1; });
                        if (historyIndex !== -1) {
                            this.history[historyIndex] = mathOp;
                        }
                        this.sendResponse(res, 200, {
                            success: true,
                            result: result,
                            operation: operation,
                            input: numbers,
                            timestamp: new Date(),
                            id: id_1
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        this.sendResponse(res, 400, {
                            success: false,
                            error: error_2 instanceof Error ? error_2.message : 'Unknown error',
                            timestamp: new Date()
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // DELETE - Remove operation
        this.delete('/api/math/operations/:id', function (req, res) {
            var _a;
            try {
                var id_2 = ((_a = req.params) === null || _a === void 0 ? void 0 : _a.id) || '';
                if (!_this.operations.has(id_2)) {
                    _this.sendResponse(res, 404, {
                        success: false,
                        error: 'Operation not found',
                        timestamp: new Date()
                    });
                    return;
                }
                _this.operations.delete(id_2);
                _this.history = _this.history.filter(function (op) { return op.id !== id_2; });
                res.writeHead(204);
                res.end();
            }
            catch (error) {
                _this.sendResponse(res, 500, {
                    success: false,
                    error: 'Internal server error',
                    timestamp: new Date()
                });
            }
        });
        // PATCH - Recalculate operation
        this.patch('/api/math/operations/:id/recalculate', function (req, res) {
            var _a;
            try {
                var id = ((_a = req.params) === null || _a === void 0 ? void 0 : _a.id) || '';
                var operation = _this.operations.get(id);
                if (!operation) {
                    _this.sendResponse(res, 404, {
                        success: false,
                        error: 'Operation not found',
                        timestamp: new Date()
                    });
                    return;
                }
                var result = _this.executeOperation(operation.operation, operation.numbers);
                operation.result = result;
                operation.timestamp = new Date();
                _this.sendResponse(res, 200, {
                    success: true,
                    result: result,
                    operation: operation.operation,
                    input: operation.numbers,
                    timestamp: new Date(),
                    id: id
                });
            }
            catch (error) {
                _this.sendResponse(res, 400, {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    timestamp: new Date()
                });
            }
        });
        // GET - History
        this.get('/api/math/history', function (req, res) {
            _this.sendResponse(res, 200, {
                success: true,
                history: _this.history,
                count: _this.history.length,
                timestamp: new Date()
            });
        });
        // DELETE - Clear history
        this.delete('/api/math/history', function (req, res) {
            var count = _this.history.length;
            _this.history = [];
            _this.operations.clear();
            _this.sendResponse(res, 200, {
                success: true,
                message: "Cleared ".concat(count, " operations"),
                timestamp: new Date()
            });
        });
        // GET - Health check
        this.get('/api/health', function (req, res) {
            _this.sendResponse(res, 200, {
                status: 'healthy',
                uptime: process.uptime(),
                timestamp: new Date(),
                operations: _this.operations.size
            });
        });
    };
    MathExpress.prototype.listen = function (port, callback) {
        var _this = this;
        var server = (0, node_http_1.createServer)(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var method, url, path, extendedReq, _a, handler, params;
            return __generator(this, function (_b) {
                method = req.method || 'GET';
                url = (0, node_url_1.parse)(req.url || '', true);
                path = url.pathname || '';
                extendedReq = req;
                extendedReq.query = url.query;
                // Handle CORS preflight
                if (method === 'OPTIONS') {
                    res.writeHead(200, {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    });
                    res.end();
                    return [2 /*return*/];
                }
                _a = this.matchRoute(method, path), handler = _a.handler, params = _a.params;
                if (handler) {
                    extendedReq.params = params;
                    handler(extendedReq, res);
                }
                else {
                    this.sendResponse(res, 404, {
                        success: false,
                        error: 'Route not found',
                        path: path,
                        method: method,
                        timestamp: new Date()
                    });
                }
                return [2 /*return*/];
            });
        }); });
        server.listen(port, callback);
    };
    return MathExpress;
}());
// Usage example
var mathApp = new MathExpress();
// Custom routes can still be added
mathApp.get('/api/info', function (req, res) {
    mathApp['sendResponse'](res, 200, {
        name: 'MathExpress Server',
        version: '1.0.0',
        endpoints: {
            calculate: 'GET /api/math/calculate/:operation?numbers=1,2,3',
            operations: 'POST /api/math/operations',
            getOperation: 'GET /api/math/operations/:id',
            updateOperation: 'PUT /api/math/operations/:id',
            deleteOperation: 'DELETE /api/math/operations/:id',
            recalculate: 'PATCH /api/math/operations/:id/recalculate',
            history: 'GET /api/math/history',
            clearHistory: 'DELETE /api/math/history',
            health: 'GET /api/health'
        }
    });
});
exports.default = MathExpress;
