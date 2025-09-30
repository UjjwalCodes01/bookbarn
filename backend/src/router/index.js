const {user} = require('../models/index');
const express = require('express');

const router = express.Router();

router.post('/post',async (req,res)=>{
    const body = req.body
    const data = await user.create({
        title: body.title,
        author: body.author,
        imgurl: body.imgurl
    })

     res.status(201).json(data);
})

router.get('/post', async(req,res)=>{
    const data = await user.find({})
    res.status(200).json(data)
})

module.exports = router