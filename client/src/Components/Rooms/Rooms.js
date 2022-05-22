import React, { useState, useEffect } from 'react'
import styles from "./Rooms.module.css"
import { MdKeyboardBackspace } from "react-icons/md";
import { getTrending } from '../../http/Flask_http'
import { Loader } from "../../Shared Components/Loader/Loader"

import { useHistory } from 'react-router-dom';

export const Rooms = (props) => {

    const history = useHistory();

    const [loading, setLoading] = useState(false)
    const [trendingMovies, setTrendingMovies] = useState([{}])

    useEffect(() => {
        const get_trending = async () => {
            setLoading(true);
            try {
                const data = await getTrending()
                setTrendingMovies(data.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        get_trending()
    }, [])

    const handleBack = () => {
        history.goBack();
    }

    const handleSearch = () => {
        history.push('/search')
    }


    if (loading) return <Loader message="Loading! please wait....." />
    return (
        <>
            <div className="container">
                <div className={styles.roomsHeader}>
                    <div className={styles.left}>
                        <span className={styles.go__back} onClick={handleBack} >
                            <MdKeyboardBackspace className={styles.go__back__icon} />
                        </span>
                        <span className={styles.heading}>
                            Movies
                        </span>
                    </div>
                    <div className={styles.right}>
                        <button className={styles.startRoomButton}>
                            <img
                                src="/images/search-icon.png"
                                alt="search"
                            />
                            <span onClick={handleSearch}>Search a movie</span>
                        </button>
                    </div>
                </div>

                <div className={styles.trending}>
                    <span className={styles.heading}>Trending Movies</span>
                    <div className={styles.tr__movies}>
                        {
                            trendingMovies?.map((movie, i) =>
                                <div key={i} className={styles.movie__desc}>
                                    <div className={styles.movie__name}> {movie[0]}</div>
                                    <img src={movie[1]} alt={movie[0]} />
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
