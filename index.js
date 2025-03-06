const express = require('express')
const taskRouter = require('./TaskRouter')

const app = express()


app.use(express.json())
app.use('/api/v1/tasks', taskRouter)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})