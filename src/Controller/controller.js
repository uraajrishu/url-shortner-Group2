const urlModel = require("../Model/urlModel.js");
const validUrl = require('valid-url');
const shortid = require('shortid');

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
    // try{
        let requestBody = req.body;

        if(!isValidRequestBody(requestBody)){
            return res.status(400).send({status:false, message:"please fill request body"})}

        const longUrl = requestBody
        if(!isValid(longUrl)) {
            return res.status(400).send({status:false, message:"please enter longUrl value"})

        }}