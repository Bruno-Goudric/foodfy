'use strict';
const User = require('../models/User');

module.exports = {
  async onlyUsers(req, res, next) 
  {
    if(!req.session.userId)
      return res.redirect('/session/login');

    const user = await User.findById(req.session.userId);

    if (!user)
    {
      req.session.destroy();
      return res.redirect('/session/login');
    }

    return next();
  },

  isLogged(req, res, next)
  {
    if (req.session.userId)
      return res.redirect('/');

    return next();
  },

  async isAdmin(req, res, next)
  {
    if(!req.session.userId)
      return res.redirect('/session/login');

    if (!req.session.isAdmin)
      return res.redirect('/');

    const user = await User.findById(req.session.userId);

    if (!user)
    {
      req.session.destroy();
      return res.redirect('/session/login');
    }

    return next();
  }
};