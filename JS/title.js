const params = new URLSearchParams(window.location.search);
const mediaType = params.get('media_type');
const contentId = params.get('id');
const contentKey = `${mediaType}_${contentId}`;

const RATING_LABELS = ['Not rated', 'Poor', 'Fair', 'Good', 'Great', 'Masterpiece'];
let currentRating = 0;
let titleData = null;

async function loadContent() {
  if (!contentId || !mediaType) {
    showContentError('No content specified.');
    return;
  }

  try {
    const content = await fetchTitle(contentId, mediaType);
    renderContent(content);
    setupButtons(content);
    setupRatingAndReviews();
  } catch (err) {
    showContentError('Failed to load content. Please try again later.');
  }
}

function renderContent(c) {
  document.title = c.title;

  if (c.backdropUrl) {
    document.getElementById('heroBackdrop').style.backgroundImage = `url('${c.backdropUrl}')`;
  }

  const poster = document.getElementById('moviePoster');
  poster.src = c.posterUrl || '';
  poster.alt = `${c.title} poster`;

  document.getElementById('movieTitle').textContent = c.title;

  document.getElementById('movieMeta').innerHTML = `
    <span>${c.year}</span>
    <span>·</span>
    <span>${c.runtime}</span>
    <span>·</span>
    <span>${c.certification}</span>
  `;

  document.getElementById('movieGenres').innerHTML = c.genres
    .map(g => `<span class="badge badge-genre fw-normal rounded-pill px-3 py-1">${g}</span>`)
    .join('');

  document.getElementById('statScore').textContent = c.voteAverage;

  const votes = c.voteCount >= 1000
    ? `${(c.voteCount / 1000).toFixed(1)}K`
    : String(c.voteCount);
  document.getElementById('statVotes').textContent = votes;

  document.getElementById('statRevenue').textContent = c.isTV ? '—' : c.revenue;

  document.getElementById('movieOverview').textContent = c.overview;

  const directorLabel = c.isTV ? 'Creator' : 'Director';
  document.getElementById('detailsList').innerHTML = `
    <dt class="col-5 text-secondary fw-normal">${directorLabel}</dt>
    <dd class="col-7">${c.director}</dd>
    ${!c.isTV ? `<dt class="col-5 text-secondary fw-normal">Writers</dt><dd class="col-7">${c.writers}</dd>` : ''}
    <dt class="col-5 text-secondary fw-normal">Studio</dt>
    <dd class="col-7">${c.studio}</dd>
    <dt class="col-5 text-secondary fw-normal">Release Date</dt>
    <dd class="col-7">${c.releaseDate}</dd>
    <dt class="col-5 text-secondary fw-normal">Language</dt>
    <dd class="col-7">${c.language}</dd>
    ${!c.isTV ? `<dt class="col-5 text-secondary fw-normal">Budget</dt><dd class="col-7">${c.budget}</dd>` : ''}
  `;

  document.getElementById('castList').innerHTML = c.cast.map(member => `
    <div class="cast-item d-flex flex-column align-items-center text-center gap-1">
      ${member.photoUrl
        ? `<img src="${member.photoUrl}" alt="${member.name}" class="cast-thumb rounded-circle object-fit-cover">`
        : `<div class="cast-thumb rounded-circle d-flex align-items-center justify-content-center" style="font-size:1.5rem;">
             <i class="bi bi-person"></i>
           </div>`}
      <span class="text-body fw-medium">${member.name}</span>
      <span class="text-body-secondary">${member.character}</span>
    </div>
  `).join('');
}

function setupButtons(c) {
  titleData = {
    id: Number(contentId),
    title: c.title,
    poster: c.posterUrl,
    media_type: mediaType,
    year: c.year,
    overview: c.overview
  };

  updateButtonStates(titleData);

  document.getElementById('btnLibrary').addEventListener('click', () => {
    const inLibrary = getLibraryMovies().some(m => m.id === titleData.id);
    if (inLibrary) {
      removeMovieFromLibrary(titleData.id);
      clearRatingAndReviews();
    } else {
      addMovieToLibrary(titleData);
      removeMovieFromWatchlist(titleData.id);
    }
    updateButtonStates(titleData);
  });

  document.getElementById('btnWatchlist').addEventListener('click', () => {
    const inWatchlist = getWatchlistMovies().some(m => m.id === titleData.id);
    if (inWatchlist) {
      removeMovieFromWatchlist(titleData.id);
    } else {
      addMovieToWatchlist(titleData);
      removeMovieFromLibrary(titleData.id);
      clearRatingAndReviews();
    }
    updateButtonStates(titleData);
  });
}

function updateButtonStates(titleData) {
  const inLibrary = getLibraryMovies().some(m => m.id === titleData.id);
  const inWatchlist = getWatchlistMovies().some(m => m.id === titleData.id);

  const btnLibrary = document.getElementById('btnLibrary');
  const btnWatchlist = document.getElementById('btnWatchlist');

  btnLibrary.classList.toggle('active', inLibrary);
  btnLibrary.querySelector('i').className = inLibrary ? 'bi bi-collection-fill' : 'bi bi-collection';

  btnWatchlist.classList.toggle('active', inWatchlist);
  btnWatchlist.querySelector('i').className = inWatchlist ? 'bi bi-bookmark-fill' : 'bi bi-bookmark';
}

function setupRatingAndReviews() {
  currentRating = getRating(contentKey);
  renderStars(currentRating);

  document.getElementById('clearRatingBtn').addEventListener('click', () => {
    currentRating = 0;
    setRating(contentKey, 0);
    renderStars(0);
  });

  document.querySelectorAll('.star-btn').forEach(star => {
    const n = Number(star.dataset.star);

    star.addEventListener('mouseenter', () => renderStars(currentRating, n));
    star.addEventListener('mouseleave', () => renderStars(currentRating));

    star.addEventListener('click', () => {
      currentRating = currentRating === n ? 0 : n;
      setRating(contentKey, currentRating);
      renderStars(currentRating);
      if (currentRating > 0) addToLibrary();
    });

    star.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        currentRating = currentRating === n ? 0 : n;
        setRating(contentKey, currentRating);
        renderStars(currentRating);
        if (currentRating > 0) addToLibrary();
      }
    });
  });

  renderReviews();

  document.getElementById('submitReview').addEventListener('click', () => {
    const input = document.getElementById('reviewInput');
    const text = input.value.trim();
    if (!text) return;
    addReview(contentKey, text);
    input.value = '';
    renderReviews();
    addToLibrary();
  });
}

function renderStars(filled, hovered = 0) {
  const stars = document.querySelectorAll('.star-btn');
  const ratingLabel = document.getElementById('ratingLabel');
  const clearRatingWrap = document.getElementById('clearRatingWrap');

  stars.forEach(star => {
    const n = Number(star.dataset.star);
    star.classList.toggle('filled', n <= filled);
    star.classList.toggle('hovered', hovered > 0 && n <= hovered);
    star.className = star.className.replace(/\bbi-star(?:-fill)?\b/g, '').trim();
    const isFilled = hovered > 0 ? n <= hovered : n <= filled;
    star.classList.add(isFilled ? 'bi-star-fill' : 'bi-star');
  });

  if (hovered > 0) {
    ratingLabel.textContent = RATING_LABELS[hovered];
  } else {
    ratingLabel.textContent = filled > 0 ? `${filled}/5 - ${RATING_LABELS[filled]}` : RATING_LABELS[0];
  }
  clearRatingWrap.style.display = filled > 0 ? '' : 'none';
}

function renderReviews() {
  const reviews = getReviews(contentKey);
  const list = document.getElementById('reviewsList');

  if (reviews.length === 0) {
    list.innerHTML = '<p class="text-secondary small">No reviews yet.</p>';
    return;
  }

  list.innerHTML = reviews.map(r => `
    <div class="review-item pt-3 mt-3">
      <div class="d-flex justify-content-between align-items-start gap-2 mb-1">
        <span class="small text-secondary">${r.date}</span>
        <button class="review-delete p-0 lh-1 border-0 bg-transparent" data-id="${r.id}" aria-label="Delete review">
          <i class="bi bi-x-lg" style="font-size:0.75rem;"></i>
        </button>
      </div>
      <p class="review-text small text-secondary lh-base mb-0">${escapeHtml(r.text)}</p>
    </div>
  `).join('');

  list.querySelectorAll('.review-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteReview(contentKey, Number(btn.dataset.id));
      renderReviews();
    });
  });
}

function addToLibrary() {
  if (!titleData) return;
  addMovieToLibrary(titleData);
  removeMovieFromWatchlist(titleData.id);
  updateButtonStates(titleData);
}

function clearRatingAndReviews() {
  const ratings = JSON.parse(localStorage.getItem('ratings') || '{}');
  delete ratings[contentKey];
  localStorage.setItem('ratings', JSON.stringify(ratings));

  const reviews = JSON.parse(localStorage.getItem('reviews') || '{}');
  delete reviews[contentKey];
  localStorage.setItem('reviews', JSON.stringify(reviews));

  currentRating = 0;
  renderStars(0);
  renderReviews();
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showContentError(message) {
  document.querySelector('main').innerHTML = `
    <div class="text-center py-5">
      <i class="bi bi-exclamation-circle fs-1 text-danger mb-3 d-block"></i>
      <p class="text-secondary">${message}</p>
    </div>
  `;
}

loadContent();
