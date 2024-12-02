import React, { useEffect, useState, useRef } from 'react';
import { fetchPokemonList, fetchPokemonDetails } from '../lib/api';
import List from './list';
import { PokemonDetails } from '../lib/definitions';

const Home: React.FC = () => {
  const [pokemons, setPokemons] = useState<PokemonDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchPokemons = async (currentOffset: number) => {
    setLoading(true);
    setError(null);

    try {
      const results = await fetchPokemonList(currentOffset);
      const detailedPokemons = await Promise.all(
        results.map((pokemon: { url: string }) => fetchPokemonDetails(pokemon.url))
      );

      setPokemons((prev) => [...prev, ...detailedPokemons]);
    } catch (err) {
      setError('Failed to fetch Pokémon data. Try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons(offset);
  }, [offset]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setOffset((prev) => prev + 30);
        }
      },
      { root: null, rootMargin: '0px', threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">Pokémon List</h1>
      <List pokemons={pokemons} />
      <div ref={observerRef} className="h-20"></div>
      {loading && <p className="text-center text-blue-500 mt-4">Loading more Pokémon...</p>}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Home;