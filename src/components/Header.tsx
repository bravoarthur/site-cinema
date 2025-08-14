'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../lib/supabase';
import styles from '../styles/Header.module.scss';
import { User } from '@supabase/supabase-js'; // Importar tipo User

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null); // Alterar any para User | null

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
          <Link href="/search">
            <Image
              src="/images/search-icon.png"
              alt="Buscar"
              width={84}
              height={34}
              className={styles.searchIcon}
            />
          </Link>
          {user ? (
            <>
              <Link href="/admin">Admin</Link>
              <Link href="/logout">Sair</Link>
            </>
          ) : (
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