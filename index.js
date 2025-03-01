const { createServer } = require('node:http')

const server = createServer((req, res) => {
    const jsonData = JSON.stringify({ message: 'Hello World' })
    res.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(jsonData) })
    res.end(jsonData)
})

const PORT = 3000;
server.listen(PORT, 'localhost', () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
