import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Helper: creates a signed JWT containing the user's ID, valid for 7 days
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // --- Validation (PDF requires error messages for invalid input) ---
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving (NEVER store plain text passwords)
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ message: "Registration successful", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // compare() checks the plain password against the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    // send back the token + basic user info (never send the password back!)
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/profile (protected route example)
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.userId).select("-password"); // exclude password field
  res.json(user);
};