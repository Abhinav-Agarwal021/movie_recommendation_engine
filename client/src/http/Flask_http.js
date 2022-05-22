import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
    },
})

//get data of all trending movies
export const getTrending = () => api.get('/api/trending')

//get data of all movies in the dataset
export const getAllmovies = () => api.get('/api/all_movies')
export const getAlldirectors = () => api.get('/api/all_directors')
export const getAllcharaceters = () => api.get('/api/all_cast')
export const getAllgenres = () => api.get('/api/all_genre')

//recommending movies
export const recommend = (data) => api.post('/api/recommend', data)
export const recommendDirector = (data) => api.post('/api/recommendDirector', data)
export const recommendCast = (data) => api.post('/api/recommendCast', data)
export const recommendGenres = (data) => api.post('/api/recommendGenres', data)

//get a specific movie description
export const movieDesc = (data) => api.post('/api/movieDesc', data)

export default api;