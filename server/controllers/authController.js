import bcrypt from 'bcryptjs'; // Use bcryptjs if bcrypt fails
import jwt from "jsonwebtoken";
import User from '../models/User.js';
import { response } from 'express';

export const register = async (req, res, next) => {
  try {
    const { username, email, password, aadhaar_number, firstname, lastname, parent_email, age, phone } = req.body;
    const role = req.body?.role?.toUpperCase() || "USER";
    if (role === "ADMIN") {
      return res.status(400).json({ message: "You can't register with an admin role" });
    }
    
    const ageVerified = parseInt(age) >= 18;
    
    // Efficient single query to check existing user data
    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { phone }],
    });

    if (existingUser) {
      let msg = "User already exists";
      if (existingUser.username === username) msg = "Username already used";
      else if (existingUser.email === email) msg = "Email already used";
      else if (existingUser.phone === phone) msg = "Phone number already used";

      return res.status(409).json({ msg, status: false });
    }

    // Hash password securely
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({ msg: "Error hashing password", status: false });
    }

    // Create new user
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      aadhaar_number,
      firstname,
      lastname,
      parent_email,
      age: parseInt(age),
      phone,
      imageUrl: "",
      age_verified: ageVerified,
    });

    // Convert to object and remove password before sending response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({ status: true, user: userResponse });
  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    return res.status(500).json({ msg: "Internal server error while signing up." });
  }
};

//login api

export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if ((!email && !username) || !password) {
      return res.status(400).json({ msg: "Email/Username and Password are required.", status: false });
    }

    // Find user by email or username
    const user = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (!user) {
      return res.status(401).json({ msg: "Invalid email or username.", status: false });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid password.", status: false });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({ status: true, msg: "Login successful", token, user }); 
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    return res.status(500).json({ msg: "Internal server error while logging in." });
  }
};


//searchContact
export const searchContact = async (req, res) => {
  try {
    const { name: searchTerm } = req.query;

    const contacts = await User.find({
      $or: [{ username: { $regex: searchTerm, $options: 'i' } }],
    });

    if (contacts.length === 0) {
      return res.status(200).json({
        success: false,
        data: contacts,
        message: 'No contacts found',
      });
    }

    // Only reached if contacts are found
    return res.status(200).json({
      success: true,
      data: contacts,
      message: 'Contacts found successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while searching contacts',
      error: error.message,
    });
  }
};


// 🟢 Update Profile (Secure)
export const updateProfile = async (req, res) => {
    try {
        const userData = req.body;
        const userId = req.params.id;

        // Validate userId 
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Check if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User ID format" });
        }

        const user = await User.find({ _id: userId })
        if (!user) {
            return res.json({ message: `User not found with ID ${userId}` });
        }

        // Use req.user._id from authMiddleware instead of body input
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { ...userData },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// 🟢 Logout User (Secure)
export const logoutUser = async (req, res) => {
    try {
        // Get ID from URL params first, then fallback to body
        const userId = req.params.id || req.body?.userId;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User ID format" });
        }

        // ... rest of your logout logic
        res.status(200).json({ 
            message: "Logged out successfully",
            userId: userId
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: "Logout failed", 
            error: error.message 
        });
    }
};


// 🟢 Update Privacy Settings (Secure)
export const updatePrivacySettings = async (req, res) => {
    try {
        const privacyData = req.body;
        const userId = req.params.id;

        // Validate userId 
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Check if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User ID format" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: `User not found with ID ${userId}` });
        }

        // Define allowed privacy settings to prevent unwanted updates
        const allowedUpdates = {
            profileVisibility: ['public', 'friends', 'private'],
            activityStatus: ['visible', 'hidden'],
            searchVisibility: ['visible', 'hidden'],
            dataSharing: ['enabled', 'disabled']
        };

        // Validate each privacy setting
        for (const [key, value] of Object.entries(privacyData)) {
            if (allowedUpdates[key] && !allowedUpdates[key].includes(value)) {
                return res.status(400).json({ 
                    message: `Invalid value for ${key}. Allowed values: ${allowedUpdates[key].join(', ')}` 
                });
            }
        }

        // Update only the privacy settings
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { privacySettings: { ...user.privacySettings, ...privacyData } },
            { new: true, runValidators: true }
        );

        res.status(200).json({ 
            message: "Privacy settings updated successfully", 
            privacySettings: updatedUser.privacySettings 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        });
    }
}

// 🟢 Get Privacy Settings (Secure)
export const getPrivacySettings = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User ID format" });
        }

        const user = await User.findById(userId).select('privacySettings');
        if (!user) {
            return res.status(404).json({ message: `User not found with ID ${userId}` });
        }

        res.status(200).json({ 
            privacySettings: user.privacySettings 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        });
    }
}
// In userController.js
export const unblockUser = async (req, res) => {
    try {
        // 1. Get the user ID from params
        const userIdToUnblock = req.params.userId;
        
        // 2. Get current user ID from auth middleware
        const currentUserId = req.user._id;  // Make sure your auth middleware sets req.user
        
        // 3. Validate IDs
        if (!mongoose.Types.ObjectId.isValid(userIdToUnblock)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        // 4. Perform the unblock operation
        const updatedUser = await User.findByIdAndUpdate(
            currentUserId,
            { $pull: { blockedUsers: userIdToUnblock } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Current user not found" });
        }

        // 5. Return success response
        res.status(200).json({
            success: true,
            message: "User unblocked successfully",
            blockedUsers: updatedUser.blockedUsers
        });

    } catch (error) {
        console.error("Unblock error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};