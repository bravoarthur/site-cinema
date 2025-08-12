import Link from 'next/link';
import { Category } from '../types';
import styles from '../styles/CategoryCard.module.scss';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/search?category=${category.title}`}>
      <div className={styles.card}>
        <h3>{category.title}</h3>
        <p>{category.description}</p>
      </div>
    </Link>
  );
}