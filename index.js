const express = require('express')
const taskRouter = require('./TaskRouter')
const morgan = require('morgan')


const logger = morgan(':method :url :status :res[content-length] :res[content-type] - :response-time ms')
const app = express()

app.use((err, req, res, next) => {
    console.error(err)
    res.json({ message: "Something went wrong" })
})


app.use(express.json())
app.use(logger)
app.use('/api/v1/tasks', taskRouter)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})