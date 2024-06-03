import nodeMailer from "nodemailer";

// connect with smtp
const sendEmail = async (req, res) => {
  let transporter = await nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: `${req.email}`,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: ` "Dheeraj Baheti" <${req.email}> `,
    to: process.env.SMPT_MAIL,
    subject: req.subject,
    text: req.message,
    html: `<b>${req.message}</b>`,
  });

  return;
};

export default sendEmail;
