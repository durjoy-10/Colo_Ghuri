import { useState, useCallback } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const request = useCallback(async (config, showToast = true) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios(config);
            // Handle paginated response
            let responseData = response.data;
            if (responseData && typeof responseData === 'object') {
                if (responseData.results !== undefined) {
                    responseData = {
                        ...responseData,
                        results: responseData.results
                    };
                }
            }
            setData(responseData);
            if (showToast && config.method !== 'get') {
                toast.success('Operation completed successfully!');
            }
            return responseData;
        } catch (err) {
            const message = err.response?.data?.error || err.response?.data?.message || 'Something went wrong';
            setError(message);
            if (showToast) {
                toast.error(message);
            }
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const get = useCallback((url, params = {}, showToast = false) => 
        request({ method: 'GET', url, params }, showToast), [request]);

    const post = useCallback((url, data, showToast = true) => 
        request({ method: 'POST', url, data }, showToast), [request]);

    const put = useCallback((url, data, showToast = true) => 
        request({ method: 'PUT', url, data }, showToast), [request]);

    const patch = useCallback((url, data, showToast = true) => 
        request({ method: 'PATCH', url, data }, showToast), [request]);

    const del = useCallback((url, showToast = true) => 
        request({ method: 'DELETE', url }, showToast), [request]);

    return { loading, error, data, get, post, put, patch, delete: del };
};