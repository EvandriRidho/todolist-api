const { createServer, STATUS_CODES } = require('node:http')
const { randomUUID } = require('node:crypto')

const server = createServer()

const jsonNotFound = JSON.stringify({})
const task = [
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
    console.debug('Received request', method, url)

    switch (url) {
        case '/api/v1/tasks':
            switch (method) {
                case 'GET':
                    const jsonMessage = JSON.stringify(task)
                    res.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': jsonMessage.length })
                    res.write(jsonMessage)
                    res.end()
                    break
                case 'POST':
                    res.writeHead(501, { 'Content-Type': 'application/json' })
                    res.write(STATUS_CODES[501])
                    res.end()
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
            res.writeHead(404, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(jsonNotFound) })
            res.end(jsonNotFound)
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