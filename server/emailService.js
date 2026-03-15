const nodemailer = require('nodemailer');

// Mock email service with logged output instead of sending real emails if credentials are not provided
const sendAlertEmail = async (to, subject, text) => {
  console.log(`\n--- SIMULATED EMAIL ---`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${text}`);
  console.log(`-----------------------\n`);

  // To configure real SMTP, add credentials below:
  /*
  const transporter = nodemailer.createTransport({
    host: "smtp.example.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "your_smtp_user",
      pass: "your_smtp_pass",
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Smart Emergency System" <alerts@smart-emergency.local>',
      to,
      subject,
      text,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Email error: ", err);
  }
  */
};

module.exports = {
  sendAlertEmail,
};
