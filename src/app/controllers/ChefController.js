const LoadChef = require('../services/LoadChef');

module.exports = {

  async index(req, res)
  {
    try 
    {
      let { search, page, limit } = req.query;
  
      page = page || 1;
      limit = limit || 12;
  
      let offset = limit * (page - 1);   
  
      const chefs = await LoadChef.findAll(undefined, 
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
        total: chefs.length > 0 ? Math.ceil(chefs[0]._counttable / limit) : 0
      };
      
      return res.render('./chefs/index', { chefs, pagination });
      
    } catch (error) 
    {
      console.error(error);
    }
  },

  create(req, res)
  {
    return res.render('./chefs/create');
  },

  async post(req, res)
  {
    
    const { filename, path } = req.avatar;

    const { name } = req.body;

    try
    {
      const id = await LoadChef.createOne({ name, filename, path });

      return res.redirect(`/admin/chefs/${id}`);

    } catch (error)
    {
      console.error(error);
      require('fs').unlinkSync(path);
      return res.render('/admin/chefs/create', { error });
    }

  },

  async show(req, res)
  {
    try 
    {
      const { id } = req.params;

      const chef = await LoadChef.findOne({ where: { id } });
  
      return res.render('./chefs/show', { chef });
    } catch (error) 
    {
      console.error(error);  
    }

  },

  async edit(req, res)
  {
    try 
    {
      const { id } = req.params;

      const chef = await LoadChef.findOne({ where: { id } });

      return res.render('./chefs/edit', { chef });
    } catch (error) 
    {
      console.error(error);  
    }
  },

  async put(req, res)
  {
    const { id, name } = req.body;
    let filename = '';
    let path = '';

    try
    {
      if (req.files && req.files.length > 0)
      {
        filename = req.files[0].filename;
        path = req.files[0].path;
      }

      await LoadChef.updateOne(id, { name, filename, path });

      return res.redirect(`/admin/chefs/${id}`);

    } catch(error)
    {
      console.error(error);
      require('fs').unlinkSync(path);
      const chef = await LoadChef.findOne({ where: { id } });
      return res.render('./chefs/edit', { chef });
    }
  },

  async delete(req, res)
  {
    try 
    {
      const { id } = req.body;

      const chef = await LoadChef.findOne({ where: { id } });

      if (chef.recipes && chef.recipes.length > 0)
        return res.render('./chefs/edit', { chef, error: `${chef.name} não pode ser excluído pois possui receitas ativas` });

      await LoadChef.deleteOne(id);

      return res.redirect('/admin/chefs/');
    } catch (error) 
    {
      console.error(error);  
    }
    
  }

};