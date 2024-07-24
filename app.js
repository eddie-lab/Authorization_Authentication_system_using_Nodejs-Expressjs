const express =  require('express')
const app = express()
app.use(express.json())    //middlewre parsing


require('./config/database').connect()   //database connection
require('dotenv').config()
const PORT = process.env.PORT || 4000


// route importing and mounting
const user = require('./routes/routes')
app.use('/api', user)




// start server
app.listen(PORT, ()=> {
    console.log("server is running on port 4000")
})