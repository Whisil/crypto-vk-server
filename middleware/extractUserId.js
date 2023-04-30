import jwt from "jsonwebtoken";

export const extractUserId = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWTSECRET);

  req.userId = decodedToken._id;
  next();
};
