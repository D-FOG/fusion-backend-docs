// userController.js

const User = require("../models/User");

// user experiences

const createExperience = (req, res) => {
  const { userId, experienceData } = req.body;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      experienceData._id = new mongoose.Types.ObjectId(); // Generate unique ID
      user.experiences.push(experienceData);
      return user.save();
    })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to create experience" });
    });
};

// Update an existing experience for a user
const updateExperience = (req, res) => {
  const { userId, experienceId, experienceData } = req.body;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const experienceIndex = user.experiences.findIndex(
        (exp) => exp._id.toString() === experienceId
      );
      if (experienceIndex === -1) {
        return res.status(404).json({ error: "Experience not found" });
      }

      user.experiences[experienceIndex] = experienceData;
      return user.save();
    })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to update experience" });
    });
};

const deleteExperience = (req, res) => {
  const { userId, experienceId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const experienceIndex = user.experiences.findIndex(
        (exp) => exp._id.toString() === experienceId
      );
      if (experienceIndex === -1) {
        return res.status(404).json({ error: "Experience not found" });
      }

      user.experiences.splice(experienceIndex, 1); // Remove the experience
      return user.save();
    })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to delete experience" });
    });
};

const addWorkSection = async (req, res) => {
  const { userId } = req.params;
  const { myworkData } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If user already has mywork data, update it; otherwise, add new mywork data
    user.mywork = myworkData;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add/update mywork" });
  }
};

const addSocialProfiles = async (req, res) => {
  const { userId } = req.params;
  const { socialLinksData } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update or add social links
    user.socialLinks = socialLinksData;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add/update social links" });
  }
};

const addTopSkill = async (req, res) => {
  const { userId } = req.params;
  const { topSkillsData } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update or add top skills
    user.topSkills = topSkillsData;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add/update top skills" });
  }
};

const updateProfilePicture = async (req, res) => {
  const { userId } = req.params;
  const { profilePicture } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update profile picture
    user.profilePicture = profilePicture;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to change profile picture" });
  }
};

async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const { userId } = req.params; // Assuming you have implemented user authentication middleware

    // Retrieve user from database
    const user = await User.findById(userId);

    // Check if old password matches the one in the database
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password in the database
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

const updateUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, bio, phone, address } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.email = email;
    user.bio = bio;
    user.phone = phone;
    user.address = address;

    await user.save();
    res.json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateJobTitle = async (req, res) => {
    const { userId } = req.params;
    const { jobTitle } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update job title
      user.jobTitle = jobTitle;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to change job title' });
    }
  }

module.exports = {
  createExperience,
  updateExperience,
  deleteExperience,
  addWorkSection,
  addSocialProfiles,
  addTopSkill,
  updateProfilePicture,
  updateJobTitle,
  changePassword,
  updateUserInfo,
  deleteUser,
};
