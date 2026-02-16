import User from "../models/User.js";

// ✅ Get Logged-in User Profile
export const getUserProfile = async (req, res) => {
  try {
    // req.user is set by protect middleware
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
