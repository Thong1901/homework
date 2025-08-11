import { createServer, IncomingMessage, ServerResponse } from 'node:http'
import { parse } from 'node:url'

export class ExpressPlus {
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

app.get('/users', (req: IncomingMessage & { params?: any }, res: ServerResponse) => {
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
export default ExpressPlus;