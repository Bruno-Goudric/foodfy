const User = require('../models/User');

class ProfileController 
{
  index(req, res)
  {
    return res.render('./profile/index', { user: req.user });    
  }
  
  async put(req, res)
  {
    try 
    {
      const user = req.user;

      let { name, email } = req.body;
  
      await User.update(user.id,
      {
        name: name ? name : user.name ,
        email: email ? email : user.email
      });
  
      return res.redirect('/admin/profile');
    } catch (error) 
    {
      console.error(error);
    }
  }
}

module.exports = new ProfileController();