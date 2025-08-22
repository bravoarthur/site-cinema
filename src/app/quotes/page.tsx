'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import QuoteCard from '../../components/QuoteCard';
import { Quote } from '../../types';
import styles from '../../styles/Quotes.module.scss';

export default function Quotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase.from('quotes').select('category');
    const uniqueCategories = Array.from(new Set(data?.map((item: { category: string }) => item.category) || []));
    setCategories(uniqueCategories);
  }, []);

  const fetchQuotes = useCallback(async () => {
    let query = supabase
      .from('quotes')
      .select('*, movies!inner(title)')
      .range((page - 1) * 10, page * 10 - 1);

    if (selectedCategory) {
      query = query.eq('category', selectedCategory);
    }

    const { data } = await query;
    setQuotes((prev) => (page === 1 ? (data as Quote[]) || [] : [...prev, ...((data as Quote[]) || [])]));
  }, [page, selectedCategory]);

  useEffect(() => {
    fetchCategories();
    fetchQuotes();
  }, [fetchCategories, fetchQuotes]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className={styles.main}>
      <h1 className={styles.titleQuotePage}>Frases Icônicas de Filmes</h1>
      <div className={styles.filters}>
        {categories.length > 0 ? (
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Todas as Categorias</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        ) : (
          <p>Nenhuma categoria disponível.</p>
        )}
      </div>
      <div className={styles.quotes}>
        {quotes.length > 0 ? (
          quotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={{ ...quote, movie_title: quote.movies?.title || 'Desconhecido' }}
            />
          ))
        ) : (
          <p>Nenhuma frase encontrada.</p>
        )}
      </div>
    </main>
  );
}