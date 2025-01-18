import dashboardLogin from "../models/dashboardloginSchema.js"; // Correct import for default export
import jwt from "jsonwebtoken";

const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
      console.log(token);
      

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the user and exclude sensitive fields
    const user = await dashboardLogin.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    console.log(decodedToken);
    

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid access token" });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid access token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Access token expired" });
    }

    // For other unexpected errors
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { verifyJwt };
