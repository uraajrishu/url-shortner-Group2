const urlModel = require("../model/urlModel");
const nanoid = require("nanoid");
const redis=require("redis");
const { promisify } = require("util");


//Connect to redis

const redisClient = redis.createClient(

    11462,

    "redis-11462.c212.ap-south-1-1.ec2.cloud.redislabs.com",

    { no_ready_check: true }
);

redisClient.auth("xjU9XDj5BdBdOulNzHfeHjq9RonLG4vO", function (err) {

    if (err) throw err;

});

redisClient.on("connect", async function () {

console.log("Connected to Redis..");

});

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const validUrl = (value) => {
    if (!(/(ftp|http|https|FTP|HTTP|HTTPS):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(value.trim()))) {
        return false
    }
        return true
}


// createShortUrl 

const urlShorten = async (req, res) => {
try {
    const baseUrl = "http://localhost:3000";
    
    if (Object.entries(req.body).length == 0 || Object.entries(req.body).length > 1) {
        return res.status(400).send({ status: false, Message: "Invalid Request Params" });
    }

    if(!req.body.hasOwnProperty('longUrl')) {
        return res.status(400).send({ Status: false, Message: "Wrong Key Present" })
    }
    
    const { longUrl } = req.body;
    //wih The help of Object distucturing we can store the Ojects proporties in a Distinct Variable

    if(!longUrl) {
        return res.status(400).send({ Status : false, Message: "Url Is Required" })
    }

    if (!validUrl(baseUrl)) {
        return res.status(400).send({ status: false, Message: "invalid Base Url" });
    }

    if (!validUrl(longUrl)) {
        return res.status(400).send({ status: false, Message: "Invalid Long Url" });
    }
    //
    const cahcedUrlData = await GET_ASYNC(`${longUrl}`)
        if (cahcedUrlData) {
            return res.status(200).send({ status: "true", data: cahcedUrlData })
        }

    let isUrlExist = await urlModel.findOne({ longUrl }).select({longUrl : 1, urlCode : 1, shortUrl: 1, _id: 0});
    if (isUrlExist) {
    //
        await SET_ASYNC(`${longUrl}`, JSON.stringify(isUrlExist))

        return res.status(201).send({ status: true, Message: "Success", Data: isUrlExist });
    }

    
    const urlCode = nanoid.nanoid().toLowerCase();      

    const shortUrl = baseUrl + "/" + urlCode;
    shortUrl.toLowerCase();

    const urlData = {
        longUrl,
        shortUrl : shortUrl.trim(),
        urlCode,
    };

    let newUrl = await urlModel.create(urlData)

    let finalData = {
        urlCode : newUrl.urlCode,
        longUrl : newUrl.longUrl,
        shortUrl: newUrl.shortUrl
    }
    return res.status(201).send({ status: true, Message: "success", Data: finalData });

} catch (error) {
    res.status(500).send({ status: false, Err: error.message });
}
};


//redirectToOriginalUrl

const fetchUrl = async (req, res) => {
try {
    const urlCode = req.params.urlCode.trim();
    //
    let cahcedUrlCode = await GET_ASYNC(`${urlCode}`)

        if (cahcedUrlCode) {
            return res.status(200).redirect(JSON.parse(cahcedUrlCode))
        }

    const isUrlExist = await urlModel.findOne({ urlCode: urlCode });

    if (isUrlExist) {
        //
        
        SET_ASYNC(`${urlCode}`, JSON.stringify(isUrlExist.longUrl))

        if (urlCode !== isUrlExist.urlCode) {

        return res.status(404).send({ status: false, Message: "No Url Found, Please Check Url Code", });
        }
        return res.status(302).redirect(isUrlExist.longUrl);
    }

} catch (error) {
    res.status(500).send({ status: false, Message: error.message });
}
};
// const urlModel = require("../Model/urlModel.js")
// const validUrl = require('valid-url')
// const shortid = require('shortid')
// const redis = require("redis")
// const { promisify } = require("util");
// const isValidRequestBody = function (requestBody) {
//     return Object.keys(requestBody).length > 0}

// const isValid = function (value) {
//     if (typeof value === 'undefined' || value === null)return false
//     if (typeof value === 'string' && value.trim().length === 0)return false
//     return true}

// //connect to redis===============
// const redisClient = redis.createClient(
//     11462,
//     "redis-11462.c212.ap-south-1-1.ec2.cloud.redislabs.com",
//     { no_ready_check: true });

//   redisClient.auth("xjU9XDj5BdBdOulNzHfeHjq9RonLG4vO", function (err) {
//     if (err) throw err;});
  
//   redisClient.on("connect", async function(){console.log("Connected to Redis..");}); 

//   const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
//   const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);
// //===================================== post api =================================>>
// const urlShorten = async function (req, res){
    
//  try{let requestBody = req.body;

//   if(!isValidRequestBody(requestBody)){
//     return res.status(400).send({status:false, message:"please fill request body"})}

//     let longurl = req.body.longUrl.toLowerCase().trim();

//     const baseUrl = 'http:localhost:3000'
    
//   if(!isValid(longurl)){
//     return res.status(400).send({status:false, message:"invalid longUrl"})}

//   if (validUrl.isUri(longurl)){let urlCode = shortid.generate()

//     urlCode= urlCode.toLowerCase().trim();

//     const shortUrl = baseUrl + '/' + urlCode

//     const details={longUrl:longurl, shortUrl:shortUrl, urlCode:urlCode}
        
//     let urlCreate = await urlModel.create(details)
    
//       return res.status(200).send({data:urlCreate})}

// else {res.status(401).send({status:false, message:"This Longurl is invalid"})}

// }catch(error){
//   res.status(500).send({status:false,message:error.message})
//   }
// }
//====================================================================================================================>>
// const fetchUrl = async function (req, res) {
   
// try {let urlCode = req.params.urlCode.toLowerCase().trim()

//   let cahcedUrl = await GET_ASYNC(`${urlCode}`)
        
//   let redirect1 = JSON.parse(cahcedUrl)

//     if (!cahcedUrl){
//       return res.status(400).send({ status: false, msg: "Short url does not exist! please provide valid url code " })}
         
//     if (cahcedUrl){console.log("Async_Checking")//Checking------->>            
//       return res.status(302).redirect(302, `${redirect1.longUrl}`);            

//     }else {let urlData = await urlModel.findOne({ urlCode: urlCode })

//     if (!urlData){
//       return res.status(400).send({ status: false, msg: "This Short url does not exist please provide a valid url code " }) }

//       await SET_ASYNC(`${urlCode}`, JSON.stringify(urlData))
//       console.log("i am else part of get api")

//       return res.status(301).redirect(301, `${urlData.longUrl}`);} }
//         catch(error){
//       res.status(500).send({status:false,message:error.message})
//    }
// }


 module.exports ={urlShorten, fetchUrl}



