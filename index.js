const express = require("express");
const axios = require("axios");
const fs = require("fs");
const sharp = require("sharp");


const PORT = 4000;
const UNSPLASH_ACCESS_KEY = "W_INMxItvk3N0Pv90HHeIe1mdpcBRwQVbaYeOhWHGLY";


const app = express();

app.use(express.json());

app.get("/random-image",async (req,res)=>{
    try{
        const url = 'https://api.unsplash.com/'
        const resp = await axios({
            method : "get",
            url : `${url}photos/random`,
            headers : {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });

        // console.log(resp);
        const imageUrl = resp.data.urls.full;  //final url
        console.log(imageUrl);

        const imageData = await axios({
            method:"get",
            url : imageUrl,
            responseType: 'arraybuffer'
        })

        // console.log((imageData));


        // res.set({
        //     'Content-Type': 'image/png',
        //     'Content-Length': reSizeImg.data.length
        // });


        const reSizeImg = await sharp(imageData.data).resize({
            height: 200,
            width: 250,
        })
        .toBuffer()

        
        res.setHeader("Content-Type" , "image/jpeg")
        // res.send(reSizeImg)

        res.status(200).send(reSizeImg);

        // res.status(200).json({
        //     image : imageUrl.split("?crop")[0],

        // })

    }catch(error){
        console.log(error);
        res.status(500).json({
            message : 'internal server error occured'
        })
    }
});

app.listen(PORT,()=>{
    console.log(`server up and running at ${PORT}`);
})