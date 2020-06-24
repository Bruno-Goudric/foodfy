const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');
const RecipeFile = require('./LoadFile');

async function includeDepencies(paramIn)
{
  let results = [];
  let recipes = [];

  if (!Array.isArray(paramIn))
    results.push(paramIn);
  else
    results = paramIn;

  const promise = results.map(async recipe =>
  {
    recipe.author = await includeAuthor(recipe);
    recipe.files = await includeFiles(recipe);
    return recipe;
  });

  recipes = await Promise.all(promise);

  return recipes;
}

async function includeAuthor({ chef_id })
{
  return await Chef.findById(chef_id);
}

async function includeFiles({ id })
{
  let files = await RecipeFile.findByRecipe(id);
  files = files.map(file =>
  {
    return {
      ...file,
      src: (`${file.path.replace('public', '')}`).split('\\').join('/')
    };
  });

  return files;
}

const LoadRecipe =
{
  async findOne(filter)
  {
    let results = await Recipe.findOne(filter);

    results = await includeDepencies(results);

    return results[0];

  },
  async findAll(filter, params)
  {
    let results = await Recipe.findAll(filter, params);

    results = await includeDepencies(results);

    return results;
  },

  async deleteByUser(userId)
  {
    const recipes = await Recipe.findAll({ where: { user_id: userId } });

    if (!recipes)
      return;

    const promiseRecipeFiles = recipes.map(recipe => RecipeFile.deleteFilesByRecipe(recipe.id));

    await Promise.all(promiseRecipeFiles);

    const promiseRecipe = recipes.map(recipe => Recipe.delete(recipe.id));

    await Promise.all(promiseRecipe);
  }
};

module.exports = LoadRecipe;