const express = require('express')
const { ZodError } = require('zod')

const { TaskController } = require('./TaskController')
const { TaskRepository, schemaAddTask, schemaUpdateStatusTask, schemaTaskId } = require('./TaskModel')

const taskRepository = new TaskRepository()
const taskController = new TaskController(taskRepository)
const taskRouter = express()

taskRouter.get('/', taskController.getTasks)
taskRouter.post('/', withValidator(schemaAddTask), taskController.createTask)
taskRouter.delete('/:id', withValidator(schemaTaskId, true), taskController.deleteTask)
taskRouter.put('/:id', withValidator(schemaUpdateStatusTask), withValidator(schemaTaskId, true), taskController.updateTask)


function withValidator(schema, isParams = false) {
    return (req, res, next) => {
        try {
            if (isParams) {
                schema.parse(req.params.id)
            } else {
                schema.parse(req.body)
            }
            next()
        } catch (error) {
            if (error instanceof ZodError) {
                const issues = error.errors.map(({ path, message }) => ({ path, message }))
                res.status(400).json({
                    code: "validation_error",
                    issues,
                })
            } else {
                next(error)
            }
        }
    }
}

module.exports = taskRouter