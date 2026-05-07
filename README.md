# CineLog

A [progressive web app](https://w3stu.cs.jmu.edu/eyasumm/cinelog) for discovering, tracking, and reviewing movies and TV shows. Browse trending titles, search the full IMDB catalog, keep a personal library of what you've watched, and build a watchlist for what's next.

<img src="https://i.ibb.co/zWMm41Pb/91de6074-5700-45a9-bf3a-5da08d4dc8a4.png" width="48%" />
<img src="https://i.ibb.co/MDw5GXtC/114a378c-896d-4b3a-b1ba-346262e05f4e.png" width="48%" />
<img src="https://i.ibb.co/NdVWNqRm/75b65453-06ab-428f-a70b-6e883d3c9a78.png" width="48%" />
<img src="https://i.ibb.co/zWz90vPv/7dfcada4-6fed-4940-8409-1dc190a9bd07.png" width="48%" />


## Features

- **Browse** trending and popular movies and TV shows on the home page
- **Search** the full IMDB catalog in real time
- **5-star rating system**
- **Reviews** with timestamps and per-review delete
- **Library** — Save titles you've seen, with ratings and reviews
- **Watchlist** — Queue up titles to watch later
- **Responsive design** - Compatibility with both desktop and mobile devices
- **Dark / light theme** - Toggle with persistence
- **Multiple-language support** - English, Spanish, French, German, Japanese
- **Installable PWA** — Add to home screen on mobile or desktop

## Tech Stack

- **HTML5 / CSS3 / Vanilla JavaScript**
- **Bootstrap 5.3.3** - responsive layout and components
- **TMDB API v3** - all movie and TV data
- **localStorage** - persists library, watchlist, ratings, reviews, theme, and language
- **PWA** - web app manifest and service worker for installability

## Project Structure

```
cinelog/
├── index.html            # Home page
├── search/index.html     # Search page
├── library/index.html    # Library page
├── watchlist/index.html  # Watchlist page
├── title/
│   ├── index.html        # Title detail page
│   └── title.css         # Detail page styles
├── JS/
│   ├── api.js            # TMDB API calls
│   ├── home.js           # Home page logic
│   ├── search.js         # Search page logic
│   ├── title.js          # Title page logic
│   ├── library.js        # Library page logic
│   ├── watchlist.js      # Watchlist page logic
│   ├── storage.js        # Persistence helpers
│   ├── language.js       # Multiple language support
│   ├── theme.js          # Dark/light theme toggle
│   └── content.json      # Content in different translations
└── public/
    ├── styles.css         # Global styles
    ├── manifest.json      # PWA manifest
    ├── service-worker.js  # Service worker
    ├── icon-192.png       # App icon
    └── icon-512.png       # App icon (large)
```

## Claims

### Basic (B1–B12)

- [x] Created/updated README.md that briefly describes the project
- [x] Landing/home page
- [x] Navigation menu that links to all major sections
- [x] At least 3 distinct pages/views
- [x] Consistent page layout structure across the application
- [x] Integrated with a chosen third-party API (TMDB) and successfully retrieved data
- [x] Implemented localStorage or OPFS to save and retrieve user data
- [x] At least one form of user interaction (button clicks, form input, etc.)
- [x] Dynamic content that changes based on API data or user input
- [x] Proper semantic HTML5 elements throughout
- [x] Custom CSS styling beyond browser defaults
- [x] Responsive design that works on mobile devices
- [x] Basic accessibility features (alt text, proper headings, sufficient color contrast)

### Intermediate (I13–I29)

- [x] I13: Error handling for API failures with user-friendly messages
- [x] I14: Loading indicators during API requests
- [x] I15: Search or filter functionality for displayed data
- [x] I21: User preference settings that persist in localStorage
- [x] I22: Interactive elements with hover/focus states
- [x] I23: Favorite/bookmark functionality with localStorage persistence
- [x] I25: Integrated multiple API endpoints or different data sources
- [x] I29: Comprehensive alt text and ARIA labels for complex UI elements

### Advanced (S30–S45)

- [x] S38: Created a progressive web app (PWA) with installability
- [x] S42: Internationalization support
