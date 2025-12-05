import { CourseContext } from "@/context";
import { useContext } from "react";

export const useCourse = () => {
  return useContext(CourseContext);
};