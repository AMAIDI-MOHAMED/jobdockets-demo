import { InternshipContext } from "@/context";
import { useContext } from "react";

export const useInternship = () => {
    return useContext(InternshipContext);
};