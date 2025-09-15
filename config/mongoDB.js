const mongoose = require("mongoose");

const connectionDB = async()=>{
    try {
        await await mongoose.connect(process.env.MONGODB_URL,{
            // useNewUrlParser:true,
            // useUnifiedTopology:true
        });
        console.log(`MongoDB connected Successfully`)
        
    } catch (error) {
        console.error("Error MongoDB connection",error.message);
        process.exit(1);
    }
}
module.exports = connectionDB;