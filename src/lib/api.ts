import axios from 'axios';
import { PokemonDetails } from './definitions';

export const fetchPokemonList = async (offset: number) => {
  const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=30`);
  return data.results;
};

export const fetchPokemonDetails = async (url: string): Promise<PokemonDetails> => {
  const response = await axios.get(url);
  const { id, name, sprites, types } = response.data;
  return {
    id,
    name,
    sprite: sprites.front_default,
    types: types.map((typeInfo: { type: { name: string } }) => typeInfo.type.name),
  };
};
