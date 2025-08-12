'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import MovieCardLarge from '../../components/MovieCardLarge';
import { Movie, Category } from '../../types';
import styles from '../../styles/Search.module.scss';

export default function Search() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [actorDirector, setActorDirector] = useState<string>('');
  const [sort, setSort] = useState<string>('title-asc');

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase.from('categories').select('*');
    setCategories(data || []);
  }, []);

  const fetchMovies = useCallback(async () => {
    let query = supabase.from('movies').select('*');

    if (selectedCategories.length > 0) {
      query = query.contains('categories', selectedCategories);
    }

    if (minRating > 0) {
      query = query.gte('site_rating', minRating);
    }

    if (actorDirector) {
      query = query.or(`directors.ilike.%${actorDirector}%,actors.ilike.%${actorDirector}%`);
    }

    const [field, order] = sort.split('-');
    query = query.order(field, { ascending: order === 'asc' });

    const { data } = await query;
    setMovies(data || []);
  }, [selectedCategories, minRating, actorDirector, sort]);

  useEffect(() => {
    fetchCategories();
    fetchMovies();
  }, [fetchCategories, fetchMovies]);

  return (
    <main className={styles.main}>
      <h1>Buscar Filmes</h1>
      <div className={styles.filters}>
        <div>
          <h3>Categorias</h3>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <label key={cat.id}>
                <input
                  type="checkbox"
                  value={cat.title}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories([...selectedCategories, cat.title]);
                    } else {
                      setSelectedCategories(selectedCategories.filter((c) => c !== cat.title));
                    }
                  }}
                />
                {cat.title}
              </label>
            ))
          ) : (
            <p>Nenhuma categoria disponível.</p>
          )}
        </div>
        <div>
          <h3>Nota Mínima</h3>
          <input
            type="number"
            min="0"
            max="10"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
          />
        </div>
        <div>
          <h3>Ator/Diretor</h3>
          <input
            type="text"
            value={actorDirector}
            onChange={(e) => setActorDirector(e.target.value)}
          />
        </div>
        <div>
          <h3>Ordenar</h3>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="title-asc">Título (A-Z)</option>
            <option value="title-desc">Título (Z-A)</option>
            <option value="site_rating-asc">Nota (Crescente)</option>
            <option value="site_rating-desc">Nota (Decrescente)</option>
          </select>
        </div>
      </div>
      <div className={styles.results}>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCardLarge key={movie.id} movie={movie} />
          ))
        ) : (
          <p>Nenhum filme encontrado.</p>
        )}
      </div>
    </main>
  );
}