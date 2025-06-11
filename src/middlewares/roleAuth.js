// middlewares/roleAuth.js
module.exports = function (roles = []) {
    return (req, res, next) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.sendStatus(401);
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!roles.includes(payload.role)) return res.sendStatus(403);
        req.user = payload;
        next();
      } catch (err) {
        return res.sendStatus(401);
      }
    };
  };
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();  