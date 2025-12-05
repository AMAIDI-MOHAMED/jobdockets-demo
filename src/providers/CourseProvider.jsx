import { CMSContext, CourseContext } from "@/context";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const CourseProvider = ({ children }) => {

    const axiosPublic = useAxiosPublic();


    const { data: courses, isLoading: isCoursesLoading } = useQuery({
        queryKey: ["courses-home"],
        queryFn: async () => {
            const res = await axiosPublic.get("/courses", {
                params: {
                    per_page: 40,
                    sort_by: "created_at",
                    sort_direction: "desc"
                }
            });
            return res?.data?.data?.courses || [];
        }
    })

    // console.log("all courses", courses)


   
 


    return (
        <CourseContext.Provider value={{
            courses,
            isCoursesLoading
        }}>
            {children}
        </CourseContext.Provider>
    )

};

export default CourseProvider;
