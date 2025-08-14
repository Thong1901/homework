import { createServer, IncomingMessage, ServerResponse } from 'node:http'
import { parse } from 'node:url'

// Extended Request interface
interface ExtendedRequest extends IncomingMessage {
    params?: Record<string, string>;
    body?: any;
    query?: any;
}

// Extended Response interface với Express-like methods
interface ExtendedResponse extends ServerResponse {
    json(data: any): void;
    status(code: number): ExtendedResponse;
    send(data: any): void;
    sendStatus(code: number): void;
    redirect(url: string): void;
    redirect(status: number, url: string): void;
    // cookie(name: string, value: string, options?: any): ExtendedResponse;
    clearCookie(name: string, options?: any): ExtendedResponse;
    type(type: string): ExtendedResponse;
    set(field: string, value: string): ExtendedResponse;
    set(fields: Record<string, string>): ExtendedResponse;
    get(field: string): string | undefined;
}

export class ExpressPlus {
    private routes: { [method: string]: { [path: string]: Function } } = {}

    // Static method để access status codes
    public static get STATUS() {
        return ExpressPlus.STATUS_CODES;
    }

    // Static method để access status messages
    public static getStatusMessage(code: number): string {
        return ExpressPlus.STATUS_MESSAGES[code] || 'Unknown Status';
    }

    private addRoute(method: string, path: string, handler: Function) {
        this.routes[method] = this.routes[method] || {}
        this.routes[method][path] = handler
    }

    public get(path: string, handler: (req: ExtendedRequest, res: ExtendedResponse) => void) {
        this.addRoute('GET', path, handler)
    }

    public post(path: string, handler: (req: ExtendedRequest, res: ExtendedResponse) => void) {
        this.addRoute('POST', path, handler)
    }

    public put(path: string, handler: (req: ExtendedRequest, res: ExtendedResponse) => void) {
        this.addRoute('PUT', path, handler)
    }

    public delete(path: string, handler: (req: ExtendedRequest, res: ExtendedResponse) => void) {
        this.addRoute('DELETE', path, handler)
    }

    public patch(path: string, handler: (req: ExtendedRequest, res: ExtendedResponse) => void) {
        this.addRoute('PATCH', path, handler)
    }

    private matchRoute(method: string, path: string): { handler?: Function, params?: Record<string, string> } {
        const methodRoutes = this.routes[method]
        if (!methodRoutes) return {}

        for (const routePath in methodRoutes) {
            const paramsNames: string[] = []
            const regexPath = routePath.replace(/:([^\/]+)/g, (_, key) => {
                paramsNames.push(key)
                return '([^/]+)'
            })

            const regex = new RegExp(`^${regexPath}$`)
            const match = path.match(regex)
            if (match) {
                const params: Record<string, string> = {}
                paramsNames.forEach((name, index) => {
                    params[name] = match[index + 1]
                })
                return { handler: methodRoutes[routePath], params }
            }
        }
        return {}
    }

    // Parse request body
    private parseBody(req: IncomingMessage): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const parsed = body ? JSON.parse(body) : {};
                    resolve(parsed);
                } catch (error) {
                    resolve({});
                }
            });
            req.on('error', reject);
        });
    }

    // HTTP Status Codes Constants
    private static STATUS_CODES = {
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
    private static STATUS_MESSAGES: Record<number, string> = {
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

    // Helper method to parse cookies
    private parseCookies(cookieHeader: string): Record<string, string> {
        const cookies: Record<string, string> = {};
        if (!cookieHeader) return cookies;

        cookieHeader.split(';').forEach(cookie => {
            const [name, ...rest] = cookie.split('=');
            if (name && rest.length > 0) {
                cookies[name.trim()] = rest.join('=').trim();
            }
        });
        return cookies;
    }

    // Helper method to serialize cookie
    private serializeCookie(name: string, value: string, options: any = {}): string {
        let cookie = `${name}=${value}`;

        if (options.maxAge) {
            cookie += `; Max-Age=${options.maxAge}`;
        }
        if (options.expires) {
            cookie += `; Expires=${options.expires.toUTCString()}`;
        }
        if (options.path) {
            cookie += `; Path=${options.path}`;
        }
        if (options.domain) {
            cookie += `; Domain=${options.domain}`;
        }
        if (options.secure) {
            cookie += '; Secure';
        }
        if (options.httpOnly) {
            cookie += '; HttpOnly';
        }
        if (options.sameSite) {
            cookie += `; SameSite=${options.sameSite}`;
        }

        return cookie;
    }

    // Extend response object with Express-like methods
    private extendResponse(res: ServerResponse): ExtendedResponse {
        const extendedRes = res as ExtendedResponse;

        // Store properties on response object
        (extendedRes as any)._statusCode = 200;
        (extendedRes as any)._headers = {};

        // json method
        extendedRes.json = (data: any) => {
            if (res.headersSent) return;

            const statusCode = (extendedRes as any)._statusCode || 200;
            const headers = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                ...(extendedRes as any)._headers
            };

            res.writeHead(statusCode, headers);
            res.end(JSON.stringify(data));
        };

        // status method
        extendedRes.status = (code: number) => {
            (extendedRes as any)._statusCode = code;
            return extendedRes;
        };

        // send method
        extendedRes.send = (data: any) => {
            if (res.headersSent) return;

            const statusCode = (extendedRes as any)._statusCode || 200;
            const headers = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                ...(extendedRes as any)._headers
            };

            if (typeof data === 'object' && data !== null) {
                headers['Content-Type'] = 'application/json';
                res.writeHead(statusCode, headers);
                res.end(JSON.stringify(data));
            } else {
                headers['Content-Type'] = 'text/plain';
                res.writeHead(statusCode, headers);
                res.end(String(data));
            }
        };

        // sendStatus method
        extendedRes.sendStatus = (code: number) => {
            const message = ExpressPlus.STATUS_MESSAGES[code] || 'Unknown Status';
            extendedRes.status(code).send(message);
        };

        // redirect method
        extendedRes.redirect = (statusOrUrl: number | string, url?: string) => {
            if (res.headersSent) return;

            let redirectStatus = 302;
            let redirectUrl: string;

            if (typeof statusOrUrl === 'string') {
                redirectUrl = statusOrUrl;
            } else {
                redirectStatus = statusOrUrl;
                redirectUrl = url!;
            }

            const headers = {
                'Location': redirectUrl,
                'Access-Control-Allow-Origin': '*',
                ...(extendedRes as any)._headers
            };

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
        extendedRes.type = (contentType: string) => {
            const mimeTypes: Record<string, string> = {
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

            const fullType = mimeTypes[contentType] || contentType;
            (extendedRes as any)._headers['Content-Type'] = fullType;
            return extendedRes;
        };

        // set method (set headers)
        extendedRes.set = (field: string | Record<string, string>, value?: string) => {
            if (typeof field === 'string' && value !== undefined) {
                (extendedRes as any)._headers[field] = value;
            } else if (typeof field === 'object') {
                Object.assign((extendedRes as any)._headers, field);
            }
            return extendedRes;
        };

        // get method (get header)
        extendedRes.get = (field: string) => {
            return (extendedRes as any)._headers[field] || res.getHeader(field);
        };

        return extendedRes;
    }

    public listen(port: number, callback?: () => void) {
        const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
            // FIX: Thêm CORS preflight handling
            if (req.method === 'OPTIONS') {
                res.writeHead(200, {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                });
                res.end();
                return;
            }

            const method = req.method || 'GET'
            const url = parse(req.url || '', true)
            const path = url.pathname || ''

            const { handler, params } = this.matchRoute(method, path)

            if (handler) {
                try {
                    // Extend request object
                    const extendedReq = req as ExtendedRequest;
                    extendedReq.params = params;
                    extendedReq.query = url.query;

                    // Parse body for POST, PUT, PATCH
                    if (['POST', 'PUT', 'PATCH'].includes(method)) {
                        try {
                            extendedReq.body = await this.parseBody(req);
                        } catch (error) {
                            extendedReq.body = {};
                        }
                    }

                    // Extend response object
                    const extendedRes = this.extendResponse(res);

                    // Call handler - FIX: Thêm await để handle async functions
                    await handler(extendedReq, extendedRes);
                } catch (error) {
                    // FIX: Error handling cho handler
                    console.error('Handler error:', error);
                    if (!res.headersSent) {
                        res.writeHead(500, {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        });
                        res.end(JSON.stringify({ error: 'Internal Server Error' }));
                    }
                }
            } else {
                res.writeHead(404, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ error: 'Not Found' }));
            }
        });

        server.listen(port, callback);
        return server; // FIX: Return server instance để có thể close nếu cần
    }
}

export default ExpressPlus;