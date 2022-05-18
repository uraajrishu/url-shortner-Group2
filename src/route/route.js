const express = require('express');

const router = express.Router();
const urlController = require("../Controller/controller")

router.get('/test-me', function (req, res) {
    res.send('Testing Project!')
});


router.post("/url/shorten", urlController.urlShorten)
router.get("/code/:url", urlController.getCode)
module.exports = router;