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
}

export class ExpressPlus {
    private routes: { [method: string]: { [path: string]: Function } } = {}

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

    // Extend response object with Express-like methods
    private extendResponse(res: ServerResponse): ExtendedResponse {
        const extendedRes = res as ExtendedResponse;

        // Current status code
        let statusCode = 200;

        // json method
        extendedRes.json = (data: any) => {
            res.writeHead(statusCode, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
            res.end(JSON.stringify(data));
        };

        // status method
        extendedRes.status = (code: number) => {
            statusCode = code;
            return extendedRes;
        };

        // send method
        extendedRes.send = (data: any) => {
            if (typeof data === 'object') {
                extendedRes.json(data);
            } else {
                res.writeHead(statusCode, {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(String(data));
            }
        };

        return extendedRes;
    }

    public listen(port: number, callback?: () => void) {
        const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
            const method = req.method || 'GET'
            const url = parse(req.url || '', true)
            const path = url.pathname || ''

            const { handler, params } = this.matchRoute(method, path)

            if (handler) {
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

                // Call handler
                handler(extendedReq, extendedRes);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            }
        });

        server.listen(port, callback);
    }
}



export default ExpressPlus;