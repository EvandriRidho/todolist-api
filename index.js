const { createServer, STATUS_CODES } = require('node:http')
const { randomUUID } = require('node:crypto')

const server = createServer()

const Tasks = [
    {
        id: randomUUID(),
        title: 'Task A',
        status: 'todo',
    },
    {
        id: randomUUID(),
        title: 'Task B',
        status: 'todo',
    },
    {
        id: randomUUID(),
        title: 'Task C',
        status: 'todo',
    },
]

server.on('request', (req, res) => {
    const { method, url } = req
    switch (url) {
        case '/api/v1/tasks':
            switch (method) {
                case 'GET':
                    const jsonMessage = JSON.stringify(Tasks)
                    res.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': jsonMessage.length })
                    res.write(jsonMessage)
                    res.end()
                    break
                case 'POST':
                    const chunks = []
                    req.on('data', (chunk) => {
                        chunks.push(chunk)
                    })
                    req.on('error', (error) => {
                        console.log('Server Error', error)
                    })
                    req.on('end', () => {
                        const jsonRaw = Buffer.concat(chunks).toString()
                        const { title } = JSON.parse(jsonRaw)

                        if (title === undefined || title < 3) {
                            const badRequest = JSON.stringify({
                                status: STATUS_CODES[400],
                                message: "Title is required and must be grather than 3"
                            })
                            res.writeHead(400, { 'Content-Type': 'application/json', 'content-length': badRequest.length })
                            res.write(badRequest)
                            res.end()
                            return
                        }

                        const newTask = { id: randomUUID(), title: title, status: "todo" }
                        Tasks.push(newTask)

                        const newTaskJson = JSON.stringify(newTask)
                        res.writeHead(201, { 'Content-Type': 'application/json', 'content-length': newTaskJson.length })
                        res.write(newTaskJson)
                        res.end()
                    })
                    break
                case 'DELETE':
                    res.writeHead(501, { 'Content-Type': 'application/json' })
                    res.write(STATUS_CODES[501])
                    res.end()
                    break
                case 'PUT':
                    res.writeHead(501, { 'Content-Type': 'application/json' })
                    res.write(STATUS_CODES[501])
                    res.end()
                    break
                default:
                    res.writeHead(405, { 'Content-Type': 'application/json' })
                    res.write(STATUS_CODES[405])
                    res.end()
                    break
            }
            break
        default:
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end()
            break
    }
})

server.on('close', () => {
    console.log('Server closed')
    process.exit(0)
})

server.on('error', (error) => {
    if (error) {
        console.log('Server Error', error)
        process.exit(1)
    } else {
        process.exit(0)
    }
})

server.on('connection', (socket) => {
    const { remoteAddress, remotePort } = socket
    console.log(`Connection from ${remoteAddress}:${remotePort}`)
})

const handleShutdown = (signal) => {
    console.log('Started Shutdown Server', { signal })
    server.close((error) => {
        if (error) {
            console.error('Error closing server:', error)
            process.exit(1)
        } else {
            console.log('Shutdown Server Complete')
            process.exit(0)
        }
    })
    console.log('Shutdown Server Complete', { signal })
}

process.addListener('SIGINT', handleShutdown)
process.addListener('SIGTERM', handleShutdown)

const PORT = process.env.PORT || 3000
server.listen(PORT, 'localhost', () => {
    console.log(`Server running at http://localhost:${PORT}`)
})