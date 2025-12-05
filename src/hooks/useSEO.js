import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "@/hooks/useAxiosPublic";

export const useSEO = (page) => {
    const axiosPublic = useAxiosPublic();
    
    const { data, isLoading, error } = useQuery({
        queryKey: ["seo", page],
        queryFn: async () => {
            if (!page) return null;
            const res = await axiosPublic.get(`/seo/${page}`);
            return res?.data?.data;
        },
        enabled: !!page, // Only run query if page is provided
    });

    return {
        seoData: data,
        isLoading,
        error,
    };
};

// Hook for getting SEO by specific page name
export const useSEOByPage = (pageName) => {
    const axiosPublic = useAxiosPublic();
    
    const { data, isLoading, error } = useQuery({
        queryKey: ["seoByPage", pageName],
        queryFn: async () => {
            if (!pageName) return null;
            const res = await axiosPublic.get(`/seo/page/${pageName}`);
            return res?.data?.data;
        },
        enabled: !!pageName,
    });

    return {
        seoData: data,
        isLoading,
        error,
    };
};

// Hook for getting all SEO data
export const useAllSEO = () => {
    const axiosPublic = useAxiosPublic();
    
    const { data, isLoading, error } = useQuery({
        queryKey: ["allSeo"],
        queryFn: async () => {
            const res = await axiosPublic.get('/seo/all');
            return res?.data?.data;
        },
    });

    return {
        allSeoData: data,
        isLoading,
        error,
    };
};