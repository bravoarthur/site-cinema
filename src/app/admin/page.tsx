'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Movie, Quote, Scene, Article, Category } from '../../types';
import styles from '../../styles/Admin.module.scss';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [movies, setMovies] = useState<Pick<Movie, 'id' | 'title'>[]>([]);
  const [formDataMovie, setFormDataMovie] = useState<Partial<Movie>>({
    title: '',
    directors: [],
    actors: [],
    categories: [],
    iconic_quotes: [],
    iconic_scenes: [],
    why_watch: '',
    review_title: '',
    review_subtitle: '',
    review_text_beginning: '',
    review_text_middle: '',
    review_text_end: '',
    image_url: '',
    review_image_1: '',
    review_image_2: '',
    site_rating: 0,
    year: undefined,
    duration: undefined,
    imdb_rating: undefined,
  });
  const [formDataQuote, setFormDataQuote] = useState<Partial<Quote>>({
    movie_id: '',
    quote: '',
    character: '',
    category: '',
    explanation: '',
  });
  const [formDataScene, setFormDataScene] = useState<Partial<Scene>>({
    movie_id: '',
    image_url: '',
    character: '',
    category: '',
    explanation: '',
  });
  const [formDataArticle, setFormDataArticle] = useState<Partial<Article>>({
    title: '',
    subtitle: '',
    content: '',
    image_url: '',
    author: '',
  });
  const [formDataCategory, setFormDataCategory] = useState<Partial<Category>>({
    title: '',
    description: '',
  });
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
      const fetchMovies = async () => {
        const { data } = await supabase.from('movies').select('id, title') as { data: Pick<Movie, 'id' | 'title'>[] | null };
        setMovies(data || []);
      };
      fetchMovies();
    }
  }, [isAdmin]);

  async function handleMovieSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('movies').insert([formDataMovie]);
    if (!error) {
      alert('Filme adicionado com sucesso!');
      setFormDataMovie({
        title: '',
        directors: [],
        actors: [],
        categories: [],
        iconic_quotes: [],
        iconic_scenes: [],
        why_watch: '',
        review_title: '',
        review_subtitle: '',
        review_text_beginning: '',
        review_text_middle: '',
        review_text_end: '',
        image_url: '',
        review_image_1: '',
        review_image_2: '',
        site_rating: 0,
        year: undefined,
        duration: undefined,
        imdb_rating: undefined,
      });
    } else {
      alert('Erro ao adicionar filme: ' + error.message);
    }
  }

  async function handleQuoteSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('quotes').insert([formDataQuote]);
    if (!error) {
      alert('Frase adicionada com sucesso!');
      setFormDataQuote({ movie_id: '', quote: '', character: '', category: '', explanation: '' });
    } else {
      alert('Erro ao adicionar frase: ' + error.message);
    }
  }

  async function handleSceneSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('scenes').insert([formDataScene]);
    if (!error) {
      alert('Cena adicionada com sucesso!');
      setFormDataScene({ movie_id: '', image_url: '', character: '', category: '', explanation: '' });
    } else {
      alert('Erro ao adicionar cena: ' + error.message);
    }
  }

  async function handleArticleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('articles').insert([formDataArticle]);
    if (!error) {
      alert('Artigo adicionado com sucesso!');
      setFormDataArticle({ title: '', subtitle: '', content: '', image_url: '', author: '' });
    } else {
      alert('Erro ao adicionar artigo: ' + error.message);
    }
  }

  async function handleCategorySubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('categories').insert([formDataCategory]);
    if (!error) {
      alert('Categoria adicionada com sucesso!');
      setFormDataCategory({ title: '', description: '' });
    } else {
      alert('Erro ao adicionar categoria: ' + error.message);
    }
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <main className={styles.main}>
      <h1>Painel de Administração</h1>
      <Link href="/logout">Sair</Link>
      <Link href="/admin/delete">Ir para Exclusão</Link>
      <section>
        <h2>Adicionar Filme</h2>
        <form onSubmit={handleMovieSubmit} className={styles.form}>
          <div>
            <label>Título</label>
            <input
              type="text"
              value={formDataMovie.title}
              onChange={(e) => setFormDataMovie({ ...formDataMovie, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Diretores (separados por vírgula)</label>
            <input
              type="text"
              value={formDataMovie.directors?.join(',')}
              onChange={(e) => setFormDataMovie({ ...formDataMovie, directors: e.target.value.split(',').map(s => s.trim()) })}
              required
            />
          </div>
          <div>
            <label>Atores (separados por vírgula)</label>
            <input
              type="text"
              value={formDataMovie.actors?.join(',')}
              onChange={(e) => setFormDataMovie({ ...formDataMovie, actors: e.target.value.split(',').map(s => s.trim()) })}
              required
            />
          </div>
          <div>
            <label>Categorias (separadas por vírgula)</label>
            <input
              type="text"
              value={formDataMovie.categories?.join(',')}
              onChange={(e) => setFormDataMovie({ ...formDataMovie, categories: e.target.value.split(',').map(s => s.trim()) })}
              required
            />
          </div>
          <div>
            <label>
                Ano de Lancamento
            </label>
            <input
              type="number"
              value={formDataMovie.year || ''}
              onChange={(e) => setFormDataMovie({ ...formDataMovie, year: parseInt(e.target.value) })}
              placeholder="Ano de lançamento"
            />
          </div>
          <div>
            <label>
                Duracao
            </label>
            <input
              type="number"
              value={formDataMovie.duration || ''}
              onChange={(e) => setFormDataMovie({ ...formDataMovie, duration: parseInt(e.target.value) })}
              placeholder="Duração (minutos)"
            />
          </div>
          <div>
            <label>
                Nota no IMDB
            </label>
            <input
              type="number"
              step="0.1"
              value={formDataMovie.imdb_rating || ''}
              onChange={(e) => setFormDataMovie({ ...formDataMovie, imdb_rating: parseFloat(e.target.value) })}
              placeholder="Nota IMDb"
            />
          </div>
          <div>
            <label>Imagem Principal</label>
            <input
              type="text"
              value={formDataMovie.image_url}
              onChange={(e) => setFormDataMovie({ ...formDataMovie, image_url: e.target.value })}
            />
          </div>
          <div>
            <label>Nota do Site (0-10)</label>
            <input
              type="number"
              min="0"
              max="10"
              value={formDataMovie.site_rating}
              onChange={(e) => setFormDataMovie({ ...formDataMovie, site_rating: Number(e.target.value) })}
              required
            />
          </div>
          <div>
            <label>Por que Assistir</label>
            <textarea
              value={formDataMovie.why_watch}
              onChange={(e) => setFormDataMovie({ ...formDataMovie, why_watch: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Título da Crítica</label>
            <input
              type="text"
              value={formDataMovie.review_title}
              onChange={(e) => setFormDataMovie({ ...formDataMovie, review_title: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Subtítulo da Crítica</label>
            <input
              type="text"
              value={formDataMovie.review_subtitle}
              onChange={(e) => setFormDataMovie({ ...formDataMovie, review_subtitle: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Crítica (Início)</label>
            <textarea
              value={formDataMovie.review_text_beginning}
              onChange={(e) => setFormDataMovie({ ...formDataMovie, review_text_beginning: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Imagem 1 da Crítica</label>
            <input
              type="text"
              value={formDataMovie.review_image_1}
              onChange={(e) => setFormDataMovie({ ...formDataMovie, review_image_1: e.target.value })}
            />
          </div>
          <div>
            <label>Crítica (Meio)</label>
            <textarea
              value={formDataMovie.review_text_middle}
              onChange={(e) => setFormDataMovie({ ...formDataMovie, review_text_middle: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Imagem 2 da Crítica</label>
            <input
              type="text"
              value={formDataMovie.review_image_2}
              onChange={(e) => setFormDataMovie({ ...formDataMovie, review_image_2: e.target.value })}
            />
          </div>
          <div>
            <label>Crítica (Fim)</label>
            <textarea
              value={formDataMovie.review_text_end}
              onChange={(e) => setFormDataMovie({ ...formDataMovie, review_text_end: e.target.value })}
              required
            />
          </div>
          <button type="submit">Salvar Filme</button>
        </form>
      </section>
      <section>
        <h2>Adicionar Frase</h2>
        <form onSubmit={handleQuoteSubmit} className={styles.form}>
          <div>
            <label>Filme</label>
            <select
              value={formDataQuote.movie_id}
              onChange={(e) => setFormDataQuote({ ...formDataQuote, movie_id: e.target.value })}
              required
            >
              <option value="">Selecione um filme</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>{movie.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Frase</label>
            <input
              type="text"
              value={formDataQuote.quote}
              onChange={(e) => setFormDataQuote({ ...formDataQuote, quote: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Personagem</label>
            <input
              type="text"
              value={formDataQuote.character}
              onChange={(e) => setFormDataQuote({ ...formDataQuote, character: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Categoria</label>
            <input
              type="text"
              value={formDataQuote.category}
              onChange={(e) => setFormDataQuote({ ...formDataQuote, category: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Explicação</label>
            <textarea
              value={formDataQuote.explanation}
              onChange={(e) => setFormDataQuote({ ...formDataQuote, explanation: e.target.value })}
              required
            />
          </div>
          <button type="submit">Adicionar Frase</button>
        </form>
      </section>
      <section>
        <h2>Adicionar Cena</h2>
        <form onSubmit={handleSceneSubmit} className={styles.form}>
          <div>
            <label>Filme</label>
            <select
              value={formDataScene.movie_id}
              onChange={(e) => setFormDataScene({ ...formDataScene, movie_id: e.target.value })}
              required
            >
              <option value="">Selecione um filme</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>{movie.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label>URL da Imagem</label>
            <input
              type="text"
              value={formDataScene.image_url}
              onChange={(e) => setFormDataScene({ ...formDataScene, image_url: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Personagem</label>
            <input
              type="text"
              value={formDataScene.character}
              onChange={(e) => setFormDataScene({ ...formDataScene, character: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Categoria</label>
            <input
              type="text"
              value={formDataScene.category}
              onChange={(e) => setFormDataScene({ ...formDataScene, category: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Explicação</label>
            <textarea
              value={formDataScene.explanation}
              onChange={(e) => setFormDataScene({ ...formDataScene, explanation: e.target.value })}
              required
            />
          </div>
          <button type="submit">Adicionar Cena</button>
        </form>
      </section>
      <section>
        <h2>Adicionar Artigo</h2>
        <form onSubmit={handleArticleSubmit} className={styles.form}>
          <div>
            <label>Título</label>
            <input
              type="text"
              value={formDataArticle.title}
              onChange={(e) => setFormDataArticle({ ...formDataArticle, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Subtítulo</label>
            <input
              type="text"
              value={formDataArticle.subtitle}
              onChange={(e) => setFormDataArticle({ ...formDataArticle, subtitle: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Autor</label>
            <input
              type="text"
              value={formDataArticle.author}
              onChange={(e) => setFormDataArticle({ ...formDataArticle, author: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Conteúdo</label>
            <textarea
              value={formDataArticle.content}
              onChange={(e) => setFormDataArticle({ ...formDataArticle, content: e.target.value })}
              required
            />
          </div>
          <div>
            <label>URL da Imagem</label>
            <input
              type="text"
              value={formDataArticle.image_url}
              onChange={(e) => setFormDataArticle({ ...formDataArticle, image_url: e.target.value })}
            />
          </div>
          <button type="submit">Adicionar Artigo</button>
        </form>
      </section>
      <section>
        <h2>Adicionar Categoria</h2>
        <form onSubmit={handleCategorySubmit} className={styles.form}>
          <div>
            <label>Título</label>
            <input
              type="text"
              value={formDataCategory.title}
              onChange={(e) => setFormDataCategory({ ...formDataCategory, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Descrição</label>
            <textarea
              value={formDataCategory.description}
              onChange={(e) => setFormDataCategory({ ...formDataCategory, description: e.target.value })}
              required
            />
          </div>
          <button type="submit">Adicionar Categoria</button>
        </form>
      </section>
    </main>
  );
}