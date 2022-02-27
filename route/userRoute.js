const express = require("express");
const router = express.Router();

router.get("/", (req, res) =>{
    res.json({
        message: "I am working fine"
    })
})

module.exports = router;