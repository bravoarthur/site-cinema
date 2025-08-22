import { supabase } from '../lib/supabase';
import Carousel from '../components/Carousel';
import MovieCardLarge from '../components/MovieCardLarge';
import { Movie, Article } from '../types';
import styles from '../styles/Home.module.scss';

interface HomeProps {
  featuredMovie: Movie | null;
  topRated: Movie[];
  hiddenGems: Movie[];
  articles: Article[];
  userFavorites: Movie[];
}

async function fetchHomeData(): Promise<HomeProps> {
  const { data: featuredMovie } = await supabase
    .from('movies')
    .select('*')
    .order('view_count', { ascending: false })
    .limit(1)
    .single();

  const { data: topRated } = await supabase
    .from('movies')
    .select('*')
    .order('site_rating', { ascending: false })
    .limit(6);

  const { data: hiddenGems } = await supabase
    .from('movies')
    .select('*')
    .contains('categories', ['unknown'])
    .limit(6);

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6);

  const { data: userFavorites } = await supabase
    .from('movies')
    .select('*')
    .order('user_rating', { ascending: false })
    .limit(6);

  // Place the return statement here
  return {
    featuredMovie: featuredMovie || null,
    topRated: topRated || [],
    hiddenGems: hiddenGems || [],
    articles: articles || [],
    userFavorites: userFavorites || [],
  };
}

export default async function Home() {
  const { featuredMovie, topRated, hiddenGems, articles, userFavorites } = await fetchHomeData();

  return (
    <main className={styles.main}>
      <h1 className={styles.titleH1}>Bem-vindo ao site que seleciona apenas filmes que prestam</h1>

      <section className={styles.sectionBox}>
        <h2 className={styles.titleH2}>Filme da Semana</h2>
        {featuredMovie ? (
          <MovieCardLarge movie={featuredMovie} />
        ) : (
          <p>Nenhum filme em destaque disponível.</p>
        )}
      </section>

      <section className={styles.sectionBox}>
        <h2 className={styles.titleH2}>Nossas Melhores Notas</h2>
        {topRated.length > 0 ? (
          <Carousel items={topRated} type="movie" />
        ) : (
          <p>Nenhum filme com alta nota disponível.</p>
        )}
      </section>

      <section className={styles.sectionBox}>
        <h2 className={styles.titleH2}>Conheça Esses Filmes</h2>
        {hiddenGems.length > 0 ? (
          <Carousel items={hiddenGems} type="movie" />
        ) : (
          <p>Nenhum filme desconhecido disponível.</p>
        )}
      </section>

      <section className={styles.sectionBox}>
        <h2 className={styles.titleH2}>Artigos sobre Cinema</h2>
        {articles.length > 0 ? (
          <Carousel items={articles} type="article" />
        ) : (
          <p>Nenhum artigo disponível.</p>
        )}
      </section>

      <section className={styles.sectionBox}>
        <h2 className={styles.titleH2}>Preferidos de Vocês</h2>
        {userFavorites.length > 0 ? (
          <Carousel items={userFavorites} type="movie" />
        ) : (
          <p>Nenhum filme favorito disponível.</p>
        )}
      </section>
    </main>
  );
}