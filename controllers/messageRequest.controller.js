const User = require('../models/User');
const Chat = require('../models/Chat');

exports.messageRequest = async (req, res) => {
  const { user1Id, user2Id } = req.body;
  if (!user1Id || !user2Id) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  if (user1Id === user2Id) {
    return res
      .status(400)
      .json({ message: 'You cannot send request to yourself' });
  }

  try {
    const user1 = await User.findById(user1Id);
    const user2 = await User.findById(user2Id);
    if (!user1 || !user2) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isRequestSent = await Chat.findOne({
      user1: user1Id,
      user2: user2Id,
      status: 'pending'
    });

    if (!!isRequestSent) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    const isRequestReceived = await Chat.findOne({
      user1: user2Id,
      user2: user1Id,
      status: 'pending'
    });

    if (!!isRequestReceived) {
      await Chat.findOneAndUpdate(
        { user1: user2Id, user2: user1Id },
        { status: 'accepted' }
      );
      return res.status(201).json({ message: 'Request sent successfully' });
    }

    await Chat.create({
      user1: user1Id,
      user2: user2Id,
      status: 'pending'
    });

    res.status(201).json({ message: 'Request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.acceptRequest = async (req, res) => {
  const { user1Id, user2Id } = req.body;
  if (!user1Id || !user2Id) {
    return res.status(400).json({ message: 'Invalid request' });
  }
  try {
    const user1 = await User.findById(user1Id);
    const user2 = await User.findById(user2Id);
    if (!user1 || !user2) {
      return res.status(404).json({ message: 'User not found' });
    }

    const request = await Chat.findOne({
      user1: user2Id,
      user2: user1Id,
      status: 'pending'
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    await Chat.findOneAndUpdate(
      { user1: user2Id, user2: user1Id },
      { status: 'accepted' }
    );

    res.status(201).json({ message: 'Request accepted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rejectRequest = async (req, res) => {
  const { user1Id, user2Id } = req.body;
  if (!user1Id || !user2Id) {
    return res.status(400).json({ message: 'Invalid request' });
  }
  try {
    const user1 = await User.findById(user1Id);
    const user2 = await User.findById(user2Id);
    if (!user1 || !user2) {
      return res.status(404).json({ message: 'User not found' });
    }

    const request = await Chat.findOne({
      user1: user2Id,
      user2: user1Id,
      status: 'pending'
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    await Chat.findOneAndUpdate(
      { user1: user2Id, user2: user1Id },
      { status: 'rejected' }
    );

    res.status(201).json({ message: 'Request rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
