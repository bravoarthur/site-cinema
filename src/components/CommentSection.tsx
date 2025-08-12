'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Comment } from '../types';
import styles from '../styles/CommentSection.module.scss';

interface CommentSectionProps {
  movieId?: string;
  articleId?: string;
}

export default function CommentSection({ movieId, articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  const fetchComments = useCallback(async () => {
    let query = supabase.from('comments').select('*');
    if (movieId) query = query.eq('movie_id', movieId);
    if (articleId) query = query.eq('article_id', articleId);
    const { data } = await query;
    setComments(data || []);
  }, [movieId, articleId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment) return;

    const commentData: Partial<Comment> = {
      content: newComment,
      movie_id: movieId,
      article_id: articleId,
    };

    const { data } = await supabase.from('comments').insert([commentData]).select();
    if (data) setComments([...comments, data[0]]);
    setNewComment('');
  }

  return (
    <div className={styles.commentSection}>
      <h2>Comentários</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escreva seu comentário..."
        />
        <button type="submit">Enviar</button>
      </form>
      <div className={styles.comments}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <p>{comment.content}</p>
              <span>{new Date(comment.created_at).toLocaleDateString('pt-BR')}</span>
            </div>
          ))
        ) : (
          <p>Nenhum comentário disponível.</p>
        )}
      </div>
    </div>
  );
}