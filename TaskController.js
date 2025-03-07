const { STATUS_CODES } = require('node:http')
const { TaskRepository } = require('./TaskModel')


class TaskController {
    #repo
    constructor(taskRepository) {
        this.#repo = taskRepository
    }

    getTasks = (_, res) => {
        res.json(this.#repo.all()).status(200)
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
        const newTask = this.#repo.add(title)
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
        const { ok, data } = this.#repo.deleteById(id)
        if (!ok) {
            res.json({
                status: STATUS_CODES[404],
                message: "Task not found"
            }).status(404)
            return
        }
        res.json(data).status(200)
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
        const { ok, data } = this.#repo.updateStatus(id, status)
        if (!ok) {
            res.json({
                status: STATUS_CODES[404],
                message: "Task not found"
            }).status(404)
            return
        }
        res.json(data).status(200)
    }
}

module.exports = { TaskController }