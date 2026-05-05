const API_KEY = '27fd29c9194d5b82dc85ffa94e9d5e3d';
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const PLACEHOLDER_IMAGE = '';

async function fetchTMDB(endpoint, params) {
  let url_params = new URLSearchParams(params);
  const url = `${API_URL}${endpoint}?api_key=${API_KEY}&${url_params.toString()}`;
  console.log(url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.results.map(movie => ({
    id: movie.id,
    title: movie.title || movie.name,
    media_type: movie.media_type || 'movie',
    year: movie.release_date ? movie.release_date.slice(0, 4) : 'N/A',
    poster: movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : PLACEHOLDER_IMAGE,
    overview: movie.overview
  }));
}

async function searchTMDB(query) {
  return fetchTMDB('/search/movie', {
    query: encodeURIComponent(query)
  });
}

async function fetchPopular() {
  return fetchTMDB('/movie/popular', { page: 1 });
}

async function fetchTrending() {
  return fetchTMDB('/trending/all/day', {});
}

function formatMoney(amount) {
  if (!amount) return '—';
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `$${Math.round(amount / 1e6)}M`;
  return `$${amount.toLocaleString()}`;
}

async function fetchTitle(id, media_type) {
  const appendTo = media_type === 'tv' ? 'credits,content_ratings' : 'credits,release_dates';
  const url = `${API_URL}/${media_type}/${id}?api_key=${API_KEY}&append_to_response=${appendTo}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const data = await response.json();

  const isTV = media_type === 'tv';
  const title = isTV ? data.name : data.title;
  const rawDate = isTV ? data.first_air_date : data.release_date;
  const year = rawDate ? rawDate.slice(0, 4) : '—';

  const runtimeMins = isTV ? (data.episode_run_time?.[0] ?? null) : (data.runtime ?? null);
  const runtime = runtimeMins
    ? (runtimeMins >= 60 ? `${Math.floor(runtimeMins / 60)}h ${runtimeMins % 60}m` : `${runtimeMins}m`)
    : '—';

  let certification = '—';
  if (isTV) {
    const us = data.content_ratings?.results?.find(r => r.iso_3166_1 === 'US');
    if (us) certification = us.rating;
  } else {
    const us = data.release_dates?.results?.find(r => r.iso_3166_1 === 'US');
    const cert = us?.release_dates?.find(r => r.certification)?.certification;
    if (cert) certification = cert;
  }

  const crew = data.credits?.crew ?? [];
  const directors = crew.filter(c => c.job === 'Director').map(c => c.name);
  const writers = [...new Set(
    crew.filter(c => ['Writer', 'Screenplay', 'Story'].includes(c.job)).map(c => c.name)
  )];
  const creators = (data.created_by ?? []).map(c => c.name);

  const releaseDate = rawDate
    ? new Date(rawDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  const langCode = data.original_language;
  const langObj = data.spoken_languages?.find(l => l.iso_639_1 === langCode);

  return {
    title,
    backdropUrl: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : '',
    posterUrl: data.poster_path ? `${IMAGE_BASE_URL}${data.poster_path}` : '',
    year,
    runtime,
    certification,
    genres: (data.genres ?? []).map(g => g.name),
    voteAverage: data.vote_average != null ? data.vote_average.toFixed(1) : '—',
    voteCount: data.vote_count ?? 0,
    revenue: formatMoney(data.revenue),
    budget: formatMoney(data.budget),
    overview: data.overview ?? '',
    director: isTV
      ? (creators.length ? creators.join(', ') : '—')
      : (directors.length ? directors.join(', ') : '—'),
    writers: writers.length ? writers.join(', ') : '—',
    studio: data.production_companies?.[0]?.name ?? '—',
    releaseDate,
    language: langObj?.english_name ?? langCode ?? '—',
    cast: (data.credits?.cast ?? []).slice(0, 8).map(c => ({
      name: c.name,
      character: c.character,
      photoUrl: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : ''
    
    })),
    isTV
  };
}