import { createServer } from 'node:http'

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

    public listen(port: number, callback?: () => void) {
        const server = createServer((req, res) => {
            const method = req.method || 'GET'
            const path = req.url || ''

            const routeHandler = this.routes[method]?.[path]
            if (routeHandler) {
                routeHandler(req, res)
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

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})

export default ExpressPlus