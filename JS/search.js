const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const placeholderPoster = "";

searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();

  if (!query) {
    searchResults.innerHTML = "";
    return;
  }

  try {
    const movies = await searchMovies(query);
    searchResults.innerHTML = "";
    movies.slice(0, 5).forEach(movie => {
      const result = document.createElement("div");
      result.className = "search-result";

      const img = document.createElement("img");
      img.className = "search-result-thumb";
      img.src = movie.poster ?? placeholderPoster;
      img.alt = movie.title;

      const info = document.createElement("div");

      const title = document.createElement("div");
      title.className = "search-result-title";
      title.textContent = `${movie.title} (${movie.year})`;

      const addToLibrary = document.createElement("a");
      addToLibrary.href = "#";
      addToLibrary.className = "search-result-action";
      addToLibrary.textContent = "+ Add to Library";

      const addToWatchlist = document.createElement("a");
      addToWatchlist.href = "#";
      addToWatchlist.className = "search-result-action";
      addToWatchlist.textContent = "+ Add to Watchlist";

      info.append(title, addToLibrary, addToWatchlist);
      result.append(img, info);
      searchResults.appendChild(result);
    });
  } catch (err) {
    searchResults.innerHTML = "";
  }
});
