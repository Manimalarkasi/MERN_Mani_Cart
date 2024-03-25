const mongoose = require('mongoose');

const connectDatabase = ()=>{
    mongoose.connect("mongodb://localhost:27017/manicart",{
        // useNewUrlParser:true,
        // useUnifideTopology:true,
    }).then((con)=>console.log(`Mongoo db is connected to the host: ${con.connection.host}`))
    .catch((err)=>console.log(err))
};

module.exports = connectDatabase;