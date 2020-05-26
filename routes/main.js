const express = require('express')
const controller = require('../controllers/main')
const router = express.Router()

router.post('/getAll', controller.getAll)

module.exports = router