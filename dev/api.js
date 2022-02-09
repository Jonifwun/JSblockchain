const express = require('express')
const bodyParser = require ('body-parser')

const app = express()

app.get('/blockchain', (req, res) => {
    
})

app.post('/transaction', (req, res) => {

})

app.get('/mine', (req, res) => {

})

app.listen(3000, () => {
    console.log(`app is listening on port ${3000}`)
})