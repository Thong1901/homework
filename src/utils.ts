import { createServer } from 'node:http'

// Math functions
export function sum(...numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((acc, num) => acc + num, 0);
}

export function sub(first: number, ...rest: number[]): number {
    if (rest.length === 0) return first;
    return rest.reduce((acc, num) => acc - num, first);
}

export function mul(number: number, ...rest: number[]): number {
    if (rest.length === 0) return number;
    return rest.reduce((acc, num) => acc * num, number);
}

export function div(first: number, ...rest: number[]): number {
    if (rest.length === 0) return first;

    // Check for division by zero
    if (rest.some(num => num === 0)) {
        throw new Error("Division by zero is not allowed");
    }

    return rest.reduce((acc, num) => acc / num, first);
}

const Mylib = { sum, sub, mul, div };

export const server = createServer((req, res) => {
    const url = req.url || '/'
    const method = req.method || 'GET'

    // Tạo hàm gửi
    function sendJSON(statusCode: number, success: boolean, message: string, data: any = null) {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' })
        const response = { success, status: statusCode, message, data: null }
        if (data !== null) response.data = data

        // kết thúc lệnh trả về
        res.end(JSON.stringify(response))
    }

    if (method === 'GET') {
        if (url === '/') sendJSON(200, true, 'Welcome to the Math API Server')
        else if (url === '/sum') sendJSON(200, true, 'Sum operation endpoint - POST numbers array')
        else if (url === '/sub') sendJSON(200, true, 'Subtract operation endpoint - POST numbers array')
        else if (url === '/mul') sendJSON(200, true, 'Multiply operation endpoint - POST numbers array')
        else if (url === '/div') sendJSON(200, true, 'Divide operation endpoint - POST numbers array')
        else if (url === '/info') {
            sendJSON(200, true, 'API Information', {
                endpoints: ['/sum', '/sub', '/mul', '/div'],
                methods: ['GET (info)', 'POST (calculate)'],
                format: 'POST with [1,2,3] or {"data": [1,2,3]}'
            })
        }
        else sendJSON(404, false, 'Endpoint not found')
    }
    else if (method === 'POST') {
        if (url === '/sum' || url === '/sub' || url === '/mul' || url === '/div') {
            let body = ''

            // Lấy data
            req.on('data', chunk => {
                body += chunk.toString()
            })

            req.on('end', () => {
                try {
                    const payload = JSON.parse(body)

                    // chấp nhận: [1,2,3] hoặc { "data": [1,2,3] }
                    const numbers = Array.isArray(payload) ? payload : payload?.data

                    if (!Array.isArray(numbers)) {
                        sendJSON(400, false, 'Invalid data: expected array [1,2,3] or {"data": [1,2,3]}')
                        return
                    }
                    if (numbers.length === 0) {
                        sendJSON(400, false, 'Array cannot be empty')
                        return
                    }
                    if (numbers.some(item => typeof item !== 'number' || isNaN(item))) {
                        sendJSON(400, false, 'Invalid data: all items must be valid numbers')
                        return
                    }

                    let result: number
                    let operation: string
                    try {
                        switch (url) {
                            case '/sum':
                                result = Mylib.sum.apply(null, numbers)
                                operation = 'Sum'
                                break
                            case '/sub':
                                if (numbers.length === 0) throw new Error("At least one number is required")
                                const [firstSub, ...restSub] = numbers
                                result = Mylib.sub(firstSub, ...restSub)
                                operation = 'Subtraction'
                                break
                            case '/mul':
                                if (numbers.length === 0) throw new Error("At least one number is required")
                                const [firstMul, ...restMul] = numbers
                                result = Mylib.mul(firstMul, ...restMul)
                                operation = 'Multiplication'
                                break
                            case '/div':
                                if (numbers.length === 0) throw new Error("At least one number is required")
                                const [firstDiv, ...restDiv] = numbers
                                result = Mylib.div(firstDiv, ...restDiv)
                                operation = 'Division'
                                break
                            default:
                                sendJSON(404, false, 'Operation not found')
                                return
                        }

                        sendJSON(200, true, `${operation} calculated successfully`, {
                            result,
                            operation: operation.toLowerCase(),
                            input: numbers,
                            calculation: `${operation} of [${numbers.join(', ')}] = ${result}`
                        })

                    } catch (error) {
                        sendJSON(400, false, error instanceof Error ? error.message : 'Calculation error')
                    }

                } catch {
                    sendJSON(400, false, 'Invalid JSON format')
                }
            })
        }
        else if (url === '/') sendJSON(405, false, 'Cannot POST to root path. Use /sum, /sub, /mul, or /div')
        else sendJSON(404, false, 'Endpoint not found')
    }
    else {
        sendJSON(405, false, `Method ${method} not allowed. Use GET or POST`)
    }
})

// Export default
export default { server, sum, sub, mul, div, Mylib }

// Start server helper
export function startServer(port: number = 3000) {
    server.listen(port, () => {
        console.log(`🚀 Math API Server running on http://localhost:${port}`)
        console.log(`📚 Endpoints: GET|POST /sum /sub /mul /div`)
        console.log(`📖 Info: GET /info`)
        console.log(`💡 Usage: POST /sum with body [1,2,3] or {"data":[1,2,3]}`)
    })
    return server
}

// Auto start if run directly
if (require.main === module) {
    startServer(3000)
}