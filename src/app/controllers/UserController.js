const { randomBytes } = require('crypto');
const { hash } = require('bcryptjs');

const User = require('../models/User');
const LoadRecipe = require('../services/LoadRecipe');
const mailer = require('../../libs/mailer');


class UserController
{
  async index(req, res)
  {
    try 
    {
      let { search, page, limit } = req.query;
  
      page = page || 1;
      limit = limit || 12;
  
      let offset = limit * (page - 1);       
  
      const users = await User.findAll(undefined, 
      { 
        limit,
        offset,
        count: true,
        orderBy: 'updated_at desc' 
      });
  
      const pagination = 
      {
        search,
        page,
        total: users.length > 0 ? Math.ceil(users[0]._counttable / limit) : 0
      };
  
      return res.render('./users/index', { users, pagination });
    } catch (error) 
    {
      console.error(error);
    }
  }

  create(req, res)
  {
    return res.render('./users/create');
  }

  async post(req, res)
  {
    try
    {
      const { name, email, is_admin } = req.user;

      const reset_token = randomBytes(20).toString('hex');

      const password = await hash(email, 8);

      let reset_token_expires = new Date();
      reset_token_expires = reset_token_expires.setHours(reset_token_expires.getHours() + 48);

      const id = await User.create({ name, email, is_admin, reset_token, reset_token_expires, password });

      const user = await User.findById(id);

      await mailer.sendMail({
        to: user.email,
        from: 'noreply@foodfy.com.br',
        subject: 'Usuário criado com sucesso',
        html: `<h2>Bem vindo ao foodfy ${user.name}<h/2>
                <p>Clique no link abaixo onde você será direcionado ao pagina de nova senha.</p>    
                <p><a href="${process.env.APP_URL}/session/new-password?token=${reset_token}" target="_blank">Nova Senha</a></p>`
      });

      return res.redirect(`/admin/users`);

    } catch (error)
    {
      return res.render('./users/create', { error });
    }

  }

  async edit(req, res)
  {
    try 
    {
      return res.render('users/edit', { user: req.user});
    } catch (error) 
    {
      console.error(error);  
    }
  }

  async put(req, res)
  {
    try 
    {
      const user = req.user;

      await User.update(user.id, user);
  
      return res.redirect(`/admin/users/${user.id}/edit`);

    } catch (error) 
    {
     console.error(error); 
    }
  }

  async delete(req, res)
  {
    try 
    {
      const user = req.user;

      await LoadRecipe.deleteByUser(user.id);

      await User.delete(user.id);
  
      return res.render('users/index', { success: 'Usuário removido com sucesso' });
    } catch (error) 
    {
      console.error(error);
    }
  }
}

module.exports = new UserController();