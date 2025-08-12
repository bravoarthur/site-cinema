'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import ArticleCard from '../../components/ArticleCard';
import { Article } from '../../types';
import styles from '../../styles/Articles.module.scss';

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchArticles = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const pageSize = 10;
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    if (data && data.length > 0) {
      // Evita artigos duplicados
      setArticles((prev) => {
        const existingIds = new Set(prev.map((a) => a.id));
        const newArticles = data.filter((a) => !existingIds.has(a.id));
        return [...prev, ...newArticles];
      });
      if (data.length < pageSize) setHasMore(false);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        setPage((prev) => (hasMore && !loading ? prev + 1 : prev));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return (
    <main className={styles.main}>
      <h1>Artigos sobre Cinema e Cultura Pop</h1>
      <div className={styles.articles}>
        {articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          !loading && <p>Nenhum artigo disponível.</p>
        )}
      </div>

      {loading && <p>Carregando página {page}...</p>}
      {!hasMore && <p>Não há mais artigos para carregar.</p>}
    </main>
  );
}