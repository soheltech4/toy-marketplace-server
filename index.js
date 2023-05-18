const express = require('express')
const app = express()
const port = process.env.PORT  || 5000

app.get('/', (req, res)=>{
    res.send('Baby is playing with Toy world')
})

app.listen(port, ()=>{
    console.log('Toy-world server is running')
})