import { InternshipContext } from "@/context";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const InternshipProvider = ({ children }) => {

    const axiosPublic = useAxiosPublic();


    const { data: internships, isLoading: isInternshipsLoading } = useQuery({
        queryKey: ["internships"],
        queryFn: async () => {
            const res = await axiosPublic.get("/job-posts", {
                params: {
                    per_page: 40,
                    sort_by: "created_at",
                    sort_direction: "desc",
                },
            });
            return res?.data?.data?.jobs || [];
        }
    })

    // console.log("all jobs", internships)






    return (
        <InternshipContext.Provider value={{
            internships,
            isInternshipsLoading
        }}>
            {children}
        </InternshipContext.Provider>
    )

};

export default InternshipProvider;
