const { STATUS_CODES } = require('node:http')


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
        const newTask = this.#repo.add(title)
        res.json(newTask).status(201)
    }

    deleteTask = (req, res) => {
        const { id } = req.params
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