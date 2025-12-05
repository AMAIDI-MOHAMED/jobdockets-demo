import { CMSContext } from "@/context";
import { useContext } from "react";

export const useCMS = () => {
  return useContext(CMSContext);
};