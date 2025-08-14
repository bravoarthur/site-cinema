'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Movie} from '../types';
import styles from '../styles/MovieCardReview.module.scss';

interface MovieCardLargeProps {
  movie: Movie;
}

export default function MovieCardReview({ movie }: MovieCardLargeProps) {
  
  return (
    <div className={styles.card}>
      <div className={styles.mainContent}>
        <div className={styles.imageContainer}>
          <Link href={`/movies/${movie.id}`} >
            <Image
                src={movie.image_url}
                alt={movie.title}
                width={300}
                height={450}
                className={styles.image}
                onError={(e) => {
                e.currentTarget.src =
                    'https://pjmibswpovxofdxqdmvy.supabase.co/storage/v1/object/public/movie-images/interstellar.jpg';
                }}
            />          
          </Link>
        </div>
        <div className={styles.textContainer}>
          <Link href={`/movies/${movie.id}`} className={styles.titleLink}>
            <h3 className={styles.title} aria-label={`Ver detalhes de ${movie.title}`}>
              {movie.title}
            </h3>
          </Link>
          {movie.review_subtitle && <p className={styles.subtitle}>{movie.review_subtitle}</p>}
          {movie.directors && (
            <p className={styles.directors}>
              Diretor{movie.directors.length > 1 ? 'es' : ''}: {''}
              {typeof movie.directors === 'string' ? (
                <Link href={`/search?query=${encodeURIComponent(movie.directors)}`} className={styles.link}>
                  {movie.directors}
                </Link>
              ) : (
                movie.directors.map((director, index) => (
                  <span key={index}>
                    <Link href={`/search?query=${encodeURIComponent(director)}`} className={styles.link}>
                      {director}
                    </Link>
                    {index < movie.directors.length - 1 ? ', ' : '.'}
                  </span>
                ))
              )}
            </p>
          )}
          {movie.actors && (
            <p className={styles.actors}>
              Ator{movie.actors.length > 1 ? 'es' : ''}: {''}
              {typeof movie.actors === 'string' ? (
                <Link href={`/search?query=${encodeURIComponent(movie.actors)}`} className={styles.link}>
                  {movie.actors}
                </Link>
              ) : (
                movie.actors.map((actor, index) => (
                  <span key={index}>
                    <Link href={`/search?query=${encodeURIComponent(actor)}`} className={styles.link}>
                      {actor}
                    </Link>
                    {index < movie.actors.length - 1 ? ', ' : '.'}
                  </span>
                ))
              )}
            </p>
          )}
          {movie.categories && (
            <p className={styles.categories}>
              Categorias:{' '}
              {movie.categories.map((category, index) => (
                <span key={index}>
                  <Link href={`/search?query=${encodeURIComponent(category)}`} className={styles.link}>
                    {category}
                  </Link>
                  {index < movie.categories.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          )}
          <p className={styles.rating}>Nota: {movie.site_rating}/10</p>
        </div>
      </div>     
      <div className={styles.moreInfoBox}>
        <div className={styles.moreInfoContent}>     
          <p className={styles.moreInfoTitle}>Ano de Lancamento: <span className={styles.moreInfoText}>{movie.year}</span></p>
          <p className={styles.moreInfoTitle}>Duracao: <span className={styles.moreInfoText}>{movie.duration} min</span></p>
          <p className={styles.moreInfoTitle}>Nota no IMDB: <span className={styles.moreInfoText}>{movie.imdb_rating}</span></p>  
           <p className={styles.moreInfoTitle}>Nota do Publico: <span className={styles.moreInfoText}>{Number(movie.user_rating).toFixed(1)}</span></p>  
        </div>
      </div> 
    </div>
  );
}