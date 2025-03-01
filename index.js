const { createServer } = require('node:http')

const server = createServer()

const jsonMessage = JSON.stringify({ message: 'Hello World' })
const jsonNotFound = JSON.stringify({})

server.on('request', (req, res) => {
    const { method, url } = req
    console.debug('Received request', method, url)

    switch (url) {
        case '/':
            res.writeHead(200, { 'Content-Type': 'text/plain', 'Content-Length': Buffer.byteLength(jsonMessage) })
            res.end(jsonMessage)
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
    console.error('Server error', error)
})

server.on('connection', (socket) => {
    const { remoteAddress, remotePort } = socket
    console.log(`Connection from ${remoteAddress}:${remotePort}`)
})


const handleShutdown = (signal) => {
    console.log('Started Shutdown Server', { signal })
    server.close((error) => {
        console.error('Error closing server', error)
    })
    console.log('Shutdown Server Complete', { signal })
}

process.addListener('SIGINT', handleShutdown)
process.addListener('SIGTERM', handleShutdown)



const PORT = process.env.PORT || 3000
server.listen(PORT, 'localhost', () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
