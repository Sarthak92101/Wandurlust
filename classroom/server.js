const express = require("express");
const app = express();

app.get("/",(req,res)=>{
  console.log("Hi,I am root")
})
app.listen (3000,()=>{
  console.log("Server is listeining to port 3000")
})