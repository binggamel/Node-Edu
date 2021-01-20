// const express = require("express");
// const router = express.Router();

const { Router } = require("express");
const router = Router();

router.use("/upload", require("./upload/index"));
router.use("/classCreate", require("./classCreate/index"));
router.use("/user", require("./user"));

module.exports = router;
