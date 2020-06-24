const LoadRecipe = require('../services/LoadRecipe');
const LoadChef = require('../services/LoadChef');

module.exports = {
  async index(req, res)
  {
    try 
    {
      const recipes = await LoadRecipe.findAll(undefined, { limit: 6, orderBy: 'updated_at desc' });

      return res.render('./home/index', { recipes });

    } catch (error) 
    {
      console.error(error);
    }
  },

  async showRecipe(req, res)
  {
    try 
    {
      const recipe = await LoadRecipe.findOne({ where: { id: req.params.id } });

      if (!recipe)
        return res.render('./home/index', { error: 'Receita não encontrada' });

      return res.render('./home/show-recipe', { recipe });

    } catch (error) 
    {
      console.error(error);
    }
  },

  async searchRecipe(req, res)
  {
    try 
    {
      let { search, page, limit } = req.query;

      page = page || 1;
      limit = limit || 6;

      let offset = limit * (page - 1);

      const recipes = await LoadRecipe.findAll(
      search ? {  where: { title: search } } : undefined, 
      { 
        limit,
        offset,
        inLike: true,
        count: true,
        orderBy: 'updated_at desc' 
      });

      const pagination = 
      {
        search,
        page,
        total: recipes.length > 0 ? Math.ceil(recipes[0]._counttable / limit) : 0
      };

      return res.render('./home/search', { recipes, pagination });

    } catch (error) 
    {
      console.error(error);
    }
  },

  async listChef(req, res)
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
      
      return res.render('./home/chefs', { chefs, pagination });
    } catch (error) 
    {
      console.error(error);
    }
  },

  async showChef(req, res)
  {
    try 
    {
      const { id } = req.params;

      const chef = await LoadChef.findOne({ where: { id } });
  
      return res.render('./home/show-chef', { chef });
    } catch (error) 
    {
      console.error(error);  
    }
  },

  about(req, res)
  {
    return res.render('home/about');
  }
};