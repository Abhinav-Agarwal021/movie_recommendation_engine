import React, { useState, useEffect } from 'react'
import { Loader } from "../../Shared Components/Loader/Loader"

export const Rooms = (props) => {
    const [loading, setLoading] = useState(false)

    if (loading) return <Loader message="Loading! please wait....." />
    return (
        <h1>Hello</h1>
    )
}
