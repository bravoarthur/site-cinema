export async function fetchMoviePoster(title: string): Promise<string> {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(title)}`
  );
  const data = await res.json();
  return data.results[0]?.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`
    : '/images/placeholder.jpg';
}