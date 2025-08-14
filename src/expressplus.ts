import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { parse } from 'node:url';

// Extended Request interface
interface ExtendedRequest extends IncomingMessage {
    params?: Record<string, string>;
    body?: any;
    query?: any;
}

// Extended Response interface with Express-like methods
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

// Type for route handlers
type RouteHandler = (req: ExtendedRequest, res: ExtendedResponse, next?: (err?: any) => void) => void | Promise<void>;
export class ExpressPlus {
    private routes: { [method: string]: { [path: string]: RouteHandler } } = {};
    private middleware: RouteHandler[] = [];

    // Static status codes
    private static STATUS_CODES = {
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
    private static STATUS_MESSAGES: Record<number, string> = {
        100: 'Continue',
        200: 'OK',
        201: 'Created',
        204: 'No Content',
        400: 'Bad Request',
        404: 'Not Found',
        500: 'Internal Server Error',
        // Add more as needed
    };

    // Static method to access status codes
    public static get STATUS() {
        return ExpressPlus.STATUS_CODES;
    }

    // Static method to access status messages
    public static getStatusMessage(code: number): string {
        return ExpressPlus.STATUS_MESSAGES[code] || 'Unknown Status';
    }

    // Middleware support
    public use(middleware: RouteHandler) {
        this.middleware.push(middleware);
    }

    private addRoute(method: string, path: string, handler: RouteHandler) {
        this.routes[method] = this.routes[method] || {};
        this.routes[method][path] = handler;
    }

    public get(path: string, handler: RouteHandler) {
        this.addRoute('GET', path, handler);
    }

    public post(path: string, handler: RouteHandler) {
        this.addRoute('POST', path, handler);
    }

    public put(path: string, handler: RouteHandler) {
        this.addRoute('PUT', path, handler);
    }

    public delete(path: string, handler: RouteHandler) {
        this.addRoute('DELETE', path, handler);
    }

    public patch(path: string, handler: RouteHandler) {
        this.addRoute('PATCH', path, handler);
    }

    private matchRoute(method: string, path: string): { handler?: RouteHandler; params?: Record<string, string> } {
        const methodRoutes = this.routes[method];
        if (!methodRoutes) return {};

        for (const routePath in methodRoutes) {
            const paramsNames: string[] = [];
            const regexPath = routePath.replace(/:([^\/]+)/g, (_, key) => {
                paramsNames.push(key);
                return '([^/]+)';
            });

            const regex = new RegExp(`^${regexPath}$`);
            const match = path.match(regex);
            if (match) {
                const params: Record<string, string> = {};
                paramsNames.forEach((name, index) => {
                    params[name] = match[index + 1];
                });
                return { handler: methodRoutes[routePath], params };
            }
        }
        return {};
    }

    // Parse request body
    private async parseBody(req: IncomingMessage): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    resolve(body ? JSON.parse(body) : {});
                } catch (error) {
                    reject(new Error('Invalid JSON'));
                }
            });
            req.on('error', reject);
        });
    }

    // Helper method to parse cookies
    private parseCookies(cookieHeader: string | undefined): Record<string, string> {
        const cookies: Record<string, string> = {};
        if (!cookieHeader) return cookies;

        cookieHeader.split(';').forEach((cookie) => {
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
        if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`;
        if (options.expires) cookie += `; Expires=${options.expires.toUTCString()}`;
        if (options.path) cookie += `; Path=${options.path}`;
        if (options.domain) cookie += `; Domain=${options.domain}`;
        if (options.secure) cookie += '; Secure';
        if (options.httpOnly) cookie += '; HttpOnly';
        if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;
        return cookie;
    }

    // Extend response object
    private extendResponse(res: ServerResponse): ExtendedResponse {
        const extendedRes = res as ExtendedResponse;

        // Store headers and status code
        (extendedRes as any)._headers = {};
        (extendedRes as any)._statusCode = 200;

        // json method
        extendedRes.json = (data: any) => {
            if (res.headersSent) return;
            res.writeHead((extendedRes as any)._statusCode, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                ...(extendedRes as any)._headers,
            });
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
            const headers = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                ...(extendedRes as any)._headers,
            };
            if (typeof data === 'object' && data !== null) {
                headers['Content-Type'] = 'application/json';
                res.writeHead((extendedRes as any)._statusCode, headers);
                res.end(JSON.stringify(data));
            } else {
                headers['Content-Type'] = 'text/plain';
                res.writeHead((extendedRes as any)._statusCode, headers);
                res.end(String(data));
            }
        };

        // sendStatus method
        extendedRes.sendStatus = (code: number) => {
            extendedRes.status(code).send(ExpressPlus.STATUS_MESSAGES[code] || 'Unknown Status');
        };

        // redirect method
        extendedRes.redirect = (statusOrUrl: number | string, url?: string) => {
            if (res.headersSent) return;
            let status = 302;
            let redirectUrl: string;
            if (typeof statusOrUrl === 'string') {
                redirectUrl = statusOrUrl;
            } else {
                status = statusOrUrl;
                redirectUrl = url!;
            }
            res.writeHead(status, {
                'Location': redirectUrl,
                'Access-Control-Allow-Origin': '*',
                ...(extendedRes as any)._headers,
            });
            res.end();
        };

        // type method
        extendedRes.type = (contentType: string) => {
            const mimeTypes: Record<string, string> = {
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
            (extendedRes as any)._headers['Content-Type'] = mimeTypes[contentType] || contentType;
            return extendedRes;
        };

        // set method
        extendedRes.set = (field: string | Record<string, string>, value?: string) => {
            if (typeof field === 'string' && value !== undefined) {
                (extendedRes as any)._headers[field] = value;
            } else if (typeof field === 'object') {
                Object.assign((extendedRes as any)._headers, field);
            }
            return extendedRes;
        };

        // get method
        extendedRes.get = (field: string) => {
            return (extendedRes as any)._headers[field] || res.getHeader(field);
        };

        // clearCookie method
        extendedRes.clearCookie = (name: string, options: any = {}) => {
            const clearOptions = { ...options, expires: new Date(1), maxAge: 0 };
            const cookieString = this.serializeCookie(name, '', clearOptions);
            const existingCookiesHeader = res.getHeader('Set-Cookie');

            // Ensure 'cookies' is always a string array
            let cookies: string[] = [];
            if (Array.isArray(existingCookiesHeader)) {
                cookies = existingCookiesHeader;
            } else if (existingCookiesHeader) {
                // Coerce to string if it's a number or string
                cookies = [String(existingCookiesHeader)];
            }

            cookies.push(cookieString);
            res.setHeader('Set-Cookie', cookies); // No more error!
            return extendedRes;
        };

        return extendedRes;
    }

    public listen(port: number, callback?: () => void) {
        const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
            // Handle CORS preflight requests
            if (req.method === 'OPTIONS') {
                res.writeHead(200, {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                });
                res.end();
                return;
            }

            const method = req.method || 'GET';
            const url = parse(req.url || '', true);
            const path = url.pathname || '';
            const extendedReq = req as ExtendedRequest;
            const extendedRes = this.extendResponse(res);

            try {
                // Parse body for POST, PUT, PATCH
                if (['POST', 'PUT', 'PATCH'].includes(method)) {
                    extendedReq.body = await this.parseBody(req);
                } else {
                    extendedReq.body = {};
                }

                // Set query and params
                extendedReq.query = url.query;
                const { handler, params } = this.matchRoute(method, path);
                extendedReq.params = params;

                // Run middleware
                for (const middleware of this.middleware) {
                    await new Promise<void>((resolve, reject) => {
                        middleware(extendedReq, extendedRes, (err?: any) => (err ? reject(err) : resolve()));
                    });
                }

                if (handler) {
                    await handler(extendedReq, extendedRes);
                } else {
                    extendedRes.status(404).json({ success: false, error: 'Not Found' });
                }
            } catch (error) {
                console.error('Handler error:', error);
                if (!res.headersSent) {
                    extendedRes.status(500).json({ success: false, error: 'Internal Server Error' });
                }
            }
        });

        server.listen(port, callback);
        return server;
    }
}

export default ExpressPlus;