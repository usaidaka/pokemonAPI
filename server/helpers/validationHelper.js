const Joi = require('joi');
const Boom = require('boom');

const pokemonListValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().optional().description('Pokemon name; i.e. Bulbasaur')
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

module.exports = {
  pokemonListValidation
};
