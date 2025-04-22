const jwt = require("jsonwebtoken");

const authenticateAdmin = (req, res, next) => {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};


const authenticateEmployee = (req, res, next) => {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optionally ensure this is not an admin
    if (decoded.isAdmin) {
      return res.status(403).json({ error: "Access denied. Employees only." });
    }

    // Attach employee data to request object
    req.employee = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

module.exports = { authenticateAdmin  , authenticateEmployee};
