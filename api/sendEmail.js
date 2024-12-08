const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method === "GET") {
    const { sendTo, subject, message } = req.body;

    if (!sendTo || !subject || !message) {
      return res
        .status(400)
        .json({
          error: "Missing required fields: sendTo, subject, or message.",
        });
    }

    try {
      const response = await sendEmail(sendTo, subject, message);
      res.status(200).json({ message: response.message });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res
      .status(405)
      .json({ error: "Method not allowed. Only POST requests are supported." });
  }
};

function sendEmail(sendTo, subject, message) {
  if (!sendTo) {
    return Promise.reject({ message: "No recipients defined" });
  }

  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mail_configs = {
      from: process.env.EMAIL_USER,
      to: sendTo,
      subject,
      text: message,
    };

    transporter.sendMail(mail_configs, (error, info) => {
      if (error) {
        console.error(error);
        return reject({ message: `An error occurred: ${error.message}` });
      }
      resolve({ message: "Email sent successfully" });
    });
  });
}
