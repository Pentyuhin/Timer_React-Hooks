import React, { useState, useEffect } from 'react';
import classes from './Timer.module.css'


interface Time {
    hours: number;
    minutes: number;
    seconds: number;
}

export const  Timer = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [time, setTime] = useState<Time>({ hours: 0, minutes: 0, seconds: 0 });
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value;
        setInputValue(inputVal);
    };

    const convertToTime = (val: string): Time => {
        const totalSeconds = parseInt(val);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return { hours, minutes, seconds };
    };

    const handleStart = () => {
        const newTime = convertToTime(inputValue);
        if(inputValue){
            setTime(newTime);
            setErrorMessage("")
        } else {
            setErrorMessage("Please Enter a number...")
        }
    };

    const handleStop = () => {
        clearInterval(intervalId as NodeJS.Timeout);
        setTime({ hours: 0, minutes: 0, seconds: 0 });
        setInputValue('');
    };

    const handlePause = () => {
        clearInterval(intervalId as NodeJS.Timeout);
    };

    useEffect(() => {
        if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
            clearInterval(intervalId as NodeJS.Timeout);
        } else {
            setIntervalId(setInterval(() => tick(), 1000));
        }
        return () => clearInterval(intervalId as NodeJS.Timeout);
    }, [time]);

    const tick = () => {
        if (time.seconds > 0) {
            setTime((prevState) => ({ ...prevState, seconds: prevState.seconds - 1 }));
        } else if (time.minutes > 0) {
            setTime((prevState) => ({
                ...prevState,
                minutes: prevState.minutes - 1,
                seconds: 59,
            }));
        } else if (time.hours > 0) {
            setTime((prevState) => ({
                ...prevState,
                hours: prevState.hours - 1,
                minutes: 59,
                seconds: 59,
            }));
        }
    };

    const formatTime = (time: Time) => {
        return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}:${time.seconds
            .toString()
            .padStart(2, '0')}`;
    };

    return (
        <div className={classes.mainBlock}>
            <h1>Timer</h1>
            <div className={classes.timeDisplay}>{formatTime(time)}</div>
            <span className={classes.error}>{errorMessage}</span>
            <div className={classes.inputTime}>
                <input type="number" placeholder="Enter the time in milliseconds..." value={inputValue} onChange={handleInputChange} />
                <div className={classes.buttonBlock}>
                    <button className={classes.bntStart} onClick={handleStart}>Старт</button>
                    <button className={classes.bntPause} onClick={handlePause}>Пауза</button>
                    <button className={classes.bntStop} onClick={handleStop}>Стоп</button>
                </div>
            </div>
        </div>
    );
}

