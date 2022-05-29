# movie_recommendation_engine

<img src="https://img.shields.io/badge/react%20-%2320232a.svg?&style=for-the-badge&logo=react&logoColor=%2361DAFB"/> <img src="https://img.shields.io/badge/express%20-%2320232a.svg?&style=for-the-badge&logo=express&logoColor=%2361DAFB"/> <img src="https://img.shields.io/badge/flask%20-%2320232a.svg?&style=for-the-badge&logo=flask&logoColor=%2361DAFB"/>

> A movie recommendation engine developed with react, express and flask.

## Features

Recommendation App has the following features:

- [x] Trending Movies.
- [x] Recommends movies using Hybrid Recommendation engine.

## Recommendation Engine WorkFlow

  The Hybrid recommendation engine has the following workflow:

  <strong> Input: </strong> User ID and title of the movie
  <br>
  <strong> Output: <strong> Similar movies sorted on the basis of expected ratings by that particular user.
  
## The Idea
  
  This Engine is made using both <em>Collaborative filtering</em> as well as <em>Content based Reommendation</em>.
  
  ### Collaborative Filtering
  
  >Collaborative Filtering is based on the idea that users similar to a me can be used to predict how much I will like a particular product or service those users have used/experienced but I have not. I will use the Surprise library that used extremely powerful algorithms like Singular Value Decomposition (SVD) to minimise RMSE (Root Mean Square Error) and give great recommendations.
  
  ### Content Based Recommendation
  
  >An engine that computes similarity between movies based on certain metrics and suggests movies that are most similar to a particular movie that a user liked. I will be using the Cosine Similarity to calculate a numeric quantity that denotes the similarity between two movies. I have used the TF-IDF Vectorizer, calculating the Dot Product will directly give us the Cosine Similarity Score. Therefore, I will use sklearn's linear_kernel instead of cosine_similarities since it is much faster.
  
  ### Trending Movies
  
  > Trending movies are returned on the bases of popularity of the movies which are in the top of the list in the dataset.
  
## Demo
<!--   
  - Homescreen:

![Homescreen](./Images/Homescreen.png "Homescreen") -->
