import { PokemonDetails } from "../lib/definitions";

interface IListprops {
  pokemons: PokemonDetails[];
  imageLoading: Record<number, boolean>;
  handleImageLoad: (id: number) => void;
}

const List: React.FC<IListprops> = ({ pokemons, imageLoading, handleImageLoad }) => {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {pokemons.map((pokemon, index) => (
        <li
          key={index}
          className="transition hover:scale-105 bg-white rounded-lg shadow-lg p-4 flex flex-col items-center text-center"
        >
          {imageLoading[pokemon.id] !== false && (
            <div className="w-24 h-24 bg-gray-300 animate-pulse rounded-full mb-4"></div>
          )}
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className={`w-24 h-24 object-contain mb-4 transition-opacity ${
              imageLoading[pokemon.id] === false ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => handleImageLoad(pokemon.id)}
          />
          <h2 className="text-lg font-bold capitalize">{pokemon.name}</h2>
          <p className="text-sm text-gray-600">Types: {pokemon.types.join(', ')}</p>
        </li>
      ))}
    </ul>
  );
}
 
export default List;