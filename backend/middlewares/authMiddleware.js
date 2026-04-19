const jwt = require("jsonwebtoken");

const ensureAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({ message: "Unauthorized, JWT token is require" });
  }

  try {
    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET || "fallback_secret");
    req.user = decoded; // The payload extracted from the token (contains _id)
    next();
  } catch (err) {
    return res.status(403).json({ message: "Unauthorized, JWT token is wrong or expired" });
  }
};

module.exports = { ensureAuthenticated };
