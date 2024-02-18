const nodemailer = require('nodemailer');

exports.sendVerificationEmail = async (email, OTP, res, OTPToken) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'texafusion@gmail.com',
      pass: process.env.PASSWORD
    }
  });
  const mailOptions = {
    from: 'Fussion Verify',
    to: email, //Getting the user's email
    subject: 'VERIFY YOUR FUSION ACCOUNT',
    text: `Use this otp to verify your account ${OTP}. It will expire in 20m`, //Passing the OTP
    html: `<p>Use this otp to verify your account</p> <b>${OTP}</b> It will expire in 20m` //Passing the OTP
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.status(500).json({ success: false, message: error });
    } else {
      return res
        .status(200)
        .json({ success: true, message: info.response, OTPToken });
    }
  });
};

exports.sendForgerPasswordMail = async (email, link, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'texafusion@gmail.com',
      pass: process.env.PASSWORD
    }
  });
  const mailOptions = {
    from: 'Fussion Verify',
    to: email, //Getting the user's email
    subject: 'RESET YOUR FUSION ACCOUNT PASSWORD',
    text: `It appears you have forgotten your fusion password. Dorry worry, that happens 😀. You can reset your password using the Link, ${link}. The URL is set to expire within 20 minutes, after which you would need to generate another via, https://fusion-builders.vercel.app/reset-password. If this action was not initiated by you, notify support on texafusion@gmail.com`, //Passing the OTP
    html: `<p>It appears you have forgotten your fusion password. Dorry worry, that happens 😀. </p> <p> You can reset your password using the Link, ${link}.</p>  <p> The URL is set to expire within 20 minutes, after which you would need to generate another via, https://fusion-builders.vercel.app/reset-password. </p> <p>If this action was not initiated by you, notify support on texafusion@gmail.com </p>` //Passing the OTP
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.status(500).json({ success: false, message: error });
    } else {
      return res.status(200).json({ success: true, message: info.response });
    }
  });
};
