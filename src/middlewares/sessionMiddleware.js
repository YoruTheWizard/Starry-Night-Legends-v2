const sessionUser = (req, res, next) => {
  res.locals.user = req.session.user;
  next();
};

const adminRequired = (req, res, next) => {
  if (!req.session.user) {
    req.session.save(() => res.redirect('/admin/auth'));
    return;
  }
  next();
};

module.exports = {
  sessionUser,
  adminRequired
};