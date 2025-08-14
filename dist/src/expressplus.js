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
    }
    Object.defineProperty(ExpressPlus, "STATUS", {
        // Static method để access status codes
        get: function () {
            return ExpressPlus.STATUS_CODES;
        },
        enumerable: false,
        configurable: true
    });
    // Static method để access status messages
    ExpressPlus.getStatusMessage = function (code) {
        return ExpressPlus.STATUS_MESSAGES[code] || 'Unknown Status';
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
        return new Promise(function (resolve, reject) {
            var body = '';
            req.on('data', function (chunk) {
                body += chunk.toString();
            });
            req.on('end', function () {
                try {
                    var parsed = body ? JSON.parse(body) : {};
                    resolve(parsed);
                }
                catch (error) {
                    resolve({});
                }
            });
            req.on('error', reject);
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
        if (options.maxAge) {
            cookie += "; Max-Age=".concat(options.maxAge);
        }
        if (options.expires) {
            cookie += "; Expires=".concat(options.expires.toUTCString());
        }
        if (options.path) {
            cookie += "; Path=".concat(options.path);
        }
        if (options.domain) {
            cookie += "; Domain=".concat(options.domain);
        }
        if (options.secure) {
            cookie += '; Secure';
        }
        if (options.httpOnly) {
            cookie += '; HttpOnly';
        }
        if (options.sameSite) {
            cookie += "; SameSite=".concat(options.sameSite);
        }
        return cookie;
    };
    // Extend response object with Express-like methods
    ExpressPlus.prototype.extendResponse = function (res) {
        var extendedRes = res;
        // Store properties on response object
        extendedRes._statusCode = 200;
        extendedRes._headers = {};
        // json method
        extendedRes.json = function (data) {
            if (res.headersSent)
                return;
            var statusCode = extendedRes._statusCode || 200;
            var headers = __assign({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }, extendedRes._headers);
            res.writeHead(statusCode, headers);
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
            var statusCode = extendedRes._statusCode || 200;
            var headers = __assign({ 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }, extendedRes._headers);
            if (typeof data === 'object' && data !== null) {
                headers['Content-Type'] = 'application/json';
                res.writeHead(statusCode, headers);
                res.end(JSON.stringify(data));
            }
            else {
                headers['Content-Type'] = 'text/plain';
                res.writeHead(statusCode, headers);
                res.end(String(data));
            }
        };
        // sendStatus method
        extendedRes.sendStatus = function (code) {
            var message = ExpressPlus.STATUS_MESSAGES[code] || 'Unknown Status';
            extendedRes.status(code).send(message);
        };
        // redirect method
        extendedRes.redirect = function (statusOrUrl, url) {
            if (res.headersSent)
                return;
            var redirectStatus = 302;
            var redirectUrl;
            if (typeof statusOrUrl === 'string') {
                redirectUrl = statusOrUrl;
            }
            else {
                redirectStatus = statusOrUrl;
                redirectUrl = url;
            }
            var headers = __assign({ 'Location': redirectUrl, 'Access-Control-Allow-Origin': '*' }, extendedRes._headers);
            res.writeHead(redirectStatus, headers);
            res.end();
        };
        // cookie method
        // extendedRes.cookie = (name: string, value: string, options: any = {}) => {
        //     const cookieString = this.serializeCookie(name, value, options);
        //     const existingCookies = res.getHeader('Set-Cookie') || [];
        //     const cookies = Array.isArray(existingCookies) ? existingCookies : [existingCookies];
        //     cookies.push(cookieString);
        //     res.setHeader('Set-Cookie', cookies);
        //     return extendedRes;
        // };
        // // clearCookie method
        // extendedRes.clearCookie = (name: string, options: any = {}) => {
        //     const clearOptions = { ...options, expires: new Date(1), maxAge: 0 };
        //     return extendedRes.cookie(name, '', clearOptions);
        // };
        // type method (set Content-Type)
        extendedRes.type = function (contentType) {
            var mimeTypes = {
                'html': 'text/html',
                'json': 'application/json',
                'xml': 'application/xml',
                'txt': 'text/plain',
                'css': 'text/css',
                'js': 'application/javascript',
                'pdf': 'application/pdf',
                'png': 'image/png',
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'gif': 'image/gif',
                'svg': 'image/svg+xml'
            };
            var fullType = mimeTypes[contentType] || contentType;
            extendedRes._headers['Content-Type'] = fullType;
            return extendedRes;
        };
        // set method (set headers)
        extendedRes.set = function (field, value) {
            if (typeof field === 'string' && value !== undefined) {
                extendedRes._headers[field] = value;
            }
            else if (typeof field === 'object') {
                Object.assign(extendedRes._headers, field);
            }
            return extendedRes;
        };
        // get method (get header)
        extendedRes.get = function (field) {
            return extendedRes._headers[field] || res.getHeader(field);
        };
        return extendedRes;
    };
    ExpressPlus.prototype.listen = function (port, callback) {
        var _this = this;
        var server = (0, node_http_1.createServer)(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var method, url, path, _a, handler, params, extendedReq, _b, error_1, extendedRes, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // FIX: Thêm CORS preflight handling
                        if (req.method === 'OPTIONS') {
                            res.writeHead(200, {
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                            });
                            res.end();
                            return [2 /*return*/];
                        }
                        method = req.method || 'GET';
                        url = (0, node_url_1.parse)(req.url || '', true);
                        path = url.pathname || '';
                        _a = this.matchRoute(method, path), handler = _a.handler, params = _a.params;
                        if (!handler) return [3 /*break*/, 9];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 7, , 8]);
                        extendedReq = req;
                        extendedReq.params = params;
                        extendedReq.query = url.query;
                        if (!['POST', 'PUT', 'PATCH'].includes(method)) return [3 /*break*/, 5];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        _b = extendedReq;
                        return [4 /*yield*/, this.parseBody(req)];
                    case 3:
                        _b.body = _c.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _c.sent();
                        extendedReq.body = {};
                        return [3 /*break*/, 5];
                    case 5:
                        extendedRes = this.extendResponse(res);
                        // Call handler - FIX: Thêm await để handle async functions
                        return [4 /*yield*/, handler(extendedReq, extendedRes)];
                    case 6:
                        // Call handler - FIX: Thêm await để handle async functions
                        _c.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_2 = _c.sent();
                        // FIX: Error handling cho handler
                        console.error('Handler error:', error_2);
                        if (!res.headersSent) {
                            res.writeHead(500, {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        }
                        return [3 /*break*/, 8];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        res.writeHead(404, {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        });
                        res.end(JSON.stringify({ error: 'Not Found' }));
                        _c.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        }); });
        server.listen(port, callback);
        return server; // FIX: Return server instance để có thể close nếu cần
    };
    // HTTP Status Codes Constants
    ExpressPlus.STATUS_CODES = {
        // 1xx Informational
        CONTINUE: 100,
        SWITCHING_PROTOCOLS: 101,
        PROCESSING: 102,
        EARLY_HINTS: 103,
        // 2xx Success
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        NON_AUTHORITATIVE_INFORMATION: 203,
        NO_CONTENT: 204,
        RESET_CONTENT: 205,
        PARTIAL_CONTENT: 206,
        MULTI_STATUS: 207,
        ALREADY_REPORTED: 208,
        IM_USED: 226,
        // 3xx Redirection
        MULTIPLE_CHOICES: 300,
        MOVED_PERMANENTLY: 301,
        FOUND: 302,
        SEE_OTHER: 303,
        NOT_MODIFIED: 304,
        USE_PROXY: 305,
        TEMPORARY_REDIRECT: 307,
        PERMANENT_REDIRECT: 308,
        // 4xx Client Error
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        PAYMENT_REQUIRED: 402,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        METHOD_NOT_ALLOWED: 405,
        NOT_ACCEPTABLE: 406,
        PROXY_AUTHENTICATION_REQUIRED: 407,
        REQUEST_TIMEOUT: 408,
        CONFLICT: 409,
        GONE: 410,
        LENGTH_REQUIRED: 411,
        PRECONDITION_FAILED: 412,
        PAYLOAD_TOO_LARGE: 413,
        URI_TOO_LONG: 414,
        UNSUPPORTED_MEDIA_TYPE: 415,
        RANGE_NOT_SATISFIABLE: 416,
        EXPECTATION_FAILED: 417,
        IM_A_TEAPOT: 418,
        MISDIRECTED_REQUEST: 421,
        UNPROCESSABLE_ENTITY: 422,
        LOCKED: 423,
        FAILED_DEPENDENCY: 424,
        TOO_EARLY: 425,
        UPGRADE_REQUIRED: 426,
        PRECONDITION_REQUIRED: 428,
        TOO_MANY_REQUESTS: 429,
        REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
        UNAVAILABLE_FOR_LEGAL_REASONS: 451,
        // 5xx Server Error
        INTERNAL_SERVER_ERROR: 500,
        NOT_IMPLEMENTED: 501,
        BAD_GATEWAY: 502,
        SERVICE_UNAVAILABLE: 503,
        GATEWAY_TIMEOUT: 504,
        HTTP_VERSION_NOT_SUPPORTED: 505,
        VARIANT_ALSO_NEGOTIATES: 506,
        INSUFFICIENT_STORAGE: 507,
        LOOP_DETECTED: 508,
        NOT_EXTENDED: 510,
        NETWORK_AUTHENTICATION_REQUIRED: 511
    };
    // Status Messages
    ExpressPlus.STATUS_MESSAGES = {
        100: 'Continue',
        101: 'Switching Protocols',
        102: 'Processing',
        103: 'Early Hints',
        200: 'OK',
        201: 'Created',
        202: 'Accepted',
        203: 'Non-Authoritative Information',
        204: 'No Content',
        205: 'Reset Content',
        206: 'Partial Content',
        207: 'Multi-Status',
        208: 'Already Reported',
        226: 'IM Used',
        300: 'Multiple Choices',
        301: 'Moved Permanently',
        302: 'Found',
        303: 'See Other',
        304: 'Not Modified',
        305: 'Use Proxy',
        307: 'Temporary Redirect',
        308: 'Permanent Redirect',
        400: 'Bad Request',
        401: 'Unauthorized',
        402: 'Payment Required',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        406: 'Not Acceptable',
        407: 'Proxy Authentication Required',
        408: 'Request Timeout',
        409: 'Conflict',
        410: 'Gone',
        411: 'Length Required',
        412: 'Precondition Failed',
        413: 'Payload Too Large',
        414: 'URI Too Long',
        415: 'Unsupported Media Type',
        416: 'Range Not Satisfiable',
        417: 'Expectation Failed',
        418: "I'm a Teapot",
        421: 'Misdirected Request',
        422: 'Unprocessable Entity',
        423: 'Locked',
        424: 'Failed Dependency',
        425: 'Too Early',
        426: 'Upgrade Required',
        428: 'Precondition Required',
        429: 'Too Many Requests',
        431: 'Request Header Fields Too Large',
        451: 'Unavailable For Legal Reasons',
        500: 'Internal Server Error',
        501: 'Not Implemented',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout',
        505: 'HTTP Version Not Supported',
        506: 'Variant Also Negotiates',
        507: 'Insufficient Storage',
        508: 'Loop Detected',
        510: 'Not Extended',
        511: 'Network Authentication Required'
    };
    return ExpressPlus;
}());
exports.ExpressPlus = ExpressPlus;
exports.default = ExpressPlus;
