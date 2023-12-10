const mongoose= require("mongoose");

const taskSchema=mongoose.Schema({
    title:{
        type:"String",
        required:true
    },
    description:{
        type:"String",
        default:"Nothing Entered yet"
    },
    status:{
        type:"String",
        default:"Not Completed"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model("tasks",taskSchema);