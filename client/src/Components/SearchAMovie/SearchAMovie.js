import React, { useState, useEffect } from 'react'
import styles from './SearchAMovie.module.css'
import Select, { createFilter } from 'react-select'
import { getAllcharaceters, getAlldirectors, getAllgenres, getAllmovies } from '../../http/Flask_http'
import { useHistory } from 'react-router-dom';

export const SearchAMovie = () => {

    const history = useHistory();

    const [type, setType] = useState()
    const [name, setName] = useState()
    const [moviesData, setMoviesData] = useState()
    const [directors, setDirectors] = useState()
    const [characters, setCharacters] = useState()
    const [genres, setGenres] = useState()

    useEffect(() => {
        const getmovies = async () => {
            const dat = await getAllmovies();
            setMoviesData(dat.data);
            const director = await getAlldirectors();
            setDirectors(director.data);
            const character = await getAllcharaceters();
            setCharacters(character.data);
            const genre = await getAllgenres();
            setGenres(genre.data);
        }
        getmovies()
    }, [])

    var movie_list = []
    moviesData?.forEach(movie => {
        movie_list.push({ label: movie, value: movie })
    });
    var director_list = []
    directors?.forEach(movie => {
        director_list.push({ label: movie, value: movie })
    });
    var character_list = []
    characters?.forEach(movie => {
        character_list.push({ label: movie, value: movie })
    });
    var genre_list = []
    genres?.forEach(movie => {
        genre_list.push({ label: movie, value: movie })
    });


    const handleType = (selectedOption) => {
        setType(selectedOption);
    }

    const handleName = (selectedOption) => {
        setName(selectedOption);
    }

    const handleRecommend = () => {
        history.push(`/movie/${type.value}/${name.value}`)
    }

    const customStyles = {
        menu: (provided, state) => ({
            ...provided,
            borderBottom: '1px dotted pink',
            color: 'white',
            padding: 10,
            background: "black"
        }),
        control: (provided, state) => ({
            ...provided,
            background: "black",
            borderColor: "none",
            color: "white",
        }),
        singleValue: base => ({
            ...base,
            color: "#fff"
        }),
        input: base => ({
            ...base,
            color: "#fff"
        }),
        option: (styles, { isFocused, isSelected }) => ({
            ...styles,
            background: isFocused
                ? 'hsla(291, 64%, 42%, 0.5)'
                : isSelected
                    ? 'hsla(291, 64%, 42%, 1)'
                    : undefined,
        }),
    }

    const [items] = useState([
        {
            label: "Genres",
            value: "Genres"
        },
        {
            label: "Movie Name",
            value: "Movie Name"
        },
        {
            label: "Director",
            value: "Director"
        },
        {
            label: "Movie Character",
            value: "Movie Character"
        },
    ])
    return (
        <div className="container">
            <div className={styles.search}>
                <span className={styles.heading}>Select a Type on which you want to search a movie</span>
                <Select onChange={handleType} styles={customStyles} autoFocus={true} className={styles.dropdown} options={items} />
                {type && <>
                    <span className={styles.heading}>Name you want to search by</span>
                    <Select filterOption={createFilter({ ignoreAccents: false })} onChange={handleName} styles={customStyles} autoFocus={true} className={styles.dropdown} options={type.value === "Genres" ? genre_list : type.value === "Movie Name" ? movie_list : type.value === "Director" ? director_list : character_list} />
                    <button onClick={handleRecommend} className={styles.startRoomButton}>
                        <span>Recommend</span>
                    </button>
                </>
                }
            </div>
        </div>
    )
}
