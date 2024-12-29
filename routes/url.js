const express = require("express");

const { HandleGenerateShortUrlD ,HandlegetAnalytics,} = require("../controllers/url");
const router = express.Router();
//const router = express.Router;

router.post('/', HandleGenerateShortUrlD);
router.get('/analytics/:id', HandlegetAnalytics);
module.exports = router;