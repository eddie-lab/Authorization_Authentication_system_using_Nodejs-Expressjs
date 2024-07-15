const mongoose = require('mongoose')

require('dotenv').config()  //load enviroment variable from .env file


exports.connect = () =>{
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() =>
        console.log('connected to MongoDB'))
        .catch((err) => {
        console.log('failed to connect to mongoDB')
        process.exit(1)
    })
}




