import { signinService } from "../services/signin.Services.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const data = await signinService(email, password);
    res.status(200).json(data);
  } catch (error) {
    const status = error.message === "User not found" ? 404 : 401;
    res.status(status).json({ message: error.message });
  }
};

