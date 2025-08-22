'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../lib/supabase';
import styles from '../styles/Header.module.scss';
import { User } from '@supabase/supabase-js';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Estado para o termo de busca

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?query=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleSearch();
    }
  };

  const showLogin = process.env.NODE_ENV === 'development' || window.location.pathname.includes('/admin')

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="Cinema Logo"
            width={320}
            height={120}
            className={styles.logo}
            priority
          />
        </Link>
        <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
          <Link href="/movies">Filmes (Críticas)</Link>
          <Link href="/articles">Artigos</Link>
          <Link href="/categories">Categorias</Link>
          <Link href="/quotes">Frases</Link>
          <Link href="/scenes">Cenas</Link>
          <div className={styles.searchContainer}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Buscar filmes..."
              className={styles.searchInput}
            />
            <button onClick={handleSearch} className={styles.searchButton}>
              <Image
                src="/images/search-icon.png" // Substitua por um ícone de lupa bonito (ex.: "magnifying-glass.png")
                alt="Buscar"
                width={25}
                height={25}
              />
            </button>
          </div>
        {user ? (
            <>
              <Link href="/admin">Admin</Link>
              <Link href="/logout">Sair</Link>
            </>
          ) : showLogin && (
            <Link href="/login">Login</Link>
          )}
        </nav>
        <button
          className={styles.hamburger}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>
    </header>
  );
}