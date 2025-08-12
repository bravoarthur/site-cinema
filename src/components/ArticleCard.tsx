import Link from 'next/link';
import Image from 'next/image';
import { Article } from '../types';
import styles from '../styles/ArticleCard.module.scss';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.id}`}>
      <div className={styles.card}>
        {article.image_url && (
          <Image
            src={article.image_url}
            alt={article.title}
            width={200}
            height={150}
            className={styles.image}
          />
        )}
        <h3 className={styles.title}>{article.title}</h3>
        <p className={styles.description}>{article.author}</p>
      </div>
    </Link>
  );
}