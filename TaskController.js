const { randomUUID } = require('node:crypto')
const { STATUS_CODES } = require('node:http')

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

    getTasks = (_, res) => {
        res.json(this.#tasks).status(200)
    }

    createTask = (req, res) => {
        const { title } = req.body
        if (title === undefined || title.length < 3) {
            res.json({
                status: STATUS_CODES[400],
                message: 'Title must be at least 3 characters'
            }).status(400)
            return
        }
        const newTask = { id: randomUUID(), title: title, status: "todo" }
        this.#tasks.push(newTask)
        res.json(newTask).status(201)
    }

    deleteTask = (req, res) => {
        const { id } = req.params
        if (id === undefined) {
            res.json({
                status: STATUS_CODES[400],
                message: "id is required"
            }).status(400)
            return
        }
        const taskIndex = this.#tasks.findIndex((task) => task.id === id)
        if (taskIndex < 0) {
            res.json({
                status: STATUS_CODES[404],
                message: "Task not found"
            }).status(404)
            return
        }
        const deletedTask = this.#tasks[taskIndex]
        this.#tasks.splice(taskIndex, 1)
        res.json(deletedTask).status(200)
    }

    updateTask = (req, res) => {
        const { id } = req.params
        const { status } = req.body

        if (id === undefined) {
            res.json({
                status: STATUS_CODES[400],
                message: "id is required"
            }).status(400)
            return
        }
        if (status === undefined) {
            res.json({
                status: STATUS_CODES[400],
                message: "Status is required"
            }).status(400)
            return
        }
        const index = this.#tasks.findIndex((task) => task.id === id)
        if (index < 0) {
            res.json({
                status: STATUS_CODES[404],
                message: "Task not found"
            }).status(404)
            return
        }
        this.#tasks[index].status = status
        res.json(this.#tasks[index]).status(200)
    }
}

module.exports = { TaskController }