const nodemailer = require("nodemailer");
require("dotenv").config();
const path = require("path");
const multer = require("multer");

const my_email = process.env.MY_EMAIL;
const my_password = process.env.EMAIL_PASSWORD;

// Configure Multer

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage }).array("files", 10);

// Function to send email
const sendEmail = async (req, res) => {
  const { to, subject, text } = req.body;
  // Validate input fields
  if (!to || !subject || !text) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const recipients = Array.isArray(to) ? to.join(",") : to;

  try {
    // Create transporter with Gmail settings
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: my_email,
        pass: my_password,
      },
    });

    // Prepare attachments for multiple files
    const attachments = req.files
      ? req.files.map((file) => ({
          filename: file.originalname,
          path: path.join(__dirname, "../uploads/", file.filename),
        }))
      : [];

    // Send mail
    const info = await transporter.sendMail({
      from: my_email, // Sender address
      to: recipients, // Join array of recipients
      subject, // Email subject
      text, // Plain text content
      attachments, // Attachments
    });

    console.log("Message sent: %s", info.messageId);
    res.status(200).json({ message: "Email sent successfully!", info });
  } catch (error) {
    console.error("Error sending email: ", error);
    res.status(500).json({ message: "Failed to send email.", error });
  }
};

module.exports = { sendEmail, upload };
