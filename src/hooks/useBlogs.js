import { useState, useEffect } from 'react';
import useAxiosPublic from './useAxiosPublic';

const useBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const axiosPublic = useAxiosPublic();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                const response = await axiosPublic.get('/blogs');
                // Extract blogs from the nested data structure
                setBlogs(response.data.data || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError(err.message || 'Failed to fetch blogs');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []); // Remove axiosPublic from dependency array

    return { blogs, loading, error };
};

export default useBlogs; 