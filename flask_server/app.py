from flask import Flask, request
from flask_cors import CORS, cross_origin
import json
import pickle
import numpy as np
from surprise import Reader, Dataset, SVD
from surprise.model_selection import cross_validate
import pandas as pd
import requests

app = Flask(__name__)

cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
app.config['CORS_HEADERS'] = 'Content-Type'

movie_list = pickle.load(open('hybrid_list.pkl', 'rb'))
movies = pd.DataFrame(movie_list)
index_list = pickle.load(open('indices.pkl', 'rb'))
indics = pd.DataFrame([index_list])
index_map_list = pickle.load(open('indices_map.pkl', 'rb'))
indices_map = pd.DataFrame(index_map_list)
total_movie_list = pickle.load(open('movie_dict.pkl', 'rb'))
tmovies = pd.DataFrame(total_movie_list)
rating_list = pickle.load(open('ratings.pkl', 'rb'))
rating = pd.DataFrame(rating_list)
genre_list = pickle.load(open('genre_data.pkl', 'rb'))
gen_smd = pd.DataFrame(genre_list)
cast_list = pickle.load(open('cast_data.pkl', 'rb'))
cast_smd = pd.DataFrame(cast_list)

cosine_sim = pickle.load((open('similarity.pkl', 'rb')))

reader = Reader()
data = Dataset.load_from_df(rating[['userId', 'movieId', 'rating']], reader)
svd = SVD()
cross_validate(svd, data, measures=['RMSE', 'MAE'], cv=10, verbose=True)
trainset = data.build_full_trainset()
svd.fit(trainset)


def fetch_poster(id):
    response = requests.get(
        'https://api.themoviedb.org/3/movie/{}?api_key=b9ec5e8b8967e08b92c6c78bb89768dd'.format(id))
    data = response.json()
    if data['poster_path']:
        return "https://image.tmdb.org/t/p/original"+data['poster_path']
    else:
        return ""


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
    # user = data['userId']
    user = 1
    idx = indics[movie]
    sim_scores = list(enumerate(cosine_sim[int(idx)]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:26]
    movie_indices = [i[0] for i in sim_scores]

    movies = tmovies.iloc[movie_indices][[
        'title', 'vote_count', 'vote_average', 'year', 'id']]
    movies['est'] = movies['id'].apply(lambda x: svd.predict(
        user, indices_map.loc[x]['movieId']).est)
    movies = movies.sort_values('est', ascending=False)
    recommended_movies = []
    counter = 0
    for i in range(len(movies)):
        if counter != 10:
            recommended_movies.append(
                (movies.iloc[i].title, fetch_poster(movies.iloc[i].id)))
            counter += 1
    rmovies = json.dumps(recommended_movies)
    return rmovies


# @app.route('/api/recommendCast', methods=["POST"])
# @cross_origin()
# def recommendUsingCast():
#     percentile_check = 0.10
#     data = request.get_json()
#     cast = data["cast"]
#     dfs = cast_smd[cast_smd['cast'] == cast]
#     vote_count = dfs[dfs['vote_count'].notnull()]['vote_count'].astype('int')
#     vote_average = dfs[dfs['vote_average'].notnull()
#                        ]['vote_average'].astype('int')
#     C = vote_average.mean()
#     m = vote_count.quantile(percentile_check)

#     qualified_data = dfs[(dfs['vote_count'] >= m) & (dfs['vote_count'].notnull()) & (
#         dfs['vote_average'].notnull())][['title', 'year', 'vote_count', 'vote_average', 'popularity']]
#     qualified_data['vote_count'] = qualified_data['vote_count'].astype('int')
#     qualified_data['vote_average'] = qualified_data['vote_average'].astype(
#         'int')

#     qualified_data['wr'] = qualified_data.apply(lambda x: (
#         x['vote_count']/(x['vote_count']+m) * x['vote_average']) + (m/(m+x['vote_count']) * C), axis=1)
#     qualified_data = qualified_data.sort_values('wr', ascending=False)
#     qualified_data.shape()

#     counter = 0
#     recommended_movies = []

#     for i in range(len(qualified_data)):
#         if counter != 10:
#             recommended_movies.append(
#                 (qualified_data.iloc[i].title))
#             counter += 1
#     rmovies = json.dumps(recommended_movies)
#     return rmovies


@app.route('/api/recommendGenres', methods=["POST"])
@cross_origin()
def recommendUsingGenre():
    percentile = 0.85
    data = request.get_json()
    genre = data["genre"]
    df = gen_smd[gen_smd['genre'] == genre]
    vote_counts = df[df['vote_count'].notnull()]['vote_count'].astype('int')
    vote_averages = df[df['vote_average'].notnull()
                       ]['vote_average'].astype('int')
    C = vote_averages.mean()
    m = vote_counts.quantile(percentile)

    qualified = df[(df['vote_count'] >= m) & (df['vote_count'].notnull()) & (
        df['vote_average'].notnull())][['title', 'year', 'vote_count', 'vote_average', 'popularity', 'id']]
    qualified['vote_count'] = qualified['vote_count'].astype('int')
    qualified['vote_average'] = qualified['vote_average'].astype('int')

    qualified['wr'] = qualified.apply(lambda x: (
        x['vote_count']/(x['vote_count']+m) * x['vote_average']) + (m/(m+x['vote_count']) * C), axis=1)
    qualified = qualified.sort_values('wr', ascending=False)

    counter = 0
    recommended_movies = []

    for i in range(len(qualified)):
        if counter != 10:
            recommended_movies.append(
                (qualified.iloc[i].title, fetch_poster(qualified.iloc[i].id)))
            counter += 1
    rmovies = json.dumps(recommended_movies)
    return rmovies


@app.route('/api/trending', methods=["GET"])
@cross_origin()
def trending():
    movie_list = tmovies.sort_values('popularity', ascending=False)
    counter = 0
    trending_movies = []
    for i in range(len(movie_list)):
        if counter != 10:
            movie_id = (movie_list.iloc[i].id)
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
    movie_det = tmovies[tmovies['title'] == movie].iloc[0].id
    return fetch_data(movie_det)


@app.route('/api/all_movies', methods=["GET"])
@cross_origin()
def allMovies():
    all_movies = []
    for i in range(len(tmovies)):
        all_movies.append(tmovies.iloc[i].title)
    rmovies = json.dumps(all_movies)
    return rmovies


@app.route('/api/all_genre', methods=["GET"])
@cross_origin()
def allGenre():
    genre = []
    for i in gen_smd['genre']:
        genre.append(i)
    genre = list(dict.fromkeys(genre))
    l = [x for x in genre if ~np.isnan(x)]
    rmovies = json.dumps(l)
    return rmovies


if __name__ == "__main__":
    app.run(debug=True)
