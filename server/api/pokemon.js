const Router = require("express").Router();

const Validation = require("../helpers/validationHelper");
const PokemonHelper = require("../helpers/pokemonHelper");
const GeneralHelper = require("../helpers/generalHelper");

const fileName = "server/api/pokemon.js";

// 1. Create rest api to get pokemon list (https://pokeapi.co/)
const fetchList = async (request, reply) => {
  try {
    Validation.pokemonListValidation(request.query);

    const response = await PokemonHelper.fetchPokemonList();

    return reply.json(response);
  } catch (err) {
    console.log([fileName, "list", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

// 2. Create rest api to get pokemon detail
const fetchPokemonDetail = async (request, reply) => {
  try {
    Validation.pokemonListValidation(request.query);

    const { name } = request.params;

    const response = await PokemonHelper.getPokemonDetail(name);
    return reply.json(response);
  } catch (err) {
    console.log([fileName, "detail", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const catchPokemon = async (request, reply) => {
  try {
    const { name } = request.body;
    const response = await PokemonHelper.catchPokemonList(name);
    return reply.json(response);
  } catch (err) {
    console.log([fileName, "catch", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

// TODO : Continue completing the function soon
const releasePokemon = async (request, reply) => {
  try {
    const { id } = request.params;
    console.log(id, "<<< ID PARAMS");

    const response = await PokemonHelper.releasePokemonList(id);
    return reply.json(response);
  } catch (err) {
    console.log([fileName, "release", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const renamePokemon = async (request, reply) => {
  try {
    const { id } = request.params;
    const { nickname } = request.body;
    console.log(id, "<<< id PARAMS");
    console.log(nickname, "<<< nickname PARAMS");

    const response = await PokemonHelper.renamePokemonList(id, nickname);

    if (!response.ok) {
      return reply.status(400).json(response);
    }

    return reply.status(201).json(response);
  } catch (err) {
    console.log([fileName, "list", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/fetch", fetchList);
Router.post("/fetch", catchPokemon);
Router.get("/fetch/:name", fetchPokemonDetail);
Router.delete("/fetch/:id", releasePokemon);
Router.patch("/fetch/:id", renamePokemon);

module.exports = Router;
