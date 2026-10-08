import React from 'react'
import axios from "axios"
import { useState, useEffect } from 'react'

const Fib = () => {
    useEffect(() => {
        fetchValues();
        fetchIndexes();
    }, []);

    const [seenIndexes, setSeenIndexes] = useState([]);
    const [values, setValues] = useState({});
    const [index, setIndex] = useState('');

    const fetchValues = async () => {
        const response = await axios.get('/api/values/current');
        setValues(response.data);
    }

    const fetchIndexes = async () => {
        const response = await axios.get('/api/values/all');
        setSeenIndexes(response.data);
        // console.log(response.data);
    }

    const renderSeenIndexes = () => {
        return seenIndexes.map((obj) => obj.number).join(', ');
    }

    const renderCalculatedValues = () => {
        const entries = [];

        for (let key in values) {
            entries.push(
                <div key={key}>
                    For index {key}, the value is {values[key]}
                </div>
            )
        }

        return entries;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('/api/values', {
            index: index
        })

        setIndex('');
        fetchValues();
        fetchIndexes();
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter your index:</label>
                <input
                    value={index}
                    onChange={(e) => setIndex(e.target.value)}
                />
                <button>Submit</button>
            </form>

            <h3>Indexes I have seen:</h3>
            {renderSeenIndexes()}

            <h3>Calculated values:</h3>
            {renderCalculatedValues()}
        </div>
    )
}

export default Fib
