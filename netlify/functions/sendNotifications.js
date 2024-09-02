const { Recipient, EmailParams, MailerSend } = require("mailersend");

const mailersend = new MailerSend({
  apiKey:
    "mlsn.f0fd2be2890cf2416136e5b6bcc9a955bfce409f5892f8c1aba41aca17d1defa",
});

exports.handler = async function (event, context) {
  try {
    const recipients = [
      new Recipient("nathaniellucero202100494@email.com", "Recipient"),
    ];
    const emailParams = new EmailParams()
      .setFrom("stgonc@spc.com")
      .setFromName("Your Name")
      .setRecipients(recipients)
      .setSubject("Subject")
      .setHtml(
        "Greetings from the team, you got this message through MailerSend."
      )
      .setText(
        "Greetings from the team, you got this message through MailerSend."
      );

    // Await the result of the send operation
    await mailersend.send(emailParams);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Error sending email:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};
