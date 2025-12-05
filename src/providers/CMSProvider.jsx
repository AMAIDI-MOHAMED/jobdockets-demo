import { CMSContext } from "@/context";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const CMSProvider = ({ children }) => {

    const axiosPublic = useAxiosPublic();

    // COURSE BANNER
    const { data: CourseBanner, isLoading: CourseBannerLoading } = useQuery({
        queryKey: ["CourseBanner"],
        queryFn: async () => {
            const res = await axiosPublic.get('/cms/home_page/banner_section')
            return res?.data?.data?.banner_section;
        }
    })

    // Internship banner 
    const { data: InternshipBanner, isLoading: InternshipBannerLoading } = useQuery({
        queryKey: ["InternshipBanner"],
        queryFn: async () => {
            const res = await axiosPublic.get('/cms/home_page/internship_section')
            return res?.data?.data?.internship_section;
        }
    })

    // Internship section text 

    const { data: InternshipSectionText, isLoading: InternshipSectionTextLoading } = useQuery({
        queryKey: ["InternshipSectionText"],
        queryFn: async () => {
            const res = await axiosPublic.get('/cms/home_page/internship_volunteer_section')
            return res?.data?.data?.internship_volunteer_section;
        }
    })

    // Rate section text 

    const { data: RateSectionText, isLoading: RateSectionTextLoading } = useQuery({
        queryKey: ["RateSectionText"],
        queryFn: async () => {
            const res = await axiosPublic.get('/cms/home_page/rate_section')
            return res?.data?.data?.rate_section;
        }
    })

    // Rate section info card 
    const { data: RateSectionInfoCard, isLoading: RateSectionInfoCardLoading } = useQuery({
        queryKey: ["RateSectionInfoCard"],
        queryFn: async () => {
            const res = await axiosPublic.get('/know-the-rates')
            return res?.data?.data;
        }
    })

    // Footer section info 
    const { data: FooterSectionInfo, isLoading: FooterSectionInfoLoading } = useQuery({
        queryKey: ["FooterSectionInfo"],
        queryFn: async () => {
            const res = await axiosPublic.get('/cms/home_page/footer_section')
            return res?.data?.data?.footer_section;
        }
    })

    // Privacy policy 
    const { data: PrivacyPolicy, isLoading: PrivacyPolicyLoading } = useQuery({
        queryKey: ["PrivacyPolicy"],
        queryFn: async () => {
            const res = await axiosPublic.get('/dynamic-page?slug=privacy-policy')
            return res?.data?.data;
        }
    })

    // console.log("PrivacyPolicy ", PrivacyPolicy);

    return (
        <CMSContext.Provider value={{ CourseBanner, CourseBannerLoading, InternshipBanner, InternshipBannerLoading, InternshipSectionText, InternshipSectionTextLoading, RateSectionText, RateSectionTextLoading, RateSectionInfoCard, RateSectionInfoCardLoading, FooterSectionInfo, FooterSectionInfoLoading, PrivacyPolicy, PrivacyPolicyLoading }}>
            {children}
        </CMSContext.Provider>
    )

};

export default CMSProvider;
