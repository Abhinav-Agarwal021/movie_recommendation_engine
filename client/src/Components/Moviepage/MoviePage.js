import React,{useState,useEffect} from 'react'
import styles from './MoviePage.module.css'

export const MoviePage = () => {

    useEffect(() => {
    }, [])
    

    var url = window.location.pathname;
    var result = url.split('/');
    var type = result[result.length - 2];
    var name = result[result.length - 1];

    return (
        <div className='container'>
            {type !== "Movie Name" &&
                <div className={styles.trending}>
                    <span className={styles.heading}>Recommended Movies</span>
                    <div className={styles.tr__movies}>
                        {/* {
                            trendingMovies?.map((movie, i) =>
                                <div key={i} className={styles.movie__desc}>
                                    <div className={styles.movie__name}> {movie[0]}</div>
                                    <img src={movie[1]} alt={movie[0]} />
                                </div>
                            )
                        } */}
                    </div>
                </div>
            }
        </div>
    )
}
