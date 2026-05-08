import { updateProfileService } from "../services/updateProfile.Services.js";

export const updateProfile = async (req, res) => {
  const { name, contact, address } = req.body;

  if (!name || !contact || !address)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const user = await updateProfileService(req.user.id, { name, contact, address });
    res.status(200).json({ success: true, message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
