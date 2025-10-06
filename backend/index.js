const express=require ("express")
const cors=require("cors")
const nodemailer = require("nodemailer")
const mongoose=require("mongoose")

const app=express()

app.use(express.json())
app.use(cors())


mongoose.connect("mongodb+srv://sanjay:123@cluster0.dkucaqo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(function(){
    console.log("connection to DB")

}).catch(function(){
    console.log("failed to connect")
})

const credential=mongoose.model("credential",{},"bulkmail")


app.post("/sendemail",function(req,res){
    var msg=req.body.msg
    var emailsList=req.body.emailsList
    
    credential.find().then(function(data){
    const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user: data[0].toJSON().user,
    pass: data[0].toJSON().pass,
  }
})
 new Promise(async function(resolve,reject){
        try{
        for(var i=0;i<emailsList.length;i++)
    {
        await transporter.sendMail(
    {
        from:"gohanop25@gmail.com",
        to:emailsList[i],
        subject:"a message from bulk mail app",
        text:msg
    }
)
    console.log("email sent to:"+emailsList[i])
    }
    resolve("success")
}
catch(error)
{
    reject("failed")
}
        
    }).then(function(){
        res.send(true)
    }).catch(function(){
        res.send(false)
    })



}).catch(function(error){
    console.log(error)
})

})



app.listen(3000,function(){
    console.log("server started")
}) 