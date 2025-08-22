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
    <Swiper
      spaceBetween={20}
      slidesPerView={2} // Valor padrão para telas >1600px
      breakpoints={{
        // ≤480px
        480: {
          slidesPerView: 2,
          spaceBetween: 25,
        },
        // ≤768px
        768: {
          slidesPerView: 2,
          spaceBetween: 25,
        },
        // ≤900px
        900: {
          slidesPerView: 3,
          spaceBetween: 15,
        },
        // 1024
        1024: {
          slidesPerView: 4,
          spaceBetween: 15,
        },
        // ≤1300px
        1300: {
          slidesPerView: 5,
          spaceBetween: 15,
        },
        // ≤1600px
        1600: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
      }}
      className={styles.carousel}
    >
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