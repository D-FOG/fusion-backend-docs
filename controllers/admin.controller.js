const generator = require('../middleware/generator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const Admin = require('../models/Admin');
const User = require('../models/User');
const Deposit = require('../models/Deposit');
const Plan = require('../models/Plan');
const Withdrawal = require('../models/Withdrawal');
const Payment = require('../models/Payment');
const Transfer = require('../models/Transfer');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await Admin.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.userId,
        username: user.username,
        name: user.name,
        email: user.email,
        referralId: user.referralId,
        is_admin: user.is_admin
      },
      secretKey,
      { expiresIn: '12h' }
    );

    res.status(200).json({ message: 'Login successful', user: { token } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = generator.generateUniqueID();

    const sameuser = await Admin.findOne({ name });
    if (sameuser) {
      return res.status(400).json({ error: 'Username is taken' });
    }

    const sameemail = await Admin.findOne({ email });
    if (sameemail) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Admin.create({
      name,
      email,
      password: hashedPassword,
      is_admin: true,
      userId
    });

    res.status(201).json({ message: 'Admin registered successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ error: 'Admin registration not successful' });
  }
};

exports.adminProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await Admin.findOne({ userId }, { password: 0 });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    console.log(error);
  }
};

exports.editProfile = async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.userId;

  try {
    const user = await Admin.findOneAndUpdate(
      { userId },
      { name, email },
      { new: true }
    );

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating admin details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// users

exports.fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('password')

    res.status(200).json(users);

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.fetchUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({ userId });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching single user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.userId;
  const { walletBalance, earnings, totaldeposit, activeInvestment, status } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { userId },
      {
        accountBalance: walletBalance,
        earnings,
        totalDeposit: totaldeposit,
        activeInvestment,
        status
      },
      { new: true } // To return the updated document
    );

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// deposits

exports.deposit = async (req, res) => {
  const userId = req.params.userId;
  const { username, email, amount } = req.body;
  try {
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.accountBalance += parseInt(amount);
    user.totalDeposit += parseInt(amount);
    await user.save();

    const deposit = await Deposit.create({ username, email, amount, date: Date.now() });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.fetchDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find();
    res.status(200).json(deposits);
  } catch (error) {
    console.error('Error fetching deposits:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createPlan = async (req, res) => {
  try {
    const { name, price, duration, profit, maximum_amount, minimum_amount } = req.body;

    const existingPlan = await Plan.findOne({ name });
    if (existingPlan) {
      return res.status(400).json({ error: 'Plan already created, please use another name' });
    }

    const plan = await Plan.create({ name, price, duration, profit, maximum_amount, minimum_amount });

    res.status(201).json({ message: 'Plan created successfully', plan });
  } catch (error) {
    res.status(500).json({ error: 'Plan creation not successful' });
    console.log(error);
  }
};

exports.fetchPlans = async (req, res) => {
  try {
    const allPlans = await Plan.find();
    res.status(200).json(allPlans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getSinglePlan = async (req, res) => {
  const id = req.params.id;
  try {
    const plan = await Plan.findOne({ _id: id });
    res.status(200).json(plan);
  } catch (error) {
    console.error('Error fetching plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updatePlan = async (req, res) => {
  const id = req.params.id;
  const { name, duration, price, profit, maximum, minimum } = req.body;
  try {
    const plan = await Plan.findOne({ _id: id });

    plan.name = name;
    plan.duration = duration;
    plan.price = price;
    plan.profit = profit;
    plan.maximum_amount = maximum;
    plan.minimum_amount = minimum;

    await plan.save();

    res.status(200).json(plan);
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// exports.fetchWithdrawals = async (req, res) => {
//   try {
//     const withdrawals = await Withdrawal.find().populate('userId', 'username email');
//     res.status(200).json(withdrawals);
//   } catch (error) {
//     console.error('Error fetching withdrawals:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

exports.fetchWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find();

    // Extract all unique userIds from withdrawals
    const userIds = [...new Set(withdrawals.map(withdrawal => withdrawal.userId))];

    // Fetch users based on userIds
    const users = await User.find({ userId: { $in: userIds } }, 'userId username email');

    // Map users by their userIds for quick access
    const usersMap = users.reduce((map, user) => {
      map[user.userId] = user;
      return map;
    }, {});

    // Attach user details to withdrawals
    const withdrawalsWithUsers = withdrawals.map(withdrawal => {
      const user = usersMap[withdrawal.userId];
      return {
        ...withdrawal.toObject(),
        user: user ? { username: user.username, email: user.email } : null,
      };
    });

    res.status(200).json(withdrawalsWithUsers);
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
 
exports.approveWithdrawal = async (req, res) => {
  const id = req.params.id;

  try {
    const withdrawal = await Withdrawal.findById(id);

    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    withdrawal.status = 'successful';
    await withdrawal.save();

    const user = await User.findOne({ userId: withdrawal.userId});

    user.pendingWithdrawal -= parseInt(withdrawal.amount);
    user.withdrawals += parseInt(withdrawal.amount);

    await user.save();

    res.status(200).json({ message: 'Withdrawal approved successfully', withdrawal });
  } catch (error) {
    console.error('Error approving withdrawal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.rejectWithdrawal = async (req, res) => {
  const id = req.params.id;

  try {
    const withdrawal = await Withdrawal.findById(id);

    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    withdrawal.status = 'rejected';
    await withdrawal.save();

    const user = await User.findOne({ userId: withdrawal.userId});

    user.pendingWithdrawal -= parseInt(withdrawal.amount);
    user.accountBalance += parseInt(withdrawal.amount);

    await user.save();

    res.status(200).json({ message: 'Withdrawal approved successfully', withdrawal });
  } catch (error) {
    console.error('Error approving withdrawal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getDashboardDetails = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    res.status(200).json({ users: usersCount });
  } catch (error) {
    console.error('Error fetching dashboard details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUsersPayment = async (req, res) => {
  try {
    const deposits = await Payment.find().populate({ path: 'planId', model: 'Plan', select: 'name duration' });
    res.status(200).json(deposits);
  } catch (error) {
    console.error('Error fetching deposits:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.approveUsersPayment = async (req, res) => {
  const paymentId = req.params.paymentId;
  const { amount } = req.body;

  try {
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    payment.status = 'successful';
    payment.amount = amount;
    await payment.save();

    res.status(200).json({ message: 'Payment approved successfully', payment });
  } catch (error) {
    console.error("Error approving user's payment", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Controller function to get all transfers
exports.getAllTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find();
    res.status(200).json({ success: true, data: transfers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};