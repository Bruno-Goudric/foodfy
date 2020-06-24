const fs = require('fs');
const Chef = require('../models/Chef');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');
const Recipe = require('../models/Recipe');

async function includeDepencies(paramIn)
{
  let results = [];
  let chefs = [];

  if (!Array.isArray(paramIn))
    results.push(paramIn);
  else
    results = paramIn;

  const promise = results.map(async chef =>
  {
    chef.avatar = await includeFiles(chef.file_id);
    chef.recipes = await includeRecipes(chef);
    return { ...chef };
  });

  chefs = await Promise.all(promise);

  return chefs;
}

async function includeFiles(file_id)
{
  let file = undefined;
  if (file_id)
  {
    file = await File.findById(file_id);
    file = { ...file, src: (`${file.path.replace('public', '')}`).split('\\').join('/') };
  }
 
  return file;
}

async function includeRecipes({ id })
{
  let recipes = await Recipe.findAll({ where: { chef_id: id } }, { orderBy: 'created_at desc'});

  const recipePromise = recipes.map(async recipe =>
  {
    const fileRecipes = await RecipeFile.findAll({ where: { recipe_id: recipe.id } });

    if (fileRecipes.length > 0)
    {
      recipe.image = await File.findById(fileRecipes[0].file_id);
      recipe.image = { ...recipe.image, src: (`${recipe.image.path.replace('public', '')}`).split('\\').join('/') };
    }
    else
      recipe.image = undefined;

    return { ...recipe };
  });

  recipes = await Promise.all(recipePromise);

  return recipes;
}

function deleteFile(path)
{
  try
  {
    fs.unlinkSync(path);
  } catch (error)
  {
    console.error(`No such file or directory: ${path}`);
  }
}

const LoadChef = {
  selectOptions: () => ({ limit: 0, orderby: null }),

  async findOne(filter)
  {
    let results = await Chef.findOne(filter);

    results = await includeDepencies(results);

    return results[0];
  },

  async findAll(filter, params)
  {
    let results = await Chef.findAll(filter, params);

    results = await includeDepencies(results);

    return results;
  },

  async createOne({ name, filename, path })
  {
    const chef = { name };
    if (filename && path)
      chef.file_id = await File.create({ name: filename, path });

    const id = await Chef.create(chef);

    return id;
  },

  async deleteOne(id)
  {
    try
    {
      const chef = await Chef.findById(id);
      const file = await includeFiles(chef.file_id);

      if (file)
      {
        await File.delete(file.id);
        deleteFile(file.path)

      }

      await Chef.delete(chef.id);

    } catch (error)
    {
      console.error(error);
    }

  },

  async updateOne(id, { name, filename, path })
  {
    const updatedChef = { name };
    if (!id || id < 0)
      throw new Error('Chef id is invalid');

    const chef = await Chef.findById(id);

    let file_id = chef.file_id;
    let file = undefined;

    if (file_id)
      file = await File.findById(file_id);

    if (path)
      file_id = await File.create({ name: filename, path });

    await Chef.update(id, { name, file_id });

    if (file && path)
    {
      await File.delete(file.id).then(deleteFile(file.path));
    }
  }
};

module.exports = LoadChef;