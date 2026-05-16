import { useQuery } from "@tanstack/react-query"
import { categoriesApi } from "../api/categoriesApi";

export const useCategories = () => {
    return useQuery({
        queryKey: ["user_categories"],
        queryFn: ()=>{ console.log('fetch in hook');
         categoriesApi.getUserCategories},
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};