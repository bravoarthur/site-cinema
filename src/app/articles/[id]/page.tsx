import { supabase } from '../../../lib/supabase';
import CommentSection from '../../../components/CommentSection';
import styles from '../../../styles/Article.module.scss';
import Image from 'next/image';

interface ArticlePageProps {
  params: { id: string };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', params.id)
    .single();

  return (
    <main className={styles.main}>
      <h1>{article.title}</h1>
      {article.image_url && (
        <Image
          src={article.image_url}
          alt={article.title}
          width={600}
          height={400}
          className={styles.image}
        />
      )}
      <p className={styles.author}>Por {article.author}</p>
      <div className={styles.content}>{article.content}</div>
      <CommentSection articleId={article.id} />
    </main>
  );
}