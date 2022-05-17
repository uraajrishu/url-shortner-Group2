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

        if(!isValidRequestBody(requestBody)){
            return res.status(400).send({status:false, message:"please fill request body"})

        }

        // const longUrl = requestBody
        // if(!isValid(longUrl)) {
        //     return res.status(400).send({status:false, message:"please enter longUrl value"})

        // }
// let urlCreate = await urlModel.create(requestBody)

//         let url = await urlModel.findOne({
//             longUrl})
        const baseUrl = 'http:localhost:3000'
        const urlCode = shortid.generate()

        const shortUrl = baseUrl + '/' + urlCode
        const details={};
        details.longUrl=req.body.longUrl
        details.shortUrl= shortUrl
        details.urlCode=urlCode

        return res.status(200).send({data:details})
    
    let urlCreate = await urlModel.create(details)
    let url = await urlModel.findOne({
        requestBody})
        return res.status(200).send({data:details})
    }

    module.exports ={urlShorten}