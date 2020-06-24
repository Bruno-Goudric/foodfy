const User = require('../models/User');
class UserValidator
{
  async post(req, res, next)
  {
    const { name, email, isAdmin } = req.body

    const is_admin = isAdmin ? true : false;

    if (!name || !email)
      return res.render('./users/create', 
      { 
        user: { name, email, is_admin }, 
        error: 'O nome e o email são obrigatórios' 
      }); 

    const newUser = { name, email, is_admin };

    const user = await User.findOne({ where: { email } });

    if (user)
      return res.render('./users/create', 
      { 
        user: newUser, 
        error: 'Já existe um usuário cadastrado com esse email' 
      });

    req.user = newUser;

    return next();
  }
  async show(req, res, next)
  {
    const { id } = req.params;

    if (!id)
      return res.render('./users/index', { error: 'Parametro inválido'});

    const user = await User.findById(id);

    if (!user)
      return res.render('./users/index', { error: 'Usuário não encontrado'});

    req.user = user;

    return next();
  }

  async edit(req, res, next)
  {
    const { id } = req.params;

    if (!id)
      return res.render('./users/index', { error: 'Parametro inválido'});

    const user = await User.findById(id);

    if (!user)
      return res.render('./users/index', { error: 'Usuário não encontrado'});

    const { name, email, is_admin } = user;

    if (!name || !email)
      return res.render('./users/create', 
      { 
        user: { name, email, is_admin }, 
        error: 'O nome e o email são obrigatórios' 
      }); 

    req.user = { id, name, email, is_admin };

    return next();
  }

  async delete(req, res, next)
  {
    const { id } = req.body;

    if (!id)
      return res.render('./users/index', { error: 'Parametro inválido' });

    const { userId } = req.session;

    const user = await User.findById(id);

    if (!user)
      return res.render('./users/index', { error: 'Usuário não existe' });

    if (user.id == userId)
      return res.render('./users/index', { error: 'Você não pode deletar sua própria conta'});

    req.user = user;

    return next();
  }

  async put(req, res, next)
  {    
    const { id } = req.body;

    if (!id)
      return res.render('./users/index', { error: 'Parametro inválido'});

    const user = await User.findById(id);

    if (!user)
      return res.render('./users/index', { error: 'Usuário não encontrado'});

    const { name, email, isAdmin } = req.body;

    const is_admin = isAdmin ? true : false;

    req.user = { id, name, email, is_admin };

    return next();
  }
}

module.exports = new UserValidator();