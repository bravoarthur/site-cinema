'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import SceneCard from '../../components/SceneCard';
import { Scene } from '../../types';
import styles from '../../styles/Scenes.module.scss';

export default function Scenes() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase.from('scenes').select('category');
    const uniqueCategories = Array.from(new Set(data?.map((item: { category: string }) => item.category) || []));
    setCategories(uniqueCategories);
  }, []);

  const fetchScenes = useCallback(async () => {
    let query = supabase
      .from('scenes')
      .select('*, movies!inner(title)')
      .range((page - 1) * 10, page * 10 - 1);

    if (selectedCategory) {
      query = query.eq('category', selectedCategory);
    }

    const { data } = await query;
    setScenes((prev) => (page === 1 ? (data as Scene[]) || [] : [...prev, ...((data as Scene[]) || [])]));
  }, [page, selectedCategory]);

  useEffect(() => {
    fetchCategories();
    fetchScenes();
  }, [fetchCategories, fetchScenes]);

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
      <h1 className={styles.scenePageTitle}>Cenas Icônicas de Filmes</h1>
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
      <div className={styles.scenes}>
        {scenes.length > 0 ? (
          scenes.map((scene) => (
            <SceneCard
              key={scene.id}
              scene={{ ...scene, movie_title: scene.movies?.title || 'Desconhecido' }}
            />
          ))
        ) : (
          <p>Nenhuma cena encontrada.</p>
        )}
      </div>
    </main>
  );
}