const Friend = require('../models/Friend');
const User = require('../models/User');
exports.friendRequest = async (req, res) => {
  const { username, friendUsername } = req.body;
  if (!username || !friendUsername) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }
  const lowerUsername = username.toLowerCase();
  const lowerFriendUsername = friendUsername.toLowerCase();
  try {
    const user = await User.findOne({ username: lowerUsername });
    const friend = await User.findOne({ username: lowerFriendUsername });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    if (user.username === friend.username) {
      return res
        .status(400)
        .json({ message: 'You cannot send request to yourself' });
    }

    const { pendingRequest, friendRequest: check2 } = await Friend.findOne({
      user: user.id,
    });
    const { friendRequest } = await Friend.findOne({ user: friend.id });
    const checkPending = pendingRequest.filter(e => e == friend.username);
    const checkRequest = check2.filter(e => e == friend.username);
    if (checkRequest.length) {
      return res.status(400).json({ message: 'Check your Pending request' });
    }
    if (checkPending.length) {
      return res.status(400).json({ message: 'Request already sent' });
    }
    await Friend.findOneAndUpdate(
      { user: user.id },
      { pendingRequest: [...pendingRequest, lowerFriendUsername] }
    );
    await Friend.findOneAndUpdate(
      { user: friend.id },
      {
        friendRequest: [...friendRequest, lowerUsername],
      }
    );
    res.status(201).json({ message: 'Request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
