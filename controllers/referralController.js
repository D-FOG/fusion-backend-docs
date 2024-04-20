const ReferralTree = require("../models/ReferralTree")
const { ObjectId } = require('mongodb');
const Builder = require("../models/builderModel");
const Hirer = require("../models/hirerModel");
const Advertiser = require("../models/advertiserModel");

exports.getReferalTree = async (req, res) => {
  const userId = req.userId
  try {
    const unwindedReferralTree = await ReferralTree.aggregate([
      { $match: { userId: new ObjectId(userId) } },
      {
        $lookup: {
          from: "users",
          localField: "referredUsers",
          foreignField: "_id",
          as: "referredUsers"
        }
      },
      {
        $unwind: "$referredUsers"
      },
      {
        $project: {
          "userId": 1,
          "earnings": 1,
          "referredUsers._id": 1,
          "referredUsers.role": 1,
          "referredUsers.username": 1
        }
      },
    ]); 

    const updatedUnwindedTrees = await Promise.all(unwindedReferralTree.map(async (unwindedTreeData) => {
      const user = unwindedTreeData.referredUsers
       switch (user.role) {
        case 'builder':
          const builder = await Builder.findOne({user: user._id}).select(['identity.profilePicture', 'identity.firstName', 'identity.lastName', '-_id']);
          unwindedTreeData.referredUsers = {...builder._doc, user}
          return unwindedTreeData
        case 'hirer':
          const hirer = await Hirer.findOne({user: user._id}).select(['identity.profilePicture', 'identity.firstName', 'identity.lastName', '-_id']);
          unwindedTreeData.referredUsers = {...hirer._doc, user}
          return unwindedTreeData
        case 'advertiser':
          const advertiser = await Advertiser.findOne({user: user._id}).select(['identity.profilePicture', 'identity.firstName', 'identity.lastName', '-_id']);
          unwindedTreeData.referredUsers = {...advertiser._doc, user}
          return unwindedTreeData
        default: 
          unwindedTreeData.referredUsers = {user}
        return unwindedTreeData
       }
    }))

    const grouped = []
    const structuredTrees = updatedUnwindedTrees.map(unwindedTreeData => {
      const {_id } = unwindedTreeData
      if(!grouped.includes(_id.toString())) {
        const { referredUsers, ...others } = unwindedTreeData
        const allSameTreeData = updatedUnwindedTrees.filter((data) =>  data._id.toString() === _id.toString())
        const groupedReferredUsers = allSameTreeData.map((data) => data.referredUsers)
        const groupedTree = {...others, referredUsers: groupedReferredUsers}
        grouped.push(_id.toString())
        return groupedTree      
      }
      return 
    })
    .filter((tree) => tree != null)
    
    res.status(200).json(structuredTrees)          
  }catch(err) {
    console.log(err, 'This is the error')
    res.status(500).json({message: 'Internal server error'})
  }
}