const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: "Pas de token, accès refusé" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'smart_planner_secret_key!@#');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token invalide" });
  }
};
