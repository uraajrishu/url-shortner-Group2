const urlModel = require("../Model/urlModel.js")
//var shortUrl = require("node-url-shortener");
const validUrl = require('valid-url')
const shortid = require('shortid')

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null)
        return false
    if (typeof value === 'string' && value.trim().length === 0)
        return false
    return true
}

const urlShorten = async function (req, res){
    
     try{   
         let requestBody = req.body;

        if(!isValidRequestBody(requestBody)){
            return res.status(400).send({status:false, message:"please fill request body"})

        }
        let longurl = req.body.longUrl

        const baseUrl = 'http:localhost:3000'
        if (!validUrl.isUri(baseUrl)) {
            return res.status(401).send({status:false, message:"invalid baseurl"})
        }
        if(!isValid(longurl))
        {
            return res.status(401).send({status:false, message:"invalid longUrl"})
        }
         longurl = longurl.toLowerCase().trim();
         if (validUrl.isUri(longurl)){
        let urlCode = shortid.generate()
         urlCode= urlCode.toLowerCase().trim();
        const shortUrl = baseUrl + '/' + urlCode
        const details={
         longUrl:req.body.longUrl, 
        shortUrl:shortUrl,
        urlCode:urlCode  
        }
        console.log(details)
    let urlCreate = await urlModel.create(details)   
    console.log(urlCreate)
    // let url = await urlModel.findOne({ 
    //     requestBody})
    // if(url){
    //     return res.status(200).send({status:true,date:url})
    // }
        return res.status(200).send({data:urlCreate})
    

        }
else {
    res.status(401).send({status:false, message:"This Longurl is invalid"})
}

     }

catch (err) {
    console.log(err)
    res.status(500).json('Server Error')
}

}



const getCode = async function(req, res){
   try{
        let urlcode = req.params.url

        console.log(urlcode)
    // if (!validUrl.isUri(urlcode)){

    //     return res.status(400).send({status:false, message:"Invalid urlCode"})
    // }
let codeExist = await urlModel.findOne({urlCode:urlcode})
if(!codeExist){
    return res.status(404).send({status:false, message:"urlCode not exist"})
}

return res.redirect(codeExist.longUrl)

}


catch (err) {
    console.log(err)
    res.status(500).json('Server Error')
}

}

 module.exports ={urlShorten, getCode}