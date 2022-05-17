const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({

    urlCode:{ type:String, required:true,unique:true,lowercase:true,trim:true},

    logoUrl:{ ty:String, required:true, lowercase:true, trim:true},

    shortUrl:{ type:String, required:true, unique:true}
    
}, {timestamps:true})

module.exports = mongoose.model('Url', urlSchema)