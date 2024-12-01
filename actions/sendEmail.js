const express = require("express");
const bodyParser = require("body-parser");
const { Resend } = require("resend");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
const corsOptions = {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
  };
const resend = new Resend("re_RftfCFhD_H36XpSzm7j1GWXzjZBsQ6R4o");
app.options("/send-email", cors(corsOptions));

app.post("/send-email", async (req, res) => {
  try {
    const { recipient_email, subject, content } = req.body;

    const emailData = {
      from: `"STGONC Team" <stgoncteam.spc@gmail.com>`,
      to: recipient_email,
      subject: subject,
      html: `<p>${content}</p>`,
    };

    const response = await resend.emails.send(emailData);
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(5143, () => {
  console.log("Server running on port 5143");
});
