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
    
        let requestBody = req.body;

        if!(!isValidRequestBody(requestBody)){
            return res.status(400).send({status:false, message:"please fill request body"})

        }

        const longUrl = requestBody
        if(!isValid(longUrl)) {
            return res.status(400).send({status:false, message:"please enter longUrl value"})

        }
let url = await urlModel.create(longUrl)

        let url = await urlModel.findOne({
            longUrl})
        const baseUrl = 'http:localhost:3000'
        const urlCode = shortid.generate()

        const shortUrl = baseUrl + '/' + urlCode
        
        return res.status(200).send(200)({data:})
    }