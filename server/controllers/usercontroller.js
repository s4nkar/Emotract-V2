
import User from "../models/user.js"; // Ensure this model exists
import mongoose from "mongoose";


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