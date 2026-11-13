
import { useState } from "react";
import { Search, Clapperboard, Film, ArrowUpRight } from "lucide-react";
import "./App.css";


function App() {
  const [movie, setMovie] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const recommendMovies = async () => {
    if (!movie.trim()) {
      setError("Please enter a movie name.");
      return;
    }

    setLoading(true);
    setError("");
    setMovies([]);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/recommend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ movie: movie.trim() })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Movie not found");
      }

      setMovies(data.recommendations || []);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };





  
  return (
    <div className="app">

      <nav className="navbar">
        <div className="logo">
          <Clapperboard size={27} />
          <h2>MOVIE<span>FLIX</span></h2>
        </div>

        <a href="#home">Home</a>
        <a href="#recommendations">Discover</a>
      </nav>

      <section className="hero" id="home">

        <div className="hero-content">

          <div className="tagline">
            <span></span> YOUR PERSONAL MOVIE GUIDE
          </div>

          <h1>
            Find Your Next
            <span> Favourite Movies</span>
          </h1>

          <p>
            Discover amazing movies similar to your
            favourites. Just search, explore and enjoy.
          </p>

          <div className="search-box">
            <Search size={22} />

            <input
              type="text"
              placeholder="Enter movie name... e.g. Avatar"
              value={movie}
              onChange={(e) => setMovie(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") recommendMovies();
              }}
            />

            <button onClick={recommendMovies} disabled={loading}>
              {loading ? "Searching..." : "Recommend"}
            </button>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="features">
            <span> Machine Learning</span>
            <span>Smart Suggestions</span>
            <span>Instant Results</span>
          </div>

        </div>

      </section>

      <section className="recommendations" id="recommendations">

        <div className="section-heading">
          <div>
            <span className="small-heading">PICKED FOR YOU</span>
            <h2>Recommended <span>Movies</span></h2>
            <p>Movies you might love watching next.</p>
          </div>

          {movies.length > 0 && (
            <span className="count">{movies.length} MOVIES</span>
          )}
        </div>

        {loading && (
          <div className="message">
            <div className="loader"></div>
            <h3>Finding your movies...</h3>
          </div>
        )}

        {!loading && movies.length === 0 && (
          <div className="empty">
            <Film size={38}/>
            <h3>Your movie journey starts here</h3>
            <p>Search for a movie to get five recommendations.</p>
          </div>
        )}

        {!loading && movies.length > 0 && (
        
<div className="movie-grid">

  {movies.map((item, index) => (
    <div className="movie-card" key={item.title}>

      <div className={`poster poster-${index % 5}`}>

        {item.poster ? (
          <img
            src={item.poster}
            alt={item.title}
            className="movie-poster"
          />
        ) : (
          <div className="poster-fallback">
            <Film size={45} />
            <span>NO POSTER</span>
          </div>
        )}

        <span className="number">
          0{index + 1}
        </span>

      </div>

      <div className="movie-info">

        <div>
          <span>RECOMMENDED #{index + 1}</span>

          <h3>{item.title}</h3>

          <div className="movie-meta">
            {item.rating != null && (
              <span>★ {Number(item.rating).toFixed(1)}</span>
            )}

            {item.release_date && (
              <span>
                {item.release_date.slice(0, 4)}
              </span>
            )}
          </div>
        </div>

      </div>

      {item.overview && (
        <p className="movie-overview">
          {item.overview}
        </p>
      )}

    </div>
  ))}

</div>

        )}

      </section>

      <footer>
        <div className="logo">
          <Clapperboard size={22}/>
          <h2>MOVIE<span>FLIX</span></h2>
        </div>
        <p>Made with passion for movie lovers.</p>
      </footer>

    </div>
  );
}

export default App;
