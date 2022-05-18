const urlModel = require("../Model/urlModel.js")
const validUrl = require('valid-url')
const shortid = require('shortid')
const redis = require("redis")
const { promisify } = require("util");
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


//connect to redis===============
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
//===================================== post api ================
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



// const getCode = async function(req, res){
//    try{
//         let urlcode = req.params.code

//         console.log(urlcode)
 
// let codeExist = await urlModel.findOne({urlCode:urlcode})
// if(!codeExist){
//     return res.status(404).send({status:false, message:"urlCode not exist"})
// }

// return res.redirect(codeExist.longUrl)

// }


// catch (err) {
//     console.log(err)
//     res.status(500).json('Server Error')
// }

// }



const fetchUrl = async function (req, res) {
   try{ 
       let code= req.params.code
    let cachedUrlData = await GET_ASYNC(`${req.params.code}`)
    if(cachedUrlData) {
      res.send(cachedUrlData)
    } else {
      let urlData = await urlModel.findOne({urlCode:code});
      await SET_ASYNC(`${req.params.code}`, JSON.stringify(urlData))
      res.send({ data: urlData });
    }
  
  }
  catch (err) {
    console.log(err)
    res.status(500).json('Server Error')
}

}
 module.exports ={urlShorten, fetchUrl}