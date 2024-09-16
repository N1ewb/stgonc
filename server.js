// const express = require("express");
// const Recipient = require("mailersend").Recipient;
// const EmailParams = require("mailersend").EmailParams;
// const { MailerSend } = require("mailersend");

// const app = express();
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Welcome to the STGONC Server!");
// });

// app.get("/sendEmail", async (req, res) => {
//   const mailersend = new MailerSend({
//     apiKey:
//       "mlsn.f0fd2be2890cf2416136e5b6bcc9a955bfce409f5892f8c1aba41aca17d1defa",
//   });

//   try {
//     // Create email params directly
//     const response = await mailersend.email.send({
//       from: {
//         email: "info@domain.com",
//         name: "Your Name",
//       },
//       to: [
//         {
//           email: "nathaniellucero202100494@email.com",
//           name: "Recipient",
//         },
//       ],
//       subject: "Subject",
//       html: "Greetings from the team, you got this message through MailerSend.",
//       text: "Greetings from the team, you got this message through MailerSend.",
//     });

//     res.status(200).json({ message: "Email sent successfully", response });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// //   app.get("/api/charactersByID", async (req, res) => {
// //     const characterId = parseInt(req.query.id, 10);
// //     if (isNaN(characterId)) {
// //       return res.status(400).json({ error: "Invalid character ID" });
// //     }

// //     try {
// //       const character = await enka.getCharacterById(characterId);
// //       const jsonString = CircularJSON.stringify(character);
// //       res.status(200).send(jsonString);
// //     } catch (error) {
// //       res.status(500).json({ error: error.message });
// //     }
// //   });

// app.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// });
