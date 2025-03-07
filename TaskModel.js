const { randomUUID } = require('node:crypto')
const { z } = require('zod')

const schemaAddTask = z.object({
    title: z.string().min(3)
})

const schemaUpdateStatusTask = z.object({
    status: z.enum(['todo', 'onprogress', 'done'])
})

const schemaTaskId = z.object({
    id: z.string().uuid()
})


class TaskRepository {
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

    all = () => this.#tasks

    add = (title) => {
        const newTask = { id: randomUUID(), title: title, status: "todo" }
        this.#tasks.push(newTask)
        return newTask
    }

    deleteById = (id) => {
        const taskIndex = this.#tasks.findIndex((task) => task.id === id)
        if (taskIndex === -1) {
            return { ok: false, data: null }
        }
        const deletedTask = this.#tasks[taskIndex]
        this.#tasks.splice(taskIndex, 1)
        return { ok: true, data: deletedTask }
    }

    updateStatus = (id, status) => {
        const index = this.#tasks.findIndex((task) => task.id === id)
        if (index === -1) {
            return { ok: false, data: null }
        }
        this.#tasks[index].status = status
        return { ok: true, data: this.#tasks[index] }
    }
}

module.exports = { TaskRepository, schemaAddTask, schemaUpdateStatusTask, schemaTaskId }