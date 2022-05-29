import React, { useState, useEffect } from 'react'
import { movieDesc, recommend, recommendCast, recommendDirector, recommendGenres } from '../../http/Flask_http'
import { Loader } from "../../Shared Components/Loader/Loader"
import { useHistory } from 'react-router-dom';
import { MdKeyboardBackspace } from "react-icons/md";
import { useSelector } from 'react-redux';
import styles from './MoviePage.module.css'

export const MoviePage = () => {

    const history = useHistory();

    const { user } = useSelector((state) => state.user);

    const [mname, setMname] = useState()
    const [mType, setMType] = useState()

    useEffect(() => {
        var url = window.location.pathname;
        var result = url.split('/');
        var type = result[result.length - 2];
        var name = result[result.length - 1];
        name = name.replace(/%20/g, " ");
        setMname(name);
        setMType(type);
    }, [])


    const [loading, setLoading] = useState(false)
    const [recommendedMovies, setRecommendedMovies] = useState()
    const [movieDes, setMovieDes] = useState()

    useEffect(() => {
        if (mType === "Genres") {
            const recommendMovies = async () => {
                setLoading(true);
                try {
                    const rmovies = await recommendGenres({ genre: mname })
                    setRecommendedMovies(rmovies.data)
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            }
            recommendMovies()
        }
        else if (mType === "Director") {
            const recommendMovies = async () => {
                setLoading(true);
                try {
                    const rmovies = await recommendDirector({ Director: mname })
                    setRecommendedMovies(rmovies.data)
                    console.log(mname)
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            }
            recommendMovies()
        }
        else if (mType === "MovieCharacter") {
            const recommendMovies = async () => {
                setLoading(true);
                try {
                    const rmovies = await recommendCast({ character: mname })
                    setRecommendedMovies(rmovies.data)
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            }
            recommendMovies()
        }
        else {
            const recommendMovies = async () => {
                setLoading(true);
                try {
                    const movieDet = await movieDesc({ movie: mname })
                    setMovieDes(movieDet.data)
                    const rmovies = await recommend({ movie: mname, userId: user.userId })
                    setRecommendedMovies(rmovies.data)
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            }
            recommendMovies()
        }
    }, [mType, mname, user])

    const handleBack = () => {
        history.goBack();
        window.location.reload();
    }

    const handleMovie = (movie) => {
        history.push(`/movie/MovieName/${movie}`)
        window.location.reload();
    }

    if (loading) return <Loader message="Loading! please wait....." />
    return (
        <div className='container'>
            {movieDes &&
                <div className={styles.movie__des}>
                    <img src={`https://image.tmdb.org/t/p/original${movieDes.poster_path}`} alt={movieDes.title} />
                    <div className={styles.description}>
                        <span className={styles.heading}>{movieDes.title}</span>
                        <div className={styles.gen__desc}>
                            <span className={styles.tag}>
                                <span className={styles.tags}>Overview: </span>
                                <span className={styles.tag}>{movieDes.overview}</span>
                            </span>
                            <span className={styles.tag}>
                                <span className={styles.tags}>Genres: </span>
                                {movieDes.genres.map((genre, idx) =>
                                    <span key={idx}>{genre.name},  </span>
                                )}
                            </span>
                            <span className={styles.tag}>
                                <span className={styles.tags}>Language: </span>
                                <span className={styles.tag}>{movieDes.original_language}</span>
                            </span>
                            <span className={styles.tag}>
                                <span className={styles.tags}>Release Date: </span>
                                <span className={styles.tag}>{movieDes.release_date}</span>
                            </span>
                            <span className={styles.tag}>
                                <span className={styles.tags}>Runtime: </span>
                                <span className={styles.tag}>{movieDes.runtime} min</span>
                            </span>
                        </div>
                    </div>
                </div>
            }
            <div className={styles.trending}>
                <div className={styles.left}>
                    <span className={styles.go__back} onClick={handleBack} >
                        <MdKeyboardBackspace className={styles.go__back__icon} />
                    </span>
                    <span className={styles.heading}>Recommended Movies</span>
                </div>
                <div className={styles.tr__movies}>
                    {
                        recommendedMovies?.map((movie, i) =>
                            <div key={i} className={styles.movie__desc} onClick={() => handleMovie(movie[0])}>
                                <div className={styles.movie__name}> {movie[0]}</div>
                                <img src={movie[1]} alt={movie[0]} />
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
