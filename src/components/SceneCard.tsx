import Link from 'next/link';
import Image from 'next/image';
import { Scene } from '../types';
import styles from '../styles/SceneCard.module.scss';

interface SceneCardProps {
  scene: Scene;
}

export default function SceneCard({ scene }: SceneCardProps) {
  return (
    <Link href={`/movies/${scene.movie_id}`}>
      <div className={styles.card}>
        <Image
          src={scene.image_url}
          alt={scene.explanation}
          width={200}
          height={150}
          className={styles.image}
        />
        <p>{scene.character} - {scene.movie_title}</p>
        <p>{scene.explanation}</p>
      </div>
    </Link>
  );
}