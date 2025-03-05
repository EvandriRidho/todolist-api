const { createServer, STATUS_CODES } = require('node:http')
const { TaskController } = require('./TaskController')

const server = createServer()


const taskController = new TaskController()


server.on('request', (req, res) => {
    const { method, url } = req
    switch (url) {
        case '/api/v1/tasks':
            switch (method) {
                case 'GET':
                    taskController.getTasks(req, res)
                    break
                case 'POST':
                    taskController.createTask(req, res)
                    break
                case 'DELETE':
                    taskController.deleteTask(req, res)
                    break
                case 'PUT':
                    taskController.updateTask(req, res)
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
            res.write()
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