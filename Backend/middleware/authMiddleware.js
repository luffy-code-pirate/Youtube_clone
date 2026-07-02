import jwt from "jsonwebtoken";

// This function runs BEFORE a protected route's controller.
// It checks: "Does this request have a valid login token?"
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization; // expects "Bearer <token>"

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1]; // extract just the token part

  try {
    // verify() checks the token's signature and expiry using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // attach the logged-in user's ID to the request
    next(); // move on to the actual route handler
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};