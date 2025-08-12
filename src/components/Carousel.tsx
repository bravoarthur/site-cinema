'use client';
import { Movie, Article } from '../types';
import MovieCardSmall from './MovieCardSmall';
import ArticleCard from './ArticleCard';
import styles from '../styles/Carousel.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

interface CarouselProps {
  items: Movie[] | Article[];
  type: 'movie' | 'article';
}

export default function Carousel({ items, type }: CarouselProps) {
  return (
    <Swiper spaceBetween={20} slidesPerView={5}>
      {items.map((item) => (
        <SwiperSlide key={item.id} className={styles.carouselItem}>
          {type === 'movie' ? (
            <MovieCardSmall movie={item as Movie} />
          ) : (
            <ArticleCard article={item as Article} />
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}