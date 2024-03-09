const express = require('express');
var router = express.Router();
const authController = require("../controllers/auth.controller");

const {
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
  } = require('../controllers/user.controller');
  
  // Experience Routes
  router.post('/experiences', createExperience);
  router.put('/experiences/:experienceId', updateExperience);
  router.delete('/experiences/:experienceId', deleteExperience);
  
  // Work Section Route
  router.post('/work-section', addWorkSection);
  
  // Social Profiles Route
  router.post('/social-profiles', addSocialProfiles);
  
  // Top Skill Route
  router.post('/top-skills', addTopSkill);
  
  // Profile Picture Route
  router.post('/profile-picture/:userId', updateProfilePicture);
  
  // Job Title Route
  router.post('/job-title/:userId', updateJobTitle);
  
  // Change Password Route
  router.post('/change-password/:userId', changePassword);
  
  // Update User Info Route
  router.post('/update-user-info/:userId', updateUserInfo);
  
  // Delete User Route
  router.delete('/users/:userId', deleteUser);

module.exports = router;