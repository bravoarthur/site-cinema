export interface Movie {
  id: string;
  title: string;
  directors: string[];
  actors: string[];
  categories: string[];
  iconic_quotes: { quote: string; character: string; explanation: string }[];
  iconic_scenes: { image_url: string; character: string; explanation: string }[];
  why_watch: string;
  review_title: string;
  review_subtitle: string;
  review_text_beginning: string;
  review_text_middle: string;
  review_text_end: string;
  image_url: string;
  review_image_1: string;
  review_image_2: string;
  site_rating: number;
  user_rating?: number;
  view_count: number;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  name?: string; // Adicionado para compatibilidade com a tabela categories
}

export interface Quote {
  id: string;
  movie_id: string;
  quote: string;
  character: string;
  category: string;
  explanation: string;
  movies?: { title: string };
  movie_title?: string;
}

export interface Scene {
  id: string;
  movie_id: string;
  image_url: string;
  character: string;
  category: string;
  explanation: string;
  movies?: { title: string };
  movie_title?: string;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string; // Adicionado para o formulário
  image_url?: string;
  author: string;
  content: string;
  created_at: string;
}

export interface Comment {
  id: string;
  movie_id?: string;
  article_id?: string;
  content: string;
  created_at: string;
}