# 🎬 MovieFlix – Movie Recommendation System

MovieFlix is a content-based movie recommendation system built using Machine Learning, Python, FastAPI and React. It recommends five similar movies based on the movie selected by the user.

The application also integrates with **The Movie Database (TMDB) API** to display movie posters, ratings, release dates and descriptions.

## 🚀 Features

- Content-based movie recommendation system.
- Recommends the top 5 similar movies.
- Movie selection through an interactive React interface.
- Movie posters and details fetched using TMDB API.
- FastAPI backend for ML model integration.
- Responsive and user-friendly interface.

## 🛠️ Tech Stack

## Machine Learning
- Python
- Pandas
- NumPy
- Scikit-learn
- CountVectorizer
- Cosine Similarity
- Joblib

## Backend
- FastAPI
- Uvicorn
- Pydantic
- Requests
- Python-dotenv

## Frontend
- React.js
- Vite
- JavaScript
- CSS
- Lucide React

## External API
- TMDB API

🧠 How the Recommendation System Works

MovieFlix uses a **Content-Based Filtering** approach.

1. **Data Collection:** Movie information is collected from the TMDB 5000 Movies dataset.
2. **Data Preprocessing:** Relevant movie information such as genres, keywords, overview, cast and crew is combined into a single text feature.
3. **Text Vectorization:** CountVectorizer converts movie text into numerical vectors.
4. **Similarity Calculation:** Cosine similarity calculates the similarity between movie vectors.
5. **Model Saving:** The processed movie dataframe and similarity matrix are saved using Joblib.
6. **Recommendation:** When a user selects a movie, the system finds the five most similar movies.
7. **Movie Details:** TMDB API fetches additional movie information, including posters, ratings and descriptions.


---

⭐ If you find this project interesting, consider giving it a star!
