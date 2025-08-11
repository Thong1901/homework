import { createServer, IncomingMessage, ServerResponse } from 'node:http'
import { parse } from 'node:url'

// MathUtils class implementation
class MathUtils {
    private routes: { [method: string]: { [path: string]: Function } } = {}

    constructor() {
        this.routes = {
            'GET': {},
            'POST': {},
            'PUT': {},
            'DELETE': {},
            'PATCH': {}
        }
        this.registerOperations()
    }

    private registerOperations() {
        this.get('/sum', this.sum.bind(this))
        this.post('/sum', this.sum.bind(this))
        this.put('/sum', this.sum.bind(this))
        this.delete('/sum', this.sum.bind(this))
        this.patch('/sum', this.sum.bind(this))

        this.get('/sub', this.sub.bind(this))
        this.post('/sub', this.sub.bind(this))
        this.put('/sub', this.sub.bind(this))
        this.delete('/sub', this.sub.bind(this))
        this.patch('/sub', this.sub.bind(this))

        this.get('/mul', this.mul.bind(this))
        this.post('/mul', this.mul.bind(this))
        this.put('/mul', this.mul.bind(this))
        this.delete('/mul', this.mul.bind(this))
        this.patch('/mul', this.mul.bind(this))

        this.get('/div', this.div.bind(this))
        this.post('/div', this.div.bind(this))
        this.put('/div', this.div.bind(this))
        this.delete('/div', this.div.bind(this))
        this.patch('/div', this.div.bind(this))

        this.get('/mod', this.mod.bind(this))
        this.post('/mod', this.mod.bind(this))
        this.put('/mod', this.mod.bind(this))
        this.delete('/mod', this.mod.bind(this))
        this.patch('/mod', this.mod.bind(this))
    }

    private sum(...numbers: number[]): number {
        if (numbers.length === 0) return 0
        return numbers.reduce((acc, num) => acc + num, 0)
    }

    private sub(first: number, ...rest: number[]): number {
        if (rest.length === 0) return first
        return rest.reduce((acc, num) => acc - num, first)
    }

    private mul(number: number, ...rest: number[]): number {
        if (rest.length === 0) return number
        return rest.reduce((acc, num) => acc * num, number)
    }

    private div(first: number, ...rest: number[]): number {
        if (rest.length === 0) return first
        if (rest.some(num => num === 0)) {
            throw new Error("Division by zero is not allowed")
        }
        return rest.reduce((acc, num) => acc / num, first)
    }

    private mod(first: number, ...rest: number[]): number {
        if (rest.length === 0) return first
        return rest.reduce((acc, num) => acc % num, first)
    }

    private addRoute(method: string, path: string, handler: Function) {
        this.routes[method][path] = handler
    }

    public get(path: string, handler: Function): void;
    public get(path: string, ...numbers: number[]): number;
    public get(path: string, ...args: any[]): any {
        if (args.length === 1 && typeof args[0] === 'function') {
            this.addRoute('GET', path, args[0])
            return
        }
        return this.routes['GET'][path](...args)
    }

    public post(path: string, handler: Function): void;
    public post(path: string, ...numbers: number[]): number;
    public post(path: string, ...args: any[]): any {
        if (args.length === 1 && typeof args[0] === 'function') {
            this.addRoute('POST', path, args[0])
            return
        }
        return this.routes['POST'][path](...args)
    }

    public put(path: string, handler: Function): void;
    public put(path: string, ...numbers: number[]): number;
    public put(path: string, ...args: any[]): any {
        if (args.length === 1 && typeof args[0] === 'function') {
            this.addRoute('PUT', path, args[0])
            return
        }
        return this.routes['PUT'][path](...args)
    }

    public delete(path: string, handler: Function): void;
    public delete(path: string, ...numbers: number[]): number;
    public delete(path: string, ...args: any[]): any {
        if (args.length === 1 && typeof args[0] === 'function') {
            this.addRoute('DELETE', path, args[0])
            return
        }
        return this.routes['DELETE'][path](...args)
    }

    public patch(path: string, handler: Function): void;
    public patch(path: string, ...numbers: number[]): number;
    public patch(path: string, ...args: any[]): any {
        if (args.length === 1 && typeof args[0] === 'function') {
            this.addRoute('PATCH', path, args[0])
            return
        }
        return this.routes['PATCH'][path](...args)
    }
}

// Create singleton instance of MathUtils

// ExpressPlus class implementation
class ExpressPlus {
    private routes: { [method: string]: { [path: string]: Function } } = {}

    private addRoute(method: string, path: string, handler: Function) {
        this.routes[method] = this.routes[method] || {}
        this.routes[method][path] = handler
    }

    public get(path: string, handler: Function) {
        this.addRoute('GET', path, handler)
    }
    public post(path: string, handler: Function) {
        this.addRoute('POST', path, handler)
    }
    public put(path: string, handler: Function) {
        this.addRoute('PUT', path, handler)
    }
    public delete(path: string, handler: Function) {
        this.addRoute('DELETE', path, handler)
    }
    public patch(path: string, handler: Function) {
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
    public listen(port: number, callback?: () => void) {
        const server = createServer((req: IncomingMessage & { params?: any }, res: ServerResponse) => {
            const method = req.method || 'GET'
            const url = parse(req.url || '', true)
            const path = url.pathname || ''

            const { handler, params } = this.matchRoute(method, path)

            if (handler) {
                req.params = params
                handler(req, res)
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' })
                res.end('Not Found')
            }
        })

        server.listen(port, callback)
    }
}

const app = new ExpressPlus()

app.get('/users', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ user: [] }))
})

app.post('/users', (req, res) => {
    res.writeHead(201, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'User created' }))
})
app.put('/users/:id', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'User updated' }))
})
app.patch('/users/:id', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'User patched' }))
})
app.delete('/users/:id', (req, res) => {
    res.writeHead(204)
    res.end()
})

const mathUtils = new MathUtils();

export default { ExpressPlus, mathUtils };