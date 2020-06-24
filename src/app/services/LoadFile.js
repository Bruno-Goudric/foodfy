const fs = require('fs');

const File = require('../models/File');
const FileRecipe = require('../models/RecipeFile');

function includeSource(file)
{
  return {
    ...file,
    src: (`${file.path.replace('public', '')}`).split('\\').join('/')
  };
}

async function create({ name, path, recipe_id })
{
  const file_id = await File.create({ name, path });

  await FileRecipe.create({ file_id, recipe_id });
};

function unlikeFile(path)
{
  try
  {
    fs.unlinkSync(path);
  } catch (error)
  {
    console.error(`Unable to remove this file ${path}`);
  }
}

async function deleteFilesByRecipe(recipe_id)
{

  const files = await FileRecipe.findAll({ where: { recipe_id } });
  const filePromise = files.map(async file =>
  {
    await FileRecipe.delete(file.id);

    file = await File.findById(file.file_id);

    file = includeSource(file);

    unlikeFile(file.path);
  });

  await Promise.all(filePromise);
};

async function findByRecipe(recipeId)
{
  let files = [];
  const fileRecipes = await FileRecipe.findAll({ where: { recipe_id: recipeId } });

  const filePromise = fileRecipes.map(async file =>
  {
    const result = await File.findById(file.file_id);

    return { ...file, ...result };
  });

  files = await Promise.all(filePromise);

  return files;

}

async function deleteOneFile(id)
{
  let path = '';
  try 
  {
    const file = await File.findById(id);

    if (!file)
      return;

    path = file.path;

    const fileRecipe = await FileRecipe.findOne({ where: { file_id: id } });

    await FileRecipe.delete(fileRecipe.id);
    await File.delete(file.id);

    unlikeFile(path);

  } catch (error)
  {
    console.error(error);
  }
}

module.exports =
{
  create,
  deleteFilesByRecipe,
  findByRecipe,
  deleteOneFile,
};