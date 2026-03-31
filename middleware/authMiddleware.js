const jwt = require("jsonwebtoken");

/**
 * Middleware to protect routes by verifying JWT tokens
 * Expects header: Authorization: Bearer <token>
 */
const authMiddleware = async (req, res, next) => {
  try {
    // 1. Get the token from cookies or Authorization header
    let token = req.cookies && req.cookies.token;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "No token provided. Access denied." 
      });
    }

    // 3. Verify the token using JWT_SECRET
    // If invalid, jwt.verify throws an error that's caught in catch block
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the decoded user data (e.g. { userId: "..." }) to the request object
    req.user = decoded;

    // 5. Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    
    // Distinguish between expired tokens and other errors if needed
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false, 
        message: "Token has expired. Please log in again." 
      });
    }

    return res.status(403).json({ 
      success: false, 
      message: "Invalid token. Authentication failed." 
    });
  }
};

module.exports = authMiddleware;
