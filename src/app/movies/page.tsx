'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Movie } from '../../types';
import styles from '../../styles/Movies.module.scss';
import MovieCardSmall from '../../components/MovieCardSmall';

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Refs para manter os valores atuais de loading e hasMore dentro do callback
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const ITEMS_PER_PAGE = 10;

  const fetchMovies = useCallback(async (pageToLoad: number) => {
    if (loadingRef.current || !hasMoreRef.current) {
      console.log(`Bloqueando fetchMovies: loading=${loadingRef.current}, hasMore=${hasMoreRef.current}`);
      return;
    }

    console.log(`📥 Carregando página ${pageToLoad}...`);
    setLoading(true);

    const from = (pageToLoad - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('title', { ascending: true })
      .range(from, to);

    if (error) {
      console.error(`Erro ao carregar filmes:`, error.message);
      setHasMore(false);
      setLoading(false);
      return;
    }

    if (!data || data.length < ITEMS_PER_PAGE) {
      setHasMore(false);
    }

    setMovies((prev) => {
      const novos = data.filter((m) => !prev.some((pm) => pm.id === m.id));
      return [...prev, ...novos];
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMovies(page);
  }, [page, fetchMovies]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (
          window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
          hasMoreRef.current &&
          !loadingRef.current
        ) {
          console.log(`➡️ Próxima página: ${page + 1}`);
          setPage((prev) => prev + 1);
        }
      }, 250);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page]);

  return (
    <main className={styles.main}>
      <h1>Filmes</h1>
      <div className={styles.movieList}>
        {movies.length === 0 && !loading ? (
          <p>Nenhum filme encontrado.</p>
        ) : (
          movies.map((movie) => (
            <MovieCardSmall key={movie.id} movie={movie} />
          ))
        )}
      </div>
      {loading && <p>Carregando mais filmes...</p>}
      {!hasMore && movies.length > 0 && <p>Todos os filmes foram carregados.</p>}

      {/* Botão de reset */}
      <button
        onClick={() => {
          setMovies([]);
          setPage(1);
          setHasMore(true);
        }}
      >
        Resetar
      </button>
    </main>
  );
}