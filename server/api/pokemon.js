const Router = require('express').Router();

const Validation = require('../helpers/validationHelper');
const PokemonHelper = require('../helpers/pokemonHelper');
const GeneralHelper = require('../helpers/generalHelper');

const fileName = 'server/api/pokemon.js';

const list = async (request, reply) => {
  try {
    Validation.pokemonListValidation(request.query);

    const { name } = request.query;
    const response = await PokemonHelper.getPokemonList({ name });

    return reply.send(response);
  } catch (err) {
    console.log([fileName, 'list', 'ERROR'], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
}

Router.get('/list', list);

module.exports = Router;
