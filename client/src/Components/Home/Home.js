import React from 'react'
import { useHistory } from "react-router-dom"

import { Card } from "../../Shared Components/Card/Card"
import { Button } from "../../Shared Components/Button/Button"

import styles from "./Home.module.css"

export const Home = () => {

    const history = useHistory();

    const startRegister = () => {
        history.push('/authenticate');
    }

    return (
        <div className={styles.cardWrapper}>
            <Card title="Welcome to Watch Prime">
                <p className={styles.text}>
                    spare your good time watching amazing movies and giving them reviews.
                </p>
                <div>
                    <Button onClick={startRegister} text="Let's get started" />
                </div>
            </Card>
        </div>
    )
}
