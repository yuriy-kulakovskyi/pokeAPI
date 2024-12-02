import React from 'react';
import { PokemonDetails } from '../lib/definitions';


interface PokemonListProps {
  pokemons: PokemonDetails[];
}

const List: React.FC<PokemonListProps> = ({ pokemons }) => {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {pokemons.map((pokemon) => (
        <li
          key={pokemon.id}
          className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center text-center"
        >
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="w-24 h-24 object-contain mb-4"
          />
          <h2 className="text-lg font-bold capitalize">{pokemon.name}</h2>
          <p className="text-sm text-gray-600">Types: {pokemon.types.join(', ')}</p>
        </li>
      ))}
    </ul>
  );
};

export default List;
