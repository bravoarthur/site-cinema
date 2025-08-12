'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Movie } from '../types';
import styles from '../styles/MovieCardSmall.module.scss';

interface MovieCardSmallProps {
  movie: Movie;
}

export default function MovieCardSmall({ movie }: MovieCardSmallProps) {
  return (
    <Link href={`/movies/${movie.id}`} aria-label={`Ver detalhes de ${movie.title}`}>
      <div className={styles.card}>
        <Image
          src={movie.image_url}
          alt={movie.title}
          width={150}
          height={225}
          className={styles.image}
          onError={(e) => {
            e.currentTarget.src =
              'https://pjmibswpovxofdxqdmvy.supabase.co/storage/v1/object/public/movie-images/interstellar.jpg';
          }}
        />
        <h3 className={styles.title}>{movie.title}</h3>
        <p className={styles.rating}>Nota: {movie.site_rating}/10</p>
      </div>
    </Link>
  );
}