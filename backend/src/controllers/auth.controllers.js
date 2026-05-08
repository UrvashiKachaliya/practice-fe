import { signupService } from "../services/signup.Services.js";

export const signup = async (req, res) => {
  const { name, email, password, contact, address } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const data = await signupService(name, email, password, contact, address);
    res.status(201).json(data);
  } catch (error) {
    const status = error.message === "Email already registered" ? 500 : 400;
    res.status(status).json({ message: error.message });
  }
};

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

