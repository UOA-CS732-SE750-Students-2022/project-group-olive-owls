//Author - Syed Kazmi
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useGet(url,setLoad, initialState = null) {
    const tokenStr = '1234567890'
    const [data, setData] = useState(initialState);
    const [isLoading, setLoading] = useState(false);
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const response = await axios.get(url, { headers: {"Authorization" : `Bearer ${tokenStr}`} });
            setData(response.data);
            setLoading(false);
        }
        fetchData();
    }, [url,setLoad]);

    return { data, isLoading };
}