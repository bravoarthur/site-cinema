'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import MovieCardLarge from '../../components/MovieCardLarge';
import { Movie, Category } from '../../types';
import styles from '../../styles/Search.module.scss';

const PAGE_SIZE = 8;

export default function Search() {
  const searchParams = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [actorDirector, setActorDirector] = useState<string>('');
  const [sort, setSort] = useState<string>('title-asc');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0); // próxima página a carregar (0-based)

  // Evita condições de corrida (respostas antigas sobrescrevendo as novas)
  const fetchTokenRef = useRef(0);

  const debouncedActorDirector = useDebounce(actorDirector, 1200);

  // Inicializa filtros da URL assim que categorias existirem
  useEffect(() => {
    const query = searchParams.get('query');
    if (query && categories.length > 0) {
      const isCategory = categories.find(
        (cat) =>
          cat.title?.toLowerCase() === query.toLowerCase() ||
          cat.name?.toLowerCase() === query.toLowerCase()
      );
      if (isCategory) {
        setSelectedCategories([isCategory.title || isCategory.name!]);
      } else {
        setActorDirector(query);
      }
    }
  }, [searchParams, categories]);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (!error) setCategories(data || []);
  }, []);

  // Busca paginada de filmes
  const fetchMovies = useCallback(
    async ({ reset = false }: { reset?: boolean } = {}) => {
      // calcula a página a carregar
      const pageToLoad = reset ? 0 : page;
      const token = ++fetchTokenRef.current;

      setIsLoading(true);
      try {
        let queryBuilder = supabase.from('movies').select('*');

        // Filtro por categorias (AND com os demais filtros)
        if (selectedCategories.length > 0) {
          queryBuilder = queryBuilder.contains('categories', selectedCategories);
        }

        // Busca parcial em título/atores/diretores (usa colunas *_text criadas no banco)
        if (debouncedActorDirector?.trim()) {
          const term = debouncedActorDirector.trim();
          queryBuilder = queryBuilder.or(
            `title.ilike.%${term}%,actors_text.ilike.%${term}%,directors_text.ilike.%${term}%`
          );
        }

        // Ordenação estável (campo + id como tie-breaker)
        const [field, order] = sort.split('-');
        queryBuilder = queryBuilder
          .order(field, { ascending: order === 'asc' })
          .order('id', { ascending: true });

        // Paginação: 8 por vez
        const from = pageToLoad * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        queryBuilder = queryBuilder.range(from, to);

        const { data, error } = await queryBuilder;

        // Se chegou uma resposta antiga, ignora
        if (token !== fetchTokenRef.current) return;

        if (error) {
          console.error('Erro ao carregar filmes:', error.message);
          if (reset) {
            setMovies([]);
            setHasMore(false);
            setPage(0);
          }
          return;
        }

        const rows = data || [];

        if (reset) {
          setMovies(rows);
        } else {
          setMovies((prev) => [...prev, ...rows]);
        }

        // Se retornou menos que PAGE_SIZE, não há mais
        setHasMore(rows.length === PAGE_SIZE);

        // Atualiza a "próxima página" somente após sucesso
        setPage(pageToLoad + 1);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCategories, debouncedActorDirector, sort, page]
  );

  // Carregar categorias ao montar
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Sempre que filtros mudarem, resetar paginação e refazer a primeira busca
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    setMovies([]);
    fetchMovies({ reset: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, debouncedActorDirector, sort]);

  // Skeleton enquanto digita (antes do debounce)
  useEffect(() => {
    if (actorDirector) setIsLoading(true);
  }, [actorDirector]);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Buscar Filmes</h1>

      <div className={styles.filtersBox}>
        <div className={styles.searchOrderBox}>
          <div>
            <h3>Ator/Diretor/Título</h3>
            <input
              type="text"
              value={actorDirector}
              onChange={(e) => setActorDirector(e.target.value)}
              placeholder="Digite ator, diretor ou título"
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

        <div className={styles.catBox}>
          <h3>Categorias</h3>
          <div className={styles.categories}>
            {categories.length > 0 ? (
              categories.map((cat) => {
                const label = cat.title || cat.name!;
                return (
                  <label key={cat.id}>
                    <input 
                      type="checkbox"
                      value={label}
                      checked={selectedCategories.includes(label)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories((prev) => [...prev, label]);
                        } else {
                          setSelectedCategories((prev) =>
                            prev.filter((c) => c !== label)
                          );
                        }
                      }}
                    />
                    {label}
                  </label>
                );
              })
            ) : (
              <p>Nenhuma categoria disponível.</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.results}>
        {movies.length > 0 &&
          movies.map((movie) => <MovieCardLarge key={movie.id} movie={movie} />)}
      </div>

      {/* Estados de UI */}
      {isLoading && movies.length === 0 && <SkeletonLoader />}
      {!isLoading && movies.length === 0 && <p>Nenhum filme encontrado.</p>}

      {/* Botão "Carregar mais" */}
      {movies.length > 0 && hasMore && (
        <div className={styles.loadMoreBox}>
          <button
            className={styles.loadMoreBtn}
            onClick={() => fetchMovies()}
            disabled={isLoading}
          >
            {isLoading ? 'Carregando...' : 'Carregar mais'}
          </button>
        </div>
      )}

      {/* Mensagem de fim de lista */}
      {!hasMore && movies.length > 0 && (
        <p className={styles.endMessage}>Todos os filmes foram carregados.</p>
      )}
    </main>
  );
}
