const express = require("express");
const { sendEmail, upload } = require("../Controller/sendEmail.controller.js");

const router = express.Router();

// Define the route for sending an email
router.post("/api/send-email", upload, sendEmail);
router.get("/api/send-email", (req, res) => {
  res.send("Welcome User To the Email Section");
});

module.exports = router;
upload;
