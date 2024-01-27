const _ = require('lodash');

const getPokemonList = async (dataObject) => {
  const { name } = dataObject;
  
  let pokemon = [
    {
      "id": 1,
      "name": "bulbasaur",
      "url": "https://pokeapi.co/api/v2/pokemon/1/"
    },
    {
      "id": 2,
      "name": "ivysaur",
      "url": "https://pokeapi.co/api/v2/pokemon/2/"
    },
    {
      "id": 3,
      "name": "venusaur",
      "url": "https://pokeapi.co/api/v2/pokemon/3/"
    }
  ];
  if (!_.isEmpty(name)) {
    pokemon = _.filter(pokemon, (item) => item.name.toLowerCase() === name.toLowerCase());
  }

  return Promise.resolve(pokemon);
}

module.exports = {
  getPokemonList
}
