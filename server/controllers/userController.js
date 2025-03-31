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