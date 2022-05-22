from flask import Flask, request
from flask_cors import CORS, cross_origin
import json
import pickle
import pandas as pd
import requests

app = Flask(__name__)

cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
app.config['CORS_HEADERS'] = 'Content-Type'

movies_list = pickle.load((open('movies_dict.pkl', 'rb')))
movies = pd.DataFrame(movies_list)
original_movies_list = pickle.load((open('movies_original_dict.pkl', 'rb')))
movies_data = pd.DataFrame(original_movies_list)

cosine_sim = pickle.load((open('similarity.pkl', 'rb')))


def fetch_poster(id):
    response = requests.get(
        'https://api.themoviedb.org/3/movie/{}?api_key=b9ec5e8b8967e08b92c6c78bb89768dd'.format(id))
    data = response.json()
    return "https://image.tmdb.org/t/p/original"+data['poster_path']


def fetch_data(id):
    response = requests.get(
        'https://api.themoviedb.org/3/movie/{}?api_key=b9ec5e8b8967e08b92c6c78bb89768dd'.format(id))
    data = response.json()
    return data


@app.route('/api/')
def index():
    return ('Hey!!')


@app.route('/api/recommend', methods=["POST"])
@cross_origin()
def recommend():
    data = request.get_json()
    movie = data["movie"]
    movie_index = movies[movies['title'] == movie].index[0]
    distances = cosine_sim[movie_index]
    movie_list = sorted(list(enumerate(distances)),
                        reverse=True, key=lambda x: x[1])[1:11]

    recommended_movies = []
    for i in movie_list:
        movie_id = (movies.iloc[i[0]].movie_id)
        recommended_movies.append(
            (movies.iloc[i[0]].title, fetch_poster(movie_id)))
    rmovies = json.dumps(recommended_movies)
    return rmovies


@app.route('/api/recommendDirector', methods=["POST"])
@cross_origin()
def recommendUsingDirectors():
    data = request.get_json()
    Director = data["Director"]
    Director = Director.replace(" ", "")
    movie_list = movies.sort_values('score', ascending=False)
    director_list = list(enumerate(movie_list['crew']))

    recommended_movies = []

    for i in director_list:
        if Director in i[1]:
            movie_id = (movie_list.iloc[i[0]].movie_id)
            recommended_movies.append(
                (movie_list.iloc[i[0]].title, fetch_poster(movie_id)))
    rmovies = json.dumps(recommended_movies)
    return rmovies


@app.route('/api/recommendCast', methods=["POST"])
@cross_origin()
def recommendUsingCast():
    data = request.get_json()
    character = data["character"]
    character = character.replace(" ", "")
    movie_list = movies.sort_values('score', ascending=False)
    actors_list = list(enumerate(movie_list['cast']))

    recommended_movies = []

    for i in actors_list:
        if character in i[1]:
            movie_id = (movie_list.iloc[i[0]].movie_id)
            recommended_movies.append(
                (movie_list.iloc[i[0]].title, fetch_poster(movie_id)))
    rmovies = json.dumps(recommended_movies)
    return rmovies


@app.route('/api/recommendGenres', methods=["POST"])
@cross_origin()
def recommendUsingGenre():
    data = request.get_json()
    genre = data["genre"]
    genre = genre.replace(" ", "")
    movie_list = movies.sort_values('score', ascending=False)
    genres_list = list(enumerate(movie_list['genres']))

    counter = 0
    recommended_movies = []

    for i in genres_list:
        if genre in i[1]:
            if counter != 10:
                movie_id = (movie_list.iloc[i[0]].movie_id)
                recommended_movies.append(
                    (movie_list.iloc[i[0]].title, fetch_poster(movie_id)))
                counter += 1
    rmovies = json.dumps(recommended_movies)
    return rmovies


@app.route('/api/trending', methods=["GET"])
@cross_origin()
def trending():
    movie_list = movies.sort_values('popularity', ascending=False)
    counter = 0
    trending_movies = []
    for i in range(len(movie_list)):
        if counter != 10:
            movie_id = (movie_list.iloc[i].movie_id)
            trending_movies.append(
                (movie_list.iloc[i].title, fetch_poster(movie_id)))
            counter += 1
    rmovies = json.dumps(trending_movies)
    return rmovies


@app.route('/api/movieDesc', methods=["POST"])
@cross_origin()
def getMovieDesc():
    data = request.get_json()
    movie = data["movie"]
    movie_det = movies_data[movies_data['title'] == movie].iloc[0].movie_id
    return fetch_data(movie_det)


@app.route('/api/all_movies', methods=["GET"])
@cross_origin()
def allMovies():
    all_movies = []
    for i in range(len(movies)):
        all_movies.append(movies.iloc[i].title)
    rmovies = json.dumps(all_movies)
    return rmovies


@app.route('/api/all_directors', methods=["GET"])
@cross_origin()
def allDirectors():
    directors = []
    for i in movies_data['crew']:
        for j in i:
            directors.append(j)
    directors = list(dict.fromkeys(directors))
    rmovies = json.dumps(directors)
    return rmovies


@app.route('/api/all_cast', methods=["GET"])
@cross_origin()
def allCharacters():
    actors = []
    for i in movies_data['cast']:
        for j in i:
            actors.append(j)
    actors = list(dict.fromkeys(actors))
    rmovies = json.dumps(actors)
    return rmovies


@app.route('/api/all_genre', methods=["GET"])
@cross_origin()
def allGenre():
    genre = []
    for i in movies_data['genres']:
        for j in i:
            genre.append(j)
    genre = list(dict.fromkeys(genre))
    rmovies = json.dumps(genre)
    return rmovies


if __name__ == "__main__":
    app.run(debug=True)
