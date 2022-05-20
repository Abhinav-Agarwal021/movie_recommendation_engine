from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import json
import pickle
import pandas as pd
import requests

app = Flask(__name__)

cors = CORS(app)
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


@app.route('/')
def index():
    return ('Hey!!')


@app.route('/recommend', methods=["POST"])
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


if __name__ == "__main__":
    app.run(debug=True)
