import Link from 'next/link';
import Image from 'next/image';
import { Scene } from '../types';
import styles from '../styles/SceneCard.module.scss';

interface SceneCardProps {
  scene: Scene;
}

export default function SceneCard({ scene }: SceneCardProps) {
  return (
    <Link className={styles.linkScene} href={`/movies/${scene.movie_id}`}>
      <div className={styles.card}>
        <div className={styles.imageBox}>
            <Image
                src={scene.image_url}
                alt={scene.explanation}
                width={600}
                height={380}
                className={styles.image}
            />
        </div>
        <div className={styles.descriptionBox}>
            <p className={styles.characterMovie}>  
               {scene.character} - {scene.movie_title}
            </p>
            <p className={styles.sceneExplanation}>{scene.explanation}</p>
        </div>
      </div>
    </Link>
  );
}