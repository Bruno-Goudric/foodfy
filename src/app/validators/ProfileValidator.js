const { compare } = require('bcryptjs');

const User = require('../models/User');

class ProfileValidator
{
  async index(req, res, next)
  {
    const userId = req.session.userId;

    const user = await User.findById(userId);

    if (!user)
      return res.render('./session/login', { error: 'Usuário não existe' });

    req.user = user;

    return next();
  }

  async put(req, res, next)
  {
    const userId = req.session.userId;

    const { password, email } = req.body;

    if (!password)
      return res.render('./profile/index', { error: 'Senha obrigatória'} );

    if (!userId)
      return res.render('./profile/index', 
      { error: `Usuário de id ${userId} não encontrado`} );
  
    const user = await User.findById(userId);

    if (!user)
      return res.render('./profile/index', { error: 'Usuário não existe'} );

    if (!(await compare(password, user.password)))
      return res.render('./profile/index', 
      { user, error: 'Senha ou usuário estão incorretos'});

    if (email != user.email &&(await User.findOne({ where: { email }})))
      return res.render('./profile/index', 
      { error: `Já existe um usuário cadastrado com o email '${email}'`} );

    req.user = user;

    return next();
  }
}

module.exports = new ProfileValidator();