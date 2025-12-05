import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "@/hooks/useAxiosPublic";

export const useDynamicPage = (slug) => {
    const axiosPublic = useAxiosPublic();
    
    const { data, isLoading, error } = useQuery({
        queryKey: ["dynamicPage", slug],
        queryFn: async () => {
            if (!slug) return null;
            const res = await axiosPublic.get(`/dynamic-page?slug=${slug}`);
            return res?.data?.data;
        },
        enabled: !!slug, // Only run query if slug is provided
    });

    return {
        pageData: data,
        isLoading,
        error,
    };
};