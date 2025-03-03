const { createServer, STATUS_CODES } = require('node:http')
const { randomUUID } = require('node:crypto')

const server = createServer()

let Tasks = [
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
                    (() => {
                        const chunks = []
                        req.on('data', (chunk) => {
                            chunks.push(chunk)
                        })
                        req.on('error', (err) => {
                            console.log('error : ', err)
                        })
                        req.on('end', () => {
                            const jsonRaw = Buffer.concat(chunks).toString()
                            const { title } = JSON.parse(jsonRaw)

                            if (title === undefined || title < 3) {
                                const badRequest = JSON.stringify({
                                    status: STATUS_CODES[400],
                                    message: "Title is required and must be grather than 3"
                                })
                                res.writeHead(400, { 'content-type': 'application/json', 'content-length': badRequest.length })
                                res.write(badRequest)
                                res.end()
                                return
                            }

                            const newTask = { id: randomUUID(), title: title, status: "todo" }
                            Tasks.push(newTask)

                            const newTaskJson = JSON.stringify(newTask)
                            res.writeHead(201, { 'content-type': 'application/json', 'content-length': newTaskJson.length })
                            res.write(newTaskJson)
                            res.end()
                        })
                    })()
                    break
                case 'DELETE':
                    (() => {
                        const chunks = []
                        req.on('data', (chunk) => {
                            chunks.push(chunk)
                        })
                        req.on('error', (err) => {
                            console.log('error : ', err)
                        })
                        req.on('end', () => {
                            const jsonRaw = Buffer.concat(chunks).toString()
                            const { id } = JSON.parse(jsonRaw)

                            if (!id) {
                                const badRequest = JSON.stringify({
                                    status: STATUS_CODES[400],
                                    message: "id is required"
                                })
                                res.writeHead(400, { 'Content-Type': 'application/json' })
                                res.write(badRequest)
                                res.end()
                                return
                            }

                            const taskIndex = Tasks.findIndex((task) => task.id === id)

                            if (taskIndex < 0) {
                                const notFound = JSON.stringify({
                                    status: STATUS_CODES[404],
                                    message: "Task not found"
                                })
                                res.writeHead(404, { 'Content-Type': 'application/json' })
                                res.write(notFound)
                                res.end()
                                return
                            }

                            // Simpan task sebelum dihapus
                            const deletedTask = Tasks[taskIndex]

                            // Hapus task dari array
                            Tasks.splice(taskIndex, 1)

                            const responseJson = JSON.stringify(deletedTask)
                            res.writeHead(200, { 'Content-Type': 'application/json' })
                            res.write(responseJson)
                            res.end()
                        })
                    })()
                    break

                case 'PUT':
                    (() => {
                        const chunks = []
                        req.on('data', (chunk) => {
                            chunks.push(chunk)
                        })
                        req.on('error', (err) => {
                            console.log('error : ', err)
                        })
                        req.on('end', () => {
                            const jsonRaw = Buffer.concat(chunks).toString()
                            const { id, status } = JSON.parse(jsonRaw)

                            if (id === undefined) {
                                const badRequest = JSON.stringify({
                                    status: STATUS_CODES[400],
                                    message: "id is required"
                                })
                                res.writeHead(400, { 'content-type': 'application/json', 'content-length': badRequest.length })
                                res.write(badRequest)
                                res.end()
                                return
                            }

                            if (status === undefined) {
                                const badRequest = JSON.stringify({
                                    status: STATUS_CODES[400],
                                    message: "status is required"
                                })
                                res.writeHead(400, { 'content-type': 'application/json', 'content-length': badRequest.length })
                                res.write(badRequest)
                                res.end()
                                return
                            }

                            const index = Tasks.findIndex((task) => task.id === id)

                            if (index < 0) {
                                res.writeHead(400, { 'content-type': 'application/json', 'content-length': badRequest.length })
                                res.write(badRequest)
                                res.end()
                                return
                            }

                            Tasks[index].status = status

                            const newTaskJson = JSON.stringify(Tasks[index])
                            res.writeHead(200, { 'content-type': 'application/json', 'content-length': newTaskJson.length })
                            res.write(newTaskJson)
                            res.end()
                        })
                    })()
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