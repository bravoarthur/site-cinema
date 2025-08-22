import { supabase } from '../../lib/supabase';
import CategoryCard from '../../components/CategoryCard';
import styles from '../../styles/Categories.module.scss';

export default async function Categories() {
  const { data: categories } = await supabase.from('categories').select('*');

  return (
    <main className={styles.main}>
      <h1 className={styles.categoryPageTitle}>Categorias</h1>
      <div className={styles.grid}>
        {categories?.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </main>
  );
}