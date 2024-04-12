const ReferralTree = require("../models/ReferralTree");

// Assign referrer a 10% bouns from referred user account verification payment
// Returns the remaining balance after 10% have been deducted
const verificationBonus = async (req, res, referrerId, totalAmount) => {
  const referredUserId = req.userId
  try {
    const tenPercentOfTotal = totalAmount * 0.1
    const remainingBalance = totalAmount - tenPercentOfTotal
   
    const referredUserTree = await ReferralTree.find({userId:referrerId, referredUsers: {$in: [referredUserId]}})
    if(!referredUserTree) return "ReferalTree not found"
    
    await ReferralTree.updateOne({userId:referredUserId}, {$inc: {earnings: tenPercentOfTotal}})
    return remainingBalance
  }catch(err) {
    return res.status(500).json({message: 'Internal server error'});
  }
}

// Assign referrer a 20% bouns from referred user gig payment
// Returns the remaining balance after 20% have been deducted
const gigPaymentBonus = async (req, res, referrerId, totalAmount) => {
  const referredUserId = req.userId
  try {
    const tenPercentOfTotal = totalAmount * 0.2
    const remainingBalance = totalAmount - tenPercentOfTotal
   
    const referredUserTree = await ReferralTree.find({userId:referrerId, referredUsers: {$in: [referredUserId]}})
    if(!referredUserTree) return "ReferalTree not found"
    
    await ReferralTree.updateOne({userId:referredUserId}, {$inc: {earnings: tenPercentOfTotal}})
    return remainingBalance
  }catch(err) {
    return res.status(500).json({message: 'Internal server error'});
  }
}

// Return the total earnings of all referrals trees are complete (has 5 referred users)
const availableReferralEearnings = async (req, res) => {
  const userId = req.userId
  try {
    const completedReferralTrees = await ReferralTree.find({userId, referredUsers: {$size: 5}})
    if(!completedReferralTrees.length) return 0

    const availableEearnings = completedReferralTrees.reduce((prevValue, accumulatedValue) => prevValue.earnings + accumulatedValue.earnings)
    return availableEearnings
  }catch (err) {
    return res.status(500).json({message: 'Internal server error'});
  }
}

module.exports = {
  verificationBonus,
  gigPaymentBonus,
  availableReferralEearnings
}