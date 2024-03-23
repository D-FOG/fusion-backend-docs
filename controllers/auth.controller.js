const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redis = require('../config/redis');

const Friend = require('../models/Friend');

const short = require('short-uuid');

const { sendVerificationEmail, sendForgerPasswordMail } = require('../utils');

exports.register = async (req, res) => {
  const { username, email, password, refd } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }
  const lowerUsername = username.toLowerCase();
  const lowerEmail = email.toLowerCase();

  try {
    const user1 = await User.findOne({
      username: lowerUsername
    });
    const emailUser1 = await User.findOne({
      email: lowerEmail
    });

    if (user1) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    if (emailUser1) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const lowerRefd = refd ? refd.toLowerCase() : null;
    if (lowerRefd) {
      const checkRef = await User.findOne({ ref: lowerRefd });
      if (!checkRef) {
        return res.status(400).json({ message: 'Invalid referral code' });
      }
      await User.findOneAndUpdate(
        { username: checkRef.username },
        { referredUsers: [...checkRef.referredUsers, lowerUsername] }
      );
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Length of password is less than 6' });
    }
    const newPassword = await bcrypt.hash(password, 12);
    const rrr = await User.findOne({ ref: lowerRefd });
    const newUser = await User.create({
      username: lowerUsername,
      email: lowerEmail,
      password: newPassword,
      isCompleted: false,
      referedBy: rrr?.username || null,
      ref: lowerUsername
    });
    await Friend.create({
      user: newUser
    });
    const { username: newUsername, email: newEmail, date, ref } = newUser;
    res.status(200).json({
      message: 'User created successfully',
      result: { username: newUsername, email: newEmail, date, ref }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.login = async (req, res) => {
  //Get the email and password from req.body
  const { identifier, password } = req.body;
  try {
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
    const loweridentifier = identifier.toLowerCase();
    const valIdentififer = identifier.includes('@') ? 'email' : 'username';
    if (valIdentififer === 'email') {
      const emailUser2 = await User.findOne({
        email: loweridentifier,
        isCompleted: false,
        isGoogleSignin: false
      });
      if (emailUser2) {
        return res.status(401).json({ message: 'Verify your account', code: errorCodes.auth.verifyOTP, email: emailUser2.email });
      }
      const identifierUser = await User.findOne({ email: loweridentifier });
      if (!identifierUser) {
        return res
          .status(401)
          .json({ message: 'Invalid identifier or password' });
      }
      const newPassword = await bcrypt.compare(
        password,
        identifierUser.password
      );
      if (!newPassword) {
        return res
          .status(401)
          .json({ message: 'Invalid identifier or password' });
      }
      const {
        username,
        email,
        date,
        ref,
        referredUsers,
        isCompletedProfile
      } = identifierUser;
      const authToken = jwt.sign({ identifier }, process.env.SECRET_KEY, {
        expiresIn: '24hr'
      });
      return res.status(200).json({
        message: 'Logged in successfully',
        result: {
          username,
          email,
          date,
          authToken,
          isCompletedProfile,
          ref,
          referredUsers
        }
      });
    }
    if (valIdentififer === 'username') {
      const user2 = await User.findOne({
        username: loweridentifier,
        isCompleted: false,
        isGoogleSignin: false
      });

      if (user2) {
        return res.status(401).json({ message: 'Verify your account', code: errorCodes.auth.verifyOTP, email: user2.email });
      }
      const identifierUser = await User.findOne({ username: loweridentifier });
      if (!identifierUser) {
        return res
          .status(401)
          .json({ message: 'Invalid username or password' });
      }
      const newPassword = await bcrypt.compare(
        password,
        identifierUser.password
      );
      if (!newPassword) {
        return res
          .status(401)
          .json({ message: 'Invalid username or password' });
      }
      const {
        username,
        email,
        date,
        ref,
        isCompletedProfile,
        referredUsers
      } = identifierUser;
      const authToken = jwt.sign({ identifier }, process.env.SECRET_KEY, {
        expiresIn: '24hr'
      });
      return res.status(200).json({
        message: 'Logged in successfully',
        result: {
          username,
          email,
          date,
          authToken,
          isCompletedProfile,
          ref,
          referredUsers
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.email = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
    const lowerEmail = email.toLowerCase();
    const checkEmail = await User.findOne({
      email: lowerEmail,
      isCompleted: false
    });
    if (!checkEmail) {
      return res
        .status(400)
        .json({ message: 'Email does not exist or is verified' });
    }

    const OTP = Math.floor(100000 + Math.random() * 900000);
    const OTPToken = jwt.sign({ OTP }, process.env.SECRET_KEY, {
      expiresIn: '20m'
    });
    await sendVerificationEmail(lowerEmail, OTP, res, OTPToken).catch(() => {
      return res.status(400).json({ message: 'Email does not exists' });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.verifyOtp = async (req, res) => {
  const { OTP, OTPToken, email } = req.body;
  if (!OTP || !OTPToken || !email) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }
  const lowerEmail = email.toLowerCase();
  const checkEmail = await User.findOne({
    email: lowerEmail,
    isCompleted: false
  });

  if (!checkEmail) {
    return res
      .status(400)
      .json({ message: 'Email does not exist or is verified' });
  }
  jwt.verify(OTPToken, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      res.status(400).json({ success: false, message: err.message });
    } else {
      if (OTP == decoded.OTP) {
        const user = await User.findOneAndUpdate(
          { email: checkEmail.email },
          { isCompleted: true }
        );
        const {
          _id,
          username,
          email,
          isCompletedProfile,
          date,
          ref,
          referredUsers
        } = user;
        const authToken = jwt.sign(
          { id: _id },
          process.env.SECRET_KEY,
          {
            expiresIn: '24hr'
          }
        ); 
        res.status(200).json({ 
          success: true, 
          message: 'OTP verified', 
          result: {authToken, username, email, ref, referredUsers, isCompletedProfile, date} 
        });
      } else {
        res.status(400).json({ success: false, message: 'OTP not verified' });
      }
    }
  });
};
exports.getUser = async (req, res) => {
  const { authToken } = req.body;
  jwt.verify(authToken, process.env.SECRET_KEY, async (err, { identifier }) => {
    if (err) {
      res.status(400).json({ success: false, message: err.message });
    } else {
      if (!identifier) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid Identifier' });
      }
      const loweridentifier = identifier.toLowerCase();
      const valIdentififer = identifier.includes('@') ? 'email' : 'username';
      if (valIdentififer === 'email') {
        const identifierUser = await User.findOne({ email: loweridentifier });
        if (!identifierUser) {
          return res.status(401).json({ message: 'Invalid Identifier' });
        }
        return res.status(200).json({
          message: 'Logged in successfully',
          result: {
            ...identifierUser._doc
          }
        });
      }
      if (valIdentififer === 'username') {
        const identifierUser = await User.findOne({
          username: loweridentifier
        });
        if (!identifierUser) {
          return res.status(401).json({ message: 'Invalid Identifier' });
        }
        return res.status(200).json({
          message: 'Logged in successfully',
          result: {
            ...identifierUser._doc
          }
        });
      }
    }
  });
};
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
    const lowerEmail = email.toLowerCase();
    const checkEmail = await User.findOne({
      email: lowerEmail,
      isCompleted: true
    });
    if (!checkEmail) {
      return res
        .status(400)
        .json({ message: 'Email does not exist or is not verified' });
    }

    const urlcode = short.generate();
    const link = `https://fusion-builders.vercel.app/reset-password/${urlcode}`;
    await redis
      .setex(`forgotPassword:urlcode:${urlcode}`, 30 * 60, lowerEmail)
      .then(async () => {
        await sendForgerPasswordMail(lowerEmail, link, res).catch(() => {
          return res.status(400).json({ message: 'An error occured' });
        });
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.resetPassword = async (req, res) => {
  const { urlcode, password } = req.body;

  if (!urlcode || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  const emailRedis = await redis.get(`forgotPassword:urlcode:${urlcode}`);

  if (!emailRedis) {
    return res.status(400).json({ message: 'Invalid or expired url' });
  }

  const lowerEmail = emailRedis.toLowerCase();
  const checkEmail = await User.findOne({
    email: lowerEmail,
    isCompleted: true
  });
  if (!checkEmail) {
    return res
      .status(400)
      .json({ message: 'Email does not exist or is not verified' });
  }
  const newPassword = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate(
    { email: checkEmail.email },
    { password: newPassword }
  )
    .then(() => {
      redis.del(`forgotPassword:urlcode:${urlcode}`).catch(error => {
        console.error('Error:', error);
      });
      return res.status(200).json({ message: 'Password reset successfully' });
    })
    .catch(() => {
      return res.status(400).json({ message: 'An error occured' });
    });
};
exports.verifyurlcode = async (req, res) => {
  const { urlcode } = req.body;

  if (!urlcode) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  const emailRedis = await redis.get(`forgotPassword:urlcode:${urlcode}`);

  if (!emailRedis) {
    return res.status(400).json({ message: 'Invalid or expired url' });
  }

  const lowerEmail = emailRedis.toLowerCase();
  const checkEmail = await User.findOne({
    email: lowerEmail,
    isCompleted: true
  });
  if (!checkEmail) {
    return res
      .status(400)
      .json({ message: 'Email does not exist or is not verified' });
  }
  return res.status(200).json({ message: 'Valid url' });
};
const { OAuth2Client } = require('google-auth-library');
const errorCodes = require('../utils/errorCodes');
const client = new OAuth2Client();

exports.signinWithGoogle = async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ message: 'Token not present' });
  }
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { email, email_verified, username } = payload;
    if (!email || !email_verified) {
      res.status(400).json({ message: 'invalid' });
    }
    const lowerEmail = email.toLowerCase();
    const authToken = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: '24hr'
    });

    const user = await User.findOne({
      email: lowerEmail,
      isGoogleSignin: false
    });
    if (user) {
      return res
        .status(401)
        .json({ message: 'Sign in with your password', email: lowerEmail });
    }
    const userGoogle = await User.findOne({
      email: lowerEmail,
      isGoogleSignin: true
    });

    if (userGoogle) {
      const { username, email, date, ref, referredUsers } = userGoogle;
      return res.status(200).json({
        message: 'Logged in successfully',
        result: {
          username,
          email,
          date,
          authToken: authToken,
          ref,
          referredUsers,
          flag: 'login'
        }
      });
    }
    async function generateUsername(username1) {
      const checckk = await User.findOne({
        username: username1
      });
      if (!checckk) {
        return username1.toLowerCase();
      }
      while (true) {
        let randomUsername = `${username1}${
          Math.floor(Math.random() * 10000) + 1
        }`;
        const userWithSameUsername = await User.findOne({
          username: randomUsername
        });
        if (!userWithSameUsername) {
          return username1.toLowerCase();
        }
      }
    }
    let usernameNew = username || lowerEmail.split('@')[0];
    const usernameFinal = await generateUsername(usernameNew);
    const newUser = await User.create({
      username: usernameFinal,
      email: lowerEmail,
      referedBy: null,
      ref: usernameFinal,
      isGoogleSignin: true
    });
    const { username: newUsername, email: newEmail, date, ref } = newUser;

    return res.status(200).json({
      message: 'User created successfully',
      result: {
        username: newUsername,
        email: newEmail,
        date,
        ref,
        flag: 'register'
      }
    });
  }
  verify().catch(error => {
    console.log(error);
    return res
      .status(400)
      .json({ message: 'An error occured, please try again later' });
  });
};

exports.checkUsername = async (req, res) => {
  try {
    const {username} = req.body
    if(!username) return res.status(422).json({message: 'Username should be provided'})

    const user = await User.findOne({username})
    if(user) return res.status(409).json({message: 'Username already exists'})  
    
    return res.status(200).json({message: 'ok'})
  }catch(err) {
    res.status(500).json('Internal server error')
  }
}