import Link from 'next/link';
import { Quote } from '../types';
import styles from '../styles/QuoteCard.module.scss';
import QuotationIcon from './QuotationIcon';
import QuotationIconInverted from './QuotationIconInverted';

interface QuoteCardProps {
  quote: Quote;
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <Link className={styles.linkBox} href={`/movies/${quote.movie_id}`}>
      <div className={styles.card}>
        <div className={styles.quoteBox}>
            <section className={styles.quote}>
                <QuotationIcon className={styles.quoteIcon}/>
                    {quote.quote}
                <QuotationIconInverted className={styles.quoteIcon}/>
            </section>
            <p className={styles.author}>{quote.character} - {quote.movie_title}</p>
        </div>
        <p className={styles.description}>{quote.explanation}</p>
      </div>
    </Link>
  );
}