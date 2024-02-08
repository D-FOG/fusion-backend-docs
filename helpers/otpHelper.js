const nodemailer = require('nodemailer');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const sendOTPByEmail = async (email, otp, token, firstname) => {
  try {
    const verificationLink = `http://localhost:3000/auth/verification?otp=${otp}&token=${token}`;

    const transporter = nodemailer.createTransport({ 
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASSWORD
      }

      // host: process.env.EMAIL_USER, // Replace with your SMTP server
      // port: 465, // Use the appropriate port (commonly 587 or 465)
      // secure: true, // true for 465, false for other ports
      // auth: {
      //   user: process.env.EMAIL_USER,  // Your email address
      //   pass: process.env.EMAIL_PASSWORD // Your password or app-specific password
      // }
    });

    const mailOptions = {
      from: `${process.env.EMAIL_USER}`, 
      to: email,
      subject: 'Account Verification OTP',
      html: `
        <html>
        <head>
          <style>
            body{
              background-color: gray;
              color: white;
            }
            .container{
              border-radius: 10px;
              background-color: gray;
              color: white;
            }
            .email-text{
              background-color: rgba(0,0,0,0.5); 
              color : gray;
              padding: 20px;
            }
            button{
              background-color: black; 
              color: white; 
              border: none; 
              padding: 10px; 
              border-radius: 10px;
            }
            p{
              color:gray
            }
            .footer{
              padding: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email-text">
              <p>Dear ${firstname},</p>
              <p>Please click the button below to verify your email address.</p>
              <p><a href="${verificationLink}"><button>Verify Email Address</button></a></p>
              <p>If you did not create an account, no further action is required.</p>
              <p>Best Regards,<br/> Trust Net Bank.</p>
            </div>
            <div class="footer">&copy; Trust Net Bank. All rights reserved.</div>
        </div>
        </body>
        </html>
      `
    }; 

    await transporter.sendMail(mailOptions);
    console.log('OTP sent to email:', email);
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

// const sendResetPasswordMail = async (email, otp, name) => {
//     try {
//       const verificationLink = `http://localhost:5500/verify-email.html?email=${email}`;
  
//       const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: process.env.EMAIL_USER, 
//           pass: process.env.EMAIL_PASSWORD
//         }
//       });
  
//       const mailOptions = {
//         from: `COMERCIO DE FXTM`, 
//         to: email,
//         subject: 'Account Verification OTP',
//         html: `
//           <p>Dear ${name},</p>
//           <p>Your account verification OTP is: <strong>${otp}</strong></p>
//           <p>Please use this OTP to verify your account.</p>
//           <p>If you did not request this OTP, please ignore this email.</p>
//           <p>Click the following link to verify your email:</p>
//           <a href="${verificationLink}">${verificationLink}</a>
//           <p>Best Regards,<br/> COMERCIO DE FXTM</p>
//         `
//       };
  
//       await transporter.sendMail(mailOptions);
//       console.log('OTP sent to email:', email);
//     } catch (error) {
//       console.error('Error sending OTP:', error);
//       throw error;
//     }
//   };

module.exports = {
  generateOTP,
  sendOTPByEmail
};
