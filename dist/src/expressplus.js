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
exports.ExpressPlus = void 0;
var node_http_1 = require("node:http");
var node_url_1 = require("node:url");
var ExpressPlus = /** @class */ (function () {
    function ExpressPlus() {
        this.routes = {};
        this.middleware = [];
    }
    Object.defineProperty(ExpressPlus, "STATUS", {
        // Static method to access status codes
        get: function () {
            return ExpressPlus.STATUS_CODES;
        },
        enumerable: false,
        configurable: true
    });
    // Static method to access status messages
    ExpressPlus.getStatusMessage = function (code) {
        return ExpressPlus.STATUS_MESSAGES[code] || 'Unknown Status';
    };
    // Middleware support
    ExpressPlus.prototype.use = function (middleware) {
        this.middleware.push(middleware);
    };
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
    // Parse request body
    ExpressPlus.prototype.parseBody = function (req) {
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
    // Helper method to parse cookies
    ExpressPlus.prototype.parseCookies = function (cookieHeader) {
        var cookies = {};
        if (!cookieHeader)
            return cookies;
        cookieHeader.split(';').forEach(function (cookie) {
            var _a = cookie.split('='), name = _a[0], rest = _a.slice(1);
            if (name && rest.length > 0) {
                cookies[name.trim()] = rest.join('=').trim();
            }
        });
        return cookies;
    };
    // Helper method to serialize cookie
    ExpressPlus.prototype.serializeCookie = function (name, value, options) {
        if (options === void 0) { options = {}; }
        var cookie = "".concat(name, "=").concat(value);
        if (options.maxAge)
            cookie += "; Max-Age=".concat(options.maxAge);
        if (options.expires)
            cookie += "; Expires=".concat(options.expires.toUTCString());
        if (options.path)
            cookie += "; Path=".concat(options.path);
        if (options.domain)
            cookie += "; Domain=".concat(options.domain);
        if (options.secure)
            cookie += '; Secure';
        if (options.httpOnly)
            cookie += '; HttpOnly';
        if (options.sameSite)
            cookie += "; SameSite=".concat(options.sameSite);
        return cookie;
    };
    // Extend response object
    ExpressPlus.prototype.extendResponse = function (res) {
        var _this = this;
        var extendedRes = res;
        // Store headers and status code
        extendedRes._headers = {};
        extendedRes._statusCode = 200;
        // json method
        extendedRes.json = function (data) {
            if (res.headersSent)
                return;
            res.writeHead(extendedRes._statusCode, __assign({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }, extendedRes._headers));
            res.end(JSON.stringify(data));
        };
        // status method
        extendedRes.status = function (code) {
            extendedRes._statusCode = code;
            return extendedRes;
        };
        // send method
        extendedRes.send = function (data) {
            if (res.headersSent)
                return;
            var headers = __assign({ 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }, extendedRes._headers);
            if (typeof data === 'object' && data !== null) {
                headers['Content-Type'] = 'application/json';
                res.writeHead(extendedRes._statusCode, headers);
                res.end(JSON.stringify(data));
            }
            else {
                headers['Content-Type'] = 'text/plain';
                res.writeHead(extendedRes._statusCode, headers);
                res.end(String(data));
            }
        };
        // sendStatus method
        extendedRes.sendStatus = function (code) {
            extendedRes.status(code).send(ExpressPlus.STATUS_MESSAGES[code] || 'Unknown Status');
        };
        // redirect method
        extendedRes.redirect = function (statusOrUrl, url) {
            if (res.headersSent)
                return;
            var status = 302;
            var redirectUrl;
            if (typeof statusOrUrl === 'string') {
                redirectUrl = statusOrUrl;
            }
            else {
                status = statusOrUrl;
                redirectUrl = url;
            }
            res.writeHead(status, __assign({ 'Location': redirectUrl, 'Access-Control-Allow-Origin': '*' }, extendedRes._headers));
            res.end();
        };
        // type method
        extendedRes.type = function (contentType) {
            var mimeTypes = {
                html: 'text/html',
                json: 'application/json',
                xml: 'application/xml',
                txt: 'text/plain',
                css: 'text/css',
                js: 'application/javascript',
                pdf: 'application/pdf',
                png: 'image/png',
                jpg: 'image/jpeg',
                jpeg: 'image/jpeg',
                gif: 'image/gif',
                svg: 'image/svg+xml',
            };
            extendedRes._headers['Content-Type'] = mimeTypes[contentType] || contentType;
            return extendedRes;
        };
        // set method
        extendedRes.set = function (field, value) {
            if (typeof field === 'string' && value !== undefined) {
                extendedRes._headers[field] = value;
            }
            else if (typeof field === 'object') {
                Object.assign(extendedRes._headers, field);
            }
            return extendedRes;
        };
        // get method
        extendedRes.get = function (field) {
            return extendedRes._headers[field] || res.getHeader(field);
        };
        // clearCookie method
        extendedRes.clearCookie = function (name, options) {
            if (options === void 0) { options = {}; }
            var clearOptions = __assign(__assign({}, options), { expires: new Date(1), maxAge: 0 });
            var cookieString = _this.serializeCookie(name, '', clearOptions);
            var existingCookiesHeader = res.getHeader('Set-Cookie');
            // Ensure 'cookies' is always a string array
            var cookies = [];
            if (Array.isArray(existingCookiesHeader)) {
                cookies = existingCookiesHeader;
            }
            else if (existingCookiesHeader) {
                // Coerce to string if it's a number or string
                cookies = [String(existingCookiesHeader)];
            }
            cookies.push(cookieString);
            res.setHeader('Set-Cookie', cookies); // No more error!
            return extendedRes;
        };
        return extendedRes;
    };
    ExpressPlus.prototype.listen = function (port, callback) {
        var _this = this;
        var server = (0, node_http_1.createServer)(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var method, url, path, extendedReq, extendedRes, _a, _b, handler, params, _loop_2, _i, _c, middleware, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        // Handle CORS preflight requests
                        if (req.method === 'OPTIONS') {
                            res.writeHead(200, {
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                            });
                            res.end();
                            return [2 /*return*/];
                        }
                        method = req.method || 'GET';
                        url = (0, node_url_1.parse)(req.url || '', true);
                        path = url.pathname || '';
                        extendedReq = req;
                        extendedRes = this.extendResponse(res);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 12, , 13]);
                        if (!['POST', 'PUT', 'PATCH'].includes(method)) return [3 /*break*/, 3];
                        _a = extendedReq;
                        return [4 /*yield*/, this.parseBody(req)];
                    case 2:
                        _a.body = _d.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        extendedReq.body = {};
                        _d.label = 4;
                    case 4:
                        // Set query and params
                        extendedReq.query = url.query;
                        _b = this.matchRoute(method, path), handler = _b.handler, params = _b.params;
                        extendedReq.params = params;
                        _loop_2 = function (middleware) {
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                                            middleware(extendedReq, extendedRes, function (err) { return (err ? reject(err) : resolve()); });
                                        })];
                                    case 1:
                                        _e.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, _c = this.middleware;
                        _d.label = 5;
                    case 5:
                        if (!(_i < _c.length)) return [3 /*break*/, 8];
                        middleware = _c[_i];
                        return [5 /*yield**/, _loop_2(middleware)];
                    case 6:
                        _d.sent();
                        _d.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8:
                        if (!handler) return [3 /*break*/, 10];
                        return [4 /*yield*/, handler(extendedReq, extendedRes)];
                    case 9:
                        _d.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        extendedRes.status(404).json({ success: false, error: 'Not Found' });
                        _d.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        error_1 = _d.sent();
                        console.error('Handler error:', error_1);
                        if (!res.headersSent) {
                            extendedRes.status(500).json({ success: false, error: 'Internal Server Error' });
                        }
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/];
                }
            });
        }); });
        server.listen(port, callback);
        return server;
    };
    // Static status codes
    ExpressPlus.STATUS_CODES = {
        CONTINUE: 100,
        OK: 200,
        CREATED: 201,
        NO_CONTENT: 204,
        BAD_REQUEST: 400,
        NOT_FOUND: 404,
        INTERNAL_SERVER_ERROR: 500,
        // Add more as needed
    };
    // Static status messages
    ExpressPlus.STATUS_MESSAGES = {
        100: 'Continue',
        200: 'OK',
        201: 'Created',
        204: 'No Content',
        400: 'Bad Request',
        404: 'Not Found',
        500: 'Internal Server Error',
        // Add more as needed
    };
    return ExpressPlus;
}());
exports.ExpressPlus = ExpressPlus;
exports.default = ExpressPlus;
