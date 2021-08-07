import * as t from 'io-ts';

const stringOrNull = t.union([t.string, t.null]);

const pokemonAbility = t.type({
  ability: t.type({
    name: t.string,
    url: t.string,
  }),
  is_hidden: t.boolean,
  slot: t.number,
});

const pokemonSprites = t.type({
  back_default: stringOrNull,
  back_female: stringOrNull,
  back_shiny: stringOrNull,
  back_shiny_female: stringOrNull,
  front_default: stringOrNull,
  front_female: stringOrNull,
  front_shiny: stringOrNull,
  front_shiny_female: stringOrNull,
});

export const pokemon = t.type({
  abilities: t.array(pokemonAbility),
  base_experience: t.number,
  height: t.number,
  id: t.number,
  name: t.string,
  order: t.number,
  weight: t.number,
  sprites: pokemonSprites,
});
