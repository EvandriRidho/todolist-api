const express = require('express')
const { TaskController } = require('./TaskController')

const app = express()
const taskController = new TaskController()

app.use(express.json())



app.get('/api/v1/tasks', taskController.getTasks)
app.post('/api/v1/tasks', taskController.createTask)
app.delete('/api/v1/tasks', taskController.deleteTask)
app.put('/api/v1/tasks', taskController.updateTask)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})