const express =  require('express')
const app = express()





// Middleware to parse JSON bodies
app.use(express.json())


app.get('/', (req,res) =>{
    res.json('hello capitan')
})





// start server
app.listen(3000, ()=> {
    console.log(`server is running on port 3000`)
})