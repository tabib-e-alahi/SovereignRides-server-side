const express = require('express');
const app = require('app');
const port = process.env.PORT || 5000;



app.get('/', (req,res) =>{
    res.send("Brand Shop server is running successfully");
})

app.listen(port, () =>{
    console.log(`Server is running on port: ${port}`);
})