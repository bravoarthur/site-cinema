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
        <div className={styles.imageBox}>
            <Image
                src={scene.image_url}
                alt={scene.explanation}
                width={300}
                height={400}
                className={styles.image}
            />
            <p className={styles.characterMovie}>  
               {scene.character} - {scene.movie_title}
            </p>
        </div>
        <div className={styles.descriptionBox}>
            <p>{scene.explanation}</p>
        </div>
      </div>
    </Link>
  );
}