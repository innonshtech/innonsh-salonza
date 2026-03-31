/**
 * Role-Based Access Control Middleware
 * Used for authorizing access based on user roles
 * Must be used after authMiddleware (which attaches user to req)
 */
const allowRoles = (...roles) => {
  return (req, res, next) => {
    // 1. Check if req.user exists (set by authMiddleware)
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized. User not authenticated." 
      });
    }

    // 2. Extract user role (should be in the decoded JWT)
    const userRole = req.user.role;

    // 3. Check if user's role is in the list of allowed roles
    if (!roles.includes(userRole)) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden. Role '${userRole}' does not have access.` 
      });
    }

    // 4. Role is allowed, proceed to the next middleware or route handler
    next();
  };
};

module.exports = allowRoles;
