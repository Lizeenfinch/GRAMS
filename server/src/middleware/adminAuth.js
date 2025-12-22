const auth = require('./auth');

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role === 'admin' || req.user.role === 'moderator') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Admin only.' });
    }
  });
};

module.exports = adminAuth;
