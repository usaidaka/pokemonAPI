const { default: axios } = require("axios");
const fs = require("fs");
const _ = require("lodash");
const { isPrime, fibonacci } = require("../../utils");

const dirFile = `${__dirname}/../../assets/pokemon.json`;

const getPokemonDetail = async (name) => {
  const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
  return result.data;
};

const fetchPokemonList = async () => {
  const result = await axios.get("https://pokeapi.co/api/v2/pokemon");

  return result.data;
};

const getPokemonListFromDB = async () => {
  const data = fs.readFileSync(dirFile);
  return JSON.parse(data);
};

const getPokemonDetailFromDB = async (id) => {
  let getDataDB = await getPokemonListFromDB();
  getDataDB = getDataDB.filter((poke) => String(poke.id) === String(id));
  return getDataDB[0];
};

const catchPokemonList = async (name) => {
  const gacha = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
  let response = {};

  if (!gacha) {
    response = { ok: false, message: "Unfortunately! Your catch is dodge" };
    return response;
  }

  const caught = await getPokemonDetail(name);

  let getDataDB = await getPokemonListFromDB();

  let latestId = 0;
  if (getDataDB.length !== 0) {
    latestId = getDataDB[getDataDB.length - 1].id + 1;
  }

  /* FORMATTING NICKNAME */
  const filteredPokeByName = getDataDB.filter((poke) =>
    poke.name?.includes(name)
  );

  const caughtPokeByName = filteredPokeByName.filter((poke) =>
    poke.nickname?.includes("-")
  );

  let sequenceFiboByName = filteredPokeByName.map(
    (x) => x.nickname.split("-")[1]
  );

  sequenceFiboByName = sequenceFiboByName.filter((x) => x !== undefined);
  sequenceFiboByName = sequenceFiboByName.map((x) => Number(x));
  sequenceFiboByName = _.sortBy(sequenceFiboByName);

  let sequenceFibo = caughtPokeByName.map((x) =>
    Number(x.nickname.split("-")[1])
  );
  sequenceFibo = _.sortBy(sequenceFibo);

  const findMissing = () => {
    for (let i = 0; i < sequenceFiboByName.length; i++) {
      console.log("test 1");
      if (sequenceFiboByName[i] !== undefined) {
        console.log("test 2");
        if (sequenceFiboByName[i] !== sequenceFibo[i]) {
          console.log("test 3");
          return sequenceFibo[i];
        }
      }
    }
  };
  console.log(findMissing(), "<<findMissing");

  let fiboCaughtAsMany = caughtPokeByName.length;
  const actualCaughtAsMany = filteredPokeByName.length;

  let fiboCount = await fibonacci(actualCaughtAsMany);

  let nickName = "";

  console.log(sequenceFibo, "<a sequenceFibo");
  console.log(sequenceFiboByName, "<<sequenceFiboByName");

  if (actualCaughtAsMany === 1) {
    nickName = `${caught.name}-0`;
  } else if (!fiboCaughtAsMany && actualCaughtAsMany <= 1) {
    nickName = caught.name;
  } else {
    if (!filteredPokeByName[0].nickname.includes(caught.name)) {
      fiboCaughtAsMany += 1;
    }

    fiboCount = await fibonacci(fiboCaughtAsMany);
    nickName = `${caught.name}-${fiboCount}`;
  }

  const pokemonData = {
    id: latestId,
    url: caught.forms[0].url,
    name: caught.name,
    nickname: nickName,
  };

  getDataDB.push(pokemonData);

  response = pokemonData;
  getDataDB = JSON.stringify(getDataDB);
  fs.writeFileSync(dirFile, getDataDB);

  return { ok: true, message: "Gacha! Your pokemon caught", response };
};

const releasePokemonList = async (id) => {
  const randomNumberGenerator = Math.floor(Math.random() * 100);

  const isPokeExist = await getPokemonDetailFromDB(id);

  const checkIsPrime = isPrime(randomNumberGenerator);

  let response = {};

  if (!isPokeExist) {
    response = {
      ok: false,
      message: "Pokemon not found",
    };
    return response;
  }

  if (!checkIsPrime) {
    response = {
      ok: false,
      message: "Ding Dong! Release failed, try again later",
    };
    return response;
  }

  let getDataDB = await getPokemonListFromDB();
  getDataDB = getDataDB.filter((poke) => String(poke.id) !== String(id));

  getDataDB = JSON.stringify(getDataDB);
  fs.writeFileSync(dirFile, getDataDB);

  response = { ok: true, message: "Nice! My pokemon released" };
  return response;
};

const renamePokemonList = async (id, nickname) => {
  let response = {};
  const isPokeExist = await getPokemonDetailFromDB(id);
  const getDataDB = await getPokemonListFromDB();

  let nickName = "";

  if (!isPokeExist) {
    response = {
      ok: false,
      message: "Pokemon not found",
    };
    return response;
  }

  const isNicknameUsed = getDataDB.some((poke) => poke.nickname === nickname);

  if (!isNicknameUsed) {
    if (nickname.includes("-")) {
      response = {
        ok: false,
        message: "renaming using '-' are prohibited",
      };
      return response;
    }
    nickName = nickname;
  } else {
    if (nickname.includes("-")) {
      response = {
        ok: false,
        message: "renaming using '-' are prohibited",
      };
      return response;
    }

    let filteredPokeByName = getDataDB.filter((poke) =>
      poke.nickname?.includes(nickname)
    );
    filteredPokeByName = filteredPokeByName.map((poke) => poke.nickname);
    console.log(filteredPokeByName.length, "filteredPokeByName");
    if (filteredPokeByName.length === 1) {
      nickName = `${nickname}-0`;
    } else {
      const fiboCount = await fibonacci(filteredPokeByName.length);
      nickName = `${nickname}-${fiboCount}`;
    }
  }

  let editDataDB = getDataDB.map((poke) => {
    if (String(poke.id) === String(id)) {
      poke.nickname = nickName;
    }
    return poke;
  });

  editDataDB = JSON.stringify(editDataDB);
  fs.writeFileSync(dirFile, editDataDB);

  response = {
    ok: true,
    message: "Congrats!, Pokemon renamed",
    data: nickName,
  };
  return response;
};

module.exports = {
  getPokemonDetail,
  fetchPokemonList,
  catchPokemonList,
  renamePokemonList,
  releasePokemonList,
};
