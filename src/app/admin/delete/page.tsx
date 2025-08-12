'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Movie, Quote, Scene, Article, Category } from '../../../types';
import styles from '../../../styles/Admin.module.scss';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

export default function Delete() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [movies, setMovies] = useState<Pick<Movie, 'id' | 'title'>[]>([]);
  const [quotes, setQuotes] = useState<Pick<Quote, 'id' | 'quote' | 'movie_id'>[]>([]);
  const [scenes, setScenes] = useState<Pick<Scene, 'id' | 'image_url' | 'movie_id'>[]>([]);
  const [articles, setArticles] = useState<Pick<Article, 'id' | 'title'>[]>([]);
  const [categories, setCategories] = useState<Pick<Category, 'id' | 'title'>[]>([]);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      if (profile?.is_admin) {
        setIsAdmin(true);
      } else {
        router.push('/');
      }
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    if (isAdmin) {
      const fetchData = async () => {
        const { data: moviesData } = await supabase.from('movies').select('id, title') as { data: Pick<Movie, 'id' | 'title'>[] | null };
        setMovies(moviesData || []);

        const { data: quotesData } = await supabase.from('quotes').select('id, quote, movie_id') as { data: Pick<Quote, 'id' | 'quote' | 'movie_id'>[] | null };
        setQuotes(quotesData || []);

        const { data: scenesData } = await supabase.from('scenes').select('id, image_url, movie_id') as { data: Pick<Scene, 'id' | 'image_url' | 'movie_id'>[] | null };
        setScenes(scenesData || []);

        const { data: articlesData } = await supabase.from('articles').select('id, title') as { data: Pick<Article, 'id' | 'title'>[] | null };
        setArticles(articlesData || []);

        const { data: categoriesData } = await supabase.from('categories').select('id, title') as { data: Pick<Category, 'id' | 'title'>[] | null };
        setCategories(categoriesData || []);
      };
      fetchData();
    }
  }, [isAdmin]);

  async function handleDeleteMovie(id: string) {
    const { error } = await supabase.from('movies').delete().eq('id', id);
    if (!error) {
      alert('Filme excluído com sucesso!');
      setMovies(movies.filter((movie) => movie.id !== id));
    } else {
      alert('Erro ao excluir filme: ' + error.message);
    }
  }

  async function handleDeleteQuote(id: string) {
    const { error } = await supabase.from('quotes').delete().eq('id', id);
    if (!error) {
      alert('Frase excluída com sucesso!');
      setQuotes(quotes.filter((quote) => quote.id !== id));
    } else {
      alert('Erro ao excluir frase: ' + error.message);
    }
  }

  async function handleDeleteScene(id: string) {
    const { error } = await supabase.from('scenes').delete().eq('id', id);
    if (!error) {
      alert('Cena excluída com sucesso!');
      setScenes(scenes.filter((scene) => scene.id !== id));
    } else {
      alert('Erro ao excluir cena: ' + error.message);
    }
  }

  async function handleDeleteArticle(id: string) {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (!error) {
      alert('Artigo excluído com sucesso!');
      setArticles(articles.filter((article) => article.id !== id));
    } else {
      alert('Erro ao excluir artigo: ' + error.message);
    }
  }

  async function handleDeleteCategory(id: string) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) {
      alert('Categoria excluída com sucesso!');
      setCategories(categories.filter((category) => category.id !== id));
    } else {
      alert('Erro ao excluir categoria: ' + error.message);
    }
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <main className={styles.main}>
      <h1>Painel de Exclusão</h1>
      <Link href="/admin">Voltar ao Painel de Administração</Link>
      <Link href="/logout">Sair</Link>

      <section>
        <h2>Excluir Filmes</h2>
        {movies.length === 0 ? (
          <p>Nenhum filme disponível.</p>
        ) : (
          <ul className={styles.form}>
            {movies.map((movie) => (
              <li key={movie.id}>
                {movie.title}
                <button onClick={() => handleDeleteMovie(movie.id)}>Excluir</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Excluir Frases</h2>
        {quotes.length === 0 ? (
          <p>Nenhuma frase disponível.</p>
        ) : (
          <ul className={styles.form}>
            {quotes.map((quote) => (
              <li key={quote.id}>
                {quote.quote} (Filme ID: {quote.movie_id})
                <button onClick={() => handleDeleteQuote(quote.id)}>Excluir</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Excluir Cenas</h2>
        {scenes.length === 0 ? (
          <p>Nenhuma cena disponível.</p>
        ) : (
          <ul className={styles.form}>
            {scenes.map((scene) => (
              <li key={scene.id}>
                {scene.image_url} (Filme ID: {scene.movie_id})
                <button onClick={() => handleDeleteScene(scene.id)}>Excluir</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Excluir Artigos</h2>
        {articles.length === 0 ? (
          <p>Nenhum artigo disponível.</p>
        ) : (
          <ul className={styles.form}>
            {articles.map((article) => (
              <li key={article.id}>
                {article.title}
                <button onClick={() => handleDeleteArticle(article.id)}>Excluir</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Excluir Categorias</h2>
        {categories.length === 0 ? (
          <p>Nenhuma categoria disponível.</p>
        ) : (
          <ul className={styles.form}>
            {categories.map((category) => (
              <li key={category.id}>
                {category.title}
                <button onClick={() => handleDeleteCategory(category.id)}>Excluir</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}