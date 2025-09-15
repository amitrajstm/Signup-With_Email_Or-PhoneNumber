const expired = require("express");
const authController = require("../controllers/authController.js")

const router= expired.Router();
router.post("/send-otp",authController.sendOtp);
router.post("/verify-otp",authController.verifyOtp);

module.exports = router;