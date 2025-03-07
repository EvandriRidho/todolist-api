const express = require('express')
const { TaskController } = require('./TaskController')
const { TaskRepository } = require('./TaskModel')

const taskRepository = new TaskRepository()
const taskController = new TaskController(taskRepository)
const taskRouter = express()

taskRouter.get('/', taskController.getTasks)
taskRouter.post('/', taskController.createTask)
taskRouter.delete('/:id', taskController.deleteTask)
taskRouter.put('/:id', taskController.updateTask)

module.exports = taskRouter