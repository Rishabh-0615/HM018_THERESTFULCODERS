import jwt from "jsonwebtoken";

const generateAdminToken = (user, res) => {
  const token = jwt.sign(
    { 
      _id: user._id,
      role: user.role 
    },
    process.env.JWT_SEC,
    {
      expiresIn: "15d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  });

  return token;
};

export default generateAdminToken;