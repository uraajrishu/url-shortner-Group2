const urlModel = require("../Model/urlModel.js")
const validUrl = require('valid-url')
const shortid = require('shortid')
const redis = require("redis")
const { promisify } = require("util");
//==================================================================================================>>>
const isValidRequestBody = function (requestBody){
  return Object.keys(requestBody).length > 0}

const isValid = function (value){
  if (typeof value === 'undefined' || value === null)return false
  if (typeof value === 'string' && value.trim().length === 0)return false
  return true}
//-------------------------#Connecting to radis..--------------------------->>
const redisClient = redis.createClient(
  11462,
  "redis-11462.c212.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true });
redisClient.auth("xjU9XDj5BdBdOulNzHfeHjq9RonLG4vO", function(err){
  if (err) throw err;});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");});

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

//==================================#Post Api {Creat Shorten Url}========================================>>

const urlShorten = async function (req, res) {

  try {let requestBody = req.body;

  if (!isValidRequestBody(requestBody)) {

    return res.status(400).send({ status: false, message: "please fill request body" })}

    let longurl = req.body.longUrl
    let regex= /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})?$/;
    const baseUrl = 'http://localhost:3000'
    
  if (!validUrl.isUri(baseUrl)){

      return res.status(400).send({ status: false, message: "invalid baseurl" })}

  if (!isValid(longurl)){

    return res.status(400).send({ status: false, message: "Url is required" })}

    if (longurl.match(regex)){

      let cahcedUrlData = await GET_ASYNC(`${req.body.longUrl}`)
      let x = JSON.parse(cahcedUrlData)

  if (x) {

    return res.status(200).send({ status: true,message:"This Url is coming from cashes", data: x })}

    else{let urlValue = await urlModel.findOne({ longUrl: req.body.longUrl }).select({ urlCode: 1, longUrl: 1, shortUrl: 1, _id: 0 })

  if (urlValue){

    await SET_ASYNC(`${req.body.longUrl}`, JSON.stringify(urlValue))

    return res.status(200).send({ status: true, message:"Shorturl for this url is already present",data: urlValue });}

  if (!urlValue){let code = shortid.generate()
    let urlCode = code.toLowerCase().trim();
    const shortUrl = baseUrl + '/' + urlCode
  const details={longUrl: longurl,shortUrl: shortUrl,urlCode: urlCode}

    let urlCreate = await urlModel.create(details)
    let urlData = await urlModel.findOne({ longUrl: urlCreate.longUrl }).select({ urlCode: 1, longUrl: 1, shortUrl: 1, _id: 0 })
    await SET_ASYNC(`${req.body.longUrl}`, JSON.stringify(urlData))
      return res.status(201).send({ status: true, data: urlData });}
    }
  }else{return res.status(400).send({ status: false, message: "This Longurl is invalid" })

  }
}catch(error) {res.status(500).send({ status: false, message: error.message })
  }
}
//=========================#Get Api{Get And Redirect}============================>>>

const fetchUrl = async function (req, res) {
  try {let code = req.params.urlCode
  if (!shortid.isValid(code)){
    return res.status(400).send({ status: false, message: "Invalid Url" })}

  let cachedUrlData = await GET_ASYNC(`${code}`)
  let url = JSON.parse(cachedUrlData)
  if (url){return res.status(302).redirect(url.longUrl)}

   else {let urlData = await urlModel.findOne({ urlCode: code });
   
  if (!urlData){return res.status(404).send({ status: false, message: "Url not found" })}
    await SET_ASYNC(`${code}`, JSON.stringify(urlData))
      return res.status(302).redirect(urlData.longUrl);}
}catch(error){res.status(500).send({ status: false, message: error.message })
   }
}

module.exports = { urlShorten, fetchUrl }
