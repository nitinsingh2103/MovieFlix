
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import joblib
import requests
import os

# Load environment variables
load_dotenv()

TMDB_API_KEY = os.getenv("TMDB_API_KEY")

app = FastAPI(title="Movie Recommendation API")

# React connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

movies = joblib.load(
    os.path.join(MODEL_DIR, "movies.pkl")
)

similarity = joblib.load(
    os.path.join(MODEL_DIR, "similarity.pkl")
)


class MovieRequest(BaseModel):
    movie: str


# Existing ML recommendation function
def recommend(movie_name):

    movie_name = movie_name.strip().lower()

    movie_indices = movies[
        movies["title"].str.lower() == movie_name
    ].index

    if len(movie_indices) == 0:
        return None

    movie_index = movie_indices[0]

    distances = similarity[movie_index]

    movie_list = sorted(
        enumerate(distances),
        reverse=True,
        key=lambda x: x[1]
    )[1:6]

    recommended_movies = []

    for item in movie_list:
        recommended_movies.append(
            movies.iloc[item[0]]["title"]
        )

    return recommended_movies


# Get poster and details from TMDB
def get_movie_details(movie_title):

    if not TMDB_API_KEY:
        return {
            "title": movie_title,
            "poster": None,
            "rating": None,
            "release_date": None,
            "overview": "Movie information unavailable."
        }

    url = "https://api.themoviedb.org/3/search/movie"

    params = {
        "api_key": TMDB_API_KEY,
        "query": movie_title,
        "include_adult": False
    }

    try:
        response = requests.get(
            url,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()
        results = data.get("results", [])

        if not results:
            return {
                "title": movie_title,
                "poster": None,
                "rating": None,
                "release_date": None,
                "overview": "No movie details found."
            }

        movie = results[0]

        poster_path = movie.get("poster_path")

        poster_url = (
            f"https://image.tmdb.org/t/p/w500{poster_path}"
            if poster_path else None
        )

        return {
            "title": movie_title,
            "poster": poster_url,
            "rating": movie.get("vote_average"),
            "release_date": movie.get("release_date"),
            "overview": movie.get("overview")
        }

    except requests.RequestException as error:
        print("TMDB error:", error)

        return {
            "title": movie_title,
            "poster": None,
            "rating": None,
            "release_date": None,
            "overview": "Movie details temporarily unavailable."
        }


@app.get("/")
def home():
    return {
        "message": "Movie Recommendation API is running!"
    }


@app.post("/recommend")
def get_recommendations(request: MovieRequest):

    result = recommend(request.movie)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Movie not found"
        )

    # Fetch details for all five recommended movies
    movie_details = [
        get_movie_details(title)
        for title in result
    ]

    return {
        "searched_movie": request.movie,
        "recommendations": movie_details
    }
