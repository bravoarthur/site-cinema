'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Comment, UserRating } from '../types';
import styles from '../styles/CommentSection.module.scss';

interface CommentSectionProps {
  movieId?: string;
  articleId?: string;
}

export default function CommentSection({ movieId, articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState<number | ''>('');

  const fetchComments = useCallback(async () => {
    let query = supabase.from('comments').select('*');
    if (movieId) query = query.eq('movie_id', movieId);
    if (articleId) query = query.eq('article_id', articleId);
    const { data, error } = await query;
    if (error) console.error('Erro ao buscar comentários:', error.message);
    setComments(data || []);
  }, [movieId, articleId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment || !authorName) {
      alert('Comentário e nome do autor são obrigatórios');
      return;
    }
    if (rating !== '' && (rating < 0 || rating > 10)) {
      alert('A nota deve estar entre 0 e 10');
      return;
    }

    try {
      // Inserir comentário
      const commentData: Partial<Comment> = {
        content: newComment,
        author_name: authorName,
      };
      if (movieId) commentData.movie_id = movieId;
      if (articleId) commentData.article_id = articleId;

      const { data: commentDataResult, error: commentError } = await supabase
        .from('comments')
        .insert([commentData])
        .select();
      if (commentError) {
        console.error('Erro ao inserir comentário:', commentError.message);
        alert(`Erro: ${commentError.message}`);
        return;
      }

      // Inserir nota, se fornecida
      if (rating !== '' && movieId) {
        const ratingData: Partial<UserRating> = {
          movie_id: movieId,
          rating: Number(rating),
        };
        const { error: ratingError } = await supabase.from('user_ratings').insert([ratingData]);
        if (ratingError) {
          console.error('Erro ao inserir nota:', ratingError.message);
          alert(`Erro: ${ratingError.message}`);
          return;
        }
      }

      if (commentDataResult) {
        setComments([...comments, commentDataResult[0]]);
        setNewComment('');
        setAuthorName('');
        setRating('');
        await fetchComments();
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      alert('Erro inesperado ao enviar comentário ou nota.');
    }
  }

  return (
    <div className={styles.commentSection}>
      <h2>Comentários</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Seu nome"
          required
          className={styles.authorInput}
        />
        <input
          type="number"
          step="0.1"
          min="0"
          max="10"          
          value={rating}
          onChange={(e) => setRating(e.target.value ? parseFloat(Number(e.target.value).toFixed(1)) : '')}
          placeholder="Nota (0-10, opcional)"
          className={styles.userRating}
        />
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escreva seu comentário..."
          required
        />
        <button type="submit">Enviar</button>
      </form>
      <div className={styles.comments}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <p>
                <strong>{comment.author_name}</strong>: {comment.content}
              </p>
              <span className={styles.commentDate}>{new Date(comment.created_at).toLocaleDateString('pt-BR')}</span>
            </div>
          ))
        ) : (
          <p>Nenhum comentário disponível.</p>
        )}
      </div>
    </div>
  );
}