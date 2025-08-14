
import { supabase } from '../../../lib/supabase';
import MovieCardReview from '@/components/MovieCardReview';
import QuoteCard from '../../../components/QuoteCard';
import SceneCard from '../../../components/SceneCard';
import CommentSection from '../../../components/CommentSection';
import styles from '../../../styles/Movie.module.scss';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params; // Aguardar a resolução de params
  
  // Buscar filme
  const { data: movie, error: movieError } = await supabase
    .from('movies')
    .select('*')
    .eq('id', id)
    .single();

  if (movieError || !movie) {
    notFound(); // Redireciona para página 404 se o filme não for encontrado
  }

  // Buscar frases
  const { data: quotes, error: quotesError } = await supabase
    .from('quotes')
    .select('*')
    .eq('movie_id', id);

  if (quotesError) {
    console.error('Erro ao carregar frases:', quotesError.message);
  }

  // Buscar cenas  
  const { data: scenes, error: scenesError } = await supabase
    .from('scenes')
    .select('*')
    .eq('movie_id', id);

  if (scenesError) {
    console.error('Erro ao carregar cenas:', scenesError.message);
  }

  // Incrementar view_count
  const { error: updateError } = await supabase
    .from('movies')
    .update({ view_count: movie.view_count + 1 })
    .eq('id', id);

  if (updateError) {
    console.error('Erro ao atualizar view_count:', updateError.message);
  }

  return (
    <main className={styles.main}>
      <h1>Critica: {movie.review_title}</h1>
      
      <MovieCardReview movie={movie} />
     
      <section className={styles.criticaBox}>
        <h2>Por que Assistir</h2>
        <p>{movie.why_watch}</p>
      </section>

      <section className={styles.criticaBox}>
        <h2>Crítica</h2>
        <p>{movie.review_text_beginning}</p>
        <div className={styles.movieImageBox}>
            <Image
            src={movie.review_image_1}
            alt="Review Image 1"
            width={250}
            height={350}
            className={styles.movieImage}
            />
        </div>
        <p>{movie.review_text_middle}</p>
        <div className={styles.movieImageBox}>
            <Image
            src={movie.review_image_2}
            alt="Review Image 2"
            width={250}
            height={350}
            className={styles.movieImage}
            />
        </div>
        <p>{movie.review_text_end}</p>
      </section>

      <section className={styles.quotesScenesBox}>
        <h2>Frases Icônicas</h2>
        <div className={styles.cards}>
          {quotes && quotes.length > 0 ? (
            quotes.map((quote) => (
              <QuoteCard key={quote.id} quote={{ ...quote, movie_title: movie.title }} />
            ))
          ) : (
            <p>Nenhuma frase icônica encontrada.</p>
          )}
        </div>
      </section>

      <section className={styles.quotesScenesBox}>
        <h2>Cenas Icônicas</h2>
        <div className={styles.cards}>
          {scenes && scenes.length > 0 ? (
            scenes.map((scene) => (
              <SceneCard key={scene.id} scene={{ ...scene, movie_title: movie.title }} />
            ))
          ) : (
            <p>Nenhuma cena icônica encontrada.</p>
          )}
        </div>

      </section>

      <section className={styles.commentsBox}>
        <CommentSection movieId={movie.id} />
      </section>

    </main>
  );
}