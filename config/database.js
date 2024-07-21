const mongoose = require('mongoose')

require('dotenv').config()  //load enviroment variable from .env file


exports.connect = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            autoIndex: true       
        })
        console.log('Connected to Mongodb Atlas');

    }catch (error){
        console.error(error);
    }

}


