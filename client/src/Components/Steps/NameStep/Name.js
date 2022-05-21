import React, { useState } from 'react'
import { Card } from '../../../Shared Components/Card/Card'
import { TextInput } from '../../../Shared Components/TextInput/TextInput'
import { Button } from '../../../Shared Components/Button/Button'
import styles from "./Name.module.css"
import { activateUser } from '../../../http/Http'
import { Loader } from "../../../Shared Components/Loader/Loader"
import { setAuth } from '../../../Store/AuthSlice'
import { useDispatch, useSelector } from "react-redux"
import { setFullName } from '../../../Store/userDetails'

export const Name = () => {

    const dispatch = useDispatch();
    const { fullName } = useSelector((state) => state.details)

    const [loading, setLoading] = useState(false)

    const [name, setName] = useState(fullName)

    const sendName = async () => {
        if (!name) {
            return;
        }
        dispatch(setFullName(name))
        setLoading(true)
        try {
            const { data } = await activateUser({ fullName: name });
            if (data.auth) {
                dispatch(setAuth(data))
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendName();
        }
    }

    if (loading) return <Loader message="Activation in progress....." />
    return (
        <div className={styles.cardWrapper}>
            <Card title="Enter a Username">
                <TextInput
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <div>
                    <div className={styles.actionButtonWrap}>
                        <Button text="Next" onClick={sendName} />
                    </div>
                </div>
            </Card>
        </div>
    )
}
