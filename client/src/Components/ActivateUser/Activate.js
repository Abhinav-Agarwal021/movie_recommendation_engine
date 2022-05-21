import React, { useState } from 'react'
import { Name } from "../Steps/NameStep/Name"

const steps = {
    1: Name,
};

export const Activate = () => {

    const [step, setStep] = useState(1);
    const Step = steps[step];

    const onClick = () => {
        setStep(step + 1);
    }

    return (
        <Step onClick={onClick} />
    )
}
