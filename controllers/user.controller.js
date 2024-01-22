const generator = require('../middleware/generator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;
const otpHelper = require('../helpers/otpHelper')
const nodemailer = require('nodemailer')
const cron = require('node-cron');
const User = require('../models/User');
const Plan = require('../models/Plan');
const Payment = require('../models/Payment');
const Withdrawal = require('../models/Withdrawal');

// user authentication

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.status === 'pending') {
      return res.status(401).json({ error: 'Your account has not been verified. Please check your email for the verification email' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      {
        userId: user.userId,
        username: user.username,
        name: user.name,
        email: user.email,
        referralId: user.referralId,
        is_admin: user.is_admin
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.status(200).json({ message: 'Login successful', user: { token } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}; 

exports.registerUser = async (req, res) => {
  try {
    const { username, name, email, password, uplineId } = req.body;
    const userId = generator.generateUniqueID();
    const referralId = username + generator.generateReferralCode();
    const expirationTime = 30 * 60; // 30 minutes in seconds
    const otp = otpHelper.generateOTP();
    const otpcode =otp
    const token = jwt.sign({ email, otp: otpcode }, process.env.JWT_SECRET, { expiresIn: expirationTime });

    const hashedPassword = await bcrypt.hash(password, 10);

    const sameUser = await User.findOne({ username });
    if (sameUser) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    const sameEmail = await User.findOne({ email });
    if (sameEmail) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    await otpHelper.sendOTPByEmail(email, otpcode, token, username);

    const newUser = await User.create({
      username,
      name,
      email,
      password: hashedPassword,
      referralId,
      uplineId,
      is_admin: false,
      userId,
      regDate: Date.now(),
      earnings: 0,
      withdrawals: 0,
      accountBalance: 0,
      activeInvestment: 0,
      pendingWithdrawal: 0,
      totalDeposit: 0,
      referralEarnings: 0,
      status: 'pending',
      otpcode: otpcode,
      bitcoinAddress: 'default',
      usdtAddress: 'default',
      ethereumAddress: 'default',
    });

    res.status(201).json({ message: 'User registered successfully', user: { token } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'User registration not successful' });
  }
};


exports.verifyEmail = async (req, res) => {
  const { token, otp } = req.body;

  try {
    if (!token || !otp) {
      return res.status(401).json({ error: 'Invalid OTP or token' });
    }

    const existingUser = await User.findOne({ otpcode: otp }).select('-password');

    if (!existingUser) {
      return res.status(401).json({ error: 'User not found' });
    }

    const email = existingUser.email;

    if (existingUser.status === 'active') {
      return res.status(201).json({ message: 'Your account has already been verified' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token validation failed' });
      } else {
        console.log(decoded)
        if (decoded.email !== existingUser.email || decoded.otp != otp) {
          return res.status(401).json({ error: 'Wrong OTP or email' });
        }
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Registration successful',
        html: `Thank you for registering with us. Your account has been successfully verified. Light Spe
        ed Investment`
      };

      await transporter.sendMail(mailOptions);

      await existingUser.updateOne({ status: 'active' });

      return res.status(201).json({ message: 'Your account has been verified successfully', data: existingUser });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { emails } = req.body;

  try {
    const existingUser = await User.findOne({ email: emails });

    if (!existingUser) {
      return res.status(401).json({ error: 'User not found' });
    }

    const email = existingUser.email;
    
    const otp = otpHelper.generateOTP();
    existingUser.otpcode = otp;
    await existingUser.save();

    const expirationTime = 60 * 60; 
    const token = jwt.sign({ email, otp: existingUser.otpcode }, process.env.JWT_SECRET, { expiresIn: expirationTime });

    const verificationLink = `/reset-password.html?otp=${existingUser.otpcode}&token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: email,
      subject: 'Reset Password',
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
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email-text">
              <p>Dear ${existingUser.username},</p>
              <p>You are receiving this email because we received a password reset request for your account.</p>
              <p><a href="${verificationLink}"><button>Reset Password</button></a></p>
              <p>This password reset link will expire in 60 minutes.</p>
              <p>If you did not request a password reset, no further action is required.</p>
              <p>Best Regards,<br/> Light Speed Investment.</p>
            </div>
            <div class="footer">&copy; Light Speed Investment.. All rights reserved.</div>
        </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('OTP sent to email:', email);

    return res.status(201).json({ message: 'Your account password reset link has been sent to your email' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, otp, password, emails } = req.body;

  try {
    if (!emails || !password) {
      return res.status(401).json({ error: 'Email and password required' });
    }
    if (!token || !otp) {
      return res.status(401).json({ error: 'No valid OTP or token' });
    }

    const existingUser = await User.findOne({ otpcode: otp, email: emails });

    if (!existingUser) {
      return res.status(401).json({ error: 'User not found' });
    }

    const email = existingUser.email;

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token validation failed' });
      } else {
        if (decoded.email !== existingUser.email || decoded.otp != otp) {
          return res.status(401).json({ error: 'Wrong OTP or email' });
        }
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);


    // Send confirmation email to the user
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Successful',
      html: `Your password has successfully been reset, if you didn't reset your password, please contact support immediately. <br> Light Speed Investment.`
    };

    await transporter.sendMail(mailOptions);

    const updatedUser = await User.findOneAndUpdate(
      { otpcode: otp, email: emails },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({ error: 'Failed to update password' });
    }

    return res.status(201).json({ message: 'Your account password has been changed successfully', data: updatedUser });
  })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// user profile and account details

exports.userProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findOne({ userId }).select('-password');

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.editProfile = async (req, res) => {
  const { bitcoinAddress, usdtAddress, ethereumAddress } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findOne({userId});

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.bitcoinAddress = bitcoinAddress;
    user.usdtAddress = usdtAddress;
    user.ethereumAddress = ethereumAddress;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.accountDetails = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching account details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// plans

exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();

    res.status(200).json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getSinglePlan = async (req, res) => {
  const id = req.params.id;

  try {
    const plan = await Plan.findById(id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.status(200).json(plan);
  } catch (error) {
    console.error('Error fetching plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// deposit

exports.deposit = async (req, res) => {
  try {
    const { id: planId, transactionId } = req.params;
    const { method } = req.body;

    if (!planId || !transactionId || !method) {
      return res.status(401).json({ error: 'Plan id, method, and transaction id are required for a successful deposit' });
    }

    const existingPayment = await Payment.findOne({ transactionId });
    if (existingPayment) {
      return res.status(200).json({ message: 'Deposit already done' });
    }

    const payment = await Payment.create({
      username: req.user.username,
      email: req.user.email,
      planId,
      method,
      transactionId,
      status: 'pending',
      date: Date.now()
    });

    res.status(201).json({ message: 'Deposit successful, your deposit will be confirmed by the admin', payment });
  } catch (error) {
    console.error('Error during deposit:', error);
    res.status(500).json({ error: 'Deposit not successful' });
  }
};

exports.getDeposits = async (req, res) => {
  try {
    const deposits = await Payment.find({ username: req.user.username }).populate({path: 'planId', model: 'Plan', select: 'name duration'});
    res.status(200).json(deposits);
  } catch (error) {
    console.error('Error fetching deposits:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// user withdrawals

exports.withdraw = async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findOne({ userId: req.user.userId});

    user.pendingWithdrawal += parseInt(amount);
    user.accountBalance -= parseInt(amount);
    await user.save();

    const withdrawal = await Withdrawal.create({
      amount,
      userId: req.user.userId,
      status: 'pending',
      date: Date.now()
    });

    res.status(201).json({ message: 'Your withdrawal request has been placed, you will be credited shortly by the admin', withdrawal });
  } catch (error) {
    console.error('Error during withdrawal:', error);
    res.status(500).json({ error: 'Withdrawal not successful' });
  }
};

exports.getWithdrawals = async (req, res) => {
  try {

    
    const withdrawals = await Withdrawal.find({ userId: req.user.userId })
    res.status(200).json(withdrawals);
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// user referrals 

exports.getReferrals = async (req, res) => {
  try {
    const referrals = await User.find({ uplineId: req.user.referralId }).select('username email');
    const activeReferrals = await User.find({ uplineId: req.user.referralId, status: 'active' }).select('username email');
    
    res.status(200).json({ referrals, activeReferrals });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

async function updateBalances() {
  try {
    const users = await User.find();

    const percentageIncrease = 0.01;

    for (const user of users) {
      const lastUpdated = user.lastUpdated;
      const today = new Date();
      const timeDifference = today.getTime() - lastUpdated.getTime();
      const daysDifference = timeDifference / (1000 * 3600 * 24);

      const newBalance = user.accountBalance * Math.pow((1 + percentageIncrease), daysDifference);

      await User.findByIdAndUpdate(
        user.userId,
        {
          accountBalance: newBalance,
          lastUpdated: today,
        }
      );
    }
    console.log('Balances updated successfully!');
  } catch (error) {
    console.error('Error updating balances:', error);
    // Log errors to a file or external monitoring service
  }
}

// Schedule the updateBalances function to run every day at midnight
cron.schedule('0 0 * * *', () => {
  updateBalances();
});