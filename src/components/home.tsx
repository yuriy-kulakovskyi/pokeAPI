import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Pokemon, PokemonDetails } from '../lib/definitions';
import List from './list';

const Home = () => {
  const [pokemons, setPokemons] = useState<PokemonDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>('https://pokeapi.co/api/v2/pokemon?limit=20');
  const [imageLoading, setImageLoading] = useState<Record<number, boolean>>({});
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchPokemons = useCallback(async () => {
    if (!nextUrl) return;
    try {
      setLoading(true);
      const { data } = await axios.get<{ results: Pokemon[]; next: string | null }>(nextUrl);

      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon): Promise<PokemonDetails> => {
          const response = await axios.get(pokemon.url);
          const { id, name, sprites, types } = response.data;
          return {
            id,
            name,
            sprite: sprites.front_default,
            types: types.map((typeInfo: { type: { name: string } }) => typeInfo.type.name),
          };
        })
      );

      setPokemons((prev) => [...prev, ...detailedPokemons]);
      setNextUrl(data.next);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [nextUrl]);

  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchPokemons();
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
  }, [fetchPokemons, loading]);

  const handleImageLoad = (id: number) => {
    setImageLoading((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">Pokemon list</h1>
      <List
        pokemons={pokemons}
        imageLoading={imageLoading}
        handleImageLoad={handleImageLoad}
      />
      <div ref={observerRef} className="h-20"></div>
      {loading && <p className="text-center text-blue-500 mt-4">Loading more Pokémon...</p>}
      {error && <p className="text-center text-red-500 mt-4">Error: {error}</p>}
    </main>
  );
}
 
export default Home;