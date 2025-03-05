const { randomUUID } = require('node:crypto')

class TaskController {
    #tasks = [
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

    #sendJson = (res, code, data) => {
        const jsonMessage = JSON.stringify(data)
        res.writeHead(code, { 'Content-Type': 'application/json', 'Content-Length': jsonMessage.length })
        res.write(jsonMessage)
        res.end()
    }

    #ondata = (req, onendCallback) => {
        const chunks = []
        req.on('data', (chunk) => {
            chunks.push(chunk)
        })
        req.on('error', (err) => {
            console.log('error : ', err)
        })
        req.on('end', () => {
            const jsonRaw = Buffer.concat(chunks).toString()
            const decode = JSON.parse(jsonRaw)
            onendCallback(decode)
        })
    }

    getTasks = (_, res) => {
        this.#sendJson(res, 200, this.#tasks)
    }

    createTask = (req, res) => {
        this.#ondata(req, (data) => {
            const { title } = data
            if (title === undefined || title < 3) {
                this.#sendJson(res, 400, {
                    status: STATUS_CODES[400],
                    message: "Title is required and must be grather than 3"
                })
                return
            }
            const newTask = { id: randomUUID(), title: title, status: "todo" }
            this.#tasks.push(newTask)

            this.#sendJson(res, 201, newTask)
        })
    }

    deleteTask = (req, res) => {
        this.#ondata(req, (data) => {
            const { id } = data
            if (id === undefined) {
                this.#sendJson(res, 400, {
                    status: STATUS_CODES[400],
                    message: "id is required"
                })
                return
            }

            const taskIndex = this.#tasks.findIndex((task) => task.id === id)

            if (taskIndex < 0) {
                this.#sendJson(res, 404, {
                    status: STATUS_CODES[404],
                    message: "Task not found"
                })
                return
            }

            const deletedTask = this.#tasks[taskIndex]
            this.#tasks.splice(taskIndex, 1)

            this.#sendJson(res, 200, deletedTask)
        })
    }

    updateTask = (req, res) => {
        this.#ondata(req, (data) => {
            const { id, status } = data
            if (id === undefined) {
                this.#sendJson(res, 400, {
                    status: STATUS_CODES[400],
                    message: "id is required"
                })
                return
            }

            if (status === undefined) {
                this.#sendJson(res, 400, {
                    status: STATUS_CODES[400],
                    message: "status is required"
                })
                return
            }

            const index = this.#tasks.findIndex((task) => task.id === id)

            if (index < 0) {
                this.#sendJson(res, 404, {
                    status: STATUS_CODES[404],
                    message: "Task not found"
                })
                return
            }

            this.#tasks[index].status = status

            this.#sendJson(res, 200, this.#tasks[index])
        })
    }
}

module.exports = { TaskController }